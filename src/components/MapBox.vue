<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const map = shallowRef<mapboxgl.Map | null>(null);

onMounted(() => {
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
  });

  navigator.geolocation.getCurrentPosition((pos) => {
    const lng = pos.coords.longitude;
    const lat = pos.coords.latitude;

    map.value!.setCenter([lng, lat]);
    map.value!.flyTo({ center: [lng, lat], zoom: 15 });

    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([lng, lat] as mapboxgl.LngLatLike)
      .addTo(map.value!);
  });
});
</script>

<template>
  <div id="map" class="w-full h-screen" />
</template>
