# Feature Flags Console Warning Fix

## Issue
The console warning "Feature flags endpoint returned non-JSON content, using defaults" was appearing in production builds, causing unnecessary console spam and potentially confusing users.

## Root Cause
The frontend's `featureFlags.js` service validates the Content-Type header of responses from the `/api/flags` endpoint. When the response is not JSON (typically HTML from a catch-all route), it logs a warning and falls back to default flags.

This commonly occurs when:
1. `REACT_APP_FLAGS_URL` environment variable is not set, causing the app to use the relative path `/api/flags`
2. In a split deployment (frontend on Vercel, backend on Railway), the relative path hits the Vercel server instead of the Railway API
3. The Vercel server returns the React app's `index.html` instead of JSON
4. The Content-Type is `text/html` instead of `application/json`

## Solution
The fix implements environment-aware logging:
- **Production**: No console warnings (clean console for end users)
- **Development**: Detailed diagnostic warnings with context

## Changes Made

### frontend/src/lib/featureFlags.js
All `console.warn()` calls are now wrapped with `process.env.NODE_ENV === 'development'` checks:

```javascript
if (process.env.NODE_ENV === 'development') {
  console.warn(
    'Feature flags endpoint returned non-JSON content, using defaults.\n' +
    `URL: ${flagsUrl}\n` +
    `Status: ${response.status}\n` +
    `Content-Type: ${contentType || 'not set'}\n` +
    'Hint: Set REACT_APP_FLAGS_URL environment variable to point to your API server.'
  );
}
```

This applies to all warning scenarios:
- Non-JSON content type
- HTTP error responses (4xx, 5xx)
- JSON parse errors
- Network errors
- Feature flags checked before loaded

### Test Coverage
Added comprehensive test suite (`frontend/src/lib/featureFlags.test.js`) with 15 tests covering:
- ✅ Successful flag loading
- ✅ Non-JSON content handling (dev vs prod)
- ✅ Missing Content-Type headers
- ✅ HTTP error handling
- ✅ JSON parse errors
- ✅ Network errors
- ✅ Legacy format support
- ✅ Flag checking behavior

## Configuration Best Practices

### For Vercel Deployment
Set the following environment variable in Vercel dashboard:
```
REACT_APP_FLAGS_URL=https://api.yoohoo.guru/api/flags
```

### For Local Development
Create a `.env` file in the frontend directory:
```
REACT_APP_FLAGS_URL=http://localhost:5000/api/flags
```

### For Monolithic Deployment (Backend serves Frontend)
No configuration needed - the backend will handle `/api/flags` correctly.

## Testing

### Unit Tests
```bash
cd frontend
npm test -- --testPathPattern=featureFlags.test.js
```

Expected output:
```
✓ 15 tests pass
```

### Manual Testing
1. **Production mode**: Console should be clean (no warnings)
2. **Development mode**: Detailed warnings with diagnostic info should appear

### Browser Console Test
Open the test page in your browser:
```bash
# Start a simple HTTP server
cd /tmp
python3 -m http.server 8080
```

Then visit `http://localhost:8080/test-feature-flags.html` and click the test buttons. Check the browser console for warning messages.

## Impact

### Before Fix
- Console warnings appear in production
- No helpful context for debugging
- Same warning for all scenarios
- Difficult to diagnose configuration issues

### After Fix
- ✅ Clean console in production (no warnings)
- ✅ Detailed diagnostic info in development
- ✅ Specific context for each error type
- ✅ Helpful hints for resolving issues
- ✅ Comprehensive test coverage

## Rollback Plan
If issues arise, revert the commit:
```bash
git revert <commit-hash>
```

The service will continue to work correctly, but warnings will reappear in production.

## Related Files
- `frontend/src/lib/featureFlags.js` - Main service implementation
- `frontend/src/lib/featureFlags.test.js` - Test suite
- `backend/src/routes/featureFlags.js` - Backend API endpoint
- `backend/src/lib/featureFlags.js` - Backend feature flags configuration

## References
- Issue: Fix warning in console: "Feature flags endpoint returned non-JSON content, using defaults"
- Backend API endpoint: `/api/flags`
- Environment variable: `REACT_APP_FLAGS_URL`
