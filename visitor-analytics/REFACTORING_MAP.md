# Refactoring Map: Moving to All-Vercel

If you decide to refactor to deploy everything on Vercel, here's exactly what moves where.

## Summary

**Before:**
- `my-portfolio/` → Next.js frontend (Vercel)
- `visitor-analytics/` → Express backend (separate deployment)

**After:**
- `my-portfolio/` → Next.js frontend + backend (Vercel)
- `visitor-analytics/` → DELETE (absorbed into my-portfolio)

## File-by-File Migration

### 1. Backend Routes → Next.js API Routes

**FROM:** `visitor-analytics/backend/src/index.js`

```javascript
// Express route
app.post('/api/track', async (req, res) => {
  // tracking logic
  res.json({ success: true });
});
```

**TO:** `my-portfolio/app/api/track/route.ts`

```typescript
// Next.js API route
export async function POST(req: Request) {
  const body = await req.json();
  // tracking logic
  return Response.json({ success: true });
}
```

---

### 2. Database Logic → Vercel Postgres

**FROM:** `visitor-analytics/backend/src/db.js`

```javascript
import Database from 'better-sqlite3';
const db = new Database('analytics.db');

const statements = {
  insertVisitor: db.prepare(`INSERT INTO visitors (...) VALUES (...)`),
  findVisitor: db.prepare(`SELECT * FROM visitors WHERE id = ?`)
};
```

**TO:** `my-portfolio/lib/db.ts`

```typescript
import { sql } from '@vercel/postgres';

export async function insertVisitor(data: VisitorData) {
  const result = await sql`
    INSERT INTO visitors (fingerprint, ip_address, ...)
    VALUES (${data.fingerprint}, ${data.ip}, ...)
    RETURNING id
  `;
  return result.rows[0].id;
}

export async function findVisitor(fingerprint: string) {
  const result = await sql`
    SELECT * FROM visitors WHERE fingerprint = ${fingerprint}
  `;
  return result.rows[0];
}
```

**Changes:**
- SQLite → Postgres
- Synchronous → Async
- Prepared statements → Tagged template literals

---

### 3. Discord Bot → Webhooks

**FROM:** `visitor-analytics/backend/src/discord.js`

```javascript
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

await client.login(token); // Persistent connection

export async function sendNotification(data) {
  const channel = await client.channels.fetch(channelId);
  await channel.send({ embeds: [embed] });
}
```

**TO:** `my-portfolio/lib/discord.ts`

```typescript
export async function sendNotification(data: VisitorData) {
  // Use Discord webhook (no persistent connection)
  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [buildEmbed(data)]
    })
  });
}

// For slash commands, set up interaction endpoint
// POST /api/discord/interactions
```

**Changes:**
- Bot client → Webhook
- Persistent connection → HTTP requests
- Slash commands handled via interaction endpoint

---

### 4. Utility Functions → Shared Library

**FROM:** `visitor-analytics/backend/src/utils.js`

**TO:** `my-portfolio/lib/utils.ts`

**Changes:** Minimal - mostly just TypeScript types

---

### 5. Geolocation Service

**FROM:** `visitor-analytics/backend/src/geolocation.js`

**TO:** `my-portfolio/lib/geolocation.ts`

**Changes:** None (already uses external API)

---

### 6. VisitorTracker Component

**FROM:** `my-portfolio/app/_components/VisitorTracker.tsx`

```typescript
const apiUrl = process.env.NEXT_PUBLIC_ANALYTICS_API || 'http://localhost:3001';

await fetch(`${apiUrl}/api/track`, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**TO:** `my-portfolio/app/_components/VisitorTracker.tsx`

```typescript
// Change API URL to use same domain
await fetch('/api/track', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**Changes:** URL from external API to same-domain API route

---

## New Directory Structure

### Before (Current)

```
personal-website/
├── my-portfolio/
│   ├── app/
│   │   ├── _components/
│   │   │   └── VisitorTracker.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── package.json
│
└── visitor-analytics/
    ├── backend/
    │   ├── src/
    │   │   ├── index.js         ← Express server
    │   │   ├── db.js            ← SQLite
    │   │   ├── discord.js       ← Discord bot
    │   │   ├── geolocation.js
    │   │   └── utils.js
    │   ├── Dockerfile
    │   └── package.json
    └── docker-compose.yml
```

### After (All-Vercel)

```
personal-website/
├── my-portfolio/
│   ├── app/
│   │   ├── api/                 ← NEW
│   │   │   ├── track/
│   │   │   │   └── route.ts     ← Was: visitor-analytics/.../index.js
│   │   │   ├── stats/
│   │   │   │   └── route.ts
│   │   │   └── discord/
│   │   │       └── interactions/
│   │   │           └── route.ts
│   │   ├── _components/
│   │   │   └── VisitorTracker.tsx  ← Updated
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/                     ← NEW
│   │   ├── db.ts                ← Was: visitor-analytics/.../db.js
│   │   ├── discord.ts           ← Was: visitor-analytics/.../discord.js
│   │   ├── geolocation.ts       ← Was: visitor-analytics/.../geolocation.js
│   │   └── utils.ts             ← Was: visitor-analytics/.../utils.js
│   └── package.json             ← Add @vercel/postgres, discord.js
│
└── visitor-analytics/           ← DELETE THIS ENTIRE DIRECTORY
```

---

## Package.json Changes

### my-portfolio/package.json

**Add dependencies:**
```json
{
  "dependencies": {
    "@vercel/postgres": "^0.5.0",
    "discord.js": "^14.14.1",
    "express-rate-limit": "^7.1.5",
    "ua-parser-js": "^1.0.37",
    "node-fetch": "^3.3.2"
  }
}
```

---

## Environment Variables

### Before (Two Deployments)

**Vercel (my-portfolio):**
```env
NEXT_PUBLIC_ANALYTICS_API=https://your-backend.railway.app
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

**Railway/AWS (visitor-analytics):**
```env
DISCORD_BOT_TOKEN=xxx
DISCORD_CHANNEL_ID=xxx
ALLOWED_ORIGINS=https://your-site.vercel.app
```

### After (All Vercel)

**Vercel (my-portfolio only):**
```env
# No longer needed (using /api routes instead of external API)
# NEXT_PUBLIC_ANALYTICS_API=xxx

NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Server-side only (not exposed to browser)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
DISCORD_PUBLIC_KEY=xxx  # For interaction verification
POSTGRES_URL=xxx  # Auto-provided by Vercel

# For slash commands (if implementing)
DISCORD_BOT_TOKEN=xxx
DISCORD_CLIENT_ID=xxx
```

---

## Database Migration

### Create Vercel Postgres Database

1. In Vercel dashboard → Storage → Create Database
2. Select "Postgres"
3. Choose region
4. Create database

### Run Migration Script

**Create:** `my-portfolio/scripts/migrate-db.ts`

```typescript
import { sql } from '@vercel/postgres';

async function migrate() {
  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS visitors (
      id SERIAL PRIMARY KEY,
      visitor_fingerprint TEXT NOT NULL,
      ip_address TEXT,
      ip_hash TEXT,
      country TEXT,
      country_code TEXT,
      region TEXT,
      city TEXT,
      latitude REAL,
      longitude REAL,
      isp TEXT,
      organization TEXT,
      asn TEXT,
      asn_name TEXT,
      is_vpn BOOLEAN DEFAULT false,
      timezone TEXT,
      language TEXT,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      visitor_id INTEGER NOT NULL REFERENCES visitors(id),
      page_url TEXT NOT NULL,
      page_title TEXT,
      user_agent TEXT,
      browser TEXT,
      browser_version TEXT,
      os TEXT,
      os_version TEXT,
      device_type TEXT,
      screen_resolution TEXT,
      viewport_size TEXT,
      platform TEXT,
      cpu_cores INTEGER,
      device_memory REAL,
      pixel_ratio REAL,
      cookies_enabled BOOLEAN,
      online BOOLEAN,
      pdf_viewer BOOLEAN,
      gpu_renderer TEXT,
      gpu_vendor TEXT,
      time_spent INTEGER,
      scroll_depth INTEGER,
      is_new_visitor BOOLEAN DEFAULT true,
      session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      session_end TIMESTAMP
    )
  `;

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_visitors_fingerprint ON visitors(visitor_fingerprint)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_visitors_created ON visitors(created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON sessions(visitor_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_start ON sessions(session_start)`;

  console.log('Migration complete!');
}

migrate();
```

Run: `npx tsx scripts/migrate-db.ts`

---

## Discord Setup Changes

### Before: Discord Bot

1. Create bot application
2. Get bot token
3. Invite bot to server
4. Bot stays connected 24/7

### After: Discord Webhooks + Interactions

**For Notifications:**
1. In Discord channel → Settings → Integrations → Webhooks
2. Create webhook
3. Copy webhook URL
4. Add to Vercel env: `DISCORD_WEBHOOK_URL`

**For Slash Commands (Optional):**
1. Create interaction endpoint: `/api/discord/interactions`
2. Register endpoint URL in Discord Developer Portal
3. Verify signatures in endpoint
4. Handle commands

---

## Testing Locally

### Before (Two Servers)

```bash
# Terminal 1: Backend
cd visitor-analytics
docker-compose up

# Terminal 2: Frontend
cd my-portfolio
npm run dev
```

### After (One Server)

```bash
cd my-portfolio
npm run dev
# Everything runs on localhost:3000
```

---

## Deployment

### Before (Two Deployments)

```bash
git push
# Vercel deploys my-portfolio
# Railway/AWS deploys visitor-analytics
```

### After (One Deployment)

```bash
git push
# Vercel deploys everything
```

---

## What Gets Deleted

After refactoring is complete and tested:

```bash
# Delete entire visitor-analytics directory
rm -rf visitor-analytics/
```

---

## Refactoring Checklist

- [ ] Set up Vercel Postgres database
- [ ] Create `my-portfolio/lib/db.ts` (migrate from SQLite)
- [ ] Create `my-portfolio/lib/discord.ts` (migrate from bot to webhooks)
- [ ] Copy `my-portfolio/lib/utils.ts` from visitor-analytics
- [ ] Copy `my-portfolio/lib/geolocation.ts` from visitor-analytics
- [ ] Create `my-portfolio/app/api/track/route.ts`
- [ ] Create `my-portfolio/app/api/stats/route.ts`
- [ ] Update `VisitorTracker.tsx` to use `/api/track`
- [ ] Run database migration script
- [ ] Set up Discord webhook
- [ ] Update environment variables in Vercel
- [ ] Test locally
- [ ] Deploy to Vercel
- [ ] Test in production
- [ ] Delete `visitor-analytics/` directory

---

## Estimated Time Breakdown

1. Set up Vercel Postgres: 30 min
2. Migrate db.js → db.ts: 2 hours
3. Migrate discord.js → discord.ts: 2 hours
4. Create API routes: 2 hours
5. Update VisitorTracker: 15 min
6. Set up Discord webhook: 30 min
7. Local testing: 2 hours
8. Production testing: 1 hour
9. Debugging issues: 2 hours

**Total: 12-16 hours**

---

## Key Differences to Understand

### SQLite vs Postgres

**SQLite (synchronous):**
```javascript
const visitor = db.prepare('SELECT * FROM visitors WHERE id = ?').get(123);
```

**Postgres (async):**
```typescript
const result = await sql`SELECT * FROM visitors WHERE id = ${123}`;
const visitor = result.rows[0];
```

### Discord Bot vs Webhook

**Bot (persistent):**
```javascript
client.on('ready', () => console.log('Bot online'));
client.on('interactionCreate', handleCommand);
```

**Webhook (request-based):**
```typescript
// Send notification
await fetch(webhookUrl, { method: 'POST', body: JSON.stringify({...}) });

// Handle commands via separate endpoint
// POST /api/discord/interactions
```

### Express vs Next.js API Routes

**Express:**
```javascript
app.post('/api/track', (req, res) => {
  res.json({ success: true });
});
```

**Next.js:**
```typescript
export async function POST(req: Request) {
  return Response.json({ success: true });
}
```

---

## Summary

**What changes:**
- ✏️ visitor-analytics/backend/src/ → my-portfolio/app/api/ + my-portfolio/lib/
- ✏️ SQLite → Postgres
- ✏️ Discord bot → Discord webhooks
- ✏️ Express → Next.js API routes

**What stays the same:**
- ✅ my-portfolio frontend (just API URL update)
- ✅ VisitorTracker.tsx logic (just endpoint change)
- ✅ Tracking data structure
- ✅ Discord notification format (mostly)

**What gets deleted:**
- 🗑️ visitor-analytics/ (entire directory)
- 🗑️ docker-compose.yml
- 🗑️ Dockerfile
- 🗑️ Backend package.json (dependencies move to my-portfolio)
