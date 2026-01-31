import React, { useState } from 'react';
import { Cloud, XCircle } from 'lucide-react';
import { WheelConfig } from '../types';

interface DriveControlsProps {
  currentConfig: WheelConfig;
  onLoad: (config: WheelConfig) => void;
}

const DriveControls: React.FC<DriveControlsProps> = ({ currentConfig, onLoad }) => {
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem('drive_connected') === 'true');

  const handleConnect = () => {
    setIsConnected(true);
    localStorage.setItem('drive_connected', 'true');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.removeItem('drive_connected');
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-2xl transition-all ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
          <Cloud size={24} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest leading-none mb-1">Google Drive</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{isConnected ? 'Link Active' : 'Not Connected'}</p>
        </div>
      </div>
      {!isConnected ? (
        <button onClick={handleConnect} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Connect</button>
      ) : (
        <button onClick={handleDisconnect} className="text-slate-300 hover:text-rose-400 transition-all">
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default DriveControls;