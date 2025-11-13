// TypeScript declarations for Google Maps API
/// <reference types="@googlemaps/types" />

declare global {
  interface Window {
    google: typeof google;
  }
}

export {};
