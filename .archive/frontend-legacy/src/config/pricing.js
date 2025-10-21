// Pricing configuration for yoohoo.guru platform
// Move this to environment variables or CMS in production

export const PRICING_CONFIG = {
  // Stripe Configuration
  stripe: {
    // These should be moved to environment variables
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key',
    pricingTableId: process.env.REACT_APP_STRIPE_PRICING_TABLE_ID || 'prctbl_your_pricing_table_id',
    
    // Individual price IDs for direct integration
    prices: {
      community: process.env.REACT_APP_STRIPE_PRICE_COMMUNITY || 'price_community_free',
      skillSharer: process.env.REACT_APP_STRIPE_PRICE_SKILL_SHARER || 'price_skill_sharer_monthly',
      premiumAngel: process.env.REACT_APP_STRIPE_PRICE_PREMIUM_ANGEL || 'price_premium_angel_monthly'
    }
  },

  // Plan Details
  plans: [
    {
      id: 'community',
      name: 'Community Member',
      price: 0,
      interval: 'forever',
      popular: false,
      description: 'Perfect for getting started with skill sharing',
      features: [
        'Create your profile',
        'Browse skills and services',
        'Connect with neighbors',
        'Basic messaging',
        'Community access',
        'Safety guidelines and tips'
      ],
      limitations: [
        'Limited to 2 active posts',
        'Basic profile visibility',
        'Standard support'
      ],
      cta: 'Get Started Free',
      ctaVariant: 'outline'
    },
    {
      id: 'skillSharer',
      name: 'Skill Sharer',
      price: 9,
      interval: 'month',
      popular: true,
      description: 'For active skill sharers and service providers',
      features: [
        'Everything in Community',
        'Unlimited skill posts',
        'AI-powered matching',
        'Priority in search results',
        'Enhanced profile with photos',
        'Customer review system',
        'Analytics dashboard',
        'Marketing tools',
        'Priority support'
      ],
      limitations: [],
      cta: 'Start Sharing Skills',
      ctaVariant: 'primary'
    },
    {
      id: 'premiumAngel',
      name: 'Premium Angel',
      price: 19,
      interval: 'month',
      popular: false,
      description: 'For power users and service professionals',
      features: [
        'Everything in Skill Sharer',
        'Advanced AI recommendations',
        'Detailed analytics and insights',
        'Custom branding options',
        'API access for integrations',
        'White-label subdomain',
        'Advanced booking management',
        'Revenue optimization tools',
        'Dedicated account manager',
        'Custom onboarding'
      ],
      limitations: [],
      cta: 'Go Premium',
      ctaVariant: 'primary'
    }
  ]
};

// Earnings estimator data
export const EARNINGS_DATA = {
  categories: [
    {
      id: 'tutoring',
      name: 'Tutoring & Education',
      icon: '🎓',
      baseRate: 25,
      hourlyRange: [15, 75],
      demandMultiplier: 1.2,
      skills: [
        { name: 'Math Tutoring', rate: 30, demand: 'high' },
        { name: 'Language Learning', rate: 25, demand: 'high' },
        { name: 'Music Lessons', rate: 35, demand: 'medium' },
        { name: 'Test Prep', rate: 45, demand: 'very-high' },
        { name: 'Computer Skills', rate: 40, demand: 'high' }
      ]
    },
    {
      id: 'handyman',
      name: 'Handyman & Repairs',
      icon: '🔧',
      baseRate: 35,
      hourlyRange: [20, 85],
      demandMultiplier: 1.1,
      skills: [
        { name: 'Basic Repairs', rate: 30, demand: 'high' },
        { name: 'Furniture Assembly', rate: 25, demand: 'very-high' },
        { name: 'Plumbing', rate: 55, demand: 'high' },
        { name: 'Electrical Work', rate: 65, demand: 'medium' },
        { name: 'Painting', rate: 35, demand: 'high' }
      ]
    },
    {
      id: 'creative',
      name: 'Creative Services',
      icon: '🎨',
      baseRate: 30,
      hourlyRange: [20, 100],
      demandMultiplier: 0.9,
      skills: [
        { name: 'Graphic Design', rate: 40, demand: 'medium' },
        { name: 'Photography', rate: 50, demand: 'medium' },
        { name: 'Writing & Editing', rate: 35, demand: 'high' },
        { name: 'Web Design', rate: 60, demand: 'high' },
        { name: 'Video Editing', rate: 45, demand: 'medium' }
      ]
    },
    {
      id: 'petCare',
      name: 'Pet Care',
      icon: '🐕',
      baseRate: 20,
      hourlyRange: [15, 50],
      demandMultiplier: 1.3,
      skills: [
        { name: 'Dog Walking', rate: 20, demand: 'very-high' },
        { name: 'Pet Sitting', rate: 25, demand: 'very-high' },
        { name: 'Pet Grooming', rate: 35, demand: 'high' },
        { name: 'Pet Training', rate: 40, demand: 'medium' },
        { name: 'Veterinary Care', rate: 75, demand: 'low' }
      ]
    },
    {
      id: 'fitness',
      name: 'Fitness & Wellness',
      icon: '💪',
      baseRate: 35,
      hourlyRange: [25, 80],
      demandMultiplier: 1.0,
      skills: [
        { name: 'Personal Training', rate: 50, demand: 'high' },
        { name: 'Yoga Instruction', rate: 40, demand: 'high' },
        { name: 'Massage Therapy', rate: 60, demand: 'medium' },
        { name: 'Nutrition Coaching', rate: 45, demand: 'medium' },
        { name: 'Life Coaching', rate: 55, demand: 'low' }
      ]
    },
    {
      id: 'household',
      name: 'Household Services',
      icon: '🏠',
      baseRate: 25,
      hourlyRange: [15, 60],
      demandMultiplier: 1.4,
      skills: [
        { name: 'House Cleaning', rate: 25, demand: 'very-high' },
        { name: 'Organizing', rate: 30, demand: 'high' },
        { name: 'Gardening', rate: 28, demand: 'high' },
        { name: 'Meal Prep', rate: 35, demand: 'medium' },
        { name: 'Elder Care', rate: 22, demand: 'high' }
      ]
    }
  ],

  // Demand multipliers by location type
  locationMultipliers: {
    urban: 1.2,
    suburban: 1.0,
    rural: 0.8
  },

  // Experience level multipliers
  experienceMultipliers: {
    beginner: 0.8,
    intermediate: 1.0,
    experienced: 1.3,
    expert: 1.6
  }
};

export default PRICING_CONFIG;