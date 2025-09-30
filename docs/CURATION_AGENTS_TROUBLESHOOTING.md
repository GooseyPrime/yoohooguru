# Curation Agents Troubleshooting Guide

This guide helps diagnose and resolve issues with the AI curation agents (news and blog curation) in the yoohoo.guru platform.

## Overview

The platform includes two AI-powered curation agents:

- **News Curation Agent**: Runs daily at 6 AM to curate news articles for each subdomain
- **Blog Curation Agent**: Runs bi-weekly on Mondays at 8 AM to generate blog content for each subdomain

## Checking Agent Status

### Health Endpoint

Check the current status of curation agents via the health endpoint:

```bash
curl http://localhost:8080/health
```

The response includes a `curationAgents` section with detailed status information:

```json
{
  "status": "OK",
  "curationAgents": {
    "newsAgent": {
      "status": "running|error|disabled|stopped",
      "error": null,
      "lastStarted": "2025-01-19T08:26:04.093Z"
    },
    "blogAgent": {
      "status": "running|error|disabled|stopped",
      "error": null,
      "lastStarted": "2025-01-19T08:26:04.094Z"
    },
    "environment": "development",
    "timestamp": "2025-01-19T08:26:28.922Z"
  }
}
```

### Admin Dashboard

Agents status is also available via the admin API endpoint:

```bash
curl http://localhost:8080/api/admin/agents-status
```

## Common Issues and Solutions

### 1. "Failed to start curation agents:" (Empty Error Message)

**Symptoms:**
- Server logs show "Failed to start curation agents:" with no additional details
- No specific error information in logs

**Cause:**
- This was a bug in versions prior to this fix where error details were not properly logged
- Usually indicates a cron expression error or dependency validation failure

**Solution:**
- Upgrade to the latest version which includes comprehensive error logging
- Check the detailed logs for specific error messages

### 2. "Firebase not initialized. Call initializeFirebase() first."

**Symptoms:**
- Agents show status "error" in health endpoint
- Error message mentions Firebase initialization

**Cause:**
- Firebase Admin SDK is not properly initialized before agents start
- Missing or incorrect Firebase configuration

**Solution:**
1. Ensure Firebase is initialized in the main application before starting agents
2. Check Firebase environment variables:
   ```bash
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY=your_private_key
   ```
3. Verify Firebase service account credentials are valid

### 3. "No subdomains configured for curation"

**Symptoms:**
- Agents fail to start with subdomain configuration error
- Empty subdomains array in validation

**Cause:**
- Subdomains configuration file is missing or empty
- Subdomains config module not properly loaded

**Solution:**
1. Check `/backend/src/config/subdomains.js` exists and exports subdomain configurations
2. Ensure at least one subdomain is configured in the `subdomainConfig` object
3. Verify the `getAllSubdomains()` function returns a non-empty array

### 4. Invalid Cron Expression Error

**Symptoms:**
- Error message like "1/2 is a invalid expression for week day"
- Agents fail to start with cron-related errors

**Cause:**
- Invalid cron expression syntax in agent start() methods

**Solution:**
- This was fixed in the latest version
- Blog agent now uses `'0 8 1-7,15-21 * 1'` (first and third Monday of each month at 8 AM)
- News agent uses `'0 6 * * *'` (daily at 6 AM)

### 5. Agents Disabled Intentionally

**Symptoms:**
- Agents show status "disabled" in health endpoint
- Log message: "Curation agents are disabled via DISABLE_CURATION_AGENTS environment variable"

**Cause:**
- Agents are intentionally disabled via environment variable

**Solution:**
- This is normal behavior when `DISABLE_CURATION_AGENTS=true` is set
- Remove the environment variable or set it to `false` to enable agents
- Commonly used in testing environments or when agents should not run

## Environment Variables

### Required Configuration

```bash
# Firebase Configuration (Required)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_service_account_private_key

# Optional Configuration
DISABLE_CURATION_AGENTS=false  # Set to 'true' to disable agents
FAIL_ON_AGENT_ERROR=false      # Set to 'true' to crash app if agents fail (production)
NODE_ENV=development           # Environment (development/production/staging/test)
```

### Optional API Keys for Enhanced Features

```bash
# AI Services (Optional - agents will use fallback content if not available)
OPENROUTER_API_KEY=your_openrouter_key  # For AI-powered content generation
OPENAI_API_KEY=your_openai_key          # Fallback AI service
```

## Production Considerations

### Agent Failure Handling

In production, agent failures are logged but don't crash the server by default. To change this behavior:

```bash
FAIL_ON_AGENT_ERROR=true  # Will crash the app if agents fail to start
```

### Monitoring and Alerting

1. **Health Checks**: Monitor `/health` endpoint for agent status
2. **Log Monitoring**: Watch for error patterns in deployment logs:
   - "❌ Curation agent startup completed with errors"
   - "❌ Failed to start [agent] curation agent"
3. **Status Alerts**: Set up alerts when agent status changes to "error"

### Performance Impact

- Agents use cron jobs and only run at scheduled times
- No performance impact on normal API requests
- Agent execution is asynchronous and doesn't block other operations

## Development and Testing

### Manual Agent Triggers

```javascript
// In development, you can manually trigger agents
const { triggerManualCuration } = require('./src/agents/curationAgents');

// Trigger both agents manually
await triggerManualCuration();
```

### Test Environment

In test environments:
- Agents can be disabled with `DISABLE_CURATION_AGENTS=true`
- Firebase mocking is supported for unit tests
- Dependency validation can be bypassed in test mode

### Debug Logging

Enable detailed logging by setting the log level:

```bash
LOG_LEVEL=debug npm start
```

## Troubleshooting Checklist

When agents are not working:

- [ ] Check `/health` endpoint for agent status and error messages
- [ ] Verify Firebase configuration and initialization
- [ ] Confirm subdomains are properly configured
- [ ] Check environment variables are set correctly
- [ ] Review server startup logs for detailed error messages
- [ ] Verify cron expressions are valid
- [ ] Test manual agent triggers in development
- [ ] Check if agents are intentionally disabled

## Getting Help

If you're still experiencing issues:

1. Check the server logs for detailed error messages
2. Test the `/health` endpoint to see current agent status
3. Try starting the server in development mode with debug logging
4. Verify all environment variables are set correctly
5. Test Firebase connectivity independently

For persistent issues, review the curation agent source code in `/backend/src/agents/curationAgents.js` and the test suite in `/backend/tests/curationAgents.test.js`.