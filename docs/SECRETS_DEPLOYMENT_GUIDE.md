# Secrets & Variables Deployment Guide

This document provides a comprehensive guide for configuring environment variables and secrets across different deployment platforms for the yoohoo.guru skill-sharing platform.

## 🏗️ Deployment Architecture

- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Railway
- **Database & Auth**: Firebase/Google Cloud Platform
- **Payments**: Stripe Dashboard
- **AI Services**: OpenRouter

## 🔐 Secrets by Platform

### 1. Frontend Secrets (Vercel Console)

Configure these in your Vercel project dashboard under Settings → Environment Variables:

#### Firebase Configuration (Public - Safe for Frontend)
```env
VITE_FIREBASE_API_KEY=AIza...your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:your_app_id
```

#### API Configuration
```env
VITE_API_URL=https://api.yoohoo.guru
```

#### Stripe Public Keys (Safe for Frontend)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

**Note**: Use `VITE_*` prefix for Vite-based apps or `NEXT_PUBLIC_*` for Next.js apps.

### 2. Backend Secrets (Railway Console)

Configure these in your Railway project dashboard under Variables:

#### Core Application
```env
NODE_ENV=production
SERVE_FRONTEND=false
```

#### CORS & Security
```env
CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://*.vercel.app
JWT_SECRET=your_super_secure_jwt_secret_256_bits_minimum
```

#### Firebase Admin SDK (Server-Side Only)
```env
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
```

#### Stripe Secret Keys (Server-Side Only)
```env
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_WEBHOOK_ID=we_your_webhook_id
STRIPE_GURU_PASS_PRICE_ID=price_your_guru_pass_price_id
STRIPE_SKILL_VERIFICATION_PRICE_ID=price_your_skill_verification_price_id  
STRIPE_TRUST_SAFETY_PRICE_ID=price_your_trust_safety_price_id
```

#### AI Services
```env
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
```

#### Email Configuration (Optional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
```

#### Database (if using additional DB)
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Admin Access
```env
ADMIN_KEY=your_admin_access_key_for_operations
```

### 3. Firebase/Google Console

Configure these in the Firebase Console and Google Cloud Platform:

#### Firebase Project Settings
1. Go to Firebase Console → Project Settings
2. Add your domains to authorized domains:
   - `yoohoo.guru`
   - `www.yoohoo.guru`
   - Your Vercel preview domains

#### Service Account (for Backend)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Use the email and private key in Railway backend configuration

#### Google OAuth (if using Google Sign-In)
1. Go to Google Cloud Console → APIs & Credentials
2. Configure OAuth 2.0 Client IDs
3. Add authorized origins and redirect URIs

### 4. Stripe Dashboard

Configure these in your Stripe Dashboard:

#### Webhooks
1. Create webhook endpoint pointing to: `https://api.yoohoo.guru/api/stripe/webhook`
2. Enable events: `checkout.session.completed`, `payment_intent.succeeded`, etc.
3. Copy webhook secret to Railway backend config

#### Products & Pricing
Create these products and copy their price IDs:
- Guru Pass Subscription
- Skill Verification Service  
- Trust & Safety Features

## 📋 Public Configuration Variables

These can remain in `.env.example` and don't need to be secret:

```env
# App Branding
APP_BRAND_NAME=yoohoo.guru
APP_DISPLAY_NAME=yoohoo.guru
APP_LEGAL_EMAIL=legal@yoohoo.guru
APP_PRIVACY_EMAIL=privacy@yoohoo.guru
APP_SUPPORT_EMAIL=support@yoohoo.guru
APP_CONTACT_ADDRESS=yoohoo.guru, Legal Department

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MESSAGE=Too many requests from this IP, please try again later.

# Server Configuration  
EXPRESS_JSON_LIMIT=10mb
EXPRESS_URL_LIMIT=10mb
PORT=3001
API_BASE_URL=http://localhost:3001

# File Upload Limits
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# Feature Flags
FEATURE_AI_RECOMMENDATIONS=false
FEATURE_MOBILE_APP=false
FEATURE_DARK_MODE=false
FEATURE_MODIFIED_MASTERS=true
ADMIN_WRITE_ENABLED=false
```

## 🔒 Security Best Practices

### 1. Secret Management
- ✅ Never commit secrets to version control
- ✅ Use environment-specific secrets (dev/staging/prod)
- ✅ Rotate secrets regularly
- ✅ Use strong, randomly generated JWT secrets
- ✅ Limit CORS origins to actual domains

### 2. Access Control
- ✅ Use least-privilege principle for service accounts
- ✅ Enable MFA on all admin accounts
- ✅ Regularly audit access permissions
- ✅ Monitor for unauthorized access attempts

### 3. Deployment Security
- ✅ Use HTTPS for all production URLs
- ✅ Enable webhook signature verification
- ✅ Implement rate limiting and DDoS protection
- ✅ Regular security audits and updates

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] Configure all `VITE_*` environment variables
- [ ] Set correct API URL for your backend
- [ ] Add Firebase configuration
- [ ] Add Stripe publishable key
- [ ] Test build and deployment

### Backend (Railway)
- [ ] Configure Node.js environment variables
- [ ] Add Firebase admin service account credentials
- [ ] Configure Stripe secret keys and webhooks
- [ ] Set JWT secret and CORS origins
- [ ] Add optional services (email, AI)
- [ ] Test health endpoint and deployment

### Firebase/Google
- [ ] Configure authorized domains
- [ ] Set up service account with proper permissions
- [ ] Configure OAuth if using Google Sign-In
- [ ] Set up Firestore security rules
- [ ] Test authentication and database access

### Stripe
- [ ] Create products and pricing
- [ ] Configure webhook endpoints
- [ ] Test payment flows
- [ ] Verify webhook signatures

## 🧪 Testing Configuration

Use these test values for development/staging:

```env
# Use test keys from respective services
STRIPE_SECRET_KEY=sk_test_...
FIREBASE_PROJECT_ID=your-test-project
JWT_SECRET=test_jwt_secret_not_for_production
```

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Verify CORS_ORIGIN matches your frontend domain exactly
2. **Firebase auth errors**: Check service account permissions and project ID
3. **Stripe webhook failures**: Verify webhook secret and endpoint URL
4. **JWT errors**: Ensure JWT_SECRET is set and consistent across services

### Debug Commands
```bash
# Check backend health
curl https://api.yoohoo.guru/health

# Test frontend build
npm run build --workspace=frontend

# Test backend locally with production env
NODE_ENV=production npm start --workspace=backend
```

## 📞 Support

For deployment assistance:
- Technical issues: support@yoohoo.guru
- Security concerns: security@yoohoo.guru
- General questions: help@yoohoo.guru