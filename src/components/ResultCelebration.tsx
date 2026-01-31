import React, { useEffect, useState } from 'react';
import { WheelItem } from '../types';
import { Trophy, Box, Star, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface ResultCelebrationProps {
  result: WheelItem; font: string; offerTitle: string; headerText: string; footerText: string; userEmail: string;
  gymEmail: string; gymPhone: string; gymAddress: string; gymLocation: string;
  onClose: () => void; onContextMenu: (e: React.MouseEvent, options: any[]) => void; setEditorTab: (tab: 'content' | 'text' | 'font' | 'admin') => void;
}

const ResultCelebration: React.FC<ResultCelebrationProps> = ({ 
  result, font, offerTitle, userEmail, gymEmail, gymPhone, gymAddress, gymLocation, onClose 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-6">
      <div className="bg-white rounded-[40px] p-10 max-w-xl w-full text-center space-y-8 shadow-2xl">
        <div className="bg-emerald-600 text-white py-12 rounded-[30px] shadow-xl border-4 border-emerald-300">
          <h2 className="text-xl font-black uppercase tracking-widest mb-4">{offerTitle}</h2>
          <p className="text-5xl font-black" style={{ fontFamily: font }}>{result.label}</p>
        </div>
        
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Mail className="text-indigo-500" size={20} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Verification Sent To</p>
              <p className="text-sm font-bold text-slate-700">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <MapPin className="text-indigo-500" size={20} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Collect At</p>
              <p className="text-sm font-bold text-slate-700">{gymAddress}</p>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all">COLLECT REWARD</button>
      </div>
    </div>
  );
};

export default ResultCelebration;