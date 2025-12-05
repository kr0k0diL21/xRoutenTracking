<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const map = shallowRef<mapboxgl.Map | null>(null);

// Punkte auf der Karte
const start = { lng: 13.397634, lat: 52.52343, name: 'Alexanderplatz' };
const ziel = { lng: 13.295779, lat: 52.520639, name: 'Schloss Charlottenburg' };

onMounted(async () => {
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [13.36, 52.52],
    zoom: 2,
  });
  // 1. Zoom-in- und Zoom-out-Buttons hinzufügen (plus Kompass)
  // NavigationControl: Fügt + / - Buttons und Kompass hinzu
  map.value!.addControl(
    new mapboxgl.NavigationControl({
      showCompass: true, // Kompass anzeigen (optional: false zum Ausblenden)
      showZoom: true, // Zoom-Buttons anzeigen (default: true)
    }),
    'top-right'
  ); // Position: 'top-right' (andere Optionen: 'top-left', 'bottom-left', etc.)

  // 2. Standard-Zentrierungsbutton hinzufügen (Geolocate: Zentriert auf Nutzer-Position)
  // GeolocateControl: Button mit Ortungssymbol, der die Karte auf GPS-Position zentriert
  map.value!.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true, // Höhere Genauigkeit (optional)
      },
      trackUserLocation: true, // Kontinuierlich tracken (optional: false für einmalig)
      fitBoundsOptions: {
        maxZoom: 15, // Maximale Zoom-Stufe beim Zentrieren (verhindert zu starkes Zoomen)
      },
    }),
    'top-right'
  ); // Position: 'top-left'

  map.value.on('load', async () => {
    // Marker setzen
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([start.lng, start.lat])
      .addTo(map.value!);

    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([ziel.lng, ziel.lat])
      .addTo(map.value!);

    // === DIRECTIONS API ABRUFEN ===
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${ziel.lng},${ziel.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      // driving → Auto
      // walking → Fußgänger
      // cycling → Fahrrad
    );
    const json = await query.json();
    const route = json.routes[0].geometry; // GeoJSON der besten Route

    // === Route auf der Karte anzeigen ===
    map.value!.addSource('route', {
      type: 'geojson',
      data: route,
    });

    map.value!.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.9,
      },
    });

    // === Karte auf die Route zoomen ===
    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach((coord: [number, number]) =>
      bounds.extend(coord)
    );

    map.value!.fitBounds(bounds, {
      padding: 100,
      duration: 3000,
    });
  });
});
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
