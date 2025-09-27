#!/bin/bash

# start-app.sh - Install dependencies and start the yoohoo.guru application
# This script ensures frontend is built before starting the backend

set -e

echo "🚀 Starting yoohoo.guru application setup..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the repository root directory"
    exit 1
fi

# Install all dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend (required for backend to serve static files)
echo "🔨 Building frontend..."
npm run build:frontend

# Start the application
echo "🎯 Starting the application..."
npm run dev