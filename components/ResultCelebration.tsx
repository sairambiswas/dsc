
import React, { useEffect, useState } from 'react';
import { WheelItem } from '../types';
import { Trophy, Box, Star, Sparkles, Send, Mail, Phone, MapPin, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';

interface ResultCelebrationProps {
  result: WheelItem;
  font: string;
  offerTitle: string;
  headerText: string;
  footerText: string;
  userEmail: string;
  gymEmail: string;
  gymPhone: string;
  gymAddress: string;
  gymLocation: string;
  onClose: () => void;
  onContextMenu: (e: React.MouseEvent, options: any[]) => void;
  setEditorTab: (tab: 'content' | 'text' | 'font' | 'admin') => void;
}

const ResultCelebration: React.FC<ResultCelebrationProps> = ({ 
  result, font, offerTitle, headerText, footerText, userEmail, 
  gymEmail, gymPhone, gymAddress, gymLocation,
  onClose, onContextMenu, setEditorTab 
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const fireworks = Array.from({ length: 12 }).map((_, i) => ({
    angle: (i / 12) * 360,
    distance: 150 + Math.random() * 100,
    delay: Math.random() * 2,
    color: result.color,
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-700 overflow-hidden cursor-context-menu">
      <style>{`
        @keyframes firework {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
        .firework-particle { animation: firework 1.5s ease-out infinite; animation-delay: var(--delay); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .float-anim { animation: float 3.2s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2].map((burstIdx) => (
          <div key={burstIdx} className="absolute" style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}>
            {fireworks.map((fw, i) => (
              <div key={i} className="firework-particle absolute w-2 h-2 rounded-full" style={{ backgroundColor: fw.color, '--tx': `${Math.cos((fw.angle * Math.PI) / 180) * fw.distance}px`, '--ty': `${Math.sin((fw.angle * Math.PI) / 180) * fw.distance}px`, '--delay': `${fw.delay + burstIdx * 0.5}s` } as any} />
            ))}
          </div>
        ))}
      </div>

      <div className="relative flex flex-col items-center w-full max-w-5xl px-6 lg:flex-row gap-12 lg:items-start lg:justify-center">
        
        {/* Victory Card */}
        <div className={`flex flex-col items-center transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <div className="float-anim relative bg-emerald-600 text-white px-10 py-12 rounded-[60px] shadow-[0_40px_100px_rgba(16,185,129,0.5)] border-4 border-emerald-300 flex flex-col items-center gap-4 w-[340px] md:w-[420px]">
            <div className="flex items-center gap-4">
              <Box size={42} className="text-emerald-100" />
              <h2 className="font-black text-2xl uppercase tracking-[0.4em]">{offerTitle}</h2>
            </div>
            <div className="mt-4 p-10 bg-white rounded-[45px] shadow-inner border-2 border-emerald-100 w-full text-center">
              <p className="text-6xl font-black tracking-tighter" style={{ color: result.color, fontFamily: font }}>{result.label}</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-amber-400 p-5 rounded-full rotate-12 shadow-xl border-4 border-white"><Star size={36} className="text-white fill-white" /></div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button onClick={onClose} className="px-14 py-6 bg-white text-indigo-700 rounded-full font-black text-2xl shadow-2xl flex items-center gap-4 active:scale-95 transition-all border-b-8 border-slate-200">
              <Trophy size={28} className="text-amber-500" /> COLLECT REWARD
            </button>
            <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[11px] opacity-60">{footerText}</p>
          </div>
        </div>

        {/* Info Sent Notification Card */}
        <div className={`flex flex-col gap-6 max-w-md w-full transition-all duration-1000 delay-500 ${showContent ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
          
          {/* Gym Contact Section */}
          <div className="bg-white rounded-[45px] p-10 shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
              <ShieldCheck size={120} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-emerald-500" />
                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Club Information Sent</h3>
              </div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">Da Strength Club HQ</p>
            </div>
            
            <div className="space-y-5 relative z-10">
              {/* Maps Integration UI */}
              <div className="flex items-start gap-5 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <MapPin size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Location</p>
                  <p className="text-sm font-bold text-slate-700 leading-tight">{gymAddress}</p>
                  <a href={gymLocation} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-black text-indigo-600 uppercase mt-1.5 hover:gap-2.5 transition-all">
                    Open Navigation <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Direct Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <Mail className="text-indigo-500" size={20} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Redemption Email</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">{gymEmail}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <Phone className="text-indigo-500" size={20} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Direct Hotline</p>
                    <p className="text-[11px] font-bold text-slate-700">{gymPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Box */}
          <div className="bg-slate-800 rounded-[45px] p-10 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-400">
               <Sparkles size={100} />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Personal Certificate</h4>
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-300 italic">
                "Hello! We are thrilled to confirm your win. This reward is officially logged against your session. Please visit the HQ to claim your prize. Our team is ready to welcome you."
              </p>
              <div className="pt-4 flex items-center gap-3 border-t border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Send size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Destination Hub</p>
                  <p className="text-xs font-bold text-white">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCelebration;
