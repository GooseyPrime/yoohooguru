# CI/CD Environment Configuration Guide

This guide documents the specific environment variable requirements for CI/CD workflows and automated deployments.

## Critical Configuration Rules

### 1. Firebase Emulator Variables

**CRITICAL:** Firebase emulator variables **MUST ONLY** be set when `NODE_ENV=test` or `NODE_ENV=development`.

```yaml
# ❌ WRONG - Emulators with production NODE_ENV
env:
  NODE_ENV: production
  FIRESTORE_EMULATOR_HOST: localhost:8080  # This will cause a fatal error!

# ✅ CORRECT - Emulators only with test NODE_ENV
env:
  NODE_ENV: test
  FIRESTORE_EMULATOR_HOST: localhost:8080
  FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
```

**Prohibited combinations:**
- `NODE_ENV=production` + any emulator variable = **FATAL ERROR**
- `NODE_ENV=staging` + any emulator variable = **FATAL ERROR**

**Allowed combinations:**
- `NODE_ENV=test` + emulator variables = ✅ OK
- `NODE_ENV=development` + emulator variables = ✅ OK
- `NODE_ENV=production` + NO emulator variables = ✅ OK

### 2. SESSION_SECRET Requirements

**CRITICAL:** `SESSION_SECRET` must be cryptographically secure and NEVER use default/insecure values.

**Required characteristics:**
- Minimum 32 characters (64 recommended)
- Cryptographically random
- No insecure patterns (test, default, example, password, etc.)
- Generated dynamically in CI

**CI Implementation:**

```yaml
# Step 1: Generate secure secret
- name: Generate secure SESSION_SECRET
  id: generate-session-secret
  run: |
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "::add-mask::$SESSION_SECRET"
    echo "session-secret=$SESSION_SECRET" >> $GITHUB_OUTPUT

# Step 2: Use the generated secret
- name: Run tests
  env:
    SESSION_SECRET: ${{ steps.generate-session-secret.outputs.session-secret }}
```

**Never do this:**
```yaml
# ❌ WRONG - Hardcoded insecure secret
env:
  SESSION_SECRET: test-secret  # Too short and contains "test"
  SESSION_SECRET: your_super_secret  # Contains insecure pattern
  SESSION_SECRET: change_this  # Contains insecure pattern
```

### 3. API URL Requirements

**CRITICAL:** `NEXT_PUBLIC_API_URL` must be set for Next.js builds.

```yaml
# Required for Next.js builds
env:
  NEXT_PUBLIC_API_URL: http://localhost:3001  # For CI builds
  NODE_ENV: development  # Use development for CI builds, not production
```

## Required Environment Variables for CI/CD

### Backend Test Jobs

```yaml
env:
  NODE_ENV: test  # REQUIRED - must be 'test' for backend tests
  FIREBASE_PROJECT_ID: yoohoo-dev-testing
  FIREBASE_API_KEY: AIzaSyTest1234567890KeyForCITestingOnly
  SESSION_SECRET: ${{ steps.generate-session-secret.outputs.session-secret }}
  # Emulator variables - ONLY when NODE_ENV=test
  FIRESTORE_EMULATOR_HOST: localhost:8080
  FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
```

### Next.js Build Jobs

```yaml
env:
  CI: true
  NODE_ENV: development  # Use development, not production
  NEXT_PUBLIC_API_URL: http://localhost:3001  # REQUIRED for builds
```

### Production Deployment

```yaml
env:
  NODE_ENV: production
  FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3
  FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
  FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
  FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  SESSION_SECRET: ${{ secrets.SESSION_SECRET }}  # Must be from secrets, not generated
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
  STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET }}
  # ❌ NO emulator variables for production!
```

### Staging Deployment

```yaml
env:
  NODE_ENV: staging
  FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3  # Same as production
  # ... other variables same as production
  # ❌ NO emulator variables for staging!
```

## Prohibited in CI/CD

The following variables are **PROHIBITED** in production/staging CI workflows:

- `FIRESTORE_EMULATOR_HOST` - Only allowed with `NODE_ENV=test` or `NODE_ENV=development`
- `FIREBASE_AUTH_EMULATOR_HOST` - Only allowed with `NODE_ENV=test` or `NODE_ENV=development`
- `FIREBASE_EMULATOR_HOST` - Only allowed with `NODE_ENV=test` or `NODE_ENV=development`
- `USE_MOCKS=true` - Mocks not allowed in production/staging
- Hardcoded secrets - All secrets must use `${{ secrets.SECRET_NAME }}`

## Firebase Private Key Handling

The `FIREBASE_PRIVATE_KEY` requires special handling in CI environments:

```javascript
// Correct handling in application code:
privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
```

In GitHub secrets, store the private key with literal `\n` characters that will be replaced at runtime.

## Validation

All deployments should run the Firebase validation script:

```yaml
- name: Validate Firebase Production Configuration
  run: ./scripts/validate-firebase-production.sh
  env:
    NODE_ENV: production
    FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3
    # ... other Firebase variables
```

## Testing Configuration

Test environments use a separate project but still require **real Firebase connections**:

```yaml
env:
  NODE_ENV: test
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}  # Test project, not ceremonial-tea
  # ... other test Firebase variables
```

For detailed information about CI backend testing workflow, see [CI Backend Testing Guide](./CI_BACKEND_TESTING.md).

## Security Best Practices

1. **Never commit secret values** - Always use `${{ secrets.SECRET_NAME }}`
2. **Validate configurations** - Run validation scripts before deployment
3. **Use live services** - No mocks/emulators in CI except unit tests
4. **Proper escaping** - Handle Firebase private key escaping correctly
5. **Environment separation** - Use different Firebase projects for test vs production

## Troubleshooting

### Common Issues

1. **Firebase private key errors**: Ensure proper `\n` escaping
2. **Validation failures**: Check all required environment variables are set
3. **Emulator detected**: Remove any `FIREBASE_EMULATOR_HOST` variables from CI
4. **Project ID validation**: Ensure using `ceremonial-tea-470904-f3` for production

### Debug Commands

```bash
# Validate Firebase configuration
npm run firebase:validate

# Check for prohibited variables
./scripts/validate-firebase-production.sh

# Test with production environment
NODE_ENV=production FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3 npm test
```