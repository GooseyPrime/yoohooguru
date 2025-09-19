/**
 * AI Matchmaking API Service
 * Frontend integration for enhanced guru-understudy matching
 */

import { apiGet, apiPost } from './api';

/**
 * Get AI-powered skill matches for a guru (finds understudies)
 * @param {string} guruId - The guru's user ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Match results
 */
export async function getGuruMatches(guruId, options = {}) {
  const { limit = 5, minScore = 70 } = options;
  
  if (!guruId) {
    return { success: false, error: 'Guru ID is required', matches: [] };
  }
  
  try {
    const response = await apiGet(`/matchmaking/guru/${guruId}/matches?limit=${limit}&minScore=${minScore}`);
    return {
      success: true,
      data: response.data,
      matches: response.data.matches || [],
      algorithm: response.data.algorithm,
      aiProvider: response.data.aiProvider
    };
  } catch (error) {
    console.error('Guru matches error:', error);
    return {
      success: false,
      error: error.message,
      matches: []
    };
  }
}

/**
 * Get AI-powered guru recommendations for an understudy
 * @param {string} understudyId - The understudy's user ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Recommendation results
 */
export async function getUnderstudyRecommendations(understudyId, options = {}) {
  const { limit = 5, skill } = options;
  
  if (!understudyId) {
    return { success: false, error: 'Understudy ID is required', recommendations: [] };
  }
  
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() });
    if (skill) queryParams.append('skill', skill);
    
    const response = await apiGet(`/matchmaking/understudy/${understudyId}/recommendations?${queryParams}`);
    return {
      success: true,
      data: response.data,
      recommendations: response.data.recommendations || [],
      searchSkill: response.data.searchSkill
    };
  } catch (error) {
    console.error('Understudy recommendations error:', error);
    return {
      success: false,
      error: error.message,
      recommendations: []
    };
  }
}

/**
 * Get personalized learning recommendations
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} Learning recommendations
 */
export async function getLearningRecommendations(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required', recommendations: [] };
  }
  
  try {
    const response = await apiPost('/matchmaking/learning-recommendations', { userId });
    return {
      success: true,
      data: response.data,
      recommendations: response.data.recommendations || []
    };
  } catch (error) {
    console.error('Learning recommendations error:', error);
    return {
      success: false,
      error: error.message,
      recommendations: []
    };
  }
}

/**
 * Get available skill categories with AI-generated descriptions
 * @returns {Promise<Object>} Skill categories
 */
export async function getSkillCategories() {
  try {
    const response = await apiGet('/matchmaking/skill-categories');
    return {
      success: true,
      data: response.data,
      categories: response.data.categories || []
    };
  } catch (error) {
    console.error('Skill categories error:', error);
    return {
      success: false,
      error: error.message,
      categories: []
    };
  }
}

/**
 * Perform advanced skill matching search
 * @param {Object} searchParams - Search criteria
 * @returns {Promise<Object>} Search results
 */
export async function performAdvancedSearch(searchParams) {
  const {
    userType = 'guru',
    skills = [],
    location,
    priceRange,
    availability,
    experience,
    limit = 10
  } = searchParams;
  
  try {
    const response = await apiPost('/matchmaking/advanced-search', {
      userType,
      skills,
      location,
      priceRange,
      availability,
      experience,
      limit
    });
    
    return {
      success: true,
      data: response.data,
      results: response.data.results || [],
      filters: response.data.filters
    };
  } catch (error) {
    console.error('Advanced search error:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

/**
 * Get AI service configuration and status
 * @returns {Promise<Object>} AI status
 */
export async function getAIStatus() {
  try {
    const response = await apiGet('/matchmaking/ai-status');
    return {
      success: true,
      data: response.data,
      status: response.data.status,
      capabilities: response.data.capabilities
    };
  } catch (error) {
    console.error('AI status error:', error);
    return {
      success: false,
      error: error.message,
      status: 'unavailable'
    };
  }
}

/**
 * Calculate compatibility score between two users (client-side helper)
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Compatibility analysis
 */
export function calculateCompatibility(user1, user2) {
  let score = 0;
  const factors = [];

  // Skill compatibility
  const user1Offers = (user1.skillsOffered || []).map(s => s.toLowerCase());
  const user2Wants = (user2.skillsWanted || []).map(s => s.toLowerCase());
  
  user1Offers.forEach(offered => {
    user2Wants.forEach(wanted => {
      if (offered.includes(wanted) || wanted.includes(offered)) {
        score += 30;
        factors.push(`${user1.displayName} offers ${offered}, ${user2.displayName} wants ${wanted}`);
      }
    });
  });

  // Reverse skill matching
  const user2Offers = (user2.skillsOffered || []).map(s => s.toLowerCase());
  const user1Wants = (user1.skillsWanted || []).map(s => s.toLowerCase());
  
  user2Offers.forEach(offered => {
    user1Wants.forEach(wanted => {
      if (offered.includes(wanted) || wanted.includes(offered)) {
        score += 25;
        factors.push(`${user2.displayName} offers ${offered}, ${user1.displayName} wants ${wanted}`);
      }
    });
  });

  // Location compatibility
  if (user1.location && user2.location) {
    const city1 = user1.location.split(',')[0].trim().toLowerCase();
    const city2 = user2.location.split(',')[0].trim().toLowerCase();
    if (city1 === city2) {
      score += 15;
      factors.push('Same city location');
    }
  }

  // Schedule compatibility
  if (user1.availability && user2.availability) {
    const commonSlots = user1.availability.filter(slot => 
      user2.availability.includes(slot)
    );
    if (commonSlots.length > 0) {
      score += 10;
      factors.push(`Compatible schedules: ${commonSlots.join(', ')}`);
    }
  }

  return {
    score: Math.min(score, 100),
    factors,
    matchType: score >= 50 ? (score >= 80 ? 'excellent' : 'good') : 'basic'
  };
}

/**
 * Format skill match data for display
 * @param {Object} match - Match data from API
 * @returns {Object} Formatted match
 */
export function formatMatchForDisplay(match) {
  return {
    ...match,
    scoreText: `${match.matchScore}% match`,
    scoreColor: match.matchScore >= 80 ? 'green' : match.matchScore >= 60 ? 'blue' : 'orange',
    matchTypeText: {
      'perfect_match': '🎯 Perfect Match',
      'skill_exchange': '🔄 Skill Exchange',
      'complementary': '🤝 Complementary Skills',
      'location_match': '📍 Location Match',
      'basic_match': '✨ Good Match'
    }[match.matchType] || '✨ Good Match',
    formattedDate: new Date(match.generatedAt || Date.now()).toLocaleDateString()
  };
}

export default {
  getGuruMatches,
  getUnderstudyRecommendations,
  getLearningRecommendations,
  getSkillCategories,
  performAdvancedSearch,
  getAIStatus,
  calculateCompatibility,
  formatMatchForDisplay
};