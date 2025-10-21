import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import ComingSoon from '../../components/ComingSoon';
import Button from '../../components/Button';

// Interest card component for dual-role selection
function InterestCard({ wantsToTeach, wantsToLearn, onSelect, highlighted = false }) {
  const getTitle = () => {
    if (wantsToTeach && wantsToLearn) return '🌟 Both Teacher & Learner';
    if (wantsToTeach) return '👨‍🏫 Teach & Share Skills';
    return '🎓 Learn & Find Services';
  };
  
  const getDescription = () => {
    if (wantsToTeach && wantsToLearn) {
      return 'The full experience! Teach what you know and learn from others.';
    }
    if (wantsToTeach) {
      return 'Become a guru, offer services, and earn money teaching others.';
    }
    return 'Discover local experts, learn new skills, and hire professionals.';
  };
  
  return (
    <div 
      onClick={() => onSelect(wantsToTeach, wantsToLearn)}
      style={{ 
        padding: '1.5rem', 
        border: highlighted ? '3px solid #7c8cff' : '2px solid #e5e7eb',
        borderRadius: '12px', 
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: highlighted ? 'rgba(124, 140, 255, 0.05)' : 'white',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#7c8cff';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = highlighted ? '#7c8cff' : '#e5e7eb';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {highlighted && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#7c8cff',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          MOST POPULAR
        </div>
      )}
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{getTitle()}</h3>
      <p style={{ margin: 0, color: '#6b7280', lineHeight: '1.5' }}>
        {getDescription()}
      </p>
    </div>
  );
}

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

  const handleUserTypeSelection = async (wantsToTeach, wantsToLearn) => {
    try {
      // Save user interests to profile
      await api('/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          wantsToTeach,
          wantsToLearn,
          displayName: currentUser?.displayName || currentUser?.email?.split('@')[0] || '',
          photoUrl: currentUser?.photoURL || ''
        })
      });
      
      // Redirect based on their teaching interest
      if (wantsToTeach) {
        navigate('/onboarding/profile');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving user interests:', error);
    }
  };

  // Show user type selection if coming from Google signup
  if (typeParam === 'select' && !userType) {
    return (
      <div style={{maxWidth: '680px', margin: '0 auto', padding: '2rem'}}>
        <h1>Welcome to yoohoo.guru!</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          What would you like to do on yoohoo.guru? <strong>You can choose both!</strong>
        </p>
        
        <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
          <InterestCard 
            wantsToTeach={true} 
            wantsToLearn={false}
            onSelect={handleUserTypeSelection}
          />
          
          <InterestCard 
            wantsToTeach={false} 
            wantsToLearn={true}
            onSelect={handleUserTypeSelection}
          />
          
          <InterestCard 
            wantsToTeach={true} 
            wantsToLearn={true}
            onSelect={handleUserTypeSelection}
            highlighted={true}
          />
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
