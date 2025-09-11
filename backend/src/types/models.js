/**
 * Modified Masters Models
 * Types and utilities for coaching styles, accessibility preferences, and skill extensions
 */

const COACHING_STYLES = {
  STRUCTURED_CURRICULUM: 'structured-curriculum',
  HANDS_ON: 'hands-on',
  VISUAL_DEMOS: 'visual-demos',
  VERBAL_EXPLAINER: 'verbal-explainer',
  STEP_BY_STEP: 'step-by-step',
  PROJECT_BASED: 'project-based',
  Q_AND_A: 'q-and-a',
  PEER_MENTORING: 'peer-mentoring',
  SLOW_PACE: 'slow-pace',
  FAST_ITERATION: 'fast-iteration'
};

const RESOURCE_TYPES = {
  DOC: 'doc',
  VIDEO: 'video',
  SITE: 'site',
  TOOL: 'tool',
  FILE: 'file'
};

const SKILL_STATUSES = {
  PENDING: 'pending',
  PUBLISHED: 'published'
};

/**
 * Create a resource link object
 * @param {Object} resourceData - Resource data
 * @returns {Object} ResourceLink object
 */
function createResourceLink({
  id,
  title,
  url,
  type = RESOURCE_TYPES.SITE,
  addedBy,
  addedAt = Date.now()
}) {
  return {
    id,
    title,
    url,
    type,
    addedBy,
    addedAt
  };
}

/**
 * Create skill additions for Modified Masters
 * @param {Object} additions - Skill additions data
 * @returns {Object} SkillAdditions object
 */
function createSkillAdditions({
  isModifiedMasters = true,
  accessibilityTags = [],
  coachingStyles = [],
  resources = [],
  status = SKILL_STATUSES.PUBLISHED
}) {
  return {
    isModifiedMasters,
    accessibilityTags,
    coachingStyles,
    resources,
    status
  };
}

/**
 * Create accessibility preferences object
 * @param {Object} prefs - Accessibility preferences
 * @returns {Object} AccessibilityPrefs object
 */
function createAccessibilityPrefs({
  mobility = [],
  vision = [],
  hearing = [],
  neurodiversity = [],
  communicationPrefs = [],
  assistiveTech = []
} = {}) {
  return {
    mobility,
    vision,
    hearing,
    neurodiversity,
    communicationPrefs,
    assistiveTech
  };
}

/**
 * Create Modified Masters user profile additions
 * @param {Object} additions - Profile additions data
 * @returns {Object} UserProfileAdditions object
 */
function createUserProfileAdditions({
  accessibility = null,
  modifiedMasters = null
} = {}) {
  const result = {};
  
  if (accessibility) {
    result.accessibility = createAccessibilityPrefs(accessibility);
  }
  
  if (modifiedMasters) {
    result.modifiedMasters = {
      wantsToTeach: modifiedMasters.wantsToTeach || false,
      wantsToLearn: modifiedMasters.wantsToLearn || false,
      tags: modifiedMasters.tags || [],
      visible: modifiedMasters.visible !== false, // default true
      coachingStyles: modifiedMasters.coachingStyles || []
    };
  }
  
  return result;
}

/**
 * Validate coaching styles array
 * @param {string[]} styles - Array of coaching styles
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateCoachingStyles(styles) {
  const errors = [];
  const validStyles = Object.values(COACHING_STYLES);
  
  if (!Array.isArray(styles)) {
    errors.push('coachingStyles must be an array');
    return { valid: false, errors };
  }
  
  styles.forEach(style => {
    if (!validStyles.includes(style)) {
      errors.push(`Invalid coaching style: ${style}. Valid styles: ${validStyles.join(', ')}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate resource link
 * @param {Object} resource - Resource to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateResourceLink(resource) {
  const errors = [];
  
  if (!resource.title || typeof resource.title !== 'string') {
    errors.push('Resource title is required and must be a string');
  }
  
  if (!resource.url || typeof resource.url !== 'string') {
    errors.push('Resource URL is required and must be a string');
  } else {
    // Basic URL validation
    try {
      new URL(resource.url);
    } catch {
      errors.push('Resource URL must be a valid URL');
    }
  }
  
  if (resource.type && !Object.values(RESOURCE_TYPES).includes(resource.type)) {
    errors.push(`Invalid resource type. Valid types: ${Object.values(RESOURCE_TYPES).join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  COACHING_STYLES,
  RESOURCE_TYPES,
  SKILL_STATUSES,
  createResourceLink,
  createSkillAdditions,
  createAccessibilityPrefs,
  createUserProfileAdditions,
  validateCoachingStyles,
  validateResourceLink
};