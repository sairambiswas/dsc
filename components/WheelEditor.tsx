
import React, { useState, useRef } from 'react';
import { WheelItem } from '../types';
import { WHEEL_COLORS, AVAILABLE_FONTS } from '../constants';
import { generateWheelSuggestions } from '../services/geminiService';
import { 
  Plus, Trash2, Sparkles, Loader2, Settings2, Zap, Target, Palette, 
  Upload, Type, Image as ImageIcon, Maximize2, GripVertical, 
  ListPlus, Type as TypeIcon, MousePointer2, Layout, MapPin, Mail, Phone 
} from 'lucide-react';

interface WheelEditorProps {
  items: WheelItem[];
  setItems: (items: WheelItem[]) => void;
  spinDuration: number;
  setSpinDuration: (val: number) => void;
  overrideResultId: string | null;
  setOverrideResultId: (id: string | null) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  // Customizable Strings
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
  // Gym Details
  gymEmail: string; setGymEmail: (v: string) => void;
  gymPhone: string; setGymPhone: (v: string) => void;
  gymLocation: string; setGymLocation: (v: string) => void;
  gymAddress: string; setGymAddress: (v: string) => void;
  // External Tab Control
  activeTab: 'content' | 'text' | 'font' | 'admin';
  setActiveTab: (tab: 'content' | 'text' | 'font' | 'admin') => void;
}

const WheelEditor: React.FC<WheelEditorProps> = (props) => {
  const { 
    items, setItems, spinDuration, setSpinDuration, overrideResultId, setOverrideResultId,
    logoUrl, setLogoUrl, font, setFont, fontSize, setFontSize,
    appTitle, setAppTitle, appSubtitle, setAppSubtitle, heroTitle, setHeroTitle,
    heroSubtitle, setHeroSubtitle, offerTitle, setOfferTitle, celebrationHeader, setCelebrationHeader,
    celebrationFooter, setCelebrationFooter, spinButtonText, setSpinButtonText,
    spinButtonColor, setSpinButtonColor, footerText, setFooterText,
    gymEmail, setGymEmail, gymPhone, setGymPhone, gymLocation, setGymLocation, gymAddress, setGymAddress,
    activeTab, setActiveTab
  } = props;

  const [newItemLabel, setNewItemLabel] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = (label: string) => {
    if (!label.trim()) return;
    const newItem: WheelItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: label.trim(),
      color: WHEEL_COLORS[items.length % WHEEL_COLORS.length],
    };
    setItems([...items, newItem]);
    setNewItemLabel('');
  };

  const addBulkItems = () => {
    if (!bulkInput.trim()) return;
    const rawLabels = bulkInput.split(/\n|  +/);
    const newLabels = rawLabels.map(l => l.trim()).filter(l => l.length > 0);
    const newItems: WheelItem[] = newLabels.map((label, index) => ({
      id: Math.random().toString(36).substr(2, 9) + index,
      label,
      color: WHEEL_COLORS[(items.length + index) % WHEEL_COLORS.length],
    }));
    setItems([...items, ...newItems]);
    setBulkInput('');
    setIsBulkMode(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (overrideResultId === id) setOverrideResultId(null);
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-[700px] overflow-hidden">
      <div className="flex bg-slate-50 p-1 m-4 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('content')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}><Palette size={16} /> <span className="text-xs">Slices</span></button>
        <button onClick={() => setActiveTab('text')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold transition-all ${activeTab === 'text' ? 'bg-white text-amber-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}><TypeIcon size={16} /> <span className="text-xs">Letters</span></button>
        <button onClick={() => setActiveTab('font')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold transition-all ${activeTab === 'font' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}><Type size={16} /> <span className="text-xs">Fonts</span></button>
        <button onClick={() => setActiveTab('admin')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold transition-all ${activeTab === 'admin' ? 'bg-white text-violet-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}><Settings2 size={16} /> <span className="text-xs">Admin</span></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2">
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <label className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 block flex items-center gap-1"><Sparkles size={14} /> AI Engine</label>
              <div className="flex gap-2">
                <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Topic (e.g. Movies)" className="flex-1 px-4 py-3 bg-white border border-indigo-100 rounded-xl outline-none text-sm" onKeyPress={(e) => e.key === 'Enter' && handleAiSuggest()} />
                <button onClick={handleAiSuggest} disabled={isAiLoading} className="px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">{isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={24} />}</button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Items ({items.length})</h4>
                <button onClick={() => setIsBulkMode(!isBulkMode)} className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full border ${isBulkMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}><ListPlus size={12} /> {isBulkMode ? 'Single' : 'Bulk'}</button>
              </div>
              
              <div className="space-y-3">
                {isBulkMode ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <textarea value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} placeholder={"Item 1\nItem 2..."} className="w-full h-32 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm resize-none" />
                    <button onClick={addBulkItems} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm">ADD ITEMS</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={newItemLabel} onChange={(e) => setNewItemLabel(e.target.value)} placeholder="New slice..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" onKeyPress={(e) => e.key === 'Enter' && addItem(newItemLabel)} />
                    <button onClick={() => addItem(newItemLabel)} className="p-3 bg-slate-800 text-white rounded-xl"><Plus size={20} /></button>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 group transition-all">
                      <div className="flex items-center gap-3">
                        <GripVertical size={18} className="text-slate-300" />
                        <input type="text" value={item.label} onChange={(e) => setItems(items.map(it => it.id === item.id ? {...it, label: e.target.value} : it))} className="flex-1 font-bold text-slate-700 bg-transparent outline-none text-sm" />
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-400"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Edit All App Letters</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">App Title</label>
                <input type="text" value={appTitle} onChange={(e) => setAppTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">App Subtitle</label>
                <input type="text" value={appSubtitle} onChange={(e) => setAppSubtitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hero Title</label>
                  <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hero Subtitle</label>
                  <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Offer Label (During celebration)</label>
                <input type="text" value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Celebration Header</label>
                <input type="text" value={celebrationHeader} onChange={(e) => setCelebrationHeader(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Spin Button Text</label>
                <input type="text" value={spinButtonText} onChange={(e) => setSpinButtonText(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Footer Note</label>
                <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'font' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Typography</h4>
              <div className="grid grid-cols-1 gap-2">
                {AVAILABLE_FONTS.map((f) => (
                  <button key={f.family} onClick={() => setFont(f.family)} className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${font === f.family ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white'}`}>
                    <span className="text-lg" style={{ fontFamily: f.family }}>{f.name}</span>
                    {font === f.family && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h5 className="font-black text-emerald-900 text-xs uppercase mb-4 tracking-widest">Label Size: {fontSize}</h5>
              <input type="range" min="1" max="8" step="0.1" value={fontSize} onChange={(e) => setFontSize(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2">
            {/* Gym Contact Section */}
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
              <div className="flex items-center gap-2 mb-2"><Layout size={18} className="text-indigo-600" /><h4 className="font-black text-sm uppercase tracking-widest">Gym Contact Details</h4></div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Club Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value={gymEmail} onChange={(e) => setGymEmail(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Club Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value={gymPhone} onChange={(e) => setGymPhone(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Google Maps Link</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value={gymLocation} onChange={(e) => setGymLocation(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Physical Address</label>
                  <textarea value={gymAddress} onChange={(e) => setGymAddress(e.target.value)} className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold h-16 resize-none" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4"><MousePointer2 size={18} className="text-indigo-600" /><h4 className="font-black text-sm uppercase tracking-widest">Button Color</h4></div>
              <div className="flex gap-2 flex-wrap">
                {WHEEL_COLORS.map(color => (
                  <button key={color} onClick={() => setSpinButtonColor(color)} className={`w-8 h-8 rounded-full border-2 ${spinButtonColor === color ? 'border-slate-800 scale-110' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-violet-50 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-2 mb-2"><Zap size={18} className="text-violet-600" /><h4 className="font-black text-sm uppercase tracking-widest">Physics</h4></div>
              <label className="text-[10px] font-bold text-violet-700">SPIN: {spinDuration}s</label>
              <input type="range" min="1" max="10" step="0.5" value={spinDuration} onChange={(e) => setSpinDuration(parseFloat(e.target.value))} className="w-full accent-violet-600" />
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-4"><Target size={18} className="text-emerald-600" /><h4 className="font-black text-sm uppercase tracking-widest">Winner Force</h4></div>
              <select value={overrideResultId || ''} onChange={(e) => setOverrideResultId(e.target.value || null)} className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl font-bold text-emerald-800"><option value="">🎲 Random</option>{items.map(item => (<option key={item.id} value={item.id}>🎯 Force "{item.label}"</option>))}</select>
            </div>
            
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-4"><ImageIcon size={18} className="text-indigo-600" /><h4 className="font-black text-sm uppercase tracking-widest">Hub Logo</h4></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden">{logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" /> : <div className="w-2 h-2 bg-indigo-200 rounded-full" />}</div>
                <div className="flex-1 space-y-2">
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold border border-indigo-200">UPLOAD</button>
                  {logoUrl && <button onClick={() => setLogoUrl(null)} className="w-full text-[10px] font-black text-rose-400 uppercase">REMOVE</button>}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelEditor;
