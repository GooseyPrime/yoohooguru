const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');

const router = express.Router();

// Compute step-by-step status for UI wizard
router.get('/status', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = getFirestore();

    const [profileSnap, picksSnap, docsSnap] = await Promise.all([
      db.collection('profiles').doc(uid).get(),
      db.collection('profile_categories').doc(uid).get(),
      db.collection('profile_documents').doc(uid).get()
    ]);

    const profile = profileSnap.exists ? profileSnap.data() : {};
    const picks   = picksSnap.exists ? picksSnap.data() : {};
    const docs    = docsSnap.exists ? docsSnap.data() : {};

    const step = {
      profileComplete: Boolean(profile.displayName && profile.city && profile.zip && profile.bio),
      categoriesComplete: Object.keys(picks).length > 0,
      requirementsComplete: true, // will be set false if missing required docs
      payoutConnected: Boolean(profile.stripe_account_id || profile.payout_ready),
      reviewReady: false,
    };

    // Check requirements for selected categories
    const reqsSnap = await db.collection('category_requirements').get();
    const reqs = {};
    reqsSnap.forEach(doc => {
      reqs[doc.id] = doc.data();
    });
    for (const slug of Object.keys(picks)) {
      const r = reqs[slug] || {};
      if (r.requires_license && !hasApproved(docs, 'license', slug)) step.requirementsComplete = false;
      if (r.requires_gl && !hasApproved(docs, 'insurance', slug))   step.requirementsComplete = false;
      if (r.requires_auto_insurance && !hasApproved(docs, 'auto', slug)) step.requirementsComplete = false;
    }

    step.reviewReady = step.profileComplete && step.categoriesComplete && step.requirementsComplete && step.payoutConnected;

    res.json({ success:true, data:{ step, profile, picks, docs }});
  } catch (e) {
    logger.error('onboarding/status error', e);
    res.status(500).json({ success:false, error:{ message:'Failed to load onboarding status' }});
  }
});

function hasApproved(docs, type, slug) {
  const list = Object.values(docs || {}).filter(d => d.type===type && (!d.category || d.category===slug));
  return list.some(d => d.status === 'approved' && (!d.expires_on || Date.parse(d.expires_on) > Date.now()));
}

// Save basic profile
router.post('/profile', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName, photoUrl, city, zip, bio } = req.body;
    const db = getFirestore();
    await db.collection('profiles').doc(uid).update({
      displayName, photoUrl, city, zip, bio,
      updatedAt: new Date().toISOString(),
      // surface badge placeholders
      is_id_verified: !!req.body.is_id_verified || false,
      insurance_status: 'unknown',
      license_status: 'unknown',
    });
    res.json({ success:true });
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to save profile' }});
  }
});

// Save category selections
router.post('/categories', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { categories } = req.body; // array of slugs
    const db = getFirestore();

    // Normalize to map for quick lookup
    const picks = {};
    (categories || []).forEach(slug => picks[slug] = { selectedAt: new Date().toISOString() });

    await db.collection('profile_categories').doc(uid).set(picks);
    res.json({ success:true });
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to save categories' }});
  }
});

// Get requirements for selected categories
router.get('/requirements', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = getFirestore();
    const [picksSnap, reqsSnap] = await Promise.all([
      db.collection('profile_categories').doc(uid).get(),
      db.collection('category_requirements').get()
    ]);
    const picks = Object.keys(picksSnap.exists ? picksSnap.data() : {});
    const reqs = {};
    reqsSnap.forEach(doc => {
      reqs[doc.id] = doc.data();
    });
    const needed = picks.map(slug => ({ slug, requirements: reqs[slug] || {} }));
    res.json({ success:true, data:{ needed }});
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to load requirements' }});
  }
});

// Add document metadata (file upload storage integration can be phased)
router.post('/documents', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { type, category, provider, number, issued_on, expires_on, file_url } = req.body;
    const db = getFirestore();
    const ref = db.collection('profile_documents').doc(uid).collection('documents').doc();
    await ref.set({
      id: ref.id,
      type, category: category || null,
      provider: provider || null,
      number: number || null,
      issued_on: issued_on || null,
      expires_on: expires_on || null,
      file_url: file_url || null,
      status: 'pending',
      created_at: new Date().toISOString()
    });
    res.json({ success:true, data:{ id: ref.key }});
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to add document' }});
  }
});

module.exports = router;