export interface TrafficSignal {
  id: number;
  latitude: number;
  longitude: number;
  status: 'RED' | 'GREEN';
  lastActivatedTime?: string;
}

export interface AmbulanceLocation {
  lat: number;
  lng: number;
  speed: number;
}

export interface SignalResponse {
  nearestSignalId: number | null;
  signalStatus: 'RED' | 'GREEN';
  distance: number;
  estimatedTimeSaved: number;
}
