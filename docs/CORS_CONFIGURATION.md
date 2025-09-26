# CORS Configuration Documentation

## Overview

This document describes the CORS (Cross-Origin Resource Sharing) configuration implementation for the yoohoo.guru platform, including automated maintenance and validation procedures.

## Configuration Files

### .env.test
Contains the production CORS origins configuration:
```env
CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app
```

### backend/src/config/appConfig.js
- Defines default CORS origins for both production and development environments
- Implements runtime CORS origin validation with wildcard support
- Production defaults: `['https://yoohoo.guru', 'https://www.yoohoo.guru', 'https://api.yoohoo.guru', 'https://*.yoohoo.guru', 'https://*.vercel.app']`
- Development defaults: `['http://localhost:3000', 'http://127.0.0.1:3000', 'http://*.localhost:3000']`

## Runtime CORS Validation

The `getCorsOrigins(config)` function returns a callback-based validator that:

1. **Allows requests with no origin** (mobile apps, Postman, server-to-server)
2. **Checks exact matches first** for performance
3. **Supports wildcard patterns** like `*.yoohoo.guru` and `*.vercel.app`
4. **Rejects unauthorized origins** with descriptive error messages

```javascript
const corsOptions = {
  origin: getCorsOrigins(config),
  credentials: true
};
```

## Explicit API Domain Inclusion

The configuration explicitly includes `https://api.yoohoo.guru` because:
- Wildcard CORS matching (`*.yoohoo.guru`) does not reliably cover all subdomains in middleware implementations
- Explicit inclusion ensures reliable CORS validation for API endpoints
- Maintains backward compatibility and security

## Automated CORS Origin Sync

### scripts/generate-cors-origins.js

An automated script that:
- Updates `.env.test` with the latest approved domains
- Validates all configured origins
- Provides detailed logging and error handling
- Can be run manually or automatically via CI/CD

**Usage:**
```bash
node scripts/generate-cors-origins.js
```

**Static Origins Maintained:**
- `https://yoohoo.guru` - Main domain
- `https://www.yoohoo.guru` - WWW subdomain
- `https://api.yoohoo.guru` - API subdomain (explicit)
- `https://*.yoohoo.guru` - All yoohoo.guru subdomains
- `https://*.vercel.app` - Vercel deployment domains

### Pre-test Hook Integration

The script runs automatically before tests via the `pretest` npm script:
```json
{
  "scripts": {
    "pretest": "node ../scripts/generate-cors-origins.js"
  }
}
```

## Test Coverage

### tests/cors-config.test.js
- Tests default production and development origins
- Validates custom origin configuration
- Tests exact origin matching
- Tests wildcard pattern matching for Vercel apps
- Validates explicit `api.yoohoo.guru` support
- Tests error handling for unauthorized origins
- Validates all required origins from specifications

### tests/cors-subdomain.test.js
- Tests wildcard subdomain matching
- Validates pattern matching logic
- Tests both production and development configurations

## Security Features

1. **Explicit Domain Validation** - No open CORS policy
2. **Wildcard Support** - Secure pattern matching for approved domains
3. **Development/Production Separation** - Different origins per environment
4. **Comprehensive Logging** - All CORS decisions are logged
5. **Error Reporting** - Clear error messages for debugging

## Maintenance

1. **Automated Sync** - Use `generate-cors-origins.js` for updates
2. **Test Coverage** - All changes validated by comprehensive test suite
3. **CI/CD Integration** - Pre-test hook ensures consistency
4. **Documentation** - This file should be updated when origins change

## Troubleshooting

### Common Issues

1. **CORS Error in Production**
   - Verify origin is in `CORS_ORIGIN_PRODUCTION`
   - Check for typos in domain names
   - Ensure protocol (http/https) matches

2. **Wildcard Not Working**
   - Check pattern syntax in configuration
   - Test with explicit domain first
   - Review logs for pattern matching details

3. **Local Development Issues**
   - Verify `CORS_ORIGIN_DEVELOPMENT` includes your local URL
   - Check port numbers match
   - Ensure protocol is correct (http for local)

### Debug Commands

```bash
# Test CORS origins generation
node scripts/generate-cors-origins.js

# Run CORS-specific tests
npm test -- --testNamePattern="CORS"

# Check current configuration
grep CORS_ORIGIN .env.test
```

## Implementation Notes

- The CORS middleware is configured in `backend/src/index.js`
- Origins are validated on every request for security
- Wildcard patterns use regex matching with proper escaping
- The implementation follows Express CORS middleware standards
- All origin validation happens server-side for security