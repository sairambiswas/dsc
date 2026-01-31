
import React, { useEffect, useRef } from 'react';
import { Edit3, Settings, Type, Palette, Layout, X } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, options }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to keep menu inside viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - (options.length * 50 + 20));

  return (
    <div 
      ref={menuRef}
      className="fixed z-[1000] min-w-[200px] bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: adjustedY, left: adjustedX }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</span>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors">
          <X size={12} />
        </button>
      </div>
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => {
            option.onClick();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
        >
          <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
            {option.icon}
          </span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
