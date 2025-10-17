# ADR-0002: Request ID Tracking

## Status

Accepted

Date: 2025-10-17

## Context

In a distributed system with multiple services and microservices, debugging issues becomes challenging without a way to trace requests across the entire system. When a user reports an issue, we need to:

1. Correlate logs across different parts of the system
2. Trace requests from frontend to backend
3. Debug issues in production without access to detailed client information
4. Monitor performance and identify bottlenecks

Currently, our logging doesn't provide a way to trace individual requests through the system, making it difficult to diagnose production issues.

## Decision

We will implement request ID tracking using the `X-Request-ID` header throughout the system.

Key aspects:

1. **Middleware Implementation**: A dedicated middleware (`requestIdMiddleware`) will handle request ID generation and propagation
2. **UUID v4 Format**: Request IDs will use UUID v4 for uniqueness
3. **Header-Based**: Request ID will be transmitted via `X-Request-ID` header
4. **Bidirectional**: Both incoming requests and outgoing responses will include the header
5. **Logging Integration**: All logs will include the request ID for correlation
6. **Client Propagation**: Frontend can pass existing request IDs or backend generates new ones

Implementation details:
- Check for existing `X-Request-ID` header in incoming requests
- Generate new UUID if not present
- Attach request ID to `req.requestId` for use in route handlers
- Set `X-Request-ID` header in response
- Log request start and completion with request ID

## Consequences

### Positive Consequences

- **Improved Debugging**: Easy to trace requests through logs using request ID
- **Better Observability**: Can track request lifecycle and performance
- **Production Support**: Can quickly find all logs related to a specific request
- **Distributed Tracing**: Foundation for implementing distributed tracing tools
- **Client Integration**: Frontend applications can track their requests end-to-end
- **Audit Trail**: Request IDs can be used for audit and compliance purposes

### Negative Consequences

- **Minimal Performance Overhead**: Small overhead for UUID generation (negligible)
- **Storage Impact**: Additional field in logs increases storage requirements slightly
- **Migration Required**: Existing log analysis tools may need updates

## Implementation Notes

1. Created `/backend/src/middleware/requestId.js` middleware
2. Integrated into backend before route handlers in `index.js`
3. All log statements include request ID context
4. Response headers automatically include `X-Request-ID`
5. Compatible with industry-standard tracing tools (OpenTelemetry, Jaeger, etc.)

## References

- [Google Cloud Request ID Best Practices](https://cloud.google.com/trace/docs/trace-context)
- [AWS X-Ray Trace ID](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html#xray-concepts-tracingheader)
- Implementation PR: This PR
- Related: ADR-0001 (API Versioning)
