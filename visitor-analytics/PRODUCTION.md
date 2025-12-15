# Production Deployment Guide

This guide covers deploying the visitor analytics system to production.

## Prerequisites

- A VPS or cloud server (DigitalOcean, Linode, AWS, etc.)
- Docker and Docker Compose installed on the server
- A domain name (e.g., `analytics.yourdomain.com`)
- Real Discord bot credentials

## Step-by-Step Deployment

### 1. Server Setup

SSH into your server:
```bash
ssh user@your-server-ip
```

Install Docker and Docker Compose:
```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourusername/your-repo.git
cd your-repo/visitor-analytics
```

### 3. Configure Environment

```bash
# Copy and edit environment file
sudo cp .env.example .env
sudo nano .env
```

**Production `.env` settings:**
```env
# REQUIRED: Real Discord credentials
DISCORD_BOT_TOKEN=your_real_discord_bot_token
DISCORD_CHANNEL_ID=your_real_channel_id

# REQUIRED: Your production domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# RECOMMENDED: Privacy settings
ANONYMIZE_IPS=true
RESPECT_DNT=true
ADMIN_IPS=your.server.ip.address

# Optional: Database location
DATABASE_PATH=/data/analytics.db
```

### 4. Start Backend

```bash
# Start containers
sudo docker-compose up -d

# Check logs
sudo docker-compose logs -f

# You should see:
# ✅ Analytics API server running on port 3001
# 📊 Database ready
# 🚀 Ready to track visitors!
# Discord bot logged in as YourBot#1234
```

### 5. Set Up Reverse Proxy (HTTPS)

#### Option A: Nginx

Install nginx:
```bash
sudo apt-get install nginx certbot python3-certbot-nginx
```

Create nginx config:
```bash
sudo nano /etc/nginx/sites-available/analytics
```

Add configuration:
```nginx
server {
    listen 80;
    server_name analytics.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and get SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/analytics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate (Let's Encrypt)
sudo certbot --nginx -d analytics.yourdomain.com
```

#### Option B: Caddy (Automatic HTTPS)

Install Caddy:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Create Caddyfile:
```bash
sudo nano /etc/caddy/Caddyfile
```

Add:
```
analytics.yourdomain.com {
    reverse_proxy localhost:3001
}
```

Restart Caddy:
```bash
sudo systemctl restart caddy
```

### 6. Configure Next.js Production

In your Next.js project, update environment variables:

**Vercel/Netlify:**
Add these environment variables in your dashboard:
```
NEXT_PUBLIC_ANALYTICS_API=https://analytics.yourdomain.com
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

**Self-hosted Next.js:**
```bash
# Add to .env.production
echo "NEXT_PUBLIC_ANALYTICS_API=https://analytics.yourdomain.com" >> .env.production
echo "NEXT_PUBLIC_ANALYTICS_ENABLED=true" >> .env.production
```

Redeploy your Next.js app.

### 7. Set Up Automated Backups

Copy backup script:
```bash
sudo cp backup.sh /opt/backup-analytics.sh
sudo chmod +x /opt/backup-analytics.sh

# Edit backup directory path
sudo nano /opt/backup-analytics.sh
# Change: BACKUP_DIR="/path/to/backups" to BACKUP_DIR="/opt/analytics-backups"
```

Add to crontab (runs daily at 2 AM):
```bash
sudo crontab -e

# Add this line:
0 2 * * * /opt/backup-analytics.sh >> /var/log/analytics-backup.log 2>&1
```

### 8. Test Everything

1. **Test API health:**
   ```bash
   curl https://analytics.yourdomain.com/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Visit your website:**
   - Open https://yourdomain.com
   - Check browser console for any errors
   - Wait 10 seconds

3. **Check Discord:**
   - You should see a visitor notification in your Discord channel
   - Try Discord commands:
     ```
     /stats today
     /visitors recent 5
     ```

## Monitoring & Maintenance

### View Logs
```bash
# View real-time logs
sudo docker-compose logs -f

# View last 100 lines
sudo docker-compose logs --tail=100
```

### Restart Service
```bash
sudo docker-compose restart
```

### Update Code
```bash
cd /opt/your-repo/visitor-analytics
sudo git pull
sudo docker-compose down
sudo docker-compose up -d --build
```

### Check Resource Usage
```bash
sudo docker stats visitor-analytics
```

## Firewall Configuration

Make sure your server firewall allows:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## Troubleshooting

### API not accessible
```bash
# Check if container is running
sudo docker ps

# Check nginx/caddy status
sudo systemctl status nginx
# or
sudo systemctl status caddy

# Check logs
sudo docker-compose logs -f
```

### CORS errors
- Make sure `ALLOWED_ORIGINS` in `.env` includes your production domain
- Restart after changes: `sudo docker-compose restart`

### Discord not working
- Verify bot token is correct
- Check bot has permissions in Discord server
- Check logs: `sudo docker-compose logs -f`

### Database locked errors
- Usually temporary, SQLite uses WAL mode
- Check if backup process is running
- If persistent, consider PostgreSQL

## Security Checklist

- [ ] Using HTTPS (via nginx/Caddy with SSL)
- [ ] `.env` file has correct permissions (600)
- [ ] Discord bot token is kept secret
- [ ] Firewall configured properly
- [ ] Automated backups set up
- [ ] `ALLOWED_ORIGINS` only includes your domain
- [ ] Regular updates scheduled
- [ ] Monitoring/alerting configured

## Performance Optimization

For high-traffic sites (>100k requests/day):

1. **Add rate limiting** (already built-in)
2. **Use PostgreSQL** instead of SQLite
3. **Add Redis caching** for stats queries
4. **Scale horizontally** with multiple containers
5. **Use CDN** for static assets

## Cost Estimate

- **VPS**: $5-20/month (DigitalOcean Droplet, Linode)
- **Domain**: $10-15/year (optional subdomain)
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$5-20/month

## Next Steps

1. Set up monitoring (optional): UptimeRobot, Prometheus, etc.
2. Configure log rotation to prevent disk fill
3. Set up alerts for container downtime
4. Create a staging environment for testing updates

## Support

If you run into issues:
1. Check the logs: `sudo docker-compose logs -f`
2. Verify environment variables
3. Test API health endpoint
4. Check Discord bot permissions
5. Review nginx/Caddy configuration
