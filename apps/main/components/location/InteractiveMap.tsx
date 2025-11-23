import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'guru' | 'angel' | 'gig';
  title: string;
  price?: number;
  rating?: number;
  category?: string;
  href?: string;
}

interface InteractiveMapProps {
  markers: MarkerData[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MarkerData) => void;
  showControls?: boolean;
  filterTypes?: Array<'guru' | 'angel' | 'gig'>;
}

// Leaflet CSS must be imported in the component that uses the map
const MAP_STYLES = `
  .leaflet-container {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    z-index: 1;
  }

  .map-marker-guru {
    background-color: #10b981;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .map-marker-guru:hover {
    transform: scale(1.2);
    z-index: 1000;
  }

  .map-marker-angel {
    background-color: #3b82f6;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .map-marker-angel:hover {
    transform: scale(1.2);
    z-index: 1000;
  }

  .map-marker-gig {
    background-color: #f59e0b;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .map-marker-gig:hover {
    transform: scale(1.2);
    z-index: 1000;
  }

  .leaflet-popup-content-wrapper {
    background: rgba(30, 39, 73, 0.95);
    backdrop-filter: blur(10px);
    color: white;
    border-radius: 0.75rem;
    padding: 0;
    overflow: hidden;
  }

  .leaflet-popup-content {
    margin: 0;
    min-width: 200px;
  }

  .leaflet-popup-tip {
    background: rgba(30, 39, 73, 0.95);
  }
`;

export default function InteractiveMap({
  markers,
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 12,
  onMarkerClick,
  showControls = true,
  filterTypes = ['guru', 'angel', 'gig']
}: InteractiveMapProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamically import Leaflet only on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);

      // Initialize map if not already initialized
      if (!mapInstanceRef.current) {
        const map = leaflet.default.map(mapRef.current).setView([center.lat, center.lng], zoom);

        // Add OpenStreetMap tiles
        leaflet.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof leaflet.default.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Filter markers by type
      const filteredMarkers = markers.filter(m => filterTypes.includes(m.type));

      // Add markers
      filteredMarkers.forEach((marker) => {
        const icon = leaflet.default.divIcon({
          className: 'custom-marker',
          html: `<div class="map-marker-${marker.type}">${
            marker.type === 'guru' ? '🎓' : marker.type === 'angel' ? '👼' : '💼'
          }</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const leafletMarker = leaflet.default.marker([marker.lat, marker.lng], { icon }).addTo(mapInstanceRef.current);

        // Create popup content
        const popupContent = `
          <div style="padding: 1rem;">
            <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.1rem;">${marker.name}</h3>
            <p style="font-size: 0.9rem; color: #cbd5e1; margin-bottom: 0.5rem;">${marker.title}</p>
            ${marker.rating ? `<div style="color: #fbbf24; margin-bottom: 0.5rem;">⭐ ${marker.rating}/5</div>` : ''}
            ${marker.price ? `<div style="color: #10b981; margin-bottom: 0.5rem;">$${marker.price}/hr</div>` : ''}
            ${marker.category ? `<div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.75rem;">${marker.category}</div>` : ''}
            ${marker.href ? `<a href="${marker.href}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.9rem;">View Profile</a>` : ''}
          </div>
        `;

        leafletMarker.bindPopup(popupContent);

        if (onMarkerClick) {
          leafletMarker.on('click', () => onMarkerClick(marker));
        }
      });

      // Fit bounds to show all markers if there are any
      if (filteredMarkers.length > 0) {
        const bounds = leaflet.default.latLngBounds(
          filteredMarkers.map(m => [m.lat, m.lng])
        );
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, markers, center, zoom, onMarkerClick, filterTypes]);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-primarydark/50 rounded-xl flex items-center justify-center">
        <div className="text-white-60 flex flex-col items-center gap-4">
          <div className="text-4xl">🗺️</div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{MAP_STYLES}</style>
      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
      `}</style>
      <div ref={mapRef} className="w-full h-[600px] rounded-xl shadow-2xl" />
    </>
  );
}
