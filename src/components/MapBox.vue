<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox Access Token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const map = shallowRef<mapboxgl.Map | null>(null);

// Koordinaten für Start und Ziel
const start = { lng: 13.397634, lat: 52.52343 };
const ziel = { lng: 13.295779, lat: 52.520639 };

// Funktion zur Erstellung des Marker-Elements
function createMarkerElement(src: string, size: number) {
  const el = document.createElement('img');
  el.src = src;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  return el;
}

onMounted(() => {
  const mapInstance = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [13.36, 52.52],
    zoom: 10,
  });

  map.value = mapInstance;

  // Zusätzliche Steuerungen
  mapInstance.addControl(
    new mapboxgl.NavigationControl({ showCompass: true }),
    'top-right'
  );

  mapInstance.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
      fitBoundsOptions: { maxZoom: 16 },
    }),
    'top-right'
  );

  // Hauptlogik mit async/await
  mapInstance.on('load', async () => {
    // Eigene Marker hinzufügen
    new mapboxgl.Marker({
      element: createMarkerElement('/start.png', 50),
      anchor: 'bottom',
    })
      .setLngLat([start.lng, start.lat])
      .addTo(mapInstance);

    new mapboxgl.Marker({
      element: createMarkerElement('/ziel.png', 50),
      anchor: 'bottom',
    })
      .setLngLat([ziel.lng, ziel.lat])
      .addTo(mapInstance);

    // Route von Mapbox Directions API holen
    const coordinates = `${start.lng},${start.lat};${ziel.lng},${ziel.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);

      // Fehlerprüfung für HTTP-Status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Prüfung der Route
      const routeGeometry = json.routes?.[0]?.geometry;

      if (!routeGeometry) {
        console.error('Keine Route gefunden oder Route-Daten sind leer.');
        return;
      }

      // Route als Layer hinzufügen
      mapInstance.addSource('route', {
        type: 'geojson',
        data: routeGeometry,
      });

      mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 5,
          'line-opacity': 0.9,
        },
      });

      // Karte auf die Route zoomen
      const bounds = new LngLatBounds();

      // Die Koordinaten sind vom Typ [number, number][]
      (routeGeometry.coordinates as [number, number][]).forEach((coord) =>
        bounds.extend(coord)
      );

      mapInstance.fitBounds(bounds, {
        padding: {
          top: 150,
          bottom: 150,
          left: 500,
          right: 150,
        },
        duration: 2800,
        maxZoom: 14,
      });
    } catch (err) {
      console.error('Directions API Fehler:', err);
    }
  });
});
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
