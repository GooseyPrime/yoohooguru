/**
 * Images API Routes Tests
 */

const request = require('supertest');
const express = require('express');
const imagesRoutes = require('../src/routes/images');

// Mock dependencies
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../src/config/appConfig', () => ({
  getConfig: jest.fn(() => ({
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || null
  }))
}));

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('Images API Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/images', imagesRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/images', () => {
    it('should return status message', async () => {
      const response = await request(app)
        .get('/api/images')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Images API endpoint active');
    });
  });

  describe('GET /api/images/location', () => {
    it('should return 400 if city parameter is missing', async () => {
      const response = await request(app)
        .get('/api/images/location')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('City parameter is required');
    });

    it('should return null gracefully when Unsplash API key is not configured', async () => {
      const response = await request(app)
        .get('/api/images/location')
        .query({ city: 'New York' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBe('Image service not configured');
    });

    it('should fetch and return image data when API key is configured', async () => {
      // Set up mock API key
      process.env.UNSPLASH_ACCESS_KEY = 'test-api-key';
      
      const mockUnsplashResponse = {
        data: {
          results: [
            {
              urls: {
                regular: 'https://images.unsplash.com/photo-123?w=1080',
                full: 'https://images.unsplash.com/photo-123',
                thumb: 'https://images.unsplash.com/photo-123?w=200'
              },
              description: 'New York City skyline',
              alt_description: 'city skyline',
              user: {
                name: 'John Photographer',
                username: 'johnphoto',
                links: {
                  html: 'https://unsplash.com/@johnphoto'
                }
              },
              location: {
                name: 'New York, NY'
              },
              links: {
                download_location: 'https://api.unsplash.com/photos/123/download'
              },
              likes: 100
            }
          ]
        }
      };

      axios.get.mockResolvedValue(mockUnsplashResponse);

      const response = await request(app)
        .get('/api/images/location')
        .query({ city: 'New York', state: 'NY' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.url).toBe('https://images.unsplash.com/photo-123?w=1080');
      expect(response.body.data.photographer.name).toBe('John Photographer');
      
      // Verify Unsplash API was called with correct parameters
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/search/photos'),
        expect.objectContaining({
          params: expect.objectContaining({
            query: expect.stringContaining('New York'),
            orientation: 'landscape'
          })
        })
      );

      // Clean up
      delete process.env.UNSPLASH_ACCESS_KEY;
    });

    it('should handle Unsplash API errors gracefully', async () => {
      process.env.UNSPLASH_ACCESS_KEY = 'test-api-key';
      
      axios.get.mockRejectedValue(new Error('API rate limit exceeded'));

      const response = await request(app)
        .get('/api/images/location')
        .query({ city: 'Los Angeles' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
      expect(response.body.error).toBe('Could not fetch location image');

      delete process.env.UNSPLASH_ACCESS_KEY;
    });

    it('should try broader search when no specific results found', async () => {
      process.env.UNSPLASH_ACCESS_KEY = 'test-api-key';
      
      // First call returns no results
      const emptyResponse = { data: { results: [] } };
      
      // Second call (broader search) returns results
      const broaderResponse = {
        data: {
          results: [
            {
              urls: {
                regular: 'https://images.unsplash.com/photo-456?w=1080',
                full: 'https://images.unsplash.com/photo-456',
                thumb: 'https://images.unsplash.com/photo-456?w=200'
              },
              description: 'California landscape',
              alt_description: 'state landscape',
              user: {
                name: 'Jane Photographer',
                username: 'janephoto',
                links: {
                  html: 'https://unsplash.com/@janephoto'
                }
              },
              links: {
                download_location: 'https://api.unsplash.com/photos/456/download'
              },
              likes: 50
            }
          ]
        }
      };

      axios.get
        .mockResolvedValueOnce(emptyResponse)  // First call fails
        .mockResolvedValueOnce(broaderResponse) // Broader search succeeds
        .mockResolvedValueOnce({ data: {} });  // Download tracking call

      const response = await request(app)
        .get('/api/images/location')
        .query({ city: 'Smalltown', state: 'CA' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.url).toBe('https://images.unsplash.com/photo-456?w=1080');
      
      // Verify at least two API calls were made (search calls, plus optional download tracking)
      expect(axios.get).toHaveBeenCalledTimes(3);

      delete process.env.UNSPLASH_ACCESS_KEY;
    });

    it('should include state and country in query when provided', async () => {
      process.env.UNSPLASH_ACCESS_KEY = 'test-api-key';
      
      const mockResponse = {
        data: {
          results: [
            {
              urls: { regular: 'test.jpg', full: 'test.jpg', thumb: 'test.jpg' },
              user: { name: 'Test', username: 'test', links: { html: 'test' } },
              links: { download_location: 'test' },
              likes: 10
            }
          ]
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      await request(app)
        .get('/api/images/location')
        .query({ city: 'London', country: 'UK' })
        .expect(200);

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            query: expect.stringContaining('London')
          })
        })
      );

      delete process.env.UNSPLASH_ACCESS_KEY;
    });
  });
});
