
import React, { useState, useEffect, useCallback } from 'react';
import { WheelItem, WheelConfig, UserSession } from './types';
import { INITIAL_ITEMS, AVAILABLE_FONTS, WHEEL_COLORS } from './constants';
import { RotateCcw, ShieldCheck, Lock, MapPin, Cloud, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const STORAGE_KEY = 'da_strength_club_v5_active';

const App: React.FC = () => {
  const [items, setItems] = useState<WheelItem[]>(INITIAL_ITEMS);
  const [spinDuration, setSpinDuration] = useState(4);
  const [user, setUser] = useState<UserSession | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);
    const extraSpins = 6 + Math.random() * 4;
    const targetRotation = rotation + (extraSpins * 360) + Math.random() * 360;
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const sliceSize = 360 / items.length;
      const finalRotation = targetRotation % 360;
      let winningAngle = (270 - finalRotation) % 360;
      if (winningAngle < 0) winningAngle += 360;
      const winningIndex = Math.floor(winningAngle / sliceSize);
      setResult(items[winningIndex]);
    }, spinDuration * 1000);
  };

  const handleAiSuggest = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 5 fun items for a wheel about: ${aiPrompt}. Return JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      });
      const suggestions = JSON.parse(response.text || '[]');
      const newItems = suggestions.map((s: string, i: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        label: s,
        color: WHEEL_COLORS[(items.length + i) % WHEEL_COLORS.length]
      }));
      setItems([...items, ...newItems]);
      setAiPrompt('');
    } catch (e) {
      console.error(e);
    }
    setIsAiLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900/10 backdrop-blur-md">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-100">
          <ShieldCheck size={48} className="text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-center mb-8">Member Login</h2>
          <input 
            type="email" 
            placeholder="Gmail Address" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 font-bold"
            onChange={(e) => setUser({ email: e.target.value, phone: '', hasSpun: false, isVerified: true })}
          />
          <button onClick={() => setIsAdmin(true)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl">ENTER CLUB</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <RotateCcw className="text-indigo-600" size={32} />
          <div>
            <h1 className="text-xl font-black tracking-tighter">DA STRENGTH SPIN</h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Secured Protocol</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2">
            <Cloud size={18} />
            <span className="text-xs font-bold">Drive Synced</span>
          </div>
          <button onClick={() => setUser(null)} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            <Lock size={18} className="text-slate-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-8 flex flex-col xl:flex-row gap-12">
        {isAdmin && (
          <aside className="w-full xl:w-[400px] space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Wheel Content</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="AI Suggestions..." 
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" 
                  />
                  <button onClick={handleAiSuggest} className="p-3 bg-indigo-600 text-white rounded-xl">
                    {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  </button>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <input 
                      value={item.label}
                      onChange={(e) => setItems(items.map(it => it.id === item.id ? {...it, label: e.target.value} : it))}
                      className="flex-1 bg-transparent text-sm font-bold outline-none" 
                    />
                    <button onClick={() => setItems(items.filter(it => it.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => setItems([...items, { id: Math.random().toString(36).substr(2, 9), label: 'New Item', color: WHEEL_COLORS[items.length % WHEEL_COLORS.length] }])} className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-indigo-200 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Slice
                </button>
              </div>
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[48px] shadow-2xl border border-slate-100 p-12 relative overflow-hidden">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-slate-800 mb-2">VALOR IS A CHOICE</h2>
            <p className="text-indigo-600 font-serif italic text-xl">Make your own fate.</p>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-20">
              <div className="w-1 h-12 bg-indigo-600 rounded-full shadow-lg" />
              <div className="w-6 h-6 bg-indigo-600 rotate-45 -mt-4 rounded-sm border-2 border-white" />
            </div>

            <svg viewBox="0 0 100 100" className="w-80 h-80 md:w-[450px] md:h-[450px] drop-shadow-2xl overflow-visible">
              <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%', transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.15, 0, 0.15, 1)` : 'none' }}>
                {items.map((item, i) => {
                  const slice = 360 / items.length;
                  const start = i * slice;
                  const end = (i + 1) * slice;
                  const x1 = 50 + 50 * Math.cos((Math.PI * start) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * start) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * end) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * end) / 180);
                  return (
                    <g key={item.id}>
                      <path d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${slice > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={item.color} />
                      <text x="80" y="50" fill="white" fontSize="3" fontWeight="900" transform={`rotate(${start + slice / 2}, 50, 50)`}>{item.label}</text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="8" fill="white" />
                <circle cx="50" cy="50" r="4" fill="#6366f1" />
              </g>
            </svg>
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning}
            className={`mt-12 px-20 py-6 rounded-3xl font-black text-2xl shadow-2xl transition-all active:scale-95 ${isSpinning ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:brightness-110'}`}
          >
            {isSpinning ? 'SPINNING...' : 'TAP TO SPIN'}
          </button>
        </div>
      </main>

      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-8">
          <div className="bg-white p-12 rounded-[48px] max-w-lg w-full text-center border-4 border-emerald-300 shadow-[0_0_100px_rgba(16,185,129,0.3)]">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-emerald-600 mb-8">Victory Unlocked</h2>
            <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 mb-10">
              <p className="text-5xl font-black text-indigo-600 tracking-tighter">{result.label}</p>
            </div>
            <button onClick={() => setResult(null)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl">COLLECT REWARD</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
