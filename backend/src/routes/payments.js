const express = require('express');
const router = express.Router();

// Placeholder routes for payments
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: { message: 'Payments endpoint - Coming soon' }
  });
});

module.exports = router;