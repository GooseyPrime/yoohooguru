# PR #560 Deployment Issue - Resolution Guide

## Problem Summary

PR #560 ("Create database seed file with sample users") was successfully merged to `main` on December 8, 2025 at 18:42:54 UTC. The PR added two files:

1. `backend/src/scripts/seedTestUsers.js` (1,486 lines)
2. `backend/src/scripts/cleanupTestUsers.js` (173 lines)

**These files ARE present in the repository** but may not have deployed to Railway due to a configuration issue.

## Root Cause Analysis

### Issue 1: Broken Railway Start Command

The `railway.json` file had an incorrect `startCommand`:

```json
"startCommand": "cd backend && npm start && node -r newrelic src/index.js"
```

**Problems:**
- Uses `&&` to chain commands, but `npm start` runs indefinitely, so the second command never executes
- References `newrelic` package which is not installed
- Would cause deployment failures or startup issues

**Fixed to:**
```json
"startCommand": "cd backend && npm start"
```

### Issue 2: Railway Auto-Deploy May Not Be Configured

Railway may not be configured to automatically deploy when code is pushed to the `main` branch. This would explain why the merged PR didn't trigger a deployment.

## Verification Steps

### 1. Verify Files Are in Repository

```bash
# Check files exist locally
ls -la backend/src/scripts/seed*.js

# Verify they're tracked by git
git ls-files backend/src/scripts/seed*.js

# Check line counts match PR #560
wc -l backend/src/scripts/seedTestUsers.js backend/src/scripts/cleanupTestUsers.js
# Expected output:
#  1486 backend/src/scripts/seedTestUsers.js
#   173 backend/src/scripts/cleanupTestUsers.js
#  1659 total
```

**Result:** ✅ Files are present in repository

### 2. Check Railway Deployment Status

Use the verification script:

```bash
./scripts/verify-railway-deployment.sh https://your-backend.up.railway.app
```

Or manually check via Railway CLI:

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Check if files are deployed
railway shell
ls -la backend/src/scripts/seed*.js
exit
```

## Resolution Options

### Option A: Manual Redeploy via Railway CLI (Recommended)

```bash
# 1. Install Railway CLI (if not already installed)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link to your project (if not already linked)
railway link

# 4. Trigger a redeploy
railway up

# 5. Monitor deployment
railway logs --tail
```

### Option B: Manual Redeploy via Railway Dashboard

1. Go to https://railway.app
2. Select your `yoohooguru` project
3. Select the backend service
4. Click "Deploy" → "Redeploy" or "New Deployment"
5. Select the `main` branch
6. Monitor the deployment logs

### Option C: Configure Auto-Deploy (For Future)

1. Go to Railway dashboard → Your project → Backend service
2. Click "Settings"
3. Under "Deployments", ensure:
   - **Source Repo:** `GooseyPrime/yoohooguru`
   - **Branch:** `main`
   - **Auto Deploy:** Enabled ✅
4. Save settings

## Post-Deployment Verification

After redeploying, verify the seed scripts are available:

```bash
# SSH into Railway container
railway shell

# Navigate to scripts directory
cd backend/src/scripts

# List seed files
ls -la seed*.js

# Should see:
# cleanupTestUsers.js
# seedTestUsers.js

# Test run (dry-run mode)
node cleanupTestUsers.js --dry-run

exit
```

## Using the Seed Scripts

### Seeding Test Data

```bash
# Via Railway shell
railway shell
cd backend
node src/scripts/seedTestUsers.js

# Or via Railway CLI (execute command directly)
railway run node backend/src/scripts/seedTestUsers.js
```

**What it does:**
- Creates 25 test users (5 per role: guru, gunu, guest, angel, hero-guru)
- All users named "Testa [LastName]" for easy identification
- Located within 25 miles of Johnson City, TN
- Uses REAL addresses from public buildings (Google Maps searchable)
- Creates complete test data: gigs, skills, sessions, exchanges, applications

### Cleaning Up Test Data

```bash
# Dry run (preview what will be deleted)
railway run node backend/src/scripts/cleanupTestUsers.js --dry-run

# Actual cleanup
railway run node backend/src/scripts/cleanupTestUsers.js
```

## Prevention for Future PRs

### 1. Enable Railway Auto-Deploy
Ensure Railway is configured to automatically deploy when PRs are merged to `main`.

### 2. Add Deployment Verification to CI
Add a workflow step that verifies Railway deployment status after merges:

```yaml
# .github/workflows/verify-deployment.yml
name: Verify Deployment
on:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Verify Railway Deployment
        run: ./scripts/verify-railway-deployment.sh ${{ secrets.RAILWAY_BACKEND_URL }}
```

### 3. Railway Webhook Notifications
Configure Railway to send webhook notifications to a Slack channel or GitHub when deployments complete.

## Testing Locally

To test the seed scripts locally before using in production:

```bash
# Ensure you have Firebase credentials configured
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"

# Or use Firebase emulator
cd backend
firebase emulators:start --only firestore,auth

# In another terminal
cd backend
node src/scripts/seedTestUsers.js
```

## Related Documentation

- [Railway Deployment Guide](RAILWAY_DEPLOYMENT.md)
- [Environment Configuration Guide](ENVIRONMENT_CONFIGURATION_GUIDE.md)
- [Production Deployment Fix](PRODUCTION_DEPLOYMENT_FIX.md)

## Summary

**Status:** Files from PR #560 ARE in the repository ✅  
**Issue:** Files may not be deployed to Railway ⚠️  
**Root Cause:** Broken `railway.json` startCommand + possible missing auto-deploy configuration  
**Fix Applied:** Corrected `railway.json` startCommand  
**Action Required:** Manual redeploy to Railway using Option A or B above  
**Prevention:** Enable Railway auto-deploy for `main` branch  

---

**Last Updated:** December 9, 2025  
**Fixed By:** GitHub Copilot Agent  
**PR:** #560 - Create database seed file with sample users
