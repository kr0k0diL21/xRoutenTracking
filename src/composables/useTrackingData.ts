// src/composables/useTrackingData.ts
import { ref, computed } from 'vue';
import { useMapRoute } from './useMapRoute';

const API_KEY = import.meta.env.VITE_XROUTEN_API_KEY;
const SERVICE_ID = 'ac2c110d-541d-43a3-b3f2-064dc73b0e57';

export interface Location {
  lng: number;
  lat: number;
}

export interface DriverData {
  orderId: string;
  driver: {
    address: string;
    location: Location;
  };
  remainingStops: Location[];
  destination: {
    address: string;
    location: Location;
    eta: string;
  };
  isDelivered: boolean;
}

// Hier dann später die daten Fetchen
const driverData = ref<DriverData>({
  orderId: 'SH-2025-00421',
  driver: {
    address: 'Lade Adresse...',
    location: { lng: 13.397634, lat: 52.523432 },
  },
  remainingStops: [
    { lng: 13.404954, lat: 52.520008 },
    { lng: 13.38886, lat: 52.517037 },
    { lng: 13.377704, lat: 52.516275 },
    { lng: 13.342533, lat: 52.513364 },
  ],
  destination: {
    address: 'Lade Adresse...',
    location: { lng: 13.295779, lat: 52.520639 },
    eta: '14:30 Uhr',
  },
  isDelivered: false,
});

export function useTrackingData() {
  const { centerOnPoint, getAddressFromCoords } = useMapRoute();

  const stopps = computed(() => driverData.value.remainingStops.length);

  const timelineItems = computed(() => {
    const items = [];
    const subtitleStopps = ['Auf dem Weg', 'Fast da'];

    if (!driverData.value.isDelivered) {
      items.push(
        {
          type: 'driver',
          title: 'Fahrer',
          subtitle: driverData.value.driver.address,
        },
        {
          type: 'stop',
          title:
            stopps.value <= 0
              ? 'Sie sind der nächste Halt'
              : 'Verbleibende Stopps: ' + stopps.value,
          subtitle: stopps.value > 1 ? subtitleStopps[0] : subtitleStopps[1],
        }
      );
    }

    items.push({
      type: 'destination',
      title: 'Ziel',
      subtitle: driverData.value.destination.address,
      eta: driverData.value.destination.eta,
      status: driverData.value.isDelivered
        ? 'Abgeschlossen um '
        : 'Ankunft ca. ',
    });

    return items;
  });

  const handleCenterMap = (type: 'driver' | 'destination') => {
    const location =
      type === 'driver'
        ? driverData.value.driver.location
        : driverData.value.destination.location;
    centerOnPoint(location);
  };

  const updateAddressFromCoords = async () => {
    driverData.value.driver.address = await getAddressFromCoords(
      driverData.value.driver.location
    );
    driverData.value.destination.address = await getAddressFromCoords(
      driverData.value.destination.location
    );
  };
  return {
    driverData,
    updateAddressFromCoords,
    handleCenterMap,
    timelineItems,
  };
}

async function fetchXroutenStatus(serviceId: string, apiKey: string) {
  const url = `/api-xrouten/api/service-locations/${serviceId}/status`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `ApiKey ${apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler: ${response.status}`);
    }

    const jsonData = await response.json();
    console.log('Daten von api.xrouten.de erfolgreich geladen:', jsonData);
    return jsonData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fehler beim Laden der Daten:', error.message);
    } else {
      console.error('Unbekannter Fehler beim Laden der Daten');
    }
  }
}

fetchXroutenStatus(SERVICE_ID, API_KEY);
