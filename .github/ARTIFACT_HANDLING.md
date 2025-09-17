# Workflow Artifact Handling

This document explains how the CI/CD workflow handles runtime log artifacts and prevents workflow failures when expected artifacts are missing.

## Problem Statement

GitHub Actions workflows were attempting to upload runtime log artifacts from these locations:
- `/home/runner/work/_temp/runtime-logs/blocked.jsonl`
- `/home/runner/work/_temp/runtime-logs/blocked.md`

These files may not exist in all builds, causing:
1. **Workflow failures**: "No files were found" errors
2. **Noisy builds**: Failed workflows even when the actual build succeeded
3. **PR automation issues**: Copilot agents getting stuck in comment loops
4. **Validation blocks**: PRs unable to be auto-closed due to false failures

## Solution

### 1. Conditional Artifact Upload

The workflow now checks for artifact existence before attempting uploads:

```yaml
- name: Handle runtime log artifacts
  id: check-artifacts
  run: |
    chmod +x .github/scripts/handle-artifacts.sh
    .github/scripts/handle-artifacts.sh check

- name: Upload runtime log artifacts (conditional)
  if: steps.check-artifacts.outputs.has-artifacts == 'true'
  uses: actions/upload-artifact@v4
  with:
    name: runtime-logs
    path: |
      /home/runner/work/_temp/runtime-logs/blocked.jsonl
      /home/runner/work/_temp/runtime-logs/blocked.md
    retention-days: 30
    if-no-files-found: warn
  continue-on-error: true
```

### 2. Artifact Handler Script

The `.github/scripts/handle-artifacts.sh` script provides:

- **Directory creation**: Ensures `/home/runner/work/_temp/runtime-logs` exists
- **File validation**: Checks JSON format and file readability
- **Status reporting**: Clear logging about artifact presence/absence
- **GitHub Actions integration**: Sets appropriate output variables

### 3. PR Automation Support

The workflow sets output variables for PR automation:

- `artifact-errors-only`: Indicates if only artifact-related issues occurred
- `pr-safe-to-close`: Signals whether a PR can be auto-closed safely
- `has-artifacts`: Whether runtime log artifacts were found

### 4. Graceful Failure Handling

- Uses `continue-on-error: true` for artifact upload steps
- Uses `if-no-files-found: warn` instead of `error`
- Provides clear logging about missing files being normal

## Usage

### In Workflows

The artifact handler can be used in different modes:

```bash
# Check and set up everything (default)
.github/scripts/handle-artifacts.sh check

# Just create the directory
.github/scripts/handle-artifacts.sh create-dir

# Validate existing artifacts
.github/scripts/handle-artifacts.sh validate

# Show summary only
.github/scripts/handle-artifacts.sh summary
```

### Output Variables

The script sets these GitHub Actions output variables:

- `jsonl-exists`: boolean - whether blocked.jsonl exists
- `md-exists`: boolean - whether blocked.md exists  
- `has-artifacts`: boolean - whether any artifacts exist
- `artifact-errors-only`: boolean - for PR automation
- `workflow-should-continue`: boolean - for PR automation

## When Are Artifacts Created?

Runtime log artifacts are typically created when:

- **Content policy violations** are detected and blocked
- **Rate limiting** occurs with external APIs
- **System errors** happen during content processing
- **Security scans** find issues requiring logging

## Normal Operation

**It is completely normal** for these artifacts to not exist. Their absence indicates:

- ✅ Clean build with no blocked operations
- ✅ No content policy violations
- ✅ No rate limiting encountered
- ✅ Successful processing without issues

## Troubleshooting

### If artifacts are unexpectedly missing:

1. Check if the runtime logs directory was created: `/home/runner/work/_temp/runtime-logs`
2. Verify the process that creates artifacts is running correctly
3. Check for permissions issues writing to the temp directory

### If artifacts are malformed:

1. The script validates JSON format in `.jsonl` files
2. Check the logs for validation error messages
3. Ensure the process creating artifacts is writing valid data

### If PR automation is stuck:

1. Check the `artifact-errors-only` output variable
2. Verify the workflow sets `pr-safe-to-close` appropriately
3. Review Copilot agent comment patterns for loops

## Best Practices

1. **Always use conditional uploads** - never fail workflows for missing optional artifacts
2. **Log clearly** - explain when missing artifacts are expected vs. problematic  
3. **Set appropriate outputs** - help downstream automation make decisions
4. **Validate content** - check artifact format when they do exist
5. **Use `continue-on-error`** - prevent optional steps from breaking critical workflows

## Migration Notes

If you have existing workflows that upload these artifacts:

1. Replace direct `upload-artifact` steps with conditional logic
2. Add the artifact handler script to your repository
3. Update PR automation to check for `artifact-errors-only` conditions
4. Test with both artifact-present and artifact-absent scenarios

## Related Files

- `.github/workflows/ci.yml` - Main CI workflow with artifact handling
- `.github/scripts/handle-artifacts.sh` - Artifact management script
- This documentation file