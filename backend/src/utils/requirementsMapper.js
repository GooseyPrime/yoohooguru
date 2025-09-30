// Utility to map between old requirement system and new compliance system
// This provides backward compatibility while enabling migration to the new system

/**
 * Maps old category slugs to new compliance categories
 * Multiple old categories can map to the same compliance category
 */
const CATEGORY_MAPPING = {
  // Education & Training categories
  'tutoring': 'tutoring',
  'music': 'tutoring', // Music lessons have similar requirements to tutoring
  'fitness': 'physical-training',
  
  // Service categories
  'handyman': 'construction',
  'cleaning': 'arts-crafts', // Low risk cleaning maps to low risk category
  'yard-farm': 'construction', // Physical work with tools/equipment
  'moving-help': 'physical-training', // Physical activity
  'errands': 'arts-crafts', // Low risk
  
  // Licensed categories (coming soon)
  'electrical': 'construction',
  'plumbing': 'construction',
  'hvac': 'construction',
  'tree-work': 'construction',
  'transport': 'automotive'
};

/**
 * Converts old-style requirements to new compliance format
 */
function convertLegacyRequirements(oldRequirements) {
  const newRequirements = {
    profile: ['displayName', 'bio', 'location'],
    documents: [],
    badges: [],
    verification: [],
    insurance: {
      types: [],
      minimumCoverage: 0
    }
  };

  // Map old requirement flags to new structure
  if (oldRequirements.requires_license) {
    newRequirements.documents.push('professional_license');
    newRequirements.verification.push('license_verification');
    newRequirements.badges.push('licensed-professional');
  }

  if (oldRequirements.requires_gl) {
    newRequirements.documents.push('liability_insurance');
    newRequirements.insurance.types.push('general_liability');
    newRequirements.insurance.minimumCoverage = Math.max(
      newRequirements.insurance.minimumCoverage,
      oldRequirements.min_gl_per_occurrence_cents / 100 || 1000000
    );
    newRequirements.badges.push('insured-provider');
  }

  if (oldRequirements.requires_auto_insurance) {
    newRequirements.documents.push('auto_insurance');
    newRequirements.insurance.types.push('auto_liability');
    newRequirements.insurance.minimumCoverage = Math.max(
      newRequirements.insurance.minimumCoverage,
      500000
    );
  }

  if (oldRequirements.requires_background_check) {
    newRequirements.documents.push('background_check');
    newRequirements.verification.push('background_check');
    newRequirements.badges.push('background-verified');
  }

  return newRequirements;
}

/**
 * Determines risk level based on old requirements
 */
function inferRiskLevel(oldRequirements) {
  if (oldRequirements.requires_license) return 'high';
  if (oldRequirements.requires_gl || oldRequirements.requires_background_check) return 'medium';
  return 'low';
}

/**
 * Creates unified requirements that work with both systems
 */
function createUnifiedRequirements(categorySlug, oldRequirements, complianceRequirements) {
  // If we have compliance requirements, use them as the authoritative source
  if (complianceRequirements) {
    return {
      slug: categorySlug,
      name: complianceRequirements.name,
      riskLevel: complianceRequirements.riskLevel,
      required: complianceRequirements.required,
      restrictions: complianceRequirements.restrictions || {},
      // Include legacy fields for backward compatibility
      legacy: {
        requires_license: oldRequirements?.requires_license || false,
        requires_gl: oldRequirements?.requires_gl || false,
        requires_auto_insurance: oldRequirements?.requires_auto_insurance || false,
        requires_background_check: oldRequirements?.requires_background_check || false,
        notes: oldRequirements?.notes || null
      }
    };
  }

  // If no compliance requirements, convert from old system
  if (oldRequirements) {
    return {
      slug: categorySlug,
      name: categorySlug, // Will need to be improved with proper category names
      riskLevel: inferRiskLevel(oldRequirements),
      required: convertLegacyRequirements(oldRequirements),
      restrictions: {
        minAge: oldRequirements.requires_license ? 18 : 16,
        requiresWaiver: oldRequirements.requires_gl || oldRequirements.requires_license
      },
      legacy: oldRequirements
    };
  }

  // Default fallback
  return {
    slug: categorySlug,
    name: categorySlug,
    riskLevel: 'low',
    required: {
      profile: ['displayName', 'bio', 'location'],
      documents: [],
      badges: [],
      verification: [],
      insurance: { types: [], minimumCoverage: 0 }
    },
    restrictions: { minAge: 16, requiresWaiver: false },
    legacy: { requires_license: false, requires_gl: false, requires_auto_insurance: false, requires_background_check: false }
  };
}

/**
 * Gets the mapped compliance category for an old category slug
 */
function getComplianceCategory(oldCategorySlug) {
  return CATEGORY_MAPPING[oldCategorySlug] || null;
}

module.exports = {
  CATEGORY_MAPPING,
  convertLegacyRequirements,
  inferRiskLevel,
  createUnifiedRequirements,
  getComplianceCategory
};