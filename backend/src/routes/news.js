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
 * @route GET /api/news/:subdomain
 * @desc Get curated news articles for a specific subdomain
 * @param {string} subdomain - The subject subdomain (e.g., 'music', 'coding')
 * @query {number} limit - Maximum number of articles to return (default: 5)
 * @access Public
 */
router.get('/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    // Validate subdomain
    if (!VALID_SUBJECTS.includes(subdomain)) {
      logger.warn(`Invalid subdomain requested for news: ${subdomain}`);
      return res.status(400).json({
        error: 'Invalid subdomain',
        message: `Subdomain '${subdomain}' is not valid. Must be one of: ${VALID_SUBJECTS.join(', ')}`
      });
    }

    // Validate limit parameter
    if (limit < 1 || limit > 50) {
      return res.status(400).json({
        error: 'Invalid limit',
        message: 'Limit must be between 1 and 50'
      });
    }

    const db = getFirestore();

    // Query news collection filtered by subdomain
    // News articles are curated external content
    const snapshot = await db.collection('news')
      .where('subdomain', '==', subdomain)
      .where('active', '==', true)
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .get();

    const news = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        summary: data.summary || data.excerpt || '',
        url: data.url || data.sourceUrl || '',
        source: data.source || 'External Source',
        publishedAt: data.publishedAt || Date.now(),
        curatedAt: data.curatedAt || data.createdAt || Date.now(),
        imageUrl: data.imageUrl || data.thumbnail || null,
        category: data.category || subdomain
      };
    });

    logger.info(`Retrieved ${news.length} news articles for subdomain: ${subdomain}`);

    res.json({
      news,
      count: news.length,
      subdomain
    });

  } catch (error) {
    logger.error('Error fetching news articles:', {
      error: error.message,
      stack: error.stack,
      subdomain: req.params.subdomain
    });

    res.status(500).json({
      error: 'Failed to fetch news articles',
      message: 'An error occurred while retrieving news articles. Please try again later.'
    });
  }
});

/**
 * @route GET /api/news
 * @desc Get recent news articles across all subdomains
 * @query {number} limit - Maximum number of articles to return (default: 10)
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Validate limit parameter
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Invalid limit',
        message: 'Limit must be between 1 and 100'
      });
    }

    const db = getFirestore();

    // Query recent news across all subdomains
    const snapshot = await db.collection('news')
      .where('active', '==', true)
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .get();

    const news = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        summary: data.summary || data.excerpt || '',
        url: data.url || data.sourceUrl || '',
        source: data.source || 'External Source',
        subdomain: data.subdomain || 'general',
        publishedAt: data.publishedAt || Date.now(),
        curatedAt: data.curatedAt || data.createdAt || Date.now(),
        imageUrl: data.imageUrl || data.thumbnail || null,
        category: data.category || data.subdomain
      };
    });

    logger.info(`Retrieved ${news.length} news articles across all subdomains`);

    res.json({
      news,
      count: news.length
    });

  } catch (error) {
    logger.error('Error fetching all news articles:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Failed to fetch news articles',
      message: 'An error occurred while retrieving news articles. Please try again later.'
    });
  }
});

module.exports = router;
