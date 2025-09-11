# 🚂 Railway Deployment - Standardized Configuration

Deploy yoohoo.guru to Railway with consistent configuration:

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to repository root and link project (REQUIRED)
cd yoohooguru
railway link

# Configure in Railway Dashboard → Settings:
# - Root Directory: "/" (for full-stack) OR "/backend" (for backend-only)
# - Build Command: "npm run build" (full-stack) OR "npm install && npm start" (backend-only)
# - Start Command: "npm start"

# Deploy (always from repository root)
railway up
```

## ⚡ Environment Variables Required

Set these in Railway dashboard before deployment:

```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
JWT_SECRET=your_super_secret_key
```

## 📁 Deployment Options

**Full-Stack Deployment (Recommended):**
- Railway Dashboard Root Directory: `/` (root)
- Build Command: `npm run build`
- Deploys: Frontend + Backend

**Backend-Only Deployment:**
- Railway Dashboard Root Directory: `/backend`
- Build Command: `npm install && npm start`  
- Deploys: Backend API only

**Important**: Always run `railway up` from repository root (`yoohooguru/`) regardless of which deployment option you choose. The platform configuration determines what gets deployed.

## 📚 Full Documentation

- [Complete Railway Guide](docs/RAILWAY_DEPLOYMENT.md)
- [Environment Variables Reference](.env.example)
- [Standardized Deployment Guide](README.md#-standardized-deployment-configuration)

## ✅ Health Check

After deployment, verify at: `https://your-app.railway.app/health`