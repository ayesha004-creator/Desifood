import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, login, showToast } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone }),
        });
        const data = await res.json();
        if (data.success && data.user) {
          await login(email, password);
        } else {
          showToast(data.error || 'Registration failed', 'error');
        }
      } catch (err) {
        showToast('Network error during registration', 'error');
      }
    } else {
      await login(email, password);
    }

    setLoading(false);
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    await login('ayesha@desibite.pk', 'password123');
    setLoading(false);
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    await login('admin@desibite.pk', 'admin123');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-['Outfit']">
                {isRegister ? 'Join DesiBite Family' : 'Welcome Back'}
              </h3>
              <p className="text-[11px] text-emerald-200">Authentic Pakistani Food Delivery</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Demo Login Buttons for Evaluators */}
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider text-center">
              1-Click Demo Profiles (For Instant Testing)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="bg-white hover:bg-emerald-50 text-[#0e382c] border border-emerald-600/30 font-bold p-2 rounded-xl text-center shadow-2xs transition-colors cursor-pointer"
              >
                👤 Customer Demo
                <span className="block text-[9px] text-zinc-400 font-normal">Ayesha (Lahore DHA)</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAdmin}
                className="bg-[#0e382c] hover:bg-[#144738] text-white font-bold p-2 rounded-xl text-center shadow-2xs transition-colors cursor-pointer"
              >
                🛡️ Admin Portal
                <span className="block text-[9px] text-amber-300 font-normal">Master Kitchen Control</span>
              </button>
            </div>
          </div>

          <div className="relative text-center my-2">
            <span className="bg-white px-2 text-[10px] text-zinc-400 uppercase font-semibold">Or with credentials</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-200 -z-10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {isRegister && (
              <>
                <div>
                  <label className="block text-zinc-600 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Bilal Ahmed"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 font-semibold mb-1">Phone Number (+92)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-zinc-600 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e382c] hover:bg-[#144738] disabled:opacity-50 text-white py-3 rounded-xl font-black text-sm transition-colors shadow-md cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-[#0e382c] hover:underline font-bold cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
