#!/usr/bin/env node

/**
 * AI Content Migration Script
 * Replaces hardcoded mock data with AI-generated content using OpenRouter
 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { getConfig } = require('./src/config/appConfig');
const { getAllSubdomains, getSubdomainConfig } = require('./src/config/subdomains');
const { logger } = require('./src/utils/logger');

require('dotenv').config();

/**
 * Generate AI content for a specific subdomain
 */
async function generateSubdomainContent(subdomain) {
  try {
    logger.info(`🤖 Generating AI content for ${subdomain}...`);
    
    const config = getSubdomainConfig(subdomain);
    if (!config) {
      logger.error(`No configuration found for subdomain: ${subdomain}`);
      return null;
    }

    const appConfig = getConfig();
    const baseUrl = process.env.API_URL || 'http://localhost:3001';

    // Generate blog posts
    const posts = [];
    for (const skill of config.primarySkills.slice(0, 3)) {
      try {
        const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const topics = [
          `${skillTitle} for Beginners: Complete Guide`,
          `Advanced ${skillTitle} Techniques`,
          `Common ${skillTitle} Mistakes to Avoid`
        ];

        const topic = topics[posts.length % topics.length];

        const response = await axios.post(`${baseUrl}/api/ai/generate-blog-post`, {
          topic,
          category: config.category,
          targetAudience: 'skill learners of all levels',
          keywords: [skill, config.category, 'tutorial', 'guide']
        });

        if (response.data.success) {
          const aiPost = response.data.data;
          posts.push({
            id: `${subdomain}-${skill}-${Date.now()}-${posts.length}`,
            title: aiPost.title,
            slug: aiPost.slug,
            excerpt: aiPost.excerpt,
            content: aiPost.content,
            author: config.character,
            category: aiPost.category,
            tags: aiPost.tags,
            publishedAt: new Date().toISOString(),
            featured: true,
            estimatedReadTime: aiPost.estimatedReadTime,
            viewCount: Math.floor(Math.random() * 2000) + 500
          });
          
          logger.info(`✅ Generated blog post: "${aiPost.title}"`);
        }
      } catch (error) {
        logger.warn(`Failed to generate post for ${skill}:`, error.message);
      }
    }

    // Generate news articles
    const newsResponse = await axios.post(`${baseUrl}/api/ai/generate-news`, {
      category: config.category,
      skills: config.primarySkills.slice(0, 3),
      limit: 3
    });

    const news = newsResponse.data.success ? newsResponse.data.data : [];

    // Create stats
    const stats = {
      totalPosts: posts.length + Math.floor(Math.random() * 20) + 10,
      totalViews: posts.reduce((sum, post) => sum + post.viewCount, 0) + Math.floor(Math.random() * 10000),
      totalLeads: Math.floor(Math.random() * 500) + 100,
      monthlyVisitors: Math.floor(Math.random() * 5000) + 1000
    };

    return {
      posts,
      news,
      stats
    };

  } catch (error) {
    logger.error(`Error generating content for ${subdomain}:`, error);
    return null;
  }
}

/**
 * Replace mock data files with AI-generated content
 */
async function replaceAllMockData() {
  logger.info('🚀 Starting AI content migration...');

  const mockDataDir = path.join(__dirname, 'src', 'mock-data');
  const subdomains = ['fitness', 'cooking', 'music', 'tech', 'art', 'writing', 'photography'];

  for (const subdomain of subdomains) {
    try {
      logger.info(`📝 Processing ${subdomain}...`);
      
      const content = await generateSubdomainContent(subdomain);
      if (content) {
        const filePath = path.join(mockDataDir, `${subdomain}.json`);
        
        // Create backup of original file
        if (fs.existsSync(filePath)) {
          const backupPath = path.join(mockDataDir, `${subdomain}.json.backup-${Date.now()}`);
          fs.copyFileSync(filePath, backupPath);
          logger.info(`📋 Backed up original ${subdomain}.json`);
        }

        // Write new AI-generated content
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        logger.info(`✅ Updated ${subdomain}.json with AI content`);
      } else {
        logger.warn(`⚠️ Skipping ${subdomain} - content generation failed`);
      }

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      logger.error(`Error processing ${subdomain}:`, error);
    }
  }

  logger.info('🎉 AI content migration completed!');
}

/**
 * Test AI service connectivity
 */
async function testAIService() {
  try {
    const appConfig = getConfig();
    const baseUrl = process.env.API_URL || 'http://localhost:3001';
    
    logger.info('🔍 Testing AI service connectivity...');
    
    const response = await axios.get(`${baseUrl}/api/ai/`);
    if (response.data.success) {
      logger.info('✅ AI service is reachable');
      logger.info(`🔑 OpenRouter configured: ${response.data.data.openrouterConfigured}`);
      return true;
    } else {
      logger.error('❌ AI service not responding correctly');
      return false;
    }
  } catch (error) {
    logger.error('❌ Cannot reach AI service:', error.message);
    logger.info('💡 Make sure the backend is running and OpenRouter API key is configured');
    return false;
  }
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'test':
      await testAIService();
      break;
      
    case 'migrate':
      const isConnected = await testAIService();
      if (isConnected) {
        await replaceAllMockData();
      } else {
        logger.error('❌ Aborting migration - AI service not available');
        process.exit(1);
      }
      break;
      
    case 'single':
      const subdomain = process.argv[3];
      if (!subdomain) {
        logger.error('Usage: node ai-content-migration.js single <subdomain>');
        process.exit(1);
      }
      
      const isConnectedSingle = await testAIService();
      if (isConnectedSingle) {
        const content = await generateSubdomainContent(subdomain);
        if (content) {
          console.log(JSON.stringify(content, null, 2));
        }
      }
      break;
      
    default:
      console.log(`
AI Content Migration Script

Usage:
  node ai-content-migration.js test      - Test AI service connectivity
  node ai-content-migration.js migrate   - Replace all mock data with AI content
  node ai-content-migration.js single <subdomain> - Generate content for one subdomain

Environment Variables Required:
  OPENROUTER_API_KEY - Your OpenRouter API key
  API_URL (optional) - Backend API URL (default: http://localhost:3001)

Examples:
  node ai-content-migration.js test
  node ai-content-migration.js migrate
  node ai-content-migration.js single fitness
`);
  }
}

if (require.main === module) {
  main().catch(error => {
    logger.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  generateSubdomainContent,
  replaceAllMockData,
  testAIService
};