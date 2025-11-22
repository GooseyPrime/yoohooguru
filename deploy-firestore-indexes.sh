#!/bin/bash
#
# Deploy Firestore Indexes to Production
#
# This script deploys the Firestore composite indexes required for the blog posts API.
# The indexes are defined in firestore.indexes.json
#
# IMPORTANT: This fixes the HTTP 500 error on blog posts API endpoints
#

set -e  # Exit on any error

echo "🔥 Deploying Firestore Indexes to Production..."
echo ""

# Firebase project ID
PROJECT_ID="ceremonial-tea-470904-f3"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI installed: $(firebase --version)"
echo ""

# Check if authenticated
echo "Checking Firebase authentication..."
if ! firebase projects:list --project="$PROJECT_ID" &> /dev/null; then
    echo "⚠️  Not authenticated with Firebase."
    echo ""
    echo "Please run ONE of the following:"
    echo ""
    echo "Option 1 - Interactive login:"
    echo "  firebase login"
    echo ""
    echo "Option 2 - Service account (CI/CD):"
    echo "  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json"
    echo ""
    echo "Option 3 - CI token:"
    echo "  firebase login:ci  # Generate token"
    echo "  export FIREBASE_TOKEN=<your-token>"
    echo ""
    exit 1
fi

echo "✅ Authenticated with Firebase"
echo ""

# Display indexes to be deployed
echo "📋 Indexes to be deployed:"
echo ""
cat firestore.indexes.json | jq '.indexes[] | select(.collectionGroup == "posts")' 2>/dev/null || \
    grep -A8 '"collectionGroup": "posts"' firestore.indexes.json
echo ""

# Confirm before deploying
read -p "Deploy these indexes to production? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

# Deploy indexes
echo "🚀 Deploying indexes..."
echo ""
firebase deploy --only firestore:indexes --project="$PROJECT_ID"

echo ""
echo "✅ Firestore indexes deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Wait 2-5 minutes for indexes to build"
echo "2. Test blog posts API:"
echo "   curl 'https://api.yoohoo.guru/api/blog/posts?limit=6'"
echo "3. Should return HTTP 200 instead of HTTP 500"
echo ""
