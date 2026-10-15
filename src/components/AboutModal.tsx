import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Flame, ShieldCheck, Heart, Award, Utensils } from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen } = useApp();

  if (!isAboutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-['Outfit']">Our Story & Heritage</h3>
          </div>
          <button
            onClick={() => setIsAboutOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#c2410c]">
              Ghar Jaisa Zaiqa, Aap Ke Darwazay Tak!
            </span>
            <h2 className="text-2xl font-black text-[#0e382c] font-['Outfit']">
              Reviving the Authentic Soul of Pakistani Cooking
            </h2>
            <p>
              DesiBite was founded with a singular conviction: genuine Pakistani food cannot be mass-produced with shortcuts. Our culinary traditions rely on patience, slow simmering (bhunna), high-flame iron woks (karahi), and the undeniable magic of wood-fired clay tandoors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h4 className="font-bold text-xs text-[#0e382c]">100% Halal Verified</h4>
              <p className="text-[11px] text-zinc-600">Fresh daily cuts of prime mutton, beef, and farm chicken.</p>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
              <Award className="w-5 h-5 text-amber-800" />
              <h4 className="font-bold text-xs text-amber-950">Pure Desi Ghee</h4>
              <p className="text-[11px] text-zinc-600">Traditional clarified butter from local dairy farms.</p>
            </div>

            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1">
              <Utensils className="w-5 h-5 text-rose-800" />
              <h4 className="font-bold text-xs text-rose-950">Slow Dum Cooking</h4>
              <p className="text-[11px] text-zinc-600">Dough-sealed pots to lock in saffron and cardamom fragrances.</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <h4 className="font-bold text-sm text-[#0e382c]">Our Regional Heritage Map</h4>
            <p>
              We bring together master ustaads from Lahore's Lakshmi Chowk, Karachi's Burns Road, Peshawar's Namak Mandi, and Quetta's Prince Road. Whether you are craving a spicy Sindhi Biryani, a minimalist namkeen Shinwari Karahi, or winter Sarson Ka Saag with Makki Ki Roti, every dish honors its authentic roots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
