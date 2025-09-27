#!/bin/bash

# setup-env.sh - Install dependencies for local development
# Ensures frontend is built to prevent "dist directory not found" error

set -e

echo "🔧 Setting up yoohoo.guru development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the repository root directory"
    exit 1
fi

# Install all dependencies
echo "📦 Installing all dependencies..."
npm run install:all

# Build frontend to create dist directory (prevents backend error)
echo "🔨 Building frontend for development..."
npm run build:frontend

echo "✅ Development environment setup complete!"
echo ""
echo "You can now run:"
echo "  npm run dev          # Start both frontend and backend"
echo "  npm run dev:backend  # Start backend only"
echo "  npm run dev:frontend # Start frontend only"
echo ""
echo "🌐 Backend will be available at: http://localhost:3001"
echo "🎨 Frontend dev server: http://localhost:3000"