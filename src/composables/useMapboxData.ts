// src/composables/useMapboxData.ts
import mapboxgl from 'mapbox-gl';
import { shallowRef } from 'vue';
import type { Coordinates } from '@/types/trackingDataTypes';

const map = shallowRef<mapboxgl.Map | null>(null);
const startMarker = shallowRef<mapboxgl.Marker | null>(null);
const endMarker = shallowRef<mapboxgl.Marker | null>(null);

// Composable zum Initialisieren der Mapbox-Karte und Setzen von Markern
export function useMapboxData() {
  // Funktion zum Initialisieren der Mapbox-Karte
  function initializeMap(containerId: string) {
    map.value = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',

      zoom: 1,
    });
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.value.addControl(new mapboxgl.GeolocateControl(), 'top-right');
  }

  // Funktion zum Setzen der Start- und Endmarker auf der Karte
  function setMarkers(start: Coordinates, end: Coordinates) {
    if (!map.value) return;
    if (!startMarker.value) {
      startMarker.value = new mapboxgl.Marker({
        element: createMarkerElement('/start.png', 50),
        anchor: 'center',
      })
        .setLngLat([start.lng, start.lat])
        .addTo(map.value);
    }
    startMarker.value.setLngLat([start.lng, start.lat]);

    endMarker.value = !endMarker.value
      ? new mapboxgl.Marker({
          color: '#f97316',
          anchor: 'center',
        })
          .setLngLat([end.lng, end.lat])
          .addTo(map.value)
      : endMarker.value.setLngLat([end.lng, end.lat]);
  }
  // Funktion zum Entfernen des Startmarkers von der Karte
  function removeStartMarker() {
    if (startMarker.value) {
      startMarker.value.remove();
      startMarker.value = null;
    }
  }

  // Funktion zum Anpassen der Kartenansicht, um beide Marker anzuzeigen
  function fitMapToBounds(start: Coordinates, end: Coordinates) {
    if (map.value) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([start.lng, start.lat]);
      bounds.extend([end.lng, end.lat]);
      map.value.fitBounds(bounds, { padding: 180 });
    }
  }

  // Funktion zum Zentrieren der Karte auf eine bestimmte Position
  function flyToLocation(location: Coordinates) {
    if (map.value) {
      map.value.flyTo({
        center: [location.lng, location.lat],
        zoom: 14,
        duration: 2000,
      });
    }
  }

  // Hilfsfunktion zum Erstellen eines benutzerdefinierten Markerelements
  function createMarkerElement(
    imageSource: string,
    size: number
  ): HTMLImageElement {
    const element = document.createElement('img');
    element.src = imageSource;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    return element;
  }

  return {
    initializeMap,
    setMarkers,
    flyToLocation,
    fitMapToBounds,
    removeStartMarker,
  };
}
