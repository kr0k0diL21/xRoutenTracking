<script setup lang="ts">
import { onMounted} from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapRoute } from '@/composables/useMapRoute';
import { useTrackingData } from '@/composables/useTrackingData';

const { setupMap} = useMapRoute();
const { driverData, updateAddressFromCoords, fetchXroutenStatus } =
  useTrackingData();

onMounted(async () => {
  await fetchXroutenStatus();
  await updateAddressFromCoords();
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
