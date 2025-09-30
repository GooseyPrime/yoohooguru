const express = require('express');
const { getFirestore } = require('../config/firebase');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Create a new angel job posting
// @route   POST /api/angels/jobs
// @access  Private
router.post('/jobs', requireAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      hourlyRate,
      estimatedHours,
      skills,
      urgency = 'normal',
      featured = false
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: title, description, category, location' }
      });
    }

    const db = getFirestore();
    const jobRef = db.collection('angel_jobs').doc();
    
    const jobData = {
      id: jobRef.id,
      title,
      description,
      category,
      location,
      hourlyRate: hourlyRate || null,
      estimatedHours: estimatedHours || null,
      skills: skills || [],
      urgency,
      featured: Boolean(featured),
      postedBy: req.user.uid,
      status: 'open',
      applications: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await jobRef.set(jobData);

    // Create activity log entry
    await db.collection('activity_logs').add({
      type: 'angel_job_posted',
      userId: req.user.uid,
      jobId: jobRef.id,
      details: {
        title,
        category,
        location: location.city || location,
        featured: Boolean(featured)
      },
      timestamp: new Date().toISOString()
    });

    logger.info(`Angel job posted: ${jobRef.id} by user ${req.user.uid}`);

    res.status(201).json({
      success: true,
      data: {
        job: jobData,
        message: 'Angel job posted successfully'
      }
    });

  } catch (error) {
    logger.error('Create angel job error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create angel job' }
    });
  }
});

// @desc    Get all angel jobs with filters
// @route   GET /api/angels/jobs
// @access  Public
router.get('/jobs', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      location,
      urgency,
      status = 'open',
      search,
      limit = 20,
      page = 1
    } = req.query;

    const db = getFirestore();
    const jobsSnapshot = await db.collection('angel_jobs').get();
    let jobs = [];

    jobsSnapshot.forEach(doc => {
      const job = doc.data();
      
      // Apply filters
      if (status && job.status !== status) return;
      if (category && job.category !== category) return;
      if (urgency && job.urgency !== urgency) return;
      if (location && !job.location.city?.toLowerCase().includes(location.toLowerCase())) return;
      if (search) {
        const searchTerm = search.toLowerCase();
        if (!job.title.toLowerCase().includes(searchTerm) && 
            !job.description.toLowerCase().includes(searchTerm)) return;
      }

      // Get poster info (public fields only)
      jobs.push({
        ...job,
        applicationCount: Object.keys(job.applications || {}).length
      });
    });

    // Sort by featured status first, then by creation date (newest first)
    jobs.sort((a, b) => {
      // Featured jobs come first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // If both are featured or both are not featured, sort by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          total: jobs.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(jobs.length / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get angel jobs error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch angel jobs' }
    });
  }
});

// @desc    Get specific angel job details
// @route   GET /api/angels/jobs/:jobId
// @access  Public
router.get('/jobs/:jobId', optionalAuth, async (req, res) => {
  try {
    const { jobId } = req.params;

    const db = getFirestore();
    const jobSnapshot = await db.collection('angel_jobs').doc(jobId).get();
    
    if (!jobSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Angel job not found' }
      });
    }

    const job = jobSnapshot.data();
    
    // Get poster information
    const posterSnapshot = await db.collection('users').doc(job.postedBy).get();
    const poster = posterSnapshot.exists ? posterSnapshot.data() : null;

    res.json({
      success: true,
      data: {
        job: {
          ...job,
          poster: {
            id: job.postedBy,
            name: poster?.name || 'Anonymous',
            profilePicture: poster?.profilePicture || null,
            rating: poster?.rating || null
          },
          applicationCount: Object.keys(job.applications || {}).length
        }
      }
    });

  } catch (error) {
    logger.error('Get angel job details error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch job details' }
    });
  }
});

// @desc    Apply to an angel job
// @route   POST /api/angels/jobs/:jobId/apply
// @access  Private
router.post('/jobs/:jobId/apply', requireAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { message, proposedRate } = req.body;

    const db = getFirestore();
    
    // Check if job exists
    const jobSnapshot = await db.collection('angel_jobs').doc(jobId).get();
    if (!jobSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Angel job not found' }
      });
    }

    const job = jobSnapshot.data();
    
    // Check if user is trying to apply to their own job
    if (job.postedBy === req.user.uid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot apply to your own job posting' }
      });
    }

    // Check if user already applied
    if (job.applications && job.applications[req.user.uid]) {
      return res.status(400).json({
        success: false,
        error: { message: 'You have already applied to this job' }
      });
    }

    // Create application
    const application = {
      applicantId: req.user.uid,
      message: message || '',
      proposedRate: proposedRate || null,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    await db.collection('angel_jobs').doc(jobId).update({
      [`applications.${req.user.uid}`]: application
    });

    // Create activity log entry
    const activityLogData = {
      type: 'angel_job_application',
      userId: req.user.uid,
      jobId,
      details: {
        jobTitle: job.title
      },
      timestamp: new Date().toISOString()
    };

    // Only include proposedRate if it's defined
    if (proposedRate !== undefined && proposedRate !== null) {
      activityLogData.details.proposedRate = proposedRate;
    }

    await db.collection('activity_logs').add(activityLogData);

    logger.info(`User ${req.user.uid} applied to angel job ${jobId}`);

    res.json({
      success: true,
      data: {
        application,
        message: 'Application submitted successfully'
      }
    });

  } catch (error) {
    logger.error('Apply to angel job error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit application' }
    });
  }
});

// @desc    Get applications for a job (job poster only)
// @route   GET /api/angels/jobs/:jobId/applications
// @access  Private
router.get('/jobs/:jobId/applications', requireAuth, async (req, res) => {
  try {
    const { jobId } = req.params;

    const db = getFirestore();
    
    // Check if job exists and user owns it
    const jobSnapshot = await db.collection('angel_jobs').doc(jobId).get();
    if (!jobSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Angel job not found' }
      });
    }

    const job = jobSnapshot.data();
    if (job.postedBy !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied. You can only view applications for your own jobs.' }
      });
    }

    const applications = [];
    
    // Get applicant details for each application
    if (job.applications) {
      for (const [applicantId, application] of Object.entries(job.applications)) {
        const userSnapshot = await db.collection('users').doc(applicantId).get();
        const user = userSnapshot.exists ? userSnapshot.data() : null;
        
        applications.push({
          ...application,
          applicant: {
            id: applicantId,
            name: user?.name || 'Anonymous',
            profilePicture: user?.profilePicture || null,
            rating: user?.rating || null,
            skillsOffered: user?.skillsOffered || []
          }
        });
      }
    }

    res.json({
      success: true,
      data: {
        jobId,
        jobTitle: job.title,
        applications: applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      }
    });

  } catch (error) {
    logger.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch applications' }
    });
  }
});

// @desc    Update application status (accept/reject)
// @route   PUT /api/angels/jobs/:jobId/applications/:applicantId
// @access  Private
router.put('/jobs/:jobId/applications/:applicantId', requireAuth, async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    const { status, message } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Status must be either "accepted" or "rejected"' }
      });
    }

    const db = getFirestore();
    
    // Check if job exists and user owns it
    const jobSnapshot = await db.collection('angel_jobs').doc(jobId).get();
    if (!jobSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Angel job not found' }
      });
    }

    const job = jobSnapshot.data();
    if (job.postedBy !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    // Update application status
    await db.collection('angel_jobs').doc(jobId).update({
      [`applications.${applicantId}.status`]: status,
      [`applications.${applicantId}.responseMessage`]: message || null,
      [`applications.${applicantId}.respondedAt`]: new Date().toISOString()
    });

    // If accepted, update job status and reject other applications
    if (status === 'accepted') {
      await db.collection('angel_jobs').doc(jobId).update({
        status: 'assigned',
        assignedTo: applicantId,
        updatedAt: new Date().toISOString()
      });

      // Reject all other pending applications
      if (job.applications) {
        const updates = {};
        Object.keys(job.applications).forEach(otherApplicantId => {
          if (otherApplicantId !== applicantId && job.applications[otherApplicantId].status === 'pending') {
            updates[`applications.${otherApplicantId}.status`] = 'rejected';
            updates[`applications.${otherApplicantId}.responseMessage`] = 'Position filled';
            updates[`applications.${otherApplicantId}.respondedAt`] = new Date().toISOString();
          }
        });
        
        if (Object.keys(updates).length > 0) {
          await db.collection('angel_jobs').doc(jobId).update(updates);
        }
      }
    }

    // Create activity log entry
    await db.collection('activity_logs').add({
      type: 'angel_application_response',
      userId: req.user.uid,
      jobId,
      applicantId,
      details: {
        status,
        jobTitle: job.title
      },
      timestamp: new Date().toISOString()
    });

    logger.info(`Application ${status} for job ${jobId}, applicant ${applicantId}`);

    res.json({
      success: true,
      data: {
        message: `Application ${status} successfully`
      }
    });

  } catch (error) {
    logger.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update application status' }
    });
  }
});

// @desc    Mark angel job as completed
// @route   PUT /api/angels/jobs/:jobId/complete
// @access  Private
router.put('/jobs/:jobId/complete', requireAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { rating, review } = req.body;

    const db = getFirestore();
    
    // Check if job exists
    const jobSnapshot = await db.collection('angel_jobs').doc(jobId).get();
    if (!jobSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Angel job not found' }
      });
    }

    const job = jobSnapshot.data();
    
    // Check if user is authorized (job poster or assigned angel)
    if (job.postedBy !== req.user.uid && job.assignedTo !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    // Update job status
    await db.collection('angel_jobs').doc(jobId).update({
      status: 'completed',
      completedAt: new Date().toISOString(),
      completedBy: req.user.uid,
      rating: rating || null,
      review: review || null,
      updatedAt: new Date().toISOString()
    });

    // Create activity log entry
    await db.collection('activity_logs').add({
      type: 'angel_job_completed',
      userId: req.user.uid,
      jobId,
      details: {
        jobTitle: job.title,
        rating: rating || null
      },
      timestamp: new Date().toISOString()
    });

    logger.info(`Angel job ${jobId} marked as completed by user ${req.user.uid}`);

    res.json({
      success: true,
      data: {
        message: 'Job marked as completed successfully'
      }
    });

  } catch (error) {
    logger.error('Complete angel job error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to complete job' }
    });
  }
});

// @desc    Get user's angel job activity (posted jobs and applications)
// @route   GET /api/angels/my-activity
// @access  Private
router.get('/my-activity', requireAuth, async (req, res) => {
  try {
    const db = getFirestore();
    
    // Get user's posted jobs
    const postedJobsSnapshot = await db.collection('angel_jobs')
      .where('postedBy', '==', req.user.uid)
      .get();
    
    const postedJobs = [];
    postedJobsSnapshot.forEach(doc => {
      const job = doc.data();
      postedJobs.push({
        ...job,
        applicationCount: Object.keys(job.applications || {}).length
      });
    });

    // Get user's applications
    const allJobsSnapshot = await db.collection('angel_jobs').get();
    const applications = [];
    
    allJobsSnapshot.forEach(doc => {
      const job = doc.data();
      if (job.applications && job.applications[req.user.uid]) {
        applications.push({
          jobId: job.id,
          jobTitle: job.title,
          jobCategory: job.category,
          jobPoster: job.postedBy,
          application: job.applications[req.user.uid],
          jobStatus: job.status
        });
      }
    });

    res.json({
      success: true,
      data: {
        postedJobs: postedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        applications: applications.sort((a, b) => new Date(b.application.appliedAt) - new Date(a.application.appliedAt)),
        statistics: {
          totalJobsPosted: postedJobs.length,
          totalApplications: applications.length,
          activeJobs: postedJobs.filter(job => job.status === 'open').length,
          completedJobs: postedJobs.filter(job => job.status === 'completed').length
        }
      }
    });

  } catch (error) {
    logger.error('Get user angel activity error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user activity' }
    });
  }
});

module.exports = router;