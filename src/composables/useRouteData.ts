import { defaultWindow } from '@vueuse/core';
import { ref } from 'vue';

interface Coordinates {
  lng: number;
  lat: number;
}

interface RouteData {
  driver: Coordinates;
  destination: Coordinates;
}

export function useRouteData() {
  const driver = ref<Coordinates | null>(null);
  const destination = ref<Coordinates | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
}

// /api/track/<service-location-id>

function fetchData () => {
  return



  axios.get



  defaultWindowad
  awd
  abstractdaw
  d
  awaitd
}

const driverTrackingResponse = {
  driver: {
    userName: 'John Doe',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  remainingStops: [
        [-122.4194, 37.7749],
        [-122.4194, 37.7749],
        [-122.4194, 37.7749],
        [-122.4194, 37.7749],

  ],
  endLocation: {
    addresse: '123 Main St, Anytown USA',
    latitude: 37.7749,
    longitude: -122.4194,
    eta: '2023-04-01T12:00:00Z',
  },
};
