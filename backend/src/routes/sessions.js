/**
 * Distance Sessions API Routes
 * Handles session creation, management, and calendar integration
 */

const express = require('express');
const { uuidv4 } = require('../utils/uuid');
const { requireAuth } = require('../middleware/auth');
const SessionsDB = require('../db/sessions');
const { generateICS, generateAllCalendarLinks } = require('../utils/calendar');
const { SESSION_STATUSES } = require('../types/session');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * @desc    Create a new distance session
 * @route   POST /api/sessions
 * @access  Private
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User authentication required' }
      });
    }

    const sessionData = {
      id: uuidv4(),
      createdAt: Date.now(),
      status: SESSION_STATUSES.REQUESTED,
      coachId: req.body.coachId || userId,
      learnerId: req.body.learnerId === '__SELF__' ? userId : req.body.learnerId,
      skillId: req.body.skillId,
      mode: req.body.mode || 'video',
      startTime: Number(req.body.startTime),
      endTime: Number(req.body.endTime),
      joinUrl: req.body.joinUrl || '',
      captionsRequired: !!req.body.captionsRequired,
      aslRequested: !!req.body.aslRequested,
      recordPolicy: req.body.recordPolicy || 'allow-with-consent'
    };

    // Validate required fields
    if (!sessionData.learnerId) {
      return res.status(400).json({
        success: false,
        error: { message: 'learnerId is required' }
      });
    }

    const session = await SessionsDB.create(sessionData);

    logger.info(`Distance session requested: ${session.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: { session }
    });

  } catch (error) {
    logger.error('Create session error:', error);
    res.status(500).json({
      success: false,
      error: { 
        message: error.message.includes('Invalid session data') 
          ? error.message 
          : 'Failed to create session'
      }
    });
  }
});

/**
 * @desc    Get user's sessions (as coach or learner)
 * @route   GET /api/sessions
 * @access  Private
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User authentication required' }
      });
    }

    const role = req.query.role === 'learner' ? 'learner' : 'coach';
    const sessions = await SessionsDB.byUser(userId, role);

    res.json({
      success: true,
      data: { sessions }
    });

  } catch (error) {
    logger.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch sessions' }
    });
  }
});

/**
 * @desc    Get session by ID
 * @route   GET /api/sessions/:id
 * @access  Private
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.uid || req.user?.id;

    const session = await SessionsDB.get(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: 'Session not found' }
      });
    }

    // Check if user is involved in this session
    if (session.coachId !== userId && session.learnerId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    res.json({
      success: true,
      data: { session }
    });

  } catch (error) {
    logger.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch session' }
    });
  }
});

/**
 * @desc    Update session status
 * @route   PATCH /api/sessions/:id/status
 * @access  Private
 */
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.uid || req.user?.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = Object.values(SESSION_STATUSES);
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { 
          message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` 
        }
      });
    }

    // Check if session exists and user has permission
    const session = await SessionsDB.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: 'Session not found' }
      });
    }

    // Only coach or learner can update session status
    if (session.coachId !== userId && session.learnerId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const updatedSession = await SessionsDB.updateStatus(sessionId, status);

    logger.info(`Session ${sessionId} status updated to ${status} by user ${userId}`);

    res.json({
      success: true,
      data: { session: updatedSession }
    });

  } catch (error) {
    logger.error('Update session status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update session status' }
    });
  }
});

/**
 * @desc    Get calendar file (ICS) for session
 * @route   GET /api/sessions/:id/calendar
 * @access  Private
 */
router.get('/:id/calendar', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.uid || req.user?.id;
    const format = req.query.format || 'ics';

    const session = await SessionsDB.get(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: 'Session not found' }
      });
    }

    // Check if user is involved in this session
    if (session.coachId !== userId && session.learnerId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    if (format === 'ics') {
      const icsContent = generateICS(session, {
        title: `Distance Learning Session`,
        description: `${session.mode.toUpperCase()} session${session.captionsRequired ? ' (Captions required)' : ''}${session.aslRequested ? ' (ASL requested)' : ''}`
      });

      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename="session-${sessionId}.ics"`);
      return res.send(icsContent);
    }

    // Return all calendar links
    const calendarLinks = generateAllCalendarLinks(session, {
      title: `Distance Learning Session`,
      details: `${session.mode.toUpperCase()} session${session.captionsRequired ? ' (Captions required)' : ''}${session.aslRequested ? ' (ASL requested)' : ''}`
    });

    res.json({
      success: true,
      data: { calendarLinks }
    });

  } catch (error) {
    logger.error('Get session calendar error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate calendar' }
    });
  }
});

/**
 * @desc    Cancel/delete a session
 * @route   DELETE /api/sessions/:id
 * @access  Private
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.uid || req.user?.id;

    // Check if session exists and user has permission
    const session = await SessionsDB.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: 'Session not found' }
      });
    }

    // Only coach or learner can cancel session
    if (session.coachId !== userId && session.learnerId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    await SessionsDB.remove(sessionId);

    logger.info(`Session ${sessionId} canceled by user ${userId}`);

    res.json({
      success: true,
      data: { message: 'Session canceled successfully' }
    });

  } catch (error) {
    logger.error('Cancel session error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to cancel session' }
    });
  }
});

module.exports = router;