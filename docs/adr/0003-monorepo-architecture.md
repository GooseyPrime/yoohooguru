# ADR-0003: Monorepo Architecture

## Status

Accepted

Date: 2025-10-17

## Context

The yoohoo.guru platform consists of multiple subdomain applications (main, angel, coach, heroes, dashboard, etc.) that share common components, utilities, and business logic. Managing these as separate repositories would lead to:

1. Code duplication across applications
2. Difficulty maintaining shared components
3. Complex dependency management
4. Inconsistent versions of shared libraries
5. Slower development due to cross-repo coordination

## Decision

We adopt a monorepo architecture using npm workspaces and Turbo for build orchestration.

Structure:
```
yoohooguru/
├── apps/              # Next.js applications (one per subdomain)
│   ├── main/
│   ├── angel/
│   ├── coach/
│   └── ...
├── packages/          # Shared packages
│   ├── shared/        # Shared UI components
│   ├── auth/          # Authentication utilities
│   └── db/            # Database utilities
├── frontend/          # Legacy React frontend
├── backend/           # Express.js API server
└── docs/              # Documentation
```

Key aspects:
1. **npm Workspaces**: For package management and dependency resolution
2. **Turbo**: For efficient builds and caching
3. **TypeScript**: Shared tsconfig.json extended by all apps
4. **Shared Packages**: Common code in `/packages/*`
5. **Independent Deployments**: Apps can be deployed independently

## Consequences

### Positive Consequences

- **Code Reuse**: Shared components and utilities across all applications
- **Consistent Dependencies**: Single source of truth for package versions
- **Atomic Changes**: Changes to shared code can be tested across all apps simultaneously
- **Better Developer Experience**: Single checkout, one command to build/test all
- **Simplified CI/CD**: One pipeline for entire platform
- **Type Safety**: TypeScript paths work across packages

### Negative Consequences

- **Build Complexity**: Need tools like Turbo to manage builds efficiently
- **Large Repository**: Repo size increases with all applications
- **Learning Curve**: Developers need to understand monorepo patterns
- **Deployment Coordination**: Need careful deployment strategies

## Implementation Notes

- Root `package.json` defines workspaces: `apps/*`, `packages/*`, `frontend`, `backend`
- Turbo manages build orchestration with caching
- Each app has its own `tsconfig.json` extending root configuration
- Shared packages expose standardized exports

## References

- [Monorepo Best Practices](https://monorepo.tools/)
- [Turbo Documentation](https://turbo.build/repo/docs)
- Implementation: Existing structure
- Related: ADR-0001 (API Versioning)
