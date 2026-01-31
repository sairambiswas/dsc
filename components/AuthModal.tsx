
import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, ArrowRight, Loader2, Key } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  onLogin: (user: UserSession) => void;
  onAdminLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onAdminLogin }) => {
  const [step, setStep] = useState<'info' | 'otp' | 'admin'>('info');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@gmail.com')) {
      alert("Please use a valid Gmail address.");
      return;
    }
    setLoading(true);
    // MOCK: Integration with Gmail SMTP or Firebase Auth would happen here
    await new Promise(r => setTimeout(r, 1500));
    setStep('otp');
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // MOCK: Verify OTP '1234' for demo
    await new Promise(r => setTimeout(r, 1000));
    if (otp === '1234' || otp === '') { // Allow empty for testing convenience
      onLogin({ email, phone, hasSpun: false, isVerified: true });
    } else {
      alert("Invalid OTP. Try 1234.");
    }
    setLoading(false);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin123') {
      localStorage.setItem('dsc_admin_authenticated', 'true');
      onAdminLogin();
      onLogin({ email: 'admin@dsc.com', phone: '000', hasSpun: false, isVerified: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="bg-indigo-600 p-10 text-center text-white relative">
          <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-md mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">Member Verification</h2>
          <p className="text-indigo-100 text-sm font-bold">Secure Access to Da Strength Club Offers</p>
        </div>

        <div className="p-10">
          {step === 'info' && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gmail Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="email" placeholder="yourname@gmail.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="tel" placeholder="+91 00000 00000" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all" />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <>SEND OTP <ArrowRight size={20} /></>}
              </button>
              <button type="button" onClick={() => setStep('admin')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Admin Login</button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm font-bold text-slate-500">We've sent a 4-digit code to</p>
                <p className="text-sm font-black text-indigo-600">{email}</p>
              </div>
              <div className="flex justify-center gap-3">
                <input required maxLength={4} type="text" placeholder="1234" value={otp} onChange={e => setOtp(e.target.value)} className="w-32 text-center py-4 text-3xl font-black bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 tracking-[0.5em]" />
              </div>
              <button disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : 'VERIFY & ENTER'}
              </button>
              <button type="button" onClick={() => setStep('info')} className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Back to Login</button>
            </form>
          )}

          {step === 'admin' && (
            <form onSubmit={handleAdminAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all" />
                </div>
              </div>
              <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2">AUTHENTICATE</button>
              <button type="button" onClick={() => setStep('info')} className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Member Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
