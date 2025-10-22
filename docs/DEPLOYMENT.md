# Production Deployment Guide - Gateway Architecture

## Overview

The yoohoo.guru platform uses a **Gateway Architecture** with Edge Middleware routing. A single Vercel project serves all 29 subdomains (5 core + 24 subjects) through intelligent middleware-based routing.

## Deployment Architecture

- **Frontend (29 subdomains)**: Vercel - Single Next.js app with Edge Middleware
- **Backend API**: Railway - Single Node.js/Express API
- **Database & Auth**: Firebase - Firestore and Authentication

## Gateway Architecture Benefits

✅ **Single Vercel Project** - One deployment for all subdomains
✅ **Unlimited Subdomains** - No project count limits
✅ **Edge Middleware Routing** - Fast, intelligent subdomain routing
✅ **Simplified Configuration** - One set of environment variables
✅ **Easier Maintenance** - Update once, deploy everywhere
✅ **Cost Effective** - One project vs. multiple separate projects

## DNS Configuration - CRITICAL ⚠️

**Correct DNS routing is essential for proper deployment:**

```
✅ CORRECT CONFIGURATION:
*.yoohoo.guru        → Vercel (wildcard, all subdomains)
www.yoohoo.guru      → Vercel (apps/main gateway)
angel.yoohoo.guru    → Vercel (routed via middleware)
coach.yoohoo.guru    → Vercel (routed via middleware)
heroes.yoohoo.guru   → Vercel (routed via middleware)
dashboard.yoohoo.guru → Vercel (routed via middleware)
[24 subject subdomains] → Vercel (routed via middleware)
api.yoohoo.guru      → Railway (backend API)

❌ COMMON MISTAKE:
Pointing frontend subdomains to Railway instead of Vercel
Creating separate Vercel projects for each subdomain
```

### DNS Verification Commands
```bash
# Test DNS resolution for each subdomain
dig www.yoohoo.guru
dig angel.yoohoo.guru
dig api.yoohoo.guru

# Test actual routing
curl -I https://www.yoohoo.guru/        # Should return HTML (Vercel/Next.js)
curl -I https://api.yoohoo.guru/health  # Should return JSON (Railway/Express)
```

## Vercel Gateway Deployment

### Overview

A single Vercel project serves all 29 subdomains through Edge Middleware routing in `apps/main/middleware.ts`.

### All Subdomains (29 Total)

**Core Subdomains (5):**
1. www.yoohoo.guru
2. angel.yoohoo.guru
3. coach.yoohoo.guru
4. heroes.yoohoo.guru
5. dashboard.yoohoo.guru

**Subject Subdomains (24):**
6. art.yoohoo.guru
7. business.yoohoo.guru
8. coding.yoohoo.guru
9. cooking.yoohoo.guru
10. crafts.yoohoo.guru
11. data.yoohoo.guru
12. design.yoohoo.guru
13. finance.yoohoo.guru
14. fitness.yoohoo.guru
15. gardening.yoohoo.guru
16. history.yoohoo.guru
17. home.yoohoo.guru
18. investing.yoohoo.guru
19. language.yoohoo.guru
20. marketing.yoohoo.guru
21. math.yoohoo.guru
22. music.yoohoo.guru
23. photography.yoohoo.guru
24. sales.yoohoo.guru
25. science.yoohoo.guru
26. sports.yoohoo.guru
27. tech.yoohoo.guru
28. wellness.yoohoo.guru
29. writing.yoohoo.guru

### Deploying the Gateway

**Step 1: Create Single Vercel Project**
```bash
cd yoohooguru
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: yoohooguru-main
```

**Step 2: Configure in Vercel Dashboard**

Go to Vercel Dashboard → Project Settings → General:

```
Root Directory: apps/main
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Framework Preset: Next.js
Node.js Version: 20.x
```

**Step 3: Set Environment Variables**

In Vercel Dashboard → Project Settings → Environment Variables (shared across all subdomains):

```bash
# Required for all subdomains
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth configuration (no need for per-subdomain URLs with gateway)
NEXTAUTH_URL=https://www.yoohoo.guru
NEXTAUTH_SECRET=your_secure_secret_key

# Cross-subdomain authentication
AUTH_COOKIE_DOMAIN=.yoohoo.guru
```

**Step 4: Add All Custom Domains**

In Vercel Dashboard → Project Settings → Domains, add all 29 subdomains:
- www.yoohoo.guru
- angel.yoohoo.guru
- coach.yoohoo.guru
- heroes.yoohoo.guru
- dashboard.yoohoo.guru
- art.yoohoo.guru
- business.yoohoo.guru
- coding.yoohoo.guru
- cooking.yoohoo.guru
- crafts.yoohoo.guru
- data.yoohoo.guru
- design.yoohoo.guru
- finance.yoohoo.guru
- fitness.yoohoo.guru
- gardening.yoohoo.guru
- history.yoohoo.guru
- home.yoohoo.guru
- investing.yoohoo.guru
- language.yoohoo.guru
- marketing.yoohoo.guru
- math.yoohoo.guru
- music.yoohoo.guru
- photography.yoohoo.guru
- sales.yoohoo.guru
- science.yoohoo.guru
- sports.yoohoo.guru
- tech.yoohoo.guru
- wellness.yoohoo.guru
- writing.yoohoo.guru

**Step 5: Deploy**
```bash
vercel --prod
```

### How Gateway Routing Works

1. User visits `angel.yoohoo.guru`
2. Vercel routes request to single deployment
3. Edge Middleware in `apps/main/middleware.ts` detects subdomain
4. Middleware rewrites URL to `/_apps/angel/index` (internal rewrite)
5. User sees `angel.yoohoo.guru` but page is served from `apps/main/pages/_apps/angel/index.tsx`

## Railway Backend Deployment

The backend API serves all 29 frontend subdomains and is deployed as a single Railway service.

### Backend Configuration

**Step 1: Create Railway Project**
```bash
cd yoohooguru/backend
railway login
railway link  # Link to existing project or create new
```

**Step 2: Configure Railway Settings**

In Railway Dashboard → Settings:
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

**Step 3: Set Environment Variables**

In Railway Dashboard → Variables:

```bash
# Core Configuration
NODE_ENV=production
PORT=8000
SERVE_FRONTEND=false

# CORS - Allow all frontend subdomains (29 total)
CORS_ORIGIN_PRODUCTION=https://www.yoohoo.guru,https://angel.yoohoo.guru,https://coach.yoohoo.guru,https://heroes.yoohoo.guru,https://dashboard.yoohoo.guru,https://art.yoohoo.guru,https://business.yoohoo.guru,https://coding.yoohoo.guru,https://cooking.yoohoo.guru,https://crafts.yoohoo.guru,https://data.yoohoo.guru,https://design.yoohoo.guru,https://finance.yoohoo.guru,https://fitness.yoohoo.guru,https://gardening.yoohoo.guru,https://history.yoohoo.guru,https://home.yoohoo.guru,https://investing.yoohoo.guru,https://language.yoohoo.guru,https://marketing.yoohoo.guru,https://math.yoohoo.guru,https://music.yoohoo.guru,https://photography.yoohoo.guru,https://sales.yoohoo.guru,https://science.yoohoo.guru,https://sports.yoohoo.guru,https://tech.yoohoo.guru,https://wellness.yoohoo.guru,https://writing.yoohoo.guru

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Security
JWT_SECRET=your_secure_jwt_secret
SESSION_SECRET=your_secure_session_secret

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Step 4: Deploy**
```bash
cd backend
railway up
```

**Step 5: Configure Custom Domain**

In Railway Dashboard → Settings → Networking:
- Add custom domain: `api.yoohoo.guru`
- Update DNS CNAME record to point to Railway

### Health Check

Verify backend is running:
```bash
curl https://api.yoohoo.guru/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Firebase Configuration

### Authorized Domains

Add all 29 subdomains to Firebase Console → Authentication → Settings → Authorized domains:

```
www.yoohoo.guru
angel.yoohoo.guru
coach.yoohoo.guru
heroes.yoohoo.guru
dashboard.yoohoo.guru
art.yoohoo.guru
business.yoohoo.guru
coding.yoohoo.guru
cooking.yoohoo.guru
crafts.yoohoo.guru
data.yoohoo.guru
design.yoohoo.guru
finance.yoohoo.guru
fitness.yoohoo.guru
gardening.yoohoo.guru
history.yoohoo.guru
home.yoohoo.guru
investing.yoohoo.guru
language.yoohoo.guru
marketing.yoohoo.guru
math.yoohoo.guru
music.yoohoo.guru
photography.yoohoo.guru
sales.yoohoo.guru
science.yoohoo.guru
sports.yoohoo.guru
tech.yoohoo.guru
wellness.yoohoo.guru
writing.yoohoo.guru
```

### Cross-Subdomain Authentication

The gateway architecture uses NextAuth with a shared cookie domain (`.yoohoo.guru`) to enable single sign-on across all 29 subdomains. Users authenticated on one subdomain will remain authenticated when navigating to any other subdomain.

## Frontend Deployment

### Vercel Deployment (Recommended)

1. **Build Settings**
   ```bash
   # Root Directory: (empty/blank) 
   # Build Command: cd apps/main && npm run build
   # Output Directory: apps/main/.next
   # Install Command: npm ci && cd apps/main && npm ci
   # Framework Preset: Next.js
   # Node.js Version: 20.x
   ```

2. **Environment Variables**
   Add in Vercel dashboard under Settings → Environment Variables:
   ```
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-domain.com
   FIREBASE_API_KEY=your_key
   FIREBASE_AUTH_DOMAIN=your_domain
   FIREBASE_PROJECT_ID=your_project
   # ... other environment variables
   ```

3. **Custom Domains**
   Configure all subdomains in Vercel:
   ```
   www.yoohoo.guru (primary)
   yoohoo.guru
   heroes.yoohoo.guru
   coach.yoohoo.guru
   angel.yoohoo.guru
   # ... all 24 category subdomains
   ```

3. **Redirects Configuration**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

#### Netlify Plugin Troubleshooting

**Issue**: Build fails with plugin errors (e.g., `netlify-plugin-minify-html` not found)

**Root Cause**:
- The error may come from Netlify UI configuration (not netlify.toml)
- Previously configured plugins that were removed from code but remain in dashboard
- Cached plugin configurations

**Solution**:

1. **Remove UI-Configured Plugins** (CRITICAL):
   - Go to Netlify Dashboard → Site settings → Build & deploy → Build plugins
   - Remove any plugins not explicitly listed in `netlify.toml`
   - Especially remove: `netlify-plugin-minify-html` (if present)

2. **Essential Plugins** (Keep These):
   ```toml
   [[plugins]]
     package = "netlify-plugin-nx-skip-build"  # Required for monorepo

   [[plugins]]
     package = "@netlify/plugin-nextjs"  # Required for Next.js
   ```

3. **Built-in Optimization** (Recommended):
   Instead of external minify plugins, use Next.js built-in optimization in `apps/main/next.config.js`:
   ```javascript
   {
     swcMinify: true,           // Fast JS/TS minification
     compress: true,            // Gzip compression
     compiler: {
       removeConsole: {         // Remove console logs in production
         exclude: ['error', 'warn']
       }
     }
   }
   ```

   This approach is more reliable and maintained than external minify plugins.

4. **Clear Build Cache**:
   - Go to Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy

5. **Verify Configuration**:
   ```bash
   # Ensure netlify.toml only has essential plugins
   cat netlify.toml | grep -A 1 "[[plugins]]"

   # Check package.json devDependencies match netlify.toml
   cat package.json | grep -E "(netlify-plugin|@netlify)"
   ```

#### Netlify Secret Scanning Issues

**Issue**: Build fails with "secrets detected" or similar security warnings

**Root Cause**:
- Netlify's automatic secret scanner detects API keys, tokens, or secrets in the codebase
- May include false positives for legitimate public keys (Firebase API keys, Stripe publishable keys)
- Environment files with real secrets committed to git

**Solution**:

1. **Environment Variable Best Practices**:
   - **NEVER** commit files with real secrets to git
   - Use `.env.example` files with placeholder values in the repository
   - Set real values as environment variables in Vercel/Netlify dashboard
   - Keep `.env.shared` in `.gitignore` (already configured)

2. **Public vs. Private Keys**:
   - ✅ **Public keys** (safe in client code):
     - `NEXT_PUBLIC_FIREBASE_API_KEY` - Protected by Firebase security rules
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable keys (start with `pk_`)
     - These are meant to be public but may trigger scanners
   - ❌ **Private keys** (NEVER commit):
     - `NEXTAUTH_SECRET` - Must be in environment variables only
     - `STRIPE_SECRET_KEY` - Backend-only secrets
     - `FIREBASE_PRIVATE_KEY` - Service account credentials

3. **Secret Scanner Configuration**:
   - `.gitguardian.yaml` - Configures GitGuardian secret scanner
   - `.secretsignore` - Excludes files/patterns from scanning
   - Both files are already configured in the repository

4. **Fix Committed Secrets**:
   ```bash
   # Remove .env.shared from git tracking (keeps local file)
   git rm --cached .env.shared

   # Verify .gitignore includes .env.shared
   grep ".env.shared" .gitignore

   # Set real values in Vercel/Netlify dashboard instead
   ```

5. **Environment Variable Setup**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add the following variables for all environments:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=<your-real-key>
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-real-domain>
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-real-project>
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-real-key>
     NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
     ```

6. **Verify Clean Build**:
   ```bash
   # Ensure no secrets in tracked files
   git grep -i "AIza" --cached
   git grep -i "pk_live" --cached
   git grep -i "sk_" --cached

   # Should only show example files
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configuration**
   Create `vercel.json` in frontend directory:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```

   **Note**: Environment variables should be configured directly in the Vercel dashboard under Project Settings → Environment Variables, not in vercel.json.

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize**
   ```bash
   cd frontend
   firebase init hosting
   ```

3. **Configure**
   Update `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Backend Deployment

### Railway Deployment

Railway is the recommended deployment platform for yoohoo.guru backend. The repository is pre-configured for Railway deployment.

#### Quick Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy from Repository Root**
   ```bash
   # Deploy the entire project (backend will be deployed)
   railway up .
   ```

   Or deploy backend specifically:
   ```bash
   cd backend
   railway up
   ```

#### Detailed Setup

1. **Project Configuration**
   
   The repository includes `railway.json` and `Procfile` for automated deployment:
   
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm run build"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/health"
     }
   }
   ```
   
   **Note**: The build command uses `npm run build` (not `npm run build:backend`) because the backend serves the frontend static files. Both frontend and backend must be built for proper deployment.

2. **Environment Variables**
   
   Set required environment variables in Railway dashboard or via CLI:
   
   ```bash
   # Core Configuration
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   
   # Firebase Configuration
   railway variables set FIREBASE_PROJECT_ID=your_project_id
   railway variables set FIREBASE_API_KEY=your_api_key
   railway variables set FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   
   # JWT and Security
   railway variables set JWT_SECRET=your_super_secret_jwt_key
   
   # API Keys
   railway variables set OPENROUTER_API_KEY=your_openrouter_key
   railway variables set STRIPE_SECRET_KEY=sk_live_your_stripe_key
   
   # Rate Limiting
   railway variables set RATE_LIMIT_WINDOW_MS=900000
   railway variables set RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Custom Domain (Optional)**
   ```bash
   railway domain add yourdomain.com
   ```

4. **Monitoring**
   Railway provides built-in monitoring. Access logs via:
   ```bash
   railway logs
   ```

#### Deployment Commands Reference

| Command | Description |
|---------|-------------|
| `railway up .` | Deploy from repository root |
| `railway up` | Deploy from current directory |
| `railway deploy` | Deploy with existing configuration |
| `railway logs` | View deployment logs |
| `railway status` | Check deployment status |
| `railway variables` | Manage environment variables |
| `railway domain` | Manage custom domains |

#### Troubleshooting Railway Deployment

- **Build Failures**: Check that all dependencies are in `package.json`
- **Environment Variables**: Ensure all required vars are set in Railway
- **Port Issues**: Railway automatically assigns PORT, don't hardcode it
- **Health Checks**: Endpoint `/health` must return 200 status

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Configure**
   Create `Procfile` in backend directory:
   ```
   web: node src/index.js
   ```

4. **Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FIREBASE_PROJECT_ID=your_project_id
   # ... other variables
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### DigitalOcean App Platform

1. **Create App Spec**
   Create `.do/app.yaml`:
   ```yaml
   name: yoohooguru-backend
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/yoohooguru
       branch: main
     run_command: node src/index.js
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: PORT
       value: "8080"
   ```

### Docker Deployment

1. **Create Dockerfiles**

   Backend `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 3001
   CMD ["node", "src/index.js"]
   ```

   Frontend `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine as builder
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Docker Compose**
   Create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   
   services:
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       environment:
         - REACT_APP_API_URL=http://localhost:3001/api
   
     backend:
       build: ./backend
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - PORT=3001
       env_file:
         - .env
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Database Setup

### Firebase Configuration

1. **Security Rules**
   Configure in Firebase Console → Database → Rules:
   ```javascript
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
           ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
         }
       },
       "exchanges": {
         "$exchangeId": {
           ".read": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid",
           ".write": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid"
         }
       }
     }
   }
   ```

2. **Indexes**
   Configure in Firebase Console for optimal query performance:
   ```json
   {
     "rules": {},
     "indexes": {
       "users": {
         "tier": {}
       },
       "exchanges": {
         "teacherId": {},
         "learnerId": {},
         "status": {}
       }
     }
   }
   ```

## SSL/HTTPS Setup

### Let's Encrypt (for VPS)

1. **Install Certbot**
   ```bash
   sudo apt install certbot
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Nginx Configuration

Create `/etc/nginx/sites-available/yoohooguru`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/yoohooguru/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Production Logging

1. **Winston Configuration**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Health Checks**
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({
       status: 'OK',
       timestamp: new Date().toISOString(),
       uptime: process.uptime()
     });
   });
   ```

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/node
   ```

   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   ```

## Performance Optimization

### Frontend Optimization

1. **Build Optimization**
   ```javascript
   // webpack.config.js
   module.exports = {
     optimization: {
       splitChunks: {
         chunks: 'all',
         cacheGroups: {
           vendor: {
             test: /[\\/]node_modules[\\/]/,
             name: 'vendors',
             chunks: 'all',
           },
         },
       },
     },
   };
   ```

2. **Service Worker**
   ```javascript
   // Register in index.js
   if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
     navigator.serviceWorker.register('/service-worker.js');
   }
   ```

### Backend Optimization

1. **Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Caching Headers**
   ```javascript
   app.use('/static', express.static('public', {
     maxAge: '1y',
     etag: false
   }));
   ```

## Backup & Recovery

### Database Backup

1. **Firebase Export**
   ```bash
   firebase database:get / > backup-$(date +%Y%m%d).json
   ```

2. **Automated Backups**
   ```bash
   #!/bin/bash
   # backup.sh
   DATE=$(date +%Y%m%d)
   firebase database:get / > backup-$DATE.json
   aws s3 cp backup-$DATE.json s3://your-backup-bucket/
   ```

### Code Backup

1. **Git Tags**
   ```bash
   git tag -a v1.0.0 -m "Production release v1.0.0"
   git push origin v1.0.0
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API URL in frontend environment
   - Verify CORS configuration in backend
   - Ensure proper protocol (http vs https)

2. **Firebase Connection Issues**
   - Verify service account credentials
   - Check Firebase project settings
   - Ensure proper environment variables

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Health Checks

```bash
# Test backend health
curl https://your-api-domain.com/health

# Test frontend
curl https://your-frontend-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive data
- [ ] Dependencies updated and scanned
- [ ] CORS properly configured
- [ ] Headers security (Helmet.js)
- [ ] Authentication tokens secured

## Post-Deployment

1. **Test all functionality**
2. **Monitor logs for errors**
3. **Set up monitoring alerts**
4. **Configure backup schedules**
5. **Update DNS records**
6. **Test mobile responsiveness**
7. **Verify PWA functionality**

This deployment guide ensures yoohoo.guru is properly deployed with security, performance, and reliability best practices.