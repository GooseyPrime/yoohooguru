# Google Maps API Setup Guide

This guide walks you through setting up the Google Maps API for the yoohoo.guru platform.

## Overview

The Google Maps API is used throughout the platform for location-based features:

1. **Homepage Location Autocomplete** - When autodetect location is disabled, users can search for their location using Google Places Autocomplete
2. **Angels List Map** - Displays angel job locations on a map with privacy protection (spatial "fluff")
3. **Coach Dashboard Map** - Shows guru/coach locations with privacy protection

## Required APIs

The platform requires three Google Maps APIs:

- **Maps JavaScript API** - For interactive map display
- **Places API** - For location autocomplete and place search
- **Geocoding API** - For converting addresses to coordinates and vice versa

## Setup Instructions

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "yoohoo-guru-maps")
4. Click "Create"

### Step 2: Enable Required APIs

1. In your project, navigate to "APIs & Services" → "Library"
2. Search for and enable each of the following:
   - **Maps JavaScript API**
   - **Places API** 
   - **Geocoding API**
3. Click "Enable" for each API

### Step 3: Create API Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API key"
3. Copy the generated API key
4. Click "Restrict Key" (recommended for production)

### Step 4: Configure API Key Restrictions (Recommended)

#### Application Restrictions

Set HTTP referrer restrictions to prevent unauthorized use:

**Development:**
```
http://localhost:3000/*
http://127.0.0.1:3000/*
```

**Production:**
```
https://yoohoo.guru/*
https://www.yoohoo.guru/*
```

#### API Restrictions

Restrict the key to only the required APIs:
- Maps JavaScript API
- Places API
- Geocoding API

### Step 5: Add to Environment Variables

#### For Development (.env)

```bash
# In your local .env file (Next.js apps use NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

#### For Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Key:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** Your API key
   - **Environment:** Production, Preview, Development (as needed)
4. Redeploy your application

**Important:** This is a Next.js application, so environment variables exposed to the browser must use the `NEXT_PUBLIC_` prefix, not `REACT_APP_`. The old `REACT_APP_` prefix was for Create React App and is no longer used.

## Usage in Components

The API key is automatically used by the following components:

### EnhancedLocationSelector

Located at `frontend/src/components/EnhancedLocationSelector.js`

- Provides Google Places Autocomplete for location search
- Falls back to manual city/zip code entry if autocomplete fails
- Includes GPS location detection

```javascript
// Loaded automatically
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
```

### LocationMap

Located at `frontend/src/components/LocationMap.js`

- Displays interactive maps with markers
- Supports tagging locations
- Includes privacy protection with spatial offset

```javascript
// Loaded automatically
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
```

## Privacy Features

The platform includes privacy protections for location data:

1. **Spatial Fluff** - Actual locations are offset by a small random amount to protect user privacy
2. **Approximate Markers** - Map markers show general area rather than exact addresses
3. **No Precise Coordinates** - Exact GPS coordinates are never stored or displayed publicly

## Cost Considerations

### Google Maps Pricing

Google provides a monthly credit of $200 for Maps API usage:
- Maps JavaScript API: $7 per 1,000 loads
- Places API: $17 per 1,000 requests
- Geocoding API: $5 per 1,000 requests

**Example Monthly Usage Estimate:**
- 5,000 map loads = $35
- 2,000 autocomplete requests = $34
- 1,000 geocoding requests = $5
- **Total = $74** (well under $200 free tier)

### Cost Optimization Tips

1. **Implement client-side caching** - Cache geocoding results
2. **Use session tokens** - For Places Autocomplete to reduce costs
3. **Set usage limits** - Configure daily quotas in Google Cloud Console
4. **Monitor usage** - Set up billing alerts at $50, $100, $150

## Troubleshooting

### API Key Not Working

**Issue:** Maps fail to load or show "For development purposes only" watermark

**Solutions:**
1. Verify the API key is correct in environment variables
2. Check that all three APIs are enabled in Google Cloud Console
3. Ensure HTTP referrer restrictions match your domain
4. Clear browser cache and hard refresh (Ctrl+Shift+R)
5. Redeploy the application after adding the environment variable

### CORS Errors

**Issue:** "Access to fetch at 'maps.googleapis.com' has been blocked by CORS policy"

**Solution:** The CSP headers in `vercel.json` have been configured to allow Google Maps domains:
- `https://maps.googleapis.com` - For API calls
- `https://maps.gstatic.com` - For map tiles and assets

If you see CORS errors, verify the CSP configuration includes these domains.

### Autocomplete Not Working

**Issue:** Location autocomplete dropdown doesn't appear

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify Places API is enabled in Google Cloud Console
3. Ensure the component is properly initialized
4. Check that the input field has the correct ref attached

### Map Not Displaying

**Issue:** Map container is empty or shows gray box

**Solutions:**
1. Verify Maps JavaScript API is enabled
2. Check that the map container has a defined height in CSS
3. Ensure the center coordinates are valid
4. Check browser console for API errors or quota exceeded messages

## Testing

### Development Testing

```bash
# Start the development server
cd frontend
npm run dev

# Test the location selector on homepage
# Open http://localhost:3000

# Test angels list map
# Navigate to /angels-list

# Test coach dashboard map
# Navigate to /dashboard/coach (requires authentication)
```

### Production Testing

After deploying to Vercel:

1. Visit https://www.yoohoo.guru
2. Test location autocomplete:
   - Click "Change Location" or "Set Your Location"
   - Start typing a city name
   - Verify autocomplete suggestions appear
3. Test Angels List map:
   - Navigate to Angels List page
   - Verify map loads and displays markers
4. Test Coach Dashboard map (requires login):
   - Login as a coach/guru
   - Navigate to dashboard
   - Click "Local" tab
   - Verify map displays tagged locations

## API Usage Monitoring

### View Usage Statistics

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Dashboard"
4. View metrics for each API:
   - Traffic (requests per day)
   - Errors (if any)
   - Latency

### Set Up Billing Alerts

1. Go to "Billing" → "Budgets & alerts"
2. Click "Create Budget"
3. Set alert thresholds:
   - Alert at 50% of $200 = $100
   - Alert at 75% of $200 = $150
   - Alert at 90% of $200 = $180

## Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Use API restrictions** - Limit key to specific APIs
3. **Set referrer restrictions** - Only allow your domains
4. **Monitor usage** - Set up alerts for unusual activity
5. **Rotate keys regularly** - Update keys every 90 days
6. **Use separate keys** - Different keys for dev/staging/production

## Related Documentation

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [CSP Configuration](./CORS_CONFIGURATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Vercel Deployment Control](./VERCEL_DEPLOYMENT_CONTROL.md)

## Support

If you encounter issues not covered in this guide:

1. Check the [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
2. Review the [Google Maps JavaScript API Reference](https://developers.google.com/maps/documentation/javascript/reference)
3. Contact the development team or open an issue on GitHub
