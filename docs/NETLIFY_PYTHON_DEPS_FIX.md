# Netlify Deployment Fix - Python Dependencies

## Issue
Netlify deployment was failing when trying to install Python dependencies from `requirements.txt` because `pydantic-core` required the Rust compiler to build from source, which is not available in Netlify's build environment.

## Error Message
```
error: rustup could not choose a version of cargo to run
Cargo, the Rust package manager, is not installed or is not on PATH.
This package requires Rust and Cargo to compile extensions.
```

## Root Cause
- Netlify auto-detects Python projects when it finds `requirements.txt` in the repository root
- The repository is primarily a Node.js/Next.js monorepo
- Python dependencies are only needed for the FastAPI MCP server (used for testing/development)
- Netlify was attempting to install Python dependencies even though they're not needed for the frontend build

## Solution
Moved all Python-related files to a `python-mcp-server/` subdirectory:
- `requirements.txt` → `python-mcp-server/requirements.txt`
- `src/` → `python-mcp-server/src/`
- `tests/` → `python-mcp-server/tests/`
- `pyproject.toml` → `python-mcp-server/pyproject.toml`

By moving these files out of the repository root, Netlify no longer auto-detects Python and will not attempt to install Python dependencies during the build process.

## Additional Changes
- Created `netlify.toml` to explicitly configure Node.js build settings
- Added `python-mcp-server/README.md` with instructions for using the Python MCP server
- Updated `pydantic` to version 2.10.6 (has pre-built wheels if Python is needed)

## Verification
✅ Python files no longer in repository root  
✅ Netlify will not auto-detect Python  
✅ Node.js build will proceed without Python dependency installation  
✅ Python MCP server still accessible in `python-mcp-server/` subdirectory  
✅ All Python tests can still be run from the subdirectory  

## Running the Python MCP Server
If you need to run the Python MCP server locally:

```bash
cd python-mcp-server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

## Deployment Architecture
The recommended production deployment architecture is:
- **Frontend (Next.js apps)**: Deploy to Vercel (25 separate projects)
- **Backend (Node.js/Express)**: Deploy to Railway
- **Python MCP Server**: Not deployed to production (dev/testing only)

See `docs/DEPLOYMENT.md` for complete deployment instructions.
