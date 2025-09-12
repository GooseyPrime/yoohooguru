/**
 * Accessibility Toolbar
 * Provides accessibility options for Modified Masters users
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-280px'};
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.colors.surface || '#1a1a1a'};
  border-left: 2px solid ${props => props.theme.colors.primary || '#6c5ce7'};
  box-shadow: -4px 0 20px rgba(0,0,0,0.3);
  z-index: 1000;
  transition: right 0.3s ease;
  padding: 1rem;
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 50%;
  right: ${props => props.isOpen ? '280px' : '0'};
  transform: translateY(-50%);
  width: 50px;
  height: 80px;
  background: ${props => props.theme.colors.primary || '#6c5ce7'};
  border: none;
  border-radius: 8px 0 0 8px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 1001;
  transition: right 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover || '#5a4fcf'};
  }
  
  &:focus {
    outline: 3px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
`;

const ToolbarTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1.2rem;
`;

const OptionSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  font-size: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border || '#333333'};
  padding-bottom: 0.25rem;
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.active ? 
    (props.theme.colors.primary || '#6c5ce7') : 
    (props.theme.colors.backgroundSecondary || '#2a2a2a')};
  color: ${props => props.active ? 'white' : (props.theme.colors.text || '#ffffff')};
  border: 1px solid ${props => props.active ? 
    (props.theme.colors.primary || '#6c5ce7') : 
    (props.theme.colors.border || '#444444')};
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 
      (props.theme.colors.primaryHover || '#5a4fcf') : 
      (props.theme.colors.backgroundHover || '#3a3a3a')};
  }
  
  &:focus {
    outline: 3px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundHover || '#3a3a3a'};
    color: ${props => props.theme.colors.text || '#ffffff'};
  }
  
  &:focus {
    outline: 3px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
`;

const ACCESSIBILITY_OPTIONS = {
  fontSize: {
    title: 'Text Size',
    options: [
      { key: 'normal', label: 'Normal Text', className: '' },
      { key: 'large', label: 'Large Text', className: 'a11y-large-text' },
      { key: 'xlarge', label: 'Extra Large Text', className: 'a11y-xlarge-text' }
    ]
  },
  contrast: {
    title: 'Contrast',
    options: [
      { key: 'normal', label: 'Normal Contrast', className: '' },
      { key: 'high', label: 'High Contrast', className: 'a11y-high-contrast' }
    ]
  },
  motion: {
    title: 'Motion',
    options: [
      { key: 'normal', label: 'Normal Motion', className: '' },
      { key: 'reduced', label: 'Reduced Motion', className: 'a11y-reduced-motion' }
    ]
  },
  font: {
    title: 'Font',
    options: [
      { key: 'normal', label: 'Normal Font', className: '' },
      { key: 'dyslexia', label: 'Dyslexia-Friendly', className: 'a11y-dyslexia-font' }
    ]
  }
};

function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'normal',
    contrast: 'normal',
    motion: 'normal',
    font: 'normal'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('a11y-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.warn('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  // Apply CSS classes when settings change
  useEffect(() => {
    const body = document.body;
    
    // Remove all accessibility classes
    const allClasses = Object.values(ACCESSIBILITY_OPTIONS)
      .flatMap(section => section.options.map(opt => opt.className))
      .filter(className => className !== '');
    
    allClasses.forEach(className => {
      body.classList.remove(className);
    });

    // Add active accessibility classes
    Object.entries(settings).forEach(([category, value]) => {
      const option = ACCESSIBILITY_OPTIONS[category]?.options.find(opt => opt.key === value);
      if (option && option.className) {
        body.classList.add(option.className);
      }
    });

    // Save to localStorage
    localStorage.setItem('a11y-settings', JSON.stringify(settings));
  }, [settings]);

  const handleOptionChange = (category, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'normal',
      contrast: 'normal',
      motion: 'normal',
      font: 'normal'
    };
    setSettings(defaultSettings);
  };

  const toggleToolbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ToggleButton 
        onClick={toggleToolbar}
        isOpen={isOpen}
        aria-label={isOpen ? 'Close accessibility toolbar' : 'Open accessibility toolbar'}
        title="Accessibility Options"
      >
        ♿
      </ToggleButton>
      
      <ToolbarContainer isOpen={isOpen} role="dialog" aria-labelledby="a11y-title">
        <ToolbarTitle id="a11y-title">Accessibility Options</ToolbarTitle>
        
        {Object.entries(ACCESSIBILITY_OPTIONS).map(([category, config]) => (
          <OptionSection key={category}>
            <SectionTitle>{config.title}</SectionTitle>
            {config.options.map(option => (
              <OptionButton
                key={option.key}
                active={settings[category] === option.key}
                onClick={() => handleOptionChange(category, option.key)}
                aria-pressed={settings[category] === option.key}
              >
                {option.label}
              </OptionButton>
            ))}
          </OptionSection>
        ))}
        
        <ResetButton onClick={resetSettings}>
          Reset All Settings
        </ResetButton>
      </ToolbarContainer>
      
      {/* Invisible overlay to close toolbar when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AccessibilityToolbar;