/**
 * Test Database Cleanup Script
 * 
 * This script removes all test data created by the seed script.
 * It safely identifies and removes test records while preserving
 * any production data that might exist in the same database.
 */

const admin = require("firebase-admin");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    initializeApp({
      credential: applicationDefault(),
    });
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  process.exit(1);
}

const db = getFirestore();

/**
 * Delete documents in batches to avoid overwhelming Firebase
 * @param {Array} docs - Array of document references
 * @param {string} collectionName - Name of the collection being cleaned
 */
async function batchDelete(docs, collectionName) {
  const batchSize = 500; // Firebase batch write limit
  
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    const batchDocs = docs.slice(i, i + batchSize);
    
    batchDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`   Deleted ${batchDocs.length} documents from ${collectionName}`);
  }
}

/**
 * Clean up test users and profiles
 */
async function cleanupUsers() {
  console.log("🧹 Cleaning up test users...");
  
  // Clean Users collection
  const usersSnapshot = await db.collection("Users")
    .where("email", ">=", "testuser")
    .where("email", "<", "testuser\uf8ff")
    .get();
  
  if (!usersSnapshot.empty) {
    await batchDelete(usersSnapshot.docs, "Users");
  }
  
  // Clean profiles collection (for compatibility)
  const profilesSnapshot = await db.collection("profiles")
    .where("email", ">=", "testuser")
    .where("email", "<", "testuser\uf8ff")
    .get();
  
  if (!profilesSnapshot.empty) {
    await batchDelete(profilesSnapshot.docs, "profiles");
  }
  
  // Clean users with test- IDs
  const testUserIds = [];
  for (let i = 1; i <= 100; i++) { // Check up to 100 test users
    testUserIds.push(`test-user-${i}`);
  }
  
  for (const userId of testUserIds) {
    try {
      const userDoc = await db.collection("Users").doc(userId).get();
      if (userDoc.exists) {
        await userDoc.ref.delete();
      }
      
      const profileDoc = await db.collection("profiles").doc(userId).get();
      if (profileDoc.exists) {
        await profileDoc.ref.delete();
      }
    } catch (error) {
      // Continue if document doesn't exist
    }
  }
  
  console.log("✅ User cleanup complete");
}

/**
 * Clean up test jobs
 */
async function cleanupJobs() {
  console.log("🧹 Cleaning up test jobs...");
  
  // Clean jobs with test poster IDs
  const jobsSnapshot = await db.collection("Jobs").get();
  const testJobs = jobsSnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.posterId?.startsWith('test-user-') || 
           data.postedBy?.startsWith('test-user-') ||
           doc.id.startsWith('job-');
  });
  
  if (testJobs.length > 0) {
    await batchDelete(testJobs, "Jobs");
  }
  
  console.log("✅ Jobs cleanup complete");
}

/**
 * Clean up test applications
 */
async function cleanupApplications() {
  console.log("🧹 Cleaning up test applications...");
  
  const applicationsSnapshot = await db.collection("Applications").get();
  const testApplications = applicationsSnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.userId?.startsWith('test-user-') || 
           data.applicantId?.startsWith('test-user-') ||
           data.jobId?.startsWith('job-') ||
           doc.id.startsWith('app-');
  });
  
  if (testApplications.length > 0) {
    await batchDelete(testApplications, "Applications");
  }
  
  console.log("✅ Applications cleanup complete");
}

/**
 * Clean up test skill exchanges
 */
async function cleanupSkillExchanges() {
  console.log("🧹 Cleaning up test skill exchanges...");
  
  const exchangesSnapshot = await db.collection("SkillExchanges").get();
  const testExchanges = exchangesSnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.teacherId?.startsWith('test-user-') || 
           data.studentId?.startsWith('test-user-') ||
           doc.id.startsWith('exchange-');
  });
  
  if (testExchanges.length > 0) {
    await batchDelete(testExchanges, "SkillExchanges");
  }
  
  console.log("✅ Skill exchanges cleanup complete");
}

/**
 * Clean up any additional test collections
 */
async function cleanupAdditionalCollections() {
  console.log("🧹 Cleaning up additional test data...");
  
  // Define additional collections that might contain test data
  const additionalCollections = [
    "TestData", 
    "UserProfiles", 
    "JobApplications",
    "Messages",
    "Reviews",
    "Notifications"
  ];
  
  for (const collectionName of additionalCollections) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const testDocs = snapshot.docs.filter(doc => {
        const data = doc.data();
        const docId = doc.id;
        
        // Check if document contains test user references or test IDs
        return docId.startsWith('test-') ||
               JSON.stringify(data).includes('test-user-') ||
               JSON.stringify(data).includes('testuser@example.com');
      });
      
      if (testDocs.length > 0) {
        await batchDelete(testDocs, collectionName);
      }
    } catch (error) {
      // Collection might not exist, continue
      console.log(`   Collection ${collectionName} not found or inaccessible`);
    }
  }
  
  console.log("✅ Additional collections cleanup complete");
}

/**
 * Clean up Firebase Auth test users
 */
async function cleanupAuthUsers() {
  console.log("🧹 Cleaning up Firebase Auth test users...");
  
  try {
    // List users and delete test users
    const listUsersResult = await admin.auth().listUsers();
    const testAuthUsers = listUsersResult.users.filter(user => 
      user.email?.includes('testuser@example.com') ||
      user.email?.startsWith('test') ||
      user.displayName?.includes('Test User')
    );
    
    for (const user of testAuthUsers) {
      try {
        await admin.auth().deleteUser(user.uid);
        console.log(`   Deleted auth user: ${user.email}`);
      } catch (error) {
        console.log(`   Could not delete auth user ${user.email}:`, error.message);
      }
    }
    
    console.log("✅ Auth users cleanup complete");
  } catch (error) {
    console.log("⚠️  Could not clean up auth users:", error.message);
  }
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log("🧹 Starting comprehensive test database cleanup...");
  console.log("⚠️  This will remove all test data from the database");
  
  const startTime = Date.now();
  
  try {
    // Run cleanup operations
    await cleanupUsers();
    await cleanupJobs();
    await cleanupApplications();
    await cleanupSkillExchanges();
    await cleanupAdditionalCollections();
    await cleanupAuthUsers();
    
    const duration = (Date.now() - startTime) / 1000;
    
    console.log("\n✅ Cleanup completed successfully!");
    console.log(`⏱️  Total cleanup time: ${duration.toFixed(2)} seconds`);
    console.log("🎯 Database is now clean and ready for fresh test data");
    
  } catch (error) {
    console.error("\n❌ Cleanup failed:", error);
    process.exit(1);
  }
}

// Allow script to be run directly or imported as a module
if (require.main === module) {
  cleanup().catch(error => {
    console.error("❌ Cleanup script failed:", error);
    process.exit(1);
  });
}

module.exports = { cleanup };