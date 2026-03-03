<!-- src/components/MapBox.vue -->
<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxData } from '@/composables/useMapboxData';
import { onMounted, watch } from 'vue';
import type { xRoutenTrackingData } from '@/types/trackingDataTypes';

const { initializeMap, setMarkers, fitMapToBounds, flyToLocation, removeStartMarker } = useMapboxData();
const props = defineProps<{
  trackingData: xRoutenTrackingData | null;
}>();

// Karte initialisieren beim Mounten
onMounted(async () => {
  initializeMap('map');
});
// Reagiere auf Änderungen der Tracking-Daten
watch(() => props.trackingData, (newData) => {
  if (!newData) return;

  const start = newData.start.coordinates;
  const end = newData.end.coordinates;
  const status = newData.status;

  setMarkers(start, end);

  if (status === 'pending') {
    fitMapToBounds(start, end);
  } else {
    removeStartMarker();
    flyToLocation(end);
  }
});
</script>

<template>
  <div id="map" class="w-full h-full" />
</template>
