# Stripe Webhook Delivery Fix

## Problem Summary

Stripe webhook events for `payout.updated` (and potentially other event types) were failing with HTTP 500 errors:

```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error"
  }
}
```

Event details:
- Event ID: `evt_1SGaHKJF6bibA8neTOum7Hcs`
- Event Type: `payout.updated`
- API Version: `2025-07-30.basil`
- Livemode: `true`
- Status: Failed
- Error: HTTP 500 Internal Server Error

## Root Cause

The webhook endpoint was failing due to **CSRF (Cross-Site Request Forgery) protection** being applied to the webhook route.

### Technical Details

1. **CSRF Middleware Applied Too Early**: The CSRF protection middleware was mounted at line 171 in `backend/src/index.js`, BEFORE the Stripe webhook route was mounted at line 200.

2. **Stripe Webhooks Don't Have CSRF Tokens**: When Stripe sends POST requests to webhook endpoints, they don't include CSRF tokens (because they're server-to-server requests, not browser-based requests).

3. **CSRF Validation Failure**: When the CSRF middleware encountered a POST request without a valid CSRF token, it threw an error which was caught by the error handler middleware, resulting in a 500 response.

4. **Error Handler Format**: The error handler middleware returns errors in the format:
   ```json
   {
     "success": false,
     "error": {
       "message": "Internal Server Error"
     }
   }
   ```
   This matches exactly what Stripe received.

### Middleware Execution Order (Before Fix)

```
Request to /api/webhooks/stripe
  ↓
1. Session middleware (line 167)
  ↓
2. CSRF middleware (line 171) ← BLOCKS REQUEST!
  ↓
3. Rate limiter (line 188)
  ↓
4. Webhook route + raw body parser (line 200) ← Never reached!
```

## Solution

### Changes Made

1. **Moved Webhook Route Before CSRF** (`backend/src/index.js`):
   - Moved the Stripe webhook route to line 175, immediately after the session middleware
   - This ensures webhooks are processed BEFORE CSRF validation
   - Added clear comments explaining why this order is critical

2. **Added Payout Event Handling** (`backend/src/routes/stripeWebhooks.js`):
   - Added explicit handling for `payout.updated`, `payout.paid`, and `payout.failed` events
   - Added comprehensive logging for payout events
   - Included placeholders for future database updates if needed

3. **Added Test Coverage** (`backend/tests/webhooks.test.js`):
   - Added test case for `payout.updated` events
   - Verifies webhook returns 200 success for payout events

4. **Updated Documentation** (`docs/STRIPE_WEBHOOK_SETUP.md`):
   - Added payout event types to the list of handled events
   - Clarified that all event types return success even if not explicitly handled

### Middleware Execution Order (After Fix)

```
Request to /api/webhooks/stripe
  ↓
1. Session middleware (line 167)
  ↓
2. Webhook route + raw body parser (line 175) ← Processed immediately!
  ↓
3. CSRF middleware (line 179) ← Skipped for webhook route
  ↓
4. Rate limiter (line 188)
  ↓
5. Other routes
```

## Testing

### Manual Testing

You can test the webhook endpoint using the test script:

```bash
node /tmp/test-webhook.js
```

Or use curl:

```bash
# Create a test event payload
PAYLOAD='{"id":"evt_test","type":"payout.updated","data":{"object":{"id":"po_test","amount":1414,"currency":"usd","status":"paid"}}}'

# Calculate signature (requires STRIPE_WEBHOOK_SECRET)
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "${TIMESTAMP}.${PAYLOAD}" | openssl dgst -sha256 -hmac "${STRIPE_WEBHOOK_SECRET}" | cut -d' ' -f2)

# Send webhook request
curl -X POST http://localhost:3001/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=${TIMESTAMP},v1=${SIGNATURE}" \
  -d "${PAYLOAD}"
```

### Automated Testing

Run the webhook tests:

```bash
cd backend
npm test -- webhooks.test.js
```

## Verification

### Before Fix

- ❌ `payout.updated` events returned HTTP 500
- ❌ Error message: "Internal Server Error"
- ❌ Webhooks blocked by CSRF middleware

### After Fix

- ✅ `payout.updated` events return HTTP 200
- ✅ Response: `{"received": true}`
- ✅ Webhooks processed before CSRF middleware
- ✅ Comprehensive logging for all payout events
- ✅ Test coverage added

## Production Deployment

### Pre-Deployment Checklist

- [x] Code changes tested locally
- [x] Test coverage added
- [x] Documentation updated
- [ ] Deploy to Railway
- [ ] Verify webhook endpoint health: `https://api.yoohoo.guru/api/webhooks/stripe/health`
- [ ] Test with Stripe Dashboard "Send test webhook"
- [ ] Monitor logs for successful webhook processing

### Post-Deployment Verification

1. **Check Webhook Health**:
   ```bash
   curl https://api.yoohoo.guru/api/webhooks/stripe/health
   ```
   Expected response:
   ```json
   {
     "status": "OK",
     "timestamp": "2025-10-10T10:00:00.000Z",
     "webhook_secret_configured": true,
     "stripe_key_configured": true,
     "environment": "production",
     "endpoint": "/api/webhooks/stripe/"
   }
   ```

2. **Test with Stripe Dashboard**:
   - Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - Find your webhook endpoint
   - Click "Send test webhook"
   - Select `payout.updated` event
   - Click "Send test webhook"
   - Verify: Status should be "Succeeded" with HTTP 200

3. **Check Logs**:
   - Open Railway deployment logs
   - Look for:
     ```
     📥 Webhook received - signature present: true, secret configured: true
     ✅ Webhook signature verified - event type: payout.updated
     💰 Processing payout.updated: po_xxx - Status: paid, Amount: 1414 usd
     ✅ Webhook processed successfully: payout.updated
     ```

## Related Documentation

- [STRIPE_WEBHOOK_SETUP.md](./STRIPE_WEBHOOK_SETUP.md) - Complete webhook configuration guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Required environment variables

## Summary

The webhook delivery issue was caused by CSRF protection being applied to webhook endpoints. By moving the webhook route before the CSRF middleware, we ensure that Stripe webhooks (which don't have CSRF tokens) are processed correctly. The fix also adds explicit handling and logging for payout events, making it easier to monitor and debug webhook issues in the future.

All changes are minimal and surgical - we only moved the route mounting order and added explicit event handling without changing any existing functionality.
