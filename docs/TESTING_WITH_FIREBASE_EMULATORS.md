# Testing with Firebase Emulators

## Overview

This document explains the requirements and best practices for running tests with Firebase emulators in the yoohoo.guru platform.

## Critical Requirements

### NODE_ENV Must Be Set to 'test'

**IMPORTANT**: When using Firebase emulators, `NODE_ENV` MUST always be set to `test` (or `development` for local development). This is enforced in `backend/src/config/firebase.js` to prevent accidental writes to production data.

### Why This Matters

The Firebase configuration validation (`validateTestEnvironmentSetup()`) explicitly checks:
- If `FIRESTORE_EMULATOR_HOST` or `FIREBASE_AUTH_EMULATOR_HOST` are set
- AND `NODE_ENV` is NOT `test` or `development`
- Then the application will throw an error and refuse to start

This safety check prevents:
1. Accidentally running tests against production Firebase
2. Mixing emulator and production configurations
3. CI/CD failures due to environment drift

## Running Tests

### Local Development

```bash
# Backend tests with emulators
cd backend
NODE_ENV=test npm test

# Or use the npm script which sets NODE_ENV automatically
npm test
```

### CI/CD Environment

The `.github/workflows/ci.yml` sets `NODE_ENV=test` in the environment:

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
```

### NPM Scripts Configuration

The `backend/package.json` ensures NODE_ENV is always set:

```json
{
  "scripts": {
    "test": "firebase emulators:exec --project=yoohoo-dev-testing --only firestore,auth 'npm run jest'",
    "jest": "NODE_ENV=test jest --forceExit --runInBand --detectOpenHandles --verbose",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage"
  }
}
```

**Key Points:**
- All test-related scripts explicitly set `NODE_ENV=test`
- This ensures child processes spawned by `firebase emulators:exec` inherit the correct environment
- The `jest` script sets NODE_ENV even though it's called by the `test` script, as a defense-in-depth measure

## Common Issues and Solutions

### Issue: "Environment configuration error: Emulator hosts configured with NODE_ENV=production"

**Cause**: NODE_ENV is not set to `test` or `development` when emulator variables are present.

**Solution**:
1. Ensure `NODE_ENV=test` is set before running tests
2. Check that npm scripts include `NODE_ENV=test` prefix
3. For child processes, pass environment explicitly:
   ```javascript
   const child = spawn('node', ['script.js'], {
     env: { ...process.env, NODE_ENV: 'test' }
   });
   ```

### Issue: Tests fail in CI but work locally

**Cause**: Environment variables may not be propagating through CI steps or child processes.

**Solution**:
1. Verify `.github/workflows/ci.yml` sets `NODE_ENV: test` in the env block
2. Ensure no steps override NODE_ENV to production/staging
3. Check that `firebase emulators:exec` command properly quotes the inner command

### Issue: Child process tests don't inherit NODE_ENV

**Cause**: Node.js child processes don't automatically inherit all environment variables when using spawn/exec.

**Solution**: Explicitly pass environment to child processes:
```javascript
const child = spawn('node', ['-e', 'console.log(process.env.NODE_ENV)'], {
  env: { ...process.env, NODE_ENV: 'test' }
});
```

## Production Safety

### What's NOT Allowed

❌ Setting emulator variables in production/staging environments:
```bash
# NEVER DO THIS in production
export FIRESTORE_EMULATOR_HOST=localhost:8080
export NODE_ENV=production  # ← This combination will fail
```

❌ Running tests without NODE_ENV=test when emulators are configured:
```bash
# This will fail
FIRESTORE_EMULATOR_HOST=localhost:8080 npm test  # NODE_ENV not set
```

### What IS Allowed

✅ Local development with emulators:
```bash
export NODE_ENV=development
export FIRESTORE_EMULATOR_HOST=localhost:8080
npm run dev
```

✅ CI/CD testing with emulators:
```bash
export NODE_ENV=test
export FIRESTORE_EMULATOR_HOST=localhost:8080
npm test
```

✅ Production without emulators:
```bash
export NODE_ENV=production
# No emulator variables set
npm start
```

## Configuration Files

### backend/jest.setup.js

Sets up the test environment before tests run:
- Sets `NODE_ENV=test` as first step
- Configures emulator hosts if not already set
- Initializes Firebase with emulator configuration

### backend/src/config/firebase.js

Contains the validation logic:
- `validateTestEnvironmentSetup()`: Ensures emulators only used with NODE_ENV=test/development
- `validateProductionFirebaseConfig()`: Ensures production doesn't use emulators
- `initializeFirebase()`: Initializes Firebase based on NODE_ENV

## Best Practices

1. **Always Set NODE_ENV**: Never rely on implicit/default NODE_ENV when using emulators
2. **Explicit in Scripts**: Include `NODE_ENV=test` in all test-related npm scripts
3. **Child Processes**: Always pass environment explicitly when spawning processes
4. **CI Configuration**: Set NODE_ENV in workflow env blocks, not inline commands
5. **Documentation**: Update this file when adding new test scripts or changing emulator setup

## Troubleshooting

Enable verbose logging to debug environment issues:

```bash
# Check current NODE_ENV
echo $NODE_ENV

# Run with debug output
NODE_ENV=test DEBUG=firebase:* npm test

# Verify emulator configuration
firebase emulators:start --only firestore,auth --inspect-functions
```

## References

- Firebase Emulator Documentation: https://firebase.google.com/docs/emulator-suite
- Issue #214: CI Failures - Permanent Repair Cycle for Recurring Emulator/Environment Test Failures
- backend/src/config/firebase.js: Validation logic
- .github/workflows/ci.yml: CI configuration
- backend/package.json: NPM scripts configuration
