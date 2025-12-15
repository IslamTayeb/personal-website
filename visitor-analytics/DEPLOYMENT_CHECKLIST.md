# Deployment Checklist

## Pre-Deployment

- [ ] Backend is working locally (already done ✅)
- [ ] Discord bot credentials are configured
- [ ] Tested tracking locally

## Deploy Backend

Choose ONE option:

### Option A: Railway.app (Recommended - Easiest)

- [ ] Create account at railway.app
- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] `cd visitor-analytics`
- [ ] `railway login`
- [ ] `railway init`
- [ ] Add environment variables in Railway dashboard:
  - `DISCORD_BOT_TOKEN`
  - `DISCORD_CHANNEL_ID`
  - `ALLOWED_ORIGINS=https://your-site.vercel.app`
- [ ] `railway up`
- [ ] Copy the deployed URL (e.g., `https://xyz.railway.app`)

### Option B: Render.com

- [ ] Create account at render.com
- [ ] Connect GitHub repository
- [ ] Create new "Web Service"
- [ ] Select `visitor-analytics` directory
- [ ] Choose "Docker" as environment
- [ ] Add environment variables
- [ ] Deploy
- [ ] Copy the deployed URL

### Option C: VPS (DigitalOcean, Linode, etc.)

- [ ] Create VPS instance
- [ ] SSH into server
- [ ] Install Docker
- [ ] Clone repository
- [ ] Configure `.env` file
- [ ] Run `docker-compose up -d`
- [ ] Set up domain (e.g., analytics.yourdomain.com)
- [ ] Configure HTTPS (Caddy or nginx)
- [ ] Copy the URL (https://analytics.yourdomain.com)

## Update Next.js (Vercel)

- [ ] Go to Vercel dashboard
- [ ] Select your project (my-portfolio)
- [ ] Go to Settings → Environment Variables
- [ ] Add/Update:
  - `NEXT_PUBLIC_ANALYTICS_API` = `https://your-backend-url`
  - `NEXT_PUBLIC_ANALYTICS_ENABLED` = `true`
- [ ] Redeploy (or push to GitHub to trigger deploy)

## Update Backend CORS

- [ ] Update `.env` on your backend server:
  ```
  ALLOWED_ORIGINS=https://your-site.vercel.app,https://www.your-site.vercel.app
  ```
- [ ] Restart backend:
  - Railway: Automatic on git push
  - Render: Automatic on git push
  - VPS: `docker-compose restart`

## Test Production

- [ ] Visit your production website
- [ ] Open browser console (F12)
- [ ] Check for tracking requests (should see POST to /api/track)
- [ ] Check Discord channel for notification
- [ ] Verify all 8 categories show up
- [ ] Test Discord commands:
  - [ ] `/stats today`
  - [ ] `/visitors recent 5`
  - [ ] `/lookup [visitor_id]`

## Post-Deployment

- [ ] Set up database backups (if using VPS)
- [ ] Monitor backend logs
- [ ] Add backend URL to monitoring (UptimeRobot, etc.)
- [ ] Document your deployment

## GitHub Repository Structure

Your repo should look like:
```
your-repo/
├── my-portfolio/          # Next.js (deployed to Vercel)
│   └── app/
│       └── _components/
│           └── VisitorTracker.tsx
└── visitor-analytics/     # Backend (deploy separately)
    ├── backend/
    │   ├── src/
    │   ├── Dockerfile
    │   └── package.json
    ├── docker-compose.yml
    ├── .env              # Add to .gitignore!
    └── README.md
```

## Important Notes

✅ **Next.js** (my-portfolio):
- Already deployed to Vercel automatically when you push to GitHub
- Just needs environment variables updated

⚠️ **Backend** (visitor-analytics):
- NOT deployed automatically
- You MUST deploy it separately to Railway/Render/VPS
- Database lives with the backend

🔒 **Security**:
- NEVER commit `.env` file to GitHub
- Add `.env` to `.gitignore`
- Use environment variables in hosting platform

## Troubleshooting

**Tracking not working?**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_ANALYTICS_API` is set correctly
3. Check CORS - make sure your domain is in `ALLOWED_ORIGINS`
4. Check backend logs

**Discord not sending notifications?**
1. Verify bot token is correct
2. Check channel ID is correct
3. Ensure bot is in the Discord server
4. Check backend logs

**Database not persisting?**
1. Make sure you're using Docker volumes
2. Don't use `docker-compose down -v` (the -v removes volumes)
3. Use `docker-compose down` then `docker-compose up -d`
