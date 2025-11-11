import { useState, useEffect } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #b0b0b0;
  background: rgba(0, 0, 0, 0.2);
`;

const MapIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const LocationSearch = styled.div`
  max-width: 500px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: #667eea;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #5a6fd8;
  }
`;

interface GoogleMapProps {
  apiKey: string;
  location?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

export default function GoogleMap({ apiKey, onLocationSelect }: Omit<GoogleMapProps, 'location'>) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapError] = useState(false);
  
  useEffect(() => {
    // In a real implementation, this would load the Google Maps API
    // For now, we'll just simulate the loading process
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [apiKey]);
  
  const handleSearch = () => {
    if (!searchQuery) return;
    
    // In a real implementation, this would use the Google Maps Geocoding API
    // to convert the search query to coordinates
    console.log('Searching for location:', searchQuery);
    
    // Mock location data
    const mockLocation = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    };
    
    if (onLocationSelect) {
      onLocationSelect(mockLocation);
    }
  };
  
  const handleCurrentLocation = () => {
    // In a real implementation, this would use the browser's geolocation API
    console.log('Getting current location');
    
    // Mock current location
    const mockLocation = {
      lat: 40.7128,
      lng: -74.0060
    };
    
    if (onLocationSelect) {
      onLocationSelect(mockLocation);
    }
  };
  
  return (
    <div>
      <LocationSearch>
        <SearchInput
          type="text"
          placeholder="Search for a location (e.g., New York, NY)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search Location</SearchButton>
        <SearchButton onClick={handleCurrentLocation}>Use Current Location</SearchButton>
      </LocationSearch>
      
      <MapContainer>
        {mapError ? (
          <MapPlaceholder>
            <MapIcon>📍</MapIcon>
            <div>Failed to load map. Please check your API key.</div>
          </MapPlaceholder>
        ) : !mapLoaded ? (
          <MapPlaceholder>
            <MapIcon>🌍</MapIcon>
            <div>Loading map...</div>
          </MapPlaceholder>
        ) : (
          <MapPlaceholder>
            <MapIcon>🗺️</MapIcon>
            <div>Google Maps integration ready</div>
            <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#667eea'}}>
              In a real implementation, this would show an interactive Google Map
            </div>
          </MapPlaceholder>
        )}
      </MapContainer>
    </div>
  );
}