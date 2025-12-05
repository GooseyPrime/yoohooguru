'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { MapMarker } from './SearchableMap';

// Dynamically import SearchableMap to avoid SSR issues
const SearchableMap = dynamic(() => import('./SearchableMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

export interface MapSectionProps {
  title?: string;
  subtitle?: string;
  mapType?: 'gurus' | 'gigs' | 'all';
  category?: string;
  height?: string;
  showFilters?: boolean;
  className?: string;
}

// Sample data for demonstration (will be replaced with API calls)
const SAMPLE_GURUS: MapMarker[] = [
  {
    id: '1',
    lat: 40.7128,
    lng: -74.0060,
    title: 'Sarah Chen',
    description: 'Web Development Expert',
    type: 'guru',
    rating: 4.9,
    hourlyRate: 75,
    skills: ['React', 'Node.js', 'TypeScript'],
    href: '/guru/1/book-session',
  },
  {
    id: '2',
    lat: 34.0522,
    lng: -118.2437,
    title: 'Marcus Rodriguez',
    description: 'Digital Marketing Strategist',
    type: 'guru',
    rating: 4.8,
    hourlyRate: 60,
    skills: ['SEO', 'Content Marketing', 'Analytics'],
    href: '/guru/2/book-session',
  },
  {
    id: '3',
    lat: 41.8781,
    lng: -87.6298,
    title: 'Emily Watson',
    description: 'Graphic Design Mentor',
    type: 'guru',
    rating: 5.0,
    hourlyRate: 55,
    skills: ['UI/UX', 'Brand Design', 'Figma'],
    href: '/guru/3/book-session',
  },
  {
    id: '4',
    lat: 47.6062,
    lng: -122.3321,
    title: 'David Kim',
    description: 'Data Science Professional',
    type: 'guru',
    rating: 4.9,
    hourlyRate: 85,
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    href: '/guru/4/book-session',
  },
  {
    id: '5',
    lat: 33.4484,
    lng: -112.0740,
    title: 'Lisa Anderson',
    description: 'Business Strategy Coach',
    type: 'guru',
    rating: 4.7,
    hourlyRate: 70,
    skills: ['Strategy', 'Leadership', 'Growth Hacking'],
    href: '/guru/5/book-session',
  },
  {
    id: '6',
    lat: 29.7604,
    lng: -95.3698,
    title: 'James Miller',
    description: 'Photography & Video Expert',
    type: 'guru',
    rating: 4.8,
    hourlyRate: 50,
    skills: ['Photography', 'Video Editing', 'Lightroom'],
    href: '/guru/6/book-session',
  },
];

const SAMPLE_GIGS: MapMarker[] = [
  {
    id: 'g1',
    lat: 40.7580,
    lng: -73.9855,
    title: 'Website Redesign Needed',
    description: 'Looking for a developer to modernize our company website',
    type: 'gig',
    hourlyRate: 65,
    skills: ['Web Design', 'React', 'CSS'],
    href: '/gigs/g1',
  },
  {
    id: 'g2',
    lat: 34.1478,
    lng: -118.1445,
    title: 'Home Plumbing Repair',
    description: 'Need licensed plumber for bathroom renovation',
    type: 'gig',
    hourlyRate: 55,
    skills: ['Plumbing', 'Home Repair'],
    href: '/gigs/g2',
  },
  {
    id: 'g3',
    lat: 41.9028,
    lng: -87.6874,
    title: 'Private Math Tutor',
    description: 'Looking for SAT math prep tutor for high school student',
    type: 'gig',
    hourlyRate: 45,
    skills: ['Math', 'SAT Prep', 'Tutoring'],
    href: '/gigs/g3',
  },
  {
    id: 'g4',
    lat: 37.7749,
    lng: -122.4194,
    title: 'Event Photography',
    description: 'Corporate event photographer needed for annual conference',
    type: 'gig',
    hourlyRate: 80,
    skills: ['Photography', 'Event Coverage'],
    href: '/gigs/g4',
  },
  {
    id: 'g5',
    lat: 25.7617,
    lng: -80.1918,
    title: 'Personal Fitness Training',
    description: 'Looking for certified personal trainer for home sessions',
    type: 'gig',
    hourlyRate: 60,
    skills: ['Fitness', 'Personal Training'],
    href: '/gigs/g5',
  },
];

export default function MapSection({
  title = 'Find Experts & Gigs Near You',
  subtitle = 'Search for skilled professionals and available opportunities in your area',
  mapType = 'all',
  category,
  height = '500px',
  showFilters = true,
  className = '',
}: MapSectionProps) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  // Fetch markers based on location and filters
  const fetchMarkers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // In production, this would be an API call
      // For now, use sample data
      let filteredMarkers: MapMarker[] = [];

      if (mapType === 'all') {
        filteredMarkers = [...SAMPLE_GURUS, ...SAMPLE_GIGS];
      } else if (mapType === 'gurus') {
        filteredMarkers = SAMPLE_GURUS;
      } else {
        filteredMarkers = SAMPLE_GIGS;
      }

      // Filter by category if specified
      if (selectedCategory && selectedCategory !== 'all') {
        filteredMarkers = filteredMarkers.filter(m =>
          m.skills?.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()))
        );
      }

      // Filter by radius if center is set
      if (center) {
        filteredMarkers = filteredMarkers.filter(m => {
          const distance = calculateDistance(center.lat, center.lng, m.lat, m.lng);
          return distance <= radius;
        });
      }

      setMarkers(filteredMarkers);
    } catch (err) {
      console.error('Failed to fetch markers:', err);
      setError('Failed to load map data');
    } finally {
      setLoading(false);
    }
  }, [mapType, selectedCategory, center, radius]);

  // Calculate distance between two points in miles (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch markers on mount and when filters change
  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    console.log('Marker clicked:', marker);
    // Could open a modal, navigate to profile, etc.
  };

  // Handle center change
  const handleCenterChange = (newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter);
  };

  // Handle radius change
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  // Category options
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'education', label: 'Education' },
    { value: 'photography', label: 'Photography' },
    { value: 'home', label: 'Home Services' },
  ];

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Map Type Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setMarkers([...SAMPLE_GURUS, ...SAMPLE_GIGS])}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mapType === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMarkers(SAMPLE_GURUS)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mapType === 'gurus'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Gurus
              </button>
              <button
                onClick={() => setMarkers(SAMPLE_GIGS)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mapType === 'gigs'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Gigs
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <SearchableMap
            markers={markers}
            onMarkerClick={handleMarkerClick}
            onCenterChange={handleCenterChange}
            onRadiusChange={handleRadiusChange}
            searchRadius={radius}
            height={height}
            mapType={mapType}
            showSearch={true}
            showRadiusControl={true}
            showCurrentLocation={true}
            placeholder="Enter city, state, or zip code..."
          />
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-400">
              {markers.filter((m: MapMarker) => m.type === 'guru').length}
            </div>
            <div className="text-sm text-gray-400">Experts Available</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {markers.filter((m: MapMarker) => m.type === 'gig').length}
            </div>
            <div className="text-sm text-gray-400">Open Gigs</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{radius}</div>
            <div className="text-sm text-gray-400">Mile Radius</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">
              ${markers.length > 0
                ? Math.round(markers.reduce((sum: number, m: MapMarker) => sum + (m.hourlyRate || 0), 0) / markers.length)
                : 0}
            </div>
            <div className="text-sm text-gray-400">Avg. Hourly Rate</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/25"
          >
            Browse All Results
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
