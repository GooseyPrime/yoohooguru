# Authentication Migration Guide

## Overview
This guide explains the changes made to the authentication and onboarding system to support dual roles (users can be both teachers and learners).

## Breaking Changes

### 1. User Profile Schema Changes

**Before:**
```javascript
{
  userType: 'skill_sharer' | 'service_poster'  // Binary choice
}
```

**After:**
```javascript
{
  wantsToTeach: boolean,  // Can teach/share skills
  wantsToLearn: boolean   // Can learn/find services
}
```

### 2. API Changes

#### POST /auth/register

**New Fields:**
- `wantsToTeach` (boolean, optional, default: false)
- `wantsToLearn` (boolean, optional, default: false)

**Deprecated Fields:**
- `userType` (still accepted for backward compatibility)

#### POST /onboarding/profile

**New Fields:**
- `wantsToTeach` (boolean, optional)
- `wantsToLearn` (boolean, optional)

**Deprecated Fields:**
- `userType` (still accepted for backward compatibility)

## Migration for Existing Users

### Automatic Migration

Existing users with `userType` field should be automatically migrated:

```javascript
// Migration logic (can be added to a one-time script)
if (user.userType === 'skill_sharer') {
  user.wantsToTeach = true;
  user.wantsToLearn = true;  // Default to both
} else if (user.userType === 'service_poster') {
  user.wantsToTeach = false;
  user.wantsToLearn = true;
}
// Keep userType for backward compatibility
```

### Manual Migration Script

Run this Firestore migration script:

```javascript
const admin = require('firebase-admin');
const db = admin.firestore();

async function migrateUserProfiles() {
  const usersSnapshot = await db.collection('users').get();
  
  const batch = db.batch();
  let count = 0;
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    
    // Skip if already migrated
    if (typeof data.wantsToTeach !== 'undefined') {
      return;
    }
    
    const updates = {};
    
    if (data.userType === 'skill_sharer') {
      updates.wantsToTeach = true;
      updates.wantsToLearn = true; // Assume both
    } else if (data.userType === 'service_poster') {
      updates.wantsToTeach = false;
      updates.wantsToLearn = true;
    } else {
      // Default for users without userType
      updates.wantsToTeach = false;
      updates.wantsToLearn = false;
    }
    
    batch.update(doc.ref, updates);
    count++;
    
    // Commit in batches of 500
    if (count % 500 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  });
  
  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`Migrated ${count} user profiles`);
}

// Run migration
migrateUserProfiles().catch(console.error);
```

## Frontend Component Changes

### SignupPage.js

**Key Changes:**
1. Replaced single `userType` state with `wantsToTeach` and `wantsToLearn` boolean states
2. Added password strength indicator
3. Updated validation to require at least one selection
4. Added social proof and benefits messaging
5. Enhanced visual feedback with checkmarks and hover effects

**Migration Steps for Custom Implementations:**
```javascript
// Old approach
const [userType, setUserType] = useState('');

// New approach
const [formData, setFormData] = useState({
  wantsToTeach: false,
  wantsToLearn: false
});
```

### OnboardingStart.js

**Key Changes:**
1. Replaced binary choice with three options (teach, learn, both)
2. Added InterestCard component
3. Highlighted "both" option as most popular

**Migration Steps:**
```javascript
// Old approach
handleUserTypeSelection('skill_sharer')

// New approach
handleUserTypeSelection(wantsToTeach, wantsToLearn)
```

## Backend Route Changes

### auth.js

**Changes:**
1. Accept `wantsToTeach` and `wantsToLearn` in registration
2. Store both fields in user profile
3. Maintain backward compatibility with `userType`

**Code Example:**
```javascript
// Extract new fields
const { wantsToTeach = false, wantsToLearn = false } = req.body;

// Add to user profile
const userProfile = {
  // ... other fields
  wantsToTeach,
  wantsToLearn
};
```

### onboarding.js

**Changes:**
1. Accept `wantsToTeach` and `wantsToLearn` in profile updates
2. Only update if values are provided
3. Remove `userType` usage in favor of new fields

## Testing Migration

### Unit Tests

Update unit tests to use new field names:

```javascript
// Before
expect(userProfile.userType).toBe('skill_sharer');

// After
expect(userProfile.wantsToTeach).toBe(true);
expect(userProfile.wantsToLearn).toBe(true);
```

### Integration Tests

Test scenarios:
1. New user signs up with both roles
2. New user signs up with only teaching
3. New user signs up with only learning
4. Existing user profile is compatible
5. API accepts both old and new field formats

## Rollback Plan

If issues arise:

1. **Database Rollback:**
   - User profiles retain `userType` for backward compatibility
   - Can revert frontend to use `userType` if needed

2. **Frontend Rollback:**
   - Restore previous SignupPage.js from git
   - Restore previous OnboardingStart.js from git

3. **Backend Rollback:**
   - Backend still accepts `userType` parameter
   - Can revert to ignoring `wantsToTeach`/`wantsToLearn`

## Monitoring

Monitor these metrics post-deployment:

1. **Signup Conversion Rate:**
   - Percentage of users completing signup
   - Expected: Should improve with clearer messaging

2. **Role Selection Distribution:**
   - % selecting teach only
   - % selecting learn only
   - % selecting both
   - Expected: "Both" should be most popular (60%+)

3. **Error Rates:**
   - Validation errors
   - API errors
   - Google OAuth failures

4. **User Feedback:**
   - Monitor support tickets
   - Watch for confusion about dual roles

## FAQ

**Q: What happens to existing users with `userType`?**
A: They continue to work normally. The system maintains backward compatibility. Run the migration script to add the new fields.

**Q: Can we remove `userType` entirely?**
A: Not yet. Keep it for at least one release cycle to ensure all integrations are updated.

**Q: What if a user selects neither role?**
A: Frontend validation prevents this. Backend should default to `wantsToLearn: true` as a fallback.

**Q: How does this affect onboarding flow?**
A: Users who select `wantsToTeach: true` go through guru onboarding. Others go straight to dashboard.

**Q: What about the Modified Masters program?**
A: The existing `modifiedMasters.wantsToTeach` and `modifiedMasters.wantsToLearn` fields are separate and used for different purposes (coaching styles vs. platform interests).

## Support

For questions or issues:
1. Check the [Testing Guide](./AUTHENTICATION_UX_TESTING.md)
2. Review commit history for implementation details
3. Contact the development team

## Timeline

- ✅ Implementation complete
- ⏳ Testing in progress
- 🔜 Staging deployment
- 🔜 Production deployment
- 🔜 User data migration
- 🔜 Monitor and iterate
