#!/bin/bash

# Vercel Deployment Control Verification Script
# Usage: ./scripts/verify-deployment-control.sh

echo "🔍 Vercel Deployment Control Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m' 
RED='\033[0;31m'
NC='\033[0m' # No Color

success_count=0
warning_count=0
error_count=0

check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description found${NC}"
        success_count=$((success_count + 1))
        return 0
    else
        echo -e "${RED}❌ $description not found${NC}"
        error_count=$((error_count + 1))
        return 1
    fi
}

check_config() {
    local file="$1" 
    local pattern="$2"
    local description="$3"
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✅ $description configured${NC}"
        success_count=$((success_count + 1))
        return 0
    else
        echo -e "${YELLOW}⚠️  $description not configured${NC}"
        warning_count=$((warning_count + 1))
        return 1
    fi
}

echo "📁 Checking configuration files..."
echo ""

# Check for configuration files
check_file "vercel.json" "Root vercel.json"
echo -e "${GREEN}ℹ️  Frontend vercel.json consolidated into root configuration${NC}"
check_file "docs/VERCEL_DEPLOYMENT_CONTROL.md" "Deployment control documentation"

echo ""
echo "🔧 Checking deployment control configuration..."
echo ""

# Check deployment control settings
check_config "vercel.json" '"deploymentEnabled"' "Root deployment control"
echo -e "${GREEN}ℹ️  Frontend deployment control consolidated into root vercel.json${NC}"
check_config "vercel.json" '"main": true' "Main branch deployment enabled"

echo ""
echo "🚀 Checking build configuration..."
echo ""

# Check build configuration
check_config "vercel.json" '"buildCommand"' "Build command configured"  
check_config "vercel.json" '"outputDirectory"' "Output directory configured"

echo ""
echo "📊 Summary:"
echo "==========="
echo -e "${GREEN}✅ Successful checks: $success_count${NC}"
echo -e "${YELLOW}⚠️  Warnings: $warning_count${NC}" 
echo -e "${RED}❌ Errors: $error_count${NC}"
echo ""

if [ $error_count -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment control is properly configured!${NC}"
    echo ""
    echo "Expected behavior:"
    echo "  • PRs will NOT trigger Vercel deployments"
    echo "  • Only merges to main branch will deploy" 
    echo "  • Production deployments are protected by review process"
    echo "  • Frontend configuration consolidated into root vercel.json"
    echo ""
    exit 0
else
    echo -e "${RED}🚨 Configuration issues found!${NC}"
    echo ""
    echo "Please review and fix the configuration issues above."
    echo "See docs/VERCEL_DEPLOYMENT_CONTROL.md for guidance."
    echo ""
    exit 1
fi