import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function OnboardingRequirements() {
  const [needed, setNeeded] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=> {
    api('/onboarding/requirements')
      .then(({data}) => setNeeded(data.needed || []))
      .catch((err) => {
        console.error('Failed to load onboarding requirements:', err);
        setError('Failed to load requirements. Please try again later.');
      });
  }, []);

  const formatRequirements = (requirement) => {
    const parts = [];
    
    // Handle new compliance format
    if (requirement.required) {
      if (requirement.required.documents.includes('professional_license')) {
        parts.push('Professional License');
      }
      if (requirement.required.documents.includes('liability_insurance')) {
        parts.push(`General Liability ($${(requirement.required.insurance.minimumCoverage / 1000000).toFixed(1)}M)`);
      }
      if (requirement.required.documents.includes('auto_insurance')) {
        parts.push('Auto Insurance');
      }
      if (requirement.required.documents.includes('background_check')) {
        parts.push('Background Check');
      }
      if (requirement.required.documents.includes('first_aid_cert')) {
        parts.push('First Aid Certification');
      }
    }
    
    // Fallback to legacy format for backward compatibility
    if (parts.length === 0 && requirement.legacy) {
      if (requirement.legacy.requires_license) parts.push('License');
      if (requirement.legacy.requires_gl) parts.push('General Liability ($1M/$2M)');
      if (requirement.legacy.requires_auto_insurance) parts.push('Auto Insurance');
      if (requirement.legacy.requires_background_check) parts.push('Background Check');
    }
    
    return parts.length > 0 ? parts.join(', ') : 'No special documents required';
  };

  const getRiskBadge = (riskLevel) => {
    const styles = {
      high: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' },
      medium: { backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' },
      low: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }
    };
    
    return <span style={styles[riskLevel] || styles.low}>{riskLevel?.toUpperCase() || 'LOW'}</span>;
  };

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Requirements</h2>
      <p>Some categories need proof of license or insurance. Upload documents in the next step.</p>
      {error && (
        <div style={{color: 'red', marginBottom: '1rem'}}>
          {error}
        </div>
      )}
      <ul>
        {needed.map(requirement => (
          <li key={requirement.slug} style={{marginBottom: '16px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <strong>{requirement.name || requirement.slug}</strong>
              {getRiskBadge(requirement.riskLevel)}
            </div>
            <div style={{ color: '#374151', marginBottom: '8px' }}>
              <strong>Required:</strong> {formatRequirements(requirement)}
            </div>
            {(requirement.legacy?.notes || requirement.restrictions?.notes) && (
              <div style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '8px', fontStyle: 'italic'}}>
                Note: {requirement.legacy?.notes || requirement.restrictions?.notes}
              </div>
            )}
            {requirement.restrictions && (
              <div style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '4px'}}>
                {requirement.restrictions.minAge && `Min age: ${requirement.restrictions.minAge}. `}
                {requirement.restrictions.requiresWaiver && 'Liability waiver required. '}
                {requirement.restrictions.parentalConsentRequired && 'Parental consent required for minors.'}
              </div>
            )}
          </li>
        ))}
      </ul>
      <a href="/onboarding/documents" style={{color: 'var(--primary)', textDecoration: 'none'}}>
        Upload documents →
      </a>
    </div>
  );
}