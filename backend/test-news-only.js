/**
 * Test script for news fetching functionality only
 * Tests the real news curation without Firebase dependencies
 */

require('dotenv').config();
const { logger } = require('./src/utils/logger');
const { NewsCurationAgent } = require('./src/agents/curationAgents');

async function testNewsFetching() {
  try {
    logger.info('🧪 Testing real news fetching functionality...');

    const newsAgent = new NewsCurationAgent();

    // Test tech category
    logger.info('Testing tech category with programming skills...');
    const techSkills = ['javascript', 'react', 'nodejs', 'python'];

    try {
      const techArticles = await newsAgent.fetchNewsArticles('tech', techSkills, 2);
      logger.info(`✅ Tech articles found: ${techArticles.length}`);

      techArticles.forEach((article, index) => {
        logger.info(`Article ${index + 1}:`);
        logger.info(`  Title: ${article.title}`);
        logger.info(`  Source: ${article.source}`);
        logger.info(`  URL: ${article.url}`);
        logger.info(`  Published: ${new Date(article.publishedAt).toISOString()}`);
        logger.info(`  Summary: ${article.summary}`);
        logger.info('---');
      });

    } catch (error) {
      logger.error(`❌ Tech news fetching failed: ${error.message}`);
    }

    // Test business category  
    logger.info('Testing business category with finance skills...');
    const businessSkills = ['finance', 'marketing', 'management', 'sales'];

    try {
      const businessArticles = await newsAgent.fetchNewsArticles('business', businessSkills, 2);
      logger.info(`✅ Business articles found: ${businessArticles.length}`);

      businessArticles.forEach((article, index) => {
        logger.info(`Article ${index + 1}:`);
        logger.info(`  Title: ${article.title}`);
        logger.info(`  Source: ${article.source}`);
        logger.info(`  URL: ${article.url}`);
        logger.info(`  Published: ${new Date(article.publishedAt).toISOString()}`);
        logger.info(`  Summary: ${article.summary}`);
        logger.info('---');
      });

    } catch (error) {
      logger.error(`❌ Business news fetching failed: ${error.message}`);
    }

    logger.info('🎉 News fetching test completed!');

  } catch (error) {
    logger.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testNewsFetching();