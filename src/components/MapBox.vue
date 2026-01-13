<script setup lang="ts">
import { onMounted, watch } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapRoute } from '@/composables/useMapRoute';
import { useTrackingData } from '@/composables/useTrackingData';

const { setupMapWithRoute, updateRouteAndMarker } = useMapRoute();
const { driverData, updateAddressFromCoords, fetchXroutenStatus ,startTracking} =
  useTrackingData();

onMounted(async () => {
  await fetchXroutenStatus();
  startTracking();
  await updateAddressFromCoords();
  setupMapWithRoute(
    driverData.value.driver.location,
    driverData.value.destination.location,
    driverData.value.isDelivered
  );
});

watch(
  [() => driverData.value.driver.location, () => driverData.value.isDelivered],
  async () => {
    if (driverData.value.isDelivered) return;
    const newLocation = driverData.value.driver.location;
    await updateRouteAndMarker(
      newLocation,
      driverData.value.destination.location
    );
    await updateAddressFromCoords();
  },
  { deep: true }
);
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
