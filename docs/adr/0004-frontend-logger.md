# ADR-0004: Frontend Logger Utility

## Status

Accepted

Date: 2025-10-17

## Context

The frontend codebase was using `console.log`, `console.error`, and `console.warn` directly throughout components and utilities. This approach has several limitations:

1. **No Structured Logging**: Console statements lack context and structure
2. **Production Noise**: Debug logs appear in production console
3. **No Log Levels**: Can't easily filter or disable certain log types
4. **No Timestamps**: Difficult to correlate events temporally
5. **Inconsistent Format**: Each developer logs differently
6. **No Context**: Hard to track which component/feature generated the log

## Decision

We implement a centralized logger utility for the frontend that provides structured logging with consistent formatting.

Key features:
1. **Log Levels**: debug, info, warn, error
2. **Structured Format**: Timestamp, level, message, context
3. **Environment Aware**: Debug logs only in development
4. **Consistent Interface**: Similar to backend logger (winston)
5. **Extensible**: Can add remote logging later

Interface:
```javascript
import logger from './utils/logger';

logger.debug('Debug message', { context });
logger.info('Info message', { context });
logger.warn('Warning message', { context });
logger.error('Error message', error);
```

Format:
```
[YoohooGuru] [2025-10-17T01:18:00.000Z] [INFO] Message {"context":"data"}
```

## Consequences

### Positive Consequences

- **Structured Logs**: All logs follow consistent format
- **Better Debugging**: Timestamps and context make debugging easier
- **Production Ready**: Can control log levels per environment
- **Type Safety**: JSDoc provides autocomplete and type checking
- **Future Proof**: Foundation for remote logging (Sentry, LogRocket, etc.)
- **Consistency**: Same logging patterns across frontend and backend
- **Context Tracking**: Can include request IDs, user IDs, etc.

### Negative Consequences

- **Migration Effort**: Need to replace all console.* calls
- **Bundle Size**: Minimal increase (~2KB)
- **Learning Curve**: Team needs to adopt new patterns

## Implementation Notes

1. Created `/frontend/src/utils/logger.js` with standardized interface
2. Replaced console calls in:
   - `/frontend/src/utils/http.js`
   - All major components (VideoChat, AccessibilityToolbar, etc.)
3. Logger automatically includes timestamps
4. Debug logs disabled in production
5. Error logging includes stack traces

## Migration Status

- ✅ Core utilities
- ✅ Major components
- ⏳ Apps (Next.js applications)
- ⏳ Shared packages

## References

- [Frontend Logging Best Practices](https://betterstack.com/community/guides/logging/javascript/)
- Implementation PR: This PR
- Backend Logger: `/backend/src/utils/logger.js`
- Related: ADR-0002 (Request ID Tracking)
