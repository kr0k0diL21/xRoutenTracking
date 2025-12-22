import { shallowRef } from 'vue';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';

const map = shallowRef<mapboxgl.Map | null>(null);

interface Location {
  lng: number;
  lat: number;
}

export function useMapRoute() {
  // shallowRef für bessere Performance

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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

  /**
   * API-Aufruf: Abrufen der Routengeometrie von den Mapbox Directions Servern
   */
  async function fetchRouteData(start: Location, destination: Location) {
    // Koordinaten für die URL im Format 'lng,lat;lng,lat' aufbereiten
    const coordinates = `${start.lng},${start.lat};${destination.lng},${destination.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    const response = await fetch(url);

    // Fehlerprüfung: Falls der Server nicht mit 200 OK antwortet
    if (!response.ok) {
      throw new Error(
        `Directions API responded with status: ${response.status}`
      );
    }

    return await response.json();
  }

  /**
   * Kamera-Steuerung: Berechnet den optimalen Zoom, damit die ganze Route sichtbar ist
   */
  function fitMapToRoute(
    coordinates: [number, number][],
    mapInstance: mapboxgl.Map
  ) {
    const bounds = new LngLatBounds();

    // Alle Koordinatenpunkte der Route in das Bounds-Objekt einschließen
    coordinates.forEach((coordinate) => {
      bounds.extend(coordinate);
    });

    // Karte auf die berechneten Grenzen ausrichten (mit Puffer am Rand)
    mapInstance.fitBounds(bounds, {
      padding: 50,
      duration: 2800, // Zeit für die Kamerafahrt in Millisekunden
      maxZoom: 12,
    });
  }

  /**
   * Hauptfunktion: Initialisiert die Karte und steuert den gesamten Prozess
   */
  async function setupMapWithRoute(start: Location, destination: Location) {
    // Neue Karte erstellen und an das Div mit der ID 'map' binden
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/standard',
      center: [start.lng, start.lat],
      zoom: 2,
    });

    map.value = mapInstance;

    // Standard-Steuerelemente (Zoom, Kompass, Geolokalisierung) hinzufügen
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

    // Warten bis der Kartenstil geladen ist, bevor Daten hinzugefügt werden
    mapInstance.on('load', async () => {
      try {
        // 1. Daten laden
        const data = await fetchRouteData(start, destination);
        const routeGeometry = data.routes?.[0]?.geometry;

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

        // 3. Grafische Ebene (Layer) für die Linie hinzufügen
        mapInstance.addLayer({
          id: 'route-layer',
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.9,
          },
        });

        // 4. Marker für Start und Ziel an den Positionen der Wegpunkte platzieren
        const waypoints = data.waypoints;

        new mapboxgl.Marker({
          element: createMarkerElement('/start.png', 50),
          anchor: 'center',
        })
          .setLngLat(waypoints[0].location)
          .addTo(mapInstance);

        new mapboxgl.Marker({
          element: createMarkerElement('/ziel.png', 50),
          anchor: 'center',
        })
          .setLngLat(waypoints[1].location)
          .addTo(mapInstance);

        // 5. Kartenausschnitt final an Route anpassen
        fitMapToRoute(routeGeometry.coordinates, mapInstance);
      } catch (error) {
        // Zentrales Error-Handling für den API-Aufruf und die Karteninitialisierung
        console.error('Error during map route setup:', error);
      }
    });
  }

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

  return {
    map,
    setupMapWithRoute,
    centerOnPoint,
  };
}
