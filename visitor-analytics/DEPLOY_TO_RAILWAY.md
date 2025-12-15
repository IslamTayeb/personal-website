# Deploy to Railway (Easiest Option)

Railway is like Vercel but for backends. It's **just as easy** and has a generous free tier.

## Why Railway?

✅ Automatic Docker deployment
✅ Free tier (500 hours/month, ~$5 credit)
✅ Persistent storage for SQLite
✅ Long-running processes (Discord bot works perfectly)
✅ Automatic HTTPS
✅ GitHub integration (auto-deploy on push)
✅ Simple web dashboard

## Step-by-Step (5 minutes)

### 1. Sign Up & Install CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (opens browser)
railway login
```

### 2. Initialize Project

```bash
# Navigate to backend directory
cd visitor-analytics

# Initialize Railway project
railway init

# It will ask you to name the project, e.g., "visitor-analytics"
```

### 3. Add Environment Variables

Go to Railway dashboard (https://railway.app/dashboard) and add these:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here
ALLOWED_ORIGINS=https://your-site.vercel.app
```

Or add them via CLI:
```bash
railway variables set DISCORD_BOT_TOKEN="your_token_here"
railway variables set DISCORD_CHANNEL_ID="your_channel_id_here"
railway variables set ALLOWED_ORIGINS="https://your-site.vercel.app"
```

### 4. Deploy

```bash
# Deploy the backend
railway up

# Railway will:
# - Detect your Dockerfile
# - Build the Docker image
# - Deploy it
# - Give you a URL like: https://visitor-analytics-production-xxxx.up.railway.app
```

### 5. Get Your Backend URL

```bash
# Get the URL
railway domain

# Copy this URL - you'll need it for Vercel
```

### 6. Update Vercel Environment Variables

Go to Vercel dashboard → Your Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_ANALYTICS_API=https://visitor-analytics-production-xxxx.up.railway.app
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

Click "Redeploy" or just push to GitHub.

### 7. Update CORS in Railway

Back in Railway dashboard, update the environment variable:

```env
ALLOWED_ORIGINS=https://your-actual-site.vercel.app,https://www.your-actual-site.vercel.app
```

### 8. Test It

Visit your Vercel website and check Discord!

## That's It!

Your setup:
- **Frontend (Next.js)**: Vercel → Auto-deploys from GitHub
- **Backend + Database**: Railway → Auto-deploys from GitHub (if you set it up)

## Auto-Deploy from GitHub (Optional but Recommended)

Instead of using `railway up` every time:

1. In Railway dashboard, go to your project
2. Click "Connect to GitHub"
3. Select your repository
4. Choose the `visitor-analytics` directory
5. Now every git push auto-deploys both:
   - Vercel deploys Next.js
   - Railway deploys backend

## Managing Your Railway Project

**View logs:**
```bash
railway logs
```

**Check status:**
```bash
railway status
```

**SSH into container:**
```bash
railway shell
```

**Backup database:**
```bash
# Download database file from Railway
railway run bash -c "cat /data/analytics.db" > backup.db
```

## Costs

**Free Tier:**
- 500 hours/month execution time
- $5 of usage credit per month
- For a low-traffic personal site, this is FREE

**If you exceed free tier:**
- ~$5-10/month for a small analytics backend
- Much cheaper than running your own VPS

## Troubleshooting

**Backend not starting?**
```bash
railway logs
# Check for errors
```

**Can't connect from Vercel?**
1. Check ALLOWED_ORIGINS includes your Vercel domain
2. Make sure Railway URL is correct in Vercel env vars
3. Redeploy Vercel after changing env vars

**Discord bot not working?**
1. Check Railway logs: `railway logs`
2. Verify DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID
3. Make sure bot is in your Discord server

## Updating Your Code

```bash
# Make changes locally
git add .
git commit -m "Update analytics"
git push

# If using GitHub integration:
# Railway auto-deploys ✅

# If not using GitHub integration:
cd visitor-analytics
railway up
```

## Alternative: Railway GUI Only (No CLI)

Don't want to use the CLI? You can do everything in the web dashboard:

1. Go to https://railway.app
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your repo
5. Choose the `visitor-analytics` directory as root
6. Add environment variables in the "Variables" tab
7. Click "Deploy"

Done! Railway gives you a URL.

## Why Not Other Options?

**Vercel:** Can't run long-lived processes or persistent databases
**Netlify:** Same limitations as Vercel
**Heroku:** No longer has free tier, more expensive than Railway
**VPS:** Requires server management, not beginner-friendly
**Railway:** ✅ Perfect fit - Docker + persistent storage + easy deployment
