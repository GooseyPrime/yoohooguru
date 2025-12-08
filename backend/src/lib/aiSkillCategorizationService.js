/**
 * AI-powered skill categorization service
 * Uses OpenRouter primary and OpenAI fallback to map custom skills
 * to existing top-level categories.
 */

const axios = require('axios');
const { getConfig } = require('../config/appConfig');
const { logger } = require('../utils/logger');
const { SKILL_CATEGORIES } = require('../utils/skillCategorization');

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

class AISkillCategorizationService {
  constructor() {
    this.config = getConfig();
    this.openrouterApiKey = this.config.openrouterApiKey;
    this.openaiApiKey = this.config.openaiApiKey || process.env.OPENAI_API_KEY;
    this.fallbackToOpenAI = true;
    this.availableCategories = Object.keys(SKILL_CATEGORIES);
  }

  buildMessages({ title, summary }) {
    const categoryList = this.availableCategories.join(' | ');

    const systemPrompt = `You are a category classification assistant for a skill-sharing platform.
Return the single best matching category from this allowed list:
${categoryList}
Never invent new categories.`;

    const userPrompt = `Skill Title: ${title}\nSkill Summary: ${summary || 'No summary provided'}\n
Choose the closest matching category from the allowed list and respond in JSON with keys category, confidence (0-1), and reasoning.`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
  }

  async makeOpenRouterRequest(messages, model = 'anthropic/claude-3.5-sonnet') {
    if (!this.openrouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
      model,
      messages,
      max_tokens: 500,
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${this.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoohoo.guru',
        'X-Title': 'YooHoo.guru AI Skill Categorization'
      }
    });

    return response.data.choices[0].message.content;
  }

  async makeOpenAIRequest(messages, model = 'gpt-4o-mini') {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model,
      messages,
      max_tokens: 500,
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  }

  async makeAIRequest(messages) {
    try {
      const result = await this.makeOpenRouterRequest(messages);
      return { provider: 'openrouter', result };
    } catch (openrouterError) {
      logger.warn('OpenRouter skill categorization failed:', openrouterError.message);

      if (this.fallbackToOpenAI && this.openaiApiKey) {
        try {
          const result = await this.makeOpenAIRequest(messages);
          return { provider: 'openai', result };
        } catch (openaiError) {
          logger.error('Both OpenRouter and OpenAI categorization failed:', openaiError.message);
          throw openaiError;
        }
      }

      throw openrouterError;
    }
  }

  parseAIResponse(text) {
    if (!text) return null;

    let payload;
    try {
      const fenced = text.match(/```json\n([\s\S]*?)\n```/);
      if (fenced) {
        payload = JSON.parse(fenced[1]);
      } else {
        payload = JSON.parse(text);
      }
    } catch (err) {
      logger.warn('AI response was not valid JSON, attempting fallback parsing');
      const categoryMatch = this.availableCategories.find(cat =>
        text.toLowerCase().includes(cat.toLowerCase())
      );
      if (!categoryMatch) return null;
      payload = { category: categoryMatch, confidence: 0.4, reasoning: 'Extracted from AI text' };
    }

    if (!payload || !payload.category) {
      return null;
    }

    const normalizedCategory = this.availableCategories.find(cat =>
      cat.toLowerCase() === String(payload.category).toLowerCase()
    );

    if (!normalizedCategory) {
      logger.warn('AI returned category not in allowed list:', payload.category);
      return null;
    }

    return {
      category: normalizedCategory,
      confidence: typeof payload.confidence === 'number' ? payload.confidence : null,
      reasoning: payload.reasoning
    };
  }

  async categorizeSkill({ title, summary }) {
    if (!title) {
      return null;
    }

    if (!this.openrouterApiKey && !this.openaiApiKey) {
      logger.info('AI skill categorization skipped: no API keys configured');
      return null;
    }

    try {
      const messages = this.buildMessages({ title, summary });
      const { provider, result } = await this.makeAIRequest(messages);
      const parsed = this.parseAIResponse(result);

      if (!parsed) {
        return null;
      }

      return {
        ...parsed,
        provider
      };
    } catch (error) {
      logger.warn('AI skill categorization failed, defaulting to keyword categories:', error.message);
      return null;
    }
  }
}

module.exports = AISkillCategorizationService;
