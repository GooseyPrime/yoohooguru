const express = require('express');
const axios = require('axios');
const { getConfig } = require('../config/appConfig');
const { logger } = require('../utils/logger');

const router = express.Router();

// OpenRouter configuration
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Get OpenRouter configuration
 */
function getOpenRouterConfig() {
  const config = getConfig();
  return {
    apiKey: config.openrouterApiKey,
    baseUrl: process.env.OPENROUTER_API_URL || OPENROUTER_BASE_URL
  };
}

/**
 * Make request to OpenRouter API
 */
async function makeOpenRouterRequest(messages, model = 'anthropic/claude-3.5-sonnet', maxTokens = 4000) {
  const config = getOpenRouterConfig();
  
  if (!config.apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const response = await axios.post(`${config.baseUrl}/chat/completions`, {
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoohoo.guru',
        'X-Title': 'YooHoo.guru AI Content Generation'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error('OpenRouter API error:', error.response?.data || error.message);
    throw new Error(`AI content generation failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Generate blog post content using AI
 * Enhanced to support spec requirements:
 * - 1200-2000 words
 * - Proper structure (intro, subheadings, conclusion, CTA)
 * - SEO optimization (≤60 char title, ≤160 char description)
 * - Affiliate integration placeholders
 * - Internal linking suggestions
 */
router.post('/generate-blog-post', async (req, res) => {
  try {
    const { 
      topic, 
      category, 
      targetAudience, 
      keywords,
      wordCount = 1500, // Default to middle of 1200-2000 range
      includeAffiliateSection = false,
      structure = {},
      seo = {}
    } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        error: 'Topic and category are required'
      });
    }

    // Ensure word count is within spec (1200-2000)
    const targetWordCount = Math.max(1200, Math.min(2000, wordCount));

    const messages = [
      {
        role: 'system',
        content: `You are an expert content writer for yoohoo.guru, a U.S.-based skill-sharing platform. 
Create SEO-optimized, engaging blog posts (${targetWordCount} words) that help people learn and improve their skills. 
Write in a conversational yet professional tone that encourages community learning and skill exchange.
Focus on U.S. market and cultural context.`
      },
      {
        role: 'user',
        content: `Create a comprehensive blog post about "${topic}" for the ${category} category targeting ${targetAudience || 'U.S. skill learners from beginners to intermediate levels'}.

Requirements:
- Target word count: ${targetWordCount} words (minimum 1200, maximum 2000)
- Keywords to naturally include: ${keywords ? keywords.join(', ') : topic}
- SEO title: ≤60 characters, compelling and keyword-rich
- Meta description: ≤160 characters, action-oriented
- U.S. market focus with relevant examples and context

Structure (MUST include):
1. **Introduction** (engaging hook, problem statement, what readers will learn)
2. **Main Content** with H2/H3 subheadings:
   - 3-5 main sections with descriptive subheadings
   - Practical tips and actionable advice
   - Real-world examples and use cases
   - Step-by-step guidance where applicable
3. **Visual Suggestions** (describe where images/infographics would enhance content)
4. **Conclusion** (key takeaways summary)
5. **Call-to-Action** (encourage readers to book a session, join community)
${includeAffiliateSection ? '6. **Recommended Resources** section with 2-4 product/tool suggestions (use placeholder links)' : ''}

Additional Requirements:
- Include 2-3 opportunities for internal links to related topics (mark as [INTERNAL: topic name])
- Use markdown formatting with proper heading hierarchy
- Add bullet points and numbered lists for readability
- Include actionable tips readers can implement immediately
- End with encouragement to connect with expert instructors on yoohoo.guru

Return as JSON with this structure:
{
  "title": "SEO-optimized title (≤60 chars)",
  "metaDescription": "Compelling description (≤160 chars)",
  "excerpt": "2-3 sentence teaser (200 chars max)",
  "content": "Full article in markdown",
  "internalLinks": ["topic1", "topic2"],
  "affiliateOpportunities": ["product1", "product2"],
  "visualSuggestions": ["description of image 1", "description of image 2"]
}`
      }
    ];

    const responseContent = await makeOpenRouterRequest(messages, 'anthropic/claude-3.5-sonnet', 8000);

    // Try to parse as JSON first
    let blogData;
    try {
      // Remove markdown code blocks if present
      const jsonContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      blogData = JSON.parse(jsonContent);
    } catch {
      // Fallback: Extract from markdown format
      const lines = responseContent.split('\n');
      const titleLine = lines.find(line => line.startsWith('# '));
      const title = titleLine ? titleLine.replace('# ', '') : topic;
      const excerpt = lines.find(line => line.length > 100 && !line.startsWith('#'))?.substring(0, 200) + '...' || 
                     `Learn about ${topic} and develop your skills in ${category}.`;
      
      blogData = {
        title,
        metaDescription: excerpt.substring(0, 160),
        excerpt,
        content: responseContent,
        internalLinks: [],
        affiliateOpportunities: [],
        visualSuggestions: []
      };
    }

    // Sanitize title for slug generation
    const sanitizedTitle = (blogData.title || topic).substring(0, 200);
    const slug = sanitizedTitle
      .toLowerCase()
      .split('')
      .map(char => /[a-z0-9]/.test(char) ? char : '-')
      .join('')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const wordCountActual = (blogData.content || '').split(/\s+/).length;

    const blogPost = {
      title: blogData.title || topic,
      slug,
      excerpt: blogData.excerpt || blogData.metaDescription,
      content: blogData.content,
      category,
      tags: keywords || [topic.toLowerCase(), category.toLowerCase()],
      estimatedReadTime: Math.ceil(wordCountActual / 200) + ' min',
      author: 'AI Content Assistant',
      publishedAt: new Date().toISOString(),
      // SEO metadata per spec
      seo: {
        metaTitle: (blogData.title || topic).substring(0, 60),
        metaDescription: (blogData.metaDescription || blogData.excerpt || '').substring(0, 160),
        keywords: keywords || [],
        region: 'US'
      },
      // Internal linking suggestions
      internalLinks: blogData.internalLinks || [],
      // Affiliate opportunities
      affiliateOpportunities: blogData.affiliateOpportunities || [],
      // Visual suggestions
      visualSuggestions: blogData.visualSuggestions || [],
      // Metadata
      metadata: {
        wordCount: wordCountActual,
        targetWordCount,
        meetsWordCount: wordCountActual >= 1200 && wordCountActual <= 2000
      }
    };

    res.json({
      success: true,
      data: blogPost
    });

  } catch (error) {
    logger.error('Blog post generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate news articles using AI with proper fallback chain
 */
router.post('/generate-news', async (req, res) => {
  try {
    const { category, skills, limit = 3 } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }

    logger.info(`🔄 Generating ${limit} news articles for category: ${category}`);

    // Try multiple AI providers in order
    const aiResult = await tryMultipleAIProvidersForNews(category, skills, limit);
    
    if (aiResult.success) {
      logger.info(`✅ News generated successfully via ${aiResult.provider}`);
      res.json({
        success: true,
        data: aiResult.data.slice(0, limit),
        provider: aiResult.provider
      });
    } else {
      logger.error('❌ All AI providers failed for news generation');
      
      // In production, never return placeholder content
      if (process.env.NODE_ENV === 'production') {
        res.status(503).json({
          success: false,
          error: 'AI news generation temporarily unavailable',
          code: 'AI_SERVICE_UNAVAILABLE'
        });
      } else {
        // Development/test: return empty result to avoid hardcoded content
        logger.warn('⚠️ Development mode: returning empty result instead of placeholders');
        res.json({
          success: false,
          data: [],
          error: 'AI services unavailable in development',
          fallbackUsed: 'none'
        });
      }
    }

  } catch (error) {
    logger.error('News generation error:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

/**
 * Try multiple AI providers for news generation
 */
async function tryMultipleAIProvidersForNews(category, skills, limit) {
  const skillsArray = Array.isArray(skills) ? skills : [skills].filter(Boolean);
  
  // Provider 1: OpenRouter with Perplexity (best for current news)
  try {
    logger.info('🤖 Attempting news generation via OpenRouter/Perplexity...');
    const messages = createNewsPrompt(category, skillsArray, limit);
    const response = await makeOpenRouterRequest(messages, 'perplexity/llama-3.1-sonar-large-128k-online', 4000);
    const articles = parseAINewsResponse(response, category, limit);
    
    if (articles && articles.length > 0) {
      return { success: true, data: articles, provider: 'openrouter-perplexity' };
    }
  } catch (error) {
    logger.warn('OpenRouter/Perplexity failed:', error.message);
  }

  // Provider 2: OpenRouter with Claude
  try {
    logger.info('🤖 Attempting news generation via OpenRouter/Claude...');
    const messages = createNewsPrompt(category, skillsArray, limit);
    const response = await makeOpenRouterRequest(messages, 'anthropic/claude-3.5-sonnet', 4000);
    const articles = parseAINewsResponse(response, category, limit);
    
    if (articles && articles.length > 0) {
      return { success: true, data: articles, provider: 'openrouter-claude' };
    }
  } catch (error) {
    logger.warn('OpenRouter/Claude failed:', error.message);
  }

  // Provider 3: OpenAI GPT-4 (if API key available)
  if (process.env.OPENAI_API_KEY) {
    try {
      logger.info('🤖 Attempting news generation via OpenAI...');
      const result = await tryOpenAIForNews(category, skillsArray, limit);
      if (result.success) {
        return { success: true, data: result.data, provider: 'openai-gpt4' };
      }
    } catch (error) {
      logger.warn('OpenAI failed:', error.message);
    }
  }

  return { success: false, error: 'All AI providers failed' };
}

/**
 * Create news generation prompt
 */
function createNewsPrompt(category, skills, limit) {
  return [
    {
      role: 'system',
      content: `You are a news curator for yoohoo.guru, specializing in finding and summarizing the latest industry trends and developments. Create engaging news summaries that are relevant to skill learners and teachers.`
    },
    {
      role: 'user',
      content: `Find and create ${limit} current news articles related to ${category} and skills like ${skills.join(', ')}. 

For each article, provide:
1. A compelling headline
2. A 2-3 sentence summary
3. Why it's relevant to skill learners
4. Current date

Focus on recent developments, trends, studies, or industry changes that would interest people learning or teaching these skills. Make each article unique and informative.

Return as JSON array with objects containing: id, title, summary, relevance, publishedAt (today's date in ISO format), source.`
    }
  ];
}

/**
 * Parse AI news response with fallback parsing
 */
function parseAINewsResponse(response, category, limit) {
  try {
    // Try JSON parsing first
    return JSON.parse(response);
  } catch {
    // Fallback: extract structured content from text response
    const articles = [];
    const sections = response.split('\n\n');
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
    
    // Only add generic articles if we have less than required and it's not production
    if (articles.length < limit && process.env.NODE_ENV !== 'production') {
      while (articles.length < limit) {
        articles.push({
          id: `ai-news-${Date.now()}-${articles.length}`,
          title: `Latest Developments in ${category}`,
          summary: `Industry experts discuss emerging trends and innovations in ${category} that are transforming professional skill development.`,
          publishedAt: new Date().toISOString(),
          source: 'AI News Curator'
        });
      }
    }

    return articles;
  }
}

/**
 * Try OpenAI for news generation
 */
async function tryOpenAIForNews(category, skills, limit) {
  const axios = require('axios');
  
  const messages = createNewsPrompt(category, skills, limit);

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
  const articles = parseAINewsResponse(content, category, limit);
  
  return { success: true, data: articles };
}

/**
 * Health check endpoint
 */
router.get('/', (req, res) => {
  const config = getOpenRouterConfig();
  res.json({
    success: true,
    data: { 
      message: 'AI endpoint active',
      openrouterConfigured: !!config.apiKey,
      baseUrl: config.baseUrl
    }
  });
});

module.exports = router;