/**
 * Database Seed Script - Initial Content for Subdomain Pages
 * This script creates actual data that can be served by the API endpoints
 */

const fs = require('fs');
const path = require('path');
const { getAllSubdomains, getSubdomainConfig } = require('./src/config/subdomains');
const { logger } = require('./src/utils/logger');

// Create mock data directory
const dataDir = path.join(__dirname, 'mock-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate sample content for all subdomains
function generateAllContent() {
  const subdomains = getAllSubdomains();
  const allContent = {};

  subdomains.forEach(subdomain => {
    const config = getSubdomainConfig(subdomain);
    if (!config) return;

    // Generate news content
    const newsArticles = generateNewsContent(subdomain, config);
    
    // Generate blog posts
    const blogPosts = generateBlogContent(subdomain, config);

    // Generate sample stats
    const stats = generateSampleStats();

    allContent[subdomain] = {
      news: newsArticles,
      posts: blogPosts,
      stats: stats,
      config: config
    };
  });

  return allContent;
}

function generateNewsContent(subdomain, config) {
  const articles = [];
  const skills = config.primarySkills.slice(0, 3);

  skills.forEach((skill, index) => {
    const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    articles.push({
      id: `news-${subdomain}-${skill}-${Date.now()}-${index}`,
      title: `Breaking: New Advances in ${skillTitle}`,
      summary: `Industry experts reveal groundbreaking developments in ${skill.replace('-', ' ')} that could transform the ${config.category} sector. Leading professionals share insights on emerging trends and best practices.`,
      url: `https://example.com/news/${subdomain}/${skill}`,
      source: 'Industry News Network',
      publishedAt: Date.now() - (index * 2 * 60 * 60 * 1000), // Stagger by 2 hours
      category: config.category,
      subdomain: subdomain
    });
  });

  return articles;
}

function generateBlogContent(subdomain, config) {
  const posts = [];
  const skills = config.primarySkills.slice(0, 3);

  skills.forEach((skill, index) => {
    const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    posts.push({
      id: `post-${subdomain}-${skill}-${Date.now()}-${index}`,
      title: `Master ${skillTitle}: A Complete Guide for Beginners`,
      slug: `master-${skill}-complete-guide-beginners`,
      excerpt: `Discover the essential techniques and strategies to excel in ${skillTitle.toLowerCase()}. This comprehensive guide covers everything from basic fundamentals to advanced practices that will help you succeed.`,
      content: generateDetailedContent(skillTitle, config.category),
      author: config.character.replace(' Guru', ' Expert'),
      category: config.category,
      tags: [skill, 'beginner', 'guide', config.category],
      publishedAt: Date.now() - (index * 24 * 60 * 60 * 1000), // Stagger by days
      featuredImage: null,
      readTime: Math.floor(Math.random() * 10) + 5,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      status: 'published',
      featured: true,
      subdomain: subdomain
    });
  });

  return posts;
}

function generateDetailedContent(skill, category) {
  return `
# Master ${skill}: Your Complete Learning Path

Welcome to the comprehensive guide for mastering ${skill.toLowerCase()}. Whether you're completely new to ${category} or looking to enhance your existing skills, this guide will provide you with a structured approach to success.

## Why ${skill} Matters in ${category.charAt(0).toUpperCase() + category.slice(1)}

${skill} is more than just a skill – it's a gateway to excellence in the ${category} field. Professional practitioners consistently rank ${skill.toLowerCase()} as one of the most important competencies for achieving long-term success.

## Getting Started: The Foundation

Before diving into advanced techniques, let's establish a solid foundation:

### 1. Understanding the Basics
- Core principles of ${skill.toLowerCase()}
- Common terminology and concepts  
- Essential tools and equipment
- Safety considerations and best practices

### 2. Building Your Skill Set
- Progressive learning approach
- Practice exercises and drills
- Milestone achievements to track progress
- Resources for continued learning

### 3. Real-World Application
- Practical scenarios and case studies
- Common challenges and solutions
- Tips from industry professionals
- Building confidence through practice

## Advanced Techniques

Once you've mastered the fundamentals, you can explore these advanced concepts:

### Professional-Level Strategies
- Industry-standard best practices
- Efficiency optimization techniques
- Quality control and consistency
- Troubleshooting common issues

### Innovation and Creativity
- Thinking outside conventional approaches
- Developing your unique style
- Staying current with industry trends
- Contributing to the field's evolution

## Common Pitfalls to Avoid

Based on years of teaching experience, here are the most common mistakes beginners make:

1. **Rushing the Learning Process** - Take time to master each level before advancing
2. **Neglecting Fundamentals** - Strong basics are essential for advanced techniques
3. **Inconsistent Practice** - Regular, focused practice beats sporadic intensive sessions
4. **Ignoring Feedback** - Constructive criticism is invaluable for improvement
5. **Comparison with Others** - Focus on your own progress and journey

## Building Your ${skill} Career

If you're interested in pursuing ${skill.toLowerCase()} professionally:

- Portfolio development strategies
- Networking within the ${category} community  
- Continuing education opportunities
- Career path options and specializations
- Business and entrepreneurship considerations

## Next Steps

Ready to begin your ${skill.toLowerCase()} journey? Here's what we recommend:

1. **Start with the basics** - Don't skip foundational concepts
2. **Find a mentor or instructor** - Guided learning accelerates progress
3. **Practice consistently** - Set aside regular time for skill development
4. **Join communities** - Connect with others sharing your interests
5. **Stay curious** - Always look for new learning opportunities

## Resources for Continued Learning

- Recommended books and publications
- Online courses and tutorials
- Professional organizations and associations
- Workshops and seminars
- Practice groups and meetups

---

*Ready to take your ${skill.toLowerCase()} skills to the next level? Our expert instructors are here to guide you through personalized learning experiences tailored to your goals and schedule.*

**Book a session today and start your journey toward ${skill.toLowerCase()} mastery!**
  `.trim();
}

function generateSampleStats() {
  return {
    totalPosts: Math.floor(Math.random() * 50) + 10,
    totalViews: Math.floor(Math.random() * 5000) + 1000,
    monthlyVisitors: Math.floor(Math.random() * 1000) + 200,
    totalLeads: Math.floor(Math.random() * 100) + 20
  };
}

// Main execution
function seedInitialContent() {
  logger.info('🌱 Seeding initial content for all subdomains...');
  
  const allContent = generateAllContent();
  
  // Save to JSON files for easy access
  Object.entries(allContent).forEach(([subdomain, content]) => {
    const subdomainFile = path.join(dataDir, `${subdomain}.json`);
    fs.writeFileSync(subdomainFile, JSON.stringify(content, null, 2));
    logger.info(`💾 Saved content for ${subdomain}: ${content.news.length} news + ${content.posts.length} posts`);
  });

  // Create summary file
  const summary = {
    generatedAt: new Date().toISOString(),
    totalSubdomains: Object.keys(allContent).length,
    totalNews: Object.values(allContent).reduce((sum, content) => sum + content.news.length, 0),
    totalPosts: Object.values(allContent).reduce((sum, content) => sum + content.posts.length, 0),
    subdomains: Object.keys(allContent)
  };

  fs.writeFileSync(path.join(dataDir, 'summary.json'), JSON.stringify(summary, null, 2));
  
  logger.info('✅ Content seeding completed!');
  logger.info(`📊 Generated ${summary.totalNews} news articles and ${summary.totalPosts} blog posts across ${summary.totalSubdomains} subdomains`);
  
  return summary;
}

// Run if called directly
if (require.main === module) {
  seedInitialContent();
}

module.exports = { seedInitialContent, generateAllContent };