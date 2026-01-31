import React, { useState } from 'react';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  onLogin: (user: UserSession) => void;
  onAdminLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    onLogin({ email, phone: '', hasSpun: false, isVerified: true });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-10 text-center text-white">
          <ShieldCheck size={40} className="mx-auto mb-4" />
          <h2 className="text-3xl font-black tracking-tighter mb-2">Member Access</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gmail Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'ENTER CLUB'}
          </button>
          <button type="button" onClick={onAdminLogin} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;