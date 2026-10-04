// src/composables/useXRoutenData.ts

import { ref } from 'vue';
import { fetchXroutenData } from '@/services/xRoutenAPI';
import { reverseGeocoding } from '@/services/mapboxAPI';
import type { xRoutenTrackingData } from '@/types/trackingDataTypes';

export function useXRoutenData() {
  const xRoutenTrackingObject = ref<xRoutenTrackingData | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  async function getTrackingData() {
    isLoading.value = true;

    try {
      const data = await fetchXroutenData();
      /* console.log('Fetched xRouten data:', data); */
      const driverCoordinates = data.driverLocation?.coordinates
        ? {
            lng: parseFloat(data.driverLocation.coordinates[0]),
            lat: parseFloat(data.driverLocation.coordinates[1]),
          }
        : null;
      const parsedData = {
        status: data.status,
        remainingStops: data.remainingStopsCount,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,

        arrival: data.driverLocation?.timestamp
          ? `${new Date(data.driverLocation.timestamp).toLocaleTimeString(
              'de-DE',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )} Uhr`
          : 'keine Angabe',

        start: driverCoordinates
          ? {
              coordinates: driverCoordinates,
              address: await reverseGeocoding(driverCoordinates),
            }
          : null,
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
      };

      xRoutenTrackingObject.value = parsedData;
      error.value = null;
    } catch (err: unknown) {
      error.value = (err as Error).message;
      console.error((err as Error).message);
    } finally {
      isLoading.value = false;
    }
  }
  return {
    xRoutenTrackingObject,
    getTrackingData,
    isLoading,
    error,
  };
}
