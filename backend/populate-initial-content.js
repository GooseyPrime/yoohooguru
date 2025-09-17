#!/usr/bin/env node

/**
 * Populate Initial Content Script
 * This script manually triggers the AI curation agents to populate
 * initial "In the News" and blog entry content for all subdomains
 */

require('dotenv').config();

const { getAllSubdomains, getSubdomainConfig } = require('./src/config/subdomains');
const { logger } = require('./src/utils/logger');

// Mock Firebase functions for testing/development environment
const mockFirestore = {
  collection: (path) => ({
    doc: (docId) => ({
      collection: (subPath) => ({
        doc: (subDocId) => ({
          set: async (data) => {
            logger.info(`📝 Mock: Would save to ${path}/${docId}/${subPath}/${subDocId || 'auto-id'}:`, {
              title: data.title,
              subdomain: data.subdomain,
              type: subPath
            });
            return Promise.resolve();
          }
        }),
        get: async () => ({
          forEach: (callback) => {
            // Mock empty collection for testing
          }
        })
      }),
      set: async (data) => {
        logger.info(`📝 Mock: Would save to ${path}/${docId}:`, data);
        return Promise.resolve();
      }
    })
  }),
  batch: () => ({
    set: (ref, data) => {
      logger.info(`📝 Mock batch: Would save:`, { data: data.title || 'batch item' });
    },
    delete: (ref) => {
      logger.info(`🗑️ Mock batch: Would delete reference`);
    },
    commit: async () => {
      logger.info(`💾 Mock batch: Would commit batch operation`);
      return Promise.resolve();
    }
  })
};

// News Curation Logic (from curationAgents.js)
class MockNewsCurationAgent {
  generatePlaceholderArticles(category, skills) {
    const articles = [];
    const skillsList = skills.slice(0, 3);

    skillsList.forEach((skill, index) => {
      articles.push({
        id: `${category}-${skill}-${Date.now()}-${index}`,
        title: `Breaking: New Advances in ${skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        summary: `Industry experts reveal groundbreaking developments in ${skill.replace('-', ' ')} that could transform the ${category} sector. Leading professionals share insights on emerging trends and best practices.`,
        url: '#',
        source: 'Industry News',
        publishedAt: Date.now() - (index * 2 * 60 * 60 * 1000),
        keywords: [skill, category, 'trends', 'innovation'],
        relevanceScore: 0.9 - (index * 0.1)
      });
    });

    return articles;
  }

  selectBestArticles(articles, limit = 3) {
    return articles
      .filter(article => {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        return article.publishedAt >= oneDayAgo;
      })
      .sort((a, b) => {
        const scoreA = (a.relevanceScore || 0.5) + (a.publishedAt / Date.now()) * 0.1;
        const scoreB = (b.relevanceScore || 0.5) + (b.publishedAt / Date.now()) * 0.1;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  async curateSubdomainNews(db, subdomain) {
    try {
      const config = getSubdomainConfig(subdomain);
      if (!config) {
        logger.warn(`No configuration found for subdomain: ${subdomain}`);
        return;
      }

      const articles = this.generatePlaceholderArticles(config.category, config.primarySkills);
      const curatedArticles = this.selectBestArticles(articles, 3);

      // Store articles in Firestore (mocked)
      const newsCollection = db.collection('gurus').doc(subdomain).collection('news');
      const batch = db.batch();

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
      logger.info(`📰 Curated ${curatedArticles.length} news articles for ${subdomain}`);
      return curatedArticles;

    } catch (error) {
      logger.error(`Error curating news for ${subdomain}:`, error);
      return [];
    }
  }
}

// Blog Curation Logic (from curationAgents.js)
class MockBlogCurationAgent {
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
        featuredImage: null,
        readTime: Math.floor(Math.random() * 10) + 5,
        views: 0,
        likes: 0,
        relevanceScore: 0.9 - (index * 0.1)
      });
    });

    return posts;
  }

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

  selectBestPosts(posts, limit = 3) {
    return posts
      .sort((a, b) => (b.relevanceScore || 0.5) - (a.relevanceScore || 0.5))
      .slice(0, limit);
  }

  async curateSubdomainBlogContent(db, subdomain) {
    try {
      const config = getSubdomainConfig(subdomain);
      if (!config) {
        logger.warn(`No configuration found for subdomain: ${subdomain}`);
        return;
      }

      const blogPosts = this.generatePlaceholderBlogPosts(config);
      const bestPosts = this.selectBestPosts(blogPosts, 3);

      // Store posts in Firestore (mocked)
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
      return bestPosts;

    } catch (error) {
      logger.error(`Error curating blog content for ${subdomain}:`, error);
      return [];
    }
  }
}

// Main population function
async function populateInitialContent() {
  logger.info('🚀 Starting initial content population for all subdomains...');
  
  const db = mockFirestore; // Use mock in development
  const subdomains = getAllSubdomains();
  
  const newsAgent = new MockNewsCurationAgent();
  const blogAgent = new MockBlogCurationAgent();
  
  const results = {
    news: {},
    blog: {},
    summary: {
      totalSubdomains: subdomains.length,
      newsArticles: 0,
      blogPosts: 0
    }
  };

  logger.info(`📊 Populating content for ${subdomains.length} subdomains: ${subdomains.join(', ')}`);

  for (const subdomain of subdomains) {
    logger.info(`\n🔄 Processing subdomain: ${subdomain}`);
    
    // Generate news content
    const newsArticles = await newsAgent.curateSubdomainNews(db, subdomain);
    results.news[subdomain] = newsArticles;
    results.summary.newsArticles += newsArticles.length;
    
    // Generate blog content  
    const blogPosts = await blogAgent.curateSubdomainBlogContent(db, subdomain);
    results.blog[subdomain] = blogPosts;
    results.summary.blogPosts += blogPosts.length;
    
    logger.info(`✅ Completed ${subdomain}: ${newsArticles.length} news + ${blogPosts.length} blog posts`);
  }

  logger.info('\n🎉 Initial content population completed!');
  logger.info(`📈 Summary:`);
  logger.info(`   • Total subdomains: ${results.summary.totalSubdomains}`);
  logger.info(`   • News articles generated: ${results.summary.newsArticles}`);
  logger.info(`   • Blog posts generated: ${results.summary.blogPosts}`);
  logger.info(`   • Total content items: ${results.summary.newsArticles + results.summary.blogPosts}`);

  return results;
}

// Run the script
if (require.main === module) {
  populateInitialContent()
    .then((results) => {
      logger.info('\n✨ Content population script completed successfully!');
      
      // Display some sample content
      logger.info('\n📰 Sample News Articles Generated:');
      Object.entries(results.news).slice(0, 2).forEach(([subdomain, articles]) => {
        if (articles.length > 0) {
          logger.info(`\n${subdomain.toUpperCase()}:`);
          articles.slice(0, 1).forEach(article => {
            logger.info(`  📄 "${article.title}"`);
            logger.info(`     ${article.summary.substring(0, 100)}...`);
          });
        }
      });

      logger.info('\n📝 Sample Blog Posts Generated:');
      Object.entries(results.blog).slice(0, 2).forEach(([subdomain, posts]) => {
        if (posts.length > 0) {
          logger.info(`\n${subdomain.toUpperCase()}:`);
          posts.slice(0, 1).forEach(post => {
            logger.info(`  📖 "${post.title}"`);
            logger.info(`     ${post.excerpt.substring(0, 100)}...`);
          });
        }
      });

      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Error during content population:', error);
      process.exit(1);
    });
}

module.exports = { populateInitialContent };