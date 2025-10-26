/**
 * Backup Agent for YooHoo.guru Content Database
 *
 * This agent creates regular backups of all curated content including:
 * - News articles
 * - Blog posts
 * - Metadata and timestamps
 *
 * Backups are stored in both:
 * 1. Firestore 'backups' collection (for quick restoration)
 * 2. JSON files in /backend/backups directory (for disaster recovery)
 */

const cron = require('node-cron');
const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { getAllSubdomains } = require('../config/subdomains');

// Backup agent status tracking
const backupAgentStatus = {
  status: 'stopped', // 'stopped' | 'running' | 'error' | 'disabled'
  error: null,
  lastStarted: null,
  lastBackup: null,
  totalBackups: 0
};

/**
 * Create a backup of all content for all subdomains
 */
async function createBackup() {
  const db = getFirestore();
  const timestamp = Date.now();
  const dateStr = new Date(timestamp).toISOString().split('T')[0];

  logger.info('🔄 Starting content backup...');

  try {
    const allSubdomains = getAllSubdomains();
    const backupData = {
      timestamp,
      date: dateStr,
      subdomains: {},
      metadata: {
        totalSubdomains: allSubdomains.length,
        totalArticles: 0,
        totalPosts: 0,
        backupVersion: '1.0.0'
      }
    };

    // Backup content for each subdomain
    for (const subdomain of allSubdomains) {
      try {
        const subdomainData = {
          subdomain,
          news: [],
          posts: [],
          stats: null
        };

        // Backup news articles
        const newsSnapshot = await db.collection('gurus')
          .doc(subdomain)
          .collection('news')
          .orderBy('curatedAt', 'desc')
          .get();

        newsSnapshot.forEach(doc => {
          subdomainData.news.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Backup blog posts
        const postsSnapshot = await db.collection('gurus')
          .doc(subdomain)
          .collection('posts')
          .orderBy('publishedAt', 'desc')
          .get();

        postsSnapshot.forEach(doc => {
          subdomainData.posts.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Backup stats
        const statsSnapshot = await db.collection('gurus')
          .doc(subdomain)
          .collection('stats')
          .get();

        if (!statsSnapshot.empty) {
          const statsDoc = statsSnapshot.docs[0];
          subdomainData.stats = statsDoc.data();
        }

        backupData.subdomains[subdomain] = subdomainData;
        backupData.metadata.totalArticles += subdomainData.news.length;
        backupData.metadata.totalPosts += subdomainData.posts.length;

        logger.info(`  ✅ ${subdomain}: ${subdomainData.news.length} articles, ${subdomainData.posts.length} posts`);
      } catch (subdomainError) {
        logger.error(`  ❌ ${subdomain}: Backup failed`, subdomainError);
      }
    }

    // Store backup in Firestore
    const backupId = `backup-${dateStr}-${timestamp}`;
    await db.collection('backups').doc(backupId).set(backupData);

    // Store backup as JSON file
    const backupsDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const backupFilePath = path.join(backupsDir, `${backupId}.json`);
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

    // Cleanup old backups (keep only last 30 days in Firestore)
    await cleanupOldBackups(db);

    // Update status
    backupAgentStatus.lastBackup = timestamp;
    backupAgentStatus.totalBackups++;

    logger.info(`✅ Backup completed: ${backupData.metadata.totalArticles} articles, ${backupData.metadata.totalPosts} posts`);
    logger.info(`   Firestore ID: ${backupId}`);
    logger.info(`   File: ${backupFilePath}`);

    return {
      success: true,
      backupId,
      metadata: backupData.metadata
    };
  } catch (error) {
    logger.error('❌ Backup failed:', error);
    backupAgentStatus.status = 'error';
    backupAgentStatus.error = error.message;
    throw error;
  }
}

/**
 * Cleanup old backups (keep only last 30 days in Firestore)
 */
async function cleanupOldBackups(db) {
  try {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const oldBackupsSnapshot = await db.collection('backups')
      .where('timestamp', '<', thirtyDaysAgo)
      .get();

    if (oldBackupsSnapshot.empty) {
      return;
    }

    const batch = db.batch();
    let deleteCount = 0;

    oldBackupsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
      deleteCount++;
    });

    await batch.commit();
    logger.info(`   🗑️  Cleaned up ${deleteCount} old backups from Firestore`);
  } catch (error) {
    logger.warn('   ⚠️  Failed to cleanup old backups:', error.message);
  }
}

/**
 * Restore content from a backup
 */
async function restoreFromBackup(backupId) {
  const db = getFirestore();

  logger.info(`🔄 Restoring from backup: ${backupId}`);

  try {
    const backupDoc = await db.collection('backups').doc(backupId).get();

    if (!backupDoc.exists) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const backupData = backupDoc.data();
    let restoredArticles = 0;
    let restoredPosts = 0;

    for (const [subdomain, data] of Object.entries(backupData.subdomains)) {
      try {
        // Restore news articles
        for (const article of data.news) {
          await db.collection('gurus')
            .doc(subdomain)
            .collection('news')
            .doc(article.id)
            .set(article);
          restoredArticles++;
        }

        // Restore blog posts
        for (const post of data.posts) {
          await db.collection('gurus')
            .doc(subdomain)
            .collection('posts')
            .doc(post.id)
            .set(post);
          restoredPosts++;
        }

        logger.info(`  ✅ ${subdomain}: Restored ${data.news.length} articles, ${data.posts.length} posts`);
      } catch (error) {
        logger.error(`  ❌ ${subdomain}: Restore failed`, error);
      }
    }

    logger.info(`✅ Restore completed: ${restoredArticles} articles, ${restoredPosts} posts`);

    return {
      success: true,
      restoredArticles,
      restoredPosts
    };
  } catch (error) {
    logger.error('❌ Restore failed:', error);
    throw error;
  }
}

/**
 * List available backups
 */
async function listBackups() {
  const db = getFirestore();

  try {
    const backupsSnapshot = await db.collection('backups')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const backups = [];
    backupsSnapshot.forEach(doc => {
      const data = doc.data();
      backups.push({
        id: doc.id,
        date: data.date,
        timestamp: data.timestamp,
        totalArticles: data.metadata?.totalArticles || 0,
        totalPosts: data.metadata?.totalPosts || 0,
        totalSubdomains: data.metadata?.totalSubdomains || 0
      });
    });

    return backups;
  } catch (error) {
    logger.error('Failed to list backups:', error);
    throw error;
  }
}

/**
 * Start the backup agent
 */
function startBackupAgent() {
  if (process.env.DISABLE_BACKUP_AGENT === 'true') {
    backupAgentStatus.status = 'disabled';
    logger.info('⏸️  Backup Agent is disabled (DISABLE_BACKUP_AGENT=true)');
    return;
  }

  try {
    backupAgentStatus.status = 'running';
    backupAgentStatus.lastStarted = new Date().toISOString();
    backupAgentStatus.error = null;

    // Schedule daily backups at 2 AM EST
    // Cron format: minute hour day month weekday
    // 2 AM EST = 7 AM UTC (or 6 AM UTC during DST)
    const cronSchedule = '0 2 * * *'; // Daily at 2 AM server time

    cron.schedule(cronSchedule, async () => {
      logger.info('⏰ Scheduled backup starting...');
      try {
        await createBackup();
      } catch (error) {
        logger.error('Scheduled backup failed:', error);
      }
    });

    logger.info('✅ Backup Agent started');
    logger.info(`   Schedule: Daily at 2 AM (cron: ${cronSchedule})`);
    logger.info(`   Firestore retention: 30 days`);
    logger.info(`   File backups: Unlimited (stored in /backend/backups)`);

    // Create initial backup
    setTimeout(() => {
      logger.info('Creating initial backup...');
      createBackup().catch(error => {
        logger.error('Initial backup failed:', error);
      });
    }, 5000); // Wait 5 seconds after startup
  } catch (error) {
    backupAgentStatus.status = 'error';
    backupAgentStatus.error = error.message;
    logger.error('❌ Backup Agent failed to start:', error);

    if (process.env.FAIL_ON_AGENT_ERROR === 'true') {
      throw error;
    }
  }
}

/**
 * Get backup agent status
 */
function getBackupAgentStatus() {
  return backupAgentStatus;
}

/**
 * Trigger manual backup
 */
async function triggerManualBackup() {
  logger.info('🔄 Manual backup triggered');
  return await createBackup();
}

module.exports = {
  startBackupAgent,
  getBackupAgentStatus,
  triggerManualBackup,
  createBackup,
  restoreFromBackup,
  listBackups
};
