# OAuth Authentication Fix - Complete Implementation Guide

## Problem Summary

**Error in Vercel Logs:**
```
[next-auth][error][OAUTH_CALLBACK_ERROR] 
invalid_client (Unauthorized)
OPError: invalid_client (Unauthorized)
  at processResponse (/var/task/node_modules/openid-client/lib/helpers/process_response.js:38:13)
  at Client.callback (/var/task/node_modules/openid-client/lib/client.js:520:24)
```

**Root Causes Identified:**

1. **Missing catch-all redirect from bare domain** - Users accessing `yoohoo.guru/signup` or `yoohoo.guru/login` get cookies set on the bare domain instead of `www.yoohoo.guru`, breaking OAuth.

2. **Incorrect OAuth client configuration** - The redirect URI must be exactly `https://www.yoohoo.guru/api/auth/callback/google` (only this one URI is needed).

3. **Missing or incorrect environment variables** - `NEXTAUTH_SECRET`, `AUTH_COOKIE_DOMAIN`, and Google OAuth credentials must be correctly set.

## Code Changes Made

### 1. Fixed Bare Domain Redirect in `vercel.json`

**Changed:**
```json
{
  "source": "/",
  "has": [{ "type": "host", "value": "yoohoo.guru" }],
  "destination": "https://www.yoohoo.guru",
  "permanent": true
}
```

**To:**
```json
{
  "source": "/:path*",
  "has": [{ "type": "host", "value": "yoohoo.guru" }],
  "destination": "https://www.yoohoo.guru/:path*",
  "permanent": true
}
```

**Why:** This catch-all redirect ensures that ALL paths on the bare domain (yoohoo.guru/signup, yoohoo.guru/login, etc.) redirect to www.yoohoo.guru. This prevents OAuth cookies from being set on the wrong domain.

**Impact:**
- ✅ Users accessing `yoohoo.guru/signup` → redirected to `www.yoohoo.guru/signup`
- ✅ Users accessing `yoohoo.guru/login` → redirected to `www.yoohoo.guru/login`
- ✅ All OAuth flows happen on www.yoohoo.guru with correct cookie domain
- ✅ PKCE verifier cookies are available during OAuth callback

## Configuration Required (Admin Action Needed)

### Step 1: Configure Google Cloud Console OAuth Client

**CRITICAL:** Remove the `yoohoo-guru.firebaseapp.com` redirect URI and keep ONLY:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Find OAuth 2.0 Client ID: `1031686154562-462nd1ouk7vkl5kcmsmfib631055t41a.apps.googleusercontent.com`
4. Click to edit
5. Under **Authorized redirect URIs**, ensure ONLY this URI exists:
   ```
   https://www.yoohoo.guru/api/auth/callback/google
   ```
6. Remove any other redirect URIs (especially `https://yoohoo-guru.firebaseapp.com/__/auth/handler`)
7. Click **Save**
8. Wait 5-10 minutes for changes to propagate

**Why only ONE redirect URI?**

The platform uses centralized authentication:
1. Users on ANY subdomain (coach.yoohoo.guru, angel.yoohoo.guru, etc.) click "Sign In"
2. They are redirected to `www.yoohoo.guru/login` (centralized auth page)
3. Google OAuth happens ONLY at `www.yoohoo.guru`
4. Google redirects to: `www.yoohoo.guru/api/auth/callback/google` (the ONLY OAuth redirect)
5. After successful auth, NextAuth redirects users back to their original subdomain via `callbackUrl`

The Firebase redirect URI (`yoohoo-guru.firebaseapp.com/__/auth/handler`) is NOT needed because the platform uses NextAuth, not Firebase Auth SDK.

### Step 2: Verify Vercel Environment Variables

Go to Vercel Dashboard → Settings → Environment Variables

**Required for Production:**

```bash
# NextAuth Core Configuration
NEXTAUTH_URL=https://www.yoohoo.guru
NEXTAUTH_SECRET=<32-character-base64-string>

# CRITICAL: Cross-Subdomain Cookie Domain
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# Google OAuth Credentials
GOOGLE_OAUTH_CLIENT_ID=1031686154562-462nd1ouk7vkl5kcmsmfib631055t41a.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=<your-client-secret-from-google-cloud>

# Firebase Configuration
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_PROJECT_ID=yoohoo-guru

# Backend API
BACKEND_API_URL=https://yoohooguru-production.up.railway.app
```

**Generate NEXTAUTH_SECRET if missing:**
```bash
openssl rand -base64 32
```

**CRITICAL Notes:**
- `AUTH_COOKIE_DOMAIN` MUST start with a dot (`.yoohoo.guru`) for cross-subdomain cookies
- `NEXTAUTH_SECRET` must be at least 32 characters
- `GOOGLE_OAUTH_CLIENT_SECRET` must match exactly what's in Google Cloud Console
- All values should be set for **Production** environment at minimum

### Step 3: Verify Google OAuth Client Secret

**Most Common Cause of "invalid_client" Error:**

The `GOOGLE_OAUTH_CLIENT_SECRET` in Vercel doesn't match the secret in Google Cloud Console.

**To verify:**
1. In Google Cloud Console → OAuth Client details
2. Find **Client secret**
3. Click the copy icon (📋) - don't manually select/copy
4. Compare with what's in Vercel (you can't see the value, but you can update it)
5. If in doubt, copy the secret again and update Vercel

**When to regenerate the secret:**
- ONLY if the current secret has been exposed/leaked
- ONLY as a last resort for troubleshooting
- NEVER regenerate "just to be safe" - this breaks existing auth immediately

**If you regenerate:**
1. Copy the NEW secret immediately
2. Update Vercel environment variable
3. Redeploy the application
4. Test authentication

### Step 4: Redeploy Application

**REQUIRED:** Environment variable changes only take effect after redeployment.

1. Go to Vercel Dashboard → Deployments
2. Find latest deployment
3. Click **...** → **Redeploy**
4. Wait for deployment to complete

### Step 5: Test Authentication Flow

**Test in incognito/private window:**

1. Navigate to: `https://www.yoohoo.guru/login`
2. Open Browser DevTools (F12) → Console tab
3. Click "Sign in with Google"
4. Complete Google OAuth flow

**Expected Success:**
- ✅ Redirect to Google sign-in page
- ✅ Select Google account
- ✅ Redirect to `https://www.yoohoo.guru/dashboard` (or wherever)
- ✅ NO `error=OAuthCallback` in URL
- ✅ Console shows: `✅ OAuth login successful via google for user <email>`

**Test bare domain redirect:**

1. Navigate to: `http://yoohoo.guru/signup` (note: no www)
2. Should immediately redirect to: `https://www.yoohoo.guru/signup`
3. Address bar should show `www.yoohoo.guru`

**Test cross-subdomain authentication:**

1. After successful login on www.yoohoo.guru
2. Open new tab, go to: `https://coach.yoohoo.guru`
3. Should already be logged in (no need to sign in again)
4. Check cookie domain in DevTools → Application → Cookies
5. Cookie `__Secure-next-auth.session-token` should have Domain=`.yoohoo.guru`

## How OAuth Works in This Platform

### Centralized Authentication Model

```
User on ANY subdomain                   Central Login
──────────────────────                  ─────────────
coach.yoohoo.guru/skills  ─────►   www.yoohoo.guru/login
angel.yoohoo.guru/profile ─────►   www.yoohoo.guru/login
heroes.yoohoo.guru        ─────►   www.yoohoo.guru/login
                                         │
                                         │ User clicks "Sign in with Google"
                                         │
                                         ▼
                                   Google OAuth
                                   (accounts.google.com)
                                         │
                                         │ User authorizes
                                         │
                                         ▼
                            OAuth Callback (ONLY ONE NEEDED)
                            ─────────────────────────────────
                            www.yoohoo.guru/api/auth/callback/google
                                         │
                                         │ NextAuth processes
                                         │ Sets cookie on .yoohoo.guru
                                         │
                                         ▼
                            Redirect to Original Location
                            ────────────────────────────────
                            coach.yoohoo.guru/skills  ◄──── (via callbackUrl)
                            angel.yoohoo.guru/profile ◄──── (via callbackUrl)
                            heroes.yoohoo.guru        ◄──── (via callbackUrl)
```

### Why Only One Redirect URI is Needed

**The OAuth callback ONLY happens at:** `www.yoohoo.guru/api/auth/callback/google`

**Other subdomains don't need redirect URIs because:**
1. They redirect to www.yoohoo.guru for authentication
2. OAuth happens on www.yoohoo.guru
3. Callback happens on www.yoohoo.guru
4. NextAuth redirects back to original subdomain using application-level redirects (not OAuth redirects)

**Application redirect vs OAuth redirect:**
- **OAuth redirect:** Google sends user back to your app after authorization (configured in Google Cloud Console)
- **Application redirect:** Your app sends user to different pages within your app (configured in NextAuth)

### Cookie Domain Configuration

**Why `.yoohoo.guru` (with leading dot)?**

- Cookie with domain `.yoohoo.guru` is accessible on ALL subdomains
- www.yoohoo.guru ✅
- coach.yoohoo.guru ✅
- angel.yoohoo.guru ✅
- heroes.yoohoo.guru ✅

**Without the leading dot:**
- Cookie with domain `www.yoohoo.guru` is ONLY accessible on www subdomain
- www.yoohoo.guru ✅
- coach.yoohoo.guru ❌ (cookie not available)
- angel.yoohoo.guru ❌ (cookie not available)

## Troubleshooting

### Still Getting "invalid_client" Error

**Checklist:**
- [ ] Waited 10+ minutes after Google Cloud Console changes
- [ ] Redeployed Vercel after updating environment variables
- [ ] Tested in incognito/private browsing mode
- [ ] Verified `GOOGLE_OAUTH_CLIENT_SECRET` matches exactly
- [ ] Confirmed redirect URI is exactly: `https://www.yoohoo.guru/api/auth/callback/google`
- [ ] Removed Firebase redirect URI: `https://yoohoo-guru.firebaseapp.com/__/auth/handler`

**Debug Steps:**

1. **Check Vercel deployment logs:**
   - Look for environment variable validation messages
   - Should see: `ℹ️ NEXTAUTH_URL: https://www.yoohoo.guru`

2. **Test NextAuth providers endpoint:**
   ```bash
   curl https://www.yoohoo.guru/api/auth/providers | jq
   ```
   
   Should return:
   ```json
   {
     "google": {
       "id": "google",
       "name": "Google",
       "type": "oauth",
       "callbackUrl": "https://www.yoohoo.guru/api/auth/callback/google"
     }
   }
   ```

3. **Inspect browser console during login:**
   - Look for `[next-auth][error]` messages
   - Check Network tab for failed requests to `/api/auth/callback/google`

### Cookie Not Working Across Subdomains

**Check:**
1. `AUTH_COOKIE_DOMAIN=.yoohoo.guru` in Vercel (with leading dot)
2. Redeployed after setting this variable
3. In browser DevTools → Application → Cookies
4. Cookie `__Secure-next-auth.session-token` should show:
   - Domain: `.yoohoo.guru` (with dot)
   - Secure: ✓
   - HttpOnly: ✓
   - SameSite: Lax

### Bare Domain Not Redirecting

**Test:**
```bash
curl -I http://yoohoo.guru/signup
```

Should return:
```
HTTP/1.1 308 Permanent Redirect
Location: https://www.yoohoo.guru/signup
```

If not:
1. Verify `vercel.json` has the catch-all redirect
2. Redeploy Vercel
3. Clear browser cache
4. Test again

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] `GOOGLE_OAUTH_CLIENT_SECRET` is kept private (not in code)
- [ ] All secrets are in Vercel environment variables (not committed to Git)
- [ ] `.env` files are in `.gitignore`
- [ ] HTTPS is enforced for all OAuth redirects
- [ ] Cookie has `Secure` flag (HTTPS only)
- [ ] Cookie has `HttpOnly` flag (no JavaScript access)
- [ ] Cookie has `SameSite=lax` (CSRF protection)
- [ ] Bare domain redirects to www (prevents cookie domain issues)

## Files Changed in This PR

1. **vercel.json** - Added catch-all redirect from bare domain to www
2. **AUTHENTICATION_OAUTH_FIX_COMPLETE.md** - This comprehensive guide

## Next Steps After Deployment

1. **Immediate:**
   - [ ] Configure Google Cloud Console (Step 1)
   - [ ] Verify Vercel environment variables (Step 2)
   - [ ] Redeploy application (Step 4)
   - [ ] Test authentication (Step 5)

2. **Validation:**
   - [ ] Test login on www.yoohoo.guru
   - [ ] Test bare domain redirect
   - [ ] Test cross-subdomain session persistence
   - [ ] Test with multiple Google accounts
   - [ ] Test logout and re-login

3. **Monitoring:**
   - [ ] Check Vercel logs for any OAuth errors
   - [ ] Monitor authentication success rate
   - [ ] Verify no users reporting login issues

## Support Resources

- **Detailed OAuth client secret troubleshooting:** `docs/OAUTH_INVALID_CLIENT_FIX.md`
- **NextAuth OAuth setup guide:** `docs/NEXTAUTH_OAUTH_FIX.md`
- **Google OAuth setup guide:** `docs/GOOGLE_OAUTH_SETUP.md`
- **Environment variables guide:** `docs/ENVIRONMENT_VARIABLES.md`

## References

- [NextAuth.js OAuth Callback Error](https://next-auth.js.org/errors#oauth_callback_error)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Vercel Redirects Documentation](https://vercel.com/docs/edge-network/redirects)
- [HTTP Cookie Domain Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

**Document Status:** ✅ Ready for Implementation  
**Last Updated:** November 2024  
**Priority:** CRITICAL - Blocking user authentication
