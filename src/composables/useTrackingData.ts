// src/composables/useTrackingData.ts
import { ref, computed, onUnmounted } from 'vue';
import { useMapRoute } from './useMapRoute';

const API_KEY = import.meta.env.VITE_XROUTEN_API_KEY;
const SERVICE_ID = 'c1880e18-dc90-47d2-a991-bc1080fd07a1';

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
  remainingStops: number;
  destination: {
    address: string;
    location: Location;
    eta: string;
  };
  isDelivered: boolean;
}

const driverData = ref<DriverData>({
  orderId: 'SH-2025-00421',
  driver: {
    address: 'Lade Adresse...',
    location: { lng: 0, lat: 0 },
  },
  remainingStops: 0,
  destination: {
    address: 'Lade Adresse...',
    location: { lng: 0, lat: 0 },
    eta: '14:30 Uhr',
  },
  isDelivered: false,
});

export function useTrackingData() {
  const { centerOnPoint, getAddressFromCoords } = useMapRoute();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const startTracking = () => {
    intervalId = setInterval(() => {
      fetchXroutenStatus();
    }, 10000);
  };
  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  onUnmounted(() => {
    stopTracking();
  });

  const stopps = computed(() => driverData.value.remainingStops);

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

  const fetchXroutenStatus = async () => {
    const url = `/api-xrouten/api/service-locations/${SERVICE_ID}/status`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `ApiKey ${API_KEY}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);

      const jsonData = await response.json();

      if (jsonData.driverLocation.coordinates) {
        const [lng, lat] = jsonData.driverLocation.coordinates;
        driverData.value.driver.location = {
          lng: parseFloat(lng),
          lat: parseFloat(lat),
        };
      }
      if (jsonData.remainingStops) {
        driverData.value.remainingStops = jsonData.remainingStops.length;
      }
      if (jsonData.destination.coordinates) {
        const [lng, lat] = jsonData.destination.coordinates;
        driverData.value.destination.location = {
          lng: parseFloat(lng),
          lat: parseFloat(lat),
        };
      }

      await updateAddressFromCoords();
      console.log(jsonData);
      return jsonData;
    } catch (error) {
      console.error('Tracking Update fehlgeschlagen:', error);
    }
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
    timelineItems,
    updateAddressFromCoords,
    handleCenterMap,
    fetchXroutenStatus,
    startTracking,
  };
}
