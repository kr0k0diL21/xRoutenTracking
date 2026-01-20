// src/composables/useTrackingData.ts
import { ref, computed } from 'vue';
import { useMap } from './useMap';

const API_KEY = import.meta.env.VITE_XROUTEN_API_KEY;
const SERVICE_ID = '741258d4-b0cb-4005-b4bc-eecd6ee33f49';

interface Location {
  lng: number;
  lat: number;
}
interface Stop {
  coordinates: [string, string];
}

interface DriverData {
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
  driver: {
    address: 'Lade Adresse...',
    location: { lng: 0, lat: 0 },
  },
  remainingStops: 0,
  destination: {
    address: 'Lade Adresse...',
    location: { lng: 0, lat: 0 },
    eta: '',
  },
  status: '',
});

export function useTrackingData() {
  const { centerOnPoint, getAddressFromCoords, fetchRouteData } = useMap();
  const isLoading = ref(false);

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
            driverData.value.remainingStops <= 0
              ? 'Sie sind der nächste Halt'
              : 'Verbleibende Stopps: ' + driverData.value.remainingStops,
          subtitle:
            driverData.value.remainingStops > 1 ? 'Auf dem Weg' : 'Fast da',
        }
      );
    }

    if (status === 'completed') statusPrefix = 'Abgeschlossen ';
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
  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const nowDate = new Date();

    const isToday =
      date.getDate() === nowDate.getDate() &&
      date.getMonth() === nowDate.getMonth() &&
      date.getFullYear() === nowDate.getFullYear();

    const timeString = date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    if (isToday) {
      return `Heute, ${timeString} Uhr`;
    } else {
      const dateString = date.toLocaleDateString('de-DE');
      return `${dateString}, ${timeString} Uhr`;
    }
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

      if (jsonData.destination.coordinates) {
        const [lng, lat] = jsonData.destination.coordinates;
        driverData.value.destination.location = {
          lng: parseFloat(lng),
          lat: parseFloat(lat),
        };
      }
      if (jsonData.status) driverData.value.status = jsonData.status;
      if (jsonData.remainingStops) {
        driverData.value.remainingStops = jsonData.remainingStops.length;
        const now = new Date();
        const stopsForMap: Location[] = jsonData.remainingStops.map(
          (stop: Stop) => {
            const lng = parseFloat(stop.coordinates[0]);
            const lat = parseFloat(stop.coordinates[1]);
            return { lng, lat };
          }
        );
        const routeData = await fetchRouteData(
          driverData.value.driver.location,
          driverData.value.destination.location,
          stopsForMap
        );

        if (
          routeData.routes &&
          routeData.routes.length > 0 &&
          driverData.value.status === 'pending'
        ) {
          const travelTimeSeconds = routeData.routes[0].duration;
          const bufferSeconds = stopsForMap.length * 10 * 60;
          now.setSeconds(now.getSeconds() + travelTimeSeconds + bufferSeconds);
          driverData.value.destination.eta = formatTime(now.toISOString());
        } else {
          driverData.value.destination.eta = formatTime(now.toISOString());
        }
      }
      await updateAddressFromCoords();
      console.log(jsonData);
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
