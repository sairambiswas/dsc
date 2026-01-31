import React, { useState, useEffect, useCallback } from 'react';
import SpinningWheel from './components/SpinningWheel';
import WheelEditor from './components/WheelEditor';
import DriveControls from './components/DriveControls';
import ResultCelebration from './components/ResultCelebration';
import ContextMenu from './components/ContextMenu';
import AuthModal from './components/AuthModal';
import { WheelItem, WheelConfig, UserSession } from './types';
import { INITIAL_ITEMS, AVAILABLE_FONTS, WHEEL_COLORS } from './constants';
import { RotateCcw, ShieldCheck, Lock, Scale, MapPin } from 'lucide-react';

const STORAGE_KEY = 'da_strength_club_v4_active';
const ADMIN_MODE_KEY = 'dsc_admin_authenticated';

const App: React.FC = () => {
  const getInitialValue = <T,>(key: keyof WheelConfig, fallback: T): T => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return parsed[key] !== undefined ? parsed[key] : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [items, setItems] = useState<WheelItem[]>(() => getInitialValue('items', INITIAL_ITEMS));
  const [spinDuration, setSpinDuration] = useState<number>(() => getInitialValue('spinDuration', 4));
  const [overrideResultId, setOverrideResultId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => getInitialValue('logoUrl', null));
  const [font, setFont] = useState<string>(() => getInitialValue('font', AVAILABLE_FONTS[0].family));
  const [fontSize, setFontSize] = useState<number>(() => getInitialValue('fontSize', 3.2));
  
  const [appTitle, setAppTitle] = useState<string>(() => getInitialValue('appTitle', 'Da Strength Club Spin'));
  const [appSubtitle, setAppSubtitle] = useState<string>(() => getInitialValue('appSubtitle', 'Pro Edition'));
  const [heroTitle, setHeroTitle] = useState<string>(() => getInitialValue('heroTitle', 'Valor is a choice.'));
  const [heroSubtitle, setHeroSubtitle] = useState<string>(() => getInitialValue('heroSubtitle', 'So, make your own.'));
  const [offerTitle, setOfferTitle] = useState<string>(() => getInitialValue('offerTitle', 'Discount'));
  const [celebrationHeader, setCelebrationHeader] = useState<string>(() => getInitialValue('celebrationHeader', 'Victory Unlocked'));
  const [celebrationFooter, setCelebrationFooter] = useState<string>(() => getInitialValue('celebrationFooter', 'Epic Win Registered'));
  const [spinButtonText, setSpinButtonText] = useState<string>(() => getInitialValue('spinButtonText', 'TAP TO SPIN'));
  const [spinButtonColor, setSpinButtonColor] = useState<string>(() => getInitialValue('spinButtonColor', WHEEL_COLORS[0]));
  const [footerText, setFooterText] = useState<string>(() => getInitialValue('footerText', 'Da Strength Club Spin Pro • Secured Protocol'));

  const [gymEmail, setGymEmail] = useState<string>(() => getInitialValue('gymEmail', 'support@dastrengthclub.com'));
  const [gymPhone, setGymPhone] = useState<string>(() => getInitialValue('gymPhone', '+91 98765 43210'));
  const [gymLocation, setGymLocation] = useState<string>(() => getInitialValue('gymLocation', 'https://www.google.com/maps?q=Da+Strength+Club+Bangalore'));
  const [gymAddress, setGymAddress] = useState<string>(() => getInitialValue('gymAddress', 'Elite Performance Hub, 42 Power Street, Fitness District'));

  const [result, setResult] = useState<WheelItem | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'text' | 'font' | 'admin'>('content');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, options: any[] } | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_MODE_KEY) === 'true');

  useEffect(() => {
    const config: WheelConfig = {
      id: 'current',
      name: 'Active Config',
      items, spinDuration, overrideResultId, logoUrl, font, fontSize,
      appTitle, appSubtitle, heroTitle, heroSubtitle, offerTitle,
      celebrationHeader, celebrationFooter, spinButtonText, spinButtonColor, footerText,
      gymEmail, gymPhone, gymLocation, gymAddress,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [items, spinDuration, logoUrl, font, fontSize, appTitle, appSubtitle, heroTitle, heroSubtitle, offerTitle, celebrationHeader, celebrationFooter, spinButtonText, spinButtonColor, footerText, gymEmail, gymPhone, gymLocation, gymAddress, overrideResultId]);

  const handleResult = (item: WheelItem) => {
    if (user && !user.hasSpun) {
      setResult(item);
      setShowCelebration(true);
      setUser({ ...user, hasSpun: true });
    }
  };

  const showContextMenu = useCallback((e: React.MouseEvent, options: any[]) => {
    if (!isAdmin) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, options });
  }, [isAdmin]);

  if (!user) {
    return <AuthModal onLogin={(u) => setUser(u)} onAdminLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] overflow-x-hidden">
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} options={contextMenu.options} />
      )}

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-12 py-5 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-12 group hover:rotate-0 transition-all cursor-pointer">
            <RotateCcw className="text-white group-hover:scale-110" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none mb-1">{appTitle}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-md">{appSubtitle}</span>
              <ShieldCheck size={12} className="text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
            <p className="text-sm font-bold text-slate-700 leading-none">{user.email}</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setIsAdmin(false); localStorage.removeItem(ADMIN_MODE_KEY); }} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all">
              <Lock size={18} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 lg:p-12 flex flex-col xl:flex-row gap-8 lg:gap-16 items-start justify-center">
        {isAdmin && (
          <aside className="xl:w-[420px] w-full space-y-8">
             <DriveControls currentConfig={{ id: 'current', name: 'Active Config', items, spinDuration, overrideResultId, logoUrl, font, fontSize, appTitle, appSubtitle, heroTitle, heroSubtitle, offerTitle, celebrationHeader, celebrationFooter, spinButtonText, spinButtonColor, footerText, gymEmail, gymPhone, gymLocation, gymAddress, updatedAt: Date.now() }} onLoad={(c) => { setItems(c.items); setSpinDuration(c.spinDuration); setOverrideResultId(c.overrideResultId); setLogoUrl(c.logoUrl); setFont(c.font); setFontSize(c.fontSize); setAppTitle(c.appTitle); setAppSubtitle(c.appSubtitle); setHeroTitle(c.heroTitle); setHeroSubtitle(c.heroSubtitle); setOfferTitle(c.offerTitle); setCelebrationHeader(c.celebrationHeader); setCelebrationFooter(c.celebrationFooter); setSpinButtonText(c.spinButtonText); setSpinButtonColor(c.spinButtonColor); setFooterText(c.footerText); setGymEmail(c.gymEmail || ''); setGymPhone(c.gymPhone || ''); setGymLocation(c.gymLocation || ''); setGymAddress(c.gymAddress || ''); }} />
             <WheelEditor items={items} setItems={setItems} spinDuration={spinDuration} setSpinDuration={setSpinDuration} overrideResultId={overrideResultId} setOverrideResultId={setOverrideResultId} logoUrl={logoUrl} setLogoUrl={setLogoUrl} font={font} setFont={setFont} fontSize={fontSize} setFontSize={setFontSize} appTitle={appTitle} setAppTitle={setAppTitle} appSubtitle={appSubtitle} setAppSubtitle={setAppSubtitle} heroTitle={heroTitle} setHeroTitle={setHeroTitle} heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle} offerTitle={offerTitle} setOfferTitle={setOfferTitle} celebrationHeader={celebrationHeader} setCelebrationHeader={setCelebrationHeader} celebrationFooter={celebrationFooter} setCelebrationFooter={setCelebrationFooter} spinButtonText={spinButtonText} setSpinButtonText={setSpinButtonText} spinButtonColor={spinButtonColor} setSpinButtonColor={setSpinButtonColor} footerText={footerText} setFooterText={setFooterText} gymEmail={gymEmail} setGymEmail={setGymEmail} gymPhone={gymPhone} setGymPhone={setGymPhone} gymLocation={gymLocation} setGymLocation={setGymLocation} gymAddress={gymAddress} setGymAddress={setGymAddress} activeTab={editorTab} setActiveTab={setEditorTab} />
          </aside>
        )}

        <div className={`flex-1 flex flex-col items-center justify-center py-16 lg:py-24 bg-white rounded-[48px] shadow-2xl border border-slate-100 relative overflow-hidden w-full max-w-5xl mx-auto transition-all ${isAdmin ? '' : 'xl:max-w-6xl'}`}>
          <div className="absolute top-10 right-10 z-20">
            <a href={gymLocation} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-lg hover:shadow-indigo-100 group active:scale-95 transition-all">
              <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-600 transition-colors">
                <MapPin className="text-indigo-600 group-hover:text-white" size={16} />
              </div>
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]">Open Maps</span>
            </a>
          </div>

          <div className="mb-16 text-center relative z-10 px-8">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-800 mb-6 tracking-tighter leading-tight">
              {heroTitle} <br />
              <span className="text-indigo-600 italic font-serif">{heroSubtitle}</span>
            </h2>
          </div>
          
          <div className="relative z-10 scale-95 sm:scale-100">
            <SpinningWheel items={items} onResult={handleResult} spinDuration={spinDuration} overrideResultId={overrideResultId} logoUrl={logoUrl} font={font} fontSize={fontSize} spinButtonText={user.hasSpun ? 'OFFER SECURED' : spinButtonText} spinButtonColor={user.hasSpun ? '#f1f5f9' : spinButtonColor} onContextMenu={showContextMenu} setEditorTab={setEditorTab} />
          </div>
        </div>
      </main>

      {showCelebration && result && (
        <ResultCelebration result={result} font={font} offerTitle={offerTitle} headerText={celebrationHeader} footerText={celebrationFooter} userEmail={user.email} gymEmail={gymEmail} gymPhone={gymPhone} gymAddress={gymAddress} gymLocation={gymLocation} onClose={() => setShowCelebration(false)} onContextMenu={showContextMenu} setEditorTab={setEditorTab} />
      )}
    </div>
  );
};

export default App;