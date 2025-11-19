# Authentication Issue Analysis - November 19, 2025

## TL;DR
**The `productionBrowserSourceMaps: false` fix was ineffective and has been reverted.**

The webpack:// CSP "violations" shown in the console are **DevTools cosmetic warnings**, not actual blockers. They do not prevent authentication from working.

## What Went Wrong With the Previous Fix

### The Claim
Setting `productionBrowserSourceMaps: false` would eliminate webpack:// CSP violations and fix authentication.

### Why It Was Wrong
1. **Already the default**: Next.js 14+ has `productionBrowserSourceMaps: false` by default
2. **No-op change**: Setting it explicitly does nothing
3. **Misdiagnosed issue**: webpack:// errors are DevTools warnings, not actual CSP blocks
4. **Won't fix auth**: These warnings don't prevent authentication from working

## Understanding the webpack:// "Violations"

### What They Actually Are
```
Connecting to 'webpack:///webpack/bootstrap' violates CSP directive: "connect-src 'self' ..."
```

These messages appear when:
1. Browser DevTools is open
2. DevTools tries to display the source of bundled JavaScript
3. DevTools uses `webpack://` pseudo-protocol to reference internal webpack modules
4. CSP logs this as a "violation" but **does not block it**

### Why They Don't Block Functionality
1. **Not network requests**: webpack:// is a DevTools internal reference, not a fetch/XHR
2. **'unsafe-eval' present**: CSP has `'unsafe-eval'` in script-src, allowing webpack runtime
3. **Cosmetic only**: These warnings appear but don't prevent code execution

### When They Appear
- **Development mode**: Very common, many warnings
- **Production mode with DevTools open**: Still appear due to DevTools inspection
- **Production mode with DevTools closed**: Don't appear (user never sees them)

## The Real Authentication Issue

### What We Need to Investigate
Since webpack:// warnings are NOT the cause, the real issue could be:

1. **Actual JavaScript errors** - Check console for uncaught exceptions
2. **OAuth configuration** - Verify redirect URIs, client IDs match production URLs
3. **Cookie issues** - Check if session cookies are being set/read properly
4. **CORS problems** - Verify API calls aren't being blocked
5. **Environment variables** - Ensure production has correct NEXTAUTH_URL, secrets, etc.
6. **Network failures** - Check Network tab for actual failed requests (not DevTools webpack://)

### How to Debug Properly

1. **Open DevTools → Network tab** (NOT Console)
2. **Filter to XHR/Fetch requests** 
3. **Look for failed OAuth requests** to accounts.google.com, oauth2.googleapis.com
4. **Check for 4xx/5xx responses**
5. **Verify cookies are being set** after authentication

## What Should Be Done

### Step 1: Get Actual Error Details
Ask user for:
- Screenshot of Network tab showing failed requests
- Actual JavaScript errors (not webpack:// CSP warnings)
- What happens when they click "Sign in with Google"
  - Does popup open?
  - Does it redirect?
  - Where does it fail?

### Step 2: Check Common OAuth Issues
- [ ] Verify authorized redirect URIs in Google Cloud Console include production URL
- [ ] Confirm NEXTAUTH_URL environment variable matches production domain
- [ ] Check NEXTAUTH_SECRET is set in production
- [ ] Verify Google OAuth client ID/secret are correct

### Step 3: Test Without DevTools
- Have user test authentication with DevTools **closed**
- webpack:// warnings won't appear
- This isolates whether the issue is real or perception

## Conclusion

The previous fix was based on a misunderstanding of what webpack:// CSP warnings mean. They are DevTools cosmetic issues, not authentication blockers.

**Action taken**: Reverted the ineffective `productionBrowserSourceMaps: false` change.

**Next steps**: Need actual error details to diagnose the real authentication failure.
