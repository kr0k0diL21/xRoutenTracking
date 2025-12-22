<script setup lang="ts">
import { onMounted } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapRoute } from '@/composables/useMapRoute';
import { useTrackingData } from '@/composables/useTrackingData';

const {driverData} = useTrackingData();
const startLocation = driverData.value.driver.location;
const destinationLocation = driverData.value.destination.location;

const { setupMapWithRoute } = useMapRoute();

onMounted(() => {
  setupMapWithRoute(startLocation, destinationLocation);
});
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
