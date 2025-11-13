import { useEffect, useRef, useState } from 'react';

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: {
    address: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
    zipCode?: string;
  }) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  defaultValue = '',
  placeholder = 'Enter your location',
  className = '',
  required = false
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError('Google Maps API key is not configured');
      console.error('Missing Google Maps API key. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'], // Can be changed to ['geocode'] for more options
        fields: ['address_components', 'geometry', 'formatted_address']
      });

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.geometry) {
          console.error('No place selected or place has no geometry');
          return;
        }

        // Extract location details from address components
        const addressComponents = place.address_components || [];
        let city = '';
        let state = '';
        let country = '';
        let zipCode = '';

        addressComponents.forEach((component) => {
          const types = component.types;

          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('country')) {
            country = component.long_name;
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        // Get coordinates
        const lat = place.geometry.location?.lat() || 0;
        const lng = place.geometry.location?.lng() || 0;

        // Call the callback with location data
        onPlaceSelect({
          address: place.formatted_address || '',
          city,
          state,
          country,
          lat,
          lng,
          zipCode
        });
      });
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
      setError('Error initializing location autocomplete');
    }
  }, [isLoaded, onPlaceSelect]);

  if (error) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className={className}
        />
        <p className="text-sm text-red-400">{error} - Please enter location manually</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className={className}
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}
