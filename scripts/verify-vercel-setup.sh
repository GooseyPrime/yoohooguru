#!/bin/bash
# Vercel Gateway Architecture - Configuration Verification Script
# This script helps verify that your Vercel project is properly configured

set -e

echo "🔍 Vercel Gateway Architecture - Configuration Verification"
echo "============================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is authenticated
echo -e "${BLUE}Step 1: Checking Vercel CLI authentication...${NC}"
if npx vercel whoami &>/dev/null; then
    VERCEL_USER=$(npx vercel whoami 2>/dev/null)
    echo -e "${GREEN}✓ Authenticated as: $VERCEL_USER${NC}"
else
    echo -e "${RED}✗ Not authenticated with Vercel CLI${NC}"
    echo -e "${YELLOW}  Run: npx vercel login${NC}"
    echo ""
    echo "After authentication, run this script again."
    exit 1
fi
echo ""

# Check if project is linked
echo -e "${BLUE}Step 2: Checking Vercel project linking...${NC}"
if [ -d ".vercel" ] || [ -d "apps/main/.vercel" ]; then
    echo -e "${GREEN}✓ Project is linked to Vercel${NC}"

    # Get project info
    PROJECT_JSON=$(npx vercel inspect 2>/dev/null || echo "{}")
    if [ "$PROJECT_JSON" != "{}" ]; then
        echo "  Project details retrieved"
    fi
else
    echo -e "${RED}✗ Project not linked to Vercel${NC}"
    echo -e "${YELLOW}  Run: npx vercel link${NC}"
    echo "  Then run this script again."
    exit 1
fi
echo ""

# Check project settings
echo -e "${BLUE}Step 3: Retrieving project configuration...${NC}"
echo "Fetching project details..."
npx vercel project ls 2>/dev/null | head -20
echo ""

# List domains
echo -e "${BLUE}Step 4: Checking configured domains...${NC}"
echo "Fetching domains for the project..."
npx vercel domains ls 2>/dev/null | head -40
echo ""

# Expected domains
EXPECTED_DOMAINS=(
    "www.yoohoo.guru"
    "angel.yoohoo.guru"
    "coach.yoohoo.guru"
    "heroes.yoohoo.guru"
    "dashboard.yoohoo.guru"
    "art.yoohoo.guru"
    "business.yoohoo.guru"
    "coding.yoohoo.guru"
    "cooking.yoohoo.guru"
    "crafts.yoohoo.guru"
    "data.yoohoo.guru"
    "design.yoohoo.guru"
    "finance.yoohoo.guru"
    "fitness.yoohoo.guru"
    "gardening.yoohoo.guru"
    "history.yoohoo.guru"
    "home.yoohoo.guru"
    "investing.yoohoo.guru"
    "language.yoohoo.guru"
    "marketing.yoohoo.guru"
    "math.yoohoo.guru"
    "music.yoohoo.guru"
    "photography.yoohoo.guru"
    "sales.yoohoo.guru"
    "science.yoohoo.guru"
    "sports.yoohoo.guru"
    "tech.yoohoo.guru"
    "wellness.yoohoo.guru"
    "writing.yoohoo.guru"
)

echo -e "${BLUE}Expected domains (29 total):${NC}"
for domain in "${EXPECTED_DOMAINS[@]}"; do
    echo "  - $domain"
done
echo ""

# Check environment variables
echo -e "${BLUE}Step 5: Checking environment variables...${NC}"
echo "Note: Retrieving environment variable names only (values are hidden)"
npx vercel env ls 2>/dev/null || echo "Unable to retrieve environment variables"
echo ""

# Required environment variables
REQUIRED_ENV_VARS=(
    "NEXT_PUBLIC_API_URL"
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    "NEXT_PUBLIC_FIREBASE_APP_ID"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "AUTH_COOKIE_DOMAIN"
)

echo -e "${BLUE}Required environment variables:${NC}"
for var in "${REQUIRED_ENV_VARS[@]}"; do
    echo "  - $var"
done
echo ""

# Check middleware configuration
echo -e "${BLUE}Step 6: Verifying middleware configuration...${NC}"
if [ -f "apps/main/middleware.ts" ]; then
    echo -e "${GREEN}✓ Middleware file exists: apps/main/middleware.ts${NC}"

    # Check subdomain map
    SUBDOMAIN_COUNT=$(grep -c '".*":' apps/main/middleware.ts || echo "0")
    echo "  Subdomain mappings found: $SUBDOMAIN_COUNT"
else
    echo -e "${RED}✗ Middleware file not found${NC}"
fi
echo ""

# Check page structure
echo -e "${BLUE}Step 7: Verifying page structure...${NC}"
if [ -d "apps/main/pages/_apps" ]; then
    APPS_COUNT=$(ls -1 apps/main/pages/_apps | wc -l)
    echo -e "${GREEN}✓ Apps directory exists with $APPS_COUNT subdomain folders${NC}"
    echo "  Subdomain folders:"
    ls -1 apps/main/pages/_apps | sed 's/^/    - /'
else
    echo -e "${RED}✗ Apps directory not found${NC}"
fi
echo ""

# Check vercel.json
echo -e "${BLUE}Step 8: Verifying vercel.json configuration...${NC}"
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓ vercel.json exists${NC}"

    # Check for key configurations
    if grep -q "buildCommand" vercel.json; then
        BUILD_CMD=$(grep "buildCommand" vercel.json)
        echo "  Build command: ${BUILD_CMD}"
    fi

    if grep -q "outputDirectory" vercel.json; then
        OUTPUT_DIR=$(grep "outputDirectory" vercel.json)
        echo "  Output directory: ${OUTPUT_DIR}"
    fi

    if grep -q "installCommand" vercel.json; then
        INSTALL_CMD=$(grep "installCommand" vercel.json)
        echo "  Install command: ${INSTALL_CMD}"
    fi
else
    echo -e "${YELLOW}⚠ vercel.json not found (may be configured in dashboard)${NC}"
fi
echo ""

# Summary
echo "============================================================"
echo -e "${BLUE}Verification Summary${NC}"
echo "============================================================"
echo ""
echo "To complete the verification:"
echo "1. Login to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Navigate to your project settings"
echo "3. Verify the following:"
echo ""
echo "   ${YELLOW}Build & Development Settings:${NC}"
echo "   - Root Directory: apps/main (or empty)"
echo "   - Framework Preset: Next.js"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Node.js Version: 20.x"
echo ""
echo "   ${YELLOW}Domains (29 total):${NC}"
echo "   - All 29 subdomains listed above should be added"
echo ""
echo "   ${YELLOW}Environment Variables:${NC}"
echo "   - All required variables listed above should be set"
echo "   - Especially critical: AUTH_COOKIE_DOMAIN=.yoohoo.guru"
echo ""
echo "============================================================"
echo -e "${GREEN}Script completed!${NC}"
echo ""
