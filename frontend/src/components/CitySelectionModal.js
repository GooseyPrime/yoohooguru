import React, { useState } from 'react';
import styled from 'styled-components';
import { MapPin, Search, X } from 'lucide-react';
import Button from './Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: var(--surface);
  border-radius: var(--r-xl);
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: var(--text-xl);
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    background: none;
    border: none;
    color: var(--muted);
    font-size: var(--text-lg);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--r-md);
    
    &:hover {
      background: var(--hover);
      color: var(--text);
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const SearchSection = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text);
  }
  
  .search-input-wrapper {
    position: relative;
    
    input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      font-size: 1rem;
      background: var(--surface);
      color: var(--text);
      
      &:focus {
        outline: none;
        border-color: var(--pri);
        box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
      }
    }
    
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
    }
  }
`;

const PopularCities = styled.div`
  h3 {
    font-size: var(--text-md);
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--text);
  }
`;

const CityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CityButton = styled.button`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover);
    border-color: var(--pri);
  }
  
  &:focus {
    outline: none;
    border-color: var(--pri);
    box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`;

const POPULAR_CITIES = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC'
];

function CitySelectionModal({ isOpen, onClose, onSelectCity }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Fixed: Move conditional return after all hooks are called
  if (!isOpen) {
    return null;
  }

  const filteredCities = POPULAR_CITIES.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city) => {
    onSelectCity(city);
    onClose();
  };

  const handleCustomSubmit = () => {
    if (customCity.trim()) {
      onSelectCity(customCity.trim());
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <h2>
            <MapPin size={20} />
            Select Your Location
          </h2>
          <button onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <SearchSection>
            <label htmlFor="custom-city">Enter Your City</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={16} />
              <input
                id="custom-city"
                type="text"
                placeholder="Enter city, state (e.g., Boston, MA)"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                autoComplete="address-level2"
              />
            </div>
          </SearchSection>

          <PopularCities>
            <h3>Popular Cities</h3>
            <div className="search-input-wrapper" style={{ marginBottom: '1rem' }}>
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search popular cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <CityGrid>
              {filteredCities.slice(0, 12).map((city) => (
                <CityButton
                  key={city}
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </CityButton>
              ))}
            </CityGrid>
          </PopularCities>

          <ActionButtons>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCustomSubmit}
              disabled={!customCity.trim()}
            >
              Set Location
            </Button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CitySelectionModal;