# CSP Fix: BigDataCloud API Support

## Issue
Content Security Policy (CSP) was blocking requests to the BigDataCloud reverse geocoding API:
```
Resource: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=...&longitude=...
Status: blocked
Directive: connect-src
Source location: (index):0
```

## Root Cause
The nginx configuration files used in Docker deployments had outdated CSP headers that did not include `https://api.bigdatacloud.net` in the `connect-src` directive.

## Files Modified
1. **frontend/default.conf** - Updated nginx CSP configuration for Docker deployments
2. **frontend/nginx.conf** - Updated nginx CSP configuration for Docker deployments

## CSP Configuration Status

### ✅ Already Correct (No Changes Needed)
- **frontend/public/index.html** - HTML meta tag CSP ✅
- **vercel.json** - Vercel HTTP header CSP ✅
- **backend/src/index.js** - Backend helmet CSP ✅

### ✅ Fixed in This PR
- **frontend/default.conf** - Docker nginx CSP ✅ FIXED
- **frontend/nginx.conf** - Docker nginx CSP ✅ FIXED

## Changes Made

Updated the nginx `Content-Security-Policy` header to include:
- `https://api.bigdatacloud.net` in the `connect-src` directive
- All other required domains for proper functionality (Stripe, Firebase, Google Analytics, Unsplash, etc.)

The CSP now matches the configuration in `vercel.json` and `frontend/public/index.html`, ensuring consistency across all deployment methods.

## Testing

### Backend Tests
✅ All CSP-related tests pass:
```bash
cd backend && npx jest tests/headers.test.js
```

Specifically, the test "should include bigdatacloud.net in connect-src directive" validates the backend CSP configuration.

### Frontend Build
✅ Frontend builds successfully and the generated HTML includes the correct CSP:
```bash
cd frontend && npm run build
```

## Deployment Impact

### Vercel Deployment (Production)
- **Status**: Already correct - no changes needed
- The Vercel deployment uses `vercel.json` which already had `api.bigdatacloud.net`
- If CSP errors persist on production, it may be due to:
  1. Browser/CDN caching - users should clear cache or wait for CDN refresh
  2. Deployment not yet updated - trigger a new deployment

### Docker Deployment
- **Status**: Fixed in this PR
- Docker deployments now have the correct CSP
- Rebuild the Docker image to apply the fix

### Railway Backend
- **Status**: Already correct - no changes needed
- The Railway backend uses `backend/src/index.js` which already had `api.bigdatacloud.net`

## Affected Components

The BigDataCloud API is used by:
- **frontend/src/components/SimpleLocationSelector.js** - GPS reverse geocoding
- **frontend/src/components/EnhancedLocationSelector.js** - GPS reverse geocoding

These components use the BigDataCloud API to convert GPS coordinates to human-readable addresses.

## Verification Steps

1. **Clear browser cache and hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check browser console** - should not see CSP errors for `api.bigdatacloud.net`
3. **Test location functionality** - GPS location requests should work correctly
4. **Inspect CSP headers** - use browser DevTools → Network tab → Check response headers

## Additional Notes

- All CSP configurations are now consistent across deployment methods
- The fix is minimal and surgical - only updating the outdated nginx configs
- No changes were needed to the core application code
- Tests validate the CSP includes the necessary domains

## Related Files
- Location selector components: `frontend/src/components/*LocationSelector.js`
- Backend CSP test: `backend/tests/headers.test.js`
- Deployment docs: `docs/DEPLOYMENT.md`
