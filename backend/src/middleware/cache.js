/**
 * Caching Middleware
 * Provides in-memory caching for frequently accessed data
 * 
 * @module middleware/cache
 */

const { logger } = require('../utils/logger');

/**
 * In-memory cache storage
 * @type {Map<string, {data: any, timestamp: number}>}
 */
const cache = new Map();

/**
 * Default cache duration in seconds
 */
const DEFAULT_CACHE_DURATION = 300; // 5 minutes

/**
 * Maximum cache size (number of entries)
 */
const MAX_CACHE_SIZE = 1000;

/**
 * Cache statistics
 */
const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  evictions: 0
};

/**
 * Generate cache key from request
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
function generateCacheKey(req) {
  // Include method, path, and query parameters in the key
  const queryString = new URLSearchParams(req.query).toString();
  return `${req.method}:${req.path}${queryString ? '?' + queryString : ''}`;
}

/**
 * Get item from cache
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if not found/expired
 */
function getFromCache(key) {
  const item = cache.get(key);
  
  if (!item) {
    stats.misses++;
    return null;
  }
  
  // Check if expired
  const now = Date.now();
  if (now - item.timestamp > item.duration * 1000) {
    cache.delete(key);
    stats.misses++;
    return null;
  }
  
  stats.hits++;
  return item.data;
}

/**
 * Set item in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} duration - Cache duration in seconds
 */
function setInCache(key, data, duration = DEFAULT_CACHE_DURATION) {
  // Enforce max cache size (simple LRU: remove oldest)
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
    stats.evictions++;
  }
  
  cache.set(key, {
    data,
    timestamp: Date.now(),
    duration
  });
  
  stats.sets++;
}

/**
 * Clear cache
 * @param {string} pattern - Optional pattern to match keys (uses includes)
 */
function clearCache(pattern = null) {
  if (pattern) {
    let cleared = 0;
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
        cleared++;
      }
    }
    logger.info(`Cache cleared: ${cleared} entries matching pattern "${pattern}"`);
  } else {
    const size = cache.size;
    cache.clear();
    logger.info(`Cache cleared: ${size} entries`);
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  const hitRate = stats.hits + stats.misses > 0 
    ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(2) 
    : 0;
  
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    hits: stats.hits,
    misses: stats.misses,
    sets: stats.sets,
    evictions: stats.evictions,
    hitRate: `${hitRate}%`
  };
}

/**
 * Cache middleware factory
 * Creates a caching middleware for the specified duration
 * 
 * @param {number} duration - Cache duration in seconds (default: 300)
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/api/users', cacheMiddleware(600), async (req, res) => {
 *   // This route will be cached for 10 minutes
 * });
 */
function cacheMiddleware(duration = DEFAULT_CACHE_DURATION) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const cacheKey = generateCacheKey(req);
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      logger.debug('Cache hit', { 
        requestId: req.requestId, 
        key: cacheKey 
      });
      
      // Add cache headers
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', cacheKey);
      
      return res.json(cachedData);
    }
    
    // Cache miss - intercept response
    logger.debug('Cache miss', { 
      requestId: req.requestId, 
      key: cacheKey 
    });
    
    res.setHeader('X-Cache', 'MISS');
    
    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        setInCache(cacheKey, data, duration);
      }
      return originalJson(data);
    };
    
    next();
  };
}

/**
 * Cache invalidation middleware
 * Clears cache entries matching the pattern when called
 * 
 * @param {string} pattern - Pattern to match cache keys
 * @returns {Function} Express middleware function
 */
function invalidateCache(pattern) {
  return (req, res, next) => {
    clearCache(pattern);
    next();
  };
}

module.exports = {
  cacheMiddleware,
  invalidateCache,
  clearCache,
  getCacheStats,
  getFromCache,
  setInCache
};
