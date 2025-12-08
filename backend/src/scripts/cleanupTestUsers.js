/**
 * Test Users Cleanup Script
 *
 * Removes all test data created by seedTestUsers.js
 * Identifies test data by:
 * - User firstName = "Testa"
 * - Document IDs starting with "test_"
 *
 * Run: node backend/src/scripts/cleanupTestUsers.js
 */

const admin = require('firebase-admin');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    initializeApp({
      credential: applicationDefault(),
    });
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  process.exit(1);
}

const db = getFirestore();

// Collections to clean up
const COLLECTIONS_TO_CLEAN = [
  'users',
  'profiles',
  'angel_jobs',
  'skills',
  'sessions',
  'exchanges',
  'applications',
  'guru_locations',
  'angel_locations',
  'angel_profiles'
];

async function cleanupCollection(collectionName, isDryRun = false) {
  console.log(`\n   Checking ${collectionName}...`);

  const snapshot = await db.collection(collectionName).get();
  let deletedCount = 0;
  const toDelete = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const docId = doc.id;

    // Check if this is test data
    const isTestData =
      docId.startsWith('test_') ||
      data.firstName === 'Testa' ||
      data.id?.startsWith('test_') ||
      data.postedBy?.startsWith('test_') ||
      data.createdBy?.startsWith('test_') ||
      data.userId?.startsWith('test_') ||
      data.coachId?.startsWith('test_') ||
      data.teacherId?.startsWith('test_') ||
      data.learnerId?.startsWith('test_') ||
      data.applicantId?.startsWith('test_');

    if (isTestData) {
      toDelete.push({ id: docId, ref: doc.ref });
    }
  });

  if (toDelete.length === 0) {
    console.log(`      No test data found`);
    return 0;
  }

  if (isDryRun) {
    console.log(`      Would delete ${toDelete.length} documents:`);
    toDelete.slice(0, 5).forEach(doc => {
      console.log(`        - ${doc.id}`);
    });
    if (toDelete.length > 5) {
      console.log(`        ... and ${toDelete.length - 5} more`);
    }
    return toDelete.length;
  }

  // Delete in batches
  const batchSize = 100;
  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = db.batch();
    const chunk = toDelete.slice(i, i + batchSize);

    chunk.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    deletedCount += chunk.length;
    console.log(`      Deleted ${deletedCount}/${toDelete.length}...`);
  }

  console.log(`      ✓ Deleted ${deletedCount} documents`);
  return deletedCount;
}

async function cleanupTestDatabase(isDryRun = false) {
  const mode = isDryRun ? 'DRY RUN' : 'CLEANUP';
  console.log('='.repeat(60));
  console.log(`🧹 TEST DATA ${mode}`);
  console.log('='.repeat(60));

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN MODE - No data will be deleted');
    console.log('   Run without --dry-run to actually delete data\n');
  } else {
    console.log('\n⚠️  WARNING: This will permanently delete test data!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('📊 Scanning collections for test data...');

  const totalDeleted = {};
  let grandTotal = 0;

  for (const collection of COLLECTIONS_TO_CLEAN) {
    const count = await cleanupCollection(collection, isDryRun);
    totalDeleted[collection] = count;
    grandTotal += count;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`${isDryRun ? '📋' : '✅'} ${mode} SUMMARY`);
  console.log('='.repeat(60));

  console.log('\n📊 Documents ' + (isDryRun ? 'to be ' : '') + 'deleted per collection:');
  for (const [collection, count] of Object.entries(totalDeleted)) {
    if (count > 0) {
      console.log(`   ${collection}: ${count}`);
    }
  }

  console.log(`\n📈 Total: ${grandTotal} documents ${isDryRun ? 'would be ' : ''}deleted`);

  if (isDryRun) {
    console.log('\n💡 To actually delete, run:');
    console.log('   node backend/src/scripts/cleanupTestUsers.js');
  } else {
    console.log('\n🎉 Test data cleanup complete!');
  }

  return totalDeleted;
}

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || args.includes('-d');

// Run cleanup
cleanupTestDatabase(isDryRun)
  .then(() => {
    console.log('\n👋 Cleanup process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  });

module.exports = { cleanupTestDatabase };
