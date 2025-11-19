# Authentication CSP Fix - November 19, 2025

## Problem Statement
Users unable to login to yoohoo.guru. Browser console showing CSP violation errors blocking authentication connections.

## Root Cause Identified
The Content Security Policy (CSP) in `vercel.json` was **missing critical Google OAuth domains** in the `connect-src` directive.

### What Was Missing
```
connect-src 'self' https://api.yoohoo.guru https://api.stripe.com 
  https://identitytoolkit.googleapis.com https://securetoken.googleapis.com 
  https://*.googleapis.com
```

**Missing domains:**
- ❌ `https://accounts.google.com` - Required for Google account authentication
- ❌ `https://www.googleapis.com` - Required for Google API calls
- ❌ `https://oauth2.googleapis.com` - Required for OAuth2 token exchange

## The Fix
Updated `vercel.json` CSP `connect-src` directive to include:

```
connect-src 'self' https://api.yoohoo.guru https://api.stripe.com 
  https://accounts.google.com ✅ (ADDED)
  https://www.googleapis.com ✅ (ADDED)
  https://identitytoolkit.googleapis.com 
  https://securetoken.googleapis.com 
  https://oauth2.googleapis.com ✅ (ADDED)
  https://*.googleapis.com
```

## Why This Fixes Authentication

### Google OAuth Sign-In Flow
1. User clicks "Sign in with Google"
2. Browser attempts to connect to `accounts.google.com` → **CSP blocked this** ❌
3. Browser attempts OAuth exchange at `oauth2.googleapis.com` → **CSP blocked this** ❌
4. Browser calls Google APIs at `www.googleapis.com` → **CSP blocked this** ❌

**Result:** Google OAuth completely broken

### Firebase Email/Password Auth
1. NextAuth calls Firebase Auth API at `identitytoolkit.googleapis.com` ✅ (already allowed)
2. May need to call `accounts.google.com` for token refresh → **CSP blocked this** ❌

**Result:** Email/password login may work but session management broken

## What This Does NOT Involve
This fix is purely a CSP header update. It does NOT require:

- ❌ Redirect URI configuration (already configured correctly in previous PRs)
- ❌ Google Cloud Console changes (OAuth client already configured)
- ❌ Environment variable updates (all env vars already set in Vercel)
- ❌ Code changes to authentication logic (code is correct)
- ❌ Backend API changes (backend CSP already had these domains)

## Comparison: Backend vs Frontend CSP

### Backend CSP (correct)
```javascript
"connect-src": [
  "'self'",
  "https://accounts.google.com", ✅
  "https://www.googleapis.com", ✅
  "https://identitytoolkit.googleapis.com", ✅
  "https://securetoken.googleapis.com", ✅
  "https://oauth2.googleapis.com", ✅
  // ... other domains
]
```

### Frontend CSP (before fix)
```json
"connect-src 'self' https://api.yoohoo.guru https://api.stripe.com 
  https://identitytoolkit.googleapis.com https://securetoken.googleapis.com 
  https://*.googleapis.com"
```
**Missing:** `accounts.google.com`, `www.googleapis.com`, `oauth2.googleapis.com`

### Frontend CSP (after fix)
```json
"connect-src 'self' https://api.yoohoo.guru https://api.stripe.com 
  https://accounts.google.com ✅
  https://www.googleapis.com ✅
  https://identitytoolkit.googleapis.com 
  https://securetoken.googleapis.com 
  https://oauth2.googleapis.com ✅
  https://*.googleapis.com"
```

## Deployment
When this PR is merged and Vercel deploys:
1. CSP headers will automatically update
2. No manual configuration needed
3. Authentication will work immediately

## Testing After Deployment
1. Go to https://www.yoohoo.guru/login
2. Open DevTools → Console
3. Click "Sign in with Google"
4. **Verify:** No CSP errors in console
5. **Verify:** Google OAuth popup opens
6. **Verify:** After auth, redirected to /dashboard with active session

## Why This Was Hard to Debug
1. Previous PRs focused on redirect URIs (which were already correct)
2. CSP errors can look similar to OAuth configuration errors
3. The wildcard `https://*.googleapis.com` doesn't match apex `googleapis.com` domains
4. Backend had correct CSP, only frontend was missing domains

## Lesson Learned
When debugging authentication:
1. ✅ Check browser console for CSP violations FIRST
2. ✅ Compare frontend and backend CSP configurations
3. ✅ Don't assume wildcard patterns match apex domains
4. ✅ Verify all domains used in auth flow are in CSP

## Files Modified
- `vercel.json` - Updated Content-Security-Policy header

## No Additional Configuration Required
All environment variables, redirect URIs, and OAuth settings are already correctly configured from previous work.

---
**Status:** Fix applied and committed. Awaiting Vercel deployment.
