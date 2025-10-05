# Frontend/Backend Decoupling Fix - Issue #127

## 🎯 Problem Solved

Fixed critical deployment issue where:
- ❌ `api.yoohoo.guru` was serving HTML instead of API
- ❌ `www.yoohoo.guru` showed blank white screen  
- ❌ Images were blocked by CSP
- ❌ Google authentication failed due to domain issues

## ✅ Solution Applied

### 1. Backend Configuration (Railway)
Fixed `nixpacks.toml` and `railway.json` to ensure backend only serves API:
```toml
# nixpacks.toml - Only build backend
[phases.install]
cmds = ["npm install", "cd backend && npm install"]
[phases.build]
cmds = ["cd backend && npm run build"]
[start]
cmd = "cd backend && npm start"
```

### 2. Frontend Configuration (Vercel)  
Fixed CSP headers and environment variable names:
```html
<!-- Added api.yoohoo.guru to connect-src -->
connect-src 'self' https://api.yoohoo.guru ...
```

### 3. Environment Variables
Corrected documentation: `VITE_*` → `REACT_APP_*` (uses Webpack, not Vite)

## 🚀 Quick Deployment Fix

Run this helper script for environment variable setup:
```bash
./scripts/deployment-fix-helper.sh
```

## 🔍 Verify Fix Works

After deployment, verify the fix:
```bash
node scripts/verify-deployment.js
```

Expected results:
- ✅ `https://api.yoohoo.guru/` returns JSON (API info)
- ✅ `https://www.yoohoo.guru/` returns HTML (React app)
- ✅ No CORS errors between domains
- ✅ Google auth works from frontend

## 📋 Critical Environment Variables

### Railway (Backend)
```bash
NODE_ENV=production
SERVE_FRONTEND=false  # ← CRITICAL!
CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://*.vercel.app
```

### Vercel (Frontend)
```bash
REACT_APP_API_URL=https://api.yoohoo.guru/api  # ← CRITICAL!
```

## 📚 Documentation Updated

- `DEPLOYMENT_FIX_CHECKLIST.md` - Complete fix checklist
- `docs/DEPLOYMENT.md` - Corrected env var names  
- `.env.example` - Updated with correct variables

---

**Result:** Clean separation of concerns with api.yoohoo.guru serving only API endpoints and yoohoo.guru serving the React frontend.