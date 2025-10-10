# Stripe Webhook Configuration Guide

This document provides instructions for correctly configuring Stripe webhooks for the yoohoo.guru platform.

## Issue Summary

Stripe webhooks were failing because of:
1. Route conflicts between two webhook implementations
2. Incorrect webhook URL configuration (relative path instead of full URL)
3. Wrong domain in Stripe dashboard configuration

## Fixed Implementation

### Backend Configuration

The webhook endpoint is now properly configured at:
- **Development**: `http://localhost:3001/api/webhooks/stripe`
- **Production**: `https://api.yoohoo.guru/api/webhooks/stripe`

### Required Environment Variables

Ensure these are set in your production environment (Railway):

```env
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_stripe_dashboard
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Stripe Dashboard Configuration

**IMPORTANT**: Update your Stripe webhook configuration in the Stripe dashboard:

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Find your existing webhook endpoint
3. Update the endpoint URL to: `https://api.yoohoo.guru/api/webhooks/stripe`
4. Ensure these events are enabled:
   - `checkout.session.completed`
   - `account.updated`
   - Add other events as needed for your use case

### Domain Routing Requirements

Based on the deployment routing fix document, ensure DNS is configured correctly:

```
✅ CORRECT:
yoohoo.guru        → Vercel frontend  
www.yoohoo.guru   → Vercel frontend
api.yoohoo.guru   → Railway backend

❌ WRONG:
yoohoo.guru        → Railway backend (causes webhook failures)
```

### Webhook Health Check

You can verify webhook configuration by checking:
- **Development**: `http://localhost:3001/api/webhooks/stripe/health`
- **Production**: `https://api.yoohoo.guru/api/webhooks/stripe/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-09-25T00:14:48.916Z",
  "webhook_secret_configured": true,
  "stripe_key_configured": true,
  "endpoint": "/api/webhooks/stripe/"
}
```

### Troubleshooting

1. **Check environment variables**: Verify `STRIPE_WEBHOOK_SECRET` is set in Railway
2. **Verify domain routing**: Ensure `api.yoohoo.guru` points to Railway backend
3. **Check webhook logs**: Look for webhook processing logs in Railway deployment logs
4. **Test with Stripe CLI**: Use `stripe listen --forward-to https://api.yoohoo.guru/api/webhooks/stripe`

### Webhook Events Handled

Currently handling:
- `checkout.session.completed` - Payment completion for job bookings
- `account.updated` - Stripe Connect account status updates
- `payout.updated` - Payout status changes (logged for monitoring)
- `payout.paid` - Successful payout completion (logged for monitoring)
- `payout.failed` - Failed payout attempts (logged for monitoring)

All other event types are logged as "Unhandled event type" but still return success to Stripe.

### Technical Details

- Uses official Stripe SDK for signature verification
- Implements proper raw body parsing for webhook signature validation
- Enhanced logging for debugging webhook issues
- Proper error handling with detailed error messages