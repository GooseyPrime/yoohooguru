'use client';

/// <reference types="@googlemaps/types" />

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Declare google namespace for TypeScript
declare const google: typeof globalThis.google;

// Types for markers
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category?: string;
  type: 'guru' | 'gig' | 'skill';
  rating?: number;
  hourlyRate?: number;
  imageUrl?: string;
  skills?: string[];
  href?: string;
}

export interface SearchableMapProps {
  // Map configuration
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  height?: string;

  // Markers
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;

  // Search & filters
  searchRadius?: number; // in miles
  onRadiusChange?: (radius: number) => void;
  onCenterChange?: (center: { lat: number; lng: number }) => void;
  onBoundsChange?: (bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } }) => void;

  // UI customization
  showSearch?: boolean;
  showRadiusControl?: boolean;
  showCurrentLocation?: boolean;
  placeholder?: string;
  className?: string;

  // Map type
  mapType?: 'gurus' | 'gigs' | 'all';
}

// Marker colors by type
const MARKER_COLORS = {
  guru: '#10B981', // emerald-500
  gig: '#3B82F6',  // blue-500
  skill: '#8B5CF6', // purple-500
};

// Radius options in miles
const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

export default function SearchableMap({
  initialCenter = { lat: 39.8283, lng: -98.5795 }, // Center of US
  initialZoom = 4,
  height = '500px',
  markers = [],
  onMarkerClick,
  searchRadius = 25,
  onRadiusChange,
  onCenterChange,
  onBoundsChange,
  showSearch = true,
  showRadiusControl = true,
  showCurrentLocation = true,
  placeholder = 'Search location...',
  className = '',
  mapType = 'all',
}: SearchableMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState(initialCenter);
  const [radius, setRadius] = useState(searchRadius);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError('Google Maps API key is not configured');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load Google Maps');
      });
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center,
      zoom: initialZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
    infoWindowRef.current = new google.maps.InfoWindow();

    // Add event listeners
    mapInstanceRef.current.addListener('center_changed', () => {
      const newCenter = mapInstanceRef.current?.getCenter();
      if (newCenter) {
        const centerObj = { lat: newCenter.lat(), lng: newCenter.lng() };
        setCenter(centerObj);
        onCenterChange?.(centerObj);
      }
    });

    mapInstanceRef.current.addListener('bounds_changed', () => {
      const bounds = mapInstanceRef.current?.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        onBoundsChange?.({
          ne: { lat: ne.lat(), lng: ne.lng() },
          sw: { lat: sw.lat(), lng: sw.lng() },
        });
      }
    });

  }, [isLoaded, initialZoom, onCenterChange, onBoundsChange]);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: MARKER_COLORS[markerData.type],
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        animation: google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        setSelectedMarker(markerData);
        onMarkerClick?.(markerData);

        // Show info window
        if (infoWindowRef.current && mapInstanceRef.current) {
          const content = createInfoWindowContent(markerData);
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to markers if there are any
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));

      // Only fit bounds if we haven't centered on user location
      if (markers.length > 1) {
        mapInstanceRef.current.fitBounds(bounds, 50);
      }
    }
  }, [markers, isLoaded, onMarkerClick]);

  // Update radius circle
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Remove existing circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // Create new circle
    circleRef.current = new google.maps.Circle({
      map: mapInstanceRef.current,
      center,
      radius: radius * 1609.34, // Convert miles to meters
      fillColor: MARKER_COLORS[mapType === 'gurus' ? 'guru' : mapType === 'gigs' ? 'gig' : 'skill'],
      fillOpacity: 0.1,
      strokeColor: MARKER_COLORS[mapType === 'gurus' ? 'guru' : mapType === 'gigs' ? 'gig' : 'skill'],
      strokeOpacity: 0.5,
      strokeWeight: 2,
    });
  }, [center, radius, isLoaded, mapType]);

  // Create info window content
  const createInfoWindowContent = useCallback((marker: MapMarker): string => {
    const typeLabel = marker.type === 'guru' ? 'Expert Guru' : marker.type === 'gig' ? 'Gig' : 'Skill';
    const ratingStars = marker.rating ? '★'.repeat(Math.floor(marker.rating)) : '';

    return `
      <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="background: ${MARKER_COLORS[marker.type]}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
            ${typeLabel}
          </span>
        </div>
        <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #1f2937;">
          ${marker.title}
        </h3>
        ${marker.description ? `<p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">${marker.description}</p>` : ''}
        ${marker.rating ? `<div style="color: #fbbf24; font-size: 14px; margin-bottom: 4px;">${ratingStars} ${marker.rating.toFixed(1)}</div>` : ''}
        ${marker.hourlyRate ? `<div style="font-size: 14px; font-weight: 600; color: #10b981;">$${marker.hourlyRate}/hr</div>` : ''}
        ${marker.skills && marker.skills.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${marker.skills.slice(0, 3).map(skill => `
              <span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #374151;">
                ${skill}
              </span>
            `).join('')}
          </div>
        ` : ''}
        ${marker.href ? `
          <a href="${marker.href}" style="display: inline-block; margin-top: 10px; padding: 6px 12px; background: ${MARKER_COLORS[marker.type]}; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500;">
            View Profile
          </a>
        ` : ''}
      </div>
    `;
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchQuery || !mapInstanceRef.current) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = { lat: location.lat(), lng: location.lng() };

        mapInstanceRef.current?.setCenter(location);
        mapInstanceRef.current?.setZoom(12);
        setCenter(newCenter);
        onCenterChange?.(newCenter);
      }
    });
  }, [searchQuery, onCenterChange]);

  // Handle current location
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        mapInstanceRef.current?.setCenter(newCenter);
        mapInstanceRef.current?.setZoom(12);
        setCenter(newCenter);
        onCenterChange?.(newCenter);
        setIsGettingLocation(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to get your location');
        setIsGettingLocation(false);
      }
    );
  }, [onCenterChange]);

  // Handle radius change
  const handleRadiusChange = useCallback((newRadius: number) => {
    setRadius(newRadius);
    onRadiusChange?.(newRadius);
  }, [onRadiusChange]);

  // Loading state
  if (!isLoaded && !error) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-400">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🗺️</div>
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-gray-500 text-sm">Please check your configuration</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Search Controls */}
      {(showSearch || showRadiusControl || showCurrentLocation) && (
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          {showSearch && (
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-lg transition-colors font-medium"
              >
                Search
              </button>
            </div>
          )}

          {/* Current Location Button */}
          {showCurrentLocation && (
            <button
              onClick={handleCurrentLocation}
              disabled={isGettingLocation}
              className="px-4 py-2.5 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 rounded-lg shadow-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              {isGettingLocation ? (
                <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span className="hidden sm:inline">Near Me</span>
            </button>
          )}

          {/* Radius Selector */}
          {showRadiusControl && (
            <select
              value={radius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 font-medium cursor-pointer"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} miles
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full"
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-10">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
        <div className="flex flex-col gap-1.5">
          {(mapType === 'all' || mapType === 'gurus') && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.guru }} />
              <span className="text-xs text-gray-600">Expert Gurus</span>
            </div>
          )}
          {(mapType === 'all' || mapType === 'gigs') && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.gig }} />
              <span className="text-xs text-gray-600">Available Gigs</span>
            </div>
          )}
          {mapType === 'all' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MARKER_COLORS.skill }} />
              <span className="text-xs text-gray-600">Skills</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 z-10">
          <span className="text-sm font-semibold text-gray-700">
            {markers.length} result{markers.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}
    </div>
  );
}
