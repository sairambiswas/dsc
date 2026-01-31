import React, { useState, useRef } from 'react';
import { WheelItem } from '../types';
import { WHEEL_COLORS, AVAILABLE_FONTS } from '../constants';
import { generateWheelSuggestions } from '../services/geminiService';
import { Plus, Trash2, Sparkles, Loader2, Settings2, Palette, Type, Image as ImageIcon, Layout, Mail, Phone, MapPin } from 'lucide-react';

interface WheelEditorProps {
  items: WheelItem[]; setItems: (items: WheelItem[]) => void;
  spinDuration: number; setSpinDuration: (val: number) => void;
  overrideResultId: string | null; setOverrideResultId: (id: string | null) => void;
  logoUrl: string | null; setLogoUrl: (url: string | null) => void;
  font: string; setFont: (font: string) => void;
  fontSize: number; setFontSize: (size: number) => void;
  appTitle: string; setAppTitle: (v: string) => void;
  appSubtitle: string; setAppSubtitle: (v: string) => void;
  heroTitle: string; setHeroTitle: (v: string) => void;
  heroSubtitle: string; setHeroSubtitle: (v: string) => void;
  offerTitle: string; setOfferTitle: (v: string) => void;
  celebrationHeader: string; setCelebrationHeader: (v: string) => void;
  celebrationFooter: string; setCelebrationFooter: (v: string) => void;
  spinButtonText: string; setSpinButtonText: (v: string) => void;
  spinButtonColor: string; setSpinButtonColor: (v: string) => void;
  footerText: string; setFooterText: (v: string) => void;
  gymEmail: string; setGymEmail: (v: string) => void;
  gymPhone: string; setGymPhone: (v: string) => void;
  gymLocation: string; setGymLocation: (v: string) => void;
  gymAddress: string; setGymAddress: (v: string) => void;
  activeTab: 'content' | 'text' | 'font' | 'admin'; setActiveTab: (tab: 'content' | 'text' | 'font' | 'admin') => void;
}

const WheelEditor: React.FC<WheelEditorProps> = (props) => {
  const { items, setItems, spinDuration, setSpinDuration, activeTab, setActiveTab } = props;
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addItem = (label: string) => {
    if (!label.trim()) return;
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), label: label.trim(), color: WHEEL_COLORS[items.length % WHEEL_COLORS.length] }]);
  };

  const handleAiSuggest = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    const suggestions = await generateWheelSuggestions(aiPrompt);
    if (suggestions.length > 0) {
      setItems([...items, ...suggestions.map((label, index) => ({ id: Math.random().toString(36).substr(2, 9) + index, label, color: WHEEL_COLORS[(items.length + index) % WHEEL_COLORS.length] }))]);
      setAiPrompt('');
    }
    setIsAiLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-[700px] overflow-hidden">
      <div className="flex bg-slate-50 p-1 m-4 rounded-2xl border border-slate-200">
        <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}><Palette size={16} className="inline mr-2" /> Slices</button>
        <button onClick={() => setActiveTab('admin')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'admin' ? 'bg-white text-violet-600 shadow-md' : 'text-slate-500'}`}><Settings2 size={16} className="inline mr-2" /> Admin</button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <label className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 block"><Sparkles size={14} className="inline mr-1" /> AI Suggest</label>
              <div className="flex gap-2">
                <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Topic (e.g. Prizes)" className="flex-1 px-4 py-3 bg-white border border-indigo-100 rounded-xl text-sm" />
                <button onClick={handleAiSuggest} disabled={isAiLoading} className="px-4 bg-indigo-600 text-white rounded-xl">{isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={24} />}</button>
              </div>
            </div>
            {items.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <input type="text" value={item.label} onChange={(e) => setItems(items.map(it => it.id === item.id ? {...it, label: e.target.value} : it))} className="flex-1 font-bold text-slate-700 bg-transparent outline-none text-sm" />
                <button onClick={() => setItems(items.filter(it => it.id !== item.id))} className="text-slate-300 hover:text-rose-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelEditor;