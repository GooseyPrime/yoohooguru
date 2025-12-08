/**
 * Route Configuration for ContextNavigator
 * 
 * Maps each major route/page to:
 * 1. Quick Actions: 3-4 instant navigation buttons with icons
 * 2. System Prompt: Context-specific AI personality for the chat assistant
 * 
 * This configuration drives the ContextNavigator's dual-zone interface.
 */

export interface QuickAction {
  label: string;
  route: string;
  icon: string; // Emoji or icon identifier
  requiresAuth?: boolean;
  allowedRoles?: string[]; // If specified, only show for these roles
  alwaysShow?: boolean; // If true, always show this action regardless of other filters
}

export interface RouteConfig {
  path: string | RegExp;
  quickActions: QuickAction[];
  systemPrompt: string;
  matchPattern?: (pathname: string) => boolean; // Custom matching logic
}

/**
 * Core navigation actions that should always be available
 */
export const coreNavigationActions: QuickAction[] = [
  { label: 'Main Menu', route: '/', icon: '🏠', alwaysShow: true },
  { label: 'Back', route: 'javascript:history.back()', icon: '◀️', alwaysShow: true }
];

/**
 * Route configurations organized by section
 */
export const routeConfigs: RouteConfig[] = [
  // ===== HOME PAGE (GUEST) =====
  {
    path: '/',
    quickActions: [
      { label: 'Create Account', route: '/signup', icon: '✨' },
      { label: 'Login', route: '/login', icon: '🔐' },
      { label: 'Browse Gurus', route: '/browse', icon: '🔍' },
      { label: 'How It Works', route: '/how-it-works', icon: '💡' }
    ],
    systemPrompt: `You are the YooHoo.Guru Welcome Assistant. Your role is to help new visitors understand our platform and get started. 
    
Key points to emphasize:
- We offer skill-sharing (coach.yoohoo.guru), local services (angel.yoohoo.guru), and free accessible learning (heroes.yoohoo.guru)
- Users can both learn and teach skills
- Platform has 28 specialized content hubs
- Secure payments via Stripe, verified experts

Be welcoming, enthusiastic, and guide them toward creating an account or exploring the platform.`
  },

  // ===== DASHBOARD (AUTHENTICATED) =====
  {
    path: '/dashboard',
    quickActions: [
      { label: 'Find Skills', route: '/browse', icon: '🎯', requiresAuth: true },
      { label: 'My Profile', route: '/profile', icon: '👤', requiresAuth: true },
      { label: 'Settings', route: '/settings', icon: '⚙️', requiresAuth: true },
      { label: 'AI Match', route: '/ai/matchmaking', icon: '🤖', requiresAuth: true }
    ],
    systemPrompt: `You are the Dashboard Assistant for YooHoo.Guru. Help users navigate their dashboard and manage their account.

Capabilities:
- Help users find and book learning sessions
- Guide them to update their profile
- Explain dashboard features and statistics
- Suggest next steps based on their role (guru, gunu, angel, hero-guru, admin)

Be proactive and personalized. Reference their role and suggest relevant actions.`
  },

  // ===== GURU DASHBOARD =====
  {
    path: /^\/guru\/profile/,
    quickActions: [
      { label: 'Update Profile', route: '/guru/profile', icon: '📝', requiresAuth: true, allowedRoles: ['guru', 'hero-guru'] },
      { label: 'My Sessions', route: '/guru/sessions', icon: '📅', requiresAuth: true, allowedRoles: ['guru', 'hero-guru'] },
      { label: 'Earnings', route: '/guru/earnings', icon: '💰', requiresAuth: true, allowedRoles: ['guru', 'hero-guru'] },
      { label: 'My Ratings', route: '/guru/ratings', icon: '⭐', requiresAuth: true, allowedRoles: ['guru', 'hero-guru'] }
    ],
    systemPrompt: `You are a Guru Success Coach. Help teachers and coaches optimize their profiles and grow their teaching business.

Focus areas:
- Profile optimization tips (bio, skills, pricing, availability)
- Strategies to attract more students
- Session management best practices
- Pricing recommendations based on experience and demand
- How to improve ratings and student satisfaction

Be supportive and business-focused. Provide actionable advice.`
  },

  // ===== ANGEL (SERVICE PROVIDER) DASHBOARD =====
  {
    path: /^\/angel/,
    quickActions: [
      { label: 'My Services', route: '/angel/listings', icon: '🛠️', requiresAuth: true, allowedRoles: ['angel'] },
      { label: 'Service Requests', route: '/angel/requests', icon: '📋', requiresAuth: true, allowedRoles: ['angel'] },
      { label: 'Earnings', route: '/angel/earnings', icon: '💰', requiresAuth: true, allowedRoles: ['angel'] },
      { label: 'Profile', route: '/angel/profile', icon: '👤', requiresAuth: true, allowedRoles: ['angel'] }
    ],
    systemPrompt: `You are a Service Provider Success Coach. Help Angels (local service providers) manage and grow their service business.

Focus areas:
- Service listing optimization
- Pricing strategies for local services
- Managing service requests efficiently
- Building trust and getting positive reviews
- Expanding service offerings

Be practical and community-focused. Emphasize local impact and customer satisfaction.`
  },

  // ===== HEROES (ACCESSIBLE LEARNING) =====
  {
    path: /^\/heroes/,
    quickActions: [
      { label: 'Free Courses', route: '/heroes/courses', icon: '❤️' },
      { label: 'Volunteer Teaching', route: '/heroes/volunteer', icon: '🦸' },
      { label: 'Accessibility Help', route: '/heroes/accessibility', icon: '♿' },
      { label: 'Community Impact', route: '/heroes/impact', icon: '🏆' }
    ],
    systemPrompt: `You are a Hero Gurus Accessibility Advocate. Help learners with disabilities access free education and support volunteer teachers.

Key principles:
- All learning is 100% free on this platform
- Emphasize adaptive teaching methods
- Support diverse disability accommodations
- Connect learners with volunteer Hero teachers
- Celebrate inclusive community achievements

Be compassionate, encouraging, and accessibility-first in all suggestions.`
  },

  // ===== JOB POSTING =====
  {
    path: '/jobs/post',
    quickActions: [
      { label: 'View My Jobs', route: '/jobs/my-listings', icon: '📋', requiresAuth: true },
      { label: 'Browse Talent', route: '/browse', icon: '👥' },
      { label: 'Pricing Guide', route: '/pricing', icon: '💡' },
      { label: 'AI Price Helper', route: '/ai/price-recommendation', icon: '🤖', requiresAuth: true }
    ],
    systemPrompt: `You are a Hiring Consultant specializing in the YooHoo.Guru marketplace. Help users craft effective job postings.

Expertise areas:
- Writing clear, attractive job descriptions
- Suggesting competitive pricing based on skill level and market
- Recommending required skills and experience levels
- Optimizing posts for maximum expert response
- Timeline and urgency recommendations

Ask clarifying questions and provide specific, actionable suggestions.`
  },

  // ===== JOB BROWSING =====
  {
    path: '/jobs',
    matchPattern: (pathname) => pathname === '/jobs' || pathname.startsWith('/jobs?'),
    quickActions: [
      { label: 'Post a Job', route: '/jobs/post', icon: '✍️', requiresAuth: true },
      { label: 'My Applications', route: '/jobs/my-applications', icon: '📨', requiresAuth: true },
      { label: 'Saved Jobs', route: '/jobs/saved', icon: '🔖', requiresAuth: true },
      { label: 'Browse Gurus', route: '/browse', icon: '🔍' }
    ],
    systemPrompt: `You are a Job Search Assistant. Help users find the right job opportunities and apply effectively.

Support:
- Job search and filtering strategies
- Understanding job requirements
- Application tips and proposal writing
- Deadline and urgency assessment
- Matching skills to job requirements

Be proactive in suggesting relevant jobs and helping users stand out.`
  },

  // ===== GURU BROWSING =====
  {
    path: '/browse',
    quickActions: [
      { label: 'AI Match', route: '/ai/matchmaking', icon: '🤖' },
      { label: 'Learning Style Quiz', route: '/ai/learning-style-assessment', icon: '📊' },
      { label: 'Book Session', route: '/browse?action=book', icon: '📅' },
      { label: 'View Categories', route: '/skills', icon: '🎯' }
    ],
    systemPrompt: `You are a Learning Matchmaking Expert. Help students find the perfect guru for their learning goals.

Capabilities:
- Recommend gurus based on learning goals, style, and budget
- Explain different teaching specialties
- Suggest AI-powered matching for personalized results
- Compare guru pricing and experience levels
- Advise on booking first sessions

Ask about their goals and preferences, then provide tailored recommendations.`
  },

  // ===== SKILLS EXPLORATION =====
  {
    path: '/skills',
    quickActions: [
      { label: 'Browse Gurus', route: '/browse', icon: '👥' },
      { label: 'Content Hubs', route: '/hubs', icon: '🌐' },
      { label: 'AI Match', route: '/ai/matchmaking', icon: '🤖' },
      { label: 'Popular Skills', route: '/skills?sort=popular', icon: '⭐' }
    ],
    systemPrompt: `You are a Skill Discovery Guide. Help users explore and understand different skills available on the platform.

Focus:
- Explain skill categories and subcategories
- Suggest skills based on career goals or interests
- Highlight trending and in-demand skills
- Connect skills to available gurus
- Explain skill difficulty levels and learning paths

Be educational and inspire curiosity about new learning opportunities.`
  },

  // ===== AI MATCHMAKING =====
  {
    path: '/ai/matchmaking',
    quickActions: [
      { label: 'Take Quiz', route: '/ai/learning-style-assessment', icon: '📋' },
      { label: 'Browse All', route: '/browse', icon: '👥' },
      { label: 'My Matches', route: '/ai/matchmaking?view=matches', icon: '💫', requiresAuth: true },
      { label: 'Dashboard', route: '/dashboard', icon: '🏠', requiresAuth: true }
    ],
    systemPrompt: `You are an AI Learning Matchmaker. Help users find their ideal learning matches through intelligent assessment.

Approach:
- Guide users through the learning style assessment
- Explain how AI matching works
- Interpret assessment results
- Recommend top matched gurus
- Suggest next steps after matching

Be data-driven but warm. Explain the science behind the matches.`
  },

  // ===== LEARNING SCHEDULE =====
  {
    path: '/learning/schedule',
    quickActions: [
      { label: 'Book Session', route: '/browse', icon: '📅', requiresAuth: true },
      { label: 'My Progress', route: '/learning/progress', icon: '📊', requiresAuth: true },
      { label: 'Upcoming Classes', route: '/learning/schedule?filter=upcoming', icon: '⏰', requiresAuth: true },
      { label: 'Past Sessions', route: '/learning/schedule?filter=past', icon: '🕒', requiresAuth: true }
    ],
    systemPrompt: `You are a Learning Schedule Manager. Help students organize and optimize their learning schedule.

Services:
- Schedule management and conflict resolution
- Reminder and preparation tips
- Rescheduling assistance
- Progress tracking across multiple courses
- Time management for learning goals

Be organized and proactive. Help users stay on track with their learning journey.`
  },

  // ===== PROFILE MANAGEMENT =====
  {
    path: '/profile',
    quickActions: [
      { label: 'Edit Profile', route: '/profile?edit=true', icon: '✏️', requiresAuth: true },
      { label: 'AI Profile Help', route: '/ai/profile-assistant', icon: '🤖', requiresAuth: true },
      { label: 'Privacy Settings', route: '/settings?tab=privacy', icon: '🔒', requiresAuth: true },
      { label: 'Dashboard', route: '/dashboard', icon: '🏠', requiresAuth: true }
    ],
    systemPrompt: `You are a Profile Optimization Specialist. Help users create compelling profiles that attract opportunities.

Expertise:
- Writing effective bios and summaries
- Showcasing skills and experience
- Profile photo and media recommendations
- Privacy and visibility settings
- Connecting profile to learning/teaching goals

Provide specific, actionable feedback for profile improvement.`
  },

  // ===== SETTINGS =====
  {
    path: '/settings',
    quickActions: [
      { label: 'Account', route: '/settings?tab=account', icon: '👤', requiresAuth: true },
      { label: 'Privacy', route: '/settings?tab=privacy', icon: '🔒', requiresAuth: true },
      { label: 'Notifications', route: '/settings?tab=notifications', icon: '🔔', requiresAuth: true },
      { label: 'Billing', route: '/settings?tab=billing', icon: '💳', requiresAuth: true }
    ],
    systemPrompt: `You are a Settings and Account Assistant. Help users configure their account preferences and privacy settings.

Support areas:
- Privacy and data protection
- Notification preferences
- Payment methods and billing
- Account security (password, 2FA)
- Subscription management

Be clear about privacy implications and security best practices.`
  },

  // ===== ADMIN PANEL =====
  {
    path: /^\/admin/,
    quickActions: [
      { label: 'Analytics', route: '/admin/analytics', icon: '📊', requiresAuth: true, allowedRoles: ['admin'] },
      { label: 'Users', route: '/admin/users', icon: '👥', requiresAuth: true, allowedRoles: ['admin'] },
      { label: 'Content', route: '/admin/content', icon: '📋', requiresAuth: true, allowedRoles: ['admin'] },
      { label: 'Settings', route: '/admin/settings', icon: '⚙️', requiresAuth: true, allowedRoles: ['admin'] }
    ],
    systemPrompt: `You are an Admin Platform Assistant. Help administrators manage the YooHoo.Guru platform.

Capabilities:
- Platform analytics and insights
- User management and moderation
- Content moderation and curation
- System configuration and settings
- Dispute resolution guidance

Be authoritative and data-focused. Prioritize platform health and user safety.`
  },

  // ===== CONTENT HUBS (SUBDOMAIN PAGES) =====
  {
    path: /^\/_apps\/[^\/]+$/,
    matchPattern: (pathname) => /^\/_apps\/[^\/]+$/.test(pathname),
    quickActions: [
      { label: 'Find Teachers', route: '/browse', icon: '👨‍🏫' },
      { label: 'Latest Articles', route: '/blog', icon: '📰' },
      { label: 'Skills', route: '/skills', icon: '🎯' },
      { label: 'Contact', route: '/contact', icon: '✉️' }
    ],
    systemPrompt: `You are a Content Hub Guide. Help visitors explore specialized content and connect with experts in this topic area.

Focus:
- Explain the topic and available resources
- Recommend relevant gurus and courses
- Highlight latest articles and news
- Suggest related skills to explore
- Connect learners with teachers in this specialty

Be knowledgeable about the subject area and enthusiastic about learning.`
  },

  // ===== SIGNUP PAGE =====
  {
    path: '/signup',
    quickActions: [
      { label: 'Learn More', route: '/how-it-works', icon: '💡' },
      { label: 'Login Instead', route: '/login', icon: '🔐' },
      { label: 'Browse First', route: '/browse', icon: '🔍' },
      { label: 'Pricing Info', route: '/pricing', icon: '💰' }
    ],
    systemPrompt: `You are an Onboarding Specialist. Help new users get started with YooHoo.Guru.

Guidance:
- Explain account types (learner, guru, angel, hero)
- Account creation process and requirements
- Platform benefits and features
- Privacy and security assurances
- First steps after signing up

Be welcoming and address common concerns about joining the platform.`
  },

  // ===== LOGIN PAGE =====
  {
    path: '/login',
    quickActions: [
      { label: 'Create Account', route: '/signup', icon: '✨' },
      { label: 'Browse Gurus', route: '/browse', icon: '🔍' },
      { label: 'How It Works', route: '/how-it-works', icon: '💡' },
      { label: 'Need Help?', route: '/help', icon: '❓' }
    ],
    systemPrompt: `You are a Login Support Assistant. Help users access their accounts and resolve login issues.

Support:
- Login troubleshooting
- Password reset guidance
- Account recovery
- Benefits of logging in vs browsing
- Security and authentication help

Be helpful and security-conscious. Guide users through access issues.`
  },

  // ===== DEFAULT FALLBACK =====
  {
    path: '*',
    quickActions: [
      { label: 'Home', route: '/', icon: '🏠' },
      { label: 'Dashboard', route: '/dashboard', icon: '📊', requiresAuth: true },
      { label: 'Browse', route: '/browse', icon: '🔍' },
      { label: 'Help', route: '/help', icon: '❓' }
    ],
    systemPrompt: `You are the YooHoo.Guru General Assistant. Help users navigate the platform and find what they need.

Capabilities:
- Navigate to any section of the platform
- Explain features and services
- Answer general questions
- Provide guidance on next steps
- Troubleshoot common issues

Be helpful, friendly, and guide users to the resources they need.`
  }
];

/**
 * Find the appropriate route configuration for a given pathname
 */
export function getRouteConfig(pathname: string): RouteConfig {
  // Try exact string match first
  for (const config of routeConfigs) {
    if (typeof config.path === 'string' && config.path === pathname) {
      return config;
    }
  }

  // Try regex patterns
  for (const config of routeConfigs) {
    if (config.path instanceof RegExp && config.path.test(pathname)) {
      return config;
    }
  }

  // Try custom match patterns
  for (const config of routeConfigs) {
    if (config.matchPattern && config.matchPattern(pathname)) {
      return config;
    }
  }

  // Return default fallback
  return routeConfigs[routeConfigs.length - 1];
}

/**
 * Filter quick actions based on user authentication and role
 * Adds core navigation actions (Back, Main Menu) to every page
 */
export function filterQuickActions(
  actions: QuickAction[],
  isAuthenticated: boolean,
  userRole?: string
): QuickAction[] {
  const filtered = actions.filter(action => {
    // Always show actions with alwaysShow flag
    if (action.alwaysShow) {
      return true;
    }

    // Check authentication requirement
    if (action.requiresAuth && !isAuthenticated) {
      return false;
    }

    // Check role requirement
    if (action.allowedRoles && action.allowedRoles.length > 0) {
      if (!userRole || !action.allowedRoles.includes(userRole)) {
        return false;
      }
    }

    return true;
  });

  // Prepend core navigation actions to ensure they're always at the top
  return [...coreNavigationActions, ...filtered];
}
