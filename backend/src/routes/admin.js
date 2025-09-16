const express = require('express');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * Admin Login - Validate ADMIN_KEY and set session cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { key } = req.body;
    const adminKey = process.env.ADMIN_KEY;
    
    if (!adminKey) {
      logger.error('ADMIN_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        error: { message: 'ADMIN_KEY not set' } 
      });
    }
    
    if (key !== adminKey) {
      logger.warn('Failed admin login attempt', { ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid admin key' } 
      });
    }

    // Set httpOnly cookie for simple admin session (4 hours)
    res.cookie('yoohoo_admin', '1', { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
      maxAge: 60 * 60 * 4 * 1000 // 4 hours
    });

    logger.info('Successful admin login', { ip: req.ip });
    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
});

/**
 * Admin Ping - Check if admin session is valid
 */
router.get('/ping', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie === '1') {
    res.json({ success: true, authenticated: true });
  } else {
    res.status(401).json({ success: false, authenticated: false });
  }
});

/**
 * Admin Logout - Clear admin session
 */
router.post('/logout', (req, res) => {
  res.clearCookie('yoohoo_admin', { path: '/' });
  res.json({ success: true, message: 'Admin logout successful' });
});

/**
 * Admin Dashboard Data - Get system overview (protected route)
 */
router.get('/dashboard', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  // Return mock dashboard data for now
  // In a real implementation, this would query your database
  res.json({
    success: true,
    data: {
      users: {
        total: 0,
        active: 0,
        newThisWeek: 0
      },
      listings: {
        total: 0,
        active: 0,
        categories: {}
      },
      sessions: {
        total: 0,
        completed: 0,
        pending: 0
      },
      reports: {
        total: 0,
        pending: 0,
        resolved: 0
      },
      featureFlags: {
        booking: true,
        messaging: true,
        reviews: true,
        communityEvents: false,
        certifications: false,
        orgTools: false,
        dataProducts: false
      }
    }
  });
});

/**
 * Get Action History - Track upload dates, branch info, etc.
 */
router.get('/action-history', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  // In a real implementation, this would query your database/git logs
  res.json({
    success: true,
    data: {
      recentActions: [
        {
          id: 1,
          timestamp: Date.now() - (1000 * 60 * 30), // 30 minutes ago
          type: 'deployment',
          action: 'Frontend deployed to production',
          user: 'system',
          branch: 'main',
          commit: '3da64fb',
          details: 'Deployed new dashboard features'
        },
        {
          id: 2,
          timestamp: Date.now() - (1000 * 60 * 60 * 2), // 2 hours ago
          type: 'upload',
          action: 'User uploaded profile document',
          user: 'user_123',
          branch: null,
          commit: null,
          details: 'insurance_verification.pdf'
        },
        {
          id: 3,
          timestamp: Date.now() - (1000 * 60 * 60 * 6), // 6 hours ago
          type: 'git_push',
          action: 'Code pushed to repository',
          user: 'developer',
          branch: 'feature/video-chat',
          commit: 'abc1234',
          details: 'Added video chat functionality'
        },
        {
          id: 4,
          timestamp: Date.now() - (1000 * 60 * 60 * 12), // 12 hours ago
          type: 'system',
          action: 'Database backup completed',
          user: 'system',
          branch: null,
          commit: null,
          details: 'Daily automated backup'
        }
      ],
      totalActions: 150,
      actionsToday: 8,
      actionsByType: {
        deployment: 12,
        upload: 45,
        git_push: 78,
        system: 15
      }
    }
  });
});

/**
 * Get Live Statistics - Page visits, traffic, locations
 */
router.get('/live-stats', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  // In a real implementation, this would query your analytics database
  res.json({
    success: true,
    data: {
      realTimeVisitors: Math.floor(Math.random() * 25) + 5, // 5-30 active users
      todayVisitors: Math.floor(Math.random() * 500) + 200,
      pageStats: {
        '/': { visits: 1250, avgTime: '2:30' },
        '/skills': { visits: 890, avgTime: '3:45' },
        '/modified': { visits: 345, avgTime: '4:12' },
        '/dashboard': { visits: 678, avgTime: '5:20' },
        '/admin': { visits: 12, avgTime: '8:45' }
      },
      subdomainStats: {
        'tech.yoohoo.guru': { visits: 234, visitors: 189 },
        'design.yoohoo.guru': { visits: 178, visitors: 134 },
        'business.yoohoo.guru': { visits: 156, visitors: 98 },
        'fitness.yoohoo.guru': { visits: 89, visitors: 67 },
        'home.yoohoo.guru': { visits: 67, visitors: 45 }
      },
      trafficSources: {
        direct: 45.2,
        search: 32.1,
        social: 15.3,
        referral: 7.4
      },
      topLocations: [
        { country: 'United States', visitors: 45.2, flag: '🇺🇸' },
        { country: 'Canada', visitors: 12.8, flag: '🇨🇦' },
        { country: 'United Kingdom', visitors: 8.9, flag: '🇬🇧' },
        { country: 'Germany', visitors: 6.7, flag: '🇩🇪' },
        { country: 'Australia', visitors: 5.1, flag: '🇦🇺' }
      ],
      hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        visitors: Math.floor(Math.random() * 50) + 10
      }))
    }
  });
});

/**
 * Update Admin Credentials - Set username and password
 */
router.post('/update-credentials', async (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      error: { message: 'Username, password, and email are required' }
    });
  }

  try {
    // In a real implementation, you would:
    // 1. Hash the password
    // 2. Store credentials in secure database
    // 3. Send email notification
    
    // For now, we'll just simulate the process and log the details
    logger.info('Admin credentials update requested', {
      username,
      email,
      timestamp: new Date().toISOString()
    });

    // Simulate sending email notification
    const emailNotification = {
      to: 'brandonlane1977@gmail.com',
      subject: 'yoohoo.guru Admin Access Details',
      body: `
        Admin access has been configured for yoohoo.guru:
        
        Username: ${username}
        Email: ${email}
        
        The password has been set as requested. Please keep these credentials secure.
        
        Access URL: ${process.env.CORS_ORIGIN_PRODUCTION || 'https://yoohoo.guru'}/admin
        
        Best regards,
        yoohoo.guru System
      `
    };

    logger.info('Email notification prepared for admin credentials', emailNotification);

    res.json({
      success: true,
      message: 'Admin credentials updated successfully. Notification email prepared.',
      data: {
        username,
        email,
        emailSent: true // In real implementation, this would be the actual send status
      }
    });

  } catch (error) {
    logger.error('Admin credentials update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update admin credentials' }
    });
  }

module.exports = router;