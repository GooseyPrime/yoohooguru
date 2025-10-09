/**
 * Images Routes
 * API endpoint for fetching location-appropriate background images
 */

const express = require('express');
const axios = require('axios');
const { logger } = require('../utils/logger');
const { getConfig } = require('../config/appConfig');

const router = express.Router();

// Unsplash API configuration
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

/**
 * Get Unsplash configuration
 */
function getUnsplashConfig() {
  const config = getConfig();
  return {
    accessKey: config.unsplashAccessKey || process.env.UNSPLASH_ACCESS_KEY,
    baseUrl: UNSPLASH_BASE_URL
  };
}

/**
 * Fetch location image from Unsplash
 * GET /api/images/location?city=CityName&state=State
 */
router.get('/location', async (req, res) => {
  try {
    const { city, state, country } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City parameter is required'
      });
    }

    const config = getUnsplashConfig();
    
    // If no Unsplash API key is configured, return null for graceful fallback
    if (!config.accessKey) {
      logger.warn('Unsplash API key not configured, returning null for graceful fallback');
      return res.json({
        success: true,
        data: null,
        message: 'Image service not configured'
      });
    }

    // Build search query for location
    // Prioritize popular/landmark images for city backgrounds
    const locationQuery = buildLocationQuery(city, state, country);
    
    logger.info(`Fetching background image for location: ${locationQuery}`);

    // Search Unsplash for location images
    const response = await axios.get(`${config.baseUrl}/search/photos`, {
      params: {
        query: locationQuery,
        per_page: 5,
        orientation: 'landscape',
        order_by: 'relevant',
        content_filter: 'high'
      },
      headers: {
        'Authorization': `Client-ID ${config.accessKey}`,
        'Accept-Version': 'v1'
      },
      timeout: 10000
    });

    if (response.data.results && response.data.results.length > 0) {
      // Get the best match from results
      const selectedImage = selectBestImage(response.data.results, city);
      
      const imageData = {
        url: selectedImage.urls.regular,
        urlFull: selectedImage.urls.full,
        urlThumb: selectedImage.urls.thumb,
        description: selectedImage.description || selectedImage.alt_description,
        photographer: {
          name: selectedImage.user.name,
          username: selectedImage.user.username,
          link: selectedImage.user.links.html
        },
        location: selectedImage.location,
        downloadLink: selectedImage.links.download_location
      };

      // Trigger download endpoint to comply with Unsplash API guidelines
      if (imageData.downloadLink) {
        triggerUnsplashDownload(imageData.downloadLink, config.accessKey).catch(err => {
          logger.warn('Failed to trigger Unsplash download tracking:', err.message);
        });
      }

      res.json({
        success: true,
        data: imageData
      });
    } else {
      // No images found for this specific location, try broader search
      logger.info(`No specific images found for ${locationQuery}, trying broader search`);
      const broaderQuery = buildBroaderLocationQuery(city, state, country);
      
      const broaderResponse = await axios.get(`${config.baseUrl}/search/photos`, {
        params: {
          query: broaderQuery,
          per_page: 3,
          orientation: 'landscape',
          order_by: 'relevant'
        },
        headers: {
          'Authorization': `Client-ID ${config.accessKey}`,
          'Accept-Version': 'v1'
        },
        timeout: 10000
      });

      if (broaderResponse.data.results && broaderResponse.data.results.length > 0) {
        const selectedImage = broaderResponse.data.results[0];
        
        const imageData = {
          url: selectedImage.urls.regular,
          urlFull: selectedImage.urls.full,
          urlThumb: selectedImage.urls.thumb,
          description: selectedImage.description || selectedImage.alt_description,
          photographer: {
            name: selectedImage.user.name,
            username: selectedImage.user.username,
            link: selectedImage.user.links.html
          },
          downloadLink: selectedImage.links.download_location
        };

        // Trigger download endpoint
        if (imageData.downloadLink) {
          triggerUnsplashDownload(imageData.downloadLink, config.accessKey).catch(err => {
            logger.warn('Failed to trigger Unsplash download tracking:', err.message);
          });
        }

        res.json({
          success: true,
          data: imageData
        });
      } else {
        // Return null for graceful fallback to default background
        res.json({
          success: true,
          data: null,
          message: 'No images found for this location'
        });
      }
    }

  } catch (error) {
    logger.error('Location image fetch error:', error.response?.data || error.message);
    
    // Return graceful response instead of error to allow frontend fallback
    res.json({
      success: true,
      data: null,
      error: 'Could not fetch location image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Build location query for Unsplash search
 */
function buildLocationQuery(city, state, country) {
  // Build query with landmarks and cityscape terms for better results
  let query = `${city} cityscape landmark skyline`;
  
  if (state) {
    query = `${city} ${state} ${query}`;
  }
  
  if (country && country !== 'USA' && country !== 'US') {
    query = `${city} ${country} ${query}`;
  }
  
  return query;
}

/**
 * Build broader location query for fallback
 */
function buildBroaderLocationQuery(city, state, country) {
  if (state) {
    return `${state} cityscape landmark`;
  }
  
  if (country) {
    return `${country} cityscape`;
  }
  
  return 'city skyline urban';
}

/**
 * Select best image from results based on quality signals
 */
function selectBestImage(results, city) {
  // Prioritize images with location info matching the city
  const cityLower = city.toLowerCase();
  
  for (const image of results) {
    if (image.location && image.location.name) {
      if (image.location.name.toLowerCase().includes(cityLower)) {
        return image;
      }
    }
  }
  
  // If no exact match, prioritize by likes and quality
  const sortedByLikes = [...results].sort((a, b) => b.likes - a.likes);
  return sortedByLikes[0];
}

/**
 * Trigger Unsplash download tracking (required by Unsplash API guidelines)
 */
async function triggerUnsplashDownload(downloadLink, accessKey) {
  try {
    await axios.get(downloadLink, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'Accept-Version': 'v1'
      },
      timeout: 5000
    });
  } catch (error) {
    // Non-critical, just log
    logger.warn('Unsplash download tracking failed:', error.message);
  }
}

/**
 * Health check endpoint
 */
router.get('/', (req, res) => {
  const config = getUnsplashConfig();
  res.json({
    success: true,
    data: { 
      message: 'Images API endpoint active',
      unsplashConfigured: !!config.accessKey
    }
  });
});

module.exports = router;
