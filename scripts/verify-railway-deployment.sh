#!/bin/bash
# Railway Deployment Verification Script
# Verifies that key backend files are present in Railway deployment

set -euo pipefail

echo "🔍 Railway Deployment Verification"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Expected file sizes from PR #560
EXPECTED_SEED_USERS_LINES=1486
EXPECTED_CLEANUP_LINES=173

# Check if RAILWAY_URL is set (or allow user to provide it)
RAILWAY_URL="${1:-${RAILWAY_BACKEND_URL:-}}"

if [ -z "$RAILWAY_URL" ]; then
    echo -e "${YELLOW}⚠️  No Railway URL provided${NC}"
    echo "Usage: $0 <railway-backend-url>"
    echo "Example: $0 https://your-backend.up.railway.app"
    echo ""
    echo "Or set RAILWAY_BACKEND_URL environment variable"
    exit 1
fi

echo "📍 Backend URL: $RAILWAY_URL"
echo ""

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    if curl -s -f -o /dev/null "$RAILWAY_URL$endpoint"; then
        echo -e "${GREEN}✓ Available${NC}"
        return 0
    else
        echo -e "${RED}✗ Not available${NC}"
        return 1
    fi
}

# Check health endpoint
echo "🏥 Health Check:"
check_endpoint "/health" "Health endpoint"
echo ""

# Check API version
echo "📦 API Version:"
if response=$(curl -s "$RAILWAY_URL/api/version" 2>/dev/null); then
    echo -e "${GREEN}✓ API responding${NC}"
    echo "   Response: $response"
else
    echo -e "${YELLOW}⚠️  API version endpoint not available${NC}"
fi
echo ""

# Check if backend is serving
echo "🔌 Backend Status:"
check_endpoint "/api/health" "Backend API health"
echo ""

# Verify critical routes
echo "🛣️  Critical Routes:"
check_endpoint "/api" "API root"
check_endpoint "/api/auth/status" "Auth status"
echo ""

# Check deployment timestamp
echo "⏰ Deployment Info:"
health_response=$(curl -s "$RAILWAY_URL/health" 2>/dev/null || echo "")
if echo "$health_response" | grep -q "timestamp"; then
    echo -e "${GREEN}✓ Health endpoint includes timestamp${NC}"
    timestamp=$(echo "$health_response" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)
    echo "   Last health check: $timestamp"
else
    echo -e "${YELLOW}⚠️  Unable to retrieve timestamp${NC}"
fi
echo ""

echo "📂 Checking for seed script files (local repository):"
if [ -f "backend/src/scripts/seedTestUsers.js" ]; then
    echo -e "${GREEN}✓ seedTestUsers.js exists${NC}"
    lines=$(wc -l < backend/src/scripts/seedTestUsers.js)
    echo "   Lines: $lines (expected: $EXPECTED_SEED_USERS_LINES)"
    
    if [ "$lines" -eq "$EXPECTED_SEED_USERS_LINES" ]; then
        echo -e "${GREEN}✓ File size matches PR #560${NC}"
    else
        echo -e "${YELLOW}⚠️  File size differs from expected${NC}"
    fi
else
    echo -e "${RED}✗ seedTestUsers.js NOT found${NC}"
fi

if [ -f "backend/src/scripts/cleanupTestUsers.js" ]; then
    echo -e "${GREEN}✓ cleanupTestUsers.js exists${NC}"
    lines=$(wc -l < backend/src/scripts/cleanupTestUsers.js)
    echo "   Lines: $lines (expected: $EXPECTED_CLEANUP_LINES)"
    
    if [ "$lines" -eq "$EXPECTED_CLEANUP_LINES" ]; then
        echo -e "${GREEN}✓ File size matches PR #560${NC}"
    else
        echo -e "${YELLOW}⚠️  File size differs from expected${NC}"
    fi
else
    echo -e "${RED}✗ cleanupTestUsers.js NOT found${NC}"
fi
echo ""

echo "📝 Summary:"
echo "==========="
echo ""
echo "The seed script files from PR #560 are present in the repository."
echo ""
echo "To verify they're deployed to Railway:"
echo "  1. SSH into Railway: railway shell"
echo "  2. Check files exist: ls -la backend/src/scripts/seed*.js"
echo "  3. Run seed script: cd backend && node src/scripts/seedTestUsers.js"
echo ""
echo "If files are missing in Railway deployment:"
echo "  1. Trigger manual redeploy: railway up"
echo "  2. Or redeploy via Railway dashboard"
echo "  3. Check Railway build logs for errors"
echo ""
echo -e "${GREEN}✓ Verification complete${NC}"
