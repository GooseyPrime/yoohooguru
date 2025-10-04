# Scripts Directory

This directory contains various utility scripts for the yoohoo.guru project.

## Copilot Automation System

### `copilot-agent.js`
The main Copilot agent script that processes GitHub comments and identifies actionable instructions. This script replaces the old `<comment_new>` tag-based system with intelligent natural language processing.

**Features:**
- Natural language instruction detection
- Priority level analysis
- File reference extraction
- Safety checks for dangerous commands
- Comprehensive logging and audit trail

**Usage:**
```bash
# The script is automatically triggered by GitHub Actions on PR/issue comments
# Manual execution for testing:
node scripts/copilot-agent.js
```

**Environment Variables:**
- `GITHUB_TOKEN` - GitHub API token for repository access
- `GITHUB_CONTEXT` - Full GitHub event context
- `COMMENT_BODY` - The comment text to process
- `COMMENT_USER` - Username of the comment author
- `REPOSITORY` - Repository name (owner/repo)
- `PR_NUMBER` - Pull request or issue number

### GitHub Actions Integration

The Copilot automation system is integrated with GitHub Actions through `.github/workflows/copilot-agent.yml`. The workflow triggers on:

- Issue comments (created/edited)
- Pull request review comments (created/edited)
- Issues (opened/edited)

**Supported Comment Patterns:**

1. **Traditional tagged format (backward compatible):**
   ```
   <comment_new>Fix the authentication bug in src/auth.js</comment_new>
   ```

2. **Natural language instructions:**
   ```
   @copilot please fix the authentication bug in src/auth.js
   Fix the authentication bug in src/auth.js
   The authentication bug needs to be resolved
   ```

3. **Priority detection:**
   ```
   URGENT: Fix the security vulnerability immediately!
   Critical bug in authentication system
   ```

**Action Types Detected:**
- **Fix**: "fix the bug", "resolve the issue", "correct the error"
- **Update**: "update the docs", "modify the config", "change the settings"
- **Implement**: "implement the feature", "add functionality", "create component"
- **Remove**: "remove deprecated code", "delete unused files"
- **Refactor**: "optimize performance", "improve code structure"
- **Test**: "add tests for", "validate the functionality"
- **Document**: "update README", "add documentation"

### Security Features

- **Forbidden Pattern Detection**: Blocks dangerous commands (`rm -rf`, `sudo`, shell execution)
- **File Extension Validation**: Only processes safe file types
- **Bot Detection**: Prevents infinite loops by ignoring bot comments
- **Rate Limiting**: Built-in safeguards against rapid-fire processing
- **Audit Trail**: Complete logging for security analysis

### Logging

All comment analysis is logged to `logs/comment-analysis.log` with detailed reasoning:
- Why comments were accepted or rejected
- Confidence scores for parsed instructions
- File references and priority levels
- Complete audit trail

## Other Scripts

### `detect-orphan-modules.js`
Advanced orphan module detection script that identifies unused dependencies, unreachable modules, and orphaned files.

**Features:**
- Detects unused npm dependencies across frontend/backend
- Finds unreachable JavaScript modules using dependency graph analysis
- Identifies orphaned files (backups, temp files, etc.)
- Generates comprehensive reports in JSON, HTML, and Markdown formats
- CI integration with configurable thresholds
- Detailed recommendations for cleanup actions

**Usage:**
```bash
# Basic analysis
node scripts/detect-orphan-modules.js

# Verbose output with custom output directory
node scripts/detect-orphan-modules.js --verbose --output=./reports

# CI mode with error threshold
ORPHAN_ERROR_THRESHOLD=50 node scripts/detect-orphan-modules.js
```

### `ci-orphan-detection.sh`
CI integration script for orphan module detection that prepares reports for artifact upload.

### `cleanup-copilot-branches.sh`
Script to clean up old copilot branches safely.

### `deployment-fix-helper.sh`
Helper script for deployment fixes and validations.

### `optimize-build.sh`
Build optimization script for faster compilation.

### `validate-firebase-production.sh`
Firebase configuration validation for production environment.

### `validate-railway.sh`
Railway deployment validation script.

### `validate-ci-workflow.sh`
Validates CI workflow configuration to ensure correct test commands are used. This script prevents regressions where invalid commands like `backend-check` might be introduced.

**Usage:**
```bash
# From repository root
./scripts/validate-ci-workflow.sh
```

**Checks performed:**
- Verifies no invalid commands (backend-check, etc.) in workflow files
- Confirms backend tests use `npm test` command
- Validates firebase-tools installation configuration
- Ensures correct working directory setup

**Exit codes:**
- 0: All validations passed
- 1: One or more validation errors found

### `verify-architecture.sh`
Architecture verification and validation script.

### `verify-deployment.js`
Deployment verification with endpoint testing.

### `verify_mcp_status.py`
MCP (Multi-Component Platform) status verification script.