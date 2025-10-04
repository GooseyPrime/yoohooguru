# Rate Limiting Fix Summary

## Overview
This PR addresses 8 code scanning alerts from CodeQL regarding missing rate limiting on critical API endpoints.

## Issues Fixed
- **Alert #43**: Missing rate limiting on `GET /api/auth/profile` (line 142)
- **Alert #44**: Missing rate limiting on `PUT /api/auth/profile` (line 185)
- **Alert #46**: Missing rate limiting on `PUT /api/auth/profile/visibility` (line 265)
- **Alert #47**: Missing rate limiting on `DELETE /api/auth/account` (line 303)
- **Alert #48**: Missing rate limiting on `PUT /api/auth/account/restore` (line 352)
- **Alert #49**: Missing rate limiting on `POST /api/auth/merge/request` (line 394)
- **Alert #52**: Missing rate limiting on `GET /:subdomain/home` (line 114)
- **Alert #53**: Missing rate limiting on `GET /news/:subdomain` (line 679)

## Changes Made

### 1. Backend Route Changes

#### `backend/src/routes/auth.js`
- **Added** `profileLimiter` rate limiter for authenticated profile endpoints
  - Window: 15 minutes
  - Max requests: 30 per IP per window
  - More permissive than `authLimiter` since users are already authenticated
- **Applied** `profileLimiter` to 6 authenticated profile routes:
  - `GET /profile`
  - `PUT /profile`
  - `PUT /profile/visibility`
  - `DELETE /account`
  - `PUT /account/restore`
  - `POST /merge/request`

#### `backend/src/routes/gurus.js`
- **Added** `guruPagesLimiter` rate limiter for public guru pages
  - Window: 15 minutes
  - Max requests: 100 per IP per window
  - Moderate limits appropriate for public content
- **Applied** `guruPagesLimiter` to 2 public guru routes:
  - `GET /:subdomain/home`
  - `GET /news/:subdomain`

### 2. Test Coverage

#### `backend/tests/route-rate-limiting.test.js` (new)
- Created comprehensive test suite with 8 test cases
- Tests verify rate limiting on all 8 fixed endpoints
- Tests confirm:
  - Rate limits are enforced correctly
  - Appropriate HTTP 429 status codes are returned when limits are exceeded
  - Different IPs are tracked independently
  - Correct error messages are returned

## Implementation Details

### Rate Limiter Configuration
All rate limiters follow the existing pattern in the codebase:
```javascript
{
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: <appropriate-limit>,   // Varies by endpoint type
  message: '<descriptive-message>',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use req.ip which respects app-level trust proxy setting
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
}
```

### Rate Limit Tiers
- **Authentication endpoints** (`authLimiter`): 5 requests per 15 minutes (existing)
- **Profile endpoints** (`profileLimiter`): 30 requests per 15 minutes (new)
- **Public guru pages** (`guruPagesLimiter`): 100 requests per 15 minutes (new)

These tiers reflect the security sensitivity and expected usage patterns:
- Auth endpoints are most restrictive to prevent brute force attacks
- Profile endpoints are moderate since users are already authenticated
- Public guru pages are more permissive for legitimate browsing

### Trust Proxy Handling
The implementation correctly handles proxy headers:
- Trust proxy is configured at the app level (`app.set('trust proxy', ...)`)
- Rate limiters use `req.ip` which respects this setting
- `keyGenerator` provides fallback to `req.connection.remoteAddress` if needed

## Testing

### Test Results
```
✓ should apply rate limiting to GET /api/auth/profile
✓ should apply rate limiting to PUT /api/auth/profile
✓ should apply rate limiting to PUT /api/auth/profile/visibility
✓ should apply rate limiting to DELETE /api/auth/account
✓ should apply rate limiting to PUT /api/auth/account/restore
✓ should apply rate limiting to POST /api/auth/merge/request
✓ should apply rate limiting to GET /:subdomain/home
✓ should apply rate limiting to GET /news/:subdomain

Test Suites: 1 passed
Tests: 8 passed
```

### Linting
All changes passed ESLint validation with no errors or warnings.

## Security Impact

### Mitigated Threats
1. **Brute force attacks**: Rate limiting prevents automated attacks on authenticated endpoints
2. **Denial of Service (DoS)**: Limits prevent resource exhaustion from excessive requests
3. **Account enumeration**: Rate limiting makes it harder to discover valid accounts
4. **Data scraping**: Public page limits prevent bulk data extraction

### No Breaking Changes
- Rate limits are generous enough for legitimate use
- Existing functionality is preserved
- Changes are backward compatible

## Deployment Considerations

### Production Deployment
- Rate limiting works correctly with Railway's proxy (trust proxy: true)
- Client IP addresses are properly identified from X-Forwarded-For headers
- Rate limit information is returned in standard headers (`RateLimit-*`)

### Monitoring
Rate limit violations will appear in application logs and can be monitored via:
- HTTP 429 response codes in access logs
- Rate limit headers in responses
- Application metrics

## Files Changed
- `backend/src/routes/auth.js` (17 insertions, 6 modifications)
- `backend/src/routes/gurus.js` (15 insertions, 2 modifications)
- `backend/tests/route-rate-limiting.test.js` (243 insertions, new file)

**Total: 278 insertions, 8 deletions**

## Code Scanning Impact
This PR will resolve all 8 open code scanning alerts related to missing rate limiting:
- Alerts #43, #44, #46, #47, #48, #49 in `auth.js`
- Alerts #52, #53 in `gurus.js`
