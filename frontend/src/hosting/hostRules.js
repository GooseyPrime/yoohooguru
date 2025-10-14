/**
 * Host Routing Utilities
 * Detects subdomains and provides routing logic for different domains
 */

/**
 * Check if current host is heroes.yoohoo.guru (formerly masters)
 * @param {string} host - Optional host override, defaults to window.location.hostname
 * @returns {boolean} True if heroes subdomain
 */
export const isHeroesHost = (host) => {
  const hostname = host || (typeof window !== 'undefined' ? window.location.hostname : '');
  return hostname.toLowerCase().startsWith('heroes.');
};

// Legacy alias for backwards compatibility
export const isMastersHost = isHeroesHost;

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
  if (isHeroesHost(host)) {
    return '/heroes';
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
 * @returns {string} Subdomain type: 'heroes', 'coach', 'angel', 'cousin', or 'main'
 */
export const getSubdomainType = (host) => {
  if (isHeroesHost(host)) return 'heroes';
  if (isCoachHost(host)) return 'coach';
  if (isAngelHost(host)) return 'angel';
  if (isCousinHost(host)) return 'cousin';
  return 'main';
};

/**
 * Check if current host is a "cousin" subdomain (any subdomain not in the special list)
 * @param {string} host - Optional host override
 * @returns {boolean} True if cousin subdomain
 */
export const isCousinHost = (host) => {
  const hostname = host || (typeof window !== 'undefined' ? window.location.hostname : '');
  const hostParts = hostname.toLowerCase().split('.');
  
  // Not a subdomain if less than 3 parts (e.g., yoohoo.guru or localhost)
  if (hostParts.length < 3) {
    return false;
  }
  
  const subdomain = hostParts[0];
  
  // Exclude special subdomains
  const excludedSubdomains = ['www', 'api', 'admin', 'staging', 'dev', 'test', 'heroes', 'masters', 'coach', 'angel', 'dashboard'];
  
  // Check if it's not in the excluded list
  return !excludedSubdomains.includes(subdomain) && 
         subdomain !== 'localhost' && 
         subdomain !== 'yoohoo';
};

/**
 * Extract subdomain name from host
 * @param {string} host - Optional host override
 * @returns {string|null} Subdomain name or null if not a subdomain
 */
export const getSubdomainName = (host) => {
  const hostname = host || (typeof window !== 'undefined' ? window.location.hostname : '');
  const hostParts = hostname.toLowerCase().split('.');
  
  if (hostParts.length < 3) {
    return null;
  }
  
  const subdomain = hostParts[0];
  
  // Exclude special subdomains
  const excludedSubdomains = ['www', 'api', 'admin', 'staging', 'dev', 'test'];
  
  if (excludedSubdomains.includes(subdomain) || subdomain === 'localhost' || subdomain === 'yoohoo') {
    return null;
  }
  
  return subdomain;
};

/**
 * Check if Hero Guru's features should be enabled (formerly Modified Masters)
 * @returns {boolean} True if Hero Guru's features enabled
 */
export const isHeroGurusEnabled = () => {
  // Check environment variable or configuration
  return process.env.REACT_APP_FEATURE_HERO_GURUS === 'true' || 
         process.env.REACT_APP_FEATURE_MODIFIED_MASTERS === 'true' || 
         isHeroesHost();
};

// Legacy alias for backwards compatibility
export const isModifiedMastersEnabled = isHeroGurusEnabled;

/**
 * Get the canonical URL for a given path and subdomain
 * @param {string} path - Path to construct URL for
 * @param {string} subdomain - Subdomain type: 'heroes', 'coach', 'angel', 'dashboard', or null
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