FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create data directory for SQLite database
RUN mkdir -p /data

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/analytics.db

# Start the server
CMD ["node", "src/index.js"]
