# Setting Up Google Maps API Key in Vercel

This guide walks you through configuring the Google Maps API key for the yoohoo.guru platform deployed on Vercel.

## Prerequisites

- Access to the Vercel project dashboard
- A Google Maps API key (see [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md) for obtaining one)

## Why Maps Are Not Visible

If you see the map components on the homepage, coach page, or angel page but they don't display actual maps, it's likely because the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable is not configured in Vercel.

### Symptoms

- Map section shows a loading state or error message
- Console shows "Missing Google Maps API key" error
- Map container appears but no interactive map is displayed
- "Failed to load Google Maps" or "Google Maps API key is not configured" message

## Step-by-Step Setup

### 1. Access Vercel Project Settings

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your yoohoo.guru project
3. Click on the **Settings** tab at the top

### 2. Add Environment Variable

1. In the left sidebar, click **Environment Variables**
2. Click **Add New** or **Add Variable**
3. Fill in the form:
   - **Key (Name):** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** Your Google Maps API key (e.g., `AIza...`)
   - **Environment:** Select all that apply:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (optional, for local development via Vercel CLI)

4. Click **Save**

### 3. Redeploy the Application

After adding the environment variable, you must redeploy for changes to take effect:

**Option A: Trigger via Git (Recommended)**
```bash
# Make a small change (e.g., add a comment) and commit
git commit --allow-empty -m "Trigger redeploy for Google Maps API key"
git push origin main
```

**Option B: Manual Redeploy in Vercel**
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**
5. Confirm the redeploy

### 4. Verify the Deployment

After the deployment completes:

1. Visit your production site: https://www.yoohoo.guru
2. Navigate to a page with a map:
   - Homepage: Scroll to "Find Experts & Opportunities Near You" section
   - Coach page: https://coach.yoohoo.guru (scroll to map section)
   - Angel page: https://angel.yoohoo.guru (scroll to map section)
3. Verify the map loads correctly:
   - Interactive Google Map should be visible
   - Search functionality should work
   - Location markers should appear
   - "Near Me" button should request location permission

### 5. Test Functionality

Once the map is visible, test these features:

- **Search:** Type a city name and press Enter
- **Near Me:** Click the location button to use your current location
- **Radius:** Change the search radius (5, 10, 25, 50, 100 miles)
- **Markers:** Click on map markers to see expert/gig details
- **Filters:** Use category and type filters

## Troubleshooting

### Map Still Not Showing After Redeploy

1. **Clear Browser Cache:** Hard refresh with Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Check Console:** Open browser DevTools (F12) and check for errors
3. **Verify Environment Variable:** 
   - Go back to Vercel Settings → Environment Variables
   - Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is listed
   - Ensure it's enabled for Production environment
   - Check for typos in the variable name or value

### "This page can't load Google Maps correctly" Error

This error typically means:
- The API key is invalid or expired
- The API key has incorrect restrictions
- Required APIs are not enabled in Google Cloud Console

**Solutions:**
1. Verify the API key in [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Ensure these APIs are enabled:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Check API key restrictions:
   - HTTP referrers should include: `https://www.yoohoo.guru/*`, `https://*.yoohoo.guru/*`
   - API restrictions should allow the three APIs above

### Environment Variable Not Taking Effect

If you added the environment variable but it's still not working:

1. **Check Variable Name:** Must be exactly `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (case-sensitive)
2. **Check Value:** No extra spaces, quotes, or newlines
3. **Verify Environment:** Ensure "Production" is checked if deploying to production
4. **Redeploy:** A redeploy is **required** after adding/changing environment variables

### Map Shows "Development Purposes Only" Watermark

This indicates:
- The API key has restrictions that don't allow your production domain
- The API key is a restricted/test key

**Solution:**
Update your API key's HTTP referrer restrictions in Google Cloud Console to include:
```
https://www.yoohoo.guru/*
https://*.yoohoo.guru/*
```

## Security Best Practices

### 1. Use API Key Restrictions

Always restrict your API key in Google Cloud Console:

**Application Restrictions:**
- Choose "HTTP referrers"
- Add:
  - `https://www.yoohoo.guru/*`
  - `https://*.yoohoo.guru/*`
  - For preview deployments: `https://*.vercel.app/*`

**API Restrictions:**
- Restrict key to only required APIs:
  - Maps JavaScript API
  - Places API
  - Geocoding API

### 2. Monitor API Usage

Set up billing alerts in Google Cloud Console:
- Alert at 50% of free tier ($100)
- Alert at 75% of free tier ($150)
- Alert at 90% of free tier ($180)

Google provides $200/month free credit which is usually sufficient.

### 3. Separate Keys for Different Environments

Consider using different API keys for:
- **Production:** Restricted to `*.yoohoo.guru`
- **Preview/Staging:** Restricted to `*.vercel.app`
- **Development:** Restricted to `localhost`

Add them as:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Production)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Preview) - can be the same or different
- Store development key in local `.env.local` file (never commit)

## Environment Variable Reference

| Variable Name | Required | Description |
|--------------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ Yes | Google Maps API key for map display, location search, and geocoding. Must use `NEXT_PUBLIC_` prefix for Next.js client-side access. |

**Important:** The `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser. Do not use `REACT_APP_` prefix (that's for Create React App, not Next.js).

## Related Documentation

- [Google Maps Setup Guide](./GOOGLE_MAPS_SETUP.md) - How to obtain and configure a Google Maps API key
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md) - Complete list of environment variables
- [Deployment Guide](./DEPLOYMENT.md) - General deployment instructions
- [Vercel Deployment Control](./VERCEL_DEPLOYMENT_CONTROL.md) - Managing Vercel deployments

## Support

If you continue to experience issues:

1. Check the [Vercel deployment logs](https://vercel.com/docs/deployments/logs)
2. Review the browser console for JavaScript errors
3. Verify the API key works in [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
4. Contact the development team or open an issue on GitHub
