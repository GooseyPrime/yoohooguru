# CSP Fix: Google Analytics DoubleClick Domain

## Issue
Content Security Policy (CSP) was blocking requests to Google Analytics' DoubleClick tracking endpoint:
```
Refused to connect to 'https://stats.g.doubleclick.net/g/collect?v=2&tid=G-VVX0RHWEL0...' 
because it violates the following Content Security Policy directive: "connect-src 'self' 
https://api.yoohoo.guru https://api.stripe.com ... https://www.google-analytics.com 
https://analytics.google.com".
```

## Root Cause
Google Analytics uses `stats.g.doubleclick.net` for collecting analytics data. This domain was not included in the CSP `connect-src` directive, causing the browser to block all requests to it.

## Solution
Added `https://stats.g.doubleclick.net` to the `connect-src` directive in all CSP configurations.

## Files Modified
1. **frontend/public/index.html** - Updated HTML meta tag CSP
2. **vercel.json** - Updated Vercel HTTP header CSP  
3. **backend/src/index.js** - Updated backend helmet CSP
4. **frontend/default.conf** - Updated Docker nginx CSP
5. **frontend/nginx.conf** - Updated Docker nginx CSP
6. **backend/tests/headers.test.js** - Added test for validation

## CSP Configuration Status

### ✅ All Files Updated
- **frontend/public/index.html** - HTML meta tag CSP ✅
- **vercel.json** - Vercel HTTP header CSP ✅
- **backend/src/index.js** - Backend helmet CSP ✅
- **frontend/default.conf** - Docker nginx CSP ✅
- **frontend/nginx.conf** - Docker nginx CSP ✅

## Testing

### Backend Tests
✅ All CSP-related tests pass:
```bash
cd backend && npm run jest tests/headers.test.js
```

The new test "should include stats.g.doubleclick.net in connect-src directive for Google Analytics" validates the fix.

### Test Results
```
✓ should include cache-control header (all endpoints)
✓ should include x-content-type-options header (all endpoints)
✓ should include bigdatacloud.net in connect-src directive
✓ should include api-bdc.io in connect-src directive for BigDataCloud redirect
✓ should include unsplash.com in connect-src directive
✓ should include stats.g.doubleclick.net in connect-src directive for Google Analytics
```

## Deployment Impact
This fix should be deployed to all environments:
- ✅ **Vercel (Frontend)** - `vercel.json` and `frontend/public/index.html` will be deployed automatically
- ✅ **Railway (Backend)** - `backend/src/index.js` will be deployed automatically
- ⚠️ **Docker deployments** - Need to rebuild images to pick up `frontend/default.conf` and `frontend/nginx.conf` changes

## Verification Steps

After deployment, verify the fix:

1. **Browser Console Check:**
   - Open the deployed site in a browser
   - Open DevTools → Console
   - Look for CSP errors related to `stats.g.doubleclick.net`
   - Should NOT see any CSP violations for this domain ✅

2. **Network Tab Check:**
   - Open DevTools → Network tab
   - Filter for "doubleclick"
   - Requests to `stats.g.doubleclick.net` should succeed (200 OK) ✅

3. **Google Analytics Functionality:**
   - Navigate through the site
   - Check Google Analytics real-time reports
   - Page views should be tracked correctly ✅

## Related Issues
This fix addresses the repeated CSP console errors:
- "Refused to connect to 'https://stats.g.doubleclick.net/g/collect?...'"
- Issue reported multiple times by the user

## Related Documentation
- [CSP BigDataCloud Fix](./CSP_BIGDATACLOUD_FIX.md)
- [Deployment Errors Fix](./DEPLOYMENT_ERRORS_FIX.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## Summary
This is a minimal, surgical fix that adds only the required `stats.g.doubleclick.net` domain to the CSP `connect-src` directive across all deployment configurations. The fix is validated by automated tests and resolves the Google Analytics CSP violation errors.
