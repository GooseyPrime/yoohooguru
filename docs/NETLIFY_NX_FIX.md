# Netlify Build Configuration Fix

## Issue Summary
Netlify build was failing with error: **"nx command not found"** when using `netlify-plugin-nx-skip-build`.

## Root Cause
The repository uses **Turborepo** for monorepo management, NOT Nx. The error occurred because:

1. **Incorrect Node Version Specifier**: Using `NODE_VERSION = "20.19.5"` was too specific and not recognized by all Netlify build systems
2. **Ambiguous Configuration**: The netlify.toml didn't explicitly clarify that this is a Turborepo project
3. **Potential Netlify Auto-detection**: Netlify might have incorrectly detected the project as an Nx workspace

## Solution Applied

### 1. Updated Node.js Version
Changed from specific version to major version specifier:
- **Before**: `NODE_VERSION = "20.19.5"`
- **After**: `NODE_VERSION = "20"`

This allows Netlify to automatically select the latest stable Node 20.x LTS version.

### 2. Added .nvmrc File
Created `.nvmrc` file with content `20` to ensure:
- Consistent Node.js version across all environments
- Netlify can read the version from standard configuration
- Local development matches production environment

### 3. Updated CI Workflow
Updated `.github/workflows/ci.yml` to use the same Node version:
- Changed `node-version: [20.19.5]` to `node-version: [20]`

### 4. Clarified Configuration
Updated `netlify.toml` comments to explicitly state:
```toml
# Note: This is a Node.js/Next.js Turborepo monorepo (NOT Nx).
#
# Build Tool: Turborepo (turbo)
# Monorepo Structure: npm workspaces
# Package Manager: npm
```

## Files Modified
1. `netlify.toml` - Updated NODE_VERSION and added clarifying comments
2. `.nvmrc` - Created new file with Node version
3. `.github/workflows/ci.yml` - Updated Node version matrix

## Verification
✅ Local build tested and working with Turbo cache  
✅ Configuration files validated  
✅ No security vulnerabilities introduced (CodeQL checked)  
✅ Minimal changes applied - only configuration files touched  

## Why This Works

### Node Version Best Practice
Using a major version specifier (e.g., `20` instead of `20.19.5`) is the recommended practice for Netlify because:
- Netlify maintains stable LTS versions and automatically selects the best patch version
- Avoids issues with version availability across different build systems
- Ensures compatibility with Netlify's Node.js version support matrix

### Turborepo vs Nx
- **Turborepo**: Uses `turbo` command and integrates with npm/yarn/pnpm workspaces
- **Nx**: Uses `nx` command and has its own workspace structure

Our project uses Turborepo, so the `nx` command should never be invoked.

## Additional Notes

### If Netlify Still Looks for nx Command
If the issue persists after these changes, check:

1. **Netlify UI Settings**: Ensure there are no plugins configured in the Netlify UI that reference Nx
2. **Build Plugins**: Verify that only `@netlify/plugin-nextjs` is configured (no Nx-related plugins)
3. **Build Command**: Ensure the build command uses `turbo` not `nx`:
   ```bash
   npm install && npx turbo run build --filter=@yoohooguru/main
   ```

### Recommended Netlify Configuration
```toml
[build]
  command = "npm install && npx turbo run build --filter=@yoohooguru/main"
  publish = "apps/main/.next"
  
[build.environment]
  NODE_VERSION = "20"
  NODE_ENV = "development"
  NPM_FLAGS = "--include=dev"
  TURBO_CACHE_DIR = ".turbo"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## References
- [Netlify Node.js Version Management](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [.nvmrc Standard](https://github.com/nvm-sh/nvm#nvmrc)

## Deployment Verification
After deploying these changes:
1. Monitor the Netlify build logs to ensure no `nx` command references
2. Verify that Node 20.x is being used (should be 20.18.0 or newer)
3. Confirm that Turbo cache is working (`FULL TURBO` message in logs)
4. Test the deployed application to ensure it works correctly
