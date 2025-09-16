/**
 * Location Map Component
 * Interactive Google Maps for tagging local entries
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
  position: relative;
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  gap: 8px;
  z-index: 100;
`;

const ControlButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }

  &.active {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }
`;

const LocationInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const TagModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 300px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const TagInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const TagSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
`;

function LocationMap({ 
  center = { lat: 39.8283, lng: -98.5795 }, // Center of US
  markers = [], 
  onLocationSelect,
  onTagLocation,
  allowTagging = false,
  category = 'skillshare' 
}) {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [tagData, setTagData] = useState({ title: '', category: category, description: '' });
  const [viewMode, setViewMode] = useState('roadmap'); // roadmap, satellite, hybrid
  
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 10,
        mapTypeId: viewMode,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Add click listener for tagging
      if (allowTagging) {
        googleMap.addListener('click', (event) => {
          setSelectedPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          });
          setShowTagModal(true);
        });
      }

      setMap(googleMap);
    }
  }, [isLoaded, center, map, allowTagging, viewMode]);

  // Update markers
  useEffect(() => {
    if (map && window.google) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: map,
          title: markerData.title || 'Location',
          icon: getMarkerIcon(markerData.category || category)
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 4px 0; color: #333;">${markerData.title || 'Location'}</h4>
              <p style="margin: 0; color: #666; font-size: 0.9rem;">${markerData.description || ''}</p>
              ${markerData.category ? `<span style="background: #4CAF50; color: white; padding: 2px 6px; border-radius: 12px; font-size: 0.8rem; margin-top: 4px; display: inline-block;">${markerData.category}</span>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          if (onLocationSelect) {
            onLocationSelect(markerData);
          }
        });

        markersRef.current.push(marker);
      });
    }
  }, [map, markers, category, onLocationSelect]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(userLocation);
          
          if (map) {
            map.setCenter(userLocation);
            map.setZoom(12);
            
            // Add current location marker
            new window.google.maps.Marker({
              position: userLocation,
              map: map,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2
              }
            });
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, [map]);

  const getMarkerIcon = (markerCategory) => {
    const iconColors = {
      skillshare: '#4CAF50',
      handyman: '#FF9800',
      modified: '#9C27B0',
      default: '#2196F3'
    };

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: iconColors[markerCategory] || iconColors.default,
      fillOpacity: 0.8,
      strokeColor: 'white',
      strokeWeight: 2
    };
  };

  const changeMapType = (type) => {
    setViewMode(type);
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleTagSubmit = () => {
    if (selectedPosition && tagData.title && onTagLocation) {
      onTagLocation({
        ...selectedPosition,
        ...tagData,
        timestamp: Date.now()
      });
    }
    setShowTagModal(false);
    setTagData({ title: '', category: category, description: '' });
    setSelectedPosition(null);
  };

  const handleTagCancel = () => {
    setShowTagModal(false);
    setTagData({ title: '', category: category, description: '' });
    setSelectedPosition(null);
  };

  if (!isLoaded) {
    return (
      <MapContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          color: '#666' 
        }}>
          Loading map...
        </div>
      </MapContainer>
    );
  }

  return (
    <MapContainer>
      <MapElement ref={mapRef} />
      
      <MapControls>
        <ControlButton 
          className={viewMode === 'roadmap' ? 'active' : ''}
          onClick={() => changeMapType('roadmap')}
        >
          Map
        </ControlButton>
        <ControlButton 
          className={viewMode === 'satellite' ? 'active' : ''}
          onClick={() => changeMapType('satellite')}
        >
          Satellite
        </ControlButton>
        <ControlButton 
          className={viewMode === 'hybrid' ? 'active' : ''}
          onClick={() => changeMapType('hybrid')}
        >
          Hybrid
        </ControlButton>
        <ControlButton onClick={getCurrentLocation}>
          📍 My Location
        </ControlButton>
      </MapControls>

      {currentLocation && (
        <LocationInfo>
          Current location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
        </LocationInfo>
      )}

      {showTagModal && (
        <>
          <Overlay onClick={handleTagCancel} />
          <TagModal>
            <h3 style={{ margin: '0 0 16px 0' }}>Tag Location</h3>
            <TagInput
              type="text"
              placeholder="Location title"
              value={tagData.title}
              onChange={(e) => setTagData({ ...tagData, title: e.target.value })}
            />
            <TagSelect
              value={tagData.category}
              onChange={(e) => setTagData({ ...tagData, category: e.target.value })}
            >
              <option value="skillshare">Skill Share</option>
              <option value="handyman">Handyman</option>
              <option value="modified">Modified Masters</option>
              <option value="event">Community Event</option>
            </TagSelect>
            <TagInput
              type="text"
              placeholder="Description (optional)"
              value={tagData.description}
              onChange={(e) => setTagData({ ...tagData, description: e.target.value })}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleTagCancel}
                style={{ 
                  padding: '8px 16px', 
                  border: '1px solid #ddd', 
                  background: 'white', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleTagSubmit}
                style={{ 
                  padding: '8px 16px', 
                  border: 'none', 
                  background: '#4CAF50', 
                  color: 'white', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={!tagData.title}
              >
                Tag Location
              </button>
            </div>
          </TagModal>
        </>
      )}
    </MapContainer>
  );
}

export default LocationMap;