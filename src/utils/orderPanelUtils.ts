//src/utils/orderPanelUtils.ts
import type { xRoutenTrackingData } from "@/types/trackingDataTypes";

// Statuskonfiguration für verschiedene Zustände
export const statusConfig = {
  pending: {
    label: 'Unterwegs',
    badge:
      'bg-blue-100 text-blue-800 ring-blue-200 hover:bg-blue-200 cursor-pointer',
    dot: 'bg-blue-500',
    text: 'text-blue-800',
  },
  completed: {
    label: 'Erledigt',
    badge: 'bg-green-100 text-green-800 ring-green-200 cursor-default',
    dot: 'bg-green-500',
    text: 'text-green-800',
  },
  failed: {
    label: 'Fehlgeschlagen',
    badge: 'bg-red-100 text-red-800 ring-red-200 cursor-default',
    dot: 'bg-red-500',
    text: 'text-red-800',
  },
  unknown: {
    label: 'Unbekannt',
    badge: 'bg-gray-100 text-gray-800 ring-gray-200 cursor-default',
    dot: 'bg-gray-500',
    text: 'text-gray-800',
  },
  loading:{
    label: 'Lädt...',
    badge: 'bg-gray-100 text-gray-400 ring-gray-200 cursor-default',
    dot: 'bg-gray-400',
    text: 'text-gray-400',
  },
};

// Funktion zum Generieren der Statuskonfiguration basierend auf den Tracking-Daten
export function getStatusConfig(data: xRoutenTrackingData | null) {
  // Standardkonfiguration für den Ladezustand
  if (!data) {
    return [
      {
        type: 'loading',
        title: 'Lädt...',
        address: '',
      },
    ];
  }
  const items = [];
  let statusPrefix = 'Ankunft ca. ';

  // Fahrer-Sektion & verbleibende Stopps
  if (data.status === 'pending') {
    items.push(
      {
        type: 'driver',
        title: 'Fahrer',
        address: data.start.address,
      },
      {
        type: 'stop',
        title:
          data.remainingStops <= 0
            ? 'Sie sind der nächste Halt'
            : 'Verbleibende Stopps: ' + data.remainingStops,
        subtitel: data.remainingStops > 1 ? 'Auf dem Weg' : 'Fast da',
      }
    );
  }

  // Präfixe für das Ziel
  if (data.status === 'completed') statusPrefix = 'Abgeschlossen ';
  if (data.status === 'failed') statusPrefix = 'Zustellung fehlgeschlagen ';
  if (data.status === 'unknown') statusPrefix = 'Status aktuell unbekannt ';

 // Ziel-Sektion
  items.push({
    type: 'destination',
    title: 'Ziel',
    address: data.end.address,
    timestamp: data.start.timestamp,
    status: statusPrefix,
  });

  return items;
}
