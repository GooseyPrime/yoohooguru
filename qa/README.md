# QA Testing for yoohoo.guru

This directory contains end-to-end tests for the yoohoo.guru platform using Playwright.

## Setup

Install dependencies:
```bash
npm install
npx playwright install
```

Or from the root directory:
```bash
npm run qa:install
cd qa && npx playwright install
```

## Running Tests

### Prerequisites
Make sure both frontend and backend servers are running:
```bash
# In one terminal - backend
cd backend && npm run dev

# In another terminal - frontend  
cd frontend && npm run dev
```

### Run all tests
```bash
npm test
```

From root directory:
```bash
npm run qa:test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

## Test Structure

- `tests/console.spec.js` - Tests for console errors on critical routes (/, /angels-list, /coach, /blog)
- `tests/blog.spec.js` - Tests for blog functionality and AI draft endpoints
- `tests/stripe.spec.js` - Tests for Stripe payment API endpoints
- `tests/subdomains.spec.js` - Tests for subdomain routing (angel.yoohoo.guru, coach.yoohoo.guru)

## Configuration

Test configuration is in `playwright.config.js`. Key settings:
- **Base URL**: `http://localhost:3000` (can be overridden with `BASE_URL` env var)
- **Timeout**: 30 seconds per test
- **Retries**: 1 retry on failure
- **Projects**: Desktop Chrome, Mobile Safari, Mobile Android

## CI/CD Integration

Tests can be run in CI/CD pipelines by setting the appropriate environment variables:
```bash
BASE_URL=http://localhost:3000 npm test
```

For production subdomain testing:
```bash
ANGEL_URL=https://angel.yoohoo.guru COACH_URL=https://coach.yoohoo.guru npm test
```

## Known Issues

- Subdomain tests require production URLs to be accessible
- Some CSP violations may occur in development mode (expected)
- Feature flag endpoints may return HTML in development mode

## References

- [Playwright Documentation](https://playwright.dev/)
- [Auto-Copilot Operating Loop](../copilot/AutoCopilot.prompt.md)
- [Site Specification](../spec/site-spec.md)
