# Location Background Images - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (HomePage.js)                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 1. User provides location via GPS or manual entry                 │  │
│  │ 2. SimpleLocationSelector extracts: city, state, country          │  │
│  │ 3. handleLocationChange callback triggered                        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP GET Request
                                    │ /api/images/location?city=X&state=Y&country=Z
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (images.js route)                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 1. Validate required parameters (city)                            │  │
│  │ 2. Check if UNSPLASH_ACCESS_KEY is configured                     │  │
│  │    ├─ Not configured → Return null (graceful fallback)            │  │
│  │    └─ Configured → Continue                                       │  │
│  │ 3. Build search query: "city state cityscape landmark skyline"   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS Request
                                    │ to Unsplash API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         UNSPLASH API                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Search endpoint: /search/photos                                   │  │
│  │ Parameters:                                                        │  │
│  │   - query: "city state cityscape landmark skyline"                │  │
│  │   - orientation: landscape                                        │  │
│  │   - per_page: 5                                                   │  │
│  │   - order_by: relevant                                            │  │
│  │   - content_filter: high                                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Response
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND IMAGE SELECTION LOGIC                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ IF results found:                                                 │  │
│  │   1. Prioritize images with matching location metadata           │  │
│  │   2. Sort by popularity (likes)                                   │  │
│  │   3. Select best match                                            │  │
│  │   4. Trigger download tracking (Unsplash requirement)             │  │
│  │   5. Return image data                                            │  │
│  │                                                                    │  │
│  │ ELSE (no results):                                                │  │
│  │   1. Try broader search: "state cityscape landmark"               │  │
│  │      ├─ Found → Return image                                      │  │
│  │      └─ Not found → Try "country cityscape"                       │  │
│  │           ├─ Found → Return image                                 │  │
│  │           └─ Not found → Return null                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JSON Response
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (HomePage.js)                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ IF response.data exists:                                          │  │
│  │   1. Set backgroundImage state with image URL                     │  │
│  │   2. HeroSection displays with background image                   │  │
│  │   3. Log success message                                          │  │
│  │                                                                    │  │
│  │ ELSE (null or error):                                             │  │
│  │   1. backgroundImage stays empty string                           │  │
│  │   2. HeroSection displays with default gradient                   │  │
│  │   3. Log fallback message                                         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER SEES RESULT                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Beautiful location-appropriate background image                   │  │
│  │              OR                                                    │  │
│  │ Elegant gradient background (graceful fallback)                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                          ERROR HANDLING FLOW
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                         POTENTIAL ERROR POINTS                           │
│                                                                           │
│  1. Missing city parameter                                               │
│     → Return 400 error with message                                      │
│                                                                           │
│  2. UNSPLASH_ACCESS_KEY not configured                                   │
│     → Return { success: true, data: null, message: "..." }               │
│                                                                           │
│  3. Unsplash API down or rate limited                                    │
│     → Catch error, return { success: true, data: null }                  │
│                                                                           │
│  4. Network timeout                                                      │
│     → Catch error, return { success: true, data: null }                  │
│                                                                           │
│  5. Invalid response from Unsplash                                       │
│     → Try broader search, then return null if still failing              │
│                                                                           │
│  Note: All errors result in graceful degradation, never breaking UI      │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                          SEARCH STRATEGY TREE
═══════════════════════════════════════════════════════════════════════════

                    Search: "New York NY cityscape landmark skyline"
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                 Results?                        No Results
                    │                               │
                    ▼                               ▼
              Select Best Image        Search: "NY cityscape landmark"
           (Location + Popularity)                  │
                    │                   ┌───────────┴───────────┐
                    │                   │                       │
                    │                Results?              No Results
                    │                   │                       │
                    │                   ▼                       ▼
                    │            Select Best Image    Search: "USA cityscape"
                    │                   │                       │
                    │                   │               ┌───────┴───────┐
                    │                   │               │               │
                    │                   │            Results?       No Results
                    │                   │               │               │
                    │                   │               ▼               ▼
                    │                   │        Select Best Image  Return null
                    │                   │               │               │
                    └───────────────────┴───────────────┴───────────────┘
                                        │
                                        ▼
                              Return Image to Frontend
                                        │
                                        ▼
                          Display as Hero Background Image


═══════════════════════════════════════════════════════════════════════════
                          DATA FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════════

User Location: "Austin, TX, USA"
    │
    ▼
Frontend Request: GET /api/images/location?city=Austin&state=TX&country=USA
    │
    ▼
Backend Query: "Austin TX cityscape landmark skyline"
    │
    ▼
Unsplash API: Returns 5 images of Austin
    │
    ▼
Selection Logic: 
    - Image 1: Austin skyline, 500 likes, has location "Austin, TX" ✓ SELECTED
    - Image 2: Texas capitol, 300 likes, has location "Austin"
    - Image 3: Generic cityscape, 600 likes, no location data
    - Image 4: Austin downtown, 400 likes, has location "Austin"
    - Image 5: Night skyline, 450 likes, has location "Austin, TX"
    │
    ▼
Download Tracking: Trigger Unsplash download endpoint
    │
    ▼
Backend Response: {
  "success": true,
  "data": {
    "url": "https://images.unsplash.com/photo-xxx?w=1080",
    "description": "Austin skyline at sunset",
    "photographer": { "name": "John Doe", ... }
  }
}
    │
    ▼
Frontend: setBackgroundImage("https://images.unsplash.com/photo-xxx?w=1080")
    │
    ▼
User Sees: Beautiful Austin skyline as homepage background
