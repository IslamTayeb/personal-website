# Quick Start Guide

Get the visitor analytics system running in 5 minutes.

## 1. Get Discord Bot Credentials

### Create Bot
1. Go to https://discord.com/developers/applications
2. Click "New Application" → Name it (e.g., "Visitor Analytics")
3. Go to "Bot" section → Click "Add Bot"
4. Under Token → Click "Copy" (this is your `DISCORD_BOT_TOKEN`)
5. Enable these intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### Invite Bot
1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select permissions: `Send Messages`, `Embed Links`, `View Channels`
4. Copy the URL and open it to invite bot to your server

### Get Channel ID
1. In Discord: Settings → Advanced → Enable "Developer Mode"
2. Right-click your channel → "Copy ID" (this is your `DISCORD_CHANNEL_ID`)

## 2. Configure Backend

```bash
cd visitor-analytics

# Copy environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

Update these values:
```env
DISCORD_BOT_TOKEN=paste_your_token_here
DISCORD_CHANNEL_ID=paste_your_channel_id_here
ALLOWED_ORIGINS=http://localhost:3000
```

## 3. Start Backend

```bash
# Start Docker containers
docker-compose up -d

# Check logs (should see "Ready to track visitors!")
docker-compose logs -f
```

Wait for:
- ✅ Analytics API server running
- 📊 Database ready
- Discord bot logged in
- Commands registered

## 4. Configure Next.js

```bash
cd ../my-portfolio

# Add to .env.local
echo "NEXT_PUBLIC_ANALYTICS_API=http://localhost:3001" >> .env.local
echo "NEXT_PUBLIC_ANALYTICS_ENABLED=true" >> .env.local
```

Add to your `app/layout.tsx`:

```tsx
import VisitorTracker from './_components/VisitorTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VisitorTracker />
      </body>
    </html>
  );
}
```

## 5. Test It

```bash
# Start Next.js
npm run dev
```

Visit `http://localhost:3000`

You should see:
- ✅ Notification in Discord channel
- ✅ Location, browser, device info
- ✅ Page visited

Try Discord commands:
```
/stats today
/visitors recent 5
```

## Done!

Your analytics system is now tracking visitors and sending notifications to Discord.

## Next Steps

- Read [README.md](README.md) for full documentation
- See [TESTING.md](TESTING.md) for detailed testing
- Check [INTEGRATION.md](INTEGRATION.md) for advanced Next.js integration

## Troubleshooting

**No Discord notification?**
- Check bot token is correct
- Verify bot is in your server
- Confirm channel ID is correct
- Check logs: `docker-compose logs -f`

**Tracking not working?**
- Verify `NEXT_PUBLIC_ANALYTICS_API` is set
- Check browser console for errors
- Ensure backend is running: `curl http://localhost:3001/health`

**CORS errors?**
- Add your URL to `ALLOWED_ORIGINS` in `.env`
- Restart: `docker-compose restart`

## Stop Backend

```bash
cd visitor-analytics
docker-compose down
```
