# GitHub Actions Security Best Practices

This document outlines security best practices for GitHub Actions workflows in this repository.

## Critical Security Rules

### 1. Never Use `pull_request_target` with Code Checkout

❌ **DANGEROUS - DO NOT DO THIS:**
```yaml
on:
  pull_request_target:  # Runs with write permissions

jobs:
  build:
    steps:
      - uses: actions/checkout@v4  # Checks out untrusted PR code
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - run: npm install && npm test  # Executes untrusted code with secrets!
```

✅ **SAFE - DO THIS INSTEAD:**
```yaml
on:
  pull_request:  # Runs with read-only permissions

permissions:
  contents: read  # Explicit read-only default

jobs:
  build:
    steps:
      - uses: actions/checkout@v4  # Safe - read-only permissions
      - run: npm install && npm test  # Safe - no access to secrets
```

### 2. Use Explicit Permissions

Always set explicit permissions at the workflow or job level:

```yaml
# Workflow-level default (recommended)
permissions:
  contents: read

jobs:
  # Job that needs write access
  comment:
    permissions:
      pull-requests: write  # Explicit grant
    steps:
      - name: Comment on PR
        # This job does NOT checkout code
```

### 3. Separate Privileged Operations

Keep jobs that handle untrusted code separate from jobs with write permissions:

✅ **SAFE PATTERN:**
```yaml
jobs:
  test:
    # Checkouts and tests untrusted code
    permissions:
      contents: read  # Read-only
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  comment:
    # Posts results, does not checkout code
    needs: test
    permissions:
      pull-requests: write  # Write access
    steps:
      - name: Post comment
        uses: actions/github-script@v7
```

### 4. Avoid Dynamic Code Execution

Never execute code from PR comments or bodies:

❌ **DANGEROUS:**
```yaml
- run: ${{ github.event.comment.body }}  # Code injection!
```

### 5. Use Dependency Pinning

Pin action versions to specific SHAs:

✅ **RECOMMENDED:**
```yaml
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

## Security Checklist for New Workflows

- [ ] No `pull_request_target` used with code checkout
- [ ] Default permissions set to read-only
- [ ] Jobs with write permissions do not checkout code
- [ ] No execution of untrusted input (PR body, comments, etc.)
- [ ] Actions pinned to specific SHAs
- [ ] Secrets only used in trusted contexts
- [ ] No hardcoded credentials
- [ ] Workflow validated with `actionlint` or similar

## Common Vulnerabilities

### 1. Script Injection

**Risk**: Executing untrusted input in shell commands

❌ **VULNERABLE:**
```yaml
- name: Print PR title
  run: echo "Title: ${{ github.event.pull_request.title }}"
```

✅ **SAFE:**
```yaml
- name: Print PR title
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: echo "Title: $PR_TITLE"
```

### 2. Token Leakage

**Risk**: Accidentally exposing GITHUB_TOKEN or other secrets

✅ **SAFE:**
- Use environment variables for secrets
- Never log secrets
- Use `::add-mask::` for sensitive data

### 3. Privilege Escalation

**Risk**: Untrusted code gaining write access

✅ **SAFE:**
- Use `pull_request` not `pull_request_target`
- Explicit permissions per job
- Separate untrusted code execution from privileged operations

## Monitoring and Response

1. **Enable Dependabot Security Updates**: Automatically updates vulnerable actions
2. **Code Scanning Alerts**: Monitor for security issues
3. **Audit Logs**: Review workflow execution logs
4. **Secret Scanning**: Detect accidentally committed secrets

## Resources

- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions)
- [GITHUB_TOKEN Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

## Questions?

If you're unsure about security implications of a workflow change, please:
1. Review this document
2. Check GitHub's security guides
3. Request a security review from repository maintainers
