/**
 * Statistically-derived Test Database Seeder
 * 
 * This script creates a comprehensive set of test data based on statistical
 * distribution patterns typical of skill-sharing platforms. Data includes:
 * - User profiles with realistic distribution of skills and experience levels
 * - Job postings across different categories and price ranges
 * - Application patterns that simulate real user behavior
 * - Geographic distribution representative of the platform's target markets
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

// Statistical data for realistic seeding
const SKILL_CATEGORIES = [
  'Technology', 'Creative Arts', 'Fitness & Wellness', 'Language Learning',
  'Music & Performance', 'Cooking & Nutrition', 'Home & Garden', 'Business & Finance',
  'Education & Tutoring', 'Health & Medical', 'Crafts & DIY', 'Sports & Recreation'
];

const COMMON_SKILLS = [
  'JavaScript Programming', 'Python Development', 'Graphic Design', 'Photography',
  'Yoga Instruction', 'Personal Training', 'Spanish Tutoring', 'Guitar Lessons',
  'Cooking Classes', 'Gardening', 'Writing & Editing', 'Marketing Strategy',
  'Financial Planning', 'Math Tutoring', 'Life Coaching', 'Web Design',
  'Video Production', 'Interior Design', 'Carpentry', 'Plumbing Basics'
];

const LOCATIONS = [
  { city: "Johnson City", state: "TN", population: 66934 },
  { city: "Bristol", state: "TN", population: 26702 },
  { city: "Kingsport", state: "TN", population: 55442 },
  { city: "Nashville", state: "TN", population: 694144 },
  { city: "Knoxville", state: "TN", population: 190740 },
  { city: "Asheville", state: "NC", population: 94589 },
  { city: "Charlotte", state: "NC", population: 885708 },
  { city: "Atlanta", state: "GA", population: 498715 }
];

const USER_TIERS = [
  { name: 'Stone Dropper', probability: 0.40 },
  { name: 'Pebble Pusher', probability: 0.30 },
  { name: 'Rock Roller', probability: 0.20 },
  { name: 'Boulder Mover', probability: 0.08 },
  { name: 'Mountain Shifter', probability: 0.02 }
];

// Helper functions for statistical distribution
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomSkills = (count = 3) => {
  const shuffled = [...COMMON_SKILLS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getWeightedTier = () => {
  const rand = Math.random();
  let cumulative = 0;
  for (const tier of USER_TIERS) {
    cumulative += tier.probability;
    if (rand <= cumulative) return tier.name;
  }
  return 'Stone Dropper';
};

const generatePriceRange = (category) => {
  const basePrices = {
    'Technology': { min: 40, max: 120 },
    'Creative Arts': { min: 25, max: 80 },
    'Fitness & Wellness': { min: 30, max: 90 },
    'Language Learning': { min: 20, max: 60 },
    'Music & Performance': { min: 35, max: 100 },
    'Cooking & Nutrition': { min: 25, max: 70 },
    'Home & Garden': { min: 30, max: 85 },
    'Business & Finance': { min: 50, max: 150 },
    'Education & Tutoring': { min: 20, max: 65 },
    'Health & Medical': { min: 45, max: 130 },
    'Crafts & DIY': { min: 20, max: 60 },
    'Sports & Recreation': { min: 25, max: 75 }
  };
  
  const range = basePrices[category] || { min: 25, max: 75 };
  return Math.floor(Math.random() * (range.max - range.min) + range.min);
};

async function seed() {
  console.log("🚀 Seeding Firebase test database with statistically-derived data...");
  console.log("📊 Generating realistic user distributions and behavior patterns...");

  const now = new Date();
  
  // Generate 25 test users with realistic distribution
  const users = [];
  const userNames = [
    "Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Martinez", "Ethan Brown",
    "Fiona Wilson", "Gabriel Lee", "Hannah Taylor", "Ian Rodriguez", "Julia Chen",
    "Kevin O'Connor", "Luna Patel", "Marcus Thompson", "Nina Gonzalez", "Oliver Kim",
    "Priya Singh", "Quinn Anderson", "Rosa Hernandez", "Samuel White", "Tara Lewis",
    "Uma Reddy", "Victor Cruz", "Wendy Clark", "Xavier James", "Yuki Tanaka"
  ];

  for (let i = 0; i < 25; i++) {
    const location = getRandomElement(LOCATIONS);
    const tier = getWeightedTier();
    const exchangesCompleted = tier === 'Stone Dropper' ? Math.floor(Math.random() * 3) :
                             tier === 'Pebble Pusher' ? Math.floor(Math.random() * 10) + 3 :
                             tier === 'Rock Roller' ? Math.floor(Math.random() * 25) + 10 :
                             tier === 'Boulder Mover' ? Math.floor(Math.random() * 75) + 25 :
                             Math.floor(Math.random() * 200) + 75;

    const user = {
      id: `test-user-${i + 1}`,
      email: `testuser${i + 1}@example.com`,
      displayName: userNames[i],
      tier: tier,
      exchangesCompleted: exchangesCompleted,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0 rating
      totalHoursTaught: exchangesCompleted * (Math.random() * 3 + 1), // 1-4 hours per exchange
      location: `${location.city}, ${location.state}`,
      skillsOffered: getRandomSkills(Math.floor(Math.random() * 4) + 1),
      skillsWanted: getRandomSkills(Math.floor(Math.random() * 3) + 1),
      availability: ['weekends', 'evenings'].filter(() => Math.random() > 0.3),
      purposeStory: `Passionate about learning and sharing skills in the ${location.city} community.`,
      joinDate: new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: Math.random() > 0.1, // 90% active users
      lastLoginAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      accessibility: {
        mobility: [],
        vision: [],
        hearing: [],
        neurodiversity: [],
        communicationPrefs: [],
        assistiveTech: []
      },
      modifiedMasters: {
        wantsToTeach: Math.random() > 0.6, // 40% want to teach
        wantsToLearn: Math.random() > 0.3, // 70% want to learn
        tags: getRandomSkills(2),
        visible: Math.random() > 0.2, // 80% visible
        coachingStyles: []
      },
      liability: {
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        lastWaiverAccepted: null,
        lastWaiverId: null,
        totalWaivers: 0
      }
    };
    
    users.push(user);
  }

  // Save users to both Users and profiles collections for compatibility
  console.log("👥 Creating user profiles...");
  for (const user of users) {
    await db.collection("Users").doc(user.id).set(user, { merge: true });
    await db.collection("profiles").doc(user.id).set(user, { merge: true });
  }

  // Generate 50 jobs with realistic distribution
  console.log("💼 Creating job postings...");
  const jobs = [];
  for (let i = 0; i < 50; i++) {
    const category = getRandomElement(SKILL_CATEGORIES);
    const poster = getRandomElement(users);
    const location = getRandomElement(LOCATIONS);
    const isRecent = Math.random() > 0.3; // 70% of jobs are recent
    
    const ageInDays = isRecent ? 
      Math.floor(Math.random() * 7) : // Recent: 0-7 days old
      Math.floor(Math.random() * 60) + 7; // Older: 7-67 days old

    const job = {
      id: `job-${i + 1}`,
      title: `${getRandomElement(COMMON_SKILLS)} - ${category}`,
      description: `Looking for help with ${getRandomElement(COMMON_SKILLS).toLowerCase()}. ${Math.random() > 0.5 ? 'Flexible schedule available.' : 'Specific time requirements.'}`,
      posterId: poster.id,
      postedBy: poster.id,
      category: category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
      location: { 
        city: location.city, 
        state: location.state,
        full: `${location.city}, ${location.state}`
      },
      skills: [getRandomElement(COMMON_SKILLS)],
      hourlyRate: generatePriceRange(category),
      estimatedHours: Math.floor(Math.random() * 8) + 1, // 1-8 hours
      urgency: getRandomElement(['low', 'normal', 'high']),
      status: Math.random() > 0.15 ? 'open' : 'closed', // 85% open
      featured: Math.random() > 0.8, // 20% featured
      isFeatured: Math.random() > 0.8,
      createdAt: new Date(now.getTime() - ageInDays * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - ageInDays * 24 * 60 * 60 * 1000),
      tags: [category.toLowerCase(), getRandomElement(COMMON_SKILLS).toLowerCase().replace(/ /g, '-')],
      applicationCount: 0, // Will be updated based on applications
      applications: {}
    };
    
    jobs.push(job);
  }

  // Save jobs
  for (const job of jobs) {
    await db.collection("Jobs").doc(job.id).set(job, { merge: true });
  }

  // Generate realistic application patterns
  console.log("📋 Creating job applications...");
  const applications = [];
  let appCounter = 1;

  for (const job of jobs) {
    if (job.status === 'closed') continue;
    
    // Number of applications based on job age and features
    const maxApps = job.featured ? 8 : 4;
    const numApps = Math.floor(Math.random() * maxApps);
    
    const applicants = users
      .filter(u => u.id !== job.posterId && u.isActive)
      .sort(() => 0.5 - Math.random())
      .slice(0, numApps);

    for (const applicant of applicants) {
      const application = {
        id: `app-${appCounter++}`,
        jobId: job.id,
        userId: applicant.id,
        applicantId: applicant.id,
        message: `I'm interested in this ${job.category} opportunity. I have experience with ${getRandomElement(applicant.skillsOffered)}.`,
        status: getRandomElement(['pending', 'reviewed', 'accepted', 'rejected']),
        appliedAt: new Date(job.createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
        timestamp: new Date(job.createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000)
      };
      
      applications.push(application);
    }

    // Update job with application count
    job.applicationCount = applicants.length;
    await db.collection("Jobs").doc(job.id).update({ 
      applicationCount: applicants.length,
      applications: applicants.reduce((acc, app) => {
        acc[app.id] = true;
        return acc;
      }, {})
    });
  }

  // Save applications
  for (const app of applications) {
    await db.collection("Applications").doc(app.id).set(app, { merge: true });
  }

  // Generate some skill exchanges (completed transactions)
  console.log("🤝 Creating skill exchange records...");
  const exchanges = [];
  for (let i = 0; i < 30; i++) {
    const teacher = getRandomElement(users.filter(u => u.exchangesCompleted > 0));
    const student = getRandomElement(users.filter(u => u.id !== teacher.id));
    const skill = getRandomElement(teacher.skillsOffered);
    
    const exchange = {
      id: `exchange-${i + 1}`,
      teacherId: teacher.id,
      studentId: student.id,
      skill: skill,
      hourlyRate: generatePriceRange(getRandomElement(SKILL_CATEGORIES)),
      hoursCompleted: Math.floor(Math.random() * 4) + 1,
      status: 'completed',
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      feedback: `Great session learning ${skill}. Highly recommend!`,
      completedAt: new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    exchanges.push(exchange);
  }

  for (const exchange of exchanges) {
    await db.collection("SkillExchanges").doc(exchange.id).set(exchange, { merge: true });
  }

  console.log("✅ Database seeding complete!");
  console.log(`📊 Seeded statistics:`);
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   💼 Jobs: ${jobs.length} (${jobs.filter(j => j.status === 'open').length} open)`);
  console.log(`   📋 Applications: ${applications.length}`);
  console.log(`   🤝 Skill Exchanges: ${exchanges.length}`);
  console.log(`   🏆 Tier Distribution:`);
  
  const tierCounts = users.reduce((acc, user) => {
    acc[user.tier] = (acc[user.tier] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`      ${tier}: ${count} users`);
  });
  
  console.log("\n🎯 Database is ready for comprehensive testing!");
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});