# Environment Configuration Guide

This guide explains how to properly configure environment variables for different deployment environments.

## Critical Configuration Rules

### ⚠️ Firebase Emulator Configuration

**IMPORTANT**: Firebase emulator environment variables must ONLY be set in test/development environments.

#### ✅ ALLOWED: Test and Development Environments

```bash
# .env.test or backend/.env.test
NODE_ENV=test
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

```bash
# .env.development (local development)
NODE_ENV=development
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

#### ❌ PROHIBITED: Production and Staging Environments

```bash
# ❌ NEVER do this in production/staging
NODE_ENV=production
FIRESTORE_EMULATOR_HOST=localhost:8080  # ❌ REMOVE THIS
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099  # ❌ REMOVE THIS
```

### Error Message

If you see this error in production/staging:

```
Environment configuration error: Emulator hosts configured with NODE_ENV=production.
Emulators are only allowed in test and development environments.
```

**Solution**: Remove all emulator-related environment variables from your production/staging configuration:
- `FIRESTORE_EMULATOR_HOST`
- `FIREBASE_AUTH_EMULATOR_HOST`
- `FIREBASE_STORAGE_EMULATOR_HOST`

## Environment Configuration by Deployment Target

### Railway (Backend API)

**Production Environment Variables:**
```bash
NODE_ENV=production
# DO NOT include any EMULATOR variables
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=...
SESSION_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
# ... other production variables
```

**Staging Environment Variables:**
```bash
NODE_ENV=staging
# DO NOT include any EMULATOR variables
FIREBASE_PROJECT_ID=your-staging-project-id
# ... staging-specific variables
```

### Netlify/Vercel (Frontend Apps)

**Production Environment Variables:**
```bash
NODE_ENV=production
# DO NOT include any EMULATOR variables
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other frontend variables
```

### GitHub Actions CI/CD

GitHub Actions workflows correctly set emulator variables with `NODE_ENV=test`:

```yaml
env:
  NODE_ENV: test  # ✅ Correct for CI testing
  FIRESTORE_EMULATOR_HOST: localhost:8080
  FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
```

## TypeScript Configuration for Next.js Apps

### Required Dependencies

Each Next.js app in `apps/*/` must have TypeScript and @types packages in `devDependencies`:

```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

### Netlify Build Configuration

The `netlify.toml` uses `npm ci` to ensure all workspace dependencies are installed:

```toml
[build]
  command = "npm ci && npx turbo run build --filter=@yoohooguru/main"
  publish = "apps/main/.next"
```

This command:
1. `npm ci` - Installs all dependencies from package-lock.json (including devDependencies)
2. `npx turbo run build --filter=@yoohooguru/main` - Builds the specified app using Turborepo

### Troubleshooting TypeScript Build Errors

If you see this error on Netlify:

```
It looks like you're trying to use TypeScript but do not have the required package(s) installed
Please install typescript and @types/react by running:
  npm install --save-dev typescript @types/react
```

**Solutions:**

1. **Verify package.json**: Check that the app's `package.json` includes TypeScript:
   ```bash
   cat apps/main/package.json | grep typescript
   ```

2. **Verify package-lock.json**: Ensure the lock file is committed and up-to-date:
   ```bash
   npm install  # Update package-lock.json
   git add package-lock.json
   git commit -m "Update package-lock.json"
   ```

3. **Check Netlify build logs**: Verify that `npm ci` is actually installing dependencies:
   ```
   npm ci
   # Should show: added X packages in Ys
   ```

4. **Workspace configuration**: Verify root `package.json` has workspaces configured:
   ```json
   {
     "workspaces": [
       "apps/*",
       "packages/*"
     ]
   }
   ```

## Validation Scripts

### Check Environment Configuration

Run this script to validate your environment configuration:

```bash
# Check for emulator variables in wrong environment
if [[ "$NODE_ENV" == "production" || "$NODE_ENV" == "staging" ]]; then
  if [[ -n "$FIRESTORE_EMULATOR_HOST" || -n "$FIREBASE_AUTH_EMULATOR_HOST" ]]; then
    echo "❌ ERROR: Emulator variables found in $NODE_ENV environment"
    echo "Remove FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST"
    exit 1
  else
    echo "✅ Environment configuration valid for $NODE_ENV"
  fi
fi
```

### Verify TypeScript Installation

```bash
# Verify TypeScript is installed in app
cd apps/main
if command -v tsc &> /dev/null; then
  echo "✅ TypeScript is installed: $(tsc --version)"
else
  echo "❌ TypeScript not found. Run: npm install"
fi
```

## Common Issues and Solutions

### Issue 1: Firebase Emulator Error in Production

**Symptom:**
```
Environment configuration error: Emulator hosts configured with NODE_ENV=production
```

**Solution:**
1. Go to Railway/Netlify environment variables settings
2. Remove `FIRESTORE_EMULATOR_HOST`
3. Remove `FIREBASE_AUTH_EMULATOR_HOST`
4. Ensure `NODE_ENV=production`
5. Redeploy

### Issue 2: TypeScript Not Found in Netlify Build

**Symptom:**
```
It looks like you're trying to use TypeScript but do not have the required package(s) installed
```

**Solution:**
1. Verify app has TypeScript in devDependencies
2. Run `npm install` at root to update package-lock.json
3. Commit and push package-lock.json
4. Trigger new Netlify build

### Issue 3: Workspace Dependencies Not Found

**Symptom:**
```
Cannot find module '@yoohooguru/shared'
```

**Solution:**
1. Ensure root package.json has correct workspaces configuration
2. Run `npm install` at root to link workspaces
3. Verify Netlify uses `npm ci` (not `npm install --production`)

## Reference Files

- `.env.example` - Template for production environment variables
- `.env.test` - Test environment with emulators enabled
- `backend/.env.test` - Backend-specific test configuration
- `.env.shared` - Shared variables for Next.js apps (no emulators)
- `netlify.toml` - Netlify build configuration
- `railway.json` - Railway deployment configuration

## Additional Resources

- [Firebase Emulators Documentation](https://firebase.google.com/docs/emulator-suite)
- [Next.js TypeScript Documentation](https://nextjs.org/docs/basic-features/typescript)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
