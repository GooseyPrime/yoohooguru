# Production Deployment Guide - Turborepo Monorepo

## Overview

The yoohoo.guru platform uses a **Turborepo monorepo architecture** with 25+ Next.js applications. Each subdomain is deployed as a separate Vercel project with its own custom domain.

## Deployment Architecture

- **Frontend Apps (25)**: Vercel - Each Next.js app deployed separately
- **Backend API**: Railway - Single Node.js/Express API
- **Database & Auth**: Firebase - Firestore and Authentication

## DNS Configuration - CRITICAL ⚠️

**Correct DNS routing is essential for proper deployment:**

```
✅ CORRECT CONFIGURATION:
www.yoohoo.guru     → Vercel (apps/main)
angel.yoohoo.guru   → Vercel (apps/angel)
coach.yoohoo.guru   → Vercel (apps/coach)
heroes.yoohoo.guru  → Vercel (apps/heroes)
dashboard.yoohoo.guru → Vercel (apps/dashboard)
[20 more subdomains] → Vercel (apps/*)
api.yoohoo.guru     → Railway (backend)

❌ COMMON MISTAKE:
Pointing frontend subdomains to Railway instead of Vercel
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

## Vercel Multi-App Deployment

### Overview

Each of the 25 Next.js apps in `/apps` must be deployed as a **separate Vercel project** with its own custom domain.

### All Apps to Deploy

| App | Directory | Domain | Vercel Project Name |
|-----|-----------|--------|---------------------|
| Main | `apps/main` | www.yoohoo.guru | yoohooguru-main |
| Angel | `apps/angel` | angel.yoohoo.guru | yoohooguru-angel |
| Coach | `apps/coach` | coach.yoohoo.guru | yoohooguru-coach |
| Heroes | `apps/heroes` | heroes.yoohoo.guru | yoohooguru-heroes |
| Dashboard | `apps/dashboard` | dashboard.yoohoo.guru | yoohooguru-dashboard |
| Art | `apps/art` | art.yoohoo.guru | yoohooguru-art |
| Business | `apps/business` | business.yoohoo.guru | yoohooguru-business |
| Coding | `apps/coding` | coding.yoohoo.guru | yoohooguru-coding |
| Cooking | `apps/cooking` | cooking.yoohoo.guru | yoohooguru-cooking |
| Crafts | `apps/crafts` | crafts.yoohoo.guru | yoohooguru-crafts |
| Data | `apps/data` | data.yoohoo.guru | yoohooguru-data |
| Design | `apps/design` | design.yoohoo.guru | yoohooguru-design |
| Finance | `apps/finance` | finance.yoohoo.guru | yoohooguru-finance |
| Fitness | `apps/fitness` | fitness.yoohoo.guru | yoohooguru-fitness |
| Gardening | `apps/gardening` | gardening.yoohoo.guru | yoohooguru-gardening |
| Home | `apps/home` | home.yoohoo.guru | yoohooguru-home |
| Investing | `apps/investing` | investing.yoohoo.guru | yoohooguru-investing |
| Language | `apps/language` | language.yoohoo.guru | yoohooguru-language |
| Marketing | `apps/marketing` | marketing.yoohoo.guru | yoohooguru-marketing |
| Music | `apps/music` | music.yoohoo.guru | yoohooguru-music |
| Photography | `apps/photography` | photography.yoohoo.guru | yoohooguru-photography |
| Sales | `apps/sales` | sales.yoohoo.guru | yoohooguru-sales |
| Tech | `apps/tech` | tech.yoohoo.guru | yoohooguru-tech |
| Wellness | `apps/wellness` | wellness.yoohoo.guru | yoohooguru-wellness |
| Writing | `apps/writing` | writing.yoohoo.guru | yoohooguru-writing |

### Deploying a Single App

**Step 1: Create Vercel Project**
```bash
cd yoohooguru
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name (e.g., yoohooguru-main)
```

**Step 2: Configure in Vercel Dashboard**

Go to Vercel Dashboard → Project Settings → General:

```
Root Directory: apps/main  (or apps/angel, apps/coach, etc.)
Build Command: cd ../.. && turbo run build --filter=@yoohooguru/main
Output Directory: apps/main/.next
Install Command: npm install
Framework Preset: Next.js
Node.js Version: 20.x
```

**Step 3: Set Environment Variables**

In Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Required for all apps
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth configuration (adjust URL per app)
NEXTAUTH_URL=https://www.yoohoo.guru  # or angel.yoohoo.guru, etc.
NEXTAUTH_SECRET=your_secure_secret_key

# Cross-subdomain authentication
AUTH_COOKIE_DOMAIN=.yoohoo.guru
```

**Step 4: Add Custom Domain**

In Vercel Dashboard → Project Settings → Domains:
- Add domain: `www.yoohoo.guru` (for main app)
- Or: `angel.yoohoo.guru`, `coach.yoohoo.guru`, etc.

**Step 5: Deploy**
```bash
vercel --prod
```

### Bulk Deployment Script

For deploying all 25 apps, create a deployment script:

```bash
#!/bin/bash
# deploy-all-apps.sh

APPS=("main" "angel" "coach" "heroes" "dashboard" "art" "business" "coding" "cooking" "crafts" "data" "design" "finance" "fitness" "gardening" "home" "investing" "language" "marketing" "music" "photography" "sales" "tech" "wellness" "writing")

for app in "${APPS[@]}"; do
  echo "Deploying $app..."
  cd apps/$app
  vercel --prod --confirm
  cd ../..
done
```

## Railway Backend Deployment

The backend API serves all 25 frontend apps and is deployed as a single Railway service.

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

# CORS - Allow all frontend subdomains
CORS_ORIGIN_PRODUCTION=https://www.yoohoo.guru,https://angel.yoohoo.guru,https://coach.yoohoo.guru,https://heroes.yoohoo.guru,https://dashboard.yoohoo.guru,https://art.yoohoo.guru,https://business.yoohoo.guru,https://coding.yoohoo.guru,https://cooking.yoohoo.guru,https://crafts.yoohoo.guru,https://data.yoohoo.guru,https://design.yoohoo.guru,https://finance.yoohoo.guru,https://fitness.yoohoo.guru,https://gardening.yoohoo.guru,https://home.yoohoo.guru,https://investing.yoohoo.guru,https://language.yoohoo.guru,https://marketing.yoohoo.guru,https://music.yoohoo.guru,https://photography.yoohoo.guru,https://sales.yoohoo.guru,https://tech.yoohoo.guru,https://wellness.yoohoo.guru,https://writing.yoohoo.guru

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

Add all subdomains to Firebase Console → Authentication → Settings → Authorized domains:

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
home.yoohoo.guru
investing.yoohoo.guru
language.yoohoo.guru
marketing.yoohoo.guru
music.yoohoo.guru
photography.yoohoo.guru
sales.yoohoo.guru
tech.yoohoo.guru
wellness.yoohoo.guru
writing.yoohoo.guru
```

### Cross-Subdomain Authentication

The platform uses NextAuth with a shared cookie domain (`.yoohoo.guru`) to enable single sign-on across all subdomains. Users authenticated on one subdomain will remain authenticated when navigating to any other subdomain.

## Frontend Deployment

### Netlify Deployment

1. **Build Settings**
   ```bash
   # Build command
   cd frontend && npm install && npm run build
   
   # Publish directory
   frontend/dist
   ```

2. **Environment Variables**
   Add in Netlify dashboard under Site Settings → Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   # ... other REACT_APP_ variables
   ```

3. **Redirects Configuration**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
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