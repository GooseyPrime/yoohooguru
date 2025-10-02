# Auto-Copilot Development Environment Setup Guide

This document describes the complete setup for the Auto-Copilot operating loop development environment.

## Overview

The Auto-Copilot operating loop has been configured to:
1. Run QA tests locally using Playwright
2. Use proper development/test credentials (not production)
3. Support the complete development workflow

## What Was Implemented

### 1. QA Test Infrastructure

**Files Created/Modified:**
- `qa/package.json` - Added Playwright dependencies
- `qa/playwright.config.js` - Fixed syntax (TypeScript → JavaScript)
- `qa/tests/*.spec.js` - Converted test files to JavaScript with proper extensions
- `qa/README.md` - Documentation for running tests

**Changes:**
- Renamed `playwright.config` → `playwright.config.js`
- Fixed import syntax: `import` → `require()`
- Fixed export syntax: `export default` → `module.exports`
- Fixed testDir path: `qa/tests` → `tests` (relative path)
- Converted TypeScript type annotations to plain JavaScript
- Added `.js` extensions to all test files

### 2. Root Package.json Scripts

**Added Scripts:**
- `qa:test` - Run Playwright tests from root
- `qa:install` - Install QA dependencies
- Updated `install:all` to include QA dependencies

### 3. Backend Configuration

**Files Created/Modified:**
- `backend/.env` - Development environment configuration (NOT committed to git)
- `backend/package.json` - Added `ensure-frontend-built` script

**ensure-frontend-built Script:**
```bash
cd ../frontend && (test -d dist || npm run build:fast)
```
This ensures the frontend is built before the backend starts in development mode.

### 4. Frontend Build System

**Files Modified:**
- `frontend/package.json` - Fixed `build:fast` command
- `frontend/webpack.config.js` - Added `minimize` option for fast builds

**Changes:**
- Changed `--optimization-minimize=false` CLI flag to `FAST_BUILD=true` env var
- Added `minimize: !isDevelopment && !isFastBuild` in webpack config

### 5. Documentation Updates

**Files Created/Modified:**
- `.env.example` - Added warnings about test vs production keys
- `qa/README.md` - Complete QA testing documentation
- `AUTOCOPILOT_SETUP.md` - This file

## Installation

### Full Setup
```bash
# Install all dependencies (root, frontend, backend, qa)
npm run install:all

# Install Playwright browsers
cd qa && npx playwright install
```

### Individual Steps
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd backend && npm install

# QA dependencies
npm run qa:install
cd qa && npx playwright install
```

## Running the Development Environment

### Start Both Servers
```bash
# From root directory
npm run dev
```

This starts both frontend (port 3000) and backend (port 3001) concurrently.

### Start Individually

**Backend:**
```bash
cd backend && npm run dev
```
- Runs on http://localhost:3001
- Serves API endpoints
- Includes AI curation agents (news, blog)

**Frontend:**
```bash
cd frontend && npm run dev
```
- Runs on http://localhost:3000
- Webpack dev server with hot reload

## Running QA Tests

### Prerequisites
Both servers must be running:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Tests
npm run qa:test
```

### Test Commands
```bash
# Run all tests
npm run qa:test

# Run with UI
cd qa && npm run test:ui

# Run in headed mode (see browser)
cd qa && npm run test:headed

# Debug tests
cd qa && npm run test:debug
```

## Environment Configuration

### Development (.env)
Create `backend/.env` with development/test credentials:
- Use `sk_test_*` for Stripe (NOT `sk_live_*`)
- Use development Firebase project or emulators
- See `.env.example` for template

### Production (Railway)
Set production environment variables in Railway dashboard:
- Use `sk_live_*` for Stripe
- Use production Firebase credentials
- Set `NODE_ENV=production`
- Set `SERVE_FRONTEND=false`

## Security Best Practices

### ⚠️ CRITICAL
1. **NEVER** commit `.env` files to git
2. **NEVER** use production keys (`sk_live_*`) in development
3. **ALWAYS** use test keys (`sk_test_*`) for local development
4. **ALWAYS** store production credentials in Railway secrets

### Key Types
- **Development**: `sk_test_*`, `pk_test_*` (Stripe test mode)
- **Production**: `sk_live_*`, `pk_live_*` (Stripe live mode, Railway only)

## Auto-Copilot Operating Loop

According to `/copilot/AutoCopilot.prompt.md`, the operating loop is:

1. **Sync context**: Read `/spec/site-spec.md` and `/spec/liability-ops-standard.md`
2. **Run QA**: Execute `npm run qa:test`
3. **Plan PR**: Create surgical PR with conventional commits
4. **Implement**: Make minimal changes to pass tests and spec
5. **Document**: Update README or `/spec` for public behavior changes
6. **Re-run QA**: Verify tests pass
7. **Submit PR**: Include what/why/how, checklist, and spec mapping

### Success Criteria
A change is "Done" only if ALL are true:
- ✅ QA tests pass (`npm run qa:test`)
- ✅ No console errors on covered routes
- ✅ Behavior matches site spec
- ✅ No violations of liability ops standard
- ✅ Clean CI build
- ✅ No secrets committed
- ✅ Stripe endpoints functional with test keys
- ✅ Subdomain routing functional
- ✅ Blog AI drafts working

## Current Status

### ✅ Completed
- QA test infrastructure setup
- Playwright configuration fixed
- Test files converted to JavaScript
- Frontend and backend servers start successfully
- Environment configuration documented
- Scripts added to package.json

### ⚠️ Known Issues
1. **CSP Violations**: Some console errors for Google Analytics and Vercel scripts
   - These are expected in development mode
   - CSP headers need to be updated to include these domains
2. **Subdomain Tests Failing**: Tests try to access production URLs
   - Expected in local development
   - Will pass when testing against deployed environment
3. **Feature Flags Endpoint**: Returns HTML instead of JSON in some cases
   - Backend endpoint may need adjustment

### 🔄 Next Steps
1. Fix CSP headers to allow necessary third-party scripts
2. Configure subdomain tests for local development
3. Fix feature flags endpoint to return JSON
4. Address any remaining console errors identified by tests

## Troubleshooting

### Frontend build fails
```bash
cd frontend && rm -rf node_modules dist
npm install
npm run build:fast
```

### Backend fails to start
```bash
# Check if .env file exists
ls -la backend/.env

# If missing, copy from example
cp .env.example backend/.env

# Edit with your credentials
nano backend/.env
```

### Playwright tests fail with "browser not found"
```bash
cd qa && npx playwright install
```

### Port already in use
```bash
# Find process on port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

## References

- [Auto-Copilot Prompt](copilot/AutoCopilot.prompt.md)
- [Site Specification](spec/site-spec.md)
- [Liability Ops Standard](spec/liability-ops-standard.md)
- [QA Testing Documentation](qa/README.md)
- [Playwright Documentation](https://playwright.dev/)
- [Environment Variables Guide](docs/ENVIRONMENT_VARIABLES.md)

---

**Last Updated**: October 2, 2025
**Version**: 1.0.0
