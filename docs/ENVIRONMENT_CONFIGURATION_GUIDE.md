# Environment Variable Configuration Guide

This guide explains the environment variable architecture for the yoohoo.guru platform.

## 📁 Environment File Structure

The platform uses a **unified environment configuration** approach with separate files for different purposes:

### Production Deployment
```
.env.production.example    ← PRIMARY: Unified production configuration
                             Use this for all production deployments
                             (Both Vercel frontend and Railway backend)
```

### Development & Legacy
```
.env.example               ← LEGACY: Backward-compatible development config
                             Contains deprecated REACT_APP_* variables
                             Use for local development only

.env.shared.example        ← Next.js shared config across all 29 subdomains
                             Frontend-only (NEXT_PUBLIC_* variables)

apps/main/.env.local.example ← App-specific configuration
                                (Analytics, OAuth, etc.)
```

### Testing
```
.env.test                  ← Test environment with Firebase emulators
backend/.env.test          ← Backend test configuration
```

## 🚀 Quick Start

### For Production Deployment

1. **Review the unified configuration:**
   ```bash
   cat .env.production.example
   ```

2. **Set environment variables in deployment platforms:**
   
   **Vercel (Frontend - All 29 Subdomains):**
   - Set all `NEXT_PUBLIC_*` variables
   - Set `NEXTAUTH_SECRET` (must match Railway)
   - Set `AUTH_COOKIE_DOMAIN=.yoohoo.guru`
   - Set `NEXTAUTH_URL` per subdomain (if needed)

   **Railway (Backend API):**
   - Set all non-`NEXT_PUBLIC_*` variables
   - Set `NEXTAUTH_SECRET` (must match Vercel)
   - Set `SESSION_SECRET`, `JWT_SECRET`, etc.
   - Set `NODE_ENV=production`
   - Set `SERVE_FRONTEND=false`

### For Local Development

1. **Copy the shared configuration:**
   ```bash
   cp .env.shared.example .env.shared
   ```

2. **Copy the backend configuration:**
   ```bash
   cp .env.example .env
   ```

3. **Edit both files with your development credentials**

4. **Copy app-specific configuration (if needed):**
   ```bash
   cp apps/main/.env.local.example apps/main/.env.local
   ```

## 📋 Environment Variable Categories

### 🔐 Secrets (Required for Production)

**Critical secrets that MUST be unique and secure:**

| Variable | Where | Generate With | Purpose |
|----------|-------|---------------|---------|
| `NEXTAUTH_SECRET` | Vercel + Railway | `openssl rand -base64 32` | JWT signing for NextAuth |
| `SESSION_SECRET` | Railway | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Session encryption |
| `JWT_SECRET` | Railway | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | JWT token signing |

**⚠️ CRITICAL:** `NEXTAUTH_SECRET` must be **identical** in both Vercel and Railway for cross-subdomain SSO to work.

### 🔥 Firebase Configuration

**Frontend (Vercel) - Public Configuration:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Backend (Railway) - Service Account:**
```env
FIREBASE_PROJECT_ID=
FIREBASE_API_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### 💳 Payment Integration (Stripe)

**Frontend (Vercel):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Production
# or
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Development
```

**Backend (Railway):**
```env
STRIPE_SECRET_KEY=sk_live_...              # Production
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_WEBHOOK_ID=we_...
STRIPE_GURU_PASS_PRICE_ID=price_...
STRIPE_SKILL_VERIFICATION_PRICE_ID=price_...
STRIPE_TRUST_SAFETY_PRICE_ID=price_...
```

### 🤖 AI Services

**Backend (Railway):**
```env
OPENROUTER_API_KEY=                        # Primary AI provider
OPENAI_API_KEY=                            # Fallback AI provider
NEWS_API_KEY=                              # News curation (optional)
```

### 🗺️ Google Maps

**Frontend (Vercel):**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=           # Required for location features
```

Get from: https://console.cloud.google.com/google/maps-apis
Enable: Places API, Geocoding API, Maps JavaScript API

### 📹 Video Conferencing (Agora)

**Frontend (Vercel):**
```env
NEXT_PUBLIC_AGORA_APP_ID=
NEXT_PUBLIC_AGORA_REGION=us
```

**Backend (Railway):**
```env
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=
AGORA_REGION=us
AGORA_REST_KEY=
AGORA_REST_SECRET=
```

## 🔄 Variable Migration Guide

### Deprecated Variables

The following variables are **deprecated** but maintained for backward compatibility:

| Old Variable | New Variable | Status |
|-------------|--------------|--------|
| `REACT_APP_*` | `NEXT_PUBLIC_*` | ⚠️ Use `NEXT_PUBLIC_*` for Next.js apps |
| `FIREBASE_DATABASE_URL` | (removed) | ❌ Firestore-only, no Realtime DB |
| `FEATURE_MODIFIED_MASTERS` | `FEATURE_HERO_GURUS` | ⚠️ Renamed, old name still works |
| `MODIFIED_MASTERS_*` | `HERO_GURUS_*` | ⚠️ Renamed, old names still work |

### Removed Variables

These variables are **completely removed** and should not be used:

- `FIREBASE_DATABASE_URL` - Application uses Firestore exclusively
- Individual `REACT_APP_*` branding variables - Use `APP_*` variables instead

## 🏗️ Architecture-Specific Configuration

### Gateway Architecture (Current)

**Single Next.js app serves all 29 subdomains:**

✅ **Correct Configuration:**
```
Vercel Project: apps/main (gateway app)
Environment Variables: Set once, applies to all subdomains
DNS: *.yoohoo.guru → Vercel
     api.yoohoo.guru → Railway
```

### Per-Subdomain Configuration

**Only needed for app-specific settings:**

```bash
# apps/main/.env.local (www.yoohoo.guru)
NEXTAUTH_URL=https://www.yoohoo.guru

# apps/coach/.env.local (coach.yoohoo.guru)
NEXTAUTH_URL=https://coach.yoohoo.guru
```

**Note:** In the gateway architecture, subdomain routing is handled by Edge Middleware, so individual `.env.local` files are typically not needed.

## 🚫 Prohibited in Production

### Never Set These in Production/Staging:

```env
# ❌ PROHIBITED - Emulators only for test/development
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199

# ❌ PROHIBITED - Mocks only for testing
USE_MOCKS=true

# ❌ PROHIBITED - Weak/default secrets
SESSION_SECRET=test-secret
JWT_SECRET=changeme
NEXTAUTH_SECRET=your_super_secret
```

### Validation

The application includes automatic validation that will **reject** deployments with:
- Emulator variables set with `NODE_ENV=production`
- Insecure/default secret values
- Firebase project IDs containing: demo, test, mock, example, etc.

## 📖 Reference Documentation

- **Complete Variable List:** See `.env.production.example`
- **Development Setup:** See `docs/ENVIRONMENT_SETUP.md`
- **CI/CD Configuration:** See `docs/CI_CD_ENVIRONMENT.md`
- **Detailed Documentation:** See `docs/ENVIRONMENT_VARIABLES.md`

## 🔒 Security Best Practices

1. **Never commit `.env` files** with real values
2. **Use strong, random secrets** generated with crypto functions
3. **Rotate secrets regularly** (quarterly recommended)
4. **Use test keys for development** (Stripe `sk_test_*`, etc.)
5. **Use live keys only in production** (Stripe `sk_live_*`, etc.)
6. **Validate configuration** before deployment
7. **Use secret management** in deployment platforms (Vercel/Railway)

## 🆘 Troubleshooting

### Common Issues

**1. Cross-subdomain authentication not working**
- ✅ Verify `NEXTAUTH_SECRET` is **identical** in Vercel and Railway
- ✅ Verify `AUTH_COOKIE_DOMAIN=.yoohoo.guru` is set in both
- ✅ Check browser cookies for `.yoohoo.guru` domain

**2. Frontend can't reach backend API**
- ✅ Verify `NEXT_PUBLIC_API_URL=https://api.yoohoo.guru` in Vercel
- ✅ Check CORS configuration in Railway includes frontend domains
- ✅ Verify DNS: `api.yoohoo.guru` points to Railway, not Vercel

**3. Firebase connection errors**
- ✅ Verify all Firebase variables are set correctly
- ✅ Check for emulator variables in production (should be absent)
- ✅ Verify service account has correct permissions

**4. "Environment configuration error" on startup**
- ✅ Check validation messages in logs
- ✅ Verify no prohibited variables are set
- ✅ Generate new secrets if using defaults

### Debug Commands

```bash
# Generate secure secrets
openssl rand -base64 32
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check environment
echo $NODE_ENV
echo $NEXTAUTH_SECRET | wc -c  # Should be > 32

# Test API endpoint
curl https://api.yoohoo.guru/health

# Verify DNS
dig api.yoohoo.guru
dig www.yoohoo.guru
```

## 📝 Migration Checklist

When updating from legacy configuration to unified configuration:

- [ ] Review `.env.production.example`
- [ ] Update Vercel environment variables with `NEXT_PUBLIC_*` variables
- [ ] Update Railway environment variables with backend variables
- [ ] Verify `NEXTAUTH_SECRET` matches in both platforms
- [ ] Set `AUTH_COOKIE_DOMAIN=.yoohoo.guru` in both platforms
- [ ] Remove any `REACT_APP_*` variables from Vercel
- [ ] Test cross-subdomain authentication
- [ ] Verify API connectivity
- [ ] Test payments (if applicable)
- [ ] Check all feature flags

---

**Last Updated:** 2025-12-08
**Version:** 2.0 (Unified Configuration)
