const cron = require('node-cron');
const { getFirestore } = require('../config/firebase');
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

      // Run twice daily as per spec:
      // - Morning: 6 AM EST (Article 1)
      // - Afternoon: 3 PM EST (Article 2)
      // Note: Cron runs in server timezone, adjust if needed
      cron.schedule('0 6 * * *', () => {
        logger.info('🔄 Starting morning news curation (6 AM EST)...');
        this.curateDailyNews('morning');
      });

      cron.schedule('0 15 * * *', () => {
        logger.info('🔄 Starting afternoon news curation (3 PM EST)...');
        this.curateDailyNews('afternoon');
      });

      agentStatus.newsAgent = {
        status: 'running',
        error: null,
        lastStarted: new Date().toISOString()
      };
      logger.info('📰 News curation agent started - runs twice daily at 6 AM and 3 PM EST');
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
      const { getFirestore } = require('../config/firebase');
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
   * @param {string} timeSlot - 'morning' or 'afternoon' to track which run this is
   */
  async curateDailyNews(timeSlot = 'general') {
    if (this.isRunning) {
      logger.warn('News curation already running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      const db = getFirestore();
      const subdomains = getAllSubdomains();

      logger.info(`📰 Curating ${timeSlot} news for ${subdomains.length} subdomains`);

      for (const subdomain of subdomains) {
        await this.curateSubdomainNews(db, subdomain, timeSlot);
      }

      logger.info(`✅ ${timeSlot} news curation completed successfully`);
    } catch (error) {
      logger.error('❌ Error during news curation:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Curate news for a specific subdomain
   * Per spec: 2 articles per day (morning & afternoon)
   * @param {string} timeSlot - 'morning' or 'afternoon' 
   */
  async curateSubdomainNews(db, subdomain, timeSlot = 'general') {
    try {
      const config = getSubdomainConfig(subdomain);
      if (!config) {
        logger.warn(`No configuration found for subdomain: ${subdomain}`);
        return;
      }

      logger.info(`📰 Curating ${timeSlot} news for subdomain: ${subdomain} (${config.category})`);

      // Fetch 2 articles per run (one for each time slot)
      const articles = await this.fetchNewsArticles(config.category, config.primarySkills, 2);

      if (!articles || articles.length === 0) {
        logger.warn(`No articles generated for ${subdomain}, checking for reuse policy`);
        await this.handleInsufficientArticles(db, subdomain, timeSlot);
        return;
      }

      // Get news collection reference
      const newsCollection = db.collection('gurus').doc(subdomain).collection('news');

      // Add metadata tags per spec: [subdomain_topic, US, YYYY-MM-DD]
      const today = new Date().toISOString().split('T')[0];
      const curatedArticles = articles.slice(0, 2).map(article => ({
        ...article,
        publishedAt: Date.now(),
        curatedAt: Date.now(),
        subdomain,
        timeSlot, // Track which time slot this article belongs to
        aiGenerated: true,
        tags: [config.category, 'US', today],
        metadata: {
          subdomainTopic: config.category,
          region: 'US',
          date: today,
          timeSlot
        }
      }));

      // Store new articles (append, don't delete old ones yet)
      const batch = db.batch();

      curatedArticles.forEach(article => {
        const articleRef = newsCollection.doc();
        batch.set(articleRef, article);
      });

      await batch.commit();

      // Clean up old articles (keep only the most recent 10)
      await this.cleanupOldArticles(db, subdomain);

      logger.info(`✅ Curated ${curatedArticles.length} ${timeSlot} articles for ${subdomain}`);

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
   * Handle cases where insufficient new articles are available
   * Per spec: Reuse policy - carry forward prior-day entries with refreshed timestamps
   */
  async handleInsufficientArticles(db, subdomain, timeSlot) {
    try {
      const newsCollection = db.collection('gurus').doc(subdomain).collection('news');
      const recentArticles = await newsCollection
        .orderBy('publishedAt', 'desc')
        .limit(2)
        .get();

      if (recentArticles.empty) {
        logger.warn(`No articles to reuse for ${subdomain}, continuity cannot be maintained`);
        return;
      }

      // Carry forward the most recent articles with refreshed timestamps
      const batch = db.batch();
      const today = new Date().toISOString().split('T')[0];

      recentArticles.forEach(doc => {
        const article = doc.data();
        const refreshedArticleRef = newsCollection.doc();

        batch.set(refreshedArticleRef, {
          ...article,
          publishedAt: Date.now(),
          curatedAt: Date.now(),
          timeSlot,
          reused: true,
          originalPublishedAt: article.publishedAt,
          tags: [article.subdomain || subdomain, 'US', today],
          metadata: {
            ...article.metadata,
            date: today,
            timeSlot,
            reused: true
          }
        });
      });

      await batch.commit();
      logger.info(`📝 Carried forward ${recentArticles.size} articles for ${subdomain} (${timeSlot})`);
    } catch (error) {
      logger.error(`Error handling insufficient articles for ${subdomain}:`, error.message);
    }
  }

  /**
   * Clean up old news articles, keeping only the 10 most recent
   */
  async cleanupOldArticles(db, subdomain) {
    try {
      const newsCollection = db.collection('gurus').doc(subdomain).collection('news');
      const allArticles = await newsCollection
        .orderBy('publishedAt', 'desc')
        .get();

      if (allArticles.size <= 10) {
        return; // Nothing to clean up
      }

      // Delete articles beyond the 10 most recent
      const batch = db.batch();
      let count = 0;

      allArticles.forEach((doc, index) => {
        if (index >= 10) {
          batch.delete(doc.ref);
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
        logger.info(`🧹 Cleaned up ${count} old articles for ${subdomain}`);
      }
    } catch (error) {
      logger.error(`Error cleaning up old articles for ${subdomain}:`, error.message);
    }
  }

  /**
   * Fetch and curate REAL news articles from external sources
   * Uses news search APIs and AI to find, filter, and curate actual news
   * @param {string} category - The subdomain category
   * @param {Array} skills - Primary skills for the subdomain
   * @param {number} limit - Number of articles to curate (default 2 per spec)
   */
  async fetchNewsArticles(category, skills, limit = 2) {
    try {
      logger.info(`� Searching for ${limit} real news articles for category: ${category}`);

      // Try multiple news search methods
      const searchResult = await this.searchRealNewsArticles(category, skills, limit);

      if (searchResult.success && searchResult.articles.length > 0) {
        logger.info(`✅ Found ${searchResult.articles.length} real news articles via ${searchResult.source}`);

        // Filter articles to ensure they meet age requirements
        // Per spec: <48 hours old preferred, ≤72 hours max
        const now = Date.now();
        const maxAge = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

        const validArticles = searchResult.articles.filter(article => {
          if (!article.publishedAt) return false; // Require timestamp for real news
          const articleAge = now - article.publishedAt;
          return articleAge <= maxAge;
        });

        // Use AI to create 1-2 sentence summaries for the real articles
        const curatedArticles = await this.createNewsSummaries(validArticles, category);

        return curatedArticles.slice(0, limit);
      } else {
        logger.error('❌ No real news articles found from any source');
        throw new Error(`Real news search failed: ${searchResult.error || 'Unknown error'}`);
      }
    } catch (error) {
      logger.error('Error in fetchNewsArticles:', error.message);
      throw error; // Always throw error - NO fallback to mock content
    }
  }  /**
   * Search for real news articles from multiple sources
   * Uses NewsAPI.org and RSS feeds to find actual recent news articles
   * @param {string} category - The subdomain category
   * @param {Array} skills - Primary skills for the subdomain  
   * @param {number} limit - Number of articles to find
   */
  async searchRealNewsArticles(category, skills, limit = 2) {
    // axios not needed - using built-in methods in called functions
    const { getConfig } = require('../config/appConfig');
    const config = getConfig();

    try {
      logger.info(`🔍 Searching real news sources for ${category} articles...`);

      // Try NewsAPI.org first if available
      if (config.newsApiKey) {
        const newsApiResult = await this.searchNewsAPI(category, skills, limit);
        if (newsApiResult.success && newsApiResult.articles.length > 0) {
          return newsApiResult;
        }
      }

      // Try RSS feeds as fallback
      const rssResult = await this.searchRSSFeeds(category, skills, limit);
      if (rssResult.success && rssResult.articles.length > 0) {
        return rssResult;
      }

      // If no real news sources work, fail in production
      if (process.env.NODE_ENV === 'production') {
        throw new Error('All real news sources failed - no articles available');
      }

      logger.error('All real news sources failed');
      return {
        success: false,
        articles: [],
        error: 'No real news sources available'
      };

    } catch (error) {
      logger.error('Real news search failed:', error.message);
      return {
        success: false,
        articles: [],
        error: error.message
      };
    }
  }

  /**
   * Search NewsAPI.org for real news articles
   */
  async searchNewsAPI(category, skills, limit = 2) {
    const axios = require('axios');
    const { getConfig } = require('../config/appConfig');
    const config = getConfig();

    if (!config.newsApiKey) {
      return { success: false, articles: [], error: 'NewsAPI key not configured' };
    }

    try {
      // Build search query from skills
      const skillTerms = skills.slice(0, 3).map(skill => skill.replace('-', ' ')).join(' OR ');
      const query = `(${skillTerms}) AND ${category}`;

      // Get articles from last 3 days
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 3);

      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          from: fromDate.toISOString().split('T')[0],
          language: 'en',
          domains: 'cnn.com,reuters.com,techcrunch.com,forbes.com,wsj.com,bloomberg.com,apnews.com,npr.org,bbc.com',
          sortBy: 'publishedAt',
          pageSize: limit * 2 // Get extra in case some are filtered out
        },
        headers: {
          'X-API-Key': config.newsApiKey
        }
      });

      const articles = response.data.articles
        .filter(article => {
          // Filter out articles without proper URLs or content
          return article.url &&
            article.title &&
            article.description &&
            !article.title.includes('[Removed]') &&
            article.url.startsWith('http');
        })
        .slice(0, limit)
        .map(article => ({
          id: `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: article.title,
          summary: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: new Date(article.publishedAt).getTime(),
          keywords: skills,
          relevanceScore: 0.9,
          imageUrl: article.urlToImage || null
        }));

      logger.info(`✅ Found ${articles.length} real articles from NewsAPI`);

      return {
        success: true,
        articles,
        source: 'newsapi'
      };

    } catch (error) {
      logger.error('NewsAPI search failed:', error.message);
      return {
        success: false,
        articles: [],
        error: error.message
      };
    }
  }

  /**
   * Search RSS feeds for real news articles as fallback
   */
  async searchRSSFeeds(category, skills, limit = 2) {
    try {
      const Parser = require('rss-parser');
      const parser = new Parser();

      // Popular RSS feeds by category
      const rssFeedsByCategory = {
        tech: [
          'https://techcrunch.com/feed/',
          'https://www.wired.com/feed/',
          'https://feeds.arstechnica.com/arstechnica/index'
        ],
        business: [
          'https://feeds.bloomberg.com/markets/news.rss',
          'https://www.reuters.com/business/rss',
          'https://www.forbes.com/real-time/feed2/'
        ],
        art: [
          'https://www.artforum.com/news.rss',
          'https://www.artnews.com/feed/'
        ],
        default: [
          'https://feeds.reuters.com/reuters/topNews',
          'https://feeds.npr.org/1001/rss.xml'
        ]
      };

      const feeds = rssFeedsByCategory[category] || rssFeedsByCategory.default;
      let allArticles = [];

      // Search each RSS feed
      for (const feedUrl of feeds.slice(0, 2)) {
        try {
          const feed = await parser.parseURL(feedUrl);

          const feedArticles = feed.items
            .filter(item => {
              // Only recent articles (last 3 days)
              const articleDate = new Date(item.pubDate);
              const threeDaysAgo = new Date();
              threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

              return articleDate > threeDaysAgo &&
                item.link &&
                item.title &&
                item.contentSnippet;
            })
            .slice(0, limit)
            .map(item => ({
              id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: item.title,
              summary: item.contentSnippet || item.content?.substring(0, 200) + '...',
              url: item.link,
              source: feed.title || 'RSS Feed',
              publishedAt: new Date(item.pubDate).getTime(),
              keywords: skills,
              relevanceScore: 0.8
            }));

          allArticles = allArticles.concat(feedArticles);

        } catch (feedError) {
          logger.warn(`RSS feed failed: ${feedUrl} - ${feedError.message}`);
        }
      }

      // Sort by date and take the most recent
      allArticles.sort((a, b) => b.publishedAt - a.publishedAt);
      const articles = allArticles.slice(0, limit);

      logger.info(`✅ Found ${articles.length} real articles from RSS feeds`);

      return {
        success: articles.length > 0,
        articles,
        source: 'rss-feeds'
      };

    } catch (error) {
      logger.error('RSS feed search failed:', error.message);
      return {
        success: false,
        articles: [],
        error: error.message
      };
    }
  }

  /**
   * Create AI-generated summaries for real news articles
   * Takes real articles and creates concise 1-2 sentence summaries
   */
  async createNewsSummaries(articles, category) {
    const axios = require('axios');
    const { getConfig } = require('../config/appConfig');
    const config = getConfig();

    if (!articles.length) return [];

    try {
      logger.info(`📝 Creating summaries for ${articles.length} real news articles...`);

      const messages = [
        {
          role: 'system',
          content: `You are a news editor creating concise summaries. Create 1-2 sentence summaries (max 50 words) for real news articles that highlight why they matter to ${category} learners.`
        },
        {
          role: 'user',
          content: `Create concise summaries for these real news articles:

${articles.map((article, i) => `${i + 1}. "${article.title}" from ${article.source}
Original summary: ${article.summary || 'No summary provided'}`).join('\n\n')}

For each article, provide:
- A 1-2 sentence summary (max 50 words)
- Keep the original URL and source unchanged
- Focus on relevance to ${category} skill development

Return the complete articles with improved summaries in this JSON format:
[{"id": "...", "title": "...", "url": "...", "source": "...", "publishedAt": ..., "summary": "New concise summary", "relevance": "..."}]`
        }
      ];

      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'anthropic/claude-3.5-sonnet',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${config.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yoohoo.guru',
          'X-Title': 'YooHoo.guru News Summary Generation'
        }
      });

      const content = response.data.choices[0].message.content;

      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const summarizedArticles = JSON.parse(jsonMatch[0]);
          return summarizedArticles;
        }
      } catch {
        logger.warn('Failed to parse summarized articles, using originals');
      }

      // Fallback: return original articles if summary generation fails
      return articles;

    } catch (error) {
      logger.warn('Summary generation failed, using original articles:', error.message);
      return articles;
    }
  }

  /**
   * Extract news articles from text when JSON parsing fails
   */
  extractNewsFromText(content, category, limit = 2) {
    const articles = [];

    // Look for URLs and titles in the text
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlPattern) || [];

    // Try to extract structured information
    // Parse content for article metadata

    for (let i = 0; i < Math.min(limit, urls.length); i++) {
      const url = urls[i];
      let title = `Latest ${category} News Update`;
      let source = 'News Source';

      // Try to find title near the URL
      const urlIndex = content.indexOf(url);
      const before = content.substring(Math.max(0, urlIndex - 200), urlIndex);
      const titleMatch = before.match(/["']([^"']{20,}?)["']/) || before.match(/\b([A-Z][^.!?]+[.!?])/);

      if (titleMatch) {
        title = titleMatch[1].trim();
      }

      // Try to extract source
      const sourceMatch = before.match(/\b(CNN|Reuters|AP|WSJ|TechCrunch|Forbes|BBC|NBC|CBS|ABC)\b/i);
      if (sourceMatch) {
        source = sourceMatch[1];
      }

      articles.push({
        id: `extracted-news-${Date.now()}-${i}`,
        title: title.substring(0, 80),
        url: url,
        source: source,
        publishedAt: Date.now() - (i * 2 * 60 * 60 * 1000), // Stagger by 2 hours
        summary: `Breaking news in ${category}: Latest developments affecting professionals and learners in the field.`,
        relevance: `Important update for ${category} professionals and skill developers.`
      });
    }

    return articles.slice(0, limit);
  }

  /**
   * Try multiple AI providers for news generation with proper fallback
   * @param {number} limit - Number of articles to request (default 2)
   */
  async tryAIProvidersForNews(category, skills, limit = 2) {
    const axios = require('axios');
    const { getConfig } = require('../config/appConfig');
    const config = getConfig();

    // Provider 1: OpenRouter with Perplexity (web search capabilities)
    try {
      logger.info(`🤖 Attempting ${limit} news articles via OpenRouter/Perplexity...`);
      const response = await axios.post(`${config.apiBaseUrl}/api/ai/generate-news`, {
        category,
        skills: skills.slice(0, 3),
        limit
      });

      if (response.data.success && response.data.data.length > 0) {
        return { success: true, data: response.data.data, provider: 'openrouter-perplexity' };
      }
    } catch (error) {
      logger.warn('OpenRouter/Perplexity failed:', error.message);
    }

    // Provider 2: OpenRouter with Claude
    try {
      logger.info(`🤖 Attempting ${limit} news articles via OpenRouter/Claude...`);
      const claudeResult = await this.generateNewsWithClaude(category, skills, config, limit);
      if (claudeResult.success) {
        return { success: true, data: claudeResult.data, provider: 'openrouter-claude' };
      }
    } catch (error) {
      logger.warn('OpenRouter/Claude failed:', error.message);
    }

    // Provider 3: OpenAI GPT-4 (if API key available)
    if (process.env.OPENAI_API_KEY) {
      try {
        logger.info(`🤖 Attempting ${limit} news articles via OpenAI...`);
        const openaiResult = await this.generateNewsWithOpenAI(category, skills, limit);
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
   * @param {number} limit - Number of articles to generate (default 2)
   */
  async generateNewsWithClaude(category, skills, config, limit = 2) {
    const axios = require('axios');

    if (!config.openrouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `You are a news curator for yoohoo.guru, specializing in U.S.-relevant industry trends and developments. 
Create concise, credible news summaries optimized for quick browsing. Each article should be current (< 48 hours old preferred), 
from verified sources, and include proper source attribution for outbound links.`
      },
      {
        role: 'user',
        content: `Create ${limit} current news articles related to ${category} and skills like ${skills.join(', ')} for a U.S. audience.

Requirements per article:
1. Title: Compelling headline (< 60 characters)
2. Summary: 1-2 sentences, max 50 words total
3. Source: Name of credible publisher (different sources if possible)
4. URL: Direct link to original source article
5. Age: Must be < 48 hours old (preferred) or ≤ 72 hours max
6. Topics: Mix of product/tech releases, cultural trends, regulation updates, or lifestyle shifts

Return as JSON array with objects containing:
{
  "id": "unique-id",
  "title": "Article Title",
  "summary": "Brief 1-2 sentence summary under 50 words",
  "url": "https://source-website.com/article",
  "source": "Publisher Name",
  "publishedAt": timestamp (within last 72 hours),
  "relevance": "Why this matters to ${category} learners"
}

Make each article unique, informative, and from credible U.S. sources.`
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
      articles = this.parseNewsFromText(content, category, limit);
    }

    return { success: true, data: articles.slice(0, limit) };
  }

  /**
   * Generate news using OpenAI GPT-4
   * @param {number} limit - Number of articles to generate (default 2)
   */
  async generateNewsWithOpenAI(category, skills, limit = 2) {
    const axios = require('axios');

    const messages = [
      {
        role: 'system',
        content: `You are a news curator for yoohoo.guru, specializing in U.S.-relevant industry trends. 
Create concise news summaries (title + 1-2 sentences, ≤50 words) with source URLs for outbound linking.`
      },
      {
        role: 'user',
        content: `Create ${limit} current U.S. news articles related to ${category} and skills like ${skills.join(', ')}.
Each must include: id, title (<60 chars), summary (≤50 words), url (source link), source (publisher), publishedAt (within 72 hours), relevance.
Return as JSON array.`
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
      articles = this.parseNewsFromText(content, category, limit);
    }

    return { success: true, data: articles.slice(0, limit) };
  }

  /**
   * Parse news from text when JSON parsing fails
   * @param {number} limit - Number of articles to return (default 2)
   */
  parseNewsFromText(content, category, limit = 2) {
    const articles = [];
    const sections = content.split('\n\n');
    let currentArticle = {};

    sections.forEach(section => {
      if (section.includes('title:') || section.includes('Title:')) {
        if (currentArticle.title) articles.push(currentArticle);
        currentArticle = {
          id: `ai-news-${Date.now()}-${articles.length}`,
          title: section.split(':')[1]?.trim() || 'Industry Update',
          publishedAt: Date.now() - (Math.random() * 48 * 60 * 60 * 1000), // Within last 48 hours
          source: 'AI News Curator',
          url: '#' // Placeholder URL when real source unavailable
        };
      } else if (section.includes('summary:') || section.includes('Summary:')) {
        currentArticle.summary = section.split(':')[1]?.trim();
      } else if (section.length > 50 && !currentArticle.summary) {
        currentArticle.summary = section.trim();
      }
    });

    if (currentArticle.title) articles.push(currentArticle);

    // Ensure we have the requested number of articles
    while (articles.length < limit) {
      articles.push({
        id: `ai-news-${Date.now()}-${articles.length}`,
        title: `Latest Developments in ${category}`,
        summary: `Industry experts discuss emerging trends and innovations in ${category} that are transforming how professionals develop their skills.`,
        publishedAt: Date.now() - (articles.length * 6 * 60 * 60 * 1000), // Stagger by 6 hours
        source: 'AI News Curator',
        url: '#'
      });
    }

    return articles.slice(0, limit);
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

      // Per spec: Run every Monday at 10 AM EST (weekly, not biweekly)
      // Cron syntax: '0 10 * * 1' = At 10:00 on Monday
      cron.schedule('0 10 * * 1', () => {
        logger.info('🔄 Starting weekly blog curation (Monday 10 AM EST)...');
        this.curateBlogContent();
      });

      agentStatus.blogAgent = {
        status: 'running',
        error: null,
        lastStarted: new Date().toISOString()
      };
      logger.info('📝 Blog curation agent started - runs weekly on Mondays at 10 AM EST');
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
      const { getFirestore } = require('../config/firebase');
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

      logger.info(`📝 Curating weekly blog content for ${subdomains.length} subdomains`);

      for (const subdomain of subdomains) {
        await this.curateSubdomainBlogContent(db, subdomain);
      }

      logger.info('✅ Weekly blog curation completed successfully');
    } catch (error) {
      logger.error('❌ Error during blog curation:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Curate blog content for a specific subdomain
   * Per spec: 1 blog entry per week, 1200-2000 words, with SEO optimization
   */
  async curateSubdomainBlogContent(db, subdomain) {
    try {
      const config = getSubdomainConfig(subdomain);
      if (!config) {
        logger.warn(`No configuration found for subdomain: ${subdomain}`);
        return;
      }

      logger.info(`📝 Generating weekly blog content for ${subdomain}`);

      const blogPosts = await this.generateBlogPosts(config, subdomain);
      const bestPost = this.selectBestPosts(blogPosts, 1)[0]; // Get the single best post

      if (!bestPost) {
        logger.warn(`No blog post generated for ${subdomain}`);
        return;
      }

      // Store post in Firestore with full metadata per spec
      const postsCollection = db.collection('gurus').doc(subdomain).collection('posts');
      const postRef = postsCollection.doc();

      // Add SEO metadata and schema per spec
      const today = new Date().toISOString().split('T')[0];
      await postRef.set({
        ...bestPost,
        publishedAt: Date.now(),
        curatedAt: Date.now(),
        subdomain,
        status: 'published',
        featured: true,
        // SEO metadata per spec
        seo: {
          metaTitle: bestPost.title.substring(0, 60), // ≤60 chars
          metaDescription: bestPost.excerpt.substring(0, 160), // ≤160 chars
          keywords: bestPost.tags || [],
          region: 'US'
        },
        // Schema markup per spec
        schema: {
          type: bestPost.schemaType || 'BlogPosting',
          datePublished: new Date().toISOString(),
          author: bestPost.author || config.character,
          category: config.category
        },
        // Metadata tags per spec
        tags: [...(bestPost.tags || []), config.category, 'US', today],
        metadata: {
          subdomainTopic: config.category,
          region: 'US',
          date: today,
          wordCount: bestPost.content ? bestPost.content.split(/\s+/).length : 0
        }
      });

      logger.info(`📝 Generated 1 weekly blog post for ${subdomain}: "${bestPost.title}"`);

    } catch (error) {
      logger.error(`Error curating blog content for ${subdomain}:`, error);
    }
  }

  /**
   * Generate blog posts for given subdomain config
   * Per spec: Generate 1 high-quality blog post (1200-2000 words)
   * Uses AI providers with proper fallback chain
   */
  async generateBlogPosts(config, subdomain) {
    try {
      logger.info(`🔄 Generating weekly blog post for ${config.category}`);

      const posts = [];

      // Generate 1 blog post for a primary skill (per spec: 1 per week)
      const skill = config.primarySkills[0]; // Use the first primary skill

      try {
        const skillTitle = skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Create topic variety using different formats
        const topicFormats = [
          `Master ${skillTitle}: Complete Guide for 2024`,
          `${skillTitle} Best Practices: Expert Tips and Techniques`,
          `Common ${skillTitle} Mistakes and How to Avoid Them`,
          `${skillTitle} for Beginners: Everything You Need to Know`,
          `Advanced ${skillTitle} Strategies for Success`
        ];

        // Rotate through formats based on week of year
        const weekOfYear = Math.floor((Date.now() / (1000 * 60 * 60 * 24 * 7)));
        const topic = topicFormats[weekOfYear % topicFormats.length];

        // Try AI generation with fallback
        const aiResult = await this.tryAIGenerationForBlog(topic, config, skill, subdomain);

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

      return posts;

    } catch (error) {
      logger.error('Error in generateBlogPosts:', error.message);

      if (process.env.NODE_ENV === 'production') {
        throw error;
      } else {
        logger.warn('⚠️ Development mode: falling back to placeholder blog posts');
        return this.generatePlaceholderBlogPosts(config, 1); // Only 1 per spec
      }
    }
  }

  /**
   * Try AI generation for a single blog post with fallback
   * Per spec: 1200-2000 words with proper structure and SEO
   */
  async tryAIGenerationForBlog(topic, config, skill, subdomain) {
    const axios = require('axios');
    const { getConfig } = require('../config/appConfig');
    const appConfig = getConfig();

    // Try the main AI endpoint first
    try {
      const response = await axios.post(`${appConfig.apiBaseUrl}/api/ai/generate-blog-post`, {
        topic,
        category: config.category,
        targetAudience: 'U.S. skill learners from beginners to intermediate levels',
        keywords: [skill, config.category, 'guide', 'tutorial', 'tips', 'best practices'],
        wordCount: Math.floor(Math.random() * 800) + 1200, // 1200-2000 words per spec
        includeAffiliateSection: true, // Per spec: 2-4 contextual links
        structure: {
          intro: true,
          subheadings: true, // H2/H3 per spec
          visuals: true,
          conclusion: true,
          cta: true // Call-to-action box per spec
        },
        seo: {
          metaTitleMaxLength: 60, // Per spec
          metaDescriptionMaxLength: 160, // Per spec
          region: 'US'
        }
      });

      if (response.data.success) {
        const aiPost = response.data.data;

        // Generate slug from title
        const slug = aiPost.slug || topic.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        return {
          success: true,
          data: {
            ...aiPost,
            id: `${config.category}-${skill}-${Date.now()}`,
            slug,
            author: config.character,
            subdomain: subdomain || skill,
            featured: true,
            viewCount: 0, // Start fresh
            views: 0,
            likes: 0,
            relevanceScore: 0.9,
            aiGenerated: true,
            estimatedReadTime: aiPost.estimatedReadTime || `${Math.ceil((aiPost.content?.split(' ').length || 1500) / 200)} min`,
            // Schema type per spec (Article / BlogPosting / Review)
            schemaType: 'BlogPosting',
            // Ensure proper structure per spec
            hasAffiliateLinks: true,
            internalLinks: aiPost.internalLinks || [],
            readTime: aiPost.estimatedReadTime || `${Math.ceil((aiPost.content?.split(' ').length || 1500) / 200)} min`
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
   * @param {number} count - Number of posts to generate (default 1 per spec)
   */
  generatePlaceholderBlogPosts(config, count = 1) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('🚨 CRITICAL: Attempted to generate placeholder blog posts in production!');
      throw new Error('Placeholder blog content is not allowed in production');
    }

    logger.warn(`⚠️ Generating ${count} placeholder blog post(s) for development/testing`);

    const posts = [];
    const { category, primarySkills } = config;

    primarySkills.slice(0, count).forEach((skill, index) => {
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
        estimatedReadTime: Math.floor(Math.random() * 10) + 5 + ' min',
        views: 0,
        likes: 0,
        relevanceScore: 0.9 - (index * 0.1),
        isDevelopmentPlaceholder: true,
        schemaType: 'BlogPosting'
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