/**
 * Full Database Seeding Script
 * Creates comprehensive sample data including users, skills, and guru-understudy relationships
 * for complete platform integration
 */

const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

// Comprehensive sample data for the platform
const sampleGurus = [
  {
    id: 'guru_001',
    displayName: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b169b479?w=150',
    role: 'guru',
    skillsOffered: ['JavaScript', 'React', 'Node.js', 'Web Development'],
    skillsWanted: ['Python', 'Data Science'],
    experience: 'Senior Software Engineer with 8 years experience',
    location: 'Denver, CO',
    rating: 4.9,
    totalSessions: 156,
    verified: true,
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    bio: 'Passionate full-stack developer helping others master modern web technologies. I specialize in React, Node.js, and cloud architecture.',
    availability: ['weekday_evenings', 'weekend_mornings'],
    price: { min: 45, max: 75, currency: 'USD' }
  },
  {
    id: 'guru_002',
    displayName: 'Marcus Thompson',
    email: 'marcus.t@example.com',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'guru',
    skillsOffered: ['Personal Training', 'Nutrition', 'Weight Loss', 'Strength Training'],
    skillsWanted: ['Business Development', 'Marketing'],
    experience: 'Certified Personal Trainer and Nutritionist',
    location: 'Boulder, CO',
    rating: 4.8,
    totalSessions: 89,
    verified: true,
    certifications: ['NASM-CPT', 'Precision Nutrition Level 1'],
    bio: 'Helping people transform their health and fitness. 6 years of experience in personal training and nutrition coaching.',
    availability: ['weekend_mornings', 'weekday_mornings'],
    price: { min: 35, max: 60, currency: 'USD' }
  },
  {
    id: 'guru_003',
    displayName: 'Isabella Rodriguez',
    email: 'isabella.r@example.com',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'guru',
    skillsOffered: ['Spanish', 'French', 'Language Teaching', 'Translation'],
    skillsWanted: ['Guitar', 'Music Theory'],
    experience: 'Native Spanish speaker, fluent in 4 languages',
    location: 'Denver, CO',
    rating: 4.9,
    totalSessions: 203,
    verified: true,
    certifications: ['DELE Spanish Teaching Certificate'],
    bio: 'Polyglot language instructor with 10+ years experience. I make language learning fun and practical!',
    availability: ['weekday_afternoons', 'weekend_afternoons'],
    price: { min: 30, max: 50, currency: 'USD' }
  },
  {
    id: 'guru_004',
    displayName: 'David Kim',
    email: 'david.kim@example.com',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'guru',
    skillsOffered: ['Piano', 'Music Theory', 'Composition', 'Jazz'],
    skillsWanted: ['Photography', 'Video Editing'],
    experience: 'Professional jazz pianist and music educator',
    location: 'Denver, CO',
    rating: 4.8,
    totalSessions: 134,
    verified: true,
    certifications: ['Berklee College of Music Graduate'],
    bio: 'Professional musician with 15 years of teaching experience. Specializing in jazz piano and music theory.',
    availability: ['weekday_evenings', 'weekend_afternoons'],
    price: { min: 40, max: 70, currency: 'USD' }
  },
  {
    id: 'guru_005',
    displayName: 'Emily Watson',
    email: 'emily.watson@example.com',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'guru',
    skillsOffered: ['Digital Art', 'Photoshop', 'UI/UX Design', 'Illustration'],
    skillsWanted: ['3D Modeling', 'Animation'],
    experience: 'Senior UI/UX Designer at tech startup',
    location: 'Boulder, CO',
    rating: 4.9,
    totalSessions: 78,
    verified: true,
    certifications: ['Adobe Certified Expert'],
    bio: 'Creative designer passionate about helping others develop their artistic skills and design thinking.',
    availability: ['weekday_evenings', 'weekend_mornings'],
    price: { min: 50, max: 80, currency: 'USD' }
  }
];

const sampleUnderstudies = [
  {
    id: 'student_001',
    displayName: 'Alex Johnson',
    email: 'alex.j@example.com',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role: 'understudy',
    skillsOffered: ['Photography', 'Photo Editing'],
    skillsWanted: ['JavaScript', 'Web Development', 'React'],
    experience: 'Beginner developer looking to switch careers',
    location: 'Denver, CO',
    rating: null,
    totalSessions: 0,
    verified: false,
    bio: 'Photographer transitioning into web development. Eager to learn modern tech skills!',
    availability: ['weekday_evenings', 'weekend_mornings'],
    budget: { min: 25, max: 50, currency: 'USD' }
  },
  {
    id: 'student_002',
    displayName: 'Maria Garcia',
    email: 'maria.g@example.com',
    photoURL: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
    role: 'understudy',
    skillsOffered: ['Business Strategy', 'Marketing'],
    skillsWanted: ['Personal Training', 'Nutrition', 'Fitness'],
    experience: 'Business professional wanting to get fit',
    location: 'Boulder, CO',
    rating: null,
    totalSessions: 0,
    verified: false,
    bio: 'Marketing exec looking to improve my health and fitness. Can share business insights in exchange!',
    availability: ['weekend_mornings', 'weekday_early_mornings'],
    budget: { min: 30, max: 60, currency: 'USD' }
  },
  {
    id: 'student_003',
    displayName: 'James Wilson',
    email: 'james.w@example.com',
    photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    role: 'understudy',
    skillsOffered: ['Guitar', 'Music Production'],
    skillsWanted: ['Spanish', 'French', 'Language Learning'],
    experience: 'Musician planning to travel internationally',
    location: 'Denver, CO',
    rating: null,
    totalSessions: 0,
    verified: false,
    bio: 'Professional guitarist wanting to learn Spanish for upcoming tour. Happy to teach guitar in return!',
    availability: ['weekday_afternoons', 'weekend_afternoons'],
    budget: { min: 25, max: 45, currency: 'USD' }
  },
  {
    id: 'student_004',
    displayName: 'Lisa Chang',
    email: 'lisa.c@example.com',
    photoURL: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    role: 'understudy',
    skillsOffered: ['3D Modeling', 'Blender', 'Animation'],
    skillsWanted: ['Piano', 'Music Theory', 'Digital Art'],
    experience: '3D artist looking to expand creative skills',
    location: 'Boulder, CO',
    rating: null,
    totalSessions: 0,
    verified: false,
    bio: '3D animator interested in music and 2D art. Always learning new creative mediums!',
    availability: ['weekday_evenings', 'weekend_afternoons'],
    budget: { min: 35, max: 65, currency: 'USD' }
  }
];

const sampleSkills = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming including variables, functions, and DOM manipulation',
    category: 'Programming',
    subcategory: 'Web Development',
    level: 'Beginner',
    duration: '4 weeks',
    format: 'One-on-one sessions',
    tags: ['javascript', 'programming', 'web-development'],
    teacherId: 'guru_001',
    status: 'published',
    isModifiedMasters: false
  },
  {
    title: 'React Component Design',
    description: 'Master React component architecture, hooks, and state management for modern web apps',
    category: 'Programming',
    subcategory: 'Frontend Development',
    level: 'Intermediate',
    duration: '6 weeks',
    format: 'One-on-one sessions',
    tags: ['react', 'javascript', 'components', 'hooks'],
    teacherId: 'guru_001',
    status: 'published',
    isModifiedMasters: false
  },
  {
    title: 'Strength Training Foundations',
    description: 'Build muscle and strength with proper form, programming, and progression techniques',
    category: 'Fitness',
    subcategory: 'Strength Training',
    level: 'Beginner',
    duration: '8 weeks',
    format: 'In-person sessions',
    tags: ['strength-training', 'fitness', 'muscle-building'],
    teacherId: 'guru_002',
    status: 'published',
    isModifiedMasters: false
  },
  {
    title: 'Spanish Conversation Practice',
    description: 'Improve your Spanish speaking skills through structured conversation practice',
    category: 'Languages',
    subcategory: 'Spanish',
    level: 'Intermediate',
    duration: '12 weeks',
    format: 'One-on-one sessions',
    tags: ['spanish', 'conversation', 'language-learning'],
    teacherId: 'guru_003',
    status: 'published',
    isModifiedMasters: false
  },
  {
    title: 'Jazz Piano Improvisation',
    description: 'Learn jazz piano techniques, chord progressions, and improvisation skills',
    category: 'Music',
    subcategory: 'Piano',
    level: 'Intermediate',
    duration: '10 weeks',
    format: 'One-on-one sessions',
    tags: ['piano', 'jazz', 'improvisation', 'music-theory'],
    teacherId: 'guru_004',
    status: 'published',
    isModifiedMasters: false
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn user-centered design principles, wireframing, and prototyping',
    category: 'Design',
    subcategory: 'UI/UX',
    level: 'Beginner',
    duration: '8 weeks',
    format: 'One-on-one sessions',
    tags: ['ui-ux', 'design', 'user-experience', 'prototyping'],
    teacherId: 'guru_005',
    status: 'published',
    isModifiedMasters: false
  }
];

// AI-generated guru-understudy matches based on skills
const sampleMatches = [
  {
    guruId: 'guru_001',
    understudyId: 'student_001',
    matchScore: 95,
    type: 'perfect_match',
    details: {
      guruOffers: ['JavaScript', 'React', 'Web Development'],
      understudyWants: ['JavaScript', 'Web Development', 'React'],
      sharedInterests: ['Programming', 'Web Technologies'],
      complementarySkills: {
        guru_teaches: 'Web Development',
        understudy_teaches: 'Photography'
      }
    },
    status: 'suggested',
    createdAt: Date.now()
  },
  {
    guruId: 'guru_002',
    understudyId: 'student_002',
    matchScore: 90,
    type: 'skill_exchange',
    details: {
      guruOffers: ['Personal Training', 'Nutrition'],
      understudyWants: ['Personal Training', 'Fitness'],
      complementarySkills: {
        guru_teaches: 'Fitness',
        understudy_teaches: 'Business Strategy'
      }
    },
    status: 'suggested',
    createdAt: Date.now()
  },
  {
    guruId: 'guru_003',
    understudyId: 'student_003',
    matchScore: 92,
    type: 'skill_exchange',
    details: {
      guruOffers: ['Spanish', 'French'],
      understudyWants: ['Spanish', 'Language Learning'],
      complementarySkills: {
        guru_teaches: 'Spanish',
        understudy_teaches: 'Guitar'
      }
    },
    status: 'suggested',
    createdAt: Date.now()
  },
  {
    guruId: 'guru_004',
    understudyId: 'student_004',
    matchScore: 88,
    type: 'creative_match',
    details: {
      guruOffers: ['Piano', 'Music Theory'],
      understudyWants: ['Piano', 'Music Theory'],
      complementarySkills: {
        guru_teaches: 'Music',
        understudy_teaches: '3D Modeling'
      }
    },
    status: 'suggested',
    createdAt: Date.now()
  },
  {
    guruId: 'guru_005',
    understudyId: 'student_004',
    matchScore: 85,
    type: 'creative_match',
    details: {
      guruOffers: ['Digital Art', 'UI/UX Design'],
      understudyWants: ['Digital Art'],
      complementarySkills: {
        guru_teaches: 'Digital Art',
        understudy_teaches: '3D Animation'
      }
    },
    status: 'suggested',
    createdAt: Date.now()
  }
];

// Sample sessions and interactions
const sampleSessions = [
  {
    id: 'session_001',
    guruId: 'guru_001',
    understudyId: 'student_001',
    skillId: 'skill_001',
    title: 'JavaScript Fundamentals - Session 1',
    description: 'Introduction to variables, data types, and basic syntax',
    scheduledFor: Date.now() + (24 * 60 * 60 * 1000), // Tomorrow
    duration: 60, // minutes
    format: 'video_call',
    status: 'scheduled',
    price: 50,
    createdAt: Date.now()
  },
  {
    id: 'session_002',
    guruId: 'guru_002',
    understudyId: 'student_002',
    skillId: 'skill_003',
    title: 'Strength Training Assessment',
    description: 'Initial fitness assessment and goal setting',
    scheduledFor: Date.now() + (2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    duration: 90,
    format: 'in_person',
    status: 'scheduled',
    price: 60,
    createdAt: Date.now()
  }
];

/**
 * Generate comprehensive seed data files
 */
function generateSeedData() {
  const dataDir = path.join(__dirname, '../mock-data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write seed data files
  const seedFiles = {
    'sample-gurus.json': sampleGurus,
    'sample-understudies.json': sampleUnderstudies,
    'sample-skills.json': sampleSkills,
    'sample-matches.json': sampleMatches,
    'sample-sessions.json': sampleSessions
  };

  Object.entries(seedFiles).forEach(([filename, data]) => {
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    logger.info(`💾 Generated ${filename} with ${data.length} records`);
  });

  // Generate summary stats
  const summary = {
    gurus: sampleGurus.length,
    understudies: sampleUnderstudies.length,
    skills: sampleSkills.length,
    matches: sampleMatches.length,
    sessions: sampleSessions.length,
    totalUsers: sampleGurus.length + sampleUnderstudies.length,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(dataDir, 'seed-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  return summary;
}

if (require.main === module) {
  logger.info('🌱 Generating comprehensive seed database...');
  const summary = generateSeedData();
  logger.info('✅ Seed data generation completed!');
  logger.info(`📊 Generated data for ${summary.totalUsers} users, ${summary.skills} skills, ${summary.matches} matches`);
}

module.exports = {
  generateSeedData,
  sampleGurus,
  sampleUnderstudies,
  sampleSkills,
  sampleMatches,
  sampleSessions
};