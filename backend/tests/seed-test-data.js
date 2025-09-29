const { getFirestore, getAuth } = require('../src/config/firebase');

/**
 * Seeds Firestore Emulator with test data
 * Call this in test setup when needed
 */
async function seedTestData() {
  const db = getFirestore();
  const auth = getAuth();
  
  // Create test users
  const testUsers = [
    {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'user'
    },
    {
      uid: 'test-admin-456',
      email: 'admin@example.com',
      displayName: 'Test Admin',
      role: 'admin'
    }
  ];

  // Seed users collection
  for (const user of testUsers) {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: new Date().toISOString(),
      profileComplete: true,
      verified: true
    });
  }

  // Seed angel_jobs collection
  const testJobs = [
    {
      id: 'job-test-1',
      title: 'Help with Moving',
      description: 'Need help moving furniture',
      category: 'moving',
      location: { city: 'Denver', state: 'CO' },
      hourlyRate: 25,
      estimatedHours: 4,
      skills: ['Heavy Lifting'],
      urgency: 'normal',
      featured: false,
      postedBy: 'test-user-123',
      status: 'open',
      applications: {},
      createdAt: new Date().toISOString()
    },
    {
      id: 'job-123',
      title: 'Featured Job',
      description: 'This is a featured job',
      category: 'general',
      location: { city: 'Denver', state: 'CO' },
      hourlyRate: 30,
      estimatedHours: 2,
      skills: ['General'],
      urgency: 'normal',
      featured: true,
      postedBy: 'test-admin-456',
      status: 'open',
      applications: {},
      createdAt: new Date().toISOString()
    },
    {
      id: 'job-456',
      title: 'Regular Job 1',
      description: 'This is a regular job',
      category: 'general',
      location: { city: 'Denver', state: 'CO' },
      hourlyRate: 20,
      estimatedHours: 3,
      skills: ['General'],
      urgency: 'normal',
      featured: false,
      postedBy: 'test-user-123',
      status: 'open',
      applications: {},
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 'job-789',
      title: 'Regular Job 2',
      description: 'This is another regular job',
      category: 'general',
      location: { city: 'Denver', state: 'CO' },
      hourlyRate: 22,
      estimatedHours: 5,
      skills: ['General'],
      urgency: 'normal',
      featured: false,
      postedBy: 'test-user-123',
      status: 'open',
      applications: {},
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  for (const job of testJobs) {
    await db.collection('angel_jobs').doc(job.id).set(job);
  }

  console.log('✅ Test data seeded successfully');
}

/**
 * Clears all test data from Firestore Emulator
 */
async function clearTestData() {
  const db = getFirestore();
  
  const collections = ['users', 'angel_jobs', 'activity_logs'];
  
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
  
  console.log('🧹 Test data cleared successfully');
}

module.exports = {
  seedTestData,
  clearTestData
};