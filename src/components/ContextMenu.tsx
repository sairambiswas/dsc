import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number; y: number; onClose: () => void;
  options: { label: string; icon: React.ReactNode; onClick: () => void; }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, options }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const clickOut = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', clickOut);
    return () => document.removeEventListener('mousedown', clickOut);
  }, [onClose]);

  return (
    <div ref={menuRef} className="fixed z-[1000] min-w-[200px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-1.5" style={{ top: y, left: x }}>
      {options.map((opt, i) => (
        <button key={i} onClick={() => { opt.onClick(); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;