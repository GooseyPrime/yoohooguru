/**
 * Enhanced AI Matchmaking Service
 * Includes OpenRouter primary and ChatGPT fallback for guru-understudy matching
 */

const axios = require('axios');
const { getConfig } = require('../config/appConfig');
const { logger } = require('../utils/logger');

// API Configuration
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

/**
 * Enhanced AI matching algorithm with multiple providers
 */
class AIMatchmakingService {
  constructor() {
    this.config = getConfig();
    this.openrouterApiKey = this.config.openrouterApiKey;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.fallbackToOpenAI = true;
  }

  /**
   * Make API request to OpenRouter (primary)
   */
  async makeOpenRouterRequest(messages, model = 'anthropic/claude-3.5-sonnet') {
    if (!this.openrouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
        model: model,
        messages: messages,
        max_tokens: 2000,
        temperature: 0.3,
        top_p: 0.9
      }, {
        headers: {
          'Authorization': `Bearer ${this.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yoohoo.guru',
          'X-Title': 'YooHoo.guru AI Matchmaking'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('OpenRouter API error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Make API request to OpenAI (fallback)
   */
  async makeOpenAIRequest(messages, model = 'gpt-4o-mini') {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
        model: model,
        messages: messages,
        max_tokens: 2000,
        temperature: 0.3,
        top_p: 0.9
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('OpenAI API error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Make AI request with automatic fallback
   */
  async makeAIRequest(messages, options = {}) {
    const { primaryModel, fallbackModel } = options;

    try {
      // Try OpenRouter first
      logger.info('🤖 Attempting AI request via OpenRouter...');
      const result = await this.makeOpenRouterRequest(messages, primaryModel);
      logger.info('✅ OpenRouter request successful');
      return { result, provider: 'openrouter' };
    } catch (openrouterError) {
      logger.warn('OpenRouter failed, attempting fallback to OpenAI:', openrouterError.message);
      
      if (this.fallbackToOpenAI && this.openaiApiKey) {
        try {
          const result = await this.makeOpenAIRequest(messages, fallbackModel);
          logger.info('✅ OpenAI fallback successful');
          return { result, provider: 'openai' };
        } catch (openaiError) {
          logger.error('Both OpenRouter and OpenAI failed:', openaiError.message);
          throw new Error(`AI services unavailable: ${openrouterError.message}, ${openaiError.message}`);
        }
      } else {
        throw openrouterError;
      }
    }
  }

  /**
   * Generate AI-powered skill matches between guru and understudies
   */
  async generateSkillMatches(guru, understudies, options = {}) {
    const { limit = 5, minScore = 70 } = options;

    const systemPrompt = `You are an expert skill-matching AI for yoohoo.guru, a platform connecting teachers (gurus) with learners (understudies). 

Your task is to analyze a guru's profile and find the best matching understudies based on:
1. Skill compatibility (what guru offers vs what understudy wants)
2. Reverse skill exchange potential (what understudy offers vs what guru wants)
3. Location compatibility
4. Schedule alignment
5. Experience level compatibility
6. Personality and learning style fit

Respond with a JSON array of matches, each containing:
- understudyId: string
- matchScore: number (0-100)
- matchType: "perfect_match" | "skill_exchange" | "complementary" | "location_match"
- reasoning: brief explanation
- recommendations: specific suggestions for their collaboration

Be selective - only return high-quality matches above ${minScore}% compatibility.`;

    const userPrompt = `Analyze this guru and find the best matching understudies:

GURU PROFILE:
- Name: ${guru.displayName}
- Skills Offered: ${guru.skillsOffered?.join(', ')}
- Skills Wanted: ${guru.skillsWanted?.join(', ')}
- Experience: ${guru.experience}
- Location: ${guru.location}
- Availability: ${guru.availability?.join(', ')}
- Rating: ${guru.rating || 'New'}
- Bio: ${guru.bio}

POTENTIAL UNDERSTUDIES:
${understudies.map(u => `
- ID: ${u.id}
- Name: ${u.displayName}
- Skills Offered: ${u.skillsOffered?.join(', ')}
- Skills Wanted: ${u.skillsWanted?.join(', ')}
- Experience: ${u.experience}
- Location: ${u.location}
- Availability: ${u.availability?.join(', ')}
- Budget: $${u.budget?.min}-${u.budget?.max} ${u.budget?.currency}
- Bio: ${u.bio}
`).join('')}

Find the best matches and return as JSON array. Be thorough but selective.`;

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const { result, provider } = await this.makeAIRequest(messages, {
        primaryModel: 'anthropic/claude-3.5-sonnet',
        fallbackModel: 'gpt-4o-mini'
      });

      // Parse AI response
      let matches = [];
      try {
        const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          matches = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          // Try parsing the entire response as JSON
          matches = JSON.parse(result);
        }
      } catch (parseError) {
        logger.error('Failed to parse AI response as JSON:', parseError.message);
        logger.info('Raw AI response:', result);
        
        // Fallback: manual extraction
        matches = this.extractMatchesFromText(result, understudies);
      }

      // Validate and enrich matches
      const validatedMatches = matches
        .filter(match => match.matchScore >= minScore)
        .slice(0, limit)
        .map(match => ({
          ...match,
          guruId: guru.id,
          aiProvider: provider,
          generatedAt: Date.now(),
          status: 'ai_suggested'
        }));

      logger.info(`🎯 Generated ${validatedMatches.length} AI matches for ${guru.displayName} via ${provider}`);
      return validatedMatches;

    } catch (error) {
      logger.error('AI matchmaking failed:', error.message);
      // Fallback to rule-based matching
      return this.fallbackRuleBasedMatching(guru, understudies, { limit, minScore });
    }
  }

  /**
   * Fallback rule-based matching when AI fails
   */
  fallbackRuleBasedMatching(guru, understudies, { limit, minScore }) {
    logger.info('🔄 Using fallback rule-based matching...');
    
    const matches = understudies.map(understudy => {
      let score = 0;
      let matchType = 'basic_match';
      let reasoning = [];

      // Skill compatibility (guru offers what understudy wants)
      const guruSkills = (guru.skillsOffered || []).map(s => s.toLowerCase());
      const understudyWants = (understudy.skillsWanted || []).map(s => s.toLowerCase());
      
      guruSkills.forEach(gSkill => {
        understudyWants.forEach(uWant => {
          if (gSkill.includes(uWant) || uWant.includes(gSkill)) {
            score += 30;
            reasoning.push(`Guru offers ${gSkill}, understudy wants ${uWant}`);
            matchType = 'skill_match';
          }
        });
      });

      // Reverse skill exchange
      const understudySkills = (understudy.skillsOffered || []).map(s => s.toLowerCase());
      const guruWants = (guru.skillsWanted || []).map(s => s.toLowerCase());
      
      understudySkills.forEach(uSkill => {
        guruWants.forEach(gWant => {
          if (uSkill.includes(gWant) || gWant.includes(uSkill)) {
            score += 25;
            reasoning.push(`Understudy offers ${uSkill}, guru wants ${gWant}`);
            matchType = 'skill_exchange';
          }
        });
      });

      // Location compatibility
      if (guru.location && understudy.location && 
          guru.location.toLowerCase().includes(understudy.location.toLowerCase().split(',')[0])) {
        score += 10;
        reasoning.push('Same city location');
      }

      // Budget compatibility (if guru has price and understudy has budget)
      if (guru.price && understudy.budget) {
        const guruMin = guru.price.min || 0;
        const understudyMax = understudy.budget.max || 0;
        if (understudyMax >= guruMin) {
          score += 10;
          reasoning.push('Budget compatible');
        }
      }

      return {
        understudyId: understudy.id,
        matchScore: Math.min(score, 100),
        matchType,
        reasoning: reasoning.join('; '),
        recommendations: `Consider ${matchType === 'skill_exchange' ? 'skill exchange' : 'direct teaching'} arrangement`
      };
    })
    .filter(match => match.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

    logger.info(`📊 Generated ${matches.length} rule-based matches`);
    return matches.map(match => ({
      ...match,
      guruId: guru.id,
      aiProvider: 'rule_based',
      generatedAt: Date.now(),
      status: 'rule_based_suggested'
    }));
  }

  /**
   * Extract matches from AI text response (fallback parser)
   */
  extractMatchesFromText(text) {
    const matches = [];
    const lines = text.split('\n');
    
    let currentMatch = null;
    for (const line of lines) {
      // Look for understudy ID patterns
      const idMatch = line.match(/understudy.*?(\w+_\d+)/i);
      if (idMatch) {
        if (currentMatch) matches.push(currentMatch);
        currentMatch = { understudyId: idMatch[1] };
      }
      
      // Look for scores
      const scoreMatch = line.match(/score.*?(\d+)/i);
      if (scoreMatch && currentMatch) {
        currentMatch.matchScore = parseInt(scoreMatch[1]);
      }
      
      // Look for match types
      const typeMatch = line.match(/(perfect_match|skill_exchange|complementary|location_match)/i);
      if (typeMatch && currentMatch) {
        currentMatch.matchType = typeMatch[1];
      }
    }
    
    if (currentMatch) matches.push(currentMatch);
    
    return matches.filter(m => m.understudyId && m.matchScore);
  }

  /**
   * Generate personalized learning recommendations
   */
  async generateLearningRecommendations(user, availableSkills) {
    const systemPrompt = `You are a personalized learning advisor for yoohoo.guru. Analyze a user's profile and recommend the most suitable skills and learning paths based on their interests, current skills, and goals.

Provide practical, actionable recommendations that help users grow personally and professionally.`;

    const userPrompt = `User Profile:
- Current Skills: ${user.skillsOffered?.join(', ') || 'None specified'}
- Interests/Wants to Learn: ${user.skillsWanted?.join(', ') || 'Open to learning'}
- Experience Level: ${user.experience || 'Beginner'}
- Bio: ${user.bio || 'No bio provided'}

Available Skills on Platform:
${availableSkills.map(skill => `- ${skill.title} (${skill.category}, ${skill.level})`).join('\n')}

Recommend 3-5 most suitable skills for this user to learn, with reasoning for each recommendation. Format as JSON array with: skillTitle, category, reasoning, priority (1-5).`;

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const { result } = await this.makeAIRequest(messages);
      
      // Parse recommendations
      const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      
      return JSON.parse(result);
    } catch (error) {
      logger.error('Failed to generate learning recommendations:', error.message);
      return [];
    }
  }

  /**
   * Get AI configuration status
   */
  getConfigurationStatus() {
    return {
      openrouterConfigured: !!this.openrouterApiKey,
      openaiConfigured: !!this.openaiApiKey,
      fallbackEnabled: this.fallbackToOpenAI,
      status: this.openrouterApiKey ? 'ready' : (this.openaiApiKey ? 'fallback_only' : 'not_configured')
    };
  }
}

module.exports = AIMatchmakingService;