/**
 * HTTP Utilities for Hero Guru's
 * Simple wrapper around the existing API utility for session management
 */

import { api } from '../lib/api';
import logger from './logger';

/**
 * Make a GET request
 * @param {string} path - API path
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export async function get(path, options = {}) {
  try {
    const response = await api(path, {
      method: 'GET',
      ...options
    });
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Request failed');
  } catch (error) {
    logger.error('GET request failed:', error);
    throw error;
  }
}

/**
 * Make a POST request
 * @param {string} path - API path
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export async function post(path, data = {}, options = {}) {
  try {
    const response = await api(path, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Request failed');
  } catch (error) {
    logger.error('POST request failed:', error);
    throw error;
  }
}

/**
 * Make a PATCH request
 * @param {string} path - API path
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export async function patch(path, data = {}, options = {}) {
  try {
    const response = await api(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Request failed');
  } catch (error) {
    logger.error('PATCH request failed:', error);
    throw error;
  }
}

/**
 * Make a DELETE request
 * @param {string} path - API path
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export async function del(path, options = {}) {
  try {
    const response = await api(path, {
      method: 'DELETE',
      ...options
    });
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Request failed');
  } catch (error) {
    logger.error('DELETE request failed:', error);
    throw error;
  }
}

// Default export with all methods
export default {
  get,
  post,
  patch,
  delete: del
};