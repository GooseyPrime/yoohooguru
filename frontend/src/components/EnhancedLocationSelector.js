/**
 * Enhanced Location Selector Component
 * Provides Google Maps autocomplete, zip code support, and GPS location request
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { MapPin, AlertCircle, Navigation, Search, Edit2 } from 'lucide-react';
import Button from './Button';
import logger from '../utils/logger';

const LocationContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--r-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.875rem;
  color: var(--text);
  min-width: 280px;
  overflow: hidden;
  transition: all 0.2s ease;
  z-index: 100;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    margin-bottom: 1rem;
    min-width: auto;
    width: 100%;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const LocationHeader = styled.div`
  padding: 0.875rem 1rem;
  background: var(--pri);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;

  .location-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .change-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: var(--r-sm);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const LocationBody = styled.div`
  padding: 1rem;
  display: ${props => props.isExpanded ? 'block' : 'none'};
`;

const LoadingState = styled.div`
  padding: 0.875rem 1rem;
  background: var(--surface);
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border);
    border-top: 2px solid var(--pri);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--warning);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
`;

const FormSection = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text);
    font-size: 0.875rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 0.5rem;

  input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    padding-left: ${props => props.hasIcon ? '2.25rem' : '0.75rem'};
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    font-size: 0.875rem;
    background: var(--surface);
    color: var(--text);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--pri);
      box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
    }

    &::placeholder {
      color: var(--muted);
    }
  }

  .input-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }
`;

const FlexRow = styled.div`
  display: flex;
  gap: 0.5rem;

  > * {
    flex: 1;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const GPSButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  color: var(--text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;

  &:hover {
    background: var(--hover);
    border-color: var(--pri);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function EnhancedLocationSelector({ 
  location, 
  onLocationChange, 
  onLocationError,
  autoRequestGPS = true 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.address_components) return;

    const components = place.address_components;
    const newFormData = {
      address: place.formatted_address || '',
      city: '',
      state: '',
      zipCode: ''
    };

    components.forEach(component => {
      const types = component.types;
      if (types.includes('locality')) {
        newFormData.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        newFormData.state = component.short_name;
      } else if (types.includes('postal_code')) {
        newFormData.zipCode = component.long_name;
      }
    });

    setFormData(newFormData);
    
    // Auto-submit if we have city and state
    if (newFormData.city && newFormData.state) {
      const locationString = `${newFormData.city}, ${newFormData.state}`;
      onLocationChange(locationString, newFormData);
      setIsExpanded(false);
      setError('');
    }
  }, [onLocationChange]);

  const initializeAutocomplete = useCallback(() => {
    if (!addressInputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry']
      }
    );

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  }, [handlePlaceSelect]);

  // Load Google Maps API and initialize autocomplete
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadGoogleMaps();
  }, [initializeAutocomplete]);

  const requestGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by this browser.';
      setError(errorMsg);
      onLocationError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          const locationData = {
            address: data.locality ? `${data.locality}, ${data.principalSubdivision}` : '',
            city: data.city || data.locality || '',
            state: data.principalSubdivision || '',
            zipCode: data.postcode || ''
          };

          setFormData(locationData);
          
          if (locationData.city && locationData.state) {
            const locationString = `${locationData.city}, ${locationData.state}`;
            onLocationChange(locationString, locationData);
          }
          
          setIsLoading(false);
        } catch (err) {
          logger.error('Error reverse geocoding:', err);
          setError('Could not determine location details.');
          onLocationError?.('Could not determine location details.');
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Location access unavailable';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        
        setError(errorMessage);
        onLocationError?.(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }, [onLocationChange, onLocationError]);

  // Auto-request GPS on mount if enabled and no location set
  useEffect(() => {
    if (autoRequestGPS && !location) {
      requestGPSLocation();
    }
  }, [autoRequestGPS, location, requestGPSLocation]);

  const handleManualSubmit = useCallback(() => {
    if (!formData.city.trim() && !formData.zipCode.trim()) {
      setError('Please enter at least a city or zip code.');
      return;
    }

    let locationString = '';
    if (formData.city && formData.state) {
      locationString = `${formData.city}, ${formData.state}`;
    } else if (formData.zipCode) {
      locationString = formData.zipCode;
    } else {
      locationString = formData.city;
    }

    onLocationChange(locationString, formData);
    setIsExpanded(false);
    setError('');
  }, [formData, onLocationChange]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (isLoading) {
    return (
      <LocationContainer>
        <LoadingState>
          <div className="spinner" />
          Getting your location...
        </LoadingState>
      </LocationContainer>
    );
  }

  return (
    <LocationContainer>
      {error && (
        <ErrorState>
          <AlertCircle size={14} />
          {error}
        </ErrorState>
      )}
      
      <LocationHeader>
        <div className="location-info">
          <MapPin size={16} />
          {location || 'Set Your Location'}
        </div>
        <button 
          className="change-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Edit2 size={12} />
        </button>
      </LocationHeader>

      <LocationBody isExpanded={isExpanded}>
        <FormSection>
          <label htmlFor="address-input">Address or Location</label>
          <InputWrapper hasIcon>
            <Search className="input-icon" size={16} />
            <input
              id="address-input"
              ref={addressInputRef}
              type="text"
              placeholder="Start typing an address..."
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </InputWrapper>
        </FormSection>

        <FormSection>
          <FlexRow>
            <div>
              <label htmlFor="city-input">City</label>
              <input
                id="city-input"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="state-input">State</label>
              <input
                id="state-input"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
          </FlexRow>
        </FormSection>

        <FormSection>
          <label htmlFor="zip-input">ZIP Code</label>
          <input
            id="zip-input"
            type="text"
            placeholder="12345"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
          />
        </FormSection>

        <ActionButtons>
          <GPSButton onClick={requestGPSLocation} disabled={isLoading}>
            <Navigation size={14} />
            Use My Location
          </GPSButton>
          <Button 
            variant="primary" 
            onClick={handleManualSubmit}
            disabled={!formData.city.trim() && !formData.zipCode.trim()}
          >
            Set Location
          </Button>
        </ActionButtons>
      </LocationBody>
    </LocationContainer>
  );
}

export default EnhancedLocationSelector;