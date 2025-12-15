# Testing Guide

This guide walks you through testing the visitor analytics system.

## Prerequisites

Before testing, ensure you have:
- Docker and Docker Compose installed
- A Discord bot token and channel ID (see README.md for setup)
- Your `.env` file configured

## Step 1: Start Docker

Make sure Docker is running:

```bash
# Check if Docker is running
docker ps

# If not running, start Docker Desktop or Docker daemon
```

## Step 2: Build and Start the Backend

```bash
cd visitor-analytics

# Build the Docker image
docker-compose build

# Start the backend
docker-compose up -d

# Check logs
docker-compose logs -f
```

You should see:
```
✅ Analytics API server running on port 3001
📊 Database ready
Discord bot logged in as YourBotName#1234
Discord commands registered successfully
🚀 Ready to track visitors!
```

## Step 3: Test the API

Test the health endpoint:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

Test the tracking endpoint:

```bash
curl -X POST http://localhost:3001/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "fingerprint": "test123",
    "page_url": "http://localhost:3000/test",
    "page_title": "Test Page",
    "referrer": "",
    "screen_resolution": "1920x1080",
    "viewport_size": "1200x800",
    "timezone": "America/New_York",
    "language": "en-US",
    "time_spent": 30,
    "scroll_depth": 75
  }'
```

Expected response:
```json
{
  "success": true,
  "tracked": true,
  "visitor_id": 1
}
```

Check Discord - you should see a notification!

## Step 4: Test Discord Commands

In your Discord server, try these commands:

```
/stats today
/stats week
/stats top-pages
/visitors recent 5
/lookup 1
```

## Step 5: Integrate with Next.js

Add environment variables to your Next.js app:

```bash
cd ../my-portfolio

# Create or update .env.local
echo "NEXT_PUBLIC_ANALYTICS_API=http://localhost:3001" >> .env.local
echo "NEXT_PUBLIC_ANALYTICS_ENABLED=true" >> .env.local
```

Update your root layout:

```tsx
// app/layout.tsx
import VisitorTracker from './_components/VisitorTracker';

export default function RootLayout({ children }) {
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

Start your Next.js app:

```bash
npm run dev
```

Visit `http://localhost:3000` and check:
1. Browser console (should show tracking logs if in dev mode)
2. Discord channel (should get notification)
3. Backend logs: `docker-compose logs -f analytics-backend`

## Step 6: Verify Data Storage

Check the database:

```bash
# Access the database
docker exec -it visitor-analytics sqlite3 /data/analytics.db

# Run queries
.tables
SELECT COUNT(*) FROM visitors;
SELECT COUNT(*) FROM sessions;
SELECT * FROM visitors ORDER BY created_at DESC LIMIT 5;
.quit
```

## Common Issues

### Docker not starting
- Ensure Docker Desktop is running
- Check for port conflicts: `lsof -i :3001`
- Check logs: `docker-compose logs`

### Discord bot not working
- Verify `DISCORD_BOT_TOKEN` is correct
- Check bot has necessary permissions
- Ensure bot is invited to your server
- Verify `DISCORD_CHANNEL_ID` is correct

### No tracking data
- Check browser console for errors
- Verify `NEXT_PUBLIC_ANALYTICS_API` is set correctly
- Check CORS configuration in backend `.env`
- Ensure you're not in `ADMIN_IPS` list

### CORS errors
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart backend: `docker-compose restart`

## Performance Testing

Test with multiple concurrent requests:

```bash
# Install apache bench if needed
brew install httpd

# Send 100 requests with 10 concurrent
ab -n 100 -c 10 -p test-payload.json -T application/json http://localhost:3001/api/track
```

Create `test-payload.json`:
```json
{
  "fingerprint": "test123",
  "page_url": "http://localhost:3000/test",
  "page_title": "Test Page",
  "referrer": "",
  "screen_resolution": "1920x1080",
  "viewport_size": "1200x800",
  "timezone": "America/New_York",
  "language": "en-US",
  "time_spent": 30,
  "scroll_depth": 75
}
```

## Production Testing Checklist

Before deploying to production:

- [ ] Discord bot is properly configured
- [ ] Environment variables are set correctly
- [ ] CORS is configured with production domain
- [ ] HTTPS is enabled for the API
- [ ] Database backup is configured
- [ ] Logs are monitored
- [ ] Admin IP is excluded from tracking
- [ ] Privacy settings are configured (GDPR compliance)
- [ ] Rate limiting is working
- [ ] Health check endpoint is accessible
- [ ] Discord commands work correctly
- [ ] Tracking script is integrated in Next.js
- [ ] No console errors in browser
- [ ] Notifications appear in Discord
- [ ] Data is being stored correctly

## Debugging

Enable debug mode in Next.js:

```tsx
<VisitorTracker config={{ debug: true }} />
```

View detailed logs:

```bash
# Backend logs
docker-compose logs -f analytics-backend

# Follow logs in real-time
docker-compose logs -f --tail=100

# Check database size
docker exec visitor-analytics du -sh /data/analytics.db
```

## Stopping the Backend

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (DELETES DATABASE)
docker-compose down -v

# Stop but keep data
docker-compose stop
```

## Next Steps

Once testing is complete:
1. Configure privacy settings as needed
2. Set up database backups
3. Deploy to production
4. Monitor Discord notifications
5. Review analytics regularly
