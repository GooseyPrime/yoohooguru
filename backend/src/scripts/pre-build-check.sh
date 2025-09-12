#!/bin/bash
# Railway Pre-Build Safety Check
# Ensures no frontend files are accidentally built in the Railway deployment

echo "🚨 Railway Pre-Build Safety Check"
echo "================================="

# Check if we're in Railway environment
if [ "$RAILWAY_ENVIRONMENT" = "production" ] || [ -n "$RAILWAY_SERVICE_NAME" ]; then
    echo "✅ Railway environment detected"
    
    # Ensure SERVE_FRONTEND is false
    if [ "$SERVE_FRONTEND" = "true" ]; then
        echo "❌ ERROR: SERVE_FRONTEND=true in Railway deployment"
        echo "🔧 Railway should NEVER serve frontend files"
        echo "💡 Set SERVE_FRONTEND=false in Railway environment variables"
        exit 1
    fi
    
    # Check if frontend directory exists (should not in Railway)
    if [ -d "../../frontend" ]; then
        echo "⚠️  WARNING: Frontend directory detected in Railway deployment"
        echo "🔧 This deployment should only contain backend files"
        echo "💡 Update nixpacks.toml to exclude frontend directory"
    fi
    
    # Ensure we're in backend directory
    if [ ! -f "src/index.js" ]; then
        echo "❌ ERROR: Not in backend directory"
        echo "🔧 Railway should build from backend/ directory only"
        exit 1
    fi
    
    echo "✅ Safety checks passed - proceeding with backend-only build"
    
else
    echo "ℹ️  Not in Railway environment - skipping safety checks"
fi

# Continue with normal build
echo "🔨 Starting backend build..."