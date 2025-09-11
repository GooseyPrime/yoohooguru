# 🚂 Railway Deployment - Quick Start

Deploy yoohoo.guru backend to Railway in 3 commands:

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to repository root and deploy (IMPORTANT: Must be in root directory)
cd yoohooguru
railway up .
```

## ⚡ Environment Variables Required

Set these in Railway dashboard before deployment:

```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
JWT_SECRET=your_super_secret_key
```

## 📁 Directory Requirements

- **Full-Stack Deployment**: Run from `yoohooguru/` (root directory)
- **Backend-Only Deployment**: Run from `yoohooguru/backend/` directory

```powershell
# Option 1: Full-stack (recommended)
cd yoohooguru
railway up .

# Option 2: Backend only  
cd yoohooguru/backend
railway up
```

## 📚 Full Documentation

- [Complete Railway Guide](docs/RAILWAY_DEPLOYMENT.md)
- [Environment Variables Reference](.env.example)
- [General Deployment Guide](docs/DEPLOYMENT.md)

## ✅ Health Check

After deployment, verify at: `https://your-app.railway.app/health`