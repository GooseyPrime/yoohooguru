# Stripe Webhook Middleware Order Fix

## Visual Comparison

### ❌ BEFORE (Broken)

```
┌─────────────────────────────────────────────────────┐
│ Incoming Stripe Webhook POST Request                │
│ /api/webhooks/stripe                                 │
│ (No CSRF token - it's a server-to-server request)   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 1. Session Middleware (line 167)                    │
│    ✓ Creates/loads session                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 2. CSRF Middleware (line 171)                       │
│    ❌ Checks for CSRF token                         │
│    ❌ Token not found!                               │
│    ❌ Throws error or rejects request                │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ Error Handler Middleware                            │
│ Returns: HTTP 500                                    │
│ {                                                    │
│   "success": false,                                  │
│   "error": {                                         │
│     "message": "Internal Server Error"               │
│   }                                                  │
│ }                                                    │
└─────────────────────────────────────────────────────┘
        ❌ Stripe webhook route never reached!
```

### ✅ AFTER (Fixed)

```
┌─────────────────────────────────────────────────────┐
│ Incoming Stripe Webhook POST Request                │
│ /api/webhooks/stripe                                 │
│ (No CSRF token - it's a server-to-server request)   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 1. Session Middleware (line 167)                    │
│    ✓ Creates/loads session                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 2. Webhook Route + Raw Body Parser (line 175)       │
│    ✓ Parses raw body for signature verification     │
│    ✓ Verifies Stripe signature                      │
│    ✓ Processes webhook event                        │
│    ✓ Returns success response                       │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ Response: HTTP 200                                   │
│ {                                                    │
│   "received": true                                   │
│ }                                                    │
└─────────────────────────────────────────────────────┘
        ✅ Webhook processed successfully!
        
        Note: CSRF middleware (line 179) runs AFTER
        webhook route, so it doesn't affect webhooks
```

## Key Points

1. **Problem**: CSRF middleware was blocking Stripe webhooks because they don't have CSRF tokens
2. **Solution**: Move webhook route BEFORE CSRF middleware
3. **Result**: Webhooks processed successfully, CSRF still protects other routes

## Code Changes

### backend/src/index.js

```javascript
// BEFORE (lines 167-200):
app.use(session(sessionConfig));
app.use(csrf());                                    // CSRF first
// ... other middleware ...
app.use('/api/webhooks/stripe', /* ... */);         // Webhook after CSRF

// AFTER (lines 167-179):
app.use(session(sessionConfig));
app.use('/api/webhooks/stripe', /* ... */);         // Webhook first
app.use(csrf());                                     // CSRF after webhook
```

## Why This Works

1. **Express middleware executes in order**: Middleware is executed in the order it's registered with `app.use()`
2. **Route-specific mounting stops execution**: When a route matches (like `/api/webhooks/stripe`), the request is handled and subsequent middleware doesn't run for that route
3. **CSRF still protects other routes**: All other routes still go through CSRF validation because they're registered after the CSRF middleware

## Impact

- ✅ Stripe webhooks now work correctly
- ✅ All webhook events (including `payout.updated`) return HTTP 200
- ✅ CSRF protection still active for all other API routes
- ✅ No security vulnerabilities introduced
- ✅ Minimal code changes (moved one line)
