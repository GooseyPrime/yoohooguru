const cron = require('node-cron');
const { getFirestore } = require('../config/firebase');
const { getAllSubdomains, getSubdomainConfig } = require('../config/subdomains');
const { logger } = require('../utils/logger');

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
    // Run every day at 6 AM
    cron.schedule('0 6 * * *', () => {
      logger.info('🔄 Starting daily news curation...');
      this.curateDailyNews();
    });

    logger.info('📰 News curation agent started - runs daily at 6 AM');
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

      const articles = await this.fetchNewsArticles(config.category, config.primarySkills);
      const curatedArticles = this.selectBestArticles(articles, 3);

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
          subdomain
        });
      });

      await batch.commit();
      logger.info(`📰 Curated ${curatedArticles.length} articles for ${subdomain}`);

    } catch (error) {
      logger.error(`Error curating news for ${subdomain}:`, error);
    }
  }

  /**
   * Fetch news articles for given category and skills
   * TODO: Integrate with actual news API (GDELT, Google News, etc.)
   */
  async fetchNewsArticles(category, skills) {
    // Placeholder implementation
    // In production, this would query external news APIs
    const placeholderArticles = this.generatePlaceholderArticles(category, skills);
    
    return placeholderArticles;
  }

  /**
   * Generate placeholder articles for development
   */
  generatePlaceholderArticles(category, skills) {
    const articles = [];
    const skillsList = skills.slice(0, 3); // Use first 3 skills

    skillsList.forEach((skill, index) => {
      articles.push({
        id: `${category}-${skill}-${Date.now()}-${index}`,
        title: `Breaking: New Advances in ${skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        summary: `Industry experts reveal groundbreaking developments in ${skill.replace('-', ' ')} that could transform the ${category} sector. Leading professionals share insights on emerging trends and best practices.`,
        url: '#', // Placeholder URL
        source: 'Industry News',
        publishedAt: Date.now() - (index * 2 * 60 * 60 * 1000), // Stagger by 2 hours
        keywords: [skill, category, 'trends', 'innovation'],
        relevanceScore: 0.9 - (index * 0.1)
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
    // Run every two weeks on Monday at 8 AM
    cron.schedule('0 8 * * 1/2', () => {
      logger.info('🔄 Starting bi-weekly blog curation...');
      this.curateBlogContent();
    });

    logger.info('📝 Blog curation agent started - runs bi-weekly on Mondays at 8 AM');
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
   * TODO: Integrate with AI content generation APIs
   */
  async generateBlogPosts(config) {
    // Placeholder implementation
    // In production, this would use AI APIs to generate content
    return this.generatePlaceholderBlogPosts(config);
  }

  /**
   * Generate placeholder blog posts for development
   */
  generatePlaceholderBlogPosts(config) {
    const posts = [];
    const { category, primarySkills } = config;

    primarySkills.slice(0, 3).forEach((skill, index) => {
      const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      posts.push({
        id: `${category}-${skill}-${Date.now()}-${index}`,
        title: `Master ${skillTitle}: A Complete Guide for Beginners`,
        slug: `master-${skill}-complete-guide-beginners`,
        excerpt: `Discover the essential techniques and strategies to excel in ${skillTitle.toLowerCase()}. This comprehensive guide covers everything from basic fundamentals to advanced practices.`,
        content: this.generatePlaceholderContent(skillTitle, category),
        author: config.character,
        category: category,
        tags: [skill, 'beginner', 'guide', category],
        featuredImage: null, // Placeholder for images
        readTime: Math.floor(Math.random() * 10) + 5, // 5-15 min read time
        views: 0,
        likes: 0,
        relevanceScore: 0.9 - (index * 0.1)
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
 * Start all curation agents
 */
function startCurationAgents() {
  if (process.env.NODE_ENV !== 'production') {
    logger.info('🔧 Curation agents running in development mode');
  }
  
  newsCurationAgent.start();
  blogCurationAgent.start();
  
  logger.info('🤖 All AI curation agents started successfully');
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
  triggerManualCuration
};