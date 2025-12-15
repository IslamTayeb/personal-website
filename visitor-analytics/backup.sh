#!/bin/bash
# Automated backup script for visitor analytics database
# Add to crontab: 0 2 * * * /path/to/backup.sh

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="visitor-analytics"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup the database
docker exec "$CONTAINER_NAME" sqlite3 /data/analytics.db ".backup '/data/backup-temp.db'"
docker cp "$CONTAINER_NAME":/data/backup-temp.db "$BACKUP_DIR/analytics-$DATE.db"
docker exec "$CONTAINER_NAME" rm /data/backup-temp.db

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "analytics-*.db" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/analytics-$DATE.db"
