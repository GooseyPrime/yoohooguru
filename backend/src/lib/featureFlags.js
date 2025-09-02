/**
 * Feature Flags Configuration
 * Central configuration for enabling/disabling features across the application
 */

const featureFlags = {
  // v1 core features (stable)
  booking: true,
  messaging: true,
  reviews: true,
  userProfiles: true,
  skillListing: true,

  // deferred/experimental features
  communityEvents: false,     // Coming Soon
  certifications: false,      // Coming Soon  
  orgTools: false,            // Coming Soon
  dataProducts: false,        // Coming Soon
  advancedAnalytics: false,   // Coming Soon
  realTimeChat: false,        // Coming Soon

  // admin features
  adminWriteEnabled: process.env.ADMIN_WRITE_ENABLED === 'true',
  adminDashboard: true,
  systemReports: true,

  // experimental/beta features
  aiRecommendations: process.env.NODE_ENV === 'development',
  mobileApp: false,
  darkMode: false,
  internationalSupport: false,

  // onboarding features (append new flags only)
  oddJobs: true,                 // new section enabled
  oddJobsHourly: false,          // Coming Soon
  oddJobsMaterials: false,       // Coming Soon
  backgroundChecks: false,       // Coming Soon
};

/**
 * Check if a feature is enabled
 * @param {string} flagName - The name of the feature flag
 * @returns {boolean} - Whether the feature is enabled
 */
function isFeatureEnabled(flagName) {
  return featureFlags[flagName] === true;
}

/**
 * Get all feature flags
 * @returns {object} - All feature flags
 */
function getAllFlags() {
  return { ...featureFlags };
}

/**
 * Get flags for client-side use (excludes sensitive admin flags)
 * @returns {object} - Public feature flags
 */
function getPublicFlags() {
  // eslint-disable-next-line no-unused-vars
  const { adminWriteEnabled, ...publicFlags } = featureFlags;
  return publicFlags;
}

/**
 * Update a feature flag (for admin use)
 * @param {string} flagName - The name of the feature flag
 * @param {boolean} value - The new value
 * @returns {boolean} - Success status
 */
function updateFlag(flagName, value) {
  if (flagName in featureFlags) {
    featureFlags[flagName] = Boolean(value);
    return true;
  }
  return false;
}

module.exports = {
  featureFlags,
  isFeatureEnabled,
  getAllFlags,
  getPublicFlags,
  updateFlag
};