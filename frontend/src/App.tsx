import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import MapComponent from './components/MapComponent';
import type { TrafficSignal } from './types';
import axios from 'axios';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

type AmbulanceLocation = {
  lat: number;
  lng: number;
  speed: number;
};

type SignalResponse = {
  nearestSignalId: number | null;
  signalStatus: 'RED' | 'GREEN';
  distance: number;
  estimatedTimeSaved: number;
};

const API_BASE_URL = 'http://localhost:8080/api';
const WS_URL = 'http://localhost:8080/ws';

const App: React.FC = () => {
  const [ambulancePos, setAmbulancePos] = useState<AmbulanceLocation | null>(null);
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [lastResponse, setLastResponse] = useState<SignalResponse | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stompClientRef = useRef<Client | null>(null);

  // ================= FETCH INITIAL SIGNALS =================
  const fetchSignals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/signals`);
      setSignals(response.data);
    } catch (err) {
      console.error("Backend offline. Using demo signals.", err);
      setSignals([
        { id: 1, latitude: 12.9716, longitude: 77.5946, status: 'RED' },
        { id: 2, latitude: 12.9750, longitude: 77.5980, status: 'RED' },
        { id: 3, latitude: 12.9800, longitude: 77.6000, status: 'RED' },
      ]);
    }
  };

  // ================= WEBSOCKET CONNECTION =================
  const connectWebSocket = () => {
    try {
      const socket = new SockJS(WS_URL);

      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('✅ Connected to WebSocket');

          stompClient.subscribe('/topic/signals', (message) => {
            try {
              const updatedSignal: TrafficSignal = JSON.parse(message.body);

              setSignals(prev =>
                prev.map(s =>
                  s.id === updatedSignal.id ? updatedSignal : s
                )
              );

            } catch (e) {
              console.error("WS message parse error", e);
            }
          });
        },
        onStompError: (frame) => {
          console.error('Broker error:', frame.headers['message']);
        }
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    } catch (err) {
      console.error('WebSocket connection failed:', err);
    }
  };

  // ================= SEND LOCATION TO BACKEND =================
  const updateBackend = async (loc: AmbulanceLocation) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/ambulance/location`, loc);
      setLastResponse(res.data);
    } catch (err) {
      console.error("Backend unreachable. Using simulation.", err);
      simulatePriority(loc);
    }
  };

  // ================= LOCAL SIMULATION (Fallback) =================
  const simulatePriority = (loc: AmbulanceLocation) => {
    let nearest: TrafficSignal | null = null;
    let minDistance = Infinity;

    const newSignals = signals.map(sig => {
      const dist = getDistance(loc.lat, loc.lng, sig.latitude, sig.longitude);

      if (dist < minDistance) {
        minDistance = dist;
        nearest = sig;
      }

      if (dist < 300) {
        return { ...sig, status: 'GREEN' as const };
      }

      return { ...sig, status: 'RED' as const };
    });

    setSignals(newSignals);

    setLastResponse({
      nearestSignalId: nearest ? nearest.id : null,
      signalStatus: minDistance < 300 ? 'GREEN' : 'RED',
      distance: Math.round(minDistance),
      estimatedTimeSaved: minDistance < 300 ? 4.5 : 0
    });
  };

  // ================= DISTANCE CALC =================
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // ================= START EMERGENCY =================
  const startEmergency = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setIsEmergencyActive(true);
    setError(null);
  };

  // ================= TRACK LOCATION =================
  useEffect(() => {
    let interval: any;

    if (isEmergencyActive) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              speed: pos.coords.speed || 40
            };

            setAmbulancePos(loc);
            updateBackend(loc);
          },
          (err) => {
            console.error("Geo error:", err);
            setError("Could not retrieve location.");
          },
          { enableHighAccuracy: true }
        );
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isEmergencyActive, signals]);

  // ================= INIT =================
  useEffect(() => {
    fetchSignals();
    
    // Try to connect WebSocket, but don't block if it fails
    try {
      connectWebSocket();
    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
    }

    return () => {
      try {
        stompClientRef.current?.deactivate();
      } catch (err) {
        console.error('Error deactivating WebSocket:', err);
      }
    };
  }, []);

  // ================= UI =================
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-sans">

      <header className="bg-red-600 text-white p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold">🚑 Smart Ambulance Priority System</h1>

        <button
          onClick={startEmergency}
          disabled={isEmergencyActive}
          className={`px-6 py-2 rounded-full font-bold ${
            isEmergencyActive
              ? 'bg-green-500'
              : 'bg-white text-red-600 hover:bg-gray-100'
          }`}
        >
          {isEmergencyActive ? '🚨 MISSION IN PROGRESS' : 'START EMERGENCY'}
        </button>
      </header>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 text-center">
          {error}
        </div>
      )}

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-md border">
          <MapComponent ambulancePos={ambulancePos} signals={signals} />
        </div>

        <aside className="w-full md:w-96">
          <Dashboard
            signals={signals}
            lastResponse={lastResponse}
            isActive={isEmergencyActive}
          />
        </aside>
      </main>

      <footer className="bg-white border-t p-3 text-center text-xs text-gray-500">
        Hackathon Edition 2024 • AI-Driven Green Corridor Simulation
      </footer>

    </div>
  );
};

export default App;
