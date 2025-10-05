
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import ComingSoon from '../../components/ComingSoon';
import Button from '../../components/Button';

export default function OnboardingStart() {
  const [status, setStatus] = useState();
  const [userType, setUserType] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const typeParam = searchParams.get('type');

  useEffect(() => {
    api('/onboarding/status').then(r => setStatus(r.data.step)).catch(()=>{});
  }, []);

  const row = (label, ok, href) => (
    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.5rem' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: ok ? '#10b981' : '#6b7280', fontSize: '1.25rem' }}>{ok ? '✓' : '○'}</span>
        {label}
      </span>
      <a href={href} style={{ textDecoration: 'none', color: 'var(--primary)' }}>
        {ok ? 'Review' : 'Complete'} →
      </a>
    </div>
  );

  const handleUserTypeSelection = async (type) => {
    setUserType(type);
    try {
      // Save user type to profile
      await api('/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userType: type,
          displayName: currentUser?.displayName || currentUser?.email?.split('@')[0] || '',
          photoUrl: currentUser?.photoURL || ''
        })
      });
      // Redirect to complete profile
      navigate('/onboarding/profile');
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };

  // Show user type selection if coming from Google signup
  if (typeParam === 'select' && !userType) {
    return (
      <div style={{maxWidth: '680px', margin: '0 auto', padding: '2rem'}}>
        <h1>Welcome to yoohoo.guru!</h1>
        <p>How do you plan to use yoohoo.guru?</p>
        
        <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
          <div 
            onClick={() => handleUserTypeSelection('skill_sharer')}
            style={{ 
              padding: '1.5rem', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              ':hover': { borderColor: '#7c8cff' }
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>👥 Skill Sharer</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              I want to learn new skills and share my expertise with others
            </p>
          </div>
          
          <div 
            onClick={() => handleUserTypeSelection('service_poster')}
            style={{ 
              padding: '1.5rem', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>💼 Service Provider</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              I want to offer professional services and build my business
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fixed: Move conditional return after all hooks are called
  if (!status) {
    return <div style={{padding: '2rem'}}>Loading…</div>;
  }

  return (
    <div style={{maxWidth: '680px', margin: '0 auto', padding: '2rem'}}>
      <h1>Become a Guru</h1>
      <p>Let&apos;s set up your YooHoo Guru profile and get you earning.</p>

      {row('Profile', status.profileComplete, '/onboarding/profile')}
      {row('Categories', status.categoriesComplete, '/onboarding/categories')}
      {row('Requirements', status.requirementsComplete, '/onboarding/requirements')}
      {row('Payout', status.payoutConnected, '/onboarding/payout')}
      <hr />
      {status.reviewReady ? <a href="/onboarding/review">Review & publish →</a> : <span>Complete previous steps</span>}
      <div style={{marginTop: '16px'}}>
        <small>Background checks <ComingSoon /></small>
      </div>
    </div>
  );
}
