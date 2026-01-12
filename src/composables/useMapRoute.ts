import { shallowRef } from 'vue';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';

interface Location {
  lng: number;
  lat: number;
}

const map = shallowRef<mapboxgl.Map | null>(null);
const driverMarker = shallowRef<mapboxgl.Marker | null>(null);
const destinationMarker = shallowRef<mapboxgl.Marker | null>(null);

export function useMapRoute() {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Funktion zum Einrichten der Karte mit der Route
  async function setupMapWithRoute(
    start: Location,
    destination: Location,
    isDelivered: boolean
  ) {
    // Neue Karte erstellen und an das Div mit der ID 'map' binden
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/standard',
      center: [start.lng, start.lat],
      zoom: 2,
    });

    mapInstance.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      'top-right'
    );
    mapInstance.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true,
      }),
      'top-right'
    );
    map.value = mapInstance;

    // Warten bis der Kartenstil geladen ist, bevor Daten hinzugefügt werden
    mapInstance.on('load', async () => {
      try {
        // 1. Daten laden
        const data = await fetchRouteData(start, destination);
        const routeGeometry = data.routes?.[0]?.geometry;
        const waypoints = data.waypoints;
        // Falls keine Route gefunden wurde, Vorgang abbrechen
        if (!routeGeometry) {
          console.warn('No route geometry found in API response.');
          return;
        }

        // 2. Datenquelle (Source) definieren
        mapInstance.addSource('route-source', {
          type: 'geojson',
          data: routeGeometry,
        });
        if (!isDelivered) {
          // 3. Grafische Ebene (Layer) für die Linie hinzufügen
          mapInstance.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route-source',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#f97316',
              'line-width': 5,
              'line-opacity': 0.9,
            },
          });
          if (!driverMarker.value && !isDelivered) {
            driverMarker.value = new mapboxgl.Marker({
              element: createMarkerElement('/start.png', 50),
              anchor: 'center',
            })
              .setLngLat(waypoints[0].location)
              .addTo(mapInstance);
          }
        }
        if (!destinationMarker.value) {
          destinationMarker.value = new mapboxgl.Marker({
            color: '#f97316',
            anchor: 'center',
          })
            .setLngLat(waypoints[1].location)
            .addTo(mapInstance);
        }

        fitMapToRoute(routeGeometry.coordinates, mapInstance, isDelivered);
      } catch (error) {
        console.error('Error during map route setup:', error);
      }
    });
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
  async function fetchRouteData(driver: Location, destination: Location) {
    // Koordinaten für die URL im Format 'lng,lat;lng,lat' aufbereiten
    const coordinates = `${driver.lng},${driver.lat};${destination.lng},${destination.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
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
  function fitMapToRoute(
    coordinates: [number, number][],
    mapInstance: mapboxgl.Map,
    isDelivered: boolean
  ) {
    if (isDelivered) {
      const destination = coordinates[coordinates.length - 1];
      mapInstance.flyTo({
        center: destination,
        zoom: 12,
        duration: 2000,
        essential: true,
      });
      return;
    }
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
  async function getAddressFromCoords(location: Location): Promise<string> {
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location.lng}&latitude=${location.lat}&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Mapbox v6 liefert die Adresse in 'features[0].properties.full_address'
      return (
        data.features?.[0]?.properties?.full_address || 'Adresse nicht gefunden'
      );
    } catch (error) {
      console.error('Geocoding Fehler:', error);
      return 'Fehler bei der Adresssuche';
    }
  }
  // Funktion zum Aktualisieren der Route und des Fahrer-Markers
  async function updateRouteAndMarker(
    newDriverLocation: Location,
    destination: Location
  ) {
    const mapInstance = map.value;
    const data = await fetchRouteData(newDriverLocation, destination);
    const waypoints = data.waypoints;
    const routeGeometry = data.routes?.[0]?.geometry;
    if (driverMarker.value) {
      driverMarker.value.setLngLat(waypoints[0].location);
    }
    if (mapInstance && routeGeometry) {
      (mapInstance.getSource('route-source') as mapboxgl.GeoJSONSource).setData(
        routeGeometry
      );
    }
  }
  return {
    setupMapWithRoute,
    centerOnPoint,
    getAddressFromCoords,
    updateRouteAndMarker,
  };
}
