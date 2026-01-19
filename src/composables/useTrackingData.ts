// src/composables/useTrackingData.ts
import { ref, computed } from 'vue';
import { useMap } from './useMap';

const API_KEY = import.meta.env.VITE_XROUTEN_API_KEY;
const SERVICE_ID = '69dc5122-e7e3-44e9-aecc-6faf0efd9288';

interface Location {
  lng: number;
  lat: number;
}

interface DriverData {
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
  status: string;
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
  status: '',
});

export function useTrackingData() {
  const { centerOnPoint, getAddressFromCoords } = useMap();
  const isLoading = ref(false);
  const stopps = computed(() => driverData.value.remainingStops);

  const timelineItems = computed(() => {
    const items = [];
    const status = driverData.value.status;
    let statusPrefix = 'Ankunft ca. ';

    if (status === 'pending') {
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
          subtitle: stopps.value > 1 ? 'Auf dem Weg' : 'Fast da',
        }
      );
    }

    if (status === 'completed') statusPrefix = 'Abgeschlossen um ';
    if (status === 'failed') statusPrefix = 'Zustellung fehlgeschlagen ';
    if (status === 'unknown') statusPrefix = 'Status aktuell unbekannt ';

    items.push({
      type: 'destination',
      title: 'Ziel',
      subtitle: driverData.value.destination.address,
      eta: driverData.value.destination.eta,
      status: statusPrefix,
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
    isLoading.value = true;
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
      if (jsonData.status) driverData.value.status = jsonData.status;
      await updateAddressFromCoords();
      console.log(jsonData);
      console.log(JSON.parse(JSON.stringify(driverData.value)));
      return jsonData;
    } catch (error) {
      console.error('Tracking Update fehlgeschlagen:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateAddressFromCoords = async () => {
    driverData.value.driver.address = await getAddressFromCoords(
      driverData.value.driver.location
    );
    console.log(driverData.value.driver.address);
    if (driverData.value.destination.address === 'Lade Adresse...') {
      driverData.value.destination.address = await getAddressFromCoords(
        driverData.value.destination.location
      );
    }
  };
  return {
    driverData,
    timelineItems,
    isLoading,
    updateAddressFromCoords,
    handleCenterMap,
    fetchXroutenStatus,
  };
}
