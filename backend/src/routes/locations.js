/**
 * Location Routes
 * API endpoints for managing location-based search for gurus, gigs, and skills
 * Supports radius-based filtering using Haversine formula for distance calculation
 */

const express = require('express');
const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { authenticateUser, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in miles
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get bounding box for initial filtering (optimization)
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {number} radiusMiles - Radius in miles
 * @returns {Object} Bounding box coordinates
 */
function getBoundingBox(lat, lng, radiusMiles) {
  const latDelta = radiusMiles / 69; // Approximate miles per degree latitude
  const lngDelta = radiusMiles / (69 * Math.cos(lat * Math.PI / 180));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

/**
 * @desc    Search for gurus within a radius
 * @route   GET /api/locations/search/gurus
 * @access  Public
 */
router.get('/search/gurus', optionalAuth, async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 25, // Default 25 miles
      category,
      skills,
      minRating,
      maxHourlyRate,
      limit = 50,
      page = 1
    } = req.query;

    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { message: 'Latitude and longitude are required' }
      });
    }

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(centerLat) || isNaN(centerLng) || isNaN(searchRadius)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid coordinates or radius' }
      });
    }

    const db = getFirestore();

    // Get bounding box for initial filtering
    const bbox = getBoundingBox(centerLat, centerLng, searchRadius);

    // Query gurus with location data
    // Note: Firestore doesn't support true geospatial queries, so we use bounding box + Haversine
    const gurusSnapshot = await db.collection('users')
      .where('role', '==', 'guru')
      .where('isActive', '==', true)
      .get();

    const gurus = [];
    gurusSnapshot.forEach(doc => {
      const guru = doc.data();

      // Skip if no location data
      if (!guru.location || guru.location.lat === undefined || guru.location.lng === undefined) {
        return;
      }

      const guruLat = guru.location.lat;
      const guruLng = guru.location.lng;

      // Quick bounding box check
      if (guruLat < bbox.minLat || guruLat > bbox.maxLat ||
          guruLng < bbox.minLng || guruLng > bbox.maxLng) {
        return;
      }

      // Precise distance calculation
      const distance = calculateDistance(centerLat, centerLng, guruLat, guruLng);
      if (distance > searchRadius) {
        return;
      }

      // Apply filters
      if (category && guru.category !== category) return;
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
        const guruSkills = (guru.skills || []).map(s => s.toLowerCase());
        if (!skillsArray.some(s => guruSkills.includes(s))) return;
      }
      if (minRating && guru.rating < parseFloat(minRating)) return;
      if (maxHourlyRate && guru.hourlyRate > parseFloat(maxHourlyRate)) return;

      gurus.push({
        id: doc.id,
        lat: guruLat,
        lng: guruLng,
        title: guru.displayName || guru.name,
        description: guru.bio || guru.title,
        category: guru.category,
        type: 'guru',
        rating: guru.rating || null,
        hourlyRate: guru.hourlyRate || null,
        skills: guru.skills || [],
        imageUrl: guru.profilePicture || null,
        href: `/guru/${doc.id}/book-session`,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      });
    });

    // Sort by distance
    gurus.sort((a, b) => a.distance - b.distance);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedGurus = gurus.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: {
        markers: paginatedGurus,
        pagination: {
          total: gurus.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(gurus.length / limitNum)
        },
        center: { lat: centerLat, lng: centerLng },
        radius: searchRadius
      }
    });

  } catch (error) {
    logger.error('Guru location search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to search gurus by location' }
    });
  }
});

/**
 * @desc    Search for gigs/jobs within a radius
 * @route   GET /api/locations/search/gigs
 * @access  Public
 */
router.get('/search/gigs', optionalAuth, async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 25,
      category,
      urgency,
      maxBudget,
      limit = 50,
      page = 1
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { message: 'Latitude and longitude are required' }
      });
    }

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(centerLat) || isNaN(centerLng) || isNaN(searchRadius)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid coordinates or radius' }
      });
    }

    const db = getFirestore();
    const bbox = getBoundingBox(centerLat, centerLng, searchRadius);

    // Query angel jobs with location data
    const jobsSnapshot = await db.collection('angel_jobs')
      .where('status', '==', 'open')
      .get();

    const gigs = [];
    jobsSnapshot.forEach(doc => {
      const job = doc.data();

      // Skip if no location data (need lat/lng)
      if (!job.location || typeof job.location !== 'object') {
        return;
      }

      const jobLat = job.location.lat;
      const jobLng = job.location.lng;

      if (jobLat === undefined || jobLng === undefined) {
        return;
      }

      // Quick bounding box check
      if (jobLat < bbox.minLat || jobLat > bbox.maxLat ||
          jobLng < bbox.minLng || jobLng > bbox.maxLng) {
        return;
      }

      // Precise distance calculation
      const distance = calculateDistance(centerLat, centerLng, jobLat, jobLng);
      if (distance > searchRadius) {
        return;
      }

      // Apply filters
      if (category && job.category !== category) return;
      if (urgency && job.urgency !== urgency) return;
      if (maxBudget && job.hourlyRate > parseFloat(maxBudget)) return;

      gigs.push({
        id: doc.id,
        lat: jobLat,
        lng: jobLng,
        title: job.title,
        description: job.description,
        category: job.category,
        type: 'gig',
        hourlyRate: job.hourlyRate || null,
        skills: job.skills || [],
        urgency: job.urgency || 'normal',
        href: `/gigs/${doc.id}`,
        distance: Math.round(distance * 10) / 10,
        postedAt: job.createdAt,
      });
    });

    // Sort by distance, then by urgency
    gigs.sort((a, b) => {
      const urgencyOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      if (a.urgency !== b.urgency) {
        return (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2);
      }
      return a.distance - b.distance;
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedGigs = gigs.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: {
        markers: paginatedGigs,
        pagination: {
          total: gigs.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(gigs.length / limitNum)
        },
        center: { lat: centerLat, lng: centerLng },
        radius: searchRadius
      }
    });

  } catch (error) {
    logger.error('Gig location search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to search gigs by location' }
    });
  }
});

/**
 * @desc    Search for all (gurus + gigs) within a radius
 * @route   GET /api/locations/search/all
 * @access  Public
 */
router.get('/search/all', optionalAuth, async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 25,
      category,
      type, // 'guru', 'gig', or undefined for all
      limit = 50,
      page = 1
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { message: 'Latitude and longitude are required' }
      });
    }

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(centerLat) || isNaN(centerLng) || isNaN(searchRadius)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid coordinates or radius' }
      });
    }

    const db = getFirestore();
    const bbox = getBoundingBox(centerLat, centerLng, searchRadius);
    const markers = [];

    // Fetch gurus if type is not specified or is 'guru'
    if (!type || type === 'guru') {
      const gurusSnapshot = await db.collection('users')
        .where('role', '==', 'guru')
        .where('isActive', '==', true)
        .get();

      gurusSnapshot.forEach(doc => {
        const guru = doc.data();
        if (!guru.location || guru.location.lat === undefined) return;

        const guruLat = guru.location.lat;
        const guruLng = guru.location.lng;

        if (guruLat < bbox.minLat || guruLat > bbox.maxLat ||
            guruLng < bbox.minLng || guruLng > bbox.maxLng) return;

        const distance = calculateDistance(centerLat, centerLng, guruLat, guruLng);
        if (distance > searchRadius) return;

        if (category && guru.category !== category) return;

        markers.push({
          id: doc.id,
          lat: guruLat,
          lng: guruLng,
          title: guru.displayName || guru.name,
          description: guru.bio || guru.title,
          category: guru.category,
          type: 'guru',
          rating: guru.rating || null,
          hourlyRate: guru.hourlyRate || null,
          skills: guru.skills || [],
          imageUrl: guru.profilePicture || null,
          href: `/guru/${doc.id}/book-session`,
          distance: Math.round(distance * 10) / 10,
        });
      });
    }

    // Fetch gigs if type is not specified or is 'gig'
    if (!type || type === 'gig') {
      const jobsSnapshot = await db.collection('angel_jobs')
        .where('status', '==', 'open')
        .get();

      jobsSnapshot.forEach(doc => {
        const job = doc.data();
        if (!job.location || typeof job.location !== 'object') return;

        const jobLat = job.location.lat;
        const jobLng = job.location.lng;
        if (jobLat === undefined || jobLng === undefined) return;

        if (jobLat < bbox.minLat || jobLat > bbox.maxLat ||
            jobLng < bbox.minLng || jobLng > bbox.maxLng) return;

        const distance = calculateDistance(centerLat, centerLng, jobLat, jobLng);
        if (distance > searchRadius) return;

        if (category && job.category !== category) return;

        markers.push({
          id: doc.id,
          lat: jobLat,
          lng: jobLng,
          title: job.title,
          description: job.description,
          category: job.category,
          type: 'gig',
          hourlyRate: job.hourlyRate || null,
          skills: job.skills || [],
          href: `/gigs/${doc.id}`,
          distance: Math.round(distance * 10) / 10,
        });
      });
    }

    // Sort by distance
    markers.sort((a, b) => a.distance - b.distance);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedMarkers = markers.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: {
        markers: paginatedMarkers,
        stats: {
          totalGurus: markers.filter(m => m.type === 'guru').length,
          totalGigs: markers.filter(m => m.type === 'gig').length,
        },
        pagination: {
          total: markers.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(markers.length / limitNum)
        },
        center: { lat: centerLat, lng: centerLng },
        radius: searchRadius
      }
    });

  } catch (error) {
    logger.error('Combined location search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to search by location' }
    });
  }
});

/**
 * @desc    Get locations for guru dashboard
 * @route   GET /api/locations/guru/locations
 * @access  Private
 */
router.get('/guru/locations', authenticateUser, async (req, res) => {
  try {
    const db = getFirestore();

    // Fetch guru's tagged locations
    const locationsSnapshot = await db.collection('guru_locations')
      .where('createdBy', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const locations = [];
    locationsSnapshot.forEach(doc => {
      locations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      locations
    });
  } catch (error) {
    logger.error('Guru locations fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch guru locations' }
    });
  }
});

/**
 * @desc    Add location for guru dashboard
 * @route   POST /api/locations/guru/locations
 * @access  Private
 */
router.post('/guru/locations', authenticateUser, async (req, res) => {
  try {
    const { lat, lng, title, description, category } = req.body;

    if (!lat || !lng || !title) {
      return res.status(400).json({
        success: false,
        error: { message: 'Latitude, longitude, and title are required' }
      });
    }

    const db = getFirestore();
    const locationRef = db.collection('guru_locations').doc();

    const locationData = {
      id: locationRef.id,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      title,
      description: description || '',
      category: category || 'general',
      createdBy: req.user.uid,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    await locationRef.set(locationData);

    // Also update guru's primary location in their profile
    await db.collection('users').doc(req.user.uid).update({
      'location.lat': parseFloat(lat),
      'location.lng': parseFloat(lng),
      'location.lastUpdated': new Date().toISOString()
    });

    logger.info('Guru location tagged', { userId: req.user.uid, locationId: locationRef.id });

    res.json({
      success: true,
      message: 'Location tagged successfully',
      data: locationData
    });
  } catch (error) {
    logger.error('Guru location tagging error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to tag location' }
    });
  }
});

/**
 * @desc    Get locations for understudy/learner dashboard
 * @route   GET /api/locations/understudy/locations
 * @access  Private
 */
router.get('/understudy/locations', authenticateUser, async (req, res) => {
  try {
    const db = getFirestore();

    const locationsSnapshot = await db.collection('understudy_locations')
      .where('createdBy', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const locations = [];
    locationsSnapshot.forEach(doc => {
      locations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      locations
    });
  } catch (error) {
    logger.error('Understudy locations fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch understudy locations' }
    });
  }
});

/**
 * @desc    Add location for understudy dashboard
 * @route   POST /api/locations/understudy/locations
 * @access  Private
 */
router.post('/understudy/locations', authenticateUser, async (req, res) => {
  try {
    const { lat, lng, title, description, category } = req.body;

    if (!lat || !lng || !title) {
      return res.status(400).json({
        success: false,
        error: { message: 'Latitude, longitude, and title are required' }
      });
    }

    const db = getFirestore();
    const locationRef = db.collection('understudy_locations').doc();

    const locationData = {
      id: locationRef.id,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      title,
      description: description || '',
      category: category || 'general',
      createdBy: req.user.uid,
      timestamp: Date.now(),
      type: 'learning_request',
      createdAt: new Date().toISOString()
    };

    await locationRef.set(locationData);

    // Also update user's location in their profile
    await db.collection('users').doc(req.user.uid).update({
      'location.lat': parseFloat(lat),
      'location.lng': parseFloat(lng),
      'location.lastUpdated': new Date().toISOString()
    });

    logger.info('Understudy location tagged', { userId: req.user.uid, locationId: locationRef.id });

    res.json({
      success: true,
      message: 'Location tagged successfully',
      data: locationData
    });
  } catch (error) {
    logger.error('Understudy location tagging error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to tag location' }
    });
  }
});

/**
 * @desc    Update user's current location
 * @route   PUT /api/locations/user/location
 * @access  Private
 */
router.put('/user/location', authenticateUser, async (req, res) => {
  try {
    const { lat, lng, city, state, country } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { message: 'Latitude and longitude are required' }
      });
    }

    const db = getFirestore();

    const locationData = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city: city || null,
      state: state || null,
      country: country || null,
      lastUpdated: new Date().toISOString()
    };

    await db.collection('users').doc(req.user.uid).update({
      location: locationData
    });

    logger.info('User location updated', { userId: req.user.uid });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: locationData
    });
  } catch (error) {
    logger.error('User location update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update location' }
    });
  }
});

module.exports = router;
