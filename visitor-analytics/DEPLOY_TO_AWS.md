# Deploy to AWS (Single Repo)

Your repository structure is already perfect for this. You have ONE repo with TWO subdirectories that deploy to different platforms.

## Repository Setup (Already Done!)

```
personal-website/          ← Single Git Repository
├── my-portfolio/         ← Deploys to Vercel
└── visitor-analytics/    ← Deploys to AWS
```

One `git push` updates both on GitHub. Vercel and AWS pull from the same repo.

## AWS Deployment Options

### Option 1: AWS App Runner (Easiest - Like Vercel for Backends)

**Pros:**
- ✅ Easiest AWS option (clicks only, no CLI needed)
- ✅ Auto-deploys from GitHub
- ✅ Automatic HTTPS
- ✅ Auto-scaling
- ✅ Managed infrastructure

**Cons:**
- ❌ ~$7-15/month (no free tier)

**Steps:**

1. **Push Your Code to GitHub** (if not already):
   ```bash
   cd /Users/islamtayeb/Documents/GitHub/personal-website
   git add .
   git commit -m "Add visitor analytics"
   git push
   ```

2. **Create App Runner Service:**
   - Go to: https://console.aws.amazon.com/apprunner
   - Click "Create service"
   - **Source**: GitHub
   - **Connect to GitHub**: Authorize AWS
   - **Repository**: Your repository (personal-website)
   - **Source directory**: `visitor-analytics/backend`
   - **Deployment trigger**: Automatic (on every push)

3. **Configure Build:**
   - **Runtime**: Docker
   - **Build command**: (leave empty - uses Dockerfile)
   - **Port**: 3001

4. **Add Environment Variables:**
   ```
   DISCORD_BOT_TOKEN=your_token
   DISCORD_CHANNEL_ID=your_channel_id
   ALLOWED_ORIGINS=https://your-site.vercel.app
   PORT=3001
   NODE_ENV=production
   DATABASE_PATH=/data/analytics.db
   ```

5. **Configure Storage (Important!):**
   - Under "Advanced settings"
   - Add "Ephemeral storage" or use EFS for persistence
   - Mount path: `/data`

6. **Create Service**
   - AWS builds and deploys
   - Gives you a URL: `https://xxxxx.us-east-1.awsapprunner.com`

7. **Update Vercel:**
   - Add env var: `NEXT_PUBLIC_ANALYTICS_API=https://xxxxx.us-east-1.awsapprunner.com`

**Issue with App Runner:** SQLite persistence is tricky. Better option below ↓

---

### Option 2: AWS Lightsail (Recommended - Simple VPS)

**Pros:**
- ✅ Cheapest ($3.50/month for smallest instance)
- ✅ Predictable pricing
- ✅ Full control
- ✅ Persistent storage (SQLite works perfectly)
- ✅ Static IP included

**Cons:**
- ❌ Manual server management
- ❌ No auto-deploy (need to pull/restart manually or set up CI/CD)

**Steps:**

1. **Create Lightsail Instance:**
   - Go to: https://lightsail.aws.amazon.com
   - Click "Create instance"
   - **Region**: Choose closest to you
   - **Platform**: Linux/Unix
   - **Blueprint**: OS Only → Ubuntu 22.04 LTS
   - **Instance plan**: $3.50/month (512 MB RAM, 1 vCPU)
   - **Name**: visitor-analytics
   - Click "Create instance"

2. **SSH into Instance:**
   - Click on your instance
   - Click "Connect using SSH"
   - Or use your own SSH client with the downloaded key

3. **Install Docker:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Install Docker Compose
   sudo apt install docker-compose -y

   # Add ubuntu user to docker group
   sudo usermod -aG docker ubuntu

   # Log out and back in for group changes to take effect
   exit
   # SSH back in
   ```

4. **Clone Your Repository:**
   ```bash
   # Install git
   sudo apt install git -y

   # Clone your repo
   git clone https://github.com/YOUR_USERNAME/personal-website.git
   cd personal-website/visitor-analytics
   ```

5. **Configure Environment:**
   ```bash
   # Create .env file
   nano .env
   ```

   Add:
   ```env
   DISCORD_BOT_TOKEN=your_discord_bot_token
   DISCORD_CHANNEL_ID=your_discord_channel_id
   ALLOWED_ORIGINS=https://your-site.vercel.app
   ANONYMIZE_IPS=false
   RESPECT_DNT=true
   ADMIN_IPS=127.0.0.1,::1
   ```

   Save: `Ctrl+X`, `Y`, `Enter`

6. **Start Backend:**
   ```bash
   docker-compose up -d
   ```

7. **Check Logs:**
   ```bash
   docker-compose logs -f
   # Should see Discord bot connected
   # Ctrl+C to exit logs
   ```

8. **Set Up Domain (Optional):**
   - In Lightsail, go to "Networking"
   - Create static IP
   - Attach to your instance
   - Point your domain DNS to this IP

9. **Set Up HTTPS with Caddy:**
   ```bash
   # Install Caddy
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy

   # Configure Caddy
   sudo nano /etc/caddy/Caddyfile
   ```

   Add:
   ```
   analytics.yourdomain.com {
       reverse_proxy localhost:3001
   }
   ```

   Or if using IP directly:
   ```
   :80 {
       reverse_proxy localhost:3001
   }
   ```

   Save and restart:
   ```bash
   sudo systemctl restart caddy
   ```

10. **Open Firewall:**
    - In Lightsail console, go to your instance
    - Click "Networking" tab
    - Under "Firewall", add rules:
      - HTTP (80)
      - HTTPS (443)
      - Custom TCP (3001) - optional, if you want direct access

11. **Get Your URL:**
    - If using domain: `https://analytics.yourdomain.com`
    - If using IP: `http://YOUR_LIGHTSAIL_IP`

12. **Update Vercel:**
    - Go to Vercel → Project → Settings → Environment Variables
    - Set `NEXT_PUBLIC_ANALYTICS_API` to your Lightsail URL

**Auto-Deploy Setup (Optional):**

Create a deployment script:
```bash
nano ~/deploy.sh
```

Add:
```bash
#!/bin/bash
cd ~/personal-website/visitor-analytics
git pull
docker-compose down
docker-compose up -d --build
echo "Deployed at $(date)"
```

Make executable:
```bash
chmod +x ~/deploy.sh
```

Now you can deploy updates by SSH-ing in and running:
```bash
~/deploy.sh
```

Or set up a webhook for auto-deploy on git push (advanced).

---

### Option 3: AWS ECS with Fargate (More Complex, Fully Managed)

**Pros:**
- ✅ Fully managed containers
- ✅ Auto-scaling
- ✅ High availability

**Cons:**
- ❌ More complex setup
- ❌ Higher cost (~$15-30/month minimum)
- ❌ Requires EFS for SQLite persistence

This is overkill for a personal analytics backend. Use Lightsail instead.

---

### Option 4: AWS EC2 (Traditional VPS)

Same as Lightsail but:
- More configuration options
- More complex pricing
- Less beginner-friendly

**Recommendation:** Use Lightsail instead - it's EC2 simplified.

---

## Recommended: AWS Lightsail

**Why:**
- ✅ Cheap ($3.50-$5/month)
- ✅ Simple setup (30 minutes)
- ✅ SQLite works perfectly (persistent storage)
- ✅ Full control
- ✅ Predictable costs
- ✅ Includes static IP

**Cost Comparison:**
- Railway: Free tier, then ~$5-10/month
- AWS Lightsail: $3.50/month guaranteed
- AWS App Runner: ~$7-15/month
- AWS ECS: ~$15-30/month

---

## Monorepo Deployment Workflow

Your workflow with one repo:

```bash
# Make changes to either project
cd personal-website

# Commit everything
git add .
git commit -m "Update analytics and frontend"
git push

# What happens:
# ✅ Vercel auto-detects changes in my-portfolio/ and deploys
# ✅ AWS pulls from same repo (manually or via webhook)
```

**Vercel Configuration:**
- Root Directory: `my-portfolio`
- Deploys automatically on push

**AWS Lightsail:**
- Clone full repo: `git clone https://github.com/user/personal-website.git`
- Navigate to subdirectory: `cd personal-website/visitor-analytics`
- Deploy: `docker-compose up -d`
- Update: `git pull && docker-compose up -d --build`

---

## Step-by-Step: Lightsail Setup (Copy-Paste)

```bash
# 1. Create Lightsail instance (in AWS console)
# Choose: Ubuntu 22.04, $3.50/month plan

# 2. SSH in and run these commands:

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose -y
sudo usermod -aG docker ubuntu

# Clone your repo (replace with your GitHub username)
sudo apt install git -y
git clone https://github.com/YOUR_USERNAME/personal-website.git
cd personal-website/visitor-analytics

# Create .env
cat > .env << 'EOF'
DISCORD_BOT_TOKEN=your_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
ALLOWED_ORIGINS=https://your-site.vercel.app
EOF

# Start backend
docker-compose up -d

# Check logs
docker-compose logs -f

# 3. In Lightsail console:
#    - Networking tab → Add firewall rule for HTTP (80)
#    - Get your instance IP

# 4. In Vercel:
#    - Add env var: NEXT_PUBLIC_ANALYTICS_API=http://YOUR_IP:3001
#    - Redeploy

# Done!
```

---

## Database Persistence on AWS

**Lightsail:**
- ✅ Database lives in Docker volume on instance disk
- ✅ Persists across restarts
- ✅ Backup: `docker cp visitor-analytics:/data/analytics.db ./backup.db`

**App Runner:**
- ⚠️ Needs Amazon EFS (Elastic File System) for persistence
- More complex setup
- Additional cost

**Recommendation:** Use Lightsail for simplicity.

---

## Updating Your Code

```bash
# Local machine:
git add .
git commit -m "Update"
git push

# Vercel: Auto-deploys ✅

# AWS Lightsail: SSH in and run:
cd ~/personal-website/visitor-analytics
git pull
docker-compose down
docker-compose up -d --build
```

---

## Security Best Practices

1. **Never commit .env:**
   - Already in `.gitignore` ✅

2. **Use SSH keys:**
   - Lightsail generates one for you

3. **Update ALLOWED_ORIGINS:**
   - Only include your actual domain

4. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

5. **Set up automated backups:**
   ```bash
   # Add to crontab
   crontab -e
   # Add line:
   0 2 * * * docker exec visitor-analytics sqlite3 /data/analytics.db ".backup '/data/backup.db'" && docker cp visitor-analytics:/data/backup.db ~/backups/analytics-$(date +\%Y\%m\%d).db
   ```

---

## Troubleshooting

**Can't connect to backend from Vercel:**
- Check Lightsail firewall allows port 80/443/3001
- Verify ALLOWED_ORIGINS includes your Vercel domain
- Check backend logs: `docker-compose logs -f`

**Discord bot not connecting:**
- Check environment variables: `docker-compose config`
- Verify bot token and channel ID
- Check logs: `docker-compose logs -f`

**Database not persisting:**
- Check volume: `docker volume ls`
- Don't use `docker-compose down -v` (removes volumes)
- Use `docker-compose down` then `docker-compose up -d`

---

## Next Steps

1. Choose: Lightsail ($3.50/month, recommended)
2. Follow "Step-by-Step: Lightsail Setup" above
3. Update Vercel environment variables
4. Push to GitHub
5. Test: Visit your site, check Discord

See also:
- `PRODUCTION.md` - General production guide
- `ENHANCED_TRACKING.md` - Feature documentation
