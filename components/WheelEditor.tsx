import React, { useState } from 'react';
import { WheelItem } from '../types';
import { WHEEL_COLORS } from '../constants';
import { generateWheelSuggestions } from '../services/geminiService';
import { Plus, Trash2, Sparkles, Loader2, Palette, Settings2 } from 'lucide-react';

interface WheelEditorProps {
  items: WheelItem[]; setItems: (items: WheelItem[]) => void;
  spinDuration: number; setSpinDuration: (val: number) => void;
  activeTab: 'content' | 'text' | 'font' | 'admin'; setActiveTab: (tab: 'content' | 'text' | 'font' | 'admin') => void;
  [key: string]: any;
}

const WheelEditor: React.FC<WheelEditorProps> = (props) => {
  const { items, setItems, activeTab, setActiveTab } = props;
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
      const newItems = suggestions.map((label: string, index: number) => ({
        id: Math.random().toString(36).substr(2, 9) + index,
        label,
        color: WHEEL_COLORS[(items.length + index) % WHEEL_COLORS.length],
      }));
      setItems([...items, ...newItems]);
      setAiPrompt('');
    }
    setIsAiLoading(false);
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col h-[650px] overflow-hidden">
      <div className="flex bg-slate-50 p-1 m-6 rounded-2xl border border-slate-200">
        <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}><Palette size={14} className="inline mr-2" /> Slices</button>
        <button onClick={() => setActiveTab('admin')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-white text-violet-600 shadow-md' : 'text-slate-400'}`}><Settings2 size={14} className="inline mr-2" /> Settings</button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block flex items-center gap-1"><Sparkles size={12} /> AI Generator</label>
              <div className="flex gap-2">
                <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Topic (e.g. Prizes)" className="flex-1 px-4 py-3 bg-white border border-indigo-100 rounded-xl outline-none text-xs font-bold" onKeyPress={(e) => e.key === 'Enter' && handleAiSuggest()} />
                <button onClick={handleAiSuggest} disabled={isAiLoading} className="px-4 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">{isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={20} />}</button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Items</h4>
                <button onClick={() => addItem('New Slice')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Add Manually</button>
              </div>
              {items.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 group transition-all">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: item.color }} />
                  <input type="text" value={item.label} onChange={(e) => setItems(items.map(it => it.id === item.id ? {...it, label: e.target.value} : it))} className="flex-1 font-bold text-slate-700 bg-transparent outline-none text-xs" />
                  <button onClick={() => setItems(items.filter(it => it.id !== item.id))} className="text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Physics & Logic</h4>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spin Time: {props.spinDuration}s</label>
              <input type="range" min="2" max="10" step="0.5" value={props.spinDuration} onChange={(e) => props.setSpinDuration(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelEditor;