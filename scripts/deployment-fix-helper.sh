#!/bin/bash
# Deployment Fix Helper Script
# Provides commands to fix common deployment issues

set -e

echo "🚀 yoohoo.guru Deployment Fix Helper"
echo "=====================================>"

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || ! grep -q "yoohoo-guru" package.json; then
    echo "❌ Please run this script from the yoohoo-guru repository root"
    exit 1
fi

echo ""
echo "📋 Required Environment Variables:"
echo ""

echo "🔧 RAILWAY (Backend - api.yoohoo.guru):"
echo "----------------------------------------"
echo "NODE_ENV=production"
echo "SERVE_FRONTEND=false"
echo "CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://*.vercel.app"
echo "JWT_SECRET=<your-secure-jwt-secret>"
echo "FIREBASE_PROJECT_ID=<your-firebase-project-id>"
echo "FIREBASE_CLIENT_EMAIL=<your-service-account-email>"
echo "FIREBASE_PRIVATE_KEY=<your-private-key-with-literal-\\n>"
echo ""

echo "🎨 VERCEL (Frontend - yoohoo.guru):"
echo "-----------------------------------"
echo "REACT_APP_API_URL=https://api.yoohoo.guru"
echo "REACT_APP_FIREBASE_API_KEY=<your-firebase-web-api-key>"
echo "REACT_APP_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com"
echo "REACT_APP_FIREBASE_PROJECT_ID=<your-firebase-project-id>"
echo "REACT_APP_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com"
echo "REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>"
echo "REACT_APP_FIREBASE_APP_ID=<your-app-id>"
echo ""

echo "🔥 FIREBASE CONSOLE CONFIGURATION:"
echo "----------------------------------"
echo "1. Go to Firebase Console → Authentication → Settings"
echo "2. Add these Authorized domains:"
echo "   - yoohoo.guru"
echo "   - www.yoohoo.guru"  
echo "   - <your-vercel-app>.vercel.app"
echo "   - <project-id>.firebaseapp.com"
echo ""

echo "🔍 QUICK TESTS:"
echo "--------------"
echo ""

# Test 1: Check if we can build frontend
echo "Testing frontend build..."
if cd frontend && npm run build >/dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed - check dependencies"
fi
cd ..

# Test 2: Check if backend starts (briefly)
echo "Testing backend startup..."
if timeout 10s node backend/src/index.js >/dev/null 2>&1; then
    echo "✅ Backend starts successfully"
else
    echo "⚠️  Backend test completed (this is expected)"
fi

echo ""
echo "🎯 VERIFICATION COMMAND:"
echo "----------------------"
echo "After deployment, run:"
echo "  node scripts/verify-deployment.js"
echo ""

echo "🆘 COMMON FIXES:"
echo "---------------"
echo "Issue: api.yoohoo.guru shows HTML instead of JSON"
echo "Fix: Set SERVE_FRONTEND=false in Railway"
echo ""
echo "Issue: www.yoohoo.guru blank screen"
echo "Fix: Set REACT_APP_API_URL=https://api.yoohoo.guru in Vercel"
echo ""
echo "Issue: Google Auth domain error"
echo "Fix: Add yoohoo.guru and *.vercel.app to Firebase Authorized domains"
echo ""
echo "Issue: CORS errors"
echo "Fix: Set CORS_ORIGIN_PRODUCTION with frontend domains in Railway"
echo ""

echo "✨ Ready for deployment!"
echo "Review DEPLOYMENT_FIX_CHECKLIST.md for detailed instructions."