import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ComingSoon from '../../components/ComingSoon';
import Button from '../../components/Button';

export default function OnboardingCategories() {
  const [cats, setCats] = useState([]);
  const [picks, setPicks] = useState({});

  useEffect(() => {
    // Load categories from Firebase (using the seeded data)
    }).catch((error) => {
      console.error('Failed to load feature flags:', error);
    });
    
    // Load existing selections
    api('/onboarding/status').then(({data})=>{
      setPicks(data.picks || {});
    }).catch(()=>{});
    
    // Load categories - we'll use a simple hardcoded list for MVP since seedCategories creates them
    // In production, you'd fetch from /api/categories endpoint
    setCats([
      { slug: 'tutoring', name: 'Tutoring & Lessons', class: 'E' },
      { slug: 'music', name: 'Music Lessons', class: 'E' },
      { slug: 'fitness', name: 'Personal Training', class: 'E' },
      { slug: 'handyman', name: 'Handyman (basic)', class: 'B' },
      { slug: 'cleaning', name: 'Cleaning (non-bio)', class: 'F' },
      { slug: 'yard-farm', name: 'Yard & Farm (non-mechanical)', class: 'B' },
      { slug: 'moving-help', name: 'Moving Help (no truck)', class: 'A' },
      { slug: 'errands', name: 'Errands & Organizing', class: 'A' },
      { slug: 'electrical', name: 'Electrical (licensed)', class: 'C', comingSoon: true },
      { slug: 'plumbing', name: 'Plumbing (licensed)', class: 'C', comingSoon: true },
      { slug: 'hvac', name: 'HVAC (licensed)', class: 'C', comingSoon: true },
      { slug: 'tree-work', name: 'Tree Work (higher risk)', class: 'C', comingSoon: true },
      { slug: 'transport', name: 'Transport/Hauling (provider vehicle)', class: 'D', comingSoon: true },
    ]);
  }, []);

  const toggle = (slug) => setPicks(prev => ({ ...prev, [slug]: prev[slug] ? undefined : { selectedAt: Date.now() } }));

  const save = async () => {
    try {
      const chosen = Object.keys(picks).filter(k => !!picks[k]);
      await api('/onboarding/categories', { method:'POST', body: JSON.stringify({ categories: chosen })});
      window.location.href = '/onboarding/requirements';
    } catch (error) {
      alert('Error saving categories: ' + error.message);
    }
  };

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Choose what you offer</h2>
      <p>Select all that apply. Items marked <ComingSoon /> are not yet open for booking.</p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px'}}>
        {cats.map(c => (
          <label key={c.slug} style={{border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <input 
              type="checkbox" 
              checked={!!picks[c.slug]} 
              onChange={() => toggle(c.slug)} 
            />
            <span style={{flex: 1}}>
              {c.name} {c.comingSoon && <ComingSoon />}
            </span>
          </label>
        ))}
      </div>
      <Button onClick={save} variant="primary" style={{marginTop: '16px'}}>
        Continue
      </Button>
    </div>
  );
}