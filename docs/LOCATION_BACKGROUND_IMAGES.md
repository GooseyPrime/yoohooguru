# Location Background Images Feature

## Overview

The yoohoo.guru platform now dynamically fetches high-resolution, location-appropriate background images for the homepage hero section. This replaces the previous hardcoded approach that only supported 10 major US cities.

## How It Works

### Frontend (HomePage)
When a user provides or selects their location, the frontend:
1. Extracts the city, state, and country from the location data
2. Calls the backend API endpoint `/api/images/location` with these parameters
3. Receives a high-resolution image URL or null for graceful fallback
4. Updates the hero section background with the image

### Backend API
The `/api/images/location` endpoint:
1. Accepts `city` (required), `state` (optional), and `country` (optional) query parameters
2. Searches Unsplash API for relevant cityscape/landmark images
3. Implements intelligent image selection:
   - Prioritizes images with matching location metadata
   - Searches with cityscape/landmark keywords
   - Falls back to broader state/country searches if no specific city images found
   - Sorts by popularity (likes) when multiple matches exist
4. Complies with Unsplash API guidelines (download tracking)
5. Returns gracefully with null if no image found or API key not configured

## Setup Instructions

### 1. Get an Unsplash API Key

1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Sign in or create an account
3. Create a new application
4. Copy the "Access Key" from your application settings

### 2. Configure Environment Variables

#### Development (.env file)
```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

#### Production (Railway Console)
Add the following environment variable in your Railway project:
```
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 3. Verify Configuration

Start your backend server and check the health endpoint:
```bash
curl http://localhost:3001/api/images
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Images API endpoint active",
    "unsplashConfigured": true
  }
}
```

## API Documentation

### GET /api/images/location

Fetch a high-resolution background image for a specific location.

**Query Parameters:**
- `city` (required): City name (e.g., "New York", "London", "Tokyo")
- `state` (optional): State/province name (e.g., "NY", "California")
- `country` (optional): Country name (e.g., "USA", "UK", "Japan")

**Example Request:**
```bash
curl "http://localhost:3001/api/images/location?city=New%20York&state=NY&country=USA"
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://images.unsplash.com/photo-xxx?w=1080",
    "urlFull": "https://images.unsplash.com/photo-xxx",
    "urlThumb": "https://images.unsplash.com/photo-xxx?w=200",
    "description": "New York City skyline at sunset",
    "photographer": {
      "name": "John Doe",
      "username": "johndoe",
      "link": "https://unsplash.com/@johndoe"
    },
    "location": {
      "name": "New York, NY"
    }
  }
}
```

**No Image Found Response:**
```json
{
  "success": true,
  "data": null,
  "message": "No images found for this location"
}
```

**API Not Configured Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Image service not configured"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "City parameter is required"
}
```

## Graceful Fallbacks

The feature is designed to work gracefully even if:
- No Unsplash API key is configured (returns null, frontend uses default gradient)
- Unsplash API is down or rate-limited (returns null, frontend uses default gradient)
- No images found for a specific location (tries broader search, then returns null)
- Network errors occur (catches errors, returns null)

This ensures the homepage always displays correctly, even without the background images.

## Frontend Integration

The `HomePage` component automatically handles the API response:

```javascript
const fetchCityImage = useCallback(async (cityName, stateName, countryName) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    const params = new URLSearchParams({ city: cityName });
    
    if (stateName) params.append('state', stateName);
    if (countryName) params.append('country', countryName);

    const response = await fetch(`${apiUrl}/images/location?${params.toString()}`);
    const data = await response.json();
    
    if (data.success && data.data && data.data.url) {
      setBackgroundImage(data.data.url);
    }
  } catch (error) {
    // Graceful fallback - no background image
    console.log('Could not fetch city image:', error);
  }
}, []);
```

## Unsplash API Compliance

This implementation complies with Unsplash API guidelines:
- Uses the `/search/photos` endpoint for searching
- Triggers the download tracking endpoint when an image is displayed
- Includes proper attribution data in the response (photographer info)
- Uses appropriate headers (Client-ID, Accept-Version)
- Respects content filters and orientation preferences

## Performance Considerations

- Images are requested only when location changes
- High-resolution images are used (1080px width) suitable for backgrounds
- Thumbnail URLs are also provided for faster initial loads if needed
- Failed requests don't block the page (async with error handling)
- No caching is implemented on the backend (relies on Unsplash CDN)

## Rate Limits

Unsplash free tier provides:
- 50 requests per hour for development/demo apps
- Contact Unsplash for production rate limits

If rate limits are exceeded, the endpoint gracefully returns null and the frontend falls back to the default gradient background.

## Testing

Run the test suite:
```bash
cd backend
npm test tests/images.test.js
```

Manual testing:
```bash
# Start backend server
cd backend
npm start

# Test endpoint
curl "http://localhost:3001/api/images/location?city=New%20York&state=NY"
```

## Benefits Over Previous Implementation

| Feature | Previous (Hardcoded) | New (Dynamic API) |
|---------|---------------------|-------------------|
| Cities supported | 10 (US only) | Unlimited worldwide |
| Image quality | Fixed URLs | High-resolution, fresh images |
| Maintenance | Manual updates needed | Automatic via API |
| Fallback | No images for unlisted cities | Intelligent broader search |
| International | No support | Full international support |
| Configuration | Hardcoded in source | Environment variable |

## Future Enhancements

Potential improvements for future iterations:
- Add backend caching to reduce API calls
- Implement image preloading for faster page loads
- Add user preference to disable background images
- Support for custom location images uploaded by users
- Integration with other image services (Pexels, Pixabay) as fallbacks
