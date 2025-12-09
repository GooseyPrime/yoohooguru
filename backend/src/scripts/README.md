# Database Seed Scripts

This directory contains scripts for seeding and managing test data in the yoohoo.guru platform.

## Scripts

### 1. seedTestUsers.js

Creates comprehensive test data for the yoohoo.guru platform.

**What it creates:**
- **25 test users** (5 per role):
  - 5 Gurus (teachers/mentors)
  - 5 Gunus (learners)
  - 5 Guests (gig posters)
  - 5 Angels (gig workers with searchable profiles)
  - 5 Hero-Gurus (volunteer teachers for disabled gunus)

**Test data features:**
- All users named "Testa [LastName]" for easy identification
- Located within 25 miles of Johnson City, TN (37604)
- Uses REAL addresses from public buildings (Google Maps searchable)
- Complete activity data: gigs, skills, sessions, exchanges, applications
- Suitable for testing map markers, search, and all platform features

**Collections populated:**
- `users` - User profiles
- `profiles` - User profile data
- `skills` - Guru/Hero-Guru skill offerings
- `sessions` - Learning sessions
- `exchanges` - Completed skill exchanges
- `angel_jobs` - Guest-posted gigs
- `applications` - Angel applications to gigs
- `guru_locations` - Guru map markers
- `angel_locations` - Angel map markers
- `angel_profiles` - Angel searchable profiles

**Usage:**

```bash
# Local development (with Firebase emulator)
cd backend
firebase emulators:start --only firestore,auth

# In another terminal
node src/scripts/seedTestUsers.js

# Production (via Railway)
railway run node backend/src/scripts/seedTestUsers.js
```

**Output:**
The script provides detailed console output showing:
- Progress of user creation
- Summary of all created data
- Full list of test users with their addresses and details
- Ready-to-use test accounts

### 2. cleanupTestUsers.js

Removes all test data created by `seedTestUsers.js`.

**How it identifies test data:**
- User `firstName` = "Testa"
- Document IDs starting with "test_"
- Related documents (by user ID references)

**Collections cleaned:**
- `users`
- `profiles`
- `angel_jobs`
- `skills`
- `sessions`
- `exchanges`
- `applications`
- `guru_locations`
- `angel_locations`
- `angel_profiles`

**Usage:**

```bash
# Dry run (preview what will be deleted)
node src/scripts/cleanupTestUsers.js --dry-run

# Actual cleanup
node src/scripts/cleanupTestUsers.js

# Via Railway
railway run node backend/src/scripts/cleanupTestUsers.js --dry-run
railway run node backend/src/scripts/cleanupTestUsers.js
```

**Safety features:**
- Dry-run mode to preview changes
- 5-second countdown before actual deletion
- Batch processing for efficient cleanup
- Detailed progress reporting

### 3. seedFullDatabase.js

Seeds comprehensive production-ready data (separate from test users).

**Usage:**
```bash
node src/scripts/seedFullDatabase.js
```

### 4. seedCategories.js

Seeds skill categories for the platform.

**Usage:**
```bash
node src/scripts/seedCategories.js
```

## Prerequisites

### For Local Development

1. **Firebase Project Setup:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Service Account Key:**
   - Download from Firebase Console → Project Settings → Service Accounts
   - Save as `serviceAccountKey.json` in backend directory
   - Set environment variable:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
     ```

3. **Start Firebase Emulators:**
   ```bash
   firebase emulators:start --only firestore,auth
   ```

### For Production (Railway)

1. **Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   ```

2. **Environment Variables:**
   Ensure Firebase credentials are configured in Railway:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

## Test User Details

All test users created by `seedTestUsers.js`:

**Login Credentials:**
- Email: `testa.[lastname]@testmail.com`
- Password: Set during user creation (check Firebase Console)

**Roles:**
1. **Gurus** - Teachers offering skills in various categories
2. **Gunus** - Learners seeking to acquire skills
3. **Guests** - Users posting gigs and small jobs
4. **Angels** - Gig workers with searchable profiles
5. **Hero-Gurus** - Volunteer teachers for disabled users

**Locations:**
All users have addresses at real public buildings in the Johnson City, TN area:
- East Tennessee State University
- Johnson City Medical Center
- Science Hill High School
- Bristol Motor Speedway
- Jonesborough Town Hall
- And 20 more real locations

## Troubleshooting

### "Firebase initialization failed"
- Verify `GOOGLE_APPLICATION_CREDENTIALS` is set
- Check service account key is valid
- Ensure Firebase project exists

### "Permission denied"
- Verify Firestore security rules allow admin access
- Check service account has necessary permissions

### "Module not found"
- Run `npm install` in backend directory
- Verify all dependencies are installed

### Scripts not deployed to Railway
- See [PR #560 Deployment Fix](/docs/PR_560_DEPLOYMENT_FIX.md)
- Run `railway up` to trigger manual deployment
- Verify files exist: `railway shell` then `ls -la backend/src/scripts/`

## Best Practices

1. **Always use dry-run first** when cleaning up data
2. **Seed to emulator** before production to test changes
3. **Document any custom modifications** to seed data
4. **Use test prefix** ("test_" or "Testa") for easy cleanup
5. **Verify cleanup** by checking Firebase Console

## Related Documentation

- [PR #560 Deployment Fix](/docs/PR_560_DEPLOYMENT_FIX.md) - Troubleshooting deployment issues
- [Railway Deployment Guide](/docs/RAILWAY_DEPLOYMENT.md) - Railway deployment instructions
- [Environment Configuration](/docs/ENVIRONMENT_CONFIGURATION_GUIDE.md) - Environment setup

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review related documentation
3. Check Railway logs: `railway logs --tail`
4. Verify Firebase Console for data state
