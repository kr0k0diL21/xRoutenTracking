// src/services/mapboxAPI.ts
import mapboxgl from 'mapbox-gl';
import type { Coordinates } from '@/types/trackingDataTypes';

// Funktion zum Reverse-Geocoding: Koordinaten in eine lesbare Adresse umwandeln
export async function reverseGeocoding(location: Coordinates) {
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location.lng}&latitude=${location.lat}&access_token=${mapboxgl.accessToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Geocoding API responded with status: ${response.status}`
      );
    }
    const data = await response.json();
    // Mapbox v6 liefert die Adresse in 'features[0].properties.full_address'
    return (
      data.features?.[0].properties.full_address || 'Adresse nicht gefunden'
    );
  } catch (error) {
    console.error('Geocoding Fehler:', error);
    throw error;
  }
}
