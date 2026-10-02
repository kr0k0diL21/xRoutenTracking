// src/types/trackingDataTypes.ts
export interface Coordinates {
  lng: number;
  lat: number;
}
export interface xRoutenTrackingData {
  // Position des Fahrers. Die API liefert sie nur, solange dieser Halt der
  // nächste des Fahrers ist; für alle späteren Halte ist sie null.
  start: {
    coordinates: Coordinates;
    address: string;
  } | null;
  // Geplante Ankunft, oder 'keine Angabe', wenn die API keine liefert.
  arrival: string;
  end: {
    coordinates: Coordinates;
    address: string;
  };
  remainingStops: number;
  status: string;
  contactEmail: string | null;
  contactPhone: string | null;
}
