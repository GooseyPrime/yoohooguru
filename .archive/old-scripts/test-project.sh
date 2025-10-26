#!/bin/bash

# test-project.sh - Run unit and e2e tests for yoohoo.guru
# Ensures frontend is built before running backend tests

set -e

echo "🧪 Running yoohoo.guru project tests..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the repository root directory"
    exit 1
fi

# Ensure frontend is built (required for backend tests that check static serving)
echo "🔨 Ensuring frontend is built for tests..."
if [ ! -d "frontend/dist" ]; then
    echo "Building frontend..."
    npm run build:frontend
else
    echo "Frontend dist directory already exists"
fi

# Run all tests
echo "🧪 Running frontend tests..."
npm run test:frontend

echo "🧪 Running backend tests..."
npm run test:backend

echo "✅ All tests completed successfully!"