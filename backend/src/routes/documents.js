const express = require('express');
const { requireRole } = require('../middleware/auth');
const { getFirestore } = require('../config/firebase');

const router = express.Router();

// List pending docs (admin)
router.get('/pending', requireRole(['admin']), async (req, res) => {
  try {
    const db = getFirestore();
    const documentsCollection = db.collection('profile_documents');
    
    // Query for pending documents across all users
    const pendingSnapshot = await documentsCollection
      .where('status', '==', 'pending')
      .limit(100)
      .get();
    
    const pending = pendingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ success: true, data: { pending } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch pending documents' } });
  }
});

// Approve/reject a doc
router.post('/:uid/:docId/status', requireRole(['admin']), async (req, res) => {
  try {
    const { uid, docId } = req.params;
    const { status, reason } = req.body; // 'approved'|'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: { message: 'invalid status' } });
    }
    
    const db = getFirestore();
    const docRef = db.collection('profile_documents').doc(`${uid}_${docId}`);
    
    await docRef.set({
      status,
      reason: reason || null,
      reviewed_at: Date.now(),
      uid,
      docId
    }, { merge: true });
    
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Failed to update document status' } });
  }
});

module.exports = router;