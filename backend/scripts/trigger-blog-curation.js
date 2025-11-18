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

    // Check if Firebase credentials are available
    const hasFirebaseCredentials = 
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY;

    if (!hasFirebaseCredentials) {
      logger.info('ℹ️  Firebase credentials not configured - skipping blog curation');
      logger.info('   This is expected during local builds without deployment');
      logger.info('   Blog curation will run automatically during actual deployment');
      process.exit(0);
    }

    // Initialize Firebase
    try {
      initializeFirebase();
      logger.info('✅ Firebase initialized');
    } catch (firebaseError) {
      // Handle Firebase initialization errors gracefully
      if (firebaseError.message.includes('Failed to parse private key')) {
        logger.warn('⚠️ Firebase private key parsing failed');
        logger.info('   This is likely due to malformed credentials in your local environment');
        logger.info('   Skipping blog curation - will run during actual deployment with valid credentials');
        logger.info('');
        logger.info('   💡 Tip: Ensure FIREBASE_PRIVATE_KEY has proper line breaks (\\n)');
        logger.info('   💡 On Windows, verify your .env file encoding is UTF-8');
        process.exit(0);
      }
      // Re-throw other Firebase errors
      throw firebaseError;
    }

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
