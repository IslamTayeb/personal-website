# Visitor Analytics System with Discord Integration

A complete, self-hosted visitor analytics system for your personal website with real-time Discord notifications and powerful query commands.

## Features

### 📊 Comprehensive Tracking
- Real-time visitor tracking
- IP geolocation (city, region, country, ISP)
- VPN/Proxy detection
- Browser, OS, and device detection
- Screen resolution and viewport size
- Time spent on page and scroll depth
- Referrer tracking and UTM parameters
- New vs returning visitor identification

### 🤖 Discord Integration
- Real-time visitor notifications with rich embeds
- Slash commands for querying analytics:
  - `/stats today` - Today's visitor summary
  - `/stats week` - Weekly summary
  - `/stats top-pages` - Most visited pages
  - `/stats top-locations` - Visitor locations
  - `/stats top-referrers` - Traffic sources
  - `/visitors recent [count]` - Recent visitors list
  - `/lookup [ip or id]` - Detailed visitor lookup

### 🔒 Privacy & Compliance
- Optional IP anonymization
- Do Not Track header support
- Admin IP exclusion
- Cookie consent integration
- GDPR-friendly

### 🐳 Easy Deployment
- Docker and Docker Compose setup
- Single command deployment
- Persistent SQLite database
- Environment-based configuration

## Quick Start

### 1. Discord Bot Setup

First, create a Discord bot and get your credentials:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Token", click "Copy" to get your bot token
5. Enable these Privileged Gateway Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot` and `applications.commands`
8. Select permissions: `Send Messages`, `Embed Links`, `Read Messages/View Channels`
9. Copy the generated URL and open it to invite the bot to your server
10. Get your channel ID:
    - Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
    - Right-click your desired channel and select "Copy ID"

### 2. Backend Setup

```bash
cd visitor-analytics

# Copy environment file
cp .env.example .env

# Edit .env with your Discord credentials
nano .env
```

Required environment variables:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 3. Start with Docker

```bash
# Build and start the backend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The API will be available at `http://localhost:3001`

### 4. Integrate with Next.js

Add environment variable to your Next.js app:

```env
# my-portfolio/.env.local
NEXT_PUBLIC_ANALYTICS_API=http://localhost:3001
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

Import and add the tracker to your root layout:

```tsx
// my-portfolio/app/layout.tsx
import VisitorTracker from './_components/VisitorTracker';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <VisitorTracker />
      </body>
    </html>
  );
}
```

### 5. Test It!

1. Visit your website
2. Check your Discord channel for a notification
3. Try Discord commands:
   ```
   /stats today
   /visitors recent 5
   ```

## Manual Setup (Without Docker)

If you prefer not to use Docker:

```bash
cd visitor-analytics/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `3001` |
| `DISCORD_BOT_TOKEN` | Your Discord bot token | Required |
| `DISCORD_CHANNEL_ID` | Discord channel for notifications | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000` |
| `ANONYMIZE_IPS` | Anonymize IP addresses for GDPR | `false` |
| `RESPECT_DNT` | Respect Do Not Track header | `true` |
| `ADMIN_IPS` | Admin IPs to exclude from tracking | `127.0.0.1,::1` |
| `DATABASE_PATH` | SQLite database location | `/data/analytics.db` |

### Privacy Settings

**IP Anonymization**: Set `ANONYMIZE_IPS=true` to store only partial IPs:
- IPv4: `192.168.1.100` → `192.168.1.0`
- IPv6: First 48 bits only

**Do Not Track**: When `RESPECT_DNT=true`, visitors with DNT header won't be tracked

**Admin Exclusion**: Add your IP to `ADMIN_IPS` to exclude yourself from analytics

## Production Deployment

### Deploy to VPS/Cloud Server

1. Clone repository to your server
2. Set up environment variables
3. Configure reverse proxy (nginx/caddy) for HTTPS
4. Update `ALLOWED_ORIGINS` with your production domain
5. Start with Docker Compose

Example nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name analytics.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Deploy with Docker

For production, consider:
- Using Docker secrets for sensitive data
- Setting up automatic backups of `/data/analytics.db`
- Monitoring with health checks
- Using a process manager or orchestration tool

## Discord Commands Reference

### Statistics Commands

**Today's Stats**
```
/stats today
```
Shows unique visitors, sessions, new visitors, and average time spent for today.

**Weekly Stats**
```
/stats week
```
Shows statistics for the last 7 days.

**Top Pages**
```
/stats top-pages
```
Lists the 10 most visited pages with visit counts and average time spent.

**Top Locations**
```
/stats top-locations
```
Shows the 10 most common visitor locations with country flags.

**Top Referrers**
```
/stats top-referrers
```
Displays the top 10 traffic sources.

### Visitor Commands

**Recent Visitors**
```
/visitors recent 10
```
Shows the last N visitors (default 10, max 25) with location and device info.

**Lookup Visitor**
```
/lookup 192.168.1.1
/lookup 12345
```
Get detailed information about a visitor by IP address or visitor ID.

## Database Schema

### Visitors Table
Stores unique visitor information:
- Fingerprint, IP address (or hash)
- Geolocation data
- Timezone, language
- Referrer and UTM parameters
- First visit timestamp

### Sessions Table
Tracks individual page visits:
- Page URL and title
- Browser and device info
- Time spent and scroll depth
- New vs returning visitor flag
- Session timestamps

## Troubleshooting

### Discord bot not connecting
- Verify `DISCORD_BOT_TOKEN` is correct
- Check bot has necessary permissions
- Ensure bot is invited to your server

### No notifications appearing
- Verify `DISCORD_CHANNEL_ID` is correct
- Check bot has permission to send messages in the channel
- Look at backend logs: `docker-compose logs -f`

### CORS errors from Next.js
- Add your frontend URL to `ALLOWED_ORIGINS`
- Format: `http://localhost:3000,https://yourdomain.com`

### Tracking not working
- Check `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- Verify `NEXT_PUBLIC_ANALYTICS_API` points to correct backend URL
- Check browser console for errors
- Ensure you're not in `ADMIN_IPS` list

### Database locked errors
- SQLite uses WAL mode for better concurrency
- If issues persist, consider PostgreSQL for high-traffic sites

## API Endpoints

### POST /api/track
Tracks a visitor session.

**Request Body:**
```json
{
  "fingerprint": "string",
  "page_url": "string",
  "page_title": "string",
  "referrer": "string",
  "screen_resolution": "1920x1080",
  "viewport_size": "1200x800",
  "timezone": "America/New_York",
  "language": "en-US",
  "time_spent": 30,
  "scroll_depth": 75
}
```

**Response:**
```json
{
  "success": true,
  "tracked": true,
  "visitor_id": 123
}
```

### GET /api/stats/summary
Get current statistics (optional, for building a dashboard).

**Response:**
```json
{
  "today": {
    "unique_visitors": 50,
    "total_sessions": 120,
    "avg_time_spent": 45,
    "new_visitors": 15
  },
  "week": {
    "unique_visitors": 250,
    "total_sessions": 680,
    "avg_time_spent": 52,
    "new_visitors": 80
  }
}
```

### GET /health
Health check endpoint.

## Advanced Usage

### Custom Tracking Events

You can extend the tracker to capture custom events:

```tsx
// Add to VisitorTracker.tsx
const trackCustomEvent = async (eventName: string, data: any) => {
  await fetch(`${apiUrl}/api/track-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fingerprint: getFingerprint(),
      event: eventName,
      data
    })
  });
};

// Usage
trackCustomEvent('button_click', { button_id: 'cta-signup' });
```

### Exclude Specific Pages

Modify the VisitorTracker component to skip certain pages:

```tsx
const excludedPaths = ['/admin', '/private'];
if (excludedPaths.some(path => pathname.startsWith(path))) {
  return null;
}
```

## Data Backup

Backup your analytics database regularly:

```bash
# Stop the container
docker-compose down

# Copy database
docker cp visitor-analytics:/data/analytics.db ./backup-$(date +%Y%m%d).db

# Restart
docker-compose up -d
```

Or use automated backup:

```bash
# Add to crontab
0 2 * * * docker exec visitor-analytics sqlite3 /data/analytics.db ".backup '/data/backup.db'" && docker cp visitor-analytics:/data/backup.db /backups/analytics-$(date +\%Y\%m\%d).db
```

## Performance Considerations

- SQLite handles ~100k requests/day easily
- For higher traffic, consider:
  - PostgreSQL instead of SQLite
  - Read replicas for queries
  - Caching frequently accessed stats
  - Rate limiting per visitor

## Security Best Practices

1. **Use HTTPS** in production
2. **Secure your .env** file (never commit it)
3. **Restrict Discord bot** permissions to minimum required
4. **Set CORS** to only allow your domain
5. **Update dependencies** regularly
6. **Monitor logs** for suspicious activity
7. **Backup data** regularly

## License

MIT License - Feel free to use this for your personal or commercial projects.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Discord bot permissions
3. Check backend logs: `docker-compose logs -f`
4. Verify environment variables

## Credits

Built with:
- Node.js & Express
- SQLite (better-sqlite3)
- Discord.js
- Next.js
- ip-api.com for geolocation
