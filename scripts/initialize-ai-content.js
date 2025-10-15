#!/usr/bin/env node

/**
 * Initialize AI-Generated Content for All Subdomains
 * 
 * This script triggers the AI curation agents to generate initial content
 * for all configured subdomains. It should be run during deployment or
 * by admins when fresh content is needed.
 * 
 * Usage:
 *   node scripts/initialize-ai-content.js
 *   node scripts/initialize-ai-content.js --subdomain=cooking
 *   node scripts/initialize-ai-content.js --type=news
 *   node scripts/initialize-ai-content.js --type=blog
 * 
 * Environment Variables:
 *   OPENROUTER_API_KEY - Required for AI content generation
 *   OPENAI_API_KEY - Optional fallback for AI generation
 *   NODE_ENV - Set to 'production' to use production settings
 */

const { getAllSubdomains, getSubdomainConfig } = require('../backend/src/config/subdomains');
const { getFirestore } = require('../backend/src/config/firebase');
const { logger } = require('../backend/src/utils/logger');
const { newsCurationAgent, blogCurationAgent } = require('../backend/src/agents/curationAgents');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  subdomain: null,
  type: 'all', // 'all', 'news', or 'blog'
  force: false
};

args.forEach(arg => {
  if (arg.startsWith('--subdomain=')) {
    options.subdomain = arg.split('=')[1];
  } else if (arg.startsWith('--type=')) {
    options.type = arg.split('=')[1];
  } else if (arg === '--force') {
    options.force = true;
  }
});

/**
 * Main initialization function
 */
async function initializeContent() {
  try {
    console.log('🤖 AI Content Initialization Starting...\n');
    
    // Validate environment
    if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY) {
      console.error('❌ ERROR: No AI API keys configured!');
      console.error('   Please set OPENROUTER_API_KEY or OPENAI_API_KEY environment variable');
      process.exit(1);
    }
    
    // Get subdomains to process
    const allSubdomains = getAllSubdomains();
    const targetSubdomains = options.subdomain 
      ? [options.subdomain] 
      : allSubdomains;
    
    console.log(`📋 Target subdomains: ${targetSubdomains.join(', ')}`);
    console.log(`📝 Content types: ${options.type}\n`);
    
    // Validate subdomains
    for (const subdomain of targetSubdomains) {
      if (!getSubdomainConfig(subdomain)) {
        console.error(`❌ ERROR: Invalid subdomain "${subdomain}"`);
        console.error(`   Available subdomains: ${allSubdomains.join(', ')}`);
        process.exit(1);
      }
    }
    
    // Initialize Firestore connection
    const db = getFirestore();
    if (!db) {
      console.error('❌ ERROR: Failed to connect to Firestore');
      process.exit(1);
    }
    
    console.log('✅ Firestore connection established\n');
    
    // Generate news articles
    if (options.type === 'all' || options.type === 'news') {
      console.log('📰 Generating News Articles...\n');
      
      for (const subdomain of targetSubdomains) {
        const config = getSubdomainConfig(subdomain);
        console.log(`\n🔄 Processing ${subdomain} (${config.category})...`);
        
        try {
          // Generate initial news articles (2 per subdomain as per spec)
          await newsCurationAgent.curateSubdomainNews(db, subdomain, 'initial');
          console.log(`   ✅ Generated news articles for ${subdomain}`);
        } catch (error) {
          console.error(`   ❌ Failed to generate news for ${subdomain}:`, error.message);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('\n📰 News generation complete!\n');
    }
    
    // Generate blog posts
    if (options.type === 'all' || options.type === 'blog') {
      console.log('📝 Generating Blog Posts...\n');
      
      for (const subdomain of targetSubdomains) {
        const config = getSubdomainConfig(subdomain);
        console.log(`\n🔄 Processing ${subdomain} (${config.category})...`);
        
        try {
          // Generate initial blog post (1 per subdomain as per spec)
          await blogCurationAgent.curateSubdomainBlogContent(db, subdomain);
          console.log(`   ✅ Generated blog post for ${subdomain}`);
        } catch (error) {
          console.error(`   ❌ Failed to generate blog for ${subdomain}:`, error.message);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log('\n📝 Blog generation complete!\n');
    }
    
    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 AI Content Initialization Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n✅ Processed ${targetSubdomains.length} subdomain(s)`);
    console.log(`✅ Content type(s): ${options.type}`);
    console.log('\nThe AI curation agents will continue to run on schedule:');
    console.log('  📰 News: Twice daily (6 AM and 3 PM EST)');
    console.log('  📝 Blog: Weekly (Mondays at 10 AM EST)\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR during content initialization:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
AI Content Initialization Script
═══════════════════════════════════════════════════════

Usage:
  node scripts/initialize-ai-content.js [options]

Options:
  --subdomain=NAME    Generate content for a specific subdomain only
                      Example: --subdomain=cooking
  
  --type=TYPE         Generate specific content type
                      Values: all (default), news, blog
                      Example: --type=news
  
  --force             Force regeneration even if content exists
  
  --help              Show this help message

Examples:
  # Generate all content for all subdomains (recommended for initial deployment)
  node scripts/initialize-ai-content.js
  
  # Generate only news articles
  node scripts/initialize-ai-content.js --type=news
  
  # Generate content for a specific subdomain
  node scripts/initialize-ai-content.js --subdomain=cooking
  
  # Generate only blog posts for a specific subdomain
  node scripts/initialize-ai-content.js --subdomain=tech --type=blog

Environment Variables Required:
  OPENROUTER_API_KEY    Primary AI provider API key (required)
  OPENAI_API_KEY        Fallback AI provider API key (optional)
  
Notes:
  - This script uses the same AI curation agents that run on schedule
  - Content is stored in Firestore under 'gurus/{subdomain}/news' and 'gurus/{subdomain}/posts'
  - The script respects rate limits with built-in delays
  - News articles are limited to 10 most recent per subdomain
  - Blog posts accumulate over time (weekly generation)
  
For more information, see:
  backend/src/agents/curationAgents.js
`);
  process.exit(0);
}

// Check for help flag
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
}

// Run initialization
console.log('Starting AI content initialization...\n');
initializeContent().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
