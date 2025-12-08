/**
 * Test Users Database Seeder
 *
 * Creates comprehensive test data with:
 * - 5 users per role (guru, gunu, guest, angel, hero-guru) = 25 users total
 * - All users named "Testa [LastName]" for easy identification and cleanup
 * - All users located within 25 miles of Johnson City, TN (37604)
 * - Uses REAL addresses (public buildings/businesses) searchable on Google Maps
 * - Complete activity including gigs, skills, sessions, exchanges
 * - Data suitable for map markers and search functionality
 *
 * ROLES:
 * - guru: Teacher/mentor who teaches skills
 * - gunu: Learner seeking to acquire skills
 * - guest: Gig/small job poster
 * - angel: Applies to gigs/jobs, can create searchable profile to advertise services
 * - hero-guru: Guru donating time to teach a disabled gunu
 *
 * Run: node backend/src/scripts/seedTestUsers.js
 */

const admin = require('firebase-admin');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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

// ============================================================================
// REAL ADDRESSES - Public buildings & businesses within 25 miles of Johnson City, TN
// All addresses are Google Maps searchable
// ============================================================================
const ADDRESSES = [
  // Johnson City proper
  {
    street: '1276 Gilbreath Dr',
    city: 'Johnson City',
    state: 'TN',
    zip: '37614',
    landmark: 'East Tennessee State University'
  },
  {
    street: '400 N State of Franklin Rd',
    city: 'Johnson City',
    state: 'TN',
    zip: '37604',
    landmark: 'Johnson City Medical Center'
  },
  {
    street: '2011 N Roan St',
    city: 'Johnson City',
    state: 'TN',
    zip: '37601',
    landmark: 'The Mall at Johnson City'
  },
  {
    street: '100 W Millard St',
    city: 'Johnson City',
    state: 'TN',
    zip: '37604',
    landmark: 'Johnson City Public Library'
  },
  {
    street: '1509 John Exum Pkwy',
    city: 'Johnson City',
    state: 'TN',
    zip: '37604',
    landmark: 'Science Hill High School'
  },
  {
    street: '1320 E Main St',
    city: 'Johnson City',
    state: 'TN',
    zip: '37601',
    landmark: 'Freedom Hall Civic Center'
  },
  {
    street: '510 Bert St',
    city: 'Johnson City',
    state: 'TN',
    zip: '37601',
    landmark: 'Founders Park'
  },
  {
    street: '2620 S Roan St',
    city: 'Johnson City',
    state: 'TN',
    zip: '37601',
    landmark: 'Tipton-Haynes State Historic Site'
  },

  // Gray (near Johnson City)
  {
    street: '1212 Suncrest Dr',
    city: 'Gray',
    state: 'TN',
    zip: '37615',
    landmark: 'Gray Fossil Site'
  },

  // Kingsport
  {
    street: '225 W Center St',
    city: 'Kingsport',
    state: 'TN',
    zip: '37660',
    landmark: 'Kingsport City Hall'
  },
  {
    street: '400 Broad St',
    city: 'Kingsport',
    state: 'TN',
    zip: '37660',
    landmark: 'Kingsport Public Library'
  },
  {
    street: '1901 Meadowview Pkwy',
    city: 'Kingsport',
    state: 'TN',
    zip: '37660',
    landmark: 'MeadowView Conference Resort'
  },

  // Bristol
  {
    street: '151 Speedway Blvd',
    city: 'Bristol',
    state: 'TN',
    zip: '37620',
    landmark: 'Bristol Motor Speedway'
  },
  {
    street: '101 Country Music Way',
    city: 'Bristol',
    state: 'VA',
    zip: '24201',
    landmark: 'Birthplace of Country Music Museum'
  },
  {
    street: '701 Goode St',
    city: 'Bristol',
    state: 'VA',
    zip: '24201',
    landmark: 'Bristol Public Library'
  },

  // Jonesborough (oldest town in Tennessee)
  {
    street: '123 Boone St',
    city: 'Jonesborough',
    state: 'TN',
    zip: '37659',
    landmark: 'Jonesborough Town Hall'
  },
  {
    street: '116 W Main St',
    city: 'Jonesborough',
    state: 'TN',
    zip: '37659',
    landmark: 'Chester Inn Museum'
  },

  // Elizabethton
  {
    street: '801 E Elk Ave',
    city: 'Elizabethton',
    state: 'TN',
    zip: '37643',
    landmark: 'Carter County Courthouse'
  },
  {
    street: '1651 W Elk Ave',
    city: 'Elizabethton',
    state: 'TN',
    zip: '37643',
    landmark: 'Sycamore Shoals State Historic Park'
  },
  {
    street: '907 Jason Witten Way',
    city: 'Elizabethton',
    state: 'TN',
    zip: '37643',
    landmark: 'Elizabethton High School'
  },

  // Erwin
  {
    street: '100 Main Ave',
    city: 'Erwin',
    state: 'TN',
    zip: '37650',
    landmark: 'Unicoi County Courthouse'
  },
  {
    street: '520 Federal Hatchery Rd',
    city: 'Erwin',
    state: 'TN',
    zip: '37650',
    landmark: 'Erwin National Fish Hatchery'
  },

  // Bluff City
  {
    street: '567 Main St',
    city: 'Bluff City',
    state: 'TN',
    zip: '37618',
    landmark: 'Bluff City Town Hall'
  },

  // Roan Mountain
  {
    street: '1015 Hwy 143',
    city: 'Roan Mountain',
    state: 'TN',
    zip: '37687',
    landmark: 'Roan Mountain State Park'
  },

  // Greeneville
  {
    street: '101 N Main St',
    city: 'Greeneville',
    state: 'TN',
    zip: '37743',
    landmark: 'Greene County Courthouse'
  }
];

// ============================================================================
// SKILL CATEGORIES AND SKILLS
// ============================================================================
const SKILL_CATEGORIES = {
  'Technology': [
    'JavaScript Programming', 'Python Development', 'Web Development', 'Mobile App Development',
    'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'IT Support', 'Database Management'
  ],
  'Creative Arts': [
    'Graphic Design', 'Photography', 'Video Editing', 'Illustration',
    'UI/UX Design', 'Animation', '3D Modeling', 'Digital Art', 'Logo Design', 'Brand Identity'
  ],
  'Fitness & Wellness': [
    'Personal Training', 'Yoga Instruction', 'Nutrition Coaching', 'Weight Training',
    'CrossFit', 'Pilates', 'Meditation', 'Sports Coaching', 'Running Coach', 'Swimming Lessons'
  ],
  'Music & Performance': [
    'Guitar Lessons', 'Piano Instruction', 'Vocal Training', 'Music Theory',
    'Drum Lessons', 'Music Production', 'DJ Skills', 'Songwriting', 'Violin Lessons', 'Bass Guitar'
  ],
  'Languages': [
    'Spanish Tutoring', 'French Lessons', 'German Teaching', 'Japanese Language',
    'Mandarin Chinese', 'Sign Language', 'ESL Teaching', 'Translation Services', 'Italian Lessons', 'Portuguese'
  ],
  'Business & Finance': [
    'Financial Planning', 'Business Strategy', 'Marketing Strategy', 'Accounting',
    'Investment Advice', 'Entrepreneurship', 'Project Management', 'Sales Training', 'Tax Preparation', 'Bookkeeping'
  ],
  'Home & Garden': [
    'Gardening', 'Home Repair', 'Interior Design', 'Landscaping',
    'Carpentry', 'Plumbing Basics', 'Electrical Basics', 'Home Organization', 'Painting', 'Furniture Repair'
  ],
  'Education & Tutoring': [
    'Math Tutoring', 'Science Tutoring', 'Writing Coaching', 'Test Prep',
    'College Admissions', 'Study Skills', 'Homework Help', 'Reading Instruction', 'History Tutoring', 'Chemistry Help'
  ],
  'Trades & Services': [
    'Auto Repair', 'HVAC Basics', 'Welding', 'House Cleaning',
    'Pet Care', 'Lawn Care', 'Moving Help', 'Assembly Services', 'Delivery Services', 'Handyman Services'
  ],
  'Personal Services': [
    'Hair Styling', 'Makeup Artistry', 'Event Planning', 'Photography Services',
    'Personal Shopping', 'Life Coaching', 'Career Counseling', 'Resume Writing', 'Interview Prep', 'Organization'
  ]
};

const USER_TIERS = ['Stone Dropper', 'Pebble Pusher', 'Rock Roller', 'Boulder Mover', 'Mountain Shifter'];
const AVAILABILITIES = ['weekday_mornings', 'weekday_afternoons', 'weekday_evenings', 'weekend_mornings', 'weekend_afternoons', 'flexible'];
const COACHING_STYLES = ['structured-curriculum', 'hands-on', 'visual-demos', 'verbal-explainer', 'step-by-step', 'project-based', 'q-and-a', 'peer-mentoring', 'slow-pace', 'fast-iteration'];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

function generatePhoneNumber() {
  const areaCode = getRandomElement(['423', '865', '615', '931', '276']);
  const prefix = getRandomInt(200, 999);
  const line = getRandomInt(1000, 9999);
  return `${areaCode}-${prefix}-${line}`;
}

function getRandomSkills(count = 3) {
  const allSkills = Object.values(SKILL_CATEGORIES).flat();
  return getRandomElements(allSkills, count);
}

function getRandomCategory() {
  return getRandomElement(Object.keys(SKILL_CATEGORIES));
}

/**
 * Format address the way a user would enter it
 * Returns: { address, city, state, zip, fullAddress }
 */
function formatUserAddress(addressData) {
  return {
    address: addressData.street,
    city: addressData.city,
    state: addressData.state,
    zip: addressData.zip,
    fullAddress: `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zip}`,
    landmark: addressData.landmark // For reference only, not part of address
  };
}

// ============================================================================
// USER DATA DEFINITIONS
// ============================================================================

// 5 Guru Users - Teachers/Mentors who offer skills
const GURU_USERS = [
  {
    firstName: 'Testa',
    lastName: 'Gurusmith',
    email: 'testa.gurusmith@testmail.com',
    bio: 'Experienced software developer passionate about teaching web technologies to the next generation. I love helping beginners understand complex programming concepts.',
    category: 'Technology',
    skills: ['JavaScript Programming', 'Web Development', 'Python Development'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    experience: 'Senior Software Engineer with 10+ years in web development',
    addressIndex: 0 // ETSU
  },
  {
    firstName: 'Testa',
    lastName: 'Fitmaster',
    email: 'testa.fitmaster@testmail.com',
    bio: 'Certified personal trainer dedicated to helping clients achieve their fitness goals through customized training programs and nutrition guidance.',
    category: 'Fitness & Wellness',
    skills: ['Personal Training', 'Nutrition Coaching', 'Weight Training'],
    certifications: ['NASM-CPT', 'Precision Nutrition Level 2'],
    experience: 'Certified Personal Trainer with 8 years experience',
    addressIndex: 6 // Founders Park
  },
  {
    firstName: 'Testa',
    lastName: 'Melodica',
    email: 'testa.melodica@testmail.com',
    bio: 'Professional musician offering lessons in multiple instruments with focus on jazz and classical styles. Patient with beginners, challenging for advanced.',
    category: 'Music & Performance',
    skills: ['Piano Instruction', 'Music Theory', 'Vocal Training'],
    certifications: ['Berklee College of Music Graduate', 'ABRSM Grade 8'],
    experience: 'Professional jazz pianist and music educator for 15 years',
    addressIndex: 5 // Freedom Hall Civic Center
  },
  {
    firstName: 'Testa',
    lastName: 'Linguista',
    email: 'testa.linguista@testmail.com',
    bio: 'Polyglot language instructor fluent in 5 languages, specializing in immersive teaching methods that get you speaking from day one.',
    category: 'Languages',
    skills: ['Spanish Tutoring', 'French Lessons', 'ESL Teaching'],
    certifications: ['DELE C2 Spanish', 'DALF C1 French', 'CELTA Certified'],
    experience: 'Language instructor with 12 years of teaching experience',
    addressIndex: 3 // Johnson City Public Library
  },
  {
    firstName: 'Testa',
    lastName: 'Artisan',
    email: 'testa.artisan@testmail.com',
    bio: 'Creative designer with expertise in digital art and UI/UX, helping others develop their visual communication skills and build portfolios.',
    category: 'Creative Arts',
    skills: ['Graphic Design', 'UI/UX Design', 'Digital Art'],
    certifications: ['Adobe Certified Expert', 'Google UX Design Certificate'],
    experience: 'Senior UI/UX Designer with 9 years at tech companies',
    addressIndex: 2 // Mall at Johnson City
  }
];

// 5 Gunu Users - Learners seeking skills
const GUNU_USERS = [
  {
    firstName: 'Testa',
    lastName: 'Learner',
    email: 'testa.learner@testmail.com',
    bio: 'Career changer eager to break into tech. Looking for guidance in web development and programming to land my first developer job.',
    skillsWanted: ['JavaScript Programming', 'Web Development', 'Python Development'],
    budget: { min: 30, max: 60 },
    addressIndex: 9 // Kingsport City Hall
  },
  {
    firstName: 'Testa',
    lastName: 'Newbie',
    email: 'testa.newbie@testmail.com',
    bio: 'Recent college graduate looking to develop practical skills in business and finance to start my entrepreneurial journey.',
    skillsWanted: ['Financial Planning', 'Business Strategy', 'Marketing Strategy'],
    budget: { min: 40, max: 80 },
    addressIndex: 10 // Kingsport Public Library
  },
  {
    firstName: 'Testa',
    lastName: 'Student',
    email: 'testa.student@testmail.com',
    bio: 'High school senior preparing for college, needs help with test prep and study skills to get into my dream school.',
    skillsWanted: ['Math Tutoring', 'Test Prep', 'Writing Coaching'],
    budget: { min: 25, max: 50 },
    addressIndex: 4 // Science Hill High School
  },
  {
    firstName: 'Testa',
    lastName: 'Apprentice',
    email: 'testa.apprentice@testmail.com',
    bio: 'Aspiring musician wanting to learn piano and music theory from the ground up. Always dreamed of playing jazz.',
    skillsWanted: ['Piano Instruction', 'Music Theory', 'Songwriting'],
    budget: { min: 35, max: 70 },
    addressIndex: 13 // Birthplace of Country Music Museum
  },
  {
    firstName: 'Testa',
    lastName: 'Trainee',
    email: 'testa.trainee@testmail.com',
    bio: 'Office worker looking to get in shape and learn proper fitness techniques. Want to transform my health and lifestyle.',
    skillsWanted: ['Personal Training', 'Nutrition Coaching', 'Yoga Instruction'],
    budget: { min: 30, max: 65 },
    addressIndex: 18 // Sycamore Shoals State Historic Park
  }
];

// 5 Guest Users - Gig/small job posters
const GUEST_USERS = [
  {
    firstName: 'Testa',
    lastName: 'Poster',
    email: 'testa.poster@testmail.com',
    bio: 'Small business owner looking for help with various tasks and projects. I post gigs regularly for my growing business.',
    gigTypes: ['website-development', 'social-media', 'content-writing'],
    addressIndex: 11 // MeadowView Conference Resort
  },
  {
    firstName: 'Testa',
    lastName: 'Employer',
    email: 'testa.employer@testmail.com',
    bio: 'Homeowner with various home improvement projects needing skilled helpers. Fair pay for quality work.',
    gigTypes: ['home-repair', 'landscaping', 'painting'],
    addressIndex: 15 // Jonesborough Town Hall
  },
  {
    firstName: 'Testa',
    lastName: 'Client',
    email: 'testa.client@testmail.com',
    bio: 'Event coordinator seeking talented individuals for various event-related gigs and projects.',
    gigTypes: ['event-planning', 'photography', 'catering-help'],
    addressIndex: 12 // Bristol Motor Speedway
  },
  {
    firstName: 'Testa',
    lastName: 'Hirer',
    email: 'testa.hirer@testmail.com',
    bio: 'Startup founder looking for freelancers to help with technical and creative projects on a project basis.',
    gigTypes: ['graphic-design', 'app-development', 'video-editing'],
    addressIndex: 1 // Johnson City Medical Center
  },
  {
    firstName: 'Testa',
    lastName: 'Requester',
    email: 'testa.requester@testmail.com',
    bio: 'Parent looking for tutors and instructors for my children. Quality education is my priority.',
    gigTypes: ['tutoring', 'music-lessons', 'sports-coaching'],
    addressIndex: 19 // Elizabethton High School
  }
];

// 5 Angel Users - Apply to gigs, can create searchable profile to advertise services
const ANGEL_USERS = [
  {
    firstName: 'Testa',
    lastName: 'Helper',
    email: 'testa.helper@testmail.com',
    bio: 'Jack of all trades, master of getting things done! I apply to various gigs and help people with everyday tasks.',
    category: 'Trades & Services',
    skills: ['Handyman Services', 'Moving Help', 'Assembly Services'],
    specialty: 'General help and handyman services',
    hourlyRate: 35,
    addressIndex: 17 // Carter County Courthouse
  },
  {
    firstName: 'Testa',
    lastName: 'Fixer',
    email: 'testa.fixer@testmail.com',
    bio: 'Skilled tradesperson specializing in home repairs and maintenance. No job too small, quality work guaranteed.',
    category: 'Home & Garden',
    skills: ['Home Repair', 'Plumbing Basics', 'Electrical Basics'],
    specialty: 'Home repair and maintenance',
    hourlyRate: 45,
    addressIndex: 20 // Unicoi County Courthouse
  },
  {
    firstName: 'Testa',
    lastName: 'Creator',
    email: 'testa.creator@testmail.com',
    bio: 'Freelance creative professional offering design and content services. I bring your vision to life!',
    category: 'Creative Arts',
    skills: ['Graphic Design', 'Video Editing', 'Photography'],
    specialty: 'Creative design and media production',
    hourlyRate: 50,
    addressIndex: 16 // Chester Inn Museum
  },
  {
    firstName: 'Testa',
    lastName: 'Coder',
    email: 'testa.coder@testmail.com',
    bio: 'Freelance developer taking on web and app development gigs. Clean code, on-time delivery.',
    category: 'Technology',
    skills: ['Web Development', 'Mobile App Development', 'Database Management'],
    specialty: 'Web and app development',
    hourlyRate: 65,
    addressIndex: 8 // Gray Fossil Site
  },
  {
    firstName: 'Testa',
    lastName: 'Caretaker',
    email: 'testa.caretaker@testmail.com',
    bio: 'Caring professional offering pet care, house sitting, and personal assistance services.',
    category: 'Personal Services',
    skills: ['Pet Care', 'House Cleaning', 'Personal Shopping'],
    specialty: 'Pet care and personal assistance',
    hourlyRate: 30,
    addressIndex: 22 // Bluff City Town Hall
  }
];

// 5 Hero-Guru Users - Gurus donating time to teach disabled gunus
const HERO_GURU_USERS = [
  {
    firstName: 'Testa',
    lastName: 'Hero',
    email: 'testa.hero@testmail.com',
    bio: 'Deaf software developer teaching coding with visual-first approaches and accessible methods. Giving back to the disability community.',
    category: 'Technology',
    skills: ['JavaScript Programming', 'Web Development'],
    accessibility: {
      hearing: ['deaf', 'uses-sign-language'],
      communicationPrefs: ['visual-aids', 'text-based', 'video-captions']
    },
    coachingStyles: ['visual-demos', 'step-by-step', 'slow-pace'],
    addressIndex: 7 // Tipton-Haynes State Historic Site
  },
  {
    firstName: 'Testa',
    lastName: 'Champion',
    email: 'testa.champion@testmail.com',
    bio: 'Wheelchair athlete offering adaptive fitness training for people of all abilities. Everyone deserves access to fitness.',
    category: 'Fitness & Wellness',
    skills: ['Personal Training', 'Sports Coaching', 'Adaptive Fitness'],
    accessibility: {
      mobility: ['wheelchair-user', 'adaptive-equipment'],
      communicationPrefs: ['in-person', 'video-calls']
    },
    coachingStyles: ['hands-on', 'peer-mentoring', 'project-based'],
    addressIndex: 23 // Roan Mountain State Park
  },
  {
    firstName: 'Testa',
    lastName: 'Visionary',
    email: 'testa.visionary@testmail.com',
    bio: 'Blind musician teaching audio production and music theory through auditory-focused methods. Music knows no barriers.',
    category: 'Music & Performance',
    skills: ['Music Production', 'Music Theory', 'Songwriting'],
    accessibility: {
      vision: ['blind', 'screen-reader-user'],
      assistiveTech: ['jaws', 'braille-display'],
      communicationPrefs: ['audio-focused', 'voice-calls']
    },
    coachingStyles: ['verbal-explainer', 'q-and-a', 'structured-curriculum'],
    addressIndex: 14 // Bristol Public Library
  },
  {
    firstName: 'Testa',
    lastName: 'Advocate',
    email: 'testa.advocate@testmail.com',
    bio: 'Neurodivergent educator specializing in teaching methods that work for ADHD and autistic learners. Different minds, different methods.',
    category: 'Education & Tutoring',
    skills: ['Study Skills', 'Test Prep', 'Math Tutoring'],
    accessibility: {
      neurodiversity: ['adhd', 'autism-spectrum'],
      communicationPrefs: ['structured-sessions', 'written-agendas', 'flexible-pacing']
    },
    coachingStyles: ['structured-curriculum', 'step-by-step', 'slow-pace', 'visual-demos'],
    addressIndex: 24 // Greene County Courthouse
  },
  {
    firstName: 'Testa',
    lastName: 'Warrior',
    email: 'testa.warrior@testmail.com',
    bio: 'Artist with chronic illness teaching digital art with energy-management friendly scheduling. Creativity has no limits.',
    category: 'Creative Arts',
    skills: ['Digital Art', 'Illustration', 'Graphic Design'],
    accessibility: {
      mobility: ['limited-mobility', 'chronic-fatigue'],
      communicationPrefs: ['async-friendly', 'flexible-scheduling', 'video-calls']
    },
    coachingStyles: ['project-based', 'visual-demos', 'slow-pace', 'peer-mentoring'],
    addressIndex: 21 // Erwin National Fish Hatchery
  }
];

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function createTestUser(userData, role, index) {
  // Get address from the predefined list using the user's addressIndex
  const addressData = ADDRESSES[userData.addressIndex];
  const location = formatUserAddress(addressData);

  const now = new Date();
  const joinDate = new Date(now.getTime() - getRandomInt(30, 365) * 24 * 60 * 60 * 1000);
  const lastLogin = new Date(now.getTime() - getRandomInt(1, 14) * 24 * 60 * 60 * 1000);

  const userId = `test_${role}_${(index + 1).toString().padStart(3, '0')}`;
  const displayName = `${userData.firstName} ${userData.lastName}`;

  const baseUser = {
    id: userId,
    email: userData.email,
    displayName: displayName,
    firstName: userData.firstName,
    lastName: userData.lastName,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
    role: role,
    bio: userData.bio,
    phone: generatePhoneNumber(),

    // Address entered the way a user would input it (NOT lat/lng)
    address: location.address,
    city: location.city,
    state: location.state,
    zip: location.zip,
    fullAddress: location.fullAddress,

    // Also store in location object for compatibility
    location: {
      address: location.address,
      city: location.city,
      state: location.state,
      zip: location.zip,
      fullAddress: location.fullAddress,
      lastUpdated: now.toISOString()
    },

    // Activity metrics
    isActive: true,
    verified: ['guru', 'hero-guru', 'angel'].includes(role),
    joinDate: joinDate.toISOString(),
    lastLoginAt: lastLogin.toISOString(),
    lastActivity: lastLogin.getTime(),

    // Availability
    availability: getRandomElements(AVAILABILITIES, getRandomInt(2, 4)),

    // Timestamps
    createdAt: joinDate.toISOString(),
    updatedAt: now.toISOString(),

    // Liability
    liability: {
      termsAccepted: true,
      termsAcceptedAt: joinDate.toISOString(),
      lastWaiverAccepted: joinDate.toISOString(),
      lastWaiverId: `waiver_${userId}`,
      totalWaivers: 1
    }
  };

  // Role-specific additions
  if (role === 'guru') {
    const tier = getRandomElement(['Rock Roller', 'Boulder Mover', 'Pebble Pusher']);
    const exchangesCompleted = tier === 'Boulder Mover' ? getRandomInt(30, 80) :
                               tier === 'Rock Roller' ? getRandomInt(15, 35) : getRandomInt(5, 18);

    Object.assign(baseUser, {
      tier: tier,
      category: userData.category,
      skillsOffered: userData.skills,
      skillsWanted: getRandomSkills(2),
      certifications: userData.certifications || [],
      experience: userData.experience,

      exchangesCompleted: exchangesCompleted,
      averageRating: getRandomFloat(4.2, 5.0),
      totalHoursTaught: exchangesCompleted * getRandomFloat(1.5, 3),
      totalSessions: exchangesCompleted + getRandomInt(5, 20),

      price: {
        min: getRandomInt(30, 50),
        max: getRandomInt(60, 100),
        currency: 'USD'
      },
      hourlyRate: getRandomInt(40, 85),

      accessibility: {
        mobility: [],
        vision: [],
        hearing: [],
        neurodiversity: [],
        communicationPrefs: [],
        assistiveTech: []
      },
      modifiedMasters: {
        wantsToTeach: true,
        wantsToLearn: false,
        tags: userData.skills,
        visible: true,
        coachingStyles: getRandomElements(COACHING_STYLES, 3)
      }
    });
  }

  if (role === 'gunu') {
    Object.assign(baseUser, {
      tier: 'Stone Dropper',
      skillsOffered: getRandomSkills(1),
      skillsWanted: userData.skillsWanted,

      exchangesCompleted: getRandomInt(0, 5),
      averageRating: null,
      totalHoursTaught: 0,
      totalSessions: getRandomInt(0, 3),

      budget: {
        min: userData.budget.min,
        max: userData.budget.max,
        currency: 'USD'
      },

      accessibility: {
        mobility: [],
        vision: [],
        hearing: [],
        neurodiversity: [],
        communicationPrefs: [],
        assistiveTech: []
      },
      modifiedMasters: {
        wantsToTeach: false,
        wantsToLearn: true,
        tags: userData.skillsWanted,
        visible: true,
        coachingStyles: []
      }
    });
  }

  if (role === 'guest') {
    Object.assign(baseUser, {
      tier: 'Stone Dropper',
      gigTypes: userData.gigTypes,
      gigsPosted: getRandomInt(1, 10),

      skillsOffered: [],
      skillsWanted: [],
      exchangesCompleted: 0,
      averageRating: getRandomFloat(3.8, 5.0),
      totalHoursTaught: 0,
      totalSessions: 0
    });
  }

  if (role === 'angel') {
    const exchangesCompleted = getRandomInt(10, 50);

    Object.assign(baseUser, {
      tier: getRandomElement(['Pebble Pusher', 'Rock Roller']),
      category: userData.category,
      skillsOffered: userData.skills,
      skillsWanted: [],
      specialty: userData.specialty,

      exchangesCompleted: exchangesCompleted,
      averageRating: getRandomFloat(4.0, 5.0),
      totalHoursTaught: exchangesCompleted * getRandomFloat(1, 2),
      totalSessions: exchangesCompleted + getRandomInt(5, 15),
      gigsCompleted: exchangesCompleted,

      hourlyRate: userData.hourlyRate,
      price: {
        min: userData.hourlyRate - 10,
        max: userData.hourlyRate + 20,
        currency: 'USD'
      },

      // Searchable profile
      profileVisible: true,
      searchableSkills: userData.skills,
      serviceAreas: [location.city, location.state],

      accessibility: {
        mobility: [],
        vision: [],
        hearing: [],
        neurodiversity: [],
        communicationPrefs: [],
        assistiveTech: []
      }
    });
  }

  if (role === 'hero-guru') {
    const exchangesCompleted = getRandomInt(20, 60);

    Object.assign(baseUser, {
      tier: getRandomElement(['Rock Roller', 'Boulder Mover']),
      category: userData.category,
      skillsOffered: userData.skills,
      skillsWanted: [],

      exchangesCompleted: exchangesCompleted,
      averageRating: getRandomFloat(4.5, 5.0),
      totalHoursTaught: exchangesCompleted * getRandomFloat(1.5, 2.5),
      totalSessions: exchangesCompleted + getRandomInt(10, 30),

      // Hero Gurus provide free services to disabled gunus
      price: { min: 0, max: 0, currency: 'USD' },
      hourlyRate: 0,

      accessibility: userData.accessibility,
      modifiedMasters: {
        wantsToTeach: true,
        wantsToLearn: false,
        tags: userData.skills,
        visible: true,
        coachingStyles: userData.coachingStyles
      },

      // Disability attestation for hero-guru
      disabilityAttestation: {
        attested: true,
        attestedAt: joinDate.toISOString(),
        fullLegalName: displayName,
        attestationText: 'I attest that I have a disability and wish to donate my time to teach disabled gunus through the Hero Guru program.',
        documentationProvided: true,
        documentationVerified: true,
        verifiedBy: 'test_admin_001',
        verifiedAt: new Date(joinDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        verificationNotes: 'Verified for testing purposes'
      },

      heroGuruPrefs: {
        provideFreeServices: true,
        enabledAt: joinDate.toISOString(),
        disabledAt: null,
        totalFreeSessionsProvided: getRandomInt(10, 40),
        visible: true
      }
    });
  }

  return baseUser;
}

async function createGigForGuest(user, index) {
  if (user.role !== 'guest') return null;

  const now = new Date();
  const createdAt = new Date(now.getTime() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000);
  const gigId = `test_gig_${user.id}_${(index + 1).toString().padStart(3, '0')}`;

  const categories = Object.keys(SKILL_CATEGORIES);
  const category = categories[index % categories.length];
  const skills = SKILL_CATEGORIES[category].slice(0, 3);

  const gigTitles = [
    `Need help with ${skills[0]}`,
    `Looking for ${category} expert`,
    `${skills[0]} project help needed`,
    `Seeking ${category} professional`,
    `${skills[0]} gig available`
  ];

  const gig = {
    id: gigId,
    title: gigTitles[index % gigTitles.length],
    description: `I'm looking for someone skilled in ${skills.slice(0, 2).join(' and ')}. ${user.bio} This is a great opportunity for the right person!`,
    category: category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),

    // Location as address (the way a user would enter it)
    location: {
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      fullAddress: user.fullAddress
    },

    skills: skills,
    hourlyRate: getRandomInt(25, 75),
    estimatedHours: getRandomInt(2, 20),
    budget: getRandomInt(100, 500),
    urgency: getRandomElement(['low', 'normal', 'high', 'urgent']),

    postedBy: user.id,
    posterId: user.id,
    status: 'open',
    featured: Math.random() > 0.7,

    applications: {},
    applicationCount: 0,

    tags: [category.toLowerCase(), ...skills.map(s => s.toLowerCase().replace(/ /g, '-'))],

    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString()
  };

  return gig;
}

async function createSkillForGuru(user, skillName, index) {
  if (user.role !== 'guru' && user.role !== 'hero-guru') return null;

  const now = new Date();
  const createdAt = new Date(now.getTime() - getRandomInt(30, 180) * 24 * 60 * 60 * 1000);
  const skillId = `test_skill_${user.id}_${(index + 1).toString().padStart(3, '0')}`;

  const skill = {
    id: skillId,
    title: skillName,
    summary: `Learn ${skillName} with ${user.displayName}`,
    description: `Comprehensive ${skillName} instruction tailored to your learning style and goals. ${user.bio}`,

    createdBy: user.id,
    teacherId: user.id,
    skillCategory: user.category,
    category: user.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),

    level: getRandomElement(['Beginner', 'Intermediate', 'Advanced']),
    duration: `${getRandomInt(4, 12)} weeks`,
    format: getRandomElement(['One-on-one sessions', 'Group sessions', 'Self-paced with support']),

    isModifiedMasters: user.role === 'hero-guru',
    accessibilityTags: user.role === 'hero-guru'
      ? Object.values(user.accessibility).flat().filter(Boolean)
      : [],
    coachingStyles: user.modifiedMasters?.coachingStyles || getRandomElements(COACHING_STYLES, 3),

    resources: [
      {
        id: `resource_${skillId}_1`,
        title: `${skillName} Getting Started Guide`,
        url: 'https://example.com/guide',
        type: 'doc',
        addedBy: user.id,
        addedAt: createdAt.getTime()
      }
    ],

    status: 'published',
    tags: [skillName.toLowerCase().replace(/ /g, '-'), user.category.toLowerCase()],

    // Location as address for searchability
    location: {
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      fullAddress: user.fullAddress
    },

    hourlyRate: user.hourlyRate || 0,

    createdAt: createdAt.toISOString(),
    updatedAt: now.toISOString()
  };

  return skill;
}

async function createAngelProfile(user, index) {
  if (user.role !== 'angel') return null;

  const now = new Date();
  const profileId = `test_angel_profile_${user.id}`;

  const profile = {
    id: profileId,
    userId: user.id,
    displayName: user.displayName,

    // Searchable fields
    specialty: user.specialty,
    skills: user.skillsOffered,
    category: user.category,

    // Location as address for search
    location: {
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      fullAddress: user.fullAddress
    },
    serviceRadius: getRandomInt(10, 50), // miles they'll travel

    hourlyRate: user.hourlyRate,
    bio: user.bio,

    // Stats
    gigsCompleted: user.gigsCompleted,
    averageRating: user.averageRating,
    reviewCount: getRandomInt(5, 30),

    // Availability
    availability: user.availability,

    // Visibility
    isActive: true,
    profileVisible: true,
    verified: user.verified,

    createdAt: user.createdAt,
    updatedAt: now.toISOString()
  };

  return profile;
}

async function createSession(teacher, learner, skillId, index) {
  const now = new Date();
  const sessionDate = new Date(now.getTime() + getRandomInt(-30, 30) * 24 * 60 * 60 * 1000);
  const sessionId = `test_session_${(index + 1).toString().padStart(3, '0')}`;

  const statuses = ['requested', 'confirmed', 'completed', 'canceled'];
  const status = sessionDate < now
    ? getRandomElement(['completed', 'canceled'])
    : getRandomElement(['requested', 'confirmed']);

  const session = {
    id: sessionId,
    skillId: skillId,
    coachId: teacher.id,
    learnerId: learner.id,

    title: `${teacher.skillsOffered?.[0] || 'Learning'} session with ${learner.displayName}`,
    description: `Learning session for ${teacher.skillsOffered?.[0] || 'skills'}`,

    mode: getRandomElement(['video', 'phone', 'chat']),
    startTime: sessionDate.getTime(),
    endTime: sessionDate.getTime() + (getRandomInt(1, 2) * 60 * 60 * 1000),
    duration: getRandomInt(30, 120),

    joinUrl: `https://meet.example.com/${sessionId}`,
    captionsRequired: teacher.role === 'hero-guru',
    aslRequested: false,
    recordPolicy: getRandomElement(['prohibited', 'allowed', 'allow-with-consent']),

    status: status,
    price: teacher.hourlyRate || getRandomInt(30, 70),

    // Location for reference (teacher's location)
    location: {
      city: teacher.city,
      state: teacher.state,
      fullAddress: teacher.fullAddress
    },

    createdAt: new Date(sessionDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now.toISOString()
  };

  return session;
}

async function createExchange(teacher, learner, index) {
  const now = new Date();
  const completedAt = new Date(now.getTime() - getRandomInt(1, 90) * 24 * 60 * 60 * 1000);
  const exchangeId = `test_exchange_${(index + 1).toString().padStart(3, '0')}`;

  const skill = teacher.skillsOffered?.[index % (teacher.skillsOffered?.length || 1)] || 'General Skills';

  const exchange = {
    id: exchangeId,
    teacherId: teacher.id,
    studentId: learner.id,

    skill: skill,
    hourlyRate: teacher.hourlyRate || getRandomInt(30, 70),
    hoursCompleted: getRandomInt(1, 4),

    status: 'completed',
    rating: getRandomFloat(4.0, 5.0),
    feedback: `Great session learning ${skill}! ${teacher.displayName} was very helpful and patient. Highly recommend!`,

    completedAt: completedAt.toISOString(),
    createdAt: new Date(completedAt.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
  };

  return exchange;
}

async function createApplication(gig, applicant, index) {
  const applicationId = `test_app_${gig.id}_${applicant.id}`;
  const appliedAt = new Date(new Date(gig.createdAt).getTime() + getRandomInt(1, 7) * 24 * 60 * 60 * 1000);

  const application = {
    id: applicationId,
    jobId: gig.id,
    gigId: gig.id,
    userId: applicant.id,
    applicantId: applicant.id,

    message: `Hi! I'm ${applicant.displayName} and I'd love to help you with ${gig.skills?.[0] || 'your request'}. ${applicant.bio}`,
    proposedRate: applicant.hourlyRate || getRandomInt(25, 60),

    status: getRandomElement(['pending', 'reviewed', 'accepted', 'rejected']),
    appliedAt: appliedAt.toISOString(),
    timestamp: appliedAt.toISOString()
  };

  return application;
}

async function createGuruLocation(user, index) {
  if (user.role !== 'guru' && user.role !== 'hero-guru') return null;

  const locationId = `test_guru_loc_${user.id}_${index + 1}`;
  const now = new Date();

  const location = {
    id: locationId,
    // Address-based location (what user would enter)
    address: user.address,
    city: user.city,
    state: user.state,
    zip: user.zip,
    fullAddress: user.fullAddress,

    title: `${user.displayName}'s ${user.category} Services`,
    description: `Available for ${user.skillsOffered.join(', ')} in ${user.city}`,
    category: user.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
    type: user.role === 'hero-guru' ? 'hero-guru' : 'guru',
    createdBy: user.id,
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };

  return location;
}

async function createAngelLocation(user, index) {
  if (user.role !== 'angel') return null;

  const locationId = `test_angel_loc_${user.id}_${index + 1}`;
  const now = new Date();

  const location = {
    id: locationId,
    // Address-based location
    address: user.address,
    city: user.city,
    state: user.state,
    zip: user.zip,
    fullAddress: user.fullAddress,

    title: `${user.displayName} - ${user.specialty}`,
    description: `${user.skillsOffered.join(', ')} available in ${user.city}. ${user.bio}`,
    category: user.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
    type: 'angel',
    specialty: user.specialty,
    hourlyRate: user.hourlyRate,
    rating: user.averageRating,
    createdBy: user.id,
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };

  return location;
}

// ============================================================================
// MAIN SEEDING FUNCTION
// ============================================================================

async function seedTestDatabase() {
  console.log('🌱 Starting Test User Database Seeding...');
  console.log('📍 All users have REAL addresses within 25 miles of Johnson City, TN');
  console.log('🏢 Addresses are from public buildings/businesses (Google Maps searchable)');
  console.log('👤 All users will have first name "Testa" for easy cleanup\n');

  const allUsers = [];
  const allGigs = [];
  const allSkills = [];
  const allSessions = [];
  const allExchanges = [];
  const allApplications = [];
  const allGuruLocations = [];
  const allAngelLocations = [];
  const allAngelProfiles = [];

  // Create Guru Users (Teachers)
  console.log('👨‍🏫 Creating Guru users (Teachers)...');
  for (let i = 0; i < GURU_USERS.length; i++) {
    const user = await createTestUser(GURU_USERS[i], 'guru', i);
    allUsers.push(user);

    // Create skills for gurus
    for (let j = 0; j < user.skillsOffered.length; j++) {
      const skill = await createSkillForGuru(user, user.skillsOffered[j], j);
      if (skill) allSkills.push(skill);
    }

    // Create guru locations for map markers
    const guruLoc = await createGuruLocation(user, i);
    if (guruLoc) allGuruLocations.push(guruLoc);
  }
  console.log(`   ✓ Created ${GURU_USERS.length} guru users`);

  // Create Gunu Users (Learners)
  console.log('🎓 Creating Gunu users (Learners)...');
  for (let i = 0; i < GUNU_USERS.length; i++) {
    const user = await createTestUser(GUNU_USERS[i], 'gunu', i);
    allUsers.push(user);
  }
  console.log(`   ✓ Created ${GUNU_USERS.length} gunu users`);

  // Create Guest Users (Gig Posters)
  console.log('📋 Creating Guest users (Gig Posters)...');
  for (let i = 0; i < GUEST_USERS.length; i++) {
    const user = await createTestUser(GUEST_USERS[i], 'guest', i);
    allUsers.push(user);

    // Create multiple gigs for each guest
    for (let j = 0; j < 3; j++) {
      const gig = await createGigForGuest(user, j);
      if (gig) allGigs.push(gig);
    }
  }
  console.log(`   ✓ Created ${GUEST_USERS.length} guest users with ${allGigs.length} gigs`);

  // Create Angel Users (Gig Workers with searchable profiles)
  console.log('👼 Creating Angel users (Gig Workers)...');
  for (let i = 0; i < ANGEL_USERS.length; i++) {
    const user = await createTestUser(ANGEL_USERS[i], 'angel', i);
    allUsers.push(user);

    // Create angel profile for searchability
    const profile = await createAngelProfile(user, i);
    if (profile) allAngelProfiles.push(profile);

    // Create angel locations for map markers
    const angelLoc = await createAngelLocation(user, i);
    if (angelLoc) allAngelLocations.push(angelLoc);
  }
  console.log(`   ✓ Created ${ANGEL_USERS.length} angel users with searchable profiles`);

  // Create Hero-Guru Users (Volunteer teachers for disabled gunus)
  console.log('🦸 Creating Hero-Guru users (Volunteer Teachers)...');
  for (let i = 0; i < HERO_GURU_USERS.length; i++) {
    const user = await createTestUser(HERO_GURU_USERS[i], 'hero-guru', i);
    allUsers.push(user);

    // Create skills for hero-gurus
    for (let j = 0; j < user.skillsOffered.length; j++) {
      const skill = await createSkillForGuru(user, user.skillsOffered[j], j);
      if (skill) allSkills.push(skill);
    }

    // Create guru locations for hero-gurus (they show on map too)
    const guruLoc = await createGuruLocation(user, i);
    if (guruLoc) allGuruLocations.push(guruLoc);
  }
  console.log(`   ✓ Created ${HERO_GURU_USERS.length} hero-guru users`);

  // Create Sessions between gurus/hero-gurus and gunus
  console.log('📅 Creating Sessions...');
  const teachers = allUsers.filter(u => u.role === 'guru' || u.role === 'hero-guru');
  const learners = allUsers.filter(u => u.role === 'gunu');
  let sessionIndex = 0;

  for (const teacher of teachers) {
    for (let i = 0; i < 2; i++) { // 2 sessions per teacher
      const learner = learners[sessionIndex % learners.length];
      const skillId = allSkills.find(s => s.createdBy === teacher.id)?.id || `skill_${teacher.id}`;
      const session = await createSession(teacher, learner, skillId, sessionIndex);
      allSessions.push(session);
      sessionIndex++;
    }
  }
  console.log(`   ✓ Created ${allSessions.length} sessions`);

  // Create Exchanges (completed skill exchanges)
  console.log('🤝 Creating Exchanges...');
  let exchangeIndex = 0;
  for (const teacher of teachers) {
    for (let i = 0; i < 2; i++) { // 2 exchanges per teacher
      const learner = learners[exchangeIndex % learners.length];
      const exchange = await createExchange(teacher, learner, exchangeIndex);
      allExchanges.push(exchange);
      exchangeIndex++;
    }
  }
  console.log(`   ✓ Created ${allExchanges.length} exchanges`);

  // Create Applications for gigs (angels applying to guest-posted gigs)
  console.log('📋 Creating Applications...');
  const angels = allUsers.filter(u => u.role === 'angel');
  let appIndex = 0;
  for (const gig of allGigs) {
    const numApplicants = Math.min(getRandomInt(1, 3), angels.length);
    const shuffledAngels = [...angels].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numApplicants; i++) {
      const applicant = shuffledAngels[i];
      const application = await createApplication(gig, applicant, appIndex);
      allApplications.push(application);

      // Update gig with application reference
      gig.applications[applicant.id] = application;
      gig.applicationCount++;
      appIndex++;
    }
  }
  console.log(`   ✓ Created ${allApplications.length} applications`);

  // Save all data to Firestore
  console.log('\n💾 Saving data to Firestore...');

  // Save users to 'users' collection
  console.log('   Saving users...');
  for (const user of allUsers) {
    await db.collection('users').doc(user.id).set(user, { merge: true });
    // Also save to profiles collection
    await db.collection('profiles').doc(user.id).set(user, { merge: true });
  }

  // Save gigs (angel_jobs)
  console.log('   Saving gigs/jobs...');
  for (const gig of allGigs) {
    await db.collection('angel_jobs').doc(gig.id).set(gig, { merge: true });
  }

  // Save skills
  console.log('   Saving skills...');
  for (const skill of allSkills) {
    await db.collection('skills').doc(skill.id).set(skill, { merge: true });
  }

  // Save sessions
  console.log('   Saving sessions...');
  for (const session of allSessions) {
    await db.collection('sessions').doc(session.id).set(session, { merge: true });
  }

  // Save exchanges
  console.log('   Saving exchanges...');
  for (const exchange of allExchanges) {
    await db.collection('exchanges').doc(exchange.id).set(exchange, { merge: true });
  }

  // Save applications
  console.log('   Saving applications...');
  for (const app of allApplications) {
    await db.collection('applications').doc(app.id).set(app, { merge: true });
  }

  // Save guru locations (for map markers)
  console.log('   Saving guru locations...');
  for (const loc of allGuruLocations) {
    await db.collection('guru_locations').doc(loc.id).set(loc, { merge: true });
  }

  // Save angel locations (for map markers)
  console.log('   Saving angel locations...');
  for (const loc of allAngelLocations) {
    await db.collection('angel_locations').doc(loc.id).set(loc, { merge: true });
  }

  // Save angel profiles (for search)
  console.log('   Saving angel profiles...');
  for (const profile of allAngelProfiles) {
    await db.collection('angel_profiles').doc(profile.id).set(profile, { merge: true });
  }

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('✅ TEST DATABASE SEEDING COMPLETE!');
  console.log('='.repeat(70));
  console.log('\n📊 Summary of seeded data:');
  console.log(`   👥 Total Users: ${allUsers.length}`);
  console.log(`      - Gurus (Teachers): ${GURU_USERS.length}`);
  console.log(`      - Gunus (Learners): ${GUNU_USERS.length}`);
  console.log(`      - Guests (Gig Posters): ${GUEST_USERS.length}`);
  console.log(`      - Angels (Gig Workers): ${ANGEL_USERS.length}`);
  console.log(`      - Hero-Gurus (Volunteer Teachers): ${HERO_GURU_USERS.length}`);
  console.log(`   💼 Gigs/Jobs: ${allGigs.length}`);
  console.log(`   🎯 Skills: ${allSkills.length}`);
  console.log(`   📅 Sessions: ${allSessions.length}`);
  console.log(`   🤝 Exchanges: ${allExchanges.length}`);
  console.log(`   📋 Applications: ${allApplications.length}`);
  console.log(`   📍 Guru Locations (map): ${allGuruLocations.length}`);
  console.log(`   📍 Angel Locations (map): ${allAngelLocations.length}`);
  console.log(`   👼 Angel Profiles (search): ${allAngelProfiles.length}`);

  console.log('\n🔍 Test Users with REAL Addresses (all start with "Testa"):');

  console.log('\n   GURUS (Teachers):');
  allUsers.filter(u => u.role === 'guru').forEach(u => {
    console.log(`      - ${u.displayName} (${u.email})`);
    console.log(`        📍 ${u.fullAddress}`);
    console.log(`        🎯 Skills: ${u.skillsOffered.join(', ')}`);
  });

  console.log('\n   GUNUS (Learners):');
  allUsers.filter(u => u.role === 'gunu').forEach(u => {
    console.log(`      - ${u.displayName} (${u.email})`);
    console.log(`        📍 ${u.fullAddress}`);
    console.log(`        📚 Wants: ${u.skillsWanted.join(', ')}`);
  });

  console.log('\n   GUESTS (Gig Posters):');
  allUsers.filter(u => u.role === 'guest').forEach(u => {
    console.log(`      - ${u.displayName} (${u.email})`);
    console.log(`        📍 ${u.fullAddress}`);
    console.log(`        💼 Gig Types: ${u.gigTypes.join(', ')}`);
  });

  console.log('\n   ANGELS (Gig Workers - Searchable):');
  allUsers.filter(u => u.role === 'angel').forEach(u => {
    console.log(`      - ${u.displayName} (${u.email})`);
    console.log(`        📍 ${u.fullAddress}`);
    console.log(`        🔧 Specialty: ${u.specialty}`);
    console.log(`        💰 $${u.hourlyRate}/hr | Skills: ${u.skillsOffered.join(', ')}`);
  });

  console.log('\n   HERO-GURUS (Volunteer Teachers for Disabled Gunus):');
  allUsers.filter(u => u.role === 'hero-guru').forEach(u => {
    console.log(`      - ${u.displayName} (${u.email})`);
    console.log(`        📍 ${u.fullAddress}`);
    console.log(`        🎯 Skills: ${u.skillsOffered.join(', ')}`);
    console.log(`        ♿ Accessibility: ${Object.values(u.accessibility).flat().filter(Boolean).join(', ')}`);
  });

  console.log('\n📍 All addresses are REAL locations searchable on Google Maps');
  console.log('🗑️  Cleanup: Search for users with firstName "Testa" to remove test data');
  console.log('\n🎯 Ready for testing!');

  return {
    users: allUsers,
    gigs: allGigs,
    skills: allSkills,
    sessions: allSessions,
    exchanges: allExchanges,
    applications: allApplications,
    guruLocations: allGuruLocations,
    angelLocations: allAngelLocations,
    angelProfiles: allAngelProfiles
  };
}

// Run the seeder
seedTestDatabase()
  .then(() => {
    console.log('\n👋 Seeding process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });

module.exports = { seedTestDatabase };
