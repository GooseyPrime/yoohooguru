# Netlify Deployment Fix - Python Dependencies

## Issue
Netlify deployment was failing when trying to install Python dependencies from `requirements.txt` because `pydantic-core==2.14.1` required the Rust compiler to build from source, which is not available in Netlify's build environment.

## Error Message
```
error: rustup could not choose a version of cargo to run
Cargo, the Rust package manager, is not installed or is not on PATH.
This package requires Rust and Cargo to compile extensions.
```

## Root Cause
- The repository contains a Python FastAPI MCP (Multi-Component Platform) server for testing
- When Netlify detects `requirements.txt` in the root, it tries to install Python dependencies
- The old `pydantic==2.5.0` depended on `pydantic-core==2.14.1`, which required Rust compilation
- Early versions of pydantic-core didn't have pre-built wheels for all platforms

## Solution
Updated `pydantic` from version 2.5.0 to 2.10.6:
- Version 2.10.6 uses `pydantic-core==2.27.2`
- Newer pydantic-core versions include pre-built manylinux wheels
- No Rust compiler needed - installs directly from wheel files

## Changes Made
```diff
- pydantic==2.5.0
+ pydantic==2.10.6
```

## Verification
✅ All 7 Python tests pass with the new version
✅ Installation completes without requiring Rust
✅ Pre-built wheels available for common platforms
✅ No breaking changes to FastAPI functionality
✅ Compatible with existing fastapi==0.104.1 and other dependencies

## Note for Future
While this fixes the immediate issue, the recommended deployment architecture is:
- **Frontend (Next.js apps)**: Deploy to Vercel (25 separate projects)
- **Backend (Node.js/Express)**: Deploy to Railway
- **Python MCP Server**: Deploy separately if needed (not to Netlify)

Netlify should ideally only build the frontend applications, not Python dependencies.
