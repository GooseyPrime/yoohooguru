# Blog Curation on Deployment

This directory contains scripts for triggering AI blog curation automatically on deployment.

## Overview

The blog curation system automatically generates fresh blog content for all 24 subdomains whenever the backend is deployed. This ensures that users always have recent, relevant content when visiting subdomain blog pages.

## How It Works

### Automatic Triggers

The blog curation is triggered automatically in the following scenarios:

1. **After Build** (`postbuild` hook)
   - Runs after `npm run build`
   - Generates blog content before the app starts

2. **After Deployment** (`postdeploy` hook)
   - Runs after `npm run deploy`
   - Ensures fresh content after deploying to production

### Manual Triggers

You can also trigger blog curation manually:

```bash
# From the backend directory
npm run curate:blogs

# Or run the script directly
node scripts/trigger-blog-curation.js
```

## Script Details

### `trigger-blog-curation.js`

This script:
- Initializes Firebase connection
- Validates all dependencies
- Triggers the BlogCurationAgent to generate content for all subdomains
- Generates 1 blog post per subdomain (24 total)
- Stores posts in Firestore `posts` collection

### Content Generated

For each subdomain, the agent generates:
- 1 blog post (1200-2000 words)
- Homepage intro/summary
- H2/H3 subheadings for structure
- 2-4 contextual affiliate links
- Minimum 2 internal links
- SEO-optimized metadata

## Integration Points

### Package.json Scripts

```json
{
  "scripts": {
    "postbuild": "npm run curate:blogs",
    "curate:blogs": "node scripts/trigger-blog-curation.js",
    "postdeploy": "npm run curate:blogs"
  }
}
```

### Deployment Platforms

- **Railway**: Automatically runs `postbuild` and `postdeploy` hooks
- **Vercel**: Can be configured to run build hooks
- **Heroku**: Supports `postdeploy` in Procfile

## Error Handling

The script is designed to be deployment-safe:
- Does **NOT** fail the deployment if blog curation fails
- Logs errors but continues with exit code 0
- Errors are logged to Winston logger for debugging

## Disabling Auto-Curation

To temporarily disable automatic blog curation on deployment:

1. Comment out the postbuild/postdeploy hooks in `package.json`:
   ```json
   {
     "scripts": {
       // "postbuild": "npm run curate:blogs",
       // "postdeploy": "npm run curate:blogs"
     }
   }
   ```

2. You can still trigger manually with `npm run curate:blogs`

## Monitoring

Check the logs after deployment to verify blog curation:

```bash
# Railway logs
railway logs

# Or check Firestore directly
# Collection: posts
# Filter: publishedAt > (deployment time)
```

## Environment Variables Required

Ensure these environment variables are set for blog curation to work:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `OPENROUTER_API_KEY` or `OPENAI_API_KEY` (for AI content generation)

## Troubleshooting

### Blog curation not running on deployment

1. Check that the deployment platform runs npm scripts
2. Verify environment variables are set
3. Check deployment logs for error messages

### Content not appearing on frontend

1. Verify Firestore connection
2. Check that posts have `published: true`
3. Verify subdomain names match between config and database
4. Check frontend API calls are pointing to correct endpoints

### Rate Limits or API Errors

1. Check AI API key and quota
2. Implement exponential backoff if needed
3. Consider reducing number of posts generated per run

## Future Enhancements

- Add scheduling for regular re-generation (weekly, monthly)
- Implement content versioning
- Add A/B testing for blog content
- Generate multiple variations per subdomain
