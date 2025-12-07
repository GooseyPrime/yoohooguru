# Quick Start: Enable Maps on yoohoo.guru

## TL;DR

**Maps are already coded and ready. You just need to add 1 environment variable in Vercel.**

## 30-Second Setup

1. Get Google Maps API key: https://console.cloud.google.com/google/maps-apis
2. Go to Vercel → yoohoo.guru project → Settings → Environment Variables
3. Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = your-api-key
4. Redeploy
5. ✅ Maps appear!

## Current State

### What You See Now (Without API Key)
```
┌─────────────────────────────────────┐
│  Find Experts Near You              │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  [Loading Map Icon]           │  │
│  │  "Google Maps API key is      │  │
│  │   not configured"             │  │
│  │                               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### What You'll See After (With API Key)
```
┌─────────────────────────────────────┐
│  Find Experts Near You              │
│  ┌───────────────────────────────┐  │
│  │ [Search Box] [Near Me] [25mi] │  │
│  │ ┌──────────────────────────┐  │  │
│  │ │  Interactive Google Map   │  │  │
│  │ │  with markers for:        │  │  │
│  │ │   🟢 Expert Gurus         │  │  │
│  │ │   🔵 Available Gigs       │  │  │
│  │ └──────────────────────────┘  │  │
│  │ [Stats] 6 Experts | 5 Gigs    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Step-by-Step with Screenshots

### Step 1: Get Google Maps API Key

1. Go to: https://console.cloud.google.com/google/maps-apis
2. Create new project or select existing
3. Enable these 3 APIs:
   - ✅ Maps JavaScript API
   - ✅ Places API
   - ✅ Geocoding API
4. Create Credentials → API Key
5. Copy the key (looks like: `AIzaSyD...`)

**Restrict the key (Important!):**
- Application restrictions → HTTP referrers
- Add:
  - `https://www.yoohoo.guru/*`
  - `https://*.yoohoo.guru/*`
- API restrictions → Select the 3 APIs above

### Step 2: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your yoohoo.guru project
3. Click "Settings" tab at top
4. Click "Environment Variables" in left sidebar
5. Click "Add New" or "Add Variable" button
6. Fill in:
   ```
   Key:   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: AIzaSyD... (your actual key)
   
   Environments:
   ✅ Production
   ✅ Preview
   □ Development (optional)
   ```
7. Click "Save"

### Step 3: Redeploy

**Option A: Push a commit (easiest)**
```bash
git commit --allow-empty -m "Trigger redeploy for maps"
git push origin main
```

**Option B: Manual redeploy in Vercel**
1. Go to "Deployments" tab
2. Click ⋯ menu on latest deployment
3. Click "Redeploy"

### Step 4: Verify

After deployment completes (2-3 minutes):

1. Visit: https://www.yoohoo.guru
2. Scroll to "Find Experts & Opportunities Near You"
3. You should see:
   - ✅ Interactive Google Map
   - ✅ Search bar works
   - ✅ "Near Me" button
   - ✅ Markers for sample experts/gigs
   - ✅ Stats showing counts

**Test these:**
- Type "New York" in search → Map pans to NYC
- Click "Near Me" → Requests your location
- Click a marker → Info popup shows details
- Change radius → Circle updates on map

## Troubleshooting

### Map Still Shows Error

**Check 1: Environment Variable**
- Go to Vercel → Settings → Environment Variables
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` exists
- Verify it's enabled for "Production"
- Verify there are no typos

**Check 2: Did You Redeploy?**
- Environment variables only take effect after redeploy
- Go to Deployments tab
- Latest deployment should be AFTER you added the variable

**Check 3: API Key Valid?**
- Go to Google Cloud Console
- Check if all 3 APIs are enabled
- Check if key restrictions allow your domain

### "This page can't load Google Maps correctly"

This means API key has wrong restrictions:
1. Go to Google Cloud Console → Credentials
2. Click your API key
3. Under "Application restrictions":
   - Choose "HTTP referrers"
   - Add: `https://*.yoohoo.guru/*`
4. Under "API restrictions":
   - Restrict to: Maps JavaScript API, Places API, Geocoding API
5. Save
6. Wait 5 minutes for changes to propagate
7. Hard refresh browser (Ctrl+Shift+R)

### Map Tiles Not Loading

- Clear browser cache
- Check browser console (F12) for CSP errors
- This PR already fixed CSP headers, so shouldn't happen

## Cost

Google provides **$200/month free credit** for Maps API.

Typical usage for yoohoo.guru:
- ~5,000 map loads/month = $35
- ~2,000 searches/month = $34
- ~1,000 geocodes/month = $5
- **Total: ~$74/month** (under free tier ✅)

Set billing alerts at $100, $150 to be safe.

## Files for Reference

If you need more details:
- `MAPPING_FEATURES_SOLUTION.md` - Complete technical explanation
- `docs/VERCEL_GOOGLE_MAPS_SETUP.md` - Detailed Vercel setup
- `docs/GOOGLE_MAPS_SETUP.md` - Google Cloud setup
- `.env.example` - Shows the exact variable name

## Support

Questions? Check:
1. Browser console (F12) for specific errors
2. Vercel deployment logs
3. Google Cloud Console quotas/usage

The mapping code is production-ready. Just add the key and deploy! 🚀
