#!/usr/bin/env node

/**
 * Generate mock data for all subdomain guru pages
 * Creates news articles, blog posts, and stats for each subdomain
 */

const fs = require('fs');
const path = require('path');

// Get subdomain configuration
const { subdomainConfig } = require('../backend/src/config/subdomains');

const mockDataDir = path.join(__dirname, '../backend/src/mock-data');

// Helper to generate realistic IDs
function generateId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// Generate realistic stats
function generateStats() {
  return {
    totalPosts: Math.floor(Math.random() * 30) + 15, // 15-45 posts
    totalViews: Math.floor(Math.random() * 20000) + 10000, // 10k-30k views
    totalLeads: Math.floor(Math.random() * 500) + 100, // 100-600 leads
    monthlyVisitors: Math.floor(Math.random() * 6000) + 3000 // 3k-9k visitors
  };
}

// Content templates for different subdomains
const contentTemplates = {
  art: {
    posts: [
      {
        title: 'Master Color Theory: Transform Your Artwork with Professional Techniques',
        category: 'Art Fundamentals',
        tags: ['color-theory', 'painting', 'art-basics', 'techniques']
      },
      {
        title: 'Digital Art for Beginners: Essential Tools and Techniques',
        category: 'Digital Art',
        tags: ['digital-art', 'software', 'tools', 'beginner-guide']
      },
      {
        title: 'Portrait Drawing Mastery: Capturing Likeness and Emotion',
        category: 'Drawing',
        tags: ['portrait', 'drawing', 'techniques', 'realism']
      },
      {
        title: 'Abstract Art: Breaking Rules to Create Powerful Visual Impact',
        category: 'Abstract Art',
        tags: ['abstract', 'creativity', 'modern-art', 'expression']
      }
    ],
    news: [
      {
        title: 'Digital Art Market Reaches $14 Billion as NFTs Mainstream',
        summary: 'The digital art industry continues explosive growth with traditional galleries embracing digital exhibitions and new platforms emerging.'
      },
      {
        title: 'Art Therapy Programs Show Remarkable Mental Health Benefits',
        summary: 'Recent studies demonstrate that regular artistic practice significantly reduces stress and anxiety while improving overall wellbeing.'
      },
      {
        title: 'Rising Demand for Custom Art Pushes Local Artists Into Spotlight',
        summary: 'Consumers increasingly seek personalized, original artwork over mass-produced prints, creating opportunities for emerging artists.'
      }
    ]
  },
  language: {
    posts: [
      {
        title: 'Mastering Conversational Fluency: Beyond Textbook Learning',
        category: 'Language Learning',
        tags: ['conversation', 'fluency', 'speaking', 'practice']
      },
      {
        title: 'Learn Languages Faster: Science-Backed Memory Techniques',
        category: 'Study Methods',
        tags: ['memory', 'learning', 'retention', 'techniques']
      },
      {
        title: 'Business Spanish Essentials for Professional Success',
        category: 'Business Language',
        tags: ['spanish', 'business', 'professional', 'vocabulary']
      },
      {
        title: 'Cultural Immersion at Home: Authentic Language Practice',
        category: 'Cultural Learning',
        tags: ['culture', 'immersion', 'practice', 'authentic']
      }
    ],
    news: [
      {
        title: 'Multilingualism Linked to Enhanced Cognitive Abilities',
        summary: 'New research shows bilingual individuals demonstrate superior problem-solving skills and delayed cognitive decline.'
      },
      {
        title: 'Language Learning Apps Reach 1 Billion Users Worldwide',
        summary: 'Digital language education platforms continue rapid growth as remote work makes multilingual skills increasingly valuable.'
      },
      {
        title: 'Business Demand for Mandarin Speakers Surges 45% This Year',
        summary: 'Corporate expansion into Asian markets drives unprecedented demand for professionals with Chinese language proficiency.'
      }
    ]
  },
  business: {
    posts: [
      {
        title: 'From Side Hustle to Six Figures: Your Entrepreneurial Roadmap',
        category: 'Entrepreneurship',
        tags: ['entrepreneurship', 'startup', 'business-growth', 'strategy']
      },
      {
        title: 'Digital Marketing Mastery: Proven Strategies That Convert',
        category: 'Marketing',
        tags: ['digital-marketing', 'strategy', 'roi', 'growth']
      },
      {
        title: 'Leadership Excellence: Building High-Performance Teams',
        category: 'Leadership',
        tags: ['leadership', 'team-building', 'management', 'culture']
      },
      {
        title: 'Business Finance Fundamentals: Smart Money Management',
        category: 'Finance',
        tags: ['finance', 'accounting', 'budgeting', 'profit']
      }
    ],
    news: [
      {
        title: 'Small Business Launches Hit Record High in 2024',
        summary: 'Entrepreneurship surges as remote work flexibility and digital tools lower barriers to entry for new business owners.'
      },
      {
        title: 'AI Tools Transform Business Operations for SMBs',
        summary: 'Small and medium businesses leverage artificial intelligence to compete with larger corporations in efficiency and innovation.'
      },
      {
        title: 'Sustainability Focus Drives Consumer Purchasing Decisions',
        summary: 'Businesses prioritizing environmental responsibility see significant competitive advantage as conscious consumerism grows.'
      }
    ]
  },
  design: {
    posts: [
      {
        title: 'UI/UX Design Principles: Creating Intuitive User Experiences',
        category: 'UI/UX Design',
        tags: ['ui-ux', 'user-experience', 'interface-design', 'usability']
      },
      {
        title: 'Brand Identity Design: Building Memorable Visual Systems',
        category: 'Branding',
        tags: ['branding', 'identity', 'logo-design', 'visual-identity']
      },
      {
        title: 'Typography Mastery: The Art of Beautiful, Readable Text',
        category: 'Typography',
        tags: ['typography', 'fonts', 'design-fundamentals', 'hierarchy']
      },
      {
        title: 'Design Systems: Scaling Consistency Across Products',
        category: 'Design Systems',
        tags: ['design-systems', 'components', 'consistency', 'scalability']
      }
    ],
    news: [
      {
        title: 'Dark Mode Design Becomes Standard as User Preference Shifts',
        summary: 'Over 80% of users now prefer dark mode interfaces, prompting designers to prioritize dark-first design approaches.'
      },
      {
        title: 'Accessibility-First Design Gains Momentum in Tech Industry',
        summary: 'Major companies commit to WCAG compliance as inclusive design becomes both ethical imperative and business advantage.'
      },
      {
        title: 'Figma Usage Surpasses 4 Million Designers Worldwide',
        summary: 'Collaborative design tools transform workflows as remote design teams become the industry standard.'
      }
    ]
  },
  writing: {
    posts: [
      {
        title: 'Compelling Storytelling: Craft Narratives That Captivate Readers',
        category: 'Creative Writing',
        tags: ['storytelling', 'narrative', 'fiction', 'craft']
      },
      {
        title: 'Copywriting That Converts: Psychology-Driven Persuasion',
        category: 'Copywriting',
        tags: ['copywriting', 'marketing', 'conversion', 'persuasion']
      },
      {
        title: 'Blog Writing Success: Build Your Audience and Authority',
        category: 'Blogging',
        tags: ['blogging', 'content-marketing', 'audience', 'seo']
      },
      {
        title: 'Editing Excellence: Transform Good Writing Into Great',
        category: 'Editing',
        tags: ['editing', 'revision', 'craft', 'improvement']
      }
    ],
    news: [
      {
        title: 'Self-Published Authors Earn $2 Billion in 2024',
        summary: 'Digital publishing platforms democratize book publishing, enabling authors to reach global audiences independently.'
      },
      {
        title: 'Content Writing Demand Grows 60% as Businesses Prioritize SEO',
        summary: 'Companies invest heavily in quality content creation as search engines reward valuable, authoritative writing.'
      },
      {
        title: 'AI Writing Tools Enhance Rather Than Replace Human Creativity',
        summary: 'Professional writers leverage AI assistants for research and drafts while maintaining creative control and voice.'
      }
    ]
  },
  photography: {
    posts: [
      {
        title: 'Portrait Photography Mastery: Lighting and Posing Techniques',
        category: 'Portrait Photography',
        tags: ['portrait', 'lighting', 'posing', 'techniques']
      },
      {
        title: 'Landscape Photography: Capturing Nature\'s Breathtaking Beauty',
        category: 'Landscape Photography',
        tags: ['landscape', 'nature', 'composition', 'golden-hour']
      },
      {
        title: 'Photo Editing Workflow: From RAW to Final Masterpiece',
        category: 'Editing',
        tags: ['editing', 'lightroom', 'photoshop', 'workflow']
      },
      {
        title: 'Wedding Photography Business: Build a Thriving Career',
        category: 'Business',
        tags: ['wedding-photography', 'business', 'marketing', 'career']
      }
    ],
    news: [
      {
        title: 'Mirrorless Camera Sales Surpass DSLRs for First Time',
        summary: 'Technology advances make mirrorless systems the new standard as manufacturers shift focus from DSLR development.'
      },
      {
        title: 'Photography Market Grows as Visual Content Demand Soars',
        summary: 'Social media and digital marketing drive unprecedented need for professional photography across industries.'
      },
      {
        title: 'Smartphone Photography Reaches Professional Quality Levels',
        summary: 'Computational photography innovations blur lines between smartphone and professional camera capabilities.'
      }
    ]
  },
  gardening: {
    posts: [
      {
        title: 'Vegetable Gardening for Beginners: Grow Your Own Fresh Produce',
        category: 'Vegetable Gardening',
        tags: ['vegetables', 'beginners', 'organic', 'harvest']
      },
      {
        title: 'Composting Mastery: Turn Waste Into Black Gold for Your Garden',
        category: 'Composting',
        tags: ['composting', 'organic', 'soil-health', 'sustainability']
      },
      {
        title: 'Container Gardening: Maximize Small Spaces for Big Harvests',
        category: 'Container Gardening',
        tags: ['containers', 'small-space', 'urban-gardening', 'balcony']
      },
      {
        title: 'Permaculture Principles: Design Self-Sustaining Gardens',
        category: 'Permaculture',
        tags: ['permaculture', 'sustainable', 'design', 'ecosystem']
      }
    ],
    news: [
      {
        title: 'Home Vegetable Gardens Save Families $600 Annually',
        summary: 'Economic pressures drive gardening resurgence as families discover significant savings from homegrown produce.'
      },
      {
        title: 'Urban Farming Initiatives Transform City Landscapes',
        summary: 'Municipalities support community gardens and vertical farming to improve food security and green spaces.'
      },
      {
        title: 'Native Plant Gardening Movement Gains Environmental Momentum',
        summary: 'Gardeners embrace native species to support pollinators and reduce water usage amid climate concerns.'
      }
    ]
  },
  crafts: {
    posts: [
      {
        title: 'Woodworking Fundamentals: Essential Skills for Every Project',
        category: 'Woodworking',
        tags: ['woodworking', 'fundamentals', 'tools', 'techniques']
      },
      {
        title: 'Knitting for Beginners: From First Stitch to Finished Garment',
        category: 'Knitting',
        tags: ['knitting', 'beginners', 'patterns', 'yarn']
      },
      {
        title: 'Pottery Basics: Hand-Building Beautiful Ceramic Pieces',
        category: 'Pottery',
        tags: ['pottery', 'ceramics', 'hand-building', 'clay']
      },
      {
        title: 'Jewelry Making: Create Stunning Handcrafted Accessories',
        category: 'Jewelry Making',
        tags: ['jewelry', 'metalwork', 'beading', 'design']
      }
    ],
    news: [
      {
        title: 'Handmade Crafts Market Reaches $47 Billion Globally',
        summary: 'Consumers increasingly value unique, handcrafted items over mass-produced goods, fueling artisan economy.'
      },
      {
        title: 'Craft Therapy Programs Reduce Anxiety and Depression',
        summary: 'Mental health professionals incorporate crafting activities as evidence-based treatments for stress and mood disorders.'
      },
      {
        title: 'Sustainable Crafting Movement Emphasizes Upcycled Materials',
        summary: 'Artisans lead environmental efforts by transforming waste materials into beautiful, functional crafts.'
      }
    ]
  },
  wellness: {
    posts: [
      {
        title: 'Meditation for Beginners: Find Peace in Daily Practice',
        category: 'Meditation',
        tags: ['meditation', 'mindfulness', 'stress-relief', 'beginners']
      },
      {
        title: 'Stress Management Techniques That Actually Work',
        category: 'Stress Management',
        tags: ['stress', 'management', 'coping', 'resilience']
      },
      {
        title: 'Mindful Living: Bring Presence to Every Moment',
        category: 'Mindfulness',
        tags: ['mindfulness', 'presence', 'awareness', 'living']
      },
      {
        title: 'Holistic Health: Balance Mind, Body, and Spirit',
        category: 'Holistic Health',
        tags: ['holistic', 'balance', 'integrative', 'wellness']
      }
    ],
    news: [
      {
        title: 'Meditation Apps Report 500% Growth in Active Users',
        summary: 'Mental wellness focus drives adoption of digital mindfulness tools across all age demographics.'
      },
      {
        title: 'Corporate Wellness Programs Reduce Healthcare Costs 25%',
        summary: 'Companies investing in employee wellbeing see significant returns through reduced absenteeism and medical claims.'
      },
      {
        title: 'Breathwork Therapy Gains Recognition in Mental Health Field',
        summary: 'Scientific studies validate ancient breathing techniques as powerful tools for anxiety and trauma treatment.'
      }
    ]
  },
  finance: {
    posts: [
      {
        title: 'Investment Fundamentals: Build Long-Term Wealth Strategically',
        category: 'Investing',
        tags: ['investing', 'wealth', 'strategy', 'portfolio']
      },
      {
        title: 'Budgeting Mastery: Take Control of Your Financial Future',
        category: 'Budgeting',
        tags: ['budgeting', 'saving', 'planning', 'management']
      },
      {
        title: 'Tax Planning Strategies: Keep More of What You Earn',
        category: 'Tax Planning',
        tags: ['taxes', 'planning', 'deductions', 'strategy']
      },
      {
        title: 'Retirement Planning: Secure Your Financial Independence',
        category: 'Retirement',
        tags: ['retirement', '401k', 'ira', 'planning']
      }
    ],
    news: [
      {
        title: 'Personal Finance Education Mandated in 25 States',
        summary: 'Legislative push to teach financial literacy in schools addresses growing concern over consumer debt levels.'
      },
      {
        title: 'Index Fund Investing Reaches All-Time High Popularity',
        summary: 'Low-cost passive investing strategies continue gaining market share as investors prioritize fees and diversification.'
      },
      {
        title: 'Financial Planning Demand Soars as Retirement Concerns Grow',
        summary: 'Aging population and pension uncertainty drive record numbers to seek professional financial advice.'
      }
    ]
  },
  home: {
    posts: [
      {
        title: 'Home Organization Systems: Create Clutter-Free Living Spaces',
        category: 'Organization',
        tags: ['organization', 'declutter', 'storage', 'systems']
      },
      {
        title: 'Deep Cleaning Guide: Professional Results at Home',
        category: 'Cleaning',
        tags: ['cleaning', 'deep-clean', 'maintenance', 'techniques']
      },
      {
        title: 'DIY Home Improvement: Transform Your Space on a Budget',
        category: 'Home Improvement',
        tags: ['diy', 'renovation', 'improvement', 'budget']
      },
      {
        title: 'Interior Design Basics: Style Your Home Like a Pro',
        category: 'Interior Design',
        tags: ['interior-design', 'styling', 'decor', 'aesthetics']
      }
    ],
    news: [
      {
        title: 'Home Organization Industry Grows as Minimalism Trends',
        summary: 'Professional organizers see record demand as consumers embrace decluttering and intentional living philosophies.'
      },
      {
        title: 'Smart Home Technology Adoption Reaches 50% of US Households',
        summary: 'Automation and IoT devices become standard features as homeowners prioritize convenience and efficiency.'
      },
      {
        title: 'DIY Home Improvement Saves Homeowners Thousands Annually',
        summary: 'YouTube tutorials and accessible tools empower homeowners to tackle projects previously requiring contractors.'
      }
    ]
  },
  data: {
    posts: [
      {
        title: 'Data Science Fundamentals: From Spreadsheets to Insights',
        category: 'Data Science',
        tags: ['data-science', 'analytics', 'fundamentals', 'insights']
      },
      {
        title: 'SQL Mastery: Query Databases Like a Professional',
        category: 'SQL',
        tags: ['sql', 'databases', 'queries', 'programming']
      },
      {
        title: 'Python for Data Analysis: Essential Libraries and Techniques',
        category: 'Python',
        tags: ['python', 'pandas', 'numpy', 'analysis']
      },
      {
        title: 'Data Visualization: Tell Compelling Stories with Numbers',
        category: 'Visualization',
        tags: ['visualization', 'charts', 'storytelling', 'dashboards']
      }
    ],
    news: [
      {
        title: 'Data Scientist Named Top Job for Fourth Consecutive Year',
        summary: 'Glassdoor rankings highlight sustained demand for professionals who can extract insights from complex datasets.'
      },
      {
        title: 'Companies Increase Data Analytics Budgets 40% in 2024',
        summary: 'Businesses prioritize data-driven decision making as competitive advantage in uncertain economic climate.'
      },
      {
        title: 'AI and Machine Learning Transform Traditional Analytics',
        summary: 'Automated insights and predictive models become accessible to analysts beyond specialized data science teams.'
      }
    ]
  },
  investing: {
    posts: [
      {
        title: 'Stock Trading Strategies: Build Your Investment Portfolio',
        category: 'Stock Trading',
        tags: ['stocks', 'trading', 'portfolio', 'strategy']
      },
      {
        title: 'Cryptocurrency Investing: Navigate Digital Asset Markets',
        category: 'Cryptocurrency',
        tags: ['crypto', 'bitcoin', 'ethereum', 'blockchain']
      },
      {
        title: 'Real Estate Investing: Generate Passive Income Through Property',
        category: 'Real Estate',
        tags: ['real-estate', 'property', 'rental-income', 'investing']
      },
      {
        title: 'Options Trading Fundamentals: Advanced Investment Strategies',
        category: 'Options Trading',
        tags: ['options', 'derivatives', 'strategy', 'risk-management']
      }
    ],
    news: [
      {
        title: 'Individual Investors Drive Record Stock Market Participation',
        summary: 'Zero-commission trading and investment apps enable broader access to financial markets than ever before.'
      },
      {
        title: 'ESG Investing Grows 300% as Values-Based Strategy Mainstreams',
        summary: 'Investors increasingly align portfolios with environmental and social values without sacrificing returns.'
      },
      {
        title: 'Cryptocurrency Adoption Accelerates Among Institutional Investors',
        summary: 'Major financial institutions add digital assets to portfolios as regulatory clarity improves market confidence.'
      }
    ]
  },
  marketing: {
    posts: [
      {
        title: 'Digital Marketing Strategy: Build Your Online Presence',
        category: 'Digital Marketing',
        tags: ['digital-marketing', 'strategy', 'online', 'presence']
      },
      {
        title: 'SEO Mastery: Rank Higher in Search Results',
        category: 'SEO',
        tags: ['seo', 'search-engine', 'ranking', 'organic']
      },
      {
        title: 'Social Media Marketing: Engage and Convert Your Audience',
        category: 'Social Media',
        tags: ['social-media', 'engagement', 'content', 'conversion']
      },
      {
        title: 'Content Marketing Excellence: Create Value That Attracts Customers',
        category: 'Content Marketing',
        tags: ['content-marketing', 'value', 'inbound', 'strategy']
      }
    ],
    news: [
      {
        title: 'Video Marketing Dominates as Consumer Preference Shifts',
        summary: 'Short-form video content drives engagement across platforms as attention spans favor dynamic visual media.'
      },
      {
        title: 'Marketing Automation Adoption Grows 85% Among SMBs',
        summary: 'Small businesses leverage technology to compete with larger companies in personalized customer engagement.'
      },
      {
        title: 'Influencer Marketing Industry Exceeds $21 Billion Globally',
        summary: 'Brands allocate increasing budgets to authentic creator partnerships as traditional advertising effectiveness wanes.'
      }
    ]
  },
  sales: {
    posts: [
      {
        title: 'Sales Mastery: Psychology-Driven Techniques That Close Deals',
        category: 'Sales Techniques',
        tags: ['sales', 'techniques', 'psychology', 'closing']
      },
      {
        title: 'Negotiation Excellence: Win-Win Strategies for Success',
        category: 'Negotiation',
        tags: ['negotiation', 'strategy', 'communication', 'tactics']
      },
      {
        title: 'Cold Calling That Works: Modern Approaches to Outreach',
        category: 'Cold Calling',
        tags: ['cold-calling', 'outreach', 'prospecting', 'technique']
      },
      {
        title: 'CRM Mastery: Leverage Technology for Sales Success',
        category: 'CRM',
        tags: ['crm', 'technology', 'pipeline', 'management']
      }
    ],
    news: [
      {
        title: 'Sales Professionals Embrace AI Tools for Productivity',
        summary: 'Automation and artificial intelligence free sales teams to focus on relationship building and strategic activities.'
      },
      {
        title: 'Virtual Selling Becomes Permanent Fixture in B2B Sales',
        summary: 'Remote sales proven equally effective as in-person meetings, fundamentally changing business development approach.'
      },
      {
        title: 'Sales Training Investment Shows 350% ROI for Companies',
        summary: 'Organizations prioritizing continuous sales education see dramatic improvements in revenue and retention.'
      }
    ]
  },
  coding: {
    posts: [
      {
        title: 'JavaScript Fundamentals: Build Interactive Web Applications',
        category: 'JavaScript',
        tags: ['javascript', 'web-development', 'fundamentals', 'programming']
      },
      {
        title: 'Python Programming: From Beginner to Professional',
        category: 'Python',
        tags: ['python', 'programming', 'beginners', 'development']
      },
      {
        title: 'React Mastery: Build Modern User Interfaces',
        category: 'React',
        tags: ['react', 'frontend', 'components', 'javascript']
      },
      {
        title: 'Algorithm Design: Master Problem-Solving Strategies',
        category: 'Algorithms',
        tags: ['algorithms', 'data-structures', 'problem-solving', 'optimization']
      }
    ],
    news: [
      {
        title: 'Software Developer Demand Outpaces Supply by 200%',
        summary: 'Technology job market remains hot as digital transformation accelerates across all industries.'
      },
      {
        title: 'Coding Bootcamps Report 90% Job Placement Success Rate',
        summary: 'Alternative education paths prove effective as employers prioritize skills over traditional degrees.'
      },
      {
        title: 'Remote Development Jobs Increase 400% Since 2020',
        summary: 'Programming becomes one of most flexible careers as companies embrace distributed workforce models.'
      }
    ]
  }
};

// Generate detailed blog post content
function generateBlogPost(template, subdomain, index) {
  const publishDate = new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)); // 1 week apart
  
  return {
    id: generateId(template.title),
    title: template.title,
    slug: generateId(template.title),
    excerpt: `Expert insights and practical guidance on ${template.category.toLowerCase()}. Learn proven techniques and strategies to excel in ${subdomain}.`,
    content: `This is a comprehensive guide to ${template.title.toLowerCase()}. This article covers essential concepts, practical techniques, and actionable strategies that you can implement immediately.\n\n## Why This Matters\n\nMastering these skills will transform your ${subdomain} practice and help you achieve professional-level results.\n\n## Key Takeaways\n\n- Essential foundations you need to know\n- Practical techniques for immediate application\n- Common mistakes to avoid\n- Advanced strategies for growth\n- Resources for continued learning\n\n## Getting Started\n\nBegin with the fundamentals and build progressively. Practice consistently and seek feedback from experienced practitioners.\n\n## Next Steps\n\nApply what you've learned and continue your education journey. Join our community to connect with fellow learners and experts in ${subdomain}.`,
    author: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Expert`,
    category: template.category,
    tags: template.tags,
    publishedAt: publishDate.toISOString(),
    featured: index < 2, // First 2 posts are featured
    estimatedReadTime: `${Math.floor(Math.random() * 5) + 6} min`,
    viewCount: Math.floor(Math.random() * 3000) + 500,
    status: 'published'
  };
}

// Generate news article
function generateNewsArticle(template, index) {
  const publishDate = new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)); // 3 days apart
  
  return {
    id: generateId(template.title),
    title: template.title,
    summary: template.summary,
    url: '#',
    publishedAt: publishDate.toISOString(),
    source: 'Industry News Network'
  };
}

// Generate mock data for a subdomain
function generateMockData(subdomain) {
  const template = contentTemplates[subdomain];
  
  if (!template) {
    console.warn(`No template found for ${subdomain}, skipping...`);
    return null;
  }
  
  const posts = template.posts.map((postTemplate, index) => 
    generateBlogPost(postTemplate, subdomain, index)
  );
  
  const news = template.news.map((newsTemplate, index) => 
    generateNewsArticle(newsTemplate, index)
  );
  
  const stats = generateStats();
  
  return {
    posts,
    news,
    stats
  };
}

// Main execution
function main() {
  console.log('🚀 Generating mock data for subdomains...\n');
  
  // Get all configured subdomains
  const allSubdomains = Object.keys(subdomainConfig);
  
  // Check which ones already have mock data
  const existingFiles = fs.existsSync(mockDataDir) 
    ? fs.readdirSync(mockDataDir).filter(f => f.endsWith('.json') && !f.startsWith('sample') && !f.startsWith('seed'))
    : [];
  
  const existingSubdomains = existingFiles.map(f => f.replace('.json', ''));
  
  console.log(`📊 Found ${allSubdomains.length} configured subdomains`);
  console.log(`✅ ${existingSubdomains.length} already have mock data`);
  console.log(`❌ ${allSubdomains.length - existingSubdomains.length} need mock data\n`);
  
  let generatedCount = 0;
  let skippedCount = 0;
  
  for (const subdomain of allSubdomains) {
    const outputPath = path.join(mockDataDir, `${subdomain}.json`);
    
    // Skip if file already exists and we're not forcing regeneration
    if (fs.existsSync(outputPath) && !process.argv.includes('--force')) {
      console.log(`⏭️  Skipping ${subdomain} (already exists)`);
      skippedCount++;
      continue;
    }
    
    const mockData = generateMockData(subdomain);
    
    if (mockData) {
      fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2));
      console.log(`✅ Generated ${subdomain}.json (${mockData.posts.length} posts, ${mockData.news.length} news)`);
      generatedCount++;
    } else {
      console.log(`❌ Failed to generate ${subdomain}.json`);
    }
  }
  
  console.log(`\n🎉 Complete! Generated ${generatedCount} new files, skipped ${skippedCount} existing files`);
  console.log(`📁 Mock data location: ${mockDataDir}`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generateMockData };
