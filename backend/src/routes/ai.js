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
 */
router.post('/generate-blog-post', async (req, res) => {
  try {
    const { topic, category, targetAudience, keywords } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        error: 'Topic and category are required'
      });
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert content writer for yoohoo.guru, a skill-sharing platform. Create engaging, educational blog posts that help people learn and improve their skills. Write in a conversational yet professional tone that encourages community learning and skill exchange.`
      },
      {
        role: 'user',
        content: `Create a comprehensive blog post about "${topic}" for the ${category} category. 

Requirements:
- Target audience: ${targetAudience || 'beginners to intermediate learners'}
- Keywords to include: ${keywords ? keywords.join(', ') : topic}
- Include practical tips and actionable advice
- Structure with clear headings and subheadings
- Include examples and real-world applications
- End with encouragement to connect with mentors on yoohoo.guru
- Aim for 1500-2500 words
- Use markdown formatting

Return ONLY the blog post content in markdown format, starting with the title as # heading.`
      }
    ];

    const content = await makeOpenRouterRequest(messages, 'anthropic/claude-3.5-sonnet', 6000);

    // Extract title and create metadata
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '') : topic;
    const excerpt = lines.find(line => line.length > 100 && !line.startsWith('#'))?.substring(0, 200) + '...' || 
                   `Learn about ${topic} and develop your skills in ${category}.`;

    const blogPost = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      excerpt,
      content,
      category,
      tags: keywords || [topic.toLowerCase(), category.toLowerCase()],
      estimatedReadTime: Math.ceil(content.split(' ').length / 200) + ' min',
      author: 'AI Content Assistant',
      publishedAt: new Date().toISOString()
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
 * Generate news articles using AI with web search
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

    const messages = [
      {
        role: 'system',
        content: `You are a news curator for yoohoo.guru, specializing in finding and summarizing the latest industry trends and developments. Create engaging news summaries that are relevant to skill learners and teachers.`
      },
      {
        role: 'user',
        content: `Find and create ${limit} current news articles related to ${category} and skills like ${skills ? skills.join(', ') : category}. 

For each article, provide:
1. A compelling headline
2. A 2-3 sentence summary
3. Why it's relevant to skill learners
4. Current date

Focus on recent developments, trends, studies, or industry changes that would interest people learning or teaching these skills. Make each article unique and informative.

Return as JSON array with objects containing: id, title, summary, relevance, publishedAt (today's date in ISO format), source.`
      }
    ];

    const response = await makeOpenRouterRequest(messages, 'perplexity/llama-3.1-sonar-large-128k-online', 4000);

    try {
      // Try to parse as JSON, fallback to structured text
      let articles;
      try {
        articles = JSON.parse(response);
      } catch {
        // Fallback: extract structured content from text response
        articles = [];
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
        
        // Ensure we have the right number of articles
        while (articles.length < limit) {
          articles.push({
            id: `ai-news-${Date.now()}-${articles.length}`,
            title: `Latest Trends in ${category}`,
            summary: `Discover the newest developments in ${category} that are shaping how people learn and develop their skills.`,
            publishedAt: new Date().toISOString(),
            source: 'AI News Curator'
          });
        }
      }

      res.json({
        success: true,
        data: articles.slice(0, limit)
      });

    } catch (parseError) {
      logger.error('News parsing error:', parseError);
      res.status(500).json({
        success: false,
        error: 'Failed to parse AI response'
      });
    }

  } catch (error) {
    logger.error('News generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

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