/**
 * Feature Flags Service
 * Manages feature flags on the frontend
 */

class FeatureFlagsService {
  constructor() {
    this.flags = {};
    this.loaded = false;
  }

  /**
   * Load feature flags from the API
   */
  async loadFlags() {
    try {
      // Use environment variable or fallback to /api/flags
      const flagsUrl = process.env.REACT_APP_FLAGS_URL || '/api/flags';
      
      const response = await fetch(flagsUrl, {
        credentials: 'include'
      });
      
      // Validate Content-Type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Feature flags endpoint returned non-JSON content, using defaults');
        this.flags = this.getDefaultFlags();
        this.loaded = true;
        return this.flags;
      }
      
      if (response.ok) {
        try {
          const data = await response.json();
          
          // Support both new format { features: {...}, version: "..." }
          // and legacy format { flags: {...} }
          this.flags = data.features || data.flags || {};
          this.loaded = true;
          return this.flags;
        } catch (parseError) {
          console.warn('Failed to parse feature flags JSON, using defaults:', parseError.message);
          this.flags = this.getDefaultFlags();
          this.loaded = true;
          return this.flags;
        }
      } else {
        console.warn(`Failed to load feature flags (${response.status}), using defaults`);
        this.flags = this.getDefaultFlags();
        this.loaded = true;
        return this.flags;
      }
    } catch (error) {
      console.warn('Error loading feature flags, using defaults:', error.message);
      this.flags = this.getDefaultFlags();
      this.loaded = true;
      return this.flags;
    }
  }

  /**
   * Get default feature flags (fallback)
   */
  getDefaultFlags() {
    return {
      booking: true,
      messaging: true,
      reviews: true,
      userProfiles: true,
      skillListing: true,
      communityEvents: false,
      certifications: false,
      orgTools: false,
      dataProducts: false,
      advancedAnalytics: false,
      realTimeChat: false,
      adminDashboard: true,
      systemReports: true,
      aiRecommendations: false,
      mobileApp: false,
      darkMode: false,
      internationalSupport: false,
      instantPayouts: false // disabled - not available in current account
    };
  }

  /**
   * Check if a feature is enabled
   * @param {string} flagName - The name of the feature flag
   * @returns {boolean} - Whether the feature is enabled
   */
  isEnabled(flagName) {
    if (!this.loaded) {
      console.warn(`Feature flag ${flagName} checked before flags were loaded`);
      return this.getDefaultFlags()[flagName] || false;
    }
    return this.flags[flagName] === true;
  }

  /**
   * Get all feature flags
   * @returns {object} - All feature flags
   */
  getAll() {
    if (!this.loaded) {
      return this.getDefaultFlags();
    }
    return { ...this.flags };
  }

  /**
   * Check if flags are loaded
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }
}

// Create a singleton instance
const featureFlags = new FeatureFlagsService();

export default featureFlags;