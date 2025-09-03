import React, { useState } from 'react';
import { api } from '../../lib/api';
import Button from '../../components/Button';

export default function OnboardingProfile() {
  const [form, setForm] = useState({
    displayName: '',
    photoUrl: '',
    city: '',
    zip: '',
    bio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/onboarding/profile', { 
        method: 'POST', 
        body: JSON.stringify(form)
      });
      window.location.href = '/onboarding/categories';
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Complete Your Profile</h2>
      <p>Tell your community about yourself and what makes you a great guru.</p>
      
      <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
        <label>
          Display Name *
          <input 
            type="text" 
            value={form.displayName} 
            onChange={handleChange('displayName')}
            required
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          Photo URL
          <input 
            type="url" 
            value={form.photoUrl} 
            onChange={handleChange('photoUrl')}
            placeholder="https://example.com/your-photo.jpg"
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          City *
          <input 
            type="text" 
            value={form.city} 
            onChange={handleChange('city')}
            required
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          ZIP Code *
          <input 
            type="text" 
            value={form.zip} 
            onChange={handleChange('zip')}
            required
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          Bio *
          <textarea 
            value={form.bio} 
            onChange={handleChange('bio')}
            required
            rows={4}
            placeholder="Tell people about your experience and what you love to teach..."
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px', resize: 'vertical'}}
          />
        </label>
        
        <Button type="submit" variant="primary" style={{marginTop: '1rem'}}>
          Continue to Categories
        </Button>
      </form>
    </div>
  );
}