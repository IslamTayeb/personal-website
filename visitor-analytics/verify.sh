#!/bin/bash

# Visitor Analytics System Verification Script
# Run this to check if everything is set up correctly

echo "🔍 Verifying Visitor Analytics System Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
echo "1. Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Docker is installed"
    if docker ps &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} Docker daemon is running"
    else
        echo -e "   ${RED}✗${NC} Docker daemon is not running"
        echo -e "   ${YELLOW}→${NC} Please start Docker Desktop"
    fi
else
    echo -e "   ${RED}✗${NC} Docker is not installed"
    echo -e "   ${YELLOW}→${NC} Install from https://docs.docker.com/get-docker/"
fi
echo ""

# Check required files
echo "2. Checking required files..."
files=(
    "backend/package.json"
    "backend/Dockerfile"
    "backend/src/index.js"
    "backend/src/db.js"
    "backend/src/discord.js"
    "backend/src/geolocation.js"
    "backend/src/utils.js"
    "docker-compose.yml"
    ".env"
    "README.md"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file"
        all_files_exist=false
    fi
done
echo ""

# Check .env configuration
echo "3. Checking .env configuration..."
if [ -f ".env" ]; then
    if grep -q "DISCORD_BOT_TOKEN=.*your.*" .env || grep -q "DISCORD_BOT_TOKEN=test_token" .env; then
        echo -e "   ${YELLOW}⚠${NC} DISCORD_BOT_TOKEN needs to be configured"
        echo -e "   ${YELLOW}→${NC} Update with your real Discord bot token"
    else
        echo -e "   ${GREEN}✓${NC} DISCORD_BOT_TOKEN is set"
    fi

    if grep -q "DISCORD_CHANNEL_ID=123456" .env; then
        echo -e "   ${YELLOW}⚠${NC} DISCORD_CHANNEL_ID needs to be configured"
        echo -e "   ${YELLOW}→${NC} Update with your real Discord channel ID"
    else
        echo -e "   ${GREEN}✓${NC} DISCORD_CHANNEL_ID is set"
    fi

    if grep -q "ALLOWED_ORIGINS=" .env; then
        echo -e "   ${GREEN}✓${NC} ALLOWED_ORIGINS is set"
    else
        echo -e "   ${YELLOW}⚠${NC} ALLOWED_ORIGINS not found"
    fi
else
    echo -e "   ${RED}✗${NC} .env file not found"
    echo -e "   ${YELLOW}→${NC} Copy .env.example to .env and configure it"
fi
echo ""

# Check Next.js integration
echo "4. Checking Next.js integration..."
if [ -f "../my-portfolio/app/_components/VisitorTracker.tsx" ]; then
    echo -e "   ${GREEN}✓${NC} VisitorTracker component exists"
else
    echo -e "   ${RED}✗${NC} VisitorTracker component not found"
fi

if [ -f "../my-portfolio/app/layout.tsx" ]; then
    if grep -q "VisitorTracker" ../my-portfolio/app/layout.tsx; then
        echo -e "   ${GREEN}✓${NC} VisitorTracker integrated in layout"
    else
        echo -e "   ${YELLOW}⚠${NC} VisitorTracker not added to layout"
        echo -e "   ${YELLOW}→${NC} See INTEGRATION.md"
    fi
fi

if [ -f "../my-portfolio/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_ANALYTICS_API" ../my-portfolio/.env.local; then
        echo -e "   ${GREEN}✓${NC} Next.js environment variables configured"
    else
        echo -e "   ${YELLOW}⚠${NC} Analytics API not configured in Next.js"
    fi
else
    echo -e "   ${YELLOW}⚠${NC} .env.local not found in Next.js app"
    echo -e "   ${YELLOW}→${NC} Create from .env.local.example"
fi
echo ""

# Check if backend is running
echo "5. Checking backend status..."
if docker ps | grep -q "visitor-analytics"; then
    echo -e "   ${GREEN}✓${NC} Backend container is running"

    # Test health endpoint
    if curl -s http://localhost:3001/health &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} API health check passed"
    else
        echo -e "   ${YELLOW}⚠${NC} API not responding (may still be starting)"
    fi
else
    echo -e "   ${YELLOW}⚠${NC} Backend container is not running"
    echo -e "   ${YELLOW}→${NC} Start with: docker-compose up -d"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Summary:"
if $all_files_exist; then
    echo -e "${GREEN}✓${NC} All required files are present"
else
    echo -e "${RED}✗${NC} Some files are missing"
fi

echo ""
echo "📚 Next Steps:"
echo "   1. Configure .env with your Discord credentials"
echo "   2. Start backend: docker-compose up -d"
echo "   3. Configure Next.js .env.local"
echo "   4. Start Next.js: npm run dev"
echo "   5. Test by visiting your site"
echo ""
echo "📖 Documentation:"
echo "   • Quick Start: ./QUICK_START.md"
echo "   • Full Guide: ./README.md"
echo "   • Testing: ./TESTING.md"
echo ""
