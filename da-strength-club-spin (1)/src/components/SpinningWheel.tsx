import React, { useState, useRef } from 'react';
import { WheelItem } from '../types';
import { Settings, Type, Image as ImageIcon } from 'lucide-react';

interface SpinningWheelProps {
  items: WheelItem[];
  onResult: (item: WheelItem) => void;
  spinDuration: number;
  overrideResultId: string | null;
  logoUrl: string | null;
  font: string;
  fontSize: number;
  spinButtonText: string;
  spinButtonColor: string;
  onContextMenu: (e: React.MouseEvent, options: any[]) => void;
  setEditorTab: (tab: 'content' | 'text' | 'font' | 'admin') => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ 
  items, onResult, spinDuration, overrideResultId, logoUrl, font,
  fontSize, spinButtonText, spinButtonColor, onContextMenu, setEditorTab
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);

  const POINTER_ANGLE = 270;
  const itemCount = items.length;
  const sliceSize = itemCount > 0 ? 360 / itemCount : 0;

  const spin = () => {
    if (isSpinning || itemCount === 0) return;
    setIsSpinning(true);
    const extraSpins = 6 + Math.random() * 4;
    let targetRotation: number;
    const shouldForce = overrideResultId && Math.random() < 0.45;

    if (shouldForce) {
      const targetIndex = items.findIndex(item => item.id === overrideResultId);
      const currentRotationBase = Math.ceil(rotation / 360) * 360;
      let targetRelative = POINTER_ANGLE - (targetIndex * sliceSize + sliceSize / 2);
      while (targetRelative < 0) targetRelative += 360;
      targetRotation = currentRotationBase + (extraSpins * 360) + targetRelative;
    } else {
      targetRotation = rotation + (extraSpins * 360) + Math.random() * 360;
    }
    
    setRotation(targetRotation);
    setTimeout(() => {
      setIsSpinning(false);
      const finalRotation = targetRotation % 360;
      let winningAngle = (POINTER_ANGLE - finalRotation) % 360;
      if (winningAngle < 0) winningAngle += 360;
      const winningIndex = Math.floor(winningAngle / sliceSize);
      onResult(items[Math.min(winningIndex, itemCount - 1)]);
    }, spinDuration * 1000);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 z-20 pointer-events-none drop-shadow-2xl scale-110">
        <svg width="64" height="96" viewBox="0 0 64 96">
          <rect x="8" y="4" width="48" height="10" rx="3" fill="#cbd5e1" />
          <rect x="27" y="14" width="10" height="58" rx="2" fill="#475569" />
          <rect x="8" y="72" width="48" height="10" rx="3" fill="#6366f1" />
          <path d="M 22 86 L 42 86 L 32 96 Z" fill="#6366f1" />
        </svg>
      </div>

      <div className="wheel-container relative w-80 h-80 md:w-[480px] md:h-[480px]">
        {itemCount === 0 ? (
          <div className="w-full h-full rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center bg-slate-50">
            <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Wheel Empty</p>
          </div>
        ) : (
          <svg ref={wheelRef} viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
            <defs><clipPath id="logoClip"><circle cx="50" cy="50" r="9.5" /></clipPath></defs>
            <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%', transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.15, 0, 0.15, 1)` : 'none' }}>
              {items.map((item, index) => {
                const startAngle = index * sliceSize;
                const endAngle = (index + 1) * sliceSize;
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${sliceSize > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
                return (
                  <g key={item.id}>
                    <path d={pathData} fill={item.color} stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" />
                    <text x="82" y="50" fill="white" fontSize={fontSize} fontWeight="800" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: font }} transform={`rotate(${startAngle + sliceSize / 2}, 50, 50)`}>
                      {item.label.length > 12 ? item.label.slice(0, 10) + '...' : item.label}
                    </text>
                  </g>
                );
              })}
              <circle cx="50" cy="50" r="11" fill="white" />
              {logoUrl ? <image href={logoUrl} x="40.5" y="40.5" width="19" height="19" clipPath="url(#logoClip)" preserveAspectRatio="xMidYMid slice" /> : <circle cx="50" cy="50" r="5" fill="#6366f1" />}
            </g>
          </svg>
        )}
      </div>

      <button onClick={spin} disabled={isSpinning || itemCount === 0} style={{ backgroundColor: isSpinning ? '#f8fafc' : spinButtonColor, fontFamily: font, color: isSpinning ? '#94a3b8' : 'white' }} className="mt-12 px-20 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all">
        {isSpinning ? 'SPINNING...' : spinButtonText}
      </button>
    </div>
  );
};

export default SpinningWheel;