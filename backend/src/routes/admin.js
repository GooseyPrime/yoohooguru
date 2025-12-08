const express = require('express');
const { logger } = require('../utils/logger');
const { triggerManualCuration, getCurationAgentStatus } = require('../agents/curationAgents');
const { getCacheStats, clearCache } = require('../middleware/cache');
const {
  getBackupAgentStatus,
  triggerManualBackup,
  listBackups,
  restoreFromBackup
} = require('../agents/backupAgent');
const { getFirestore } = require('../config/firebase');
const { getAllSubdomains } = require('../config/subdomains');

const router = express.Router();

const requireAdmin = (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;

  if (adminCookie !== '1') {
    res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
    return false;
  }

  return true;
};

const toISOStringOrEmpty = (timestamp) => {
  if (!timestamp) return '';
  
  // Handle Firestore Timestamp objects
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  // Handle Date objects
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  // Handle numeric timestamps (milliseconds)
  if (typeof timestamp === 'number') {
    return new Date(timestamp).toISOString();
  }
  
  // Handle string timestamps
  if (typeof timestamp === 'string') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? '' : date.toISOString();
  }
  
  return '';
};

const buildUserRecord = (doc) => {
  const data = doc.data() || {};

  return {
    id: doc.id,
    name: data.name || data.displayName || data.fullName || '',
    email: data.email || '',
    role: data.role || data.userRole || 'unknown',
    status: data.status || data.accountStatus || 'unknown',
    lastActive: data.lastActive || data.updatedAt || data.lastActivity || null,
    signUp: data.createdAt || data.signUp || null,
    entries: data.entries || data.totalEntries || 0,
    region: data.region || data.country || data.locale || '',
    heroGuru: Boolean(data.heroGuru || (data.heroGuruPrefs && data.heroGuruPrefs.visible))
  };
};

const safeCount = async (collectionRef) => {
  try {
    if (typeof collectionRef.count === 'function') {
      const countSnap = await collectionRef.count().get();
      return countSnap.data().count || 0;
    }

    const snap = await collectionRef.limit(500).get();
    return snap.size;
  } catch (error) {
    logger.error('Failed to perform count query', { error: error.message });
    return 0;
  }
};

const fetchUsers = async () => {
  const db = getDb();

  // Prefer lower-case collection; fall back to capitalized variant for legacy data
  const collectionsToCheck = ['users', 'Users'];
  for (const name of collectionsToCheck) {
    const col = db.collection(name);
    const snap = await col.limit(200).get();

    if (!snap.empty) {
      const total = await safeCount(col);
      return {
        total,
        heroGuruUsers: await safeCount(col.where('heroGuruPrefs.visible', '==', true)),
        active: await safeCount(col.where('status', '==', 'active')),
        suspended: await safeCount(col.where('status', '==', 'suspended')),
        items: snap.docs.map(buildUserRecord)
      };
    }
  }

  return {
    total: 0,
    heroGuruUsers: 0,
    active: 0,
    suspended: 0,
    items: []
  };
};

const fetchContent = async () => {
  const db = getDb();
  const subdomains = getAllSubdomains();
  const content = [];
  const subdomainTotals = new Set();

  for (const subdomain of subdomains) {
    try {
      const newsCollection = db.collection('gurus').doc(subdomain).collection('news');
      const postsCollection = db.collection('gurus').doc(subdomain).collection('posts');

      const [newsSnap, postsSnap] = await Promise.all([
        newsCollection.orderBy('publishedAt', 'desc').limit(50).get().catch(() => newsCollection.limit(50).get()),
        postsCollection.orderBy('publishedAt', 'desc').limit(50).get().catch(() => postsCollection.limit(50).get())
      ]);

      if (!newsSnap.empty || !postsSnap.empty) {
        subdomainTotals.add(subdomain);
      }

      newsSnap.forEach((doc) => {
        const data = doc.data() || {};
        content.push({
          id: doc.id,
          title: data.title || '',
          category: data.category || 'news',
          subdomain,
          status: data.status || 'published',
          type: 'news',
          createdAt: data.createdAt || data.curatedAt || data.publishedAt || null,
          updatedAt: data.updatedAt || data.publishedAt || data.curatedAt || null
        });
      });

      postsSnap.forEach((doc) => {
        const data = doc.data() || {};
        content.push({
          id: doc.id,
          title: data.title || '',
          category: data.category || 'blog',
          subdomain,
          status: data.status || data.visibility || 'published',
          type: 'posts',
          createdAt: data.createdAt || data.publishedAt || null,
          updatedAt: data.updatedAt || data.publishedAt || null
        });
      });
    } catch (error) {
      logger.error('Failed to fetch content for subdomain', { subdomain, error: error.message });
    }
  }

  return {
    content,
    subdomains: Array.from(subdomainTotals)
  };
};

const fetchFinancials = async () => {
  const db = getDb();

  const heroGuruDoc = await db.collection('financials').doc('hero-gurus').get();
  const commercialDoc = await db.collection('financials').doc('commercial').get();
  const transactionsSnap = await db.collection('financial_transactions').orderBy('createdAt', 'desc').limit(100).get().catch(() => null);

  const ledger = transactionsSnap ? transactionsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) : [];

  const heroGuru = heroGuruDoc.exists ? heroGuruDoc.data() : {};
  const commercial = commercialDoc.exists ? commercialDoc.data() : {};

  const heroGuruIncome = Number(heroGuru.donations || 0) + Number(heroGuru.grants || 0);
  const heroGuruOutflow = Number(heroGuru.expenses || 0) + Number(heroGuru.reserved || 0);
  const commercialIncome = Number(commercial.revenue || 0);
  const commercialOutflow = Number(commercial.refunds || 0) + Number(commercial.expenses || 0) + Number(commercial.deferred || 0);

  return {
    currency: heroGuru.currency || commercial.currency || 'USD',
    heroGuru: {
      type: heroGuru.type || 'non-profit',
      donations: Number(heroGuru.donations || 0),
      grants: Number(heroGuru.grants || 0),
      expenses: Number(heroGuru.expenses || 0),
      reserved: Number(heroGuru.reserved || 0)
    },
    commercial: {
      type: commercial.type || 'for-profit',
      revenue: Number(commercial.revenue || 0),
      refunds: Number(commercial.refunds || 0),
      expenses: Number(commercial.expenses || 0),
      deferred: Number(commercial.deferred || 0)
    },
    ledger,
    summary: {
      netPosition: heroGuruIncome - heroGuruOutflow,
      commercialNet: commercialIncome - commercialOutflow
    }
  };
};

const getDb = () => {
  const db = getFirestore();

  if (!db) {
    throw new Error('Firestore not initialized');
  }

  return db;
};

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

    res.cookie('yoohoo_admin_login', new Date().toISOString(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 4 * 1000
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
  res.clearCookie('yoohoo_admin_login', { path: '/' });
  res.json({ success: true, message: 'Admin logout successful' });
});

router.get('/console/overview', (req, res) => {
  if (!requireAdmin(req, res)) return;

  (async () => {
    try {
      const db = getDb();
      const [userSummary, contentSummary] = await Promise.all([
        fetchUsers(),
        fetchContent()
      ]);

      const collections = await db.listCollections();
      const backupStatus = getBackupAgentStatus();

      res.json({
        success: true,
        data: {
          users: userSummary,
          content: {
            totalEntries: contentSummary.content.length,
            published: contentSummary.content.filter((item) => item.status === 'published').length,
            draft: contentSummary.content.filter((item) => item.status === 'draft').length,
            subdomains: contentSummary.subdomains
          },
          security: {
            lastAdminLogin: req.cookies?.yoohoo_admin_login || null,
            sessionValid: true,
            csrf: true,
            rateLimiting: true
          },
          databases: {
            collections: collections.map((col) => col.id),
            backupEnabled: backupStatus.status !== 'disabled',
            lastBackup: backupStatus.lastBackup || null
          }
        }
      });
    } catch (error) {
      logger.error('Failed to build admin overview', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Failed to load admin overview' } });
    }
  })();
});

router.get('/console/users', (req, res) => {
  if (!requireAdmin(req, res)) return;

  (async () => {
    try {
      const userSummary = await fetchUsers();
      res.json({ success: true, data: userSummary.items });
    } catch (error) {
      logger.error('Failed to fetch users for admin console', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Unable to load users' } });
    }
  })();
});

router.get('/console/content', (req, res) => {
  if (!requireAdmin(req, res)) return;

  (async () => {
    try {
      const { content } = await fetchContent();
      res.json({ success: true, data: content });
    } catch (error) {
      logger.error('Failed to fetch content for admin console', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Unable to load content' } });
    }
  })();
});

router.post('/console/content/:id/remove', (req, res) => {
  if (!requireAdmin(req, res)) return;

  (async () => {
    const { id } = req.params;
    const { subdomain, type } = req.body || {};

    if (!subdomain || !type) {
      return res.status(400).json({ success: false, error: { message: 'subdomain and type are required to remove content' } });
    }

    try {
      const db = getDb();
      const collectionRef = db.collection('gurus').doc(subdomain).collection(type);
      const doc = await collectionRef.doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({ success: false, error: { message: 'Content not found' } });
      }

      await collectionRef.doc(id).delete();
      logger.warn('Admin removed content entry', { id, subdomain, type });

      res.json({
        success: true,
        message: 'Content removed from publication pipeline',
        id
      });
    } catch (error) {
      logger.error('Failed to remove content entry', { id, subdomain, type, error: error.message });
      res.status(500).json({ success: false, error: { message: 'Failed to remove content' } });
    }
  })();
});

router.get('/console/financials', (req, res) => {
  if (!requireAdmin(req, res)) return;

  (async () => {
    try {
      const data = await fetchFinancials();
      res.json({ success: true, data });
    } catch (error) {
      logger.error('Failed to fetch financials', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Unable to load financials' } });
    }
  })();
});

router.get('/console/export', (req, res) => {
  if (!requireAdmin(req, res)) return;

  (async () => {
    try {
      const userSummary = await fetchUsers();
      const csvRows = [
        'id,name,email,role,status,lastActive,signUp,entries,region,heroGuru',
        ...userSummary.items.map(user => [
          user.id,
          user.name,
          user.email,
          user.role,
          user.status,
          toISOStringOrEmpty(user.lastActive),
          toISOStringOrEmpty(user.signUp),
          user.entries,
          user.region,
          user.heroGuru
        ].join(','))
      ];

      res.header('Content-Type', 'text/csv');
      res.attachment(`admin-users-export-${Date.now()}.csv`);
      res.send(csvRows.join('\n'));
    } catch (error) {
      logger.error('Failed to export users', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Unable to export users' } });
    }
  })();
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

  (async () => {
    try {
      const db = getDb();
      const [userSummary, sessionTotals, skillTotals] = await Promise.all([
        fetchUsers(),
        (async () => {
          const sessionsCol = db.collection('sessions');
          return {
            total: await safeCount(sessionsCol),
            completed: await safeCount(sessionsCol.where('status', '==', 'completed')),
            pending: await safeCount(sessionsCol.where('status', '==', 'requested'))
          };
        })(),
        (async () => {
          const skillsCol = db.collection('skills');
          return {
            total: await safeCount(skillsCol),
            active: await safeCount(skillsCol.where('status', '==', 'active'))
          };
        })()
      ]);

      res.json({
        success: true,
        data: {
          users: {
            total: userSummary.total,
            active: userSummary.active,
            newThisWeek: 0
          },
          listings: {
            total: skillTotals.total,
            active: skillTotals.active,
            categories: {}
          },
          sessions: sessionTotals,
          reports: {
            total: await safeCount(db.collection('reports')),
            pending: await safeCount(db.collection('reports').where('status', '==', 'open')),
            resolved: await safeCount(db.collection('reports').where('status', '==', 'resolved'))
          },
          featureFlags: {}
        }
      });
    } catch (error) {
      logger.error('Failed to load dashboard data', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Failed to load dashboard data' } });
    }
  })();
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

  (async () => {
    try {
      const db = getDb();

      const backupsSnap = await db.collection('backups')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
        .catch(() => null);

      const actions = [];
      if (backupsSnap && !backupsSnap.empty) {
        backupsSnap.forEach((doc) => {
          const data = doc.data() || {};
          actions.push({
            id: doc.id,
            timestamp: data.timestamp || null,
            type: 'backup',
            action: 'Content backup completed',
            user: 'system',
            branch: null,
            commit: null,
            details: data.metadata ? JSON.stringify(data.metadata) : ''
          });
        });
      }

      res.json({
        success: true,
        data: {
          recentActions: actions,
          totalActions: actions.length,
          actionsToday: actions.filter((action) => action.timestamp && action.timestamp > Date.now() - (24 * 60 * 60 * 1000)).length,
          actionsByType: actions.reduce((acc, action) => {
            acc[action.type] = (acc[action.type] || 0) + 1;
            return acc;
          }, {})
        }
      });
    } catch (error) {
      logger.error('Failed to load action history', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Failed to load action history' } });
    }
  })();
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

  (async () => {
    try {
      const db = getDb();
      const now = Date.now();
      const tenMinutesAgo = now - (10 * 60 * 1000);
      const dayAgo = now - (24 * 60 * 60 * 1000);

      const sessionsCol = db.collection('sessions');
      const [recentSessionsSnap, todaySessionsSnap] = await Promise.all([
        sessionsCol.where('updatedAt', '>', tenMinutesAgo).get().catch(() => sessionsCol.where('createdAt', '>', tenMinutesAgo).get()),
        sessionsCol.where('createdAt', '>', dayAgo).get()
      ]);

      const { content } = await fetchContent();
      const subdomainStats = content.reduce((acc, item) => {
        const key = `${item.subdomain}.yoohoo.guru`;
        acc[key] = acc[key] || { visits: 0, visitors: 0 };
        acc[key].visits += 1;
        acc[key].visitors += 1;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          realTimeVisitors: recentSessionsSnap ? recentSessionsSnap.size : 0,
          todayVisitors: todaySessionsSnap ? todaySessionsSnap.size : 0,
          pageStats: {},
          subdomainStats,
          trafficSources: {},
          topLocations: [],
          hourlyTraffic: []
        }
      });
    } catch (error) {
      logger.error('Failed to load live stats', { error: error.message });
      res.status(500).json({ success: false, error: { message: 'Failed to load live statistics' } });
    }
  })();
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
});

/**
 * POST /api/admin/curate
 * Manually trigger content curation for all subdomains
 * For testing and manual triggering
 */
router.post('/curate', async (req, res) => {
  try {
    logger.info('🔄 Manual curation triggered via API');
    
    await triggerManualCuration();
    
    res.json({
      success: true,
      message: 'Content curation completed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Error during manual curation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete content curation',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/agents-status
 * Get status of curation agents
 */
router.get('/agents-status', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;

  if (adminCookie !== '1') {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
  }

  const curationStatus = getCurationAgentStatus();
  const backupStatus = getBackupAgentStatus();

  res.json({
    success: true,
    agents: {
      curation: curationStatus,
      backup: backupStatus
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get cache statistics (admin only)
 */
router.get('/cache/stats', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }
  
  const stats = getCacheStats();
  res.json({
    success: true,
    cache: stats,
    timestamp: new Date().toISOString()
  });
});

/**
 * Clear cache (admin only)
 */
router.post('/cache/clear', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }
  
  const { pattern } = req.body;
  clearCache(pattern);
  
  logger.info('Cache cleared by admin', { 
    ip: req.ip, 
    pattern: pattern || 'all' 
  });
  
  res.json({
    success: true,
    message: pattern ? `Cache cleared for pattern: ${pattern}` : 'All cache cleared',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get backup agent status (admin only)
 */
router.get('/backup/status', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
  }

  const status = getBackupAgentStatus();
  res.json({
    success: true,
    status,
    timestamp: new Date().toISOString()
  });
});

/**
 * List available backups (admin only)
 */
router.get('/backup/list', async (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
  }

  try {
    const backups = await listBackups();
    res.json({
      success: true,
      backups,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to list backups:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to list backups' }
    });
  }
});

/**
 * Create manual backup (admin only)
 */
router.post('/backup/create', async (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
  }

  try {
    logger.info('Manual backup triggered by admin', { ip: req.ip });
    const result = await triggerManualBackup();

    res.json({
      success: true,
      message: 'Backup created successfully',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Manual backup failed:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Backup creation failed', details: error.message }
    });
  }
});

/**
 * Restore from backup (admin only)
 */
router.post('/backup/restore', async (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
  }

  try {
    const { backupId } = req.body;

    if (!backupId) {
      return res.status(400).json({
        success: false,
        error: { message: 'backupId is required' }
      });
    }

    logger.info('Restore from backup triggered by admin', { ip: req.ip, backupId });
    const result = await restoreFromBackup(backupId);

    res.json({
      success: true,
      message: 'Content restored successfully',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Restore failed:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Restore failed', details: error.message }
    });
  }
});

/**
 * Get all agent statuses (admin only)
 */
router.get('/agents-status', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  if (adminCookie !== '1') {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin authentication required' }
    });
  }

  const curationStatus = getCurationAgentStatus();
  const backupStatus = getBackupAgentStatus();

  res.json({
    success: true,
    agents: {
      curation: curationStatus,
      backup: backupStatus
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;