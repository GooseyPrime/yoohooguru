# Security Policy

## Supported Versions

The following versions of yoohoo.guru are currently being supported with security updates:

| Version | Status | Architecture | Supported |
|---------|--------|--------------|-----------|
| 2.0.x (Turborepo) | Current | Turborepo Monorepo + Next.js 14 | :white_check_mark: |
| 1.0.x (Legacy) | Legacy | React/Webpack Single Frontend | :x: |

**Current Version**: 2.0.0 (Turborepo Monorepo Architecture)  
**Framework**: Next.js 14.2.0, Turborepo 2.5.8  
**Node Version**: 20.0.0+

## Reporting a Vulnerability

We take the security of the yoohoo.guru platform seriously. If you discover a security vulnerability, please follow these steps:

### Where to Report

- **Email**: security@yoohoo.guru
- **Subject Line**: "Security Vulnerability Report - [Brief Description]"
- **GitHub Security Advisories**: https://github.com/GooseyPrime/yoohooguru/security/advisories

### What to Include

Please include the following information in your report:

1. **Description**: Clear description of the vulnerability
2. **Impact**: Potential impact and severity
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Affected Components**: Which apps/subdomains/packages are affected
5. **Suggested Fix**: If you have a suggested fix or mitigation
6. **Contact Information**: How we can reach you for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Timeline**: Depends on severity
  - Critical: 24-72 hours
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: 4-8 weeks

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your report
2. **Investigation**: We will investigate and verify the vulnerability
3. **Fix Development**: We will develop and test a fix
4. **Deployment**: We will deploy the fix to production
5. **Disclosure**: We will coordinate public disclosure with you
6. **Credit**: We will credit you in our security advisories (if desired)

## Security Best Practices

### For Contributors

- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for all sensitive configuration
- Follow the principle of least privilege for access control
- Keep dependencies up to date
- Review code for security vulnerabilities before submitting PRs
- Use GitHub's security features (Dependabot, Code Scanning)

### For Deployment

- Use HTTPS for all subdomains
- Enable CORS protection with strict origin checking
- Implement rate limiting on all API endpoints
- Use secure session management with HttpOnly cookies
- Enable Content Security Policy (CSP) headers
- Keep all dependencies updated
- Use Firebase security rules for database access
- Rotate secrets and API keys regularly

## Security Features

### Current Implementation

- **Authentication**: Firebase Auth + NextAuth with JWT tokens
- **Cross-Subdomain Auth**: Secure cookie domain sharing (`.yoohoo.guru`)
- **CORS Protection**: Configured to allow only authorized subdomains
- **Rate Limiting**: Implemented on all API endpoints
- **Input Validation**: Comprehensive request validation with express-validator
- **Security Headers**: Helmet.js for security headers
- **CSP**: Content Security Policy configured for all apps
- **HTTPS**: Enforced on all production domains
- **Secrets Management**: Environment variables, never committed to repo

### Monorepo Security

- **Package Isolation**: Shared packages (`@yoohooguru/shared`, `@yoohooguru/auth`, `@yoohooguru/db`)
- **Dependency Management**: Centralized with npm workspaces
- **Code Sharing**: Controlled through Turborepo workspaces
- **Build Isolation**: Each app builds independently

## Known Issues and Mitigations

### None at this time

We currently have no known security vulnerabilities. This section will be updated if any are discovered.

## Security Updates

Security updates are released as needed and announced through:
- GitHub Security Advisories
- CHANGELOG.md
- Email notifications to registered users

## Contact

For security-related questions or concerns:
- **Email**: security@yoohoo.guru
- **General Support**: support@yoohoo.guru
