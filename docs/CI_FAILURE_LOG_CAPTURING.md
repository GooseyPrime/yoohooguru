# CI Failure Log Capturing - Implementation Guide

## Overview

This implementation fixes the CI workflow failure reporting to provide comprehensive, actionable error information directly in PR comments, making it easy for @copilot and developers to identify and fix issues.

## Problem Statement

The original CI workflow had several issues:
1. **Not enough information**: Generic failure messages without actual error details
2. **Too small log portion**: When logs were shown, they didn't include enough context
3. **Inconsistent error detection**: Sometimes didn't catch errors on subsequent runs
4. **Manual navigation required**: Users had to click through multiple pages to find actual errors

## Solution Architecture

### Component 1: Log Extraction Script

**File**: `.github/scripts/extract-failure-logs.sh`

**Purpose**: Extracts and formats error information from CI logs

**Features**:
- Detects multiple error patterns:
  - Jest/test failures (`FAIL`, `Expected:`, `Received:`)
  - ESLint linting errors (`error  `)
  - Build errors (`npm error`, `ERROR in`)
  - Process exit codes
- Cleans ANSI color codes and timestamps
- Formats output as collapsible Markdown sections
- Falls back to last 100 lines if no specific patterns found
- Handles large logs efficiently (limits to 100 lines per section)

**Usage**:
```bash
# Extract errors from a log file
.github/scripts/extract-failure-logs.sh extract /path/to/logs.txt

# Format for PR comment with workflow metadata
.github/scripts/extract-failure-logs.sh format /path/to/logs.txt
```

### Component 2: Failure Notifier Workflow

**File**: `.github/workflows/ci-failure-notifier.yml`

**Purpose**: Automatically analyzes failures and posts detailed information to PRs

**Workflow**:
1. **Trigger**: Runs when main CI workflow completes with failure
2. **Get PR Number**: Identifies which PR triggered the workflow
3. **Download Logs**: Fetches complete workflow logs via GitHub API
4. **Extract Failures**: Uses extraction script to identify error details
5. **Post to PR**: Creates comprehensive comment with @copilot mention

**Key Features**:
- Only runs on PR-triggered workflows (not on direct pushes)
- Downloads and extracts logs automatically
- Provides structured fallback if extraction fails
- Uses GitHub CLI for reliable comment posting
- Includes debugging instructions and common fixes

**Triggers**:
```yaml
on:
  workflow_run:
    workflows: ["Continuous Integration"]
    types: [completed]
```

### Component 3: Updated Main CI Workflow

**File**: `.github/workflows/ci.yml`

**Changes**: Simplified failure notification step

**Purpose**: Post quick notification immediately, let notifier handle details

**Benefits**:
- Faster initial feedback
- Cleaner separation of concerns
- Main workflow stays focused on testing
- Detailed analysis happens asynchronously

## How It Works (Step by Step)

1. **Developer pushes code to PR**
   ```
   Developer → GitHub PR → CI Workflow Triggered
   ```

2. **CI runs tests and detects failure**
   ```
   CI Workflow → Tests Fail → Workflow Completes (status: failure)
   ```

3. **Quick notification posted**
   ```
   ci.yml → Posts: "@copilot ⚠️ CI failed. Detailed analysis coming..."
   ```

4. **Notifier workflow triggered**
   ```
   workflow_run event → ci-failure-notifier.yml starts
   ```

5. **Logs downloaded and analyzed**
   ```
   GitHub API → Download logs.zip
              → Extract and combine log files
              → Run extract-failure-logs.sh
              → Parse error patterns
   ```

6. **Detailed comment posted**
   ```
   Extracted Errors → Format PR Comment
                   → Post with @copilot mention
                   → Include:
                     - Specific error messages
                     - Stack traces
                     - Debugging instructions
                     - Links to full logs
   ```

## Example Output

### Before (Original Implementation)
```markdown
❌ CI Workflow Failed

One or more steps failed. Please review the logs.

[View logs](link)
```
**Problems**: No actual error information, requires manual navigation

### After (New Implementation)
```markdown
@copilot

## ❌ CI Workflow Failed

**Workflow Run:** [#123](link)
**Commit:** `abc123`

### 📋 Failure Details

<details><summary>View Error Details</summary>

```
FAIL tests/webhooks.test.js
  ● Stripe Webhooks › should accept valid webhook

    expect(received).toBe(expected)
    
    Expected: 200
    Received: 400
    
      at Object.toBe (tests/webhooks.test.js:53:31)

Test Suites: 5 failed, 15 passed
Tests: 27 failed, 120 passed
```

</details>

### 🔍 How to Debug

1. Review the error details above
2. Run tests locally: `cd backend && npm test`
3. Check for missing environment variables

### ✅ Next Steps

1. Fix the identified issues locally
2. Run `npm test` to verify fixes
3. Push corrected code to this PR
```
**Benefits**: Actual error messages, actionable information, clear next steps

## Error Pattern Detection

The script detects these patterns (in order of priority):

1. **Test Failures**
   - Pattern: `FAIL`, `Expected:`, `Received:`, `at Object`
   - Extracts: Test file, assertion errors, stack traces

2. **Linting Errors**
   - Pattern: `error  ` (ESLint format)
   - Extracts: File paths, rule violations, line numbers

3. **Build Errors**
   - Pattern: `npm ERR!`, `npm error`, `ERROR in`
   - Extracts: Build failures, dependency issues

4. **Process Exit Codes**
   - Pattern: `Process completed with exit code [^0]`
   - Extracts: Last 10 lines before exit

5. **Fallback**
   - If no patterns match: Last 100 lines of logs
   - Ensures something is always captured

## Configuration

### Environment Variables

No special environment variables required. The workflow uses:
- `GITHUB_TOKEN` (automatically provided by GitHub Actions)
- Workflow run context (automatically available)

### Customization Options

**In `extract-failure-logs.sh`**:
```bash
MAX_ERROR_LINES=100        # Maximum lines to extract per pattern
ERROR_CONTEXT_LINES=5      # Context lines around errors
```

**In `ci-failure-notifier.yml`**:
```yaml
permissions:
  contents: read
  pull-requests: write      # Required to post comments
  issues: write             # Required to post comments
  actions: read             # Required to download logs
```

## Testing

### Test the Extraction Script
```bash
# Test with existing log file
.github/scripts/extract-failure-logs.sh extract job-logs.txt

# Should output formatted error details
```

### Test the Workflow
1. Create a PR with failing tests
2. Wait for CI to fail
3. Check PR comments for detailed failure analysis
4. Verify @copilot is mentioned

## Troubleshooting

### "No PR found for this workflow run"
- **Cause**: Workflow triggered by direct push, not PR
- **Solution**: Expected behavior, workflow only runs on PR failures

### "Failed to download logs"
- **Cause**: API rate limit or permissions issue
- **Solution**: Check GITHUB_TOKEN permissions, verify workflow has `actions: read`

### "No specific error patterns found"
- **Cause**: Logs don't match known error patterns
- **Solution**: Fallback shows last 100 lines; consider adding new patterns to script

### "Unable to extract specific error details"
- **Cause**: Logs empty or extraction script failed
- **Solution**: Fallback message includes link to full logs

## Maintenance

### Adding New Error Patterns

Edit `.github/scripts/extract-failure-logs.sh`:

```bash
# Add new pattern detection
if grep -q "YOUR_PATTERN" "$log_file" 2>/dev/null; then
    grep -A "${ERROR_CONTEXT_LINES}" "YOUR_PATTERN" "$log_file" >> "$output_file"
fi
```

### Updating Comment Format

Edit `.github/workflows/ci-failure-notifier.yml`:

Modify the comment generation section (lines 138-170) to change the PR comment format.

## Security Considerations

1. **GITHUB_TOKEN**: Limited to PR scope, automatically provided
2. **Log Content**: May contain sensitive information, only shown in PR context
3. **API Access**: Read-only access to workflow logs
4. **Rate Limiting**: Uses conditional execution to minimize API calls

## Performance

- **Log Download**: ~2-5 seconds for typical logs
- **Extraction**: <1 second for most log sizes
- **Comment Posting**: <1 second
- **Total Overhead**: ~5-10 seconds after CI completes

## Future Enhancements

Potential improvements for future iterations:

1. **Intelligent Pattern Learning**: Use AI to identify new error patterns
2. **Failure Categorization**: Group similar errors across runs
3. **Auto-Fix Suggestions**: Suggest specific fixes based on error type
4. **Historical Analysis**: Track failure trends over time
5. **Multi-Job Support**: Better handling of parallel job failures

## References

- GitHub Actions workflow_run event: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run
- GitHub REST API - Actions: https://docs.github.com/en/rest/actions
- YAML Multiline Strings: https://yaml-multiline.info/
