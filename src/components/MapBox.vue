<script setup lang="ts">
import { onMounted, watch } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapRoute } from '@/composables/useMapRoute';
import { useTrackingData } from '@/composables/useTrackingData';

const { setupMapWithRoute, updateRouteAndMarker } = useMapRoute();
const { driverData, updateAddressFromCoords } = useTrackingData();
const driverLocation = driverData.value.driver.location;
const destinationLocation = driverData.value.destination.location;
const isDelivered = driverData.value.isDelivered;

onMounted(async () => {
  setupMapWithRoute(driverLocation, destinationLocation, isDelivered);
  await updateAddressFromCoords();
});

watch(
  [() => driverData.value.driver.location, () => driverData.value.isDelivered],
  async () => {
    if (driverData.value.isDelivered) return;
    const newLocation = driverData.value.driver.location;
    await updateRouteAndMarker(newLocation, destinationLocation);
    await updateAddressFromCoords();
  },
  { deep: true }
);
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
