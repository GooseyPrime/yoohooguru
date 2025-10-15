# Session Store Production Fix

## Problem
Railway build logs showed a warning:
```
Warning: connect.session() MemoryStore is not designed for a production environment, 
as it will leak memory, and will not scale past a single process.
```

## Solution
Implemented environment-aware session storage:

### Production/Staging
- Uses `firestore-store` package to store sessions in Firestore
- Prevents memory leaks
- Supports horizontal scaling (multiple server instances)
- Sessions stored in `sessions` collection in Firestore
- Automatically handles session cleanup and expiration

### Development/Test
- Continues using MemoryStore (default)
- No additional setup required
- Simplified local development

## Implementation

### Code Changes
**File:** `backend/src/index.js`
- Added conditional session store configuration
- Imports `getFirestore` from Firebase config
- Creates `FirestoreStore` instance in production/staging
- Logs which store is being used for transparency

### Dependencies
**Added:** `firestore-store@2.0.2`
- Lightweight session store for Firestore
- Compatible with `express-session`
- Works with existing Firebase Admin SDK integration

### Testing
**New Test File:** `backend/tests/session-store.test.js`
- 10 comprehensive tests covering all scenarios
- Validates MemoryStore in dev/test
- Validates FirestoreStore in production/staging
- Tests all session store methods (get, set, destroy, all, length)

### Documentation Updates
1. **`.env.example`** - Added note about automatic session storage
2. **`docs/ENVIRONMENT_VARIABLES.md`** - Documented session store behavior

## Benefits

1. ✅ **No Memory Leaks** - Firestore handles session persistence
2. ✅ **Horizontal Scaling** - Multiple Railway instances can share sessions
3. ✅ **Minimal Infrastructure** - Uses existing Firestore (no Redis needed)
4. ✅ **Zero Configuration** - Automatically selects correct store based on NODE_ENV
5. ✅ **Backward Compatible** - No breaking changes to existing code
6. ✅ **Well Tested** - All 17 session tests pass

## Railway Deployment

No additional configuration needed! The fix automatically activates when:
- `NODE_ENV=production` or `NODE_ENV=staging`
- Firebase credentials are properly configured
- `SESSION_SECRET` environment variable is set

The warning will no longer appear in Railway build logs.

## Firestore Collection

Sessions are stored in a dedicated collection:
```
/sessions
  /{session-id}
    session: {stringified session data}
    (automatically managed by firestore-store)
```

Sessions automatically expire based on the `maxAge` configured in the session cookie (24 hours by default).

## Local Development

No changes required! Local development continues to use MemoryStore as before.

## Rollback Plan

If needed, revert by:
1. Remove `firestore-store` from `package.json`
2. Revert `backend/src/index.js` to use plain `session()` configuration
3. Redeploy

However, this is not recommended as it reintroduces the memory leak warning.
