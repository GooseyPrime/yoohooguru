# CSRF Webhook Fix - Visual Explanation

## The Problem: Global Middleware Applies to All Routes

### ❌ What Didn't Work (PR #318)

```
┌─────────────────────────────────────────────────────────────┐
│  Code in backend/src/index.js (BEFORE THIS FIX)             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  app.use(session(sessionConfig));                           │
│                                                              │
│  // Mount webhook route before CSRF ← Doesn't help!         │
│  app.use('/api/webhooks/stripe',                            │
│           express.raw({type: 'application/json'}),          │
│           stripeWebhooks);                                  │
│                                                              │
│  // Global CSRF middleware ← STILL RUNS FOR WEBHOOKS!       │
│  if (config.nodeEnv !== 'test') {                           │
│    app.use(csrf());  ← Applied to ALL routes                │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘

Request Flow for POST /api/webhooks/stripe:
┌──────────────────┐
│ Stripe Request   │
│ (No CSRF token)  │
└────────┬─────────┘
         ↓
┌────────────────────────────────────────────┐
│ 1. Session Middleware                      │
│    ✅ Session created/loaded               │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 2. CSRF Middleware                         │
│    ❌ ERROR: CSRF token missing!           │
│    ❌ Returns 500 error                    │
│    ❌ Webhook never processes              │
└────────────────────────────────────────────┘

WHY THIS FAILS:
• app.use(csrf()) applies to ALL routes globally
• Route mounting order doesn't matter for global middleware
• CSRF runs before the webhook route handler
```

### ✅ What Does Work (This Fix)

```
┌─────────────────────────────────────────────────────────────┐
│  Code in backend/src/index.js (AFTER THIS FIX)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  app.use(session(sessionConfig));                           │
│                                                              │
│  app.use('/api/webhooks/stripe',                            │
│           express.raw({type: 'application/json'}),          │
│           stripeWebhooks);                                  │
│                                                              │
│  // Conditional CSRF middleware ← EXCLUDES WEBHOOKS!        │
│  if (config.nodeEnv !== 'test') {                           │
│    app.use((req, res, next) => {                            │
│      // Skip CSRF for webhook routes                        │
│      if (req.path.startsWith('/api/webhooks/')) {           │
│        return next();  ← Webhooks bypass CSRF               │
│      }                                                       │
│      // Apply CSRF to all other routes                      │
│      return csrf()(req, res, next);                         │
│    });                                                       │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘

Request Flow for POST /api/webhooks/stripe:
┌──────────────────┐
│ Stripe Request   │
│ (No CSRF token)  │
└────────┬─────────┘
         ↓
┌────────────────────────────────────────────┐
│ 1. Session Middleware                      │
│    ✅ Session created/loaded               │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 2. Webhook Route                           │
│    ✅ Matches /api/webhooks/stripe         │
│    ✅ Starts processing                    │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 3. Conditional CSRF Middleware             │
│    ✅ Checks: req.path.startsWith(         │
│       '/api/webhooks/')                    │
│    ✅ Match! Skip CSRF, call next()        │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 4. Webhook Handler                         │
│    ✅ Verify Stripe signature              │
│    ✅ Process webhook event                │
│    ✅ Return 200 OK                        │
└────────────────────────────────────────────┘

WHY THIS WORKS:
• Conditional middleware checks the path
• Webhook paths explicitly excluded from CSRF
• Other routes still get CSRF protection
```

## Comparison: Regular API Route vs Webhook Route

### Regular API Route (e.g., POST /api/auth/login)

```
┌──────────────────┐
│ Browser Request  │
│ (CSRF required)  │
└────────┬─────────┘
         ↓
┌────────────────────────────────────────────┐
│ 1. Session Middleware                      │
│    ✅ Session created/loaded               │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 2. Conditional CSRF Middleware             │
│    ⚙️  Checks: req.path.startsWith(        │
│       '/api/webhooks/')                    │
│    ❌ No match! Apply CSRF                 │
│    ⚙️  csrf()(req, res, next)              │
│    ✅ Validates CSRF token                 │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 3. Route Handler                           │
│    ✅ Process login                        │
│    ✅ Return response                      │
└────────────────────────────────────────────┘
```

### Webhook Route (e.g., POST /api/webhooks/stripe)

```
┌──────────────────┐
│ Stripe Request   │
│ (No CSRF token)  │
│ (Has signature)  │
└────────┬─────────┘
         ↓
┌────────────────────────────────────────────┐
│ 1. Session Middleware                      │
│    ✅ Session created/loaded               │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 2. Conditional CSRF Middleware             │
│    ⚙️  Checks: req.path.startsWith(        │
│       '/api/webhooks/')                    │
│    ✅ Match! Skip CSRF                     │
│    ⚙️  return next()                       │
└────────┬───────────────────────────────────┘
         ↓
┌────────────────────────────────────────────┐
│ 3. Webhook Handler                         │
│    ✅ Verify Stripe signature              │
│    ✅ Process webhook event                │
│    ✅ Return 200 OK                        │
└────────────────────────────────────────────┘
```

## Key Differences

| Aspect | Regular API Route | Webhook Route |
|--------|------------------|---------------|
| **CSRF Protection** | ✅ Required | ❌ Not applicable |
| **Security Method** | CSRF token validation | Signature verification (HMAC-SHA256) |
| **Request Source** | Browser (user session) | Server (Stripe) |
| **Attack Vector** | CSRF attack possible | CSRF attack not possible |
| **Middleware Flow** | Session → CSRF → Handler | Session → Skip CSRF → Handler |

## Security Analysis

### Why This Is Secure

1. **Webhooks Use Signature Verification**
   - Every Stripe webhook includes a signature in the `Stripe-Signature` header
   - Signature is HMAC-SHA256 hash of payload + timestamp + secret
   - MORE secure than CSRF tokens for server-to-server communication

2. **Limited Scope**
   - Only `/api/webhooks/*` routes bypass CSRF
   - All other routes maintain CSRF protection
   - No increase in attack surface

3. **Defense in Depth**
   ```
   Webhook Security Layers:
   ┌─────────────────────────────────┐
   │ 1. HTTPS (TLS encryption)       │
   ├─────────────────────────────────┤
   │ 2. Signature verification       │
   ├─────────────────────────────────┤
   │ 3. Timestamp validation         │
   ├─────────────────────────────────┤
   │ 4. Secret key (env variable)    │
   ├─────────────────────────────────┤
   │ 5. IP validation (optional)     │
   └─────────────────────────────────┘
   
   Regular API Security Layers:
   ┌─────────────────────────────────┐
   │ 1. HTTPS (TLS encryption)       │
   ├─────────────────────────────────┤
   │ 2. CSRF token validation        │
   ├─────────────────────────────────┤
   │ 3. Session validation           │
   ├─────────────────────────────────┤
   │ 4. Authentication (Firebase)    │
   ├─────────────────────────────────┤
   │ 5. Authorization (permissions)  │
   └─────────────────────────────────┘
   ```

### Why CSRF Doesn't Apply to Webhooks

**CSRF Attack Scenario** (Why we need CSRF for browser requests):
```
1. User logs into yoohoo.guru (gets session cookie)
2. User visits evil.com
3. evil.com has hidden form:
   <form action="https://api.yoohoo.guru/api/users/delete" method="POST">
4. Form auto-submits, browser sends user's session cookie
5. WITHOUT CSRF: Server processes request ❌
6. WITH CSRF: Server rejects (no valid token) ✅
```

**Webhook Scenario** (Why CSRF doesn't apply):
```
1. Stripe server wants to send webhook
2. Stripe sends POST to https://api.yoohoo.guru/api/webhooks/stripe
3. Request includes signature (not cookies)
4. No browser involved
5. No user session
6. No CSRF attack possible
7. Signature verification provides security ✅
```

## Summary

**The Fix**: Replace global CSRF middleware with conditional CSRF that excludes webhook routes.

**Why It's Needed**: Global middleware in Express runs for all routes, regardless of mount order.

**Security Impact**: None. Webhooks use signature verification, which is more secure than CSRF for server-to-server requests.

**Result**: 
- ✅ Stripe webhooks work
- ✅ CSRF protection maintained for browser requests
- ✅ No security vulnerabilities
