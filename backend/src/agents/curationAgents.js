const cron = require('node-cron');
const { getFirestore } = require('../firebase/admin');
const { getAllSubdomains, getSubdomainConfig } = require('../config/subdomains');
const { logger } = require('../utils/logger');

// Agent status tracking
const agentStatus = {
  newsAgent: { status: 'stopped', error: null, lastStarted: null },
  blogAgent: { status: 'stopped', error: null, lastStarted: null }
};

/**
 * News Curation Agent
 * Runs every 24 hours to curate news articles for each subdomain
 */
class NewsCurationAgent {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the news curation cron job
   */
  start() {
    try {
      // Validate dependencies before starting
      this.validateDependencies();
      
      // Run every day at 6 AM
      cron.schedule('0 6 * * *', () => {
        logger.info('🔄 Starting daily news curation...');
        this.curateDailyNews();
      });

      agentStatus.newsAgent = { 
        status: 'running', 
        error: null, 
        lastStarted: new Date().toISOString() 
      };
      logger.info('📰 News curation agent started - runs daily at 6 AM');
    } catch (error) {
      agentStatus.newsAgent = { 
        status: 'error', 
        error: error.message, 
        lastStarted: new Date().toISOString() 
      };
      logger.error('❌ Failed to start news curation agent:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Validate required dependencies for the agent
   */
  validateDependencies() {
    try {
      // Check if Firebase is available
      const { getFirestore } = require('../firebase/admin');
      const db = getFirestore();
      if (!db) {
        throw new Error('Firestore is not available');
      }
      
      // Check if subdomains config is available
      const { getAllSubdomains } = require('../config/subdomains');
      const subdomains = getAllSubdomains();
      if (!subdomains || subdomains.length === 0) {
        throw new Error('No subdomains configured for news curation');
      }
      
      logger.info(`✅ News agent dependencies validated - ${subdomains.length} subdomains configured`);
    } catch (error) {
      logger.error('❌ News agent dependency validation failed:', error.message);
      throw new Error(`News curation agent dependency validation failed: ${error.message}`);
    }
  }

  /**
   * Manually trigger news curation (for testing)
   */
  async triggerManually() {
    logger.info('🔄 Manually triggering news curation...');
    return this.curateDailyNews();
  }

  /**
   * Curate news for all subdomains
   */
  async curateDailyNews() {
    if (this.isRunning) {
      logger.warn('News curation already running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      const db = getFirestore();
      const subdomains = getAllSubdomains();

      logger.info(`📰 Curating news for ${subdomains.length} subdomains`);

      for (const subdomain of subdomains) {
        await this.curateSubdomainNews(db, subdomain);
      }

      logger.info('✅ Daily news curation completed successfully');
    } catch (error) {
      logger.error('❌ Error during news curation:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Curate news for a specific subdomain
   */
  async curateSubdomainNews(db, subdomain) {
    try {
      const config = getSubdomainConfig(subdomain);
      if (!config) {
        logger.warn(`No configuration found for subdomain: ${subdomain}`);
        return;
      }

      logger.info(`📰 Curating news for subdomain: ${subdomain} (${config.category})`);

      const articles = await this.fetchNewsArticles(config.category, config.primarySkills);
      
      if (!articles || articles.length === 0) {
        logger.warn(`No articles generated for ${subdomain}, skipping news curation`);
        return;
      }

      const curatedArticles = this.selectBestArticles(articles, 3);

      if (curatedArticles.length === 0) {
        logger.warn(`No articles passed curation filters for ${subdomain}`);
        return;
      }

      // Store articles in Firestore
      const newsCollection = db.collection('gurus').doc(subdomain).collection('news');
      
      // Clear old articles
      const oldArticles = await newsCollection.get();
      const batch = db.batch();
      
      oldArticles.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Add new articles
      curatedArticles.forEach(article => {
        const articleRef = newsCollection.doc();
        batch.set(articleRef, {
          ...article,
          publishedAt: Date.now(),
          curatedAt: Date.now(),
          subdomain,
          aiGenerated: true
        });
      });

      await batch.commit();
      logger.info(`✅ Curated ${curatedArticles.length} articles for ${subdomain}`);

    } catch (error) {
      logger.error(`❌ Error curating news for ${subdomain}:`, error.message);
      
      // In production, we don't want to fail silently or use placeholders
      if (process.env.NODE_ENV === 'production') {
        // Could send alert to monitoring system here
        logger.error(`🚨 Production alert: News curation failed for ${subdomain}`, {
          subdomain,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      // Don't throw to avoid breaking the entire curation process for other subdomains
    }
  }

  /**
   * Fetch news articles for given category and skills
   * Uses AI providers with proper fallback chain
   */
  async fetchNewsArticles(category, skills) {
    try {
      logger.info(`🔄 Fetching AI news for category: ${category}`);
      
      // Try multiple AI providers in order
      const aiResult = await this.tryAIProvidersForNews(category, skills);
      
      if (aiResult.success) {
        logger.info(`✅ AI news generated successfully via ${aiResult.provider}`);
        return aiResult.data;
      } else {
        logger.error('❌ All AI providers failed for news generation');
        
        // Only fall back to placeholders in development/test environments
        if (process.env.NODE_ENV === 'production') {
          throw new Error('AI news generation failed in production - no fallback available');
        } else {
          logger.warn('⚠️ Development mode: falling back to placeholder content');
          return this.generatePlaceholderArticles(category, skills);
        }
      }
    } catch (error) {
      logger.error('Error in fetchNewsArticles:', error.message);
      
      // In production, we should never fall back to placeholders
      if (process.env.NODE_ENV === 'production') {
        throw error;
      } else {
        logger.warn('⚠️ Development mode: falling back to placeholder content after error:', error.message);
        return this.generatePlaceholderArticles(category, skills);
      }
    }
  }

  /**
   * Try multiple AI providers for news generation with proper fallback
   */
  async tryAIProvidersForNews(category, skills) {
    const axios = require('axios');
    const { getConfig } = require('../config/appConfig');
    const config = getConfig();
    
    // Provider 1: OpenRouter with Perplexity (web search capabilities)
    try {
      logger.info('🤖 Attempting news generation via OpenRouter/Perplexity...');
      const response = await axios.post(`${config.apiUrl}/api/ai/generate-news`, {
        category,
        skills: skills.slice(0, 3),
        limit: 5
      });

      if (response.data.success && response.data.data.length > 0) {
        return { success: true, data: response.data.data, provider: 'openrouter-perplexity' };
      }
    } catch (error) {
      logger.warn('OpenRouter/Perplexity failed:', error.message);
    }

    // Provider 2: OpenRouter with Claude
    try {
      logger.info('🤖 Attempting news generation via OpenRouter/Claude...');
      const claudeResult = await this.generateNewsWithClaude(category, skills, config);
      if (claudeResult.success) {
        return { success: true, data: claudeResult.data, provider: 'openrouter-claude' };
      }
    } catch (error) {
      logger.warn('OpenRouter/Claude failed:', error.message);
    }

    // Provider 3: OpenAI GPT-4 (if API key available)
    if (process.env.OPENAI_API_KEY) {
      try {
        logger.info('🤖 Attempting news generation via OpenAI...');
        const openaiResult = await this.generateNewsWithOpenAI(category, skills);
        if (openaiResult.success) {
          return { success: true, data: openaiResult.data, provider: 'openai-gpt4' };
        }
      } catch (error) {
        logger.warn('OpenAI failed:', error.message);
      }
    }

    return { success: false, error: 'All AI providers failed' };
  }

  /**
   * Generate news using OpenRouter Claude
   */
  async generateNewsWithClaude(category, skills, config) {
    const axios = require('axios');
    
    if (!config.openrouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `You are a news curator for yoohoo.guru, specializing in industry trends and developments. Create engaging news summaries relevant to skill learners and teachers. Focus on recent developments, educational trends, and industry changes.`
      },
      {
        role: 'user',
        content: `Create 3 current news articles related to ${category} and skills like ${skills.join(', ')}. 

For each article, provide:
1. A compelling headline
2. A 2-3 sentence summary
3. Why it's relevant to skill learners
4. Current date (today)

Focus on recent developments, trends, studies, or industry changes. Make each article unique and informative.

Return as JSON array with objects containing: id, title, summary, relevance, publishedAt (ISO format), source.`
      }
    ];

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: messages,
      max_tokens: 4000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${config.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoohoo.guru',
        'X-Title': 'YooHoo.guru AI News Generation'
      }
    });

    const content = response.data.choices[0].message.content;
    let articles;
    
    try {
      articles = JSON.parse(content);
    } catch {
      // Fallback parsing for non-JSON responses
      articles = this.parseNewsFromText(content, category);
    }

    return { success: true, data: articles };
  }

  /**
   * Generate news using OpenAI GPT-4
   */
  async generateNewsWithOpenAI(category, skills) {
    const axios = require('axios');
    
    const messages = [
      {
        role: 'system',
        content: `You are a news curator for yoohoo.guru, specializing in industry trends and developments. Create engaging news summaries relevant to skill learners and teachers.`
      },
      {
        role: 'user',
        content: `Create 3 current news articles related to ${category} and skills like ${skills.join(', ')}. Return as JSON array with objects containing: id, title, summary, relevance, publishedAt (ISO format), source.`
      }
    ];

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    let articles;
    
    try {
      articles = JSON.parse(content);
    } catch {
      articles = this.parseNewsFromText(content, category);
    }

    return { success: true, data: articles };
  }

  /**
   * Parse news from text when JSON parsing fails
   */
  parseNewsFromText(content, category) {
    const articles = [];
    const sections = content.split('\n\n');
    let currentArticle = {};
    
    sections.forEach(section => {
      if (section.includes('title:') || section.includes('Title:')) {
        if (currentArticle.title) articles.push(currentArticle);
        currentArticle = {
          id: `ai-news-${Date.now()}-${articles.length}`,
          title: section.split(':')[1]?.trim() || 'Industry Update',
          publishedAt: new Date().toISOString(),
          source: 'AI News Curator'
        };
      } else if (section.includes('summary:') || section.includes('Summary:')) {
        currentArticle.summary = section.split(':')[1]?.trim();
      } else if (section.length > 50 && !currentArticle.summary) {
        currentArticle.summary = section.trim();
      }
    });
    
    if (currentArticle.title) articles.push(currentArticle);
    
    // Ensure we have at least 3 articles
    while (articles.length < 3) {
      articles.push({
        id: `ai-news-${Date.now()}-${articles.length}`,
        title: `Latest Developments in ${category}`,
        summary: `Industry experts discuss emerging trends and innovations in ${category} that are transforming how professionals develop their skills.`,
        publishedAt: new Date().toISOString(),
        source: 'AI News Curator'
      });
    }

    return articles;
  }

  /**
   * Generate placeholder articles for development/testing only
   * This should NEVER be called in production
   */
  generatePlaceholderArticles(category, skills) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('🚨 CRITICAL: Attempted to generate placeholder articles in production!');
      throw new Error('Placeholder content is not allowed in production');
    }

    logger.warn('⚠️ Generating placeholder articles for development/testing');
    
    const articles = [];
    const skillsList = skills.slice(0, 3); // Use first 3 skills

    skillsList.forEach((skill, index) => {
      articles.push({
        id: `dev-${category}-${skill}-${Date.now()}-${index}`,
        title: `[DEV] Breaking: New Advances in ${skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        summary: `[DEVELOPMENT PLACEHOLDER] Industry experts reveal groundbreaking developments in ${skill.replace('-', ' ')} that could transform the ${category} sector. Leading professionals share insights on emerging trends and best practices.`,
        url: '#', // Placeholder URL
        source: 'Development Placeholder',
        publishedAt: Date.now() - (index * 2 * 60 * 60 * 1000), // Stagger by 2 hours
        keywords: [skill, category, 'trends', 'innovation'],
        relevanceScore: 0.9 - (index * 0.1),
        isDevelopmentPlaceholder: true
      });
    });

    return articles;
  }

  /**
   * Select the best articles based on relevance and recency
   */
  selectBestArticles(articles, limit = 3) {
    return articles
      .filter(article => {
        // Only include articles from last 24 hours or recent ones
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        return article.publishedAt >= oneDayAgo;
      })
      .sort((a, b) => {
        // Sort by relevance score and recency
        const scoreA = (a.relevanceScore || 0.5) + (a.publishedAt / Date.now()) * 0.1;
        const scoreB = (b.relevanceScore || 0.5) + (b.publishedAt / Date.now()) * 0.1;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}

/**
 * Blog Entry Curation Agent
 * Runs every two weeks to generate/curate blog content for each subdomain
 */
class BlogCurationAgent {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the blog curation cron job
   */
  start() {
    try {
      // Validate dependencies before starting
      this.validateDependencies();
      
      // Run every two weeks on Monday at 8 AM (first and third Monday of each month)
      // Using '0 8 1-7,15-21 * 1' to target first and third Monday
      cron.schedule('0 8 1-7,15-21 * 1', () => {
        logger.info('🔄 Starting bi-weekly blog curation...');
        this.curateBlogContent();
      });

      agentStatus.blogAgent = { 
        status: 'running', 
        error: null, 
        lastStarted: new Date().toISOString() 
      };
      logger.info('📝 Blog curation agent started - runs bi-weekly on Mondays at 8 AM');
    } catch (error) {
      agentStatus.blogAgent = { 
        status: 'error', 
        error: error.message, 
        lastStarted: new Date().toISOString() 
      };
      logger.error('❌ Failed to start blog curation agent:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Validate required dependencies for the agent
   */
  validateDependencies() {
    try {
      // Check if Firebase is available
      const { getFirestore } = require('../firebase/admin');
      const db = getFirestore();
      if (!db) {
        throw new Error('Firestore is not available');
      }
      
      // Check if subdomains config is available
      const { getAllSubdomains } = require('../config/subdomains');
      const subdomains = getAllSubdomains();
      if (!subdomains || subdomains.length === 0) {
        throw new Error('No subdomains configured for blog curation');
      }
      
      logger.info(`✅ Blog agent dependencies validated - ${subdomains.length} subdomains configured`);
    } catch (error) {
      logger.error('❌ Blog agent dependency validation failed:', error.message);
      throw new Error(`Blog curation agent dependency validation failed: ${error.message}`);
    }
  }

  /**
   * Manually trigger blog curation (for testing)
   */
  async triggerManually() {
    logger.info('🔄 Manually triggering blog curation...');
    return this.curateBlogContent();
  }

  /**
   * Curate blog content for all subdomains
   */
  async curateBlogContent() {
    if (this.isRunning) {
      logger.warn('Blog curation already running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      const db = getFirestore();
      const subdomains = getAllSubdomains();

      logger.info(`📝 Curating blog content for ${subdomains.length} subdomains`);

      for (const subdomain of subdomains) {
        await this.curateSubdomainBlogContent(db, subdomain);
      }

      logger.info('✅ Bi-weekly blog curation completed successfully');
    } catch (error) {
      logger.error('❌ Error during blog curation:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Curate blog content for a specific subdomain
   */
  async curateSubdomainBlogContent(db, subdomain) {
    try {
      const config = getSubdomainConfig(subdomain);
      if (!config) {
        logger.warn(`No configuration found for subdomain: ${subdomain}`);
        return;
      }

      const blogPosts = await this.generateBlogPosts(config);
      const bestPosts = this.selectBestPosts(blogPosts, 3);

      // Store posts in Firestore
      const postsCollection = db.collection('gurus').doc(subdomain).collection('posts');
      
      for (const post of bestPosts) {
        const postRef = postsCollection.doc();
        await postRef.set({
          ...post,
          publishedAt: Date.now(),
          curatedAt: Date.now(),
          subdomain,
          status: 'published',
          featured: true
        });
      }

      logger.info(`📝 Generated ${bestPosts.length} blog posts for ${subdomain}`);

    } catch (error) {
      logger.error(`Error curating blog content for ${subdomain}:`, error);
    }
  }

  /**
   * Generate blog posts for given subdomain config
   * Uses AI providers with proper fallback chain
   */
  async generateBlogPosts(config) {
    try {
      logger.info(`🔄 Generating blog posts for ${config.category}`);
      
      const posts = [];
      
      // Generate posts for each primary skill
      for (const skill of config.primarySkills.slice(0, 2)) {
        try {
          const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
          const topic = `${skillTitle} for Beginners: A Complete Guide`;
          
          // Try AI generation with fallback
          const aiResult = await this.tryAIGenerationForBlog(topic, config, skill);
          
          if (aiResult.success) {
            posts.push(aiResult.data);
            logger.info(`✅ Generated AI blog post: "${aiResult.data.title}"`);
          } else if (process.env.NODE_ENV !== 'production') {
            logger.warn(`⚠️ AI generation failed for ${skill}, using placeholder in development`);
            const placeholderPost = this.generateSinglePlaceholderPost(skill, config);
            posts.push(placeholderPost);
          } else {
            logger.error(`❌ AI generation failed for ${skill} in production - skipping`);
          }
        } catch (skillError) {
          logger.error(`Failed to generate content for ${skill}:`, skillError.message);
          
          if (process.env.NODE_ENV !== 'production') {
            const placeholderPost = this.generateSinglePlaceholderPost(skill, config);
            posts.push(placeholderPost);
          }
        }
      }
      
      return posts;
      
    } catch (error) {
      logger.error('Error in generateBlogPosts:', error.message);
      
      if (process.env.NODE_ENV === 'production') {
        throw error;
      } else {
        logger.warn('⚠️ Development mode: falling back to placeholder blog posts');
        return this.generatePlaceholderBlogPosts(config);
      }
    }
  }

  /**
   * Try AI generation for a single blog post with fallback
   */
  async tryAIGenerationForBlog(topic, config, skill) {
    const axios = require('axios');
    const { getConfig } = require('../config/appConfig');
    const appConfig = getConfig();
    
    // Try the main AI endpoint first
    try {
      const response = await axios.post(`${appConfig.apiUrl}/api/ai/generate-blog-post`, {
        topic,
        category: config.category,
        targetAudience: 'beginners to intermediate learners',
        keywords: [skill, config.category, 'guide', 'tutorial']
      });

      if (response.data.success) {
        const aiPost = response.data.data;
        return {
          success: true,
          data: {
            ...aiPost,
            id: `${config.category}-${skill}-${Date.now()}`,
            author: config.character,
            subdomain: config.subdomain || skill,
            featured: true,
            viewCount: Math.floor(Math.random() * 1000) + 100,
            relevanceScore: 0.9,
            aiGenerated: true
          }
        };
      }
    } catch (error) {
      logger.warn(`Primary AI blog generation failed for ${skill}:`, error.message);
    }

    return { success: false, error: 'AI blog generation failed' };
  }

  /**
   * Generate a single placeholder post for development
   */
  generateSinglePlaceholderPost(skill, config) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Placeholder blog posts are not allowed in production');
    }

    const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return {
      id: `dev-${config.category}-${skill}-${Date.now()}`,
      title: `[DEV] Master ${skillTitle}: A Complete Guide for Beginners`,
      slug: `dev-master-${skill}-complete-guide-beginners`,
      excerpt: `[DEVELOPMENT PLACEHOLDER] Discover the essential techniques and strategies to excel in ${skillTitle.toLowerCase()}. This comprehensive guide covers everything from basic fundamentals to advanced practices.`,
      content: this.generatePlaceholderContent(skillTitle, config.category),
      author: config.character,
      category: config.category,
      tags: [skill, 'beginner', 'guide', config.category, 'dev-placeholder'],
      featuredImage: null,
      readTime: Math.floor(Math.random() * 10) + 5 + ' min',
      views: 0,
      likes: 0,
      relevanceScore: 0.9,
      isDevelopmentPlaceholder: true
    };
  }

  /**
   * Generate placeholder blog posts for development/testing only
   * This should NEVER be called in production
   */
  generatePlaceholderBlogPosts(config) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('🚨 CRITICAL: Attempted to generate placeholder blog posts in production!');
      throw new Error('Placeholder blog content is not allowed in production');
    }

    logger.warn('⚠️ Generating placeholder blog posts for development/testing');
    
    const posts = [];
    const { category, primarySkills } = config;

    primarySkills.slice(0, 3).forEach((skill, index) => {
      const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      posts.push({
        id: `dev-${category}-${skill}-${Date.now()}-${index}`,
        title: `[DEV] Master ${skillTitle}: A Complete Guide for Beginners`,
        slug: `dev-master-${skill}-complete-guide-beginners`,
        excerpt: `[DEVELOPMENT PLACEHOLDER] Discover the essential techniques and strategies to excel in ${skillTitle.toLowerCase()}. This comprehensive guide covers everything from basic fundamentals to advanced practices.`,
        content: this.generatePlaceholderContent(skillTitle, category),
        author: config.character,
        category: category,
        tags: [skill, 'beginner', 'guide', category, 'dev-placeholder'],
        featuredImage: null,
        readTime: Math.floor(Math.random() * 10) + 5 + ' min',
        views: 0,
        likes: 0,
        relevanceScore: 0.9 - (index * 0.1),
        isDevelopmentPlaceholder: true
      });
    });

    return posts;
  }

  /**
   * Generate placeholder content for a blog post
   */
  generatePlaceholderContent(skill, category) {
    return `
# Introduction to ${skill}

${skill} is a fundamental aspect of ${category} that can significantly impact your success in this field. Whether you're just starting out or looking to improve your existing skills, this comprehensive guide will provide you with the knowledge and techniques you need.

## Getting Started

Before diving into the advanced techniques, it's important to understand the basics. Here are the key principles that form the foundation of ${skill.toLowerCase()}:

1. **Understanding the Fundamentals** - Learn the core concepts that underpin effective ${skill.toLowerCase()}.
2. **Practice and Consistency** - Regular practice is essential for developing proficiency.
3. **Learning from Experts** - Seek guidance from experienced professionals in the field.

## Essential Techniques

### Technique 1: Foundation Building
Start with the basic principles and gradually build upon them. This approach ensures a solid understanding that will serve you well as you progress.

### Technique 2: Practical Application
Apply what you learn in real-world scenarios. This hands-on experience is invaluable for developing true expertise.

### Technique 3: Continuous Improvement
Always look for ways to refine and improve your approach. The best professionals never stop learning and growing.

## Common Mistakes to Avoid

1. **Rushing the Process** - Take time to master each skill level before moving on.
2. **Neglecting Practice** - Regular practice is essential for skill development.
3. **Ignoring Feedback** - Learn from constructive criticism and use it to improve.

## Next Steps

Now that you understand the basics of ${skill.toLowerCase()}, it's time to put these concepts into practice. Consider working with a qualified instructor who can provide personalized guidance and help you avoid common pitfalls.

Remember, mastering ${skill.toLowerCase()} is a journey, not a destination. Stay committed to continuous learning and improvement, and you'll see significant progress over time.

---

*Ready to take your ${skill.toLowerCase()} skills to the next level? Book a session with one of our expert instructors today.*
    `.trim();
  }

  /**
   * Select the best posts based on quality and relevance
   */
  selectBestPosts(posts, limit = 3) {
    return posts
      .sort((a, b) => (b.relevanceScore || 0.5) - (a.relevanceScore || 0.5))
      .slice(0, limit);
  }
}

// Create singleton instances
const newsCurationAgent = new NewsCurationAgent();
const blogCurationAgent = new BlogCurationAgent();

/**
 * Start all curation agents with comprehensive error handling and logging
 * 
 * This function:
 * 1. Checks if agents are disabled via environment variable
 * 2. Validates dependencies for each agent individually 
 * 3. Starts each agent with detailed error logging
 * 4. Tracks agent status for health reporting
 * 5. Continues startup even if some agents fail (configurable in production)
 */
function startCurationAgents() {
  const environment = process.env.NODE_ENV || 'development';
  
  // Check if agents should be disabled in production
  if (process.env.DISABLE_CURATION_AGENTS === 'true') {
    logger.info('ℹ️ Curation agents are disabled via DISABLE_CURATION_AGENTS environment variable');
    agentStatus.newsAgent.status = 'disabled';
    agentStatus.blogAgent.status = 'disabled';
    return;
  }
  
  if (environment !== 'production') {
    logger.info('🔧 Curation agents running in development mode');
  }
  
  const startupErrors = [];
  
  // Start news curation agent with individual error handling
  try {
    newsCurationAgent.start();
    logger.info('✅ News curation agent started successfully');
  } catch (error) {
    const errorMsg = `News curation agent failed to start: ${error.message}`;
    startupErrors.push(errorMsg);
    logger.error('❌ ' + errorMsg, {
      error: error.message,
      stack: error.stack
    });
  }
  
  // Start blog curation agent with individual error handling
  try {
    blogCurationAgent.start();
    logger.info('✅ Blog curation agent started successfully');
  } catch (error) {
    const errorMsg = `Blog curation agent failed to start: ${error.message}`;
    startupErrors.push(errorMsg);
    logger.error('❌ ' + errorMsg, {
      error: error.message,
      stack: error.stack
    });
  }
  
  // Report overall startup status
  if (startupErrors.length === 0) {
    logger.info('🤖 All AI curation agents started successfully');
  } else {
    const errorSummary = `${startupErrors.length} agent(s) failed to start: ${startupErrors.join('; ')}`;
    logger.error('❌ Curation agent startup completed with errors: ' + errorSummary);
    
    // In production, we might want to throw to prevent the app from starting
    // This is configurable via FAIL_ON_AGENT_ERROR environment variable
    if (environment === 'production' && process.env.FAIL_ON_AGENT_ERROR === 'true') {
      throw new Error('Critical curation agents failed to start: ' + errorSummary);
    }
  }
}

/**
 * Get the current status of all curation agents
 * 
 * This function provides real-time status information for monitoring
 * and health check purposes. Used by the /health endpoint and admin dashboard.
 * 
 * @returns {Object} Current status of all agents with timestamps
 */
function getCurationAgentStatus() {
  return {
    newsAgent: { ...agentStatus.newsAgent },
    blogAgent: { ...agentStatus.blogAgent },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };
}

/**
 * Manually trigger curation for testing
 */
async function triggerManualCuration() {
  logger.info('🔄 Triggering manual curation for all agents...');
  
  await Promise.all([
    newsCurationAgent.triggerManually(),
    blogCurationAgent.triggerManually()
  ]);
  
  logger.info('✅ Manual curation completed');
}

module.exports = {
  newsCurationAgent,
  blogCurationAgent,
  startCurationAgents,
  triggerManualCuration,
  getCurationAgentStatus
};