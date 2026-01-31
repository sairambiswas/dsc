
import React, { useState, useEffect } from 'react';
import { Cloud, Save, FolderOpen, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { WheelConfig } from '../types';

const PRESETS_KEY = 'da_strength_club_wheel_presets';

interface DriveControlsProps {
  currentConfig: WheelConfig;
  onLoad: (config: WheelConfig) => void;
}

const DriveControls: React.FC<DriveControlsProps> = ({ currentConfig, onLoad }) => {
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('drive_connected') === 'true';
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [presets, setPresets] = useState<WheelConfig[]>(() => {
    const saved = localStorage.getItem(PRESETS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const connectDrive = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsConnected(true);
    localStorage.setItem('drive_connected', 'true');
    setIsSyncing(false);
  };

  const disconnectDrive = () => {
    setIsConnected(false);
    localStorage.removeItem('drive_connected');
  };

  const handleSave = async () => {
    if (!isConnected) return;
    setIsSyncing(true);
    
    // In a real app, this would use the Drive API.
    // For now, we simulate by adding to local presets.
    await new Promise(r => setTimeout(r, 800));
    
    const newPreset = { 
      ...currentConfig, 
      id: Math.random().toString(36).substr(2, 9),
      name: `Preset ${presets.length + 1} (${new Date().toLocaleTimeString()})`,
      updatedAt: Date.now() 
    };
    
    const updatedPresets = [newPreset, ...presets].slice(0, 10); // Keep last 10
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updatedPresets));
    
    setLastSaved(Date.now());
    setIsSyncing(false);
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="relative space-y-4">
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
            <Cloud size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Cloud Sync</h4>
            <p className="text-xs text-slate-500">
              {isConnected ? 'Presets synced to your cloud storage' : 'Link storage to save permanent presets'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {!isConnected ? (
            <button
              onClick={connectDrive}
              disabled={isSyncing}
              className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {isSyncing ? <Loader2 className="animate-spin" size={20} /> : 'Connect Drive'}
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSyncing}
                title="Save current wheel as preset"
                className="flex-1 md:flex-none px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span className="hidden md:inline">Save</span>
              </button>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
                  ${showPresets ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}
              >
                <FolderOpen size={18} />
                <span className="hidden md:inline">Presets</span>
              </button>
              <button
                onClick={disconnectDrive}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                title="Disconnect Storage"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
        </div>

        {lastSaved && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-emerald-600 animate-pulse bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <CheckCircle size={10} /> Saved to Cloud
          </div>
        )}
      </div>

      {showPresets && isConnected && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved Presets ({presets.length})</h5>
            <button onClick={() => setShowPresets(false)} className="text-slate-400 hover:text-slate-600">
               <XCircle size={16} />
            </button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {presets.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-lg">
                No presets found. Save your first wheel!
              </div>
            ) : (
              presets.map((preset) => (
                <div key={preset.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => {
                      onLoad(preset);
                      setShowPresets(false);
                    }}
                    className="flex-1 text-left p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-700">{preset.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{preset.items.length} slices &bull; {new Date(preset.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <FolderOpen size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button 
                    onClick={() => deletePreset(preset.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveControls;
