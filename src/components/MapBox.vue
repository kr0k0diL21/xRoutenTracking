<script setup lang="ts">
import { onMounted } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '@/composables/useMap';
import { useTrackingData } from '@/composables/useTrackingData';

const { setupMap } = useMap();
const { driverData, fetchXroutenStatus } = useTrackingData();

onMounted(async () => {
  await fetchXroutenStatus();

  setupMap(
    driverData.value.driver.location,
    driverData.value.destination.location,
    driverData.value.status
  );
});
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
