import { shallowRef } from 'vue';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';

interface Location {
  lng: number;
  lat: number;
}

const map = shallowRef<mapboxgl.Map | null>(null);
const driverMarker = shallowRef<mapboxgl.Marker | null>(null);
const destinationMarker = shallowRef<mapboxgl.Marker | null>(null);
const mapLoaded = (mapInstance: mapboxgl.Map) =>
  new Promise((resolve) => {
    if (mapInstance.isStyleLoaded()) {
      resolve(true);
    } else {
      mapInstance.once('load', () => {
        resolve(true);
      });
    }
  });

export function useMap() {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Funktion zum Einrichten der Karte mit der Route
  async function setupMap(
    driver: Location,
    destination: Location,
    driverStatus: string
  ) {
    // Neue Karte erstellen und an das Div mit der ID 'map' binden
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [driver.lng, driver.lat],
      zoom: 2,
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapInstance.addControl(new mapboxgl.GeolocateControl(), 'top-right');
    map.value = mapInstance;

    // Warten bis der Kartenstil geladen ist, bevor Daten hinzugefügt werden
    try {
      await mapLoaded(mapInstance);
      // 1. Daten laden
      const data = await fetchRouteData(driver, destination);
      const routeGeometry = data.routes?.[0].geometry;
      const waypoints = data.waypoints;
      if (!routeGeometry) {
        console.warn('No route geometry found in API response.');
        return;
      }

      if (!driverMarker.value && driverStatus === 'pending') {
        driverMarker.value = new mapboxgl.Marker({
          element: createMarkerElement('/driver.png', 50),
          anchor: 'center',
        })
          .setLngLat(waypoints[0].location)
          .addTo(mapInstance);
      }

      if (!destinationMarker.value) {
        destinationMarker.value = new mapboxgl.Marker({
          color: '#f97316',
          anchor: 'center',
        })
          .setLngLat(destination)
          .addTo(mapInstance);
      }

      fitMapToMarkers(routeGeometry.coordinates, mapInstance, driverStatus);
    } catch (error) {
      console.error('Error during map route setup:', error);
    }
  }
  //Hilfsfunktion: Erzeugt ein HTML-Bildelement für benutzerdefinierte Marker
  function createMarkerElement(
    imageSource: string,
    size: number
  ): HTMLImageElement {
    const element = document.createElement('img');
    element.src = imageSource;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    return element;
  }
  //API-Aufruf: Abrufen der Routengeometrie von den Mapbox Directions Servern
  async function fetchRouteData(
    driver: Location,
    destination: Location,
    stops: Location[] = []
  ) {
    const coordParts: string[] = [];
    coordParts.push(`${driver.lng}, ${driver.lat}`);
    stops.forEach((stop) => {
      coordParts.push(`${stop.lng},${stop.lat}`);
    });
    coordParts.push(`${destination.lng},${destination.lat}`);
    const allCoordinatesString = coordParts.join(';');

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${allCoordinatesString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    const response = await fetch(url);
    // Fehlerprüfung: Falls der Server nicht mit 200 OK antwortet
    if (!response.ok) {
      throw new Error(
        `Directions API responded with status: ${response.status}`
      );
    }
    return await response.json();
  }
  // Funktion zum Anpassen des Kartenansichtsbereichs an die gesamte Route
  function fitMapToMarkers(
    coordinates: [number, number][],
    mapInstance: mapboxgl.Map,
    driverStatus: string
  ) {
    if (driverStatus === 'pending') {
      const bounds = new LngLatBounds();
      // Alle Koordinatenpunkte der Route in das Bounds-Objekt einschließen
      coordinates.forEach((coordinate) => {
        bounds.extend(coordinate);
      });
      const isMobile = window.innerWidth < 768;
      // Karte auf die berechneten Grenzen ausrichten (mit Puffer am Rand)
      mapInstance.fitBounds(bounds, {
        padding: isMobile
          ? { top: 80, bottom: 450, left: 40, right: 40 } // Viel Platz unten für das Panel
          : { top: 100, bottom: 100, left: 450, right: 100 },
        duration: 2800, // Zeit für die Kamerafahrt in Millisekunden
        maxZoom: 12,
      });
    } else {
      const destination = coordinates[coordinates.length - 1];
      mapInstance.flyTo({
        center: destination,
        zoom: 12,
        duration: 2000,
        essential: true,
      });
    }
  }
  // Funktion zum Zentrieren der Karte auf einen bestimmten Punkt
  function centerOnPoint(location: Location) {
    if (map.value) {
      map.value.flyTo({
        center: [location.lng, location.lat],
        zoom: 14, // Standard-Zoom-Level für die Detailansicht
        duration: 2000, // Dauer der Animation in ms
        essential: true, // Markiert die Animation als essentiell
      });
    }
  }
  // Funktion zum Abrufen der Adresse anhand von Koordinaten
  async function getAddressFromCoords(location: Location) {
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location.lng}&latitude=${location.lat}&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Mapbox v6 liefert die Adresse in 'features[0].properties.full_address'
      return (
        data.features?.[0].properties.full_address || 'Adresse nicht gefunden'
      );
    } catch (error) {
      console.error('Geocoding Fehler:', error);
      return 'Fehler bei der Adresssuche';
    }
  }
  // Funktion zum Aktualisieren des Fahrer-Markers
  async function updateDriver(
    newDriverLocation: Location,
    destination: Location,
    driverStatus: string
  ) {
    // 1. Wenn der Status nicht 'pending' ist, Marker sofort entfernen und Funktion beenden
    if (driverStatus !== 'pending') {
      driverMarker.value?.remove();
      driverMarker.value = null;
      centerOnPoint(destination);
      return;
    }

    try {
      const data = await fetchRouteData(newDriverLocation, destination);
      const waypoints = data.waypoints;

      if (driverMarker.value) {
        driverMarker.value.setLngLat(waypoints[0].location);
      }
    } catch (error) {
      console.error('Fehler beim Update des Markers:', error);
    }
  }

  return {
    setupMap,
    centerOnPoint,
    getAddressFromCoords,
    updateDriver,
    fetchRouteData,
  };
}
