import React from 'react';
import type { TrafficSignal } from '../types';

type SignalResponse = {
  nearestSignalId: number | null;
  signalStatus: 'RED' | 'GREEN';
  distance: number;
  estimatedTimeSaved: number;
};

interface DashboardProps {
  signals: TrafficSignal[];
  lastResponse: SignalResponse | null;
  isActive: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ signals, lastResponse, isActive }) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Live Status Summary */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
        <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Priority Analytics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-600 text-sm font-medium">Dist to Signal</p>
            <p className="text-2xl font-bold text-blue-900">{lastResponse?.distance ?? 0}<span className="text-xs ml-1">m</span></p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-green-600 text-sm font-medium">Time Saved</p>
            <p className="text-2xl font-bold text-green-900">{lastResponse?.estimatedTimeSaved ?? 0}<span className="text-xs ml-1">min</span></p>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-5 border border-gray-200 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-700 text-sm font-bold uppercase tracking-wider">Signals Control</h2>
          <span className="flex items-center space-x-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>LIVE</span>
          </span>
        </div>
        
        <div className="space-y-3">
          {signals.map(sig => (
            <div key={sig.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 transition-all">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${sig.status === 'GREEN' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Signal #{sig.id}</p>
                  <p className="text-[10px] text-gray-400">Coordinates: {sig.latitude.toFixed(4)}, {sig.longitude.toFixed(4)}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${sig.status === 'GREEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {sig.status}
              </span>
            </div>
          ))}
          {signals.length === 0 && <p className="text-gray-400 text-sm text-center py-10 italic">Initializing signals...</p>}
        </div>
      </div>

      {/* Emergency Alert Popup Logic Simulated in Dashboard */}
      {lastResponse?.signalStatus === 'GREEN' && (
        <div className="bg-red-600 text-white rounded-xl p-4 shadow-xl animate-bounce flex items-center space-x-3 border-2 border-red-400">
          <div className="bg-white p-2 rounded-full text-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="font-bold text-sm uppercase">Priority Activated</p>
            <p className="text-xs opacity-90">Signal #{lastResponse.nearestSignalId} turned GREEN. Clearing corridor.</p>
          </div>
        </div>
      )}

      {/* Onboarding info */}
      {!isActive && (
        <div className="bg-gray-800 text-white rounded-xl p-5 shadow-inner">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Instructions</p>
          <p className="text-sm">Click <span className="text-red-400 font-bold uppercase underline">Start Emergency</span> to begin tracking. The system will auto-clear traffic lights as you approach.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
