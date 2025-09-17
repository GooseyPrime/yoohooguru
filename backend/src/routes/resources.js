/**
 * Resources Routes
 * API endpoints for managing community resources by subdomain
 */

const express = require('express');
// const { getFirestore } = require('firebase-admin/firestore');
const { logger } = require('../utils/logger');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

/**
 * Get resources for a specific subdomain
 */
router.get('/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    
    // In a real implementation, you would fetch from database
    // For now, return structured default resources
    const resources = getDefaultResourcesBySubdomain(subdomain);
    
    res.json({
      success: true,
      subdomain,
      categories: resources
    });
  } catch (error) {
    logger.error('Resources fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch resources' }
    });
  }
});

/**
 * Add a new resource (admin only)
 */
router.post('/:subdomain', authenticateUser, async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { category, title, url, icon, description } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    // In a real implementation, you would save to database
    logger.info('Resource added', { subdomain, category, title, url });
    
    res.json({
      success: true,
      message: 'Resource added successfully',
      data: { subdomain, category, title, url, icon, description }
    });
  } catch (error) {
    logger.error('Resource creation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add resource' }
    });
  }
});

function getDefaultResourcesBySubdomain(subdomain) {
  const resources = {
    tech: [
      {
        title: '💻 Development Tools',
        icon: '🛠️',
        resources: [
          { name: 'VS Code Extensions Guide', url: 'https://code.visualstudio.com/docs/editor/extension-gallery', icon: '📝', popular: true },
          { name: 'GitHub Learning Lab', url: 'https://lab.github.com/', icon: '🎓', popular: true },
          { name: 'Stack Overflow', url: 'https://stackoverflow.com/', icon: '❓', popular: true },
          { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', icon: '📚' },
          { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/', icon: '🎯' }
        ]
      },
      {
        title: '📱 Mobile Development',
        icon: '📱',
        resources: [
          { name: 'React Native Docs', url: 'https://reactnative.dev/', icon: '⚛️', popular: true },
          { name: 'Flutter Documentation', url: 'https://flutter.dev/', icon: '🦋' },
          { name: 'iOS Developer Guide', url: 'https://developer.apple.com/', icon: '🍎' },
          { name: 'Android Developers', url: 'https://developer.android.com/', icon: '🤖' }
        ]
      }
    ],
    design: [
      {
        title: '🎨 Design Resources',
        icon: '🎨',
        resources: [
          { name: 'Figma Community', url: 'https://www.figma.com/community/', icon: '🎯', popular: true },
          { name: 'Dribbble Inspiration', url: 'https://dribbble.com/', icon: '🏀', popular: true },
          { name: 'Adobe Creative Suite', url: 'https://www.adobe.com/creativecloud.html', icon: '📐' },
          { name: 'Canva Templates', url: 'https://www.canva.com/', icon: '🌟' },
          { name: 'Color Hunt Palettes', url: 'https://colorhunt.co/', icon: '🎨' }
        ]
      },
      {
        title: '📚 Learning Materials',
        icon: '📖',
        resources: [
          { name: 'Design Principles', url: 'https://www.interaction-design.org/', icon: '📊' },
          { name: 'Typography Handbook', url: 'https://typographyhandbook.com/', icon: '✍️' },
          { name: 'UX Laws', url: 'https://lawsofux.com/', icon: '⚖️', popular: true }
        ]
      }
    ],
    business: [
      {
        title: '📈 Business Growth',
        icon: '💼',
        resources: [
          { name: 'Harvard Business Review', url: 'https://hbr.org/', icon: '📰', popular: true },
          { name: 'Google Analytics Academy', url: 'https://analytics.google.com/analytics/academy/', icon: '📊' },
          { name: 'HubSpot Academy', url: 'https://academy.hubspot.com/', icon: '🎓', popular: true },
          { name: 'SCORE Business Mentors', url: 'https://www.score.org/', icon: '👥' }
        ]
      }
    ],
    fitness: [
      {
        title: '💪 Fitness & Health',
        icon: '🏃‍♀️',
        resources: [
          { name: 'MyFitnessPal', url: 'https://www.myfitnesspal.com/', icon: '📱', popular: true },
          { name: 'Yoga with Adriene', url: 'https://yogawithadriene.com/', icon: '🧘‍♀️', popular: true },
          { name: 'Strava Community', url: 'https://www.strava.com/', icon: '🏃‍♂️' },
          { name: 'Nutrition.gov', url: 'https://www.nutrition.gov/', icon: '🥗' }
        ]
      }
    ],
    general: [
      {
        title: '📚 General Learning',
        icon: '📖',
        resources: [
          { name: 'Khan Academy', url: 'https://www.khanacademy.org/', icon: '🎓', popular: true },
          { name: 'Coursera', url: 'https://www.coursera.org/', icon: '🎓' },
          { name: 'YouTube Learning Playlists', url: 'https://www.youtube.com/', icon: '📺' },
          { name: 'Reddit Communities', url: 'https://www.reddit.com/', icon: '💬' }
        ]
      }
    ]
  };

  return resources[subdomain] || resources.general;
}

module.exports = router;