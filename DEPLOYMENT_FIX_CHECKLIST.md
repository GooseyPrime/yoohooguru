# Deployment Fix Checklist - Issue #127

## ✅ Completed Fixes

### Backend Configuration (Railway)
- [x] **Fixed nixpacks.toml** - Only builds backend, not frontend
- [x] **Fixed railway.json** - Explicit backend start command
- [x] **Environment Variables Required:**
  - `NODE_ENV=production` 
  - `SERVE_FRONTEND=false` (critical!)
  - `CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://*.vercel.app`
  - Firebase config (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
  - `JWT_SECRET=<secure-secret>`

### Frontend Configuration (Vercel)
- [x] **Fixed environment variable names** - Must use `REACT_APP_*` not `VITE_*`
- [x] **Fixed CSP headers** - Added `https://api.yoohoo.guru` to connect-src
- [x] **Environment Variables Required:**
  ```
  REACT_APP_API_URL=https://api.yoohoo.guru/api
  REACT_APP_FIREBASE_API_KEY=<firebase-key>
  REACT_APP_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
  REACT_APP_FIREBASE_PROJECT_ID=<project-id>
  REACT_APP_FIREBASE_STORAGE_BUCKET=<project>.appspot.com
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
  REACT_APP_FIREBASE_APP_ID=<app-id>
  ```

### Firebase Authentication
- [x] **Authorized Domains** must include:
  - `yoohoo.guru`
  - `www.yoohoo.guru`
  - `<vercel-app-name>.vercel.app` (your Vercel deployment URL)
  - Any preview deployment URLs

## 🔍 Verification Steps

### 1. Backend API Verification (api.yoohoo.guru)
```bash
# Should return API info, NOT HTML
curl -i https://api.yoohoo.guru/
# Expected: JSON response with "API-only server" message

# Should return health check
curl -i https://api.yoohoo.guru/health
# Expected: 200 OK with JSON health data

# Should return API endpoints
curl -i https://api.yoohoo.guru/api
# Expected: 200 OK with API welcome message
```

### 2. Frontend Verification (www.yoohoo.guru)
```bash
# Should return HTML, NOT JSON
curl -i https://www.yoohoo.guru/
# Expected: HTML with <!DOCTYPE html>

# Should return HTML for app routes
curl -i https://www.yoohoo.guru/skills
# Expected: HTML (React Router handles routing)
```

### 3. CORS Verification
```javascript
// Test in browser console on https://yoohoo.guru
fetch('https://api.yoohoo.guru/health')
  .then(r => r.json())
  .then(console.log);
// Expected: No CORS errors, returns health data
```

### 4. Google Authentication Test
1. Visit https://yoohoo.guru/login
2. Click "Continue with Google"  
3. Complete OAuth flow
4. Should redirect back to dashboard without errors

## 🚨 Common Issues & Solutions

### Issue: "api.yoohoo.guru shows HTML instead of API"
**Cause:** Backend still has `SERVE_FRONTEND=true` or missing  
**Fix:** Set `SERVE_FRONTEND=false` in Railway environment variables

### Issue: "www.yoohoo.guru shows blank screen"
**Cause:** Frontend can't connect to API due to incorrect `REACT_APP_API_URL`  
**Fix:** Set `REACT_APP_API_URL=https://api.yoohoo.guru/api` in Vercel

### Issue: "Images not loading on yoohoo.guru"
**Cause:** CSP blocking image sources  
**Fix:** Already fixed in CSP headers - redeploy frontend

### Issue: "Google Auth fails with domain error"
**Cause:** Domain not authorized in Firebase  
**Fix:** Add all domains to Firebase Console → Authentication → Settings → Authorized domains

### Issue: "CORS errors when frontend calls API"
**Cause:** Backend CORS not configured for frontend domain  
**Fix:** Set `CORS_ORIGIN_PRODUCTION` with frontend domains in Railway

## 📋 Deployment Instructions

### Railway (Backend)
1. Deploy from `backend/` directory or ensure root deployment uses backend configs
2. Set all required environment variables
3. Verify `/health` endpoint returns 200
4. Verify root `/` returns "API-only server" message

### Vercel (Frontend)  
1. Deploy from `frontend/` directory
2. Set all `REACT_APP_*` environment variables
3. Verify site loads and can connect to API
4. Test Google authentication flow

### Firebase Console
1. Add production domains to Authorized domains
2. Verify Google Auth is enabled
3. Test auth flow from production domains

## ✨ Expected Results After Fix

- ✅ `www.yoohoo.guru` - React app loads, images work, can call API
- ✅ `api.yoohoo.guru` - Returns JSON API responses only  
- ✅ `yoohoo.guru` - Same as www, images work
- ✅ Google Auth works from all domains
- ✅ All features accessible (Modified Masters, Angels List, etc.)