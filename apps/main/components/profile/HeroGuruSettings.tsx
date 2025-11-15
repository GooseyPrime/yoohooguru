import { useState, useEffect } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
`;

const SettingsHeader = styled.h3`
  color: #10b981;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ToggleInfo = styled.div`
  flex: 1;
`;

const ToggleTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const ToggleDescription = styled.p`
  color: #b0b0b0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin-left: 1rem;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #10b981;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #555;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const AccommodationsSection = styled.div`
  margin-top: 1.5rem;
`;

const AccommodationsTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const AccommodationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const AccommodationCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  input {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  span {
    color: #b0b0b0;
    font-size: 0.95rem;
  }
`;

const SaveButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  border: none;
  background: #10b981;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1.5rem;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background: ${props => props.type === 'success' ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  border: 1px solid ${props => props.type === 'success' ? '#51cf66' : '#ff6b6b'};
  color: ${props => props.type === 'success' ? '#51cf66' : '#ff6b6b'};
`;

const AVAILABLE_ACCOMMODATIONS = [
  'Screen reader compatible',
  'Closed captions available',
  'ASL interpretation',
  'Large text/high contrast',
  'Flexible pacing',
  'Written materials provided',
  'Audio descriptions',
  'Wheelchair accessible (in-person)',
  'Sensory-friendly environment',
  'Cognitive accessibility support',
  'Alternative communication methods',
  'Extended time for responses'
];

export default function HeroGuruSettings() {
  const [provideFreeServices, setProvideFreeServices] = useState(false);
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Load current preferences
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/backend/hero-gurus/preferences');
        if (response.ok) {
          const data = await response.json();
          setProvideFreeServices(data.data.provideFreeServices || false);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const handleToggle = () => {
    setProvideFreeServices(!provideFreeServices);
  };

  const handleAccommodationToggle = (accommodation: string) => {
    setSelectedAccommodations(prev => {
      if (prev.includes(accommodation)) {
        return prev.filter(a => a !== accommodation);
      } else {
        return [...prev, accommodation];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Save Hero Guru preferences
      const prefsResponse = await fetch('/api/backend/hero-gurus/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provideFreeServices,
        }),
      });

      if (!prefsResponse.ok) {
        throw new Error('Failed to save preferences');
      }

      // Save accommodations to profile
      const profileResponse = await fetch('/api/backend/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heroGuruAccommodations: selectedAccommodations,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to save accommodations');
      }

      setMessage({
        type: 'success',
        text: 'Hero Guru settings saved successfully!',
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <span>❤️</span>
        <span>Hero Guru Settings</span>
      </SettingsHeader>

      <ToggleSection>
        <ToggleInfo>
          <ToggleTitle>Provide Free Sessions</ToggleTitle>
          <ToggleDescription>
            Enable this to offer free sessions to learners with disabilities through the Hero Gurus program.
            You can turn this on or off at any time based on your availability.
          </ToggleDescription>
        </ToggleInfo>
        <ToggleSwitch>
          <ToggleInput
            type="checkbox"
            checked={provideFreeServices}
            onChange={handleToggle}
          />
          <ToggleSlider />
        </ToggleSwitch>
      </ToggleSection>

      {provideFreeServices && (
        <AccommodationsSection>
          <AccommodationsTitle>
            Available Accommodations
          </AccommodationsTitle>
          <p style={{ color: '#b0b0b0', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Select the accommodations you can provide for your free Hero Guru sessions:
          </p>
          <AccommodationsGrid>
            {AVAILABLE_ACCOMMODATIONS.map((accommodation) => (
              <AccommodationCheckbox key={accommodation}>
                <input
                  type="checkbox"
                  checked={selectedAccommodations.includes(accommodation)}
                  onChange={() => handleAccommodationToggle(accommodation)}
                />
                <span>{accommodation}</span>
              </AccommodationCheckbox>
            ))}
          </AccommodationsGrid>
        </AccommodationsSection>
      )}

      <SaveButton onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Hero Guru Settings'}
      </SaveButton>

      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}
    </SettingsContainer>
  );
}