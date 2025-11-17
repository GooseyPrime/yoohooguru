// Demo endpoint to showcase the unified requirements system
const express = require('express');
const { createUnifiedRequirements, getComplianceCategory } = require('../utils/requirementsMapper');
const { COMPLIANCE_REQUIREMENTS } = require('../config/complianceRequirements');

const router = express.Router();

// Sample legacy requirements to demonstrate the system
const SAMPLE_LEGACY_REQUIREMENTS = {
  'tutoring': { requires_license: false, requires_gl: false, requires_background_check: false, notes: 'Guardian present for minors (MVP).' },
  'handyman': { requires_license: false, requires_gl: true, min_gl_per_occurrence_cents: 100000000, min_gl_aggregate_cents: 200000000, notes: 'No gas, roofing, or structural work.' },
  'fitness': { requires_license: false, requires_gl: false, requires_background_check: false, recommends: ['CPR/First Aid', 'PT cert (NASM/ACE)'] },
  'electrical': { requires_license: true, requires_gl: true, min_gl_per_occurrence_cents: 100000000, min_gl_aggregate_cents: 200000000 },
  'cleaning': { requires_license: false, requires_gl: false, notes: 'No mold/biohazard.' }
};

// @desc    Demo endpoint showing unified requirements for selected categories
// @route   GET /api/demo/unified-requirements
// @access  Public
router.get('/unified-requirements', (req, res) => {
  try {
    const selectedCategories = ['tutoring', 'handyman', 'fitness', 'electrical', 'cleaning'];
    
    const unifiedRequirements = selectedCategories.map(slug => {
      const legacyRequirements = SAMPLE_LEGACY_REQUIREMENTS[slug] || {};
      
      // Try to find corresponding compliance requirements
      const complianceCategory = getComplianceCategory(slug);
      const complianceRequirements = complianceCategory ? COMPLIANCE_REQUIREMENTS[complianceCategory] : null;
      
      // Create unified requirements that work with both systems
      return createUnifiedRequirements(slug, legacyRequirements, complianceRequirements);
    });

    res.json({
      success: true,
      data: {
        description: 'Unified Requirements System Demo - Bridging Legacy and New Compliance Systems',
        selectedCategories,
        unifiedRequirements,
        explanation: {
          system: 'This demonstrates how the unified requirements system bridges the old simple flag-based requirements with the new detailed compliance system',
          benefits: [
            'Backward compatibility: Old categories still work',
            'Enhanced information: Risk levels, detailed requirements, restrictions',
            'Consistent user experience: All categories show the same rich information format',
            'Easy migration: Gradual transition from old to new system'
          ]
        }
      }
    });

  } catch {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate unified requirements demo' }
    });
  }
});

module.exports = router;