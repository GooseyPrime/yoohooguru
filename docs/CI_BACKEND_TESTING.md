# CI Backend Testing Workflow

This document describes the backend testing configuration in the CI/CD pipeline (``.github/workflows/ci.yml`) and ensures consistency with the backend test scripts defined in `backend/package.json`.

## Overview

The CI workflow runs backend tests using Firebase emulators to provide isolated, consistent test environments without requiring access to production Firebase resources.

## Workflow Configuration

### Backend Test Step

Location: `.github/workflows/ci.yml` (lines 44-65)

```yaml
- name: Run backend tests
  run: |
    cd backend
    npm install -g firebase-tools
    npm test
  env:
    NODE_ENV: test
    FIREBASE_PROJECT_ID: yoohoo-dev-testing
    FIRESTORE_EMULATOR_HOST: localhost:8080
    FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
    JWT_SECRET: test-jwt-secret-key-for-ci-cd-testing-only-not-for-production
    STRIPE_SECRET_KEY: sk_test_...
    STRIPE_PUBLISHABLE_KEY: pk_test_...
    STRIPE_WEBHOOK_SECRET: whsec_...
    # ... additional Stripe test keys
```

### Key Points

1. **Correct Command**: The workflow uses `npm test`, which is the standard npm command defined in `backend/package.json`
2. **NO Nonexistent Commands**: The workflow does NOT use nonexistent commands like `backend-check` or `job`
3. **Firebase Emulators**: Tests run against local Firebase emulators (Firestore and Auth) for isolation
4. **Environment Variables**: All required environment variables are explicitly set in the workflow

## Backend Package.json Scripts

The backend `package.json` defines the following test-related scripts:

```json
{
  "scripts": {
    "pretest": "node ../scripts/generate-cors-origins.js",
    "test": "firebase emulators:exec --project=yoohoo-dev-testing --only firestore,auth 'npm run jest'",
    "jest": "NODE_ENV=test jest --forceExit --runInBand --detectOpenHandles --verbose",
    "jest-test": "NODE_ENV=test ./node_modules/.bin/jest --forceExit --runInBand --detectOpenHandles --verbose",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage"
  }
}
```

### Test Script Execution Flow

1. **`npm test`** (called by CI workflow)
   - First runs `pretest`: Generates CORS origins configuration
   - Then runs `test`: Starts Firebase emulators and executes Jest tests
   
2. **`firebase emulators:exec`**
   - Starts Firestore and Auth emulators on specified ports
   - Executes the command in quotes: `npm run jest`
   - Automatically shuts down emulators after tests complete
   
3. **`npm run jest`**
   - Runs Jest with flags for CI compatibility:
     - `--forceExit`: Ensures process exits after tests
     - `--runInBand`: Runs tests serially (required for emulators)
     - `--detectOpenHandles`: Helps identify async issues
     - `--verbose`: Provides detailed test output
   - Explicitly sets `NODE_ENV=test` for safety

## Command Validation

### ✅ Correct Commands

The following commands are **valid** and **defined** in `backend/package.json`:

- `npm test` - Primary test command
- `npm run jest` - Direct Jest execution (called by `test` script)
- `npm run test:watch` - Watch mode for local development
- `npm run test:coverage` - Generate coverage reports

### ❌ Invalid Commands

The following commands **do NOT exist** and should **NEVER** be used:

- `backend-check` - Not defined anywhere
- `job` - Not defined as a shell command or npm script
- Any shell script execution without proper definition

### Workflow Best Practices

1. **Always use `npm test`** in CI workflows - This is the canonical command
2. **Set environment variables explicitly** - Don't rely on defaults in CI
3. **Install firebase-tools globally** - Required for emulator execution
4. **Use `NODE_ENV=test`** - Required by Firebase validation logic

## Firebase Emulator Requirements

The backend tests require Firebase emulators to be running. The workflow ensures this by:

1. Installing `firebase-tools` globally before running tests
2. Setting `FIRESTORE_EMULATOR_HOST` and `FIREBASE_AUTH_EMULATOR_HOST`
3. Using `NODE_ENV=test` to enable emulator mode
4. Using a dedicated test project ID (`yoohoo-dev-testing`)

For more details on Firebase emulator testing, see [TESTING_WITH_FIREBASE_EMULATORS.md](./TESTING_WITH_FIREBASE_EMULATORS.md).

## Environment Variables

The CI workflow sets the following environment variables for backend tests:

### Required for Firebase
- `NODE_ENV=test` - Enables emulator mode and test configuration
- `FIREBASE_PROJECT_ID=yoohoo-dev-testing` - Test-specific Firebase project
- `FIRESTORE_EMULATOR_HOST=localhost:8080` - Firestore emulator endpoint
- `FIREBASE_AUTH_EMULATOR_HOST=localhost:9099` - Auth emulator endpoint

### Required for Application
- `JWT_SECRET` - Test JWT secret (not production secret)
- `STRIPE_SECRET_KEY` - Test Stripe secret key (starts with `sk_test_`)
- `STRIPE_PUBLISHABLE_KEY` - Test Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Test webhook secret
- `STRIPE_WEBHOOK_ID` - Test webhook ID
- `STRIPE_GURU_PASS_PRICE_ID` - Test price ID for Guru Pass
- `STRIPE_SKILL_VERIFICATION_PRICE_ID` - Test price ID for skill verification
- `STRIPE_TRUST_SAFETY_PRICE_ID` - Test price ID for trust & safety

## Troubleshooting

### Exit Code 127: Command Not Found

If you see exit code 127, it means a command doesn't exist. Ensure:
- You're using `npm test`, not nonexistent commands like `backend-check`
- The command is defined in `backend/package.json` scripts
- Firebase tools are installed before running tests

### Tests Fail in CI But Pass Locally

Verify that:
- All environment variables are set in the CI workflow
- Firebase emulators are properly configured
- `NODE_ENV=test` is set explicitly
- Dependencies are installed before running tests

### Firebase Emulator Issues

If emulator-related errors occur:
- Ensure `firebase-tools` is installed globally: `npm install -g firebase-tools`
- Verify emulator ports are not in use (8080 for Firestore, 9099 for Auth)
- Check that `firebase.json` exists in the backend directory
- Confirm `NODE_ENV=test` is set (required by validation logic)

## Related Documentation

- [TESTING_WITH_FIREBASE_EMULATORS.md](./TESTING_WITH_FIREBASE_EMULATORS.md) - Detailed Firebase emulator setup and usage
- [CI_CD_ENVIRONMENT.md](./CI_CD_ENVIRONMENT.md) - General CI/CD environment configuration
- Backend README: [../backend/README.md](../backend/README.md) - Backend development guide

## Workflow Maintenance

When modifying the CI workflow backend test step:

1. **Use only defined commands** from `backend/package.json`
2. **Maintain environment variables** - All test environment variables must be set
3. **Keep emulator configuration** - Do not remove emulator host variables
4. **Test changes locally** - Run `npm test` in backend directory before pushing
5. **Update documentation** - Keep this file synchronized with workflow changes

## Validation Commands

To verify the workflow will succeed, run these commands locally:

```bash
# Install dependencies
cd backend
npm install

# Install Firebase tools (if not already installed)
npm install -g firebase-tools

# Run tests with same environment as CI
NODE_ENV=test \
FIREBASE_PROJECT_ID=yoohoo-dev-testing \
FIRESTORE_EMULATOR_HOST=localhost:8080 \
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 \
JWT_SECRET=test-jwt-secret \
npm test
```

Expected result: All tests should pass, and the process should exit with code 0.

---

**Last Updated**: December 2024
**CI Workflow File**: `.github/workflows/ci.yml`
**Backend Package**: `backend/package.json`
