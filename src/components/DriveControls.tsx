import React, { useState } from 'react';
import { Cloud, Save, FolderOpen, Loader2, XCircle } from 'lucide-react';
import { WheelConfig } from '../types';

const PRESETS_KEY = 'da_strength_club_wheel_presets';

interface DriveControlsProps {
  currentConfig: WheelConfig;
  onLoad: (config: WheelConfig) => void;
}

const DriveControls: React.FC<DriveControlsProps> = ({ currentConfig, onLoad }) => {
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem('drive_connected') === 'true');
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Cloud className={isConnected ? "text-emerald-600" : "text-indigo-600"} size={24} />
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Cloud Sync</h4>
          <p className="text-[10px] text-slate-500">{isConnected ? 'Synced' : 'Not Connected'}</p>
        </div>
      </div>
      {!isConnected ? (
        <button onClick={() => setIsConnected(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Connect</button>
      ) : (
        <button onClick={() => setIsConnected(false)} className="text-slate-300 hover:text-rose-500"><XCircle size={18} /></button>
      )}
    </div>
  );
};

export default DriveControls;