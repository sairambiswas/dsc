
import React, { useEffect, useState } from 'react';
import { WheelItem } from '../types';
import { Trophy, Box, Star, Sparkles, Flame } from 'lucide-react';

interface ClimbResultProps {
  result: WheelItem;
  font: string;
  onClose: () => void;
}

const ClimbResult: React.FC<ClimbResultProps> = ({ result, font, onClose }) => {
  const [stage, setStage] = useState<'climbing' | 'reached' | 'revealed'>('climbing');

  useEffect(() => {
    // Stage 1: Climbing with effort (4s for better suspense)
    const climbTimer = setTimeout(() => {
      setStage('reached');
    }, 4000);

    // Stage 2: Reached and opening the reward (1s later)
    const revealTimer = setTimeout(() => {
      setStage('revealed');
    }, 5000);

    return () => {
      clearTimeout(climbTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-3xl animate-in fade-in duration-700 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <style>{`
        @keyframes struggleClimb {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(-1deg); }
          50% { transform: translateY(0) rotate(1deg); }
          75% { transform: translateY(-1px) rotate(-0.5deg); }
        }
        @keyframes armReach {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-40deg) translateY(-10px); }
        }
        @keyframes legKick {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes sweatDrop {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(20px) scale(0.5); opacity: 0; }
        }
        .struggle-shake {
          animation: struggleClimb 0.4s infinite ease-in-out;
        }
        .climb-up {
          transition: bottom 4s cubic-bezier(0.45, 0.05, 0.55, 0.95);
        }
      `}</style>

      <div className="relative w-full max-w-2xl h-screen flex flex-col items-center justify-end pb-24">
        
        {/* The Vertical Rope with Texture */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.2)] rounded-full z-0">
          <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)]" />
        </div>

        {/* The Peak: Discount Box */}
        <div 
          className={`absolute top-20 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 transform
            ${stage === 'revealed' ? 'scale-125' : 'scale-100'}`}
        >
          <div className="relative">
            <div className={`absolute -inset-10 bg-emerald-400/20 blur-[60px] rounded-full transition-opacity duration-1000 ${stage === 'revealed' ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className={`relative bg-emerald-600 text-white px-10 py-8 rounded-[40px] shadow-[0_20px_60px_rgba(16,185,129,0.4)] border-4 border-emerald-400 flex flex-col items-center gap-2
              ${stage === 'reached' ? 'animate-bounce' : ''}`}>
              
              <div className="flex items-center gap-3">
                <Box size={32} className="text-emerald-200" />
                <span className="font-black text-lg uppercase tracking-[0.4em]">Discount</span>
              </div>
              
              {/* Revealed Result */}
              {stage === 'revealed' && (
                <div className="mt-6 p-6 bg-white rounded-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] animate-in zoom-in-90 duration-700 border-2 border-emerald-100">
                  <p 
                    className="text-5xl font-black whitespace-nowrap tracking-tighter" 
                    style={{ color: result.color, fontFamily: font }}
                  >
                    {result.label}
                  </p>
                </div>
              )}
            </div>

            {/* Victory Decorations */}
            {stage === 'revealed' && (
              <>
                <div className="absolute -top-12 -left-12 animate-bounce">
                  <Flame size={48} className="text-amber-400 fill-amber-400" />
                </div>
                <div className="absolute -top-12 -right-12 animate-bounce delay-300">
                  <Flame size={48} className="text-amber-400 fill-amber-400" />
                </div>
                <Sparkles className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white animate-pulse" size={40} />
              </>
            )}
          </div>
        </div>

        {/* The Climbing Human */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 z-10 climb-up flex flex-col items-center
            ${stage === 'climbing' ? 'bottom-0' : 'bottom-[calc(100vh-450px)]'}`}
        >
          <div className={`relative ${stage === 'climbing' ? 'struggle-shake' : ''}`}>
            
            {/* Human Silhouette - Articulated SVG */}
            <svg width="120" height="200" viewBox="0 0 120 200" className="drop-shadow-2xl">
              {/* Body Shadow */}
              <ellipse cx="60" cy="180" rx="20" ry="5" fill="rgba(0,0,0,0.3)" />
              
              <g className={stage === 'climbing' ? 'climbing-cycle' : ''}>
                {/* Right Arm (Reaching) */}
                <path 
                  d="M 75 60 Q 95 30 75 10" 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  style={{ animation: stage === 'climbing' ? 'armReach 0.8s infinite' : '' }}
                />
                {/* Left Arm (Gripping) */}
                <path 
                  d="M 45 60 Q 25 40 45 20" 
                  fill="none" 
                  stroke="#4338ca" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  style={{ animation: stage === 'climbing' ? 'armReach 0.8s infinite reverse' : '' }}
                />
                
                {/* Legs (Struggling/Kicking) */}
                <path 
                  d="M 55 120 L 40 165 L 50 175" 
                  fill="none" 
                  stroke="#3730a3" 
                  strokeWidth="11" 
                  strokeLinecap="round"
                  style={{ animation: stage === 'climbing' ? 'legKick 0.6s infinite' : '' }}
                />
                <path 
                  d="M 65 120 L 80 165 L 70 175" 
                  fill="none" 
                  stroke="#312e81" 
                  strokeWidth="11" 
                  strokeLinecap="round"
                  style={{ animation: stage === 'climbing' ? 'legKick 0.6s infinite reverse' : '' }}
                />

                {/* Torso (Muscle Definition) */}
                <path 
                  d="M 45 60 L 75 60 L 70 125 L 50 125 Z" 
                  fill="#4338ca" 
                  stroke="#3730a3" 
                  strokeWidth="2"
                />
                
                {/* Head (Determined Tilt) */}
                <circle 
                  cx="60" 
                  cy="40" 
                  r="15" 
                  fill="#4f46e5" 
                  stroke="#4338ca" 
                  strokeWidth="2"
                />
                {/* Hair/Headband for athletic look */}
                <path d="M 48 32 Q 60 25 72 32" fill="none" stroke="#818cf8" strokeWidth="4" />
              </g>

              {/* Sweat particles for "struggle" effect */}
              {stage === 'climbing' && (
                <>
                  <circle cx="40" cy="45" r="2" fill="#93c5fd" style={{ animation: 'sweatDrop 1s infinite' }} />
                  <circle cx="85" cy="55" r="1.5" fill="#93c5fd" style={{ animation: 'sweatDrop 1.2s infinite 0.3s' }} />
                  <circle cx="30" cy="140" r="1.5" fill="#93c5fd" style={{ animation: 'sweatDrop 0.8s infinite 0.6s' }} />
                </>
              )}
            </svg>

            {/* Effort Indicators */}
            {stage === 'climbing' && (
              <div className="absolute -right-32 top-10 flex flex-col items-start gap-1">
                <div className="bg-indigo-600/20 backdrop-blur px-4 py-2 rounded-2xl border border-indigo-400/30">
                  <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
                    Pushing Hard
                  </span>
                </div>
                <div className="bg-white/5 backdrop-blur px-3 py-1 rounded-xl">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest italic">Almost there...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer/Collect Action */}
        {stage === 'revealed' && (
          <div className="relative z-30 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-6 flex items-center gap-2 px-6 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Strength Verified</span>
            </div>
            
            <button
              onClick={onClose}
              className="px-16 py-6 bg-white text-indigo-700 rounded-[40px] font-black text-2xl hover:bg-slate-50 transition-all shadow-[0_30px_90px_rgba(0,0,0,0.3)] flex items-center gap-4 active:scale-95 group border-b-8 border-slate-200"
            >
              <Trophy size={32} className="group-hover:rotate-12 group-hover:scale-110 transition-transform text-amber-500" />
              CLAIM DISCOUNT
            </button>
            <p className="mt-6 text-slate-400 font-bold uppercase tracking-[0.4em] text-xs opacity-60">Victory through persistence</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimbResult;
