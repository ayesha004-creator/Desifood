import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#0f382c] border border-emerald-600/30'
              : toast.type === 'error'
              ? 'bg-rose-900 border border-rose-700/40'
              : 'bg-zinc-800 border border-zinc-700/50'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
          <p className="flex-1 leading-tight">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
