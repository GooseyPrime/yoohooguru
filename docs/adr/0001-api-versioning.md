# ADR-0001: API Versioning Strategy

## Status

Accepted

Date: 2025-10-17

## Context

As the yoohoo.guru platform evolves, we need to ensure that API changes don't break existing integrations. Without a versioning strategy, any breaking change would require all clients to update simultaneously, which is not practical for a production system.

The platform currently serves multiple frontend applications (Next.js apps in /apps/*) and external integrations through the backend API. We need a clear versioning strategy that:

1. Allows us to introduce breaking changes without disrupting existing clients
2. Provides a clear migration path for clients
3. Is simple to implement and maintain
4. Follows REST API best practices

## Decision

We will implement URL-based API versioning using the `/api/v1/*` pattern for all API endpoints.

Key aspects of the implementation:

1. **Versioned Routes**: All API endpoints will be available under `/api/v1/*`
2. **Backward Compatibility**: Existing `/api/*` routes will remain functional for backward compatibility
3. **Version in URL**: Version number in the URL path (e.g., `/api/v1/users`) rather than headers or query parameters
4. **Semantic Versioning**: Major version only in the URL (v1, v2, etc.)
5. **Documentation**: Each API version will have its own OpenAPI/Swagger documentation

Example:
- New versioned endpoint: `GET /api/v1/users`
- Legacy endpoint (maintained): `GET /api/users`

## Consequences

### Positive Consequences

- **No Breaking Changes**: Existing clients continue to work without modification
- **Clear Migration Path**: Clients can migrate to new versions at their own pace
- **Better Developer Experience**: Version is visible in the URL, making API calls self-documenting
- **Industry Standard**: URL-based versioning is a widely accepted REST API practice
- **Gradual Adoption**: New features can be added to new versions while maintaining old versions

### Negative Consequences

- **Code Duplication**: May need to maintain multiple versions of the same endpoint
- **Routing Complexity**: Additional routing layer to handle version-specific logic
- **Migration Effort**: Clients need to update their API calls to use `/api/v1/*` endpoints
- **Maintenance Overhead**: Need to decide when to deprecate old versions

## Implementation Notes

1. Created `/backend/src/routes/v1/index.js` as the main v1 router
2. All existing route modules are mounted under the v1 router
3. Legacy routes remain in place for backward compatibility
4. Request ID tracking middleware applies to all versions

## References

- [RESTful API Versioning Best Practices](https://restfulapi.net/versioning/)
- Implementation PR: This PR
- Related: ADR-0002 (Request ID Tracking)
