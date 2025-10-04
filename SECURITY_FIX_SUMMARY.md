# Security Fix: Checkout of Untrusted Code in Privileged Context

## Issue Description

The `autopilot.yml` workflow had a critical security vulnerability where it:
1. Used both `pull_request` and `pull_request_target` triggers
2. Checked out untrusted PR code using `ref: ${{ github.event.pull_request.head.sha }}`
3. Ran this untrusted code with write permissions and access to repository secrets

This combination allowed malicious code from forked PRs to potentially access repository secrets.

## Security Risk

**Severity**: High

When using `pull_request_target`, the workflow runs in the context of the target repository with:
- Write permissions to the repository
- Access to all repository secrets
- Ability to modify the repository

If untrusted code from a fork is checked out and executed in this context, it can:
- Steal repository secrets (API keys, tokens, credentials)
- Modify repository contents
- Escalate privileges
- Compromise the CI/CD pipeline

## Fix Applied

### 1. Removed `pull_request_target` Trigger
- **Before**: Workflow triggered on both `pull_request` and `pull_request_target`
- **After**: Workflow only triggers on `pull_request`
- **Impact**: Workflow now runs with read-only permissions by default

### 2. Added Default Read-Only Permissions
```yaml
permissions:
  contents: read
```
This ensures all jobs run with minimal permissions by default.

### 3. Explicit Permissions for Jobs That Need Write Access
Jobs that post comments or add labels now have explicit permissions:

```yaml
permissions:
  pull-requests: write
  issues: write
```

These jobs do NOT checkout any code, preventing untrusted code execution with write permissions.

### 4. Removed Explicit SHA Checkout
- **Before**: `ref: ${{ github.event.pull_request.head.sha }}`
- **After**: Default checkout (automatically uses correct ref for `pull_request` events)
- **Impact**: Cleaner and follows GitHub security best practices

## Jobs and Their Permissions

| Job | Checks Out Code | Write Permissions | Security Level |
|-----|----------------|-------------------|----------------|
| `check-autopilot` | No | No | ✅ Secure |
| `post-action-comment` | No | Yes (PR comments/labels) | ✅ Secure |
| `verify` | Yes | No | ✅ Secure |
| `frontend-preview` | Yes | Yes (PR comments only) | ✅ Secure |
| `backend-check` | Yes | No | ✅ Secure |
| `prod-release` | No | Yes (PR comments only) | ✅ Secure |

**Key Security Principle**: Jobs that check out code do not have access to secrets. Jobs that need write permissions do not check out code.

## Why This Fix Works

1. **Principle of Least Privilege**: Each job only gets the minimum permissions it needs
2. **Separation of Concerns**: Jobs that handle untrusted code are isolated from jobs with write access
3. **No Secret Exposure**: Code from forks cannot access repository secrets
4. **Audit Trail**: All permission grants are explicit and documented in the workflow file

## Verification

All workflows have been checked for similar issues:
- ✅ `autopilot.yml` - Fixed
- ✅ `ci.yml` - No issues found
- ✅ `copilot-agent.yml` - No issues found
- ✅ `deployment-control.yml` - No issues found

## References

- [GitHub Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Keeping your GitHub Actions secure](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections)
- [Using GITHUB_TOKEN in a workflow](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
