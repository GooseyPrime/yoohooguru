#!/usr/bin/env node

/**
 * Test Script for Curation Agents
 * Tests the news and blog curation agents with a single subdomain
 */

require('dotenv').config();
const { initializeFirebase, getFirestore } = require('./src/config/firebase');
const { newsCurationAgent, blogCurationAgent } = require('./src/agents/curationAgents');
const { logger } = require('./src/utils/logger');

async function testCurationAgents() {
  logger.info('🧪 Starting curation agents test...');
  
  try {
    // Initialize Firebase
    logger.info('Initializing Firebase...');
    initializeFirebase();
    const db = getFirestore();
    
    if (!db) {
      throw new Error('Failed to initialize Firestore');
    }
    
    logger.info('✅ Firebase initialized successfully');
    
    // Test subdomain
    const testSubdomain = 'fitness';
    
    // Test 1: News Curation (morning slot)
    logger.info('\n📰 Test 1: News Curation (morning slot)');
    logger.info('Testing news curation for fitness subdomain...');
    await newsCurationAgent.curateSubdomainNews(db, testSubdomain, 'morning');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify news was created
    const newsSnapshot = await db.collection('gurus').doc(testSubdomain).collection('news')
      .orderBy('publishedAt', 'desc')
      .limit(5)
      .get();
    
    logger.info(`✅ Found ${newsSnapshot.size} news articles for ${testSubdomain}`);
    newsSnapshot.forEach(doc => {
      const article = doc.data();
      logger.info(`   - ${article.title} (${article.timeSlot || 'unspecified'})`);
    });
    
    // Test 2: Blog Curation
    logger.info('\n📝 Test 2: Blog Post Generation');
    logger.info('Testing blog generation for fitness subdomain...');
    await blogCurationAgent.curateSubdomainBlogContent(db, testSubdomain);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify blog post was created
    const postsSnapshot = await db.collection('gurus').doc(testSubdomain).collection('posts')
      .orderBy('publishedAt', 'desc')
      .limit(3)
      .get();
    
    logger.info(`✅ Found ${postsSnapshot.size} blog posts for ${testSubdomain}`);
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      logger.info(`   - ${post.title}`);
      logger.info(`     Words: ${post.metadata?.wordCount || 'unknown'}, Read time: ${post.estimatedReadTime || post.readTime}`);
    });
    
    // Test 3: Verify data structure
    logger.info('\n🔍 Test 3: Verifying Data Structure');
    
    if (newsSnapshot.size > 0) {
      const firstNews = newsSnapshot.docs[0].data();
      logger.info('Sample news article structure:');
      logger.info(`   - Has title: ${!!firstNews.title}`);
      logger.info(`   - Has summary: ${!!firstNews.summary}`);
      logger.info(`   - Has tags: ${!!firstNews.tags}`);
      logger.info(`   - Has metadata: ${!!firstNews.metadata}`);
      logger.info(`   - Has timeSlot: ${!!firstNews.timeSlot}`);
      logger.info(`   - Tags: ${firstNews.tags?.join(', ') || 'none'}`);
    }
    
    if (postsSnapshot.size > 0) {
      const firstPost = postsSnapshot.docs[0].data();
      logger.info('Sample blog post structure:');
      logger.info(`   - Has title: ${!!firstPost.title}`);
      logger.info(`   - Has content: ${!!firstPost.content}`);
      logger.info(`   - Has SEO metadata: ${!!firstPost.seo}`);
      logger.info(`   - Has schema: ${!!firstPost.schema}`);
      logger.info(`   - Schema type: ${firstPost.schema?.type || firstPost.schemaType || 'none'}`);
      logger.info(`   - Word count: ${firstPost.metadata?.wordCount || 'unknown'}`);
    }
    
    logger.info('\n✅ All tests completed successfully!');
    logger.info('\nNext steps:');
    logger.info('1. Check the Firestore console to verify data');
    logger.info('2. Test the API endpoints:');
    logger.info(`   - GET /api/gurus/${testSubdomain}/home`);
    logger.info(`   - GET /api/gurus/news/${testSubdomain}`);
    logger.info('3. View the subdomain page in the frontend');
    
  } catch (error) {
    logger.error('❌ Test failed:', error);
    logger.error(error.stack);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  testCurationAgents()
    .then(() => {
      logger.info('\n🎉 Test script completed');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Test script error:', error);
      process.exit(1);
    });
}

module.exports = { testCurationAgents };
