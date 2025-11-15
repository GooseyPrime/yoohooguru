#!/usr/bin/env node

/**
 * Trigger Blog Curation on Deployment
 *
 * This script is designed to run after every deployment to ensure
 * fresh blog content is generated for all subdomains.
 *
 * Usage: node scripts/trigger-blog-curation.js
 */

require('dotenv').config();
const { initializeFirebase } = require('../src/config/firebase');
const { logger } = require('../src/utils/logger');

// Import blog curation agent
const BlogCurationAgent = require('../src/agents/curationAgents').BlogCurationAgent;

async function triggerBlogCuration() {
  try {
    logger.info('🚀 Deployment hook: Starting blog curation...');

    // Initialize Firebase
    initializeFirebase();
    logger.info('✅ Firebase initialized');

    // Create and trigger blog curation agent
    const blogAgent = new BlogCurationAgent();

    // Validate dependencies
    try {
      blogAgent.validateDependencies();
      logger.info('✅ Blog agent dependencies validated');
    } catch (error) {
      logger.error('❌ Blog agent dependency validation failed:', error.message);
      process.exit(1);
    }

    // Trigger manual blog curation
    logger.info('📝 Triggering blog curation for all subdomains...');
    await blogAgent.triggerManually();

    logger.info('✅ Blog curation completed successfully');
    logger.info('📊 Check Firestore collection "posts" for generated content');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Blog curation failed:', {
      error: error.message,
      stack: error.stack
    });

    // Don't fail deployment if blog curation fails
    // Just log the error and continue
    logger.warn('⚠️ Deployment will continue despite blog curation failure');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  triggerBlogCuration();
}

module.exports = { triggerBlogCuration };
