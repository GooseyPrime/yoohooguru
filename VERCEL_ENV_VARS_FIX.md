# Vercel Environment Variables Fix

## Issue Fixed
Fixed Vercel deployment failures caused by referencing non-existent secrets in `frontend/vercel.json`.

**Error**: `Environment Variable "REACT_APP_API_URL" references Secret "react_app_api_url", which does not exist.`

## Solution
Removed the `env` section from `frontend/vercel.json` that was attempting to reference Vercel secrets using `@secret_name` syntax.

## Before Fix
```json
{
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_FIREBASE_API_KEY": "@react_app_firebase_api_key",
    "REACT_APP_FIREBASE_PROJECT_ID": "@react_app_firebase_project_id",
    "REACT_APP_FIREBASE_AUTH_DOMAIN": "@react_app_firebase_auth_domain",
    "REACT_APP_BRAND_NAME": "@react_app_brand_name"
  }
}
```

## After Fix
Environment variables are now configured directly in the Vercel dashboard under:
**Project Settings → Environment Variables**

Required environment variables for production:
- `REACT_APP_API_URL=https://api.yoohoo.guru`
- `REACT_APP_FIREBASE_API_KEY=<your-firebase-key>`
- `REACT_APP_FIREBASE_PROJECT_ID=<your-project-id>`
- `REACT_APP_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com`
- `REACT_APP_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>`
- `REACT_APP_FIREBASE_APP_ID=<your-app-id>`

## Benefits
1. ✅ **Deployment works** - No more missing secret errors
2. ✅ **Better security** - Environment variables managed in Vercel dashboard
3. ✅ **Flexibility** - Different values for different environments (preview/production)
4. ✅ **Standard practice** - Follows Vercel's recommended approach

## Files Updated
- `frontend/vercel.json` - Removed env section
- `README.md` - Updated example configuration
- `docs/DEPLOYMENT.md` - Updated deployment instructions

This fix resolves issue #159.