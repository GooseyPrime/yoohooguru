const express = require('express');
const router = express.Router();
const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');

// Valid subjects matching frontend VALID_SUBJECTS
const VALID_SUBJECTS = [
  'art', 'business', 'coding', 'cooking', 'crafts', 'data',
  'design', 'finance', 'fitness', 'gardening', 'history',
  'home', 'investing', 'language', 'marketing', 'math',
  'music', 'photography', 'sales', 'science', 'sports',
  'tech', 'wellness', 'writing'
];

/**
 * @route GET /api/:subdomain/posts
 * @desc Get blog posts for a specific subdomain
 * @param {string} subdomain - The subject subdomain (e.g., 'music', 'coding')
 * @query {number} limit - Maximum number of posts to return (default: 6)
 * @query {number} page - Page number for pagination (default: 1)
 * @access Public
 */
router.get('/:subdomain/posts', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;

    // Validate subdomain
    if (!VALID_SUBJECTS.includes(subdomain)) {
      logger.warn(`Invalid subdomain requested: ${subdomain}`);
      return res.status(400).json({
        error: 'Invalid subdomain',
        message: `Subdomain '${subdomain}' is not valid. Must be one of: ${VALID_SUBJECTS.join(', ')}`
      });
    }

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Invalid limit',
        message: 'Limit must be between 1 and 100'
      });
    }

    if (page < 1) {
      return res.status(400).json({
        error: 'Invalid page',
        message: 'Page must be 1 or greater'
      });
    }

    const db = getFirestore();

    // Query posts collection filtered by subdomain
    const postsRef = db.collection('posts');
    let query = postsRef
      .where('subdomain', '==', subdomain)
      .where('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .limit(limit);

    // Apply pagination offset
    if (page > 1) {
      const offset = (page - 1) * limit;
      query = query.offset(offset);
    }

    const snapshot = await query.get();

    // Get total count for pagination metadata
    const countSnapshot = await postsRef
      .where('subdomain', '==', subdomain)
      .where('published', '==', true)
      .get();

    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || doc.id,
        excerpt: data.excerpt || '',
        author: data.author || 'YooHoo Team',
        publishedAt: data.publishedAt || Date.now(),
        readTime: data.readTime || '5 min read',
        tags: data.tags || [],
        category: data.category || subdomain,
        imageUrl: data.imageUrl || null
      };
    });

    const totalPosts = countSnapshot.size;
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    logger.info(`Retrieved ${posts.length} posts for subdomain: ${subdomain}, page: ${page}`);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    logger.error('Error fetching blog posts:', {
      error: error.message,
      stack: error.stack,
      subdomain: req.params.subdomain
    });

    res.status(500).json({
      error: 'Failed to fetch blog posts',
      message: 'An error occurred while retrieving blog posts. Please try again later.'
    });
  }
});

/**
 * @route GET /api/:subdomain/posts/:slug
 * @desc Get a single blog post by slug
 * @param {string} subdomain - The subject subdomain
 * @param {string} slug - The post slug
 * @access Public
 */
router.get('/:subdomain/posts/:slug', async (req, res) => {
  try {
    const { subdomain, slug } = req.params;

    // Validate subdomain
    if (!VALID_SUBJECTS.includes(subdomain)) {
      return res.status(400).json({
        error: 'Invalid subdomain'
      });
    }

    const db = getFirestore();

    // Query by slug and subdomain
    const snapshot = await db.collection('posts')
      .where('subdomain', '==', subdomain)
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      logger.warn(`Post not found: ${subdomain}/${slug}`);
      return res.status(404).json({
        error: 'Post not found',
        message: `No post found with slug '${slug}' in ${subdomain} subdomain`
      });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const post = {
      id: doc.id,
      title: data.title || '',
      slug: data.slug || doc.id,
      content: data.content || '',
      excerpt: data.excerpt || '',
      author: data.author || 'YooHoo Team',
      publishedAt: data.publishedAt || Date.now(),
      updatedAt: data.updatedAt || null,
      readTime: data.readTime || '5 min read',
      tags: data.tags || [],
      category: data.category || subdomain,
      imageUrl: data.imageUrl || null,
      views: data.views || 0
    };

    // Increment view count (fire and forget)
    db.collection('posts').doc(doc.id).update({
      views: (data.views || 0) + 1,
      lastViewedAt: Date.now()
    }).catch(err => {
      logger.error('Failed to increment view count:', err);
    });

    logger.info(`Retrieved post: ${subdomain}/${slug}`);

    res.json({ post });

  } catch (error) {
    logger.error('Error fetching blog post:', {
      error: error.message,
      stack: error.stack,
      subdomain: req.params.subdomain,
      slug: req.params.slug
    });

    res.status(500).json({
      error: 'Failed to fetch blog post',
      message: 'An error occurred while retrieving the blog post. Please try again later.'
    });
  }
});

module.exports = router;
