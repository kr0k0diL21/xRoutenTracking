// src/types/trackingDataTypes.ts
export interface Coordinates {
  lng: number;
  lat: number;
}
export interface xRoutenTrackingData {
  start: {
    coordinates: Coordinates;
    timestamp: string;
    address: string;
  };
  end: {
    coordinates: Coordinates;
    address: string;
  };
  remainingStops: number;
  status: string;
}


