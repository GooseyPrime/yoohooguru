# Quick Deployment Guide - API URL Fix

## 🎯 What This Fix Does
This fix resolves the 404 error: `api.yoohoo.guru/skills?popular=true:1 Failed to load resource`

## ⚡ Quick Fix (5 Minutes)

### Step 1: Update Vercel Environment Variable
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your yoohoo.guru project
3. Go to **Settings** → **Environment Variables**
4. Find `REACT_APP_API_URL`
5. Change the value from:
   ```
   https://api.yoohoo.guru
   ```
   to:
   ```
   https://api.yoohoo.guru/api
   ```
6. Click **Save**

### Step 2: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete (~2-3 minutes)

### Step 3: Verify
1. Open https://yoohoo.guru in your browser
2. Open Developer Console (F12)
3. Navigate to a page that uses skills
4. Check Console - you should see **no 404 errors** for API calls
5. Check Network tab - API calls should go to `https://api.yoohoo.guru/api/skills` (with `/api`)

## 🔍 What Changed

### Before (Broken)
```
Frontend makes request to: https://api.yoohoo.guru/skills?popular=true
Backend expects route at:   https://api.yoohoo.guru/api/skills?popular=true
Result: 404 Error ❌
```

### After (Fixed)
```
Frontend makes request to: https://api.yoohoo.guru/api/skills?popular=true
Backend expects route at:   https://api.yoohoo.guru/api/skills?popular=true
Result: 200 OK ✅
```

## 📋 Technical Details

### Why This Happened
1. Frontend constructs URLs as: `${REACT_APP_API_URL}${path}`
2. Paths are like: `/skills`, `/auth/login`, etc. (no `/api` prefix)
3. Old `REACT_APP_API_URL` was: `https://api.yoohoo.guru` (missing `/api`)
4. Result: `https://api.yoohoo.guru/skills` instead of `https://api.yoohoo.guru/api/skills`

### Why This Works
- Backend routes are all mounted under `/api/*` (see `backend/src/index.js`)
- Frontend paths don't include `/api` prefix (see `frontend/src/lib/skillsApi.js`)
- The environment variable must include `/api` to complete the full path

## 🧪 Test Cases

After deploying, these should all work:
- ✅ `https://api.yoohoo.guru/api/skills` - Browse skills
- ✅ `https://api.yoohoo.guru/api/skills?popular=true` - Popular skills
- ✅ `https://api.yoohoo.guru/api/skills/javascript` - Skill details
- ✅ `https://api.yoohoo.guru/api/auth/login` - Authentication
- ✅ `https://api.yoohoo.guru/api/users/me` - User profile

## ❓ Troubleshooting

### Still seeing 404 errors?
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh (Ctrl+Shift+R)
3. Verify environment variable in Vercel is correct
4. Check Vercel deployment logs for any build errors

### Environment variable not updating?
1. Make sure you saved the change in Vercel
2. Redeploy the application (don't just wait for auto-deploy)
3. Check that the variable is set for "Production" environment

### Other API calls failing?
This fix should resolve ALL API calls, not just skills. If you're still seeing issues:
1. Check the Network tab in Developer Console
2. Look at the request URL - it should include `/api/`
3. If it doesn't, the environment variable may not be set correctly

## 📞 Support

If you continue to experience issues after deploying this fix:
1. Check that `REACT_APP_API_URL=https://api.yoohoo.guru/api` in Vercel
2. Verify the deployment succeeded without errors
3. Review browser console for any new error messages
4. Contact: support@yoohoo.guru

## 🎉 Success!

Once deployed, you should see:
- ✅ No 404 errors in browser console
- ✅ Skills page loads correctly
- ✅ Popular skills filter works
- ✅ All API functionality restored
