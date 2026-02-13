import React, { useEffect, useRef } from 'react';
import type { TrafficSignal } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type AmbulanceLocation = {
  lat: number;
  lng: number;
  speed: number;
};

interface MapComponentProps {
  ambulancePos: AmbulanceLocation | null;
  signals: TrafficSignal[];
}

const MapComponent: React.FC<MapComponentProps> = ({ ambulancePos, signals }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const ambulanceMarker = useRef<any>(null);
  const signalMarkers = useRef<Map<number, any>>(new Map());

  // Helper to create circular icons for signals
  const createSignalIcon = (status: 'RED' | 'GREEN') => {
    const color = status === 'GREEN' ? '#10B981' : '#EF4444';
    const shadow = status === 'GREEN' ? '0 0 10px rgba(16,185,129,0.8)' : 'none';
    
    return L.divIcon({
      className: 'custom-signal-icon',
      html: `<div style="
        width: 24px; 
        height: 24px; 
        background-color: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: ${shadow};
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Helper for ambulance icon
  const ambulanceIcon = L.divIcon({
    className: 'custom-ambulance-icon',
    html: `<div style="
      width: 32px; 
      height: 32px; 
      background-color: #DC2626; 
      border: 3px solid white; 
      border-radius: 8px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    ">🚑</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  useEffect(() => {
    if (mapContainerRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainerRef.current).setView([12.9716, 77.5946], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update Ambulance Marker
  useEffect(() => {
    if (mapInstance.current && ambulancePos) {
      const pos: [number, number] = [ambulancePos.lat, ambulancePos.lng];

      if (!ambulanceMarker.current) {
        ambulanceMarker.current = L.marker(pos, { icon: ambulanceIcon }).addTo(mapInstance.current);
      } else {
        ambulanceMarker.current.setLatLng(pos);
      }

      // Smoothly pan to ambulance
      mapInstance.current.panTo(pos);
    }
  }, [ambulancePos]);

  // Update Signal Markers
  useEffect(() => {
    if (mapInstance.current) {
      signals.forEach(sig => {
        const pos: [number, number] = [sig.latitude, sig.longitude];
        let marker = signalMarkers.current.get(sig.id);

        if (!marker) {
          marker = L.marker(pos, { icon: createSignalIcon(sig.status) })
            .bindPopup(`Signal #${sig.id}`)
            .addTo(mapInstance.current);
          signalMarkers.current.set(sig.id, marker);
        } else {
          marker.setIcon(createSignalIcon(sig.status));
        }
      });
    }
  }, [signals]);

  return <div ref={mapContainerRef} className="w-full h-full z-0" />;
};

export default MapComponent;
