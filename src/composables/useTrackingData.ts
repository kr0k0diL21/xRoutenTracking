// src/composables/useTrackingData.ts
import { ref, computed } from 'vue';

export interface Location {
  lng: number;
  lat: number;
}

export interface DriverData {
  orderId: string;
  driver: {
    name: string;
    phone: string;
    address: string;
    location: Location;
  };
  remainingStops: Location[];
  destination: {
    address: string;
    location: Location;
    eta: string;
  };
}
// Hier dann später die daten Fetchen
// Globaler State (außerhalb der Funktion, damit er überall gleich ist)
const driverData = ref<DriverData>({
  orderId: 'SH-2025-00421',
  driver: {
    name: 'John Doe',
    phone: '+49 123 456789',
    address: 'Irgendwo berechnet durch API',
    location: { lng: 13.397634, lat: 52.52343 },
  },
  remainingStops: [
    { lng: 13.404954, lat: 52.520008 },
    { lng: 13.38886, lat: 52.517037 },
    { lng: 13.377704, lat: 52.516275 },
    { lng: 13.342533, lat: 52.513364 },
  ],
  destination: {
    address: 'Irgendwas berechnet durch API',
    location: { lng: 13.295779, lat: 52.520639 },
    eta: '14:30 Uhr',
  },
});

export function useTrackingData() {
  const stopps = computed(() => driverData.value.remainingStops.length);

  return {
    driverData,
    stopps,
  };
}
