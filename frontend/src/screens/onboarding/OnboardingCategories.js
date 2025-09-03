import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import featureFlags from '../../lib/featureFlags';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

function OnboardingCategories() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const flags = featureFlags.getAll(); // This is the unused variable that needs to be removed

  const categories = [
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'art', name: 'Arts & Crafts', icon: '🎨' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'cooking', name: 'Cooking', icon: '👨‍🍳' },
    { id: 'language', name: 'Languages', icon: '🗣️' }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    navigate('/onboarding/payout');
  };

  return (
    <Container theme={theme}>
      <Content>
        <Title theme={theme}>Select Your Interests</Title>
        <p>Choose categories that match your skills or learning interests.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              style={{
                padding: '1rem',
                border: selectedCategories.includes(category.id) ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedCategories.includes(category.id) ? 'var(--primary-light)' : 'var(--surface)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{category.icon}</div>
              <div>{category.name}</div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedCategories.length === 0}
          style={{
            padding: '1rem 2rem',
            background: selectedCategories.length > 0 ? 'var(--primary)' : 'var(--gray-400)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedCategories.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: '1rem'
          }}
        >
          Continue
        </button>
      </Content>
    </Container>
  );
}

export default OnboardingCategories;