const express = require('express');
const { getFirestore } = require('../config/firebase');
const admin = require('firebase-admin');
const { requireGuru } = require('../middleware/subdomainHandler');
const { getSubdomainConfig, isValidSubdomain } = require('../config/subdomains');
const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * Middleware to validate subdomain parameter in URL path
 * This handles cases where subdomain comes from URL path rather than host header
 */
function validateSubdomainParam(req, res, next) {
  const { subdomain } = req.params;
  
  // Allow OPTIONS requests to pass through for CORS preflight, even with invalid subdomains
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  if (!subdomain) {
    return res.status(400).json({
      error: 'Missing subdomain parameter',
      message: 'Subdomain parameter is required'
    });
  }

  // Check if it's a valid guru subdomain
  if (!isValidSubdomain(subdomain)) {
    logger.warn(`Invalid guru subdomain requested: ${subdomain}`, {
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(404).json({
      error: 'Invalid guru subdomain',
      message: `Guru subdomain "${subdomain}" not found`,
      availableSubdomains: Object.keys(require('../config/subdomains').subdomainConfig)
    });
  }

  // Set guru context based on URL parameter
  const config = getSubdomainConfig(subdomain);
  req.guru = {
    subdomain,
    config,
    isGuru: true,
    isMainSite: false,
    source: 'url-param' // Indicate this came from URL parameter, not host
  };

  next();
}

// Apply subdomain parameter validation to routes with subdomain in path
// This targets the problematic patterns from the error logs
router.use('/:subdomain/home', validateSubdomainParam);
router.use('/:subdomain/services', validateSubdomainParam);
router.use('/:subdomain/posts', validateSubdomainParam);
router.use('/:subdomain/posts/:slug', validateSubdomainParam);
router.use('/:subdomain/leads', validateSubdomainParam);
router.use('/:subdomain/about', validateSubdomainParam);

// For the news route, we need a different approach since it's /news/:subdomain
router.use('/news/:subdomain', (req, res, next) => {
  const { subdomain } = req.params;
  
  // Allow OPTIONS requests to pass through for CORS preflight, even with invalid subdomains
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  if (!subdomain) {
    return res.status(400).json({
      error: 'Missing subdomain parameter',
      message: 'Subdomain parameter is required'
    });
  }

  // Check if it's a valid guru subdomain
  if (!isValidSubdomain(subdomain)) {
    logger.warn(`Invalid guru subdomain requested in news: ${subdomain}`, {
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(404).json({
      error: 'Invalid guru subdomain',
      message: `Guru subdomain "${subdomain}" not found`,
      availableSubdomains: Object.keys(require('../config/subdomains').subdomainConfig)
    });
  }

  // Set guru context based on URL parameter
  const config = getSubdomainConfig(subdomain);
  req.guru = {
    subdomain,
    config,
    isGuru: true,
    isMainSite: false,
    source: 'url-param' // Indicate this came from URL parameter, not host
  };

  next();
});

/**
 * GET /:subdomain/home
 * Get guru homepage data including featured posts and character info
 */
router.get('/:subdomain/home', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getFirestore();
    
    // Validate subdomain matches middleware
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch',
        message: 'Request subdomain does not match detected subdomain'
      });
    }
    
    // Get featured posts for the guru
    const postsSnapshot = await db.collection('gurus').doc(subdomain).collection('posts')
      .where('featured', '==', true)
      .limit(6)
      .get();
    
    const featuredPosts = [];
    postsSnapshot.forEach(doc => {
      featuredPosts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // If we don't have enough featured posts, get recent ones
    if (featuredPosts.length < 6) {
      const recentPostsSnapshot = await db.collection('gurus').doc(subdomain).collection('posts')
        .orderBy('publishedAt', 'desc')
        .limit(6 - featuredPosts.length)
        .get();
      
      recentPostsSnapshot.forEach(doc => {
        const post = { id: doc.id, ...doc.data() };
        if (!featuredPosts.find(p => p.id === post.id)) {
          featuredPosts.push(post);
        }
      });
    }

    // If still no posts, try to load from seeded content files
    if (featuredPosts.length === 0) {
      const path = require('path');
      const fs = require('fs');
      
      try {
        const mockDataPath = path.join(__dirname, '../../mock-data', `${subdomain}.json`);
        if (fs.existsSync(mockDataPath)) {
          const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
          if (mockData.posts && mockData.posts.length > 0) {
            // Use the pre-generated blog posts
            mockData.posts.forEach(post => {
              featuredPosts.push({
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author,
                category: post.category,
                tags: post.tags,
                publishedAt: post.publishedAt,
                readTime: post.readTime,
                views: post.views,
                likes: post.likes,
                status: post.status,
                featured: post.featured
              });
            });
            logger.info(`📝 Serving ${featuredPosts.length} seeded blog posts for ${subdomain}`);
          }
        }
      } catch (fileError) {
        logger.warn(`Could not load seeded blog content for ${subdomain}:`, fileError.message);
      }
    }
    
    // Get guru stats
    const statsSnapshot = await db.collection('gurus').doc(subdomain).collection('stats').get();
    let stats = {
      totalPosts: 0,
      totalViews: 0,
      totalLeads: 0,
      monthlyVisitors: 0
    };
    
    if (!statsSnapshot.empty) {
      // Get the first stats document or aggregate if multiple
      statsSnapshot.forEach(doc => {
        const data = doc.data();
        stats = { ...stats, ...data };
      });
    }

    // If no stats in database, try to load from seeded content
    if (stats.totalPosts === 0 && stats.totalViews === 0) {
      const path = require('path');
      const fs = require('fs');
      
      try {
        const mockDataPath = path.join(__dirname, '../../mock-data', `${subdomain}.json`);
        if (fs.existsSync(mockDataPath)) {
          const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
          if (mockData.stats) {
            stats = { ...stats, ...mockData.stats };
            logger.info(`📊 Serving seeded stats for ${subdomain}:`, stats);
          }
        }
      } catch (fileError) {
        logger.warn(`Could not load seeded stats for ${subdomain}:`, fileError.message);
      }
    }
    
    // Format large numbers (show as "K+" when >= 1000)
    const formatStat = (value) => {
      if (!value || value === 0) return null;
      if (value >= 1000) {
        return `${Math.floor(value / 1000)}K+`;
      }
      return value.toString();
    };
    
    // Only include stats that are greater than zero
    const formattedStats = {};
    if (stats.totalPosts > 0) formattedStats.totalPosts = formatStat(stats.totalPosts);
    if (stats.totalViews > 0) formattedStats.totalViews = formatStat(stats.totalViews);
    if (stats.monthlyVisitors > 0) formattedStats.monthlyVisitors = formatStat(stats.monthlyVisitors);
    if (stats.totalLeads > 0) formattedStats.totalLeads = formatStat(stats.totalLeads);
    
    res.json({
      guru: guru.config,
      featuredPosts,
      stats: formattedStats,
      rawStats: stats, // Keep raw stats for internal use
      subdomain,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru home data:', error);
    res.status(500).json({
      error: 'Failed to fetch guru home data',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/posts
 * Get all blog posts for a guru subdomain with filtering and pagination
 */
router.get('/:subdomain/posts', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { 
      page = 1, 
      limit = 12, 
      tag, 
      search, 
      category,
      featured 
    } = req.query;
    
    const guru = req.guru;
    const db = getFirestore();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get all posts for the subdomain
    const postsSnapshot = await db.collection('gurus').doc(subdomain).collection('posts')
      .orderBy('publishedAt', 'desc')
      .get();
    
    let postsArray = [];
    postsSnapshot.forEach(doc => {
      const post = {
        id: doc.id,
        ...doc.data()
      };
      
      // Only include published posts
      if (post.status === 'published') {
        postsArray.push(post);
      }
    });
    
    // Sort by publishedAt descending (newest first)
    postsArray.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    
    // Apply filters
    if (featured === 'true') {
      postsArray = postsArray.filter(post => post.featured === true);
    }
    
    if (tag && tag !== 'all') {
      postsArray = postsArray.filter(post => 
        post.tags && post.tags.includes(tag)
      );
    }
    
    if (category && category !== 'all') {
      postsArray = postsArray.filter(post => 
        post.category === category
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      postsArray = postsArray.filter(post => 
        (post.title && post.title.toLowerCase().includes(searchLower)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
        (post.content && post.content.toLowerCase().includes(searchLower))
      );
    }
    
    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedPosts = postsArray.slice(startIndex, endIndex);
    
    // Get available tags and categories for filtering
    const allTags = new Set();
    const allCategories = new Set();
    postsArray.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => allTags.add(tag));
      }
      if (post.category) {
        allCategories.add(post.category);
      }
    });
    
    res.json({
      posts: paginatedPosts,
      pagination: {
        totalPosts: postsArray.length,
        totalPages: Math.ceil(postsArray.length / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
        hasNext: endIndex < postsArray.length,
        hasPrev: pageNumber > 1
      },
      filters: {
        availableTags: Array.from(allTags),
        availableCategories: Array.from(allCategories)
      },
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru posts:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/posts/:slug
 * Get a specific blog post by slug
 */
router.get('/:subdomain/posts/:slug', async (req, res) => {
  try {
    const { subdomain, slug } = req.params;
    const guru = req.guru;
    const db = getFirestore();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Find post by slug
    const postsSnapshot = await db.collection('gurus').doc(subdomain).collection('posts')
      .where('slug', '==', slug)
      .get();
    
    let post = null;
    postsSnapshot.forEach(doc => {
      post = {
        id: doc.id,
        ...doc.data()
      };
    });
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with slug "${slug}" not found`
      });
    }
    
    if (post.status !== 'published') {
      return res.status(404).json({
        error: 'Post not available',
        message: 'This post is not published'
      });
    }
    
    // Increment view count using batch update
    const batch = db.batch();
    const postRef = db.collection('gurus').doc(subdomain).collection('posts').doc(post.id);
    const currentViews = post.views || 0;
    batch.update(postRef, { views: currentViews + 1 });
    
    // Track analytics
    const analyticsRef = db.collection('analytics').doc('post-views');
    const analyticsData = {
      subdomain,
      postId: post.id,
      slug,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    batch.set(analyticsRef.collection('views').doc(), analyticsData);
    
    await batch.commit();
    
    // Get related posts (same tags, excluding current post)
    const relatedPosts = [];
    if (post.tags && post.tags.length > 0) {
      const allPostsSnapshot = await db.collection('gurus').doc(subdomain).collection('posts')
        .where('status', '==', 'published')
        .orderBy('publishedAt', 'desc')
        .limit(20)
        .get();
      
      allPostsSnapshot.forEach(doc => {
        const relatedPost = {
          id: doc.id,
          ...doc.data()
        };
        
        if (relatedPost.id !== post.id && 
            relatedPost.status === 'published' &&
            relatedPost.tags &&
            relatedPost.tags.some(tag => post.tags.includes(tag))) {
          relatedPosts.push(relatedPost);
        }
      });
    }
    
    res.json({
      post: {
        ...post,
        views: (post.views || 0) + 1
      },
      relatedPosts: relatedPosts.slice(0, 3),
      guru: guru.config,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru post:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      message: error.message
    });
  }
});

/**
 * POST /:subdomain/leads
 * Submit a lead form for a guru subdomain
 */
router.post('/:subdomain/leads', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { name, email, service, message, phone } = req.body;
    const guru = req.guru;
    const db = getFirestore();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Validate required fields
    if (!name || !email || !service) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and service are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }
    
    const leadId = uuidv4();
    const leadData = {
      id: leadId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service,
      message: message ? message.trim() : '',
      phone: phone ? phone.trim() : null,
      subdomain,
      guruCharacter: guru.config.character,
      createdAt: new Date().toISOString(),
      status: 'new',
      source: 'guru-website',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    // Save lead to Firebase using batch operations
    const batch = db.batch();
    
    // Save to guru-specific leads collection
    const guruLeadRef = db.collection('gurus').doc(subdomain).collection('leads').doc(leadId);
    batch.set(guruLeadRef, leadData);
    
    // Also save to global leads for admin dashboard
    const globalLeadRef = db.collection('leads').doc(leadId);
    batch.set(globalLeadRef, leadData);
    
    // Update guru stats
    const statsRef = db.collection('gurus').doc(subdomain).collection('stats').doc('metrics');
    batch.set(statsRef, { totalLeads: admin.firestore.FieldValue.increment(1) }, { merge: true });
    
    await batch.commit();
    
    // Log lead for analytics
    logger.info(`New lead submitted for ${guru.config.character}`, {
      subdomain,
      leadId,
      service,
      email: email.replace(/(.{3}).*@/, '$1***@') // Masked email for privacy
    });
    
    res.json({
      success: true,
      message: 'Lead submitted successfully',
      leadId,
      guru: guru.config.character
    });
    
  } catch (error) {
    logger.error('Error submitting lead:', error);
    res.status(500).json({
      error: 'Failed to submit lead',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/services
 * Get available services for a guru subdomain
 */
router.get('/:subdomain/services', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getFirestore();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get services from Firebase
    const servicesSnapshot = await db.collection('gurus').doc(subdomain).collection('services').get();
    
    const services = [];
    servicesSnapshot.forEach(doc => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by display order or price
    services.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    res.json({
      services,
      guru: guru.config,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru services:', error);
    res.status(500).json({
      error: 'Failed to fetch services',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/about
 * Get about page content for a guru subdomain
 */
router.get('/:subdomain/about', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getFirestore();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get about page content
    const aboutSnapshot = await db.collection('gurus').doc(subdomain).collection('pages').doc('about').get();
    
    let aboutContent;
    if (aboutSnapshot.exists) {
      aboutContent = aboutSnapshot.data();
    } else {
      aboutContent = {
        title: `About ${guru.config.character}`,
        content: `Meet ${guru.config.character}, your expert guide in ${guru.config.category}. 
                  With years of experience and a passion for teaching, they're here to help you 
                  master ${guru.config.primarySkills.join(', ')} and achieve your goals.`,
        cta: 'Book a Session',
        ctaLink: '/contact',
        features: guru.config.primarySkills.map(skill => ({
          title: skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Expert guidance in ${skill}`
        }))
      };
    }
    
    res.json({
      about: aboutContent,
      guru: guru.config,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru about content:', error);
    res.status(500).json({
      error: 'Failed to fetch about content',
      message: error.message
    });
  }
});

/**
 * GET /api/news/:subdomain
 * Get curated news articles for a subdomain
 */
router.get('/news/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getFirestore();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get curated news articles for the subdomain
    const newsSnapshot = await db.collection('gurus').doc(subdomain).collection('news')
      .orderBy('publishedAt', 'desc')
      .limit(3)
      .get();
    
    const newsArticles = [];
    newsSnapshot.forEach(doc => {
      const article = doc.data();
      // Only include articles from last 24 hours or existing ones if no new ones
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      if (article.publishedAt >= oneDayAgo || newsArticles.length === 0) {
        newsArticles.push({
          id: doc.id,
          title: article.title,
          summary: article.summary,
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source || 'News Source'
        });
      }
    });
    
    // If no articles found, try to load from seeded content files
    if (newsArticles.length === 0) {
      const path = require('path');
      const fs = require('fs');
      
      try {
        const mockDataPath = path.join(__dirname, '../../mock-data', `${subdomain}.json`);
        if (fs.existsSync(mockDataPath)) {
          const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
          if (mockData.news && mockData.news.length > 0) {
            // Use the pre-generated news content
            mockData.news.forEach(article => {
              newsArticles.push({
                id: article.id,
                title: article.title,
                summary: article.summary,
                url: article.url,
                publishedAt: article.publishedAt,
                source: article.source
              });
            });
            logger.info(`📰 Serving ${newsArticles.length} seeded news articles for ${subdomain}`);
          }
        }
      } catch (fileError) {
        logger.warn(`Could not load seeded content for ${subdomain}:`, fileError.message);
      }
    }
    
    // If still no articles, fall back to generated placeholder content
    if (newsArticles.length === 0) {
      const skills = guru.config.primarySkills.join(', ');
      newsArticles.push(
        {
          id: 'placeholder-1',
          title: `Latest Trends in ${guru.config.category.charAt(0).toUpperCase() + guru.config.category.slice(1)}`,
          summary: `Discover the newest developments and innovations in ${skills} that are shaping the industry.`,
          url: '#',
          publishedAt: Date.now(),
          source: 'Industry News'
        },
        {
          id: 'placeholder-2', 
          title: `Expert Tips for ${guru.config.primarySkills[0].replace('-', ' ')} Success`,
          summary: `Professional insights and proven strategies to excel in ${guru.config.primarySkills[0].replace('-', ' ')}.`,
          url: '#',
          publishedAt: Date.now() - 2 * 60 * 60 * 1000,
          source: 'Expert Network'
        },
        {
          id: 'placeholder-3',
          title: `Market Analysis: ${guru.config.category.charAt(0).toUpperCase() + guru.config.category.slice(1)} Industry Growth`,
          summary: `Current market trends and growth opportunities in the ${guru.config.category} sector.`,
          url: '#',
          publishedAt: Date.now() - 4 * 60 * 60 * 1000,
          source: 'Market Research'
        }
      );
    }
    
    res.json({
      success: true,
      subdomain,
      articles: newsArticles.slice(0, 3)
    });
    
  } catch (error) {
    logger.error('Error fetching news articles:', error);
    res.status(500).json({
      error: 'Failed to fetch news articles',
      message: error.message
    });
  }
});

module.exports = router;