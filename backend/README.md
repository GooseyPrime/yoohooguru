# YooHoo.guru Backend API

Backend API for the YooHoo.guru skill-sharing platform. This Express.js API serves all 29 frontend subdomains and handles authentication, payments, skill exchanges, AI content curation, and more.

## Architecture

The backend is a Node.js/Express API deployed on Railway that serves as the central data and business logic layer for the entire YooHoo.guru platform.

### Key Responsibilities
- **Authentication**: JWT-based auth with Firebase integration
- **API Endpoints**: RESTful APIs for all platform features
- **AI Content Curation**: Automated news and blog generation (cron-scheduled)
- **Payment Processing**: Stripe integration for payments and payouts
- **Data Management**: Firebase Firestore operations
- **CORS Management**: Cross-subdomain request handling

### Data Flow
```
Frontend (29 subdomains) → Railway Backend → Firebase Firestore
                         ↓
                    Stripe Webhooks
                         ↓
                    OpenRouter AI (content generation)
```

## Railway Production Deployment

Railway is the recommended and configured deployment platform for the YooHoo.guru backend.

### Prerequisites
- Railway account connected to GitHub
- Firebase service account credentials
- Stripe API keys (live mode for production)
- OpenRouter API key (for AI content generation)

### Quick Deploy

**Option 1: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project (first time only)
cd backend
railway link

# Deploy
railway up
```

**Option 2: GitHub Integration (Recommended)**
- Push to `main` branch
- Railway auto-deploys from `backend/` directory
- Uses `railway.json` configuration

### Railway Configuration

The repository includes pre-configured Railway settings in `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Build Process

Railway automatically:
1. Detects Node.js project via `package.json`
2. Runs `npm ci` (clean install from package-lock.json)
3. Executes `npm run build` (echoes completion)
4. Starts server with `npm start` (runs `node src/index.js`)
5. Monitors health via `/health` endpoint

### Production Environment Variables

Configure these in Railway Dashboard → Variables:

**Core Configuration:**
```bash
NODE_ENV=production
PORT=8000
SERVE_FRONTEND=false
```

**Firebase Configuration (Service Account):**
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
> **Note**: Firebase private key must include `\n` for line breaks

**Security Secrets:**
```bash
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_min_32_chars
SESSION_SECRET=your_secure_session_secret_min_32_chars
```

**Stripe Configuration (Live Keys):**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...
```

**AI Content Generation:**
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

**CORS Configuration (All 29 Subdomains):**
```bash
# Enter as single line in Railway (comma-separated, no spaces)
CORS_ORIGIN_PRODUCTION=https://www.yoohoo.guru,https://coach.yoohoo.guru,\
https://angel.yoohoo.guru,https://heroes.yoohoo.guru,https://dashboard.yoohoo.guru,\
https://art.yoohoo.guru,https://business.yoohoo.guru,https://coding.yoohoo.guru,\
https://cooking.yoohoo.guru,https://crafts.yoohoo.guru,https://data.yoohoo.guru,\
https://design.yoohoo.guru,https://finance.yoohoo.guru,https://fitness.yoohoo.guru,\
https://gardening.yoohoo.guru,https://history.yoohoo.guru,https://home.yoohoo.guru,\
https://investing.yoohoo.guru,https://language.yoohoo.guru,https://marketing.yoohoo.guru,\
https://math.yoohoo.guru,https://music.yoohoo.guru,https://photography.yoohoo.guru,\
https://sales.yoohoo.guru,https://science.yoohoo.guru,https://sports.yoohoo.guru,\
https://tech.yoohoo.guru,https://wellness.yoohoo.guru,https://writing.yoohoo.guru
```

**Rate Limiting:**
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Custom Domain Setup

1. **Add Custom Domain in Railway:**
   - Go to Railway Dashboard → Settings → Networking
   - Click "Custom Domain"
   - Enter: `api.yoohoo.guru`
   - Railway provides CNAME target

2. **Configure DNS:**
   ```
   api.yoohoo.guru  CNAME  <your-railway-project>.railway.app
   ```

3. **Verify:**
   ```bash
   curl https://api.yoohoo.guru/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

### Post-Deployment Verification

**Health Check:**
```bash
curl https://api.yoohoo.guru/health
# Expected: {"status":"ok","timestamp":"2025-10-31T01:00:00.000Z","uptime":123.45}
```

**CORS Test:**
```bash
curl -H "Origin: https://www.yoohoo.guru" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://api.yoohoo.guru/api/auth/login
# Should include Access-Control-Allow-Origin header
```

**Authentication Test:**
```bash
curl -X POST https://api.yoohoo.guru/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'
# Should return authentication response or error
```

**AI Content Status:**
```bash
curl https://api.yoohoo.guru/api/admin/curation/status
# Should return news and blog agent status
```

### Monitoring & Logs

**View Live Logs:**
```bash
railway logs
# Or via Railway Dashboard → Deployments → Logs
```

**Key Metrics to Monitor:**
- Response time: < 500ms for most endpoints
- Health check: Should always return 200 OK
- Memory usage: Monitor for leaks
- CPU usage: Should be < 80% under normal load
- Cron job execution: News agents (6 AM, 3 PM EST), Blog agent (Monday 10 AM EST)

### Troubleshooting Production

**Issue: Build Failures**
```bash
# Check that package-lock.json is committed
git ls-files | grep package-lock.json

# Verify Node version in Railway matches package.json engines
cat package.json | grep -A 2 "engines"
```

**Issue: Health Check Failing**
```bash
# Test health endpoint locally
cd backend
npm start
curl http://localhost:8000/health

# Check Railway logs for startup errors
railway logs --tail 100
```

**Issue: CORS Errors**
```bash
# Verify CORS_ORIGIN_PRODUCTION includes all subdomains
railway variables get CORS_ORIGIN_PRODUCTION

# Test specific origin
curl -H "Origin: https://coach.yoohoo.guru" \
     -I https://api.yoohoo.guru/api/users
```

**Issue: Firebase Connection Errors**
```bash
# Verify Firebase credentials are set
railway variables get FIREBASE_PROJECT_ID
railway variables get FIREBASE_CLIENT_EMAIL

# Check that FIREBASE_PRIVATE_KEY has proper \n line breaks
railway variables get FIREBASE_PRIVATE_KEY | grep "\\n"
```

**Issue: AI Curation Not Running**
```bash
# Check agent status
curl https://api.yoohoo.guru/api/admin/curation/status

# Verify OpenRouter API key
railway variables get OPENROUTER_API_KEY

# Check cron logs in Railway dashboard
railway logs | grep "curation"
```

## Development

### Local Development Setup

```bash
# Install dependencies (from repository root)
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your development credentials

# Start development server (with auto-reload)
npm run dev
# Server runs at http://localhost:3001
```

### Testing

```bash
# Run all tests (uses Firebase emulators)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/auth.test.js
```

### Testing with Firebase Emulators

All test scripts automatically set `NODE_ENV=test` to ensure compatibility with Firebase emulators. This prevents accidental writes to production data.

**Requirements:**
- Firebase CLI installed: `npm install -g firebase-tools`
- Emulators configured in `firebase.json`

**Running tests:**
```bash
# Tests automatically start emulators
npm test

# Or manually start emulators for interactive testing
firebase emulators:start
```

For detailed information, see [docs/TESTING_WITH_FIREBASE_EMULATORS.md](../docs/TESTING_WITH_FIREBASE_EMULATORS.md)

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## API Documentation

The backend includes Swagger/OpenAPI documentation accessible at:
- Development: `http://localhost:3001/api-docs`
- Production: `https://api.yoohoo.guru/api-docs`

### Key Endpoints

**Authentication:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

**Users:**
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/skills` - Get user skills

**Skills & Exchanges:**
- `GET /api/skills` - List all skills
- `POST /api/exchanges` - Create skill exchange
- `GET /api/exchanges/:id` - Get exchange details

**Payments:**
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook handler

**Admin:**
- `POST /api/admin/curate` - Trigger manual content curation
- `GET /api/admin/curation/status` - Check curation agent status

## AI Content Curation

The backend includes automated AI agents that generate content for all 29 subdomains:

### News Curation Agent
- **Schedule**: Twice daily at 6 AM and 3 PM EST
- **Output**: 2 news articles per subdomain (48 articles per day, 96 total)
- **Storage**: Firestore `news` collection
- **Retention**: Maximum 10 articles per subdomain (auto-cleanup)

### Blog Curation Agent
- **Schedule**: Weekly on Monday at 10 AM EST
- **Output**: 1 blog post per subdomain (29 posts per week)
- **Storage**: Firestore `blogs` collection
- **Retention**: No automatic cleanup (permanent)

### Manual Triggering
```bash
# Trigger content curation via admin API
curl -X POST https://api.yoohoo.guru/api/admin/curate \
     -H "Authorization: Bearer <admin-jwt-token>"
```

## Security

### Production Security Checklist
- [x] HTTPS enabled via Railway
- [x] Environment variables secured in Railway dashboard
- [x] Firebase security rules configured
- [x] Rate limiting enabled (100 requests per 15 min)
- [x] Input validation via express-validator
- [x] Error messages sanitized (no sensitive data exposure)
- [x] Helmet.js security headers
- [x] CORS properly configured for all subdomains
- [x] Session secrets are cryptographically secure
- [x] JWT tokens use secure secrets
- [x] Stripe webhook signature verification

### Security Best Practices
- Never commit `.env` files with real secrets
- Use strong, random secrets (min 32 characters)
- Rotate secrets periodically
- Monitor Railway logs for suspicious activity
- Keep dependencies updated: `npm audit`

## Support & Documentation

- **Full Deployment Guide**: [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Environment Variables**: [../docs/ENVIRONMENT_VARIABLES.md](../docs/ENVIRONMENT_VARIABLES.md)
- **Railway Deployment**: [../docs/RAILWAY_DEPLOYMENT.md](../docs/RAILWAY_DEPLOYMENT.md)
- **Architecture Spec**: [../spec/site-spec.md](../spec/site-spec.md)
- **Issues**: [GitHub Issues](https://github.com/GooseyPrime/yoohooguru/issues)