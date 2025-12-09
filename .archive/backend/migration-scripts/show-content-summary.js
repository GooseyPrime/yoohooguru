#!/usr/bin/env node

/**
 * Content Summary Script
 * Shows the generated initial content for all subdomains
 */

const fs = require('fs');
const path = require('path');
const { logger } = require('./src/utils/logger');

const dataDir = path.join(__dirname, 'mock-data');

function displayContentSummary() {
  logger.info('📊 Initial Content Summary for All Subdomains');
  logger.info('=' .repeat(60));

  if (!fs.existsSync(dataDir)) {
    logger.error('❌ No content directory found. Run seed-content.js first.');
    return;
  }

  const summaryPath = path.join(dataDir, 'summary.json');
  if (!fs.existsSync(summaryPath)) {
    logger.error('❌ No summary file found.');
    return;
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  
  logger.info(`🎯 Total Subdomains: ${summary.totalSubdomains}`);
  logger.info(`📰 Total News Articles: ${summary.totalNews}`);
  logger.info(`📝 Total Blog Posts: ${summary.totalPosts}`);
  logger.info(`📅 Generated: ${new Date(summary.generatedAt).toLocaleString()}`);
  logger.info('');

  // Show sample content from each subdomain
  summary.subdomains.slice(0, 5).forEach(subdomain => {
    const filePath = path.join(dataDir, `${subdomain}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      logger.info(`🔥 ${subdomain.toUpperCase()}`);
      logger.info(`   Category: ${data.config.category}`);
      logger.info(`   Skills: ${data.config.primarySkills.slice(0, 3).join(', ')}`);
      
      if (data.news && data.news.length > 0) {
        logger.info(`   📰 Sample News: "${data.news[0].title}"`);
      }
      
      if (data.posts && data.posts.length > 0) {
        logger.info(`   📖 Sample Post: "${data.posts[0].title}"`);
      }
      
      if (data.stats) {
        const stats = [];
        if (data.stats.totalPosts > 0) stats.push(`${data.stats.totalPosts} posts`);
        if (data.stats.totalViews > 0) stats.push(`${data.stats.totalViews} views`);
        if (data.stats.monthlyVisitors > 0) stats.push(`${data.stats.monthlyVisitors} visitors`);
        if (stats.length > 0) {
          logger.info(`   📊 Stats: ${stats.join(', ')}`);
        }
      }
      
      logger.info('');
    }
  });

  if (summary.subdomains.length > 5) {
    logger.info(`   ... and ${summary.subdomains.length - 5} more subdomains`);
    logger.info(`   (${summary.subdomains.slice(5).join(', ')})`);
  }

  logger.info('');
  logger.info('🚀 All subdomain pages now have initial content ready!');
  logger.info('');
  logger.info('Next steps:');
  logger.info('1. Start the backend server');
  logger.info('2. Visit any subdomain page to see populated content');
  logger.info('3. Both news and blog content will be served automatically');
  logger.info('4. Statistics will show realistic numbers');
  logger.info('');
  logger.info('API Endpoints serving content:');
  logger.info('- /api/{subdomain}/home (blog posts + stats)');
  logger.info('- /api/news/{subdomain} (news articles)');
}

if (require.main === module) {
  displayContentSummary();
}

module.exports = { displayContentSummary };