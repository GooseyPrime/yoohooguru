# Dynamic CORS Origin Sync for Production

This document describes the implementation of dynamic CORS origin synchronization for the yoohoo.guru platform, ensuring that the backend always reflects current frontend domains, even as new subdomains or preview deployments are added.

## Overview

The CORS origin sync system automatically fetches and updates allowed origins based on deployment metadata from Vercel and Railway, ensuring that:

- ✅ `https://api.yoohoo.guru` is explicitly listed (wildcards don't reliably match subdomains)
- ✅ All verified Vercel domains are included
- ✅ Static domains are always preserved
- ✅ The configuration is updated dynamically during deployment

## Implementation Components

### 1. Environment Configuration (`.env.production`)

The production environment file contains explicit CORS origins:

```env
CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app
```

### 2. Dynamic Update Script (`scripts/update-cors-origins.production.js`)

A Node.js script that:
- Fetches verified Vercel domains via API (optional)
- Includes static Railway backend domain
- Updates `.env.production` with combined origins
- Handles API errors gracefully

Usage:
```bash
node scripts/update-cors-origins.production.js
```

### 3. Backend Configuration Updates

The backend configuration (`backend/src/config/appConfig.js`) now includes `https://api.yoohoo.guru` in the default production origins to ensure explicit subdomain matching.

## CI/CD Integration

### Railway Deployment

Add these environment variables in your Railway project settings:

```bash
# Core CORS configuration
CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app

# Optional: Vercel API token for dynamic domain fetching
VERCEL_API_TOKEN=your_vercel_api_token_here
```

### Vercel Deployment

Add these environment variables in your Vercel project settings:

- `CORS_ORIGIN_PRODUCTION`: Same as above
- `VERCEL_API_TOKEN`: Your Vercel API token for domain fetching

### Automated Sync in CI/CD

To run the CORS sync script during deployment, add it to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Update CORS Origins
  run: |
    cd backend
    npm install
    node ../scripts/update-cors-origins.production.js
  env:
    VERCEL_API_TOKEN: ${{ secrets.VERCEL_API_TOKEN }}
```

## Testing and Validation

### 1. Unit Tests

The implementation includes comprehensive tests:

```bash
# Run CORS-specific tests
npm test -- --testPathPattern=cors-origin-sync.test.js
npm test -- --testPathPattern=cors-config.test.js
```

### 2. Production Validation

Test requests from all configured domains:

```bash
# Test main domain
curl -H "Origin: https://yoohoo.guru" https://api.yoohoo.guru/health

# Test www subdomain
curl -H "Origin: https://www.yoohoo.guru" https://api.yoohoo.guru/health

# Test API subdomain
curl -H "Origin: https://api.yoohoo.guru" https://api.yoohoo.guru/health

# Test Vercel preview
curl -H "Origin: https://your-branch-name.vercel.app" https://api.yoohoo.guru/health
```

Look for `Access-Control-Allow-Origin` headers in responses.

### 3. Architecture Verification

Use the existing architecture verification script:

```bash
./scripts/verify-architecture.sh
```

## Script Configuration

### Static Origins

These origins are always included:

- `https://yoohoo.guru` - Main production domain
- `https://www.yoohoo.guru` - WWW subdomain
- `https://api.yoohoo.guru` - API subdomain (explicitly listed)
- `https://*.yoohoo.guru` - Wildcard for other subdomains
- `https://*.vercel.app` - Vercel preview deployments

### Dynamic Origins

When `VERCEL_API_TOKEN` is provided:

- Fetches all verified domains from Vercel API
- Filters only verified domains
- Adds `https://` prefix to domain names
- Handles API errors gracefully

## Troubleshooting

### Common Issues

1. **CORS errors in browser**
   - Verify `CORS_ORIGIN_PRODUCTION` includes your domain
   - Check that URLs match exactly (including https/http)
   - Run the update script to refresh origins

2. **Script fails with API errors**
   - Script continues with static origins
   - Check `VERCEL_API_TOKEN` is valid
   - Verify network connectivity to Vercel API

3. **Origins not updating**
   - Check `.env.production` file permissions
   - Verify script has write access to file
   - Check for syntax errors in environment file

### Debug Commands

```bash
# Test script without API token
node scripts/update-cors-origins.production.js

# Test with mock API token
VERCEL_API_TOKEN="test" node scripts/update-cors-origins.production.js

# Check current CORS configuration
grep CORS_ORIGIN_PRODUCTION .env.production

# Test CORS with curl
curl -I -H "Origin: https://yoohoo.guru" https://api.yoohoo.guru/health
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive tokens to version control
2. **Origin Validation**: Only verified Vercel domains are included
3. **Fallback Behavior**: Script gracefully handles API failures
4. **Static Origins**: Core domains are always preserved regardless of API status

## Maintenance

- Review and update static origins when adding new domains
- Rotate `VERCEL_API_TOKEN` periodically
- Monitor script execution in CI/CD logs
- Update script when Vercel API changes

## Future Enhancements

Possible improvements for future versions:

- Railway API integration for dynamic backend domain fetching
- Support for multiple Vercel teams/projects
- Automated origin cleanup for removed domains
- Integration with domain monitoring services