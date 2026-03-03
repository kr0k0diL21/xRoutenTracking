// src/composables/useXRoutenData.ts
import { ref } from 'vue';
import { fetchXroutenData } from '@/services/xRoutenAPI';
import { reverseGeocoding } from '@/services/mapboxAPI';
import type { xRoutenTrackingData } from '@/types/trackingDataTypes';

// Composable zum Abrufen und Verwalten der xRouten-Tracking-Daten
export function useXRoutenData() {
  const xRoutenTrackingObject = ref<xRoutenTrackingData | null>(null);
  const isLoading = ref(true);

  // Funktion zum Abrufen der Tracking-Daten und parsen in das gewünschte Format
  async function getTrackingData() {
    isLoading.value = true;
    const data = await fetchXroutenData();
    console.log('Rohdaten von xRouten API:', data);
    const parsedData = {
      start: {
        coordinates: {
          lng: parseFloat(data.driverLocation.coordinates[0]),
          lat: parseFloat(data.driverLocation.coordinates[1]),
        },
        address: await reverseGeocoding({
          lng: parseFloat(data.driverLocation.coordinates[0]),
          lat: parseFloat(data.driverLocation.coordinates[1]),
        }),
        timestamp: new Date(data.driverLocation.timestamp).toLocaleTimeString(
          'de-DE',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
      },
      end: {
        coordinates: {
          lng: parseFloat(data.destination.coordinates[0]),
          lat: parseFloat(data.destination.coordinates[1]),
        },
        address: await reverseGeocoding({
          lng: parseFloat(data.destination.coordinates[0]),
          lat: parseFloat(data.destination.coordinates[1]),
        }),
      },
      remainingStops: data.remainingStopsCount,
      status: data.status,
    };

    xRoutenTrackingObject.value = parsedData;
    isLoading.value = false;
    console.log('xRouten Tracking Data:', xRoutenTrackingObject.value);
  }
  return {
    xRoutenTrackingObject,
    getTrackingData,
    isLoading,
  };
}
