/**
 * Host Routing Utilities
 * Detects subdomains and provides routing logic for different domains
 */

/**
 * Check if current host is masters.yoohoo.guru
 * @param {string} host - Optional host override, defaults to window.location.hostname
 * @returns {boolean} True if masters subdomain
 */
export const isMastersHost = (host) => {
  const hostname = host || (typeof window !== 'undefined' ? window.location.hostname : '');
  return hostname.toLowerCase().startsWith('masters.');
};

/**
 * Check if current host is coach.yoohoo.guru
 * @param {string} host - Optional host override
 * @returns {boolean} True if coach subdomain
 */
export const isCoachHost = (host) => {
  const hostname = host || (typeof window !== 'undefined' ? window.location.hostname : '');
  return hostname.toLowerCase().startsWith('coach.');
};

/**
 * Check if current host is angel.yoohoo.guru
 * @param {string} host - Optional host override
 * @returns {boolean} True if angel subdomain
 */
export const isAngelHost = (host) => {
  const hostname = host || (typeof window !== 'undefined' ? window.location.hostname : '');
  return hostname.toLowerCase().startsWith('angel.');
};

/**
 * Get the main routing destination for a subdomain
 * @param {string} host - Optional host override
 * @returns {string|null} Route path or null if main site
 */
export const getSubdomainRoute = (host) => {
  if (isMastersHost(host)) {
    return '/modified';
  }
  if (isCoachHost(host)) {
    return '/skills';
  }
  if (isAngelHost(host)) {
    return '/angels-list';
  }
  return null;
};

/**
 * Get subdomain type for analytics or feature flags
 * @param {string} host - Optional host override
 * @returns {string} Subdomain type: 'masters', 'coach', 'angel', or 'main'
 */
export const getSubdomainType = (host) => {
  if (isMastersHost(host)) return 'masters';
  if (isCoachHost(host)) return 'coach';
  if (isAngelHost(host)) return 'angel';
  return 'main';
};

/**
 * Check if Modified Masters features should be enabled
 * @returns {boolean} True if MM features enabled
 */
export const isModifiedMastersEnabled = () => {
  // Check environment variable or configuration
  return process.env.REACT_APP_FEATURE_MODIFIED_MASTERS === 'true' || 
         isMastersHost();
};

/**
 * Get the canonical URL for a given path and subdomain
 * @param {string} path - Path to construct URL for
 * @param {string} subdomain - Subdomain type: 'masters', 'coach', 'angel', or null
 * @returns {string} Full URL
 */
export const getCanonicalUrl = (path = '', subdomain = null) => {
  const baseDomain = process.env.REACT_APP_BASE_URL || 'https://yoohoo.guru';
  
  if (!subdomain) {
    return `${baseDomain}${path}`;
  }
  
  // Replace https://yoohoo.guru with https://subdomain.yoohoo.guru
  const subdomainUrl = baseDomain.replace('yoohoo.guru', `${subdomain}.yoohoo.guru`);
  return `${subdomainUrl}${path}`;
};