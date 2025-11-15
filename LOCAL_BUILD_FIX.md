# Local Build Issues - Windows with Node.js v22

## Issue Summary
After merging PR #507, local builds on Windows with Node.js v22.20.0 are failing with:
- Node.js version mismatch warning
- Next.js build worker crash (exit code 3221226505)

## Root Causes

### 1. Node.js Version Restriction
PR #507 changed the Node.js version from `>=20.0.0` to `20.x` to fix Vercel warnings. This was too restrictive and blocks Node.js v22 users.

### 2. Next.js Build Worker Crash on Windows
Exit code 3221226505 (0xC0000409) is a Windows-specific STATUS_STACK_BUFFER_OVERRUN error. This can be caused by:
- Memory issues with Node.js v22 on Windows
- TypeScript/ESLint type checking consuming too much memory
- Incompatibility between Next.js 14.2.33 and Node.js v22 on Windows

## Solutions Applied

### Fix 1: Update Node.js Version Range
Changed `package.json` to support Node.js 20.x through 22.x:

```json
"engines": {
  "node": ">=20.0.0 <23.0.0",
  "npm": ">=9.0.0"
}
```

This allows both Node.js 20.x and 22.x while preventing auto-upgrades to v23.

### Fix 2: Increase Node.js Memory Limit (For Local Builds)
The Next.js build worker crash is likely due to memory constraints. Add this to your local environment:

**Option A: Set environment variable (Recommended for Windows)**
```powershell
# In PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Option B: Update package.json scripts (if issue persists)**
Add to `apps/main/package.json`:
```json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build",
  "build:windows": "set NODE_OPTIONS=--max-old-space-size=4096 && next build"
}
```

### Fix 3: Alternative - Use Node.js v20 LTS
If the crash persists, consider using Node.js v20 LTS for local development:

```powershell
# Using nvm-windows
nvm install 20
nvm use 20
```

## Recommended Local Build Process

### For Windows Users with Node.js v22:

1. **Set memory limit:**
   ```powershell
   $env:NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. **Clean install:**
   ```powershell
   npm ci
   ```

3. **Build with turbo:**
   ```powershell
   npx turbo run build --force
   ```

### Alternative: Build only the main app
If turbo build fails, try building just the main app:

```powershell
cd apps/main
npm run build
```

## Vercel Deployment
Vercel deployments are NOT affected by this issue because:
- Vercel uses Node.js 20.x in their build environment
- The `>=20.0.0 <23.0.0` range is compatible with Vercel's requirements
- Vercel's build environment has proper memory allocation

## Railway Deployment
Railway deployments are also unaffected:
- Railway uses containerized builds with proper resource allocation
- The backend build is simple and doesn't require heavy compilation

## Testing Recommendations

After applying these fixes:

1. **Test local build:**
   ```powershell
   $env:NODE_OPTIONS="--max-old-space-size=4096"
   npm ci
   npx turbo run build --force
   ```

2. **Test Vercel deployment:**
   - Push to GitHub
   - Vercel will automatically build and deploy
   - Check build logs for any warnings

3. **Test Railway deployment:**
   - Railway will automatically deploy backend
   - Check logs for successful startup

## Additional Notes

### Why Node.js v22 on Windows?
Node.js v22 is the latest LTS version and offers performance improvements. However, some build tools (like Next.js) may have compatibility issues on Windows specifically.

### Long-term Solution
Consider:
1. Using Node.js v20 LTS for local development (most stable)
2. Upgrading Next.js to v15 when stable (better Node.js v22 support)
3. Using WSL2 for development (Linux environment on Windows)

### WSL2 Alternative (Recommended for Windows Developers)
If issues persist, consider using WSL2:

```powershell
# Install WSL2
wsl --install

# Inside WSL2
cd /mnt/c/The-Almagest-Project/yoohooguru
nvm install 20
nvm use 20
npm ci
npm run build
```

WSL2 provides a Linux environment that typically has fewer build issues.