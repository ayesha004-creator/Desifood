import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Sparkles, Snowflake, Sun, Moon, Gift, Calendar, ArrowRight } from 'lucide-react';
import { SeasonTag } from '../types';

export const SeasonalBanner: React.FC = () => {
  const {
    activeSeason,
    setActiveSeason,
    selectedSeason,
    setSelectedSeason,
    seasonBanner,
    setIsAdminOpen,
  } = useApp();

  const SEASONS: { tag: SeasonTag; label: string; icon: any; color: string }[] = [
    { tag: 'Winter', label: 'Winter Sardi Specials', icon: Snowflake, color: 'from-sky-700 to-indigo-900' },
    { tag: 'Ramadan', label: 'Ramadan Iftar & Sehri', icon: Moon, color: 'from-emerald-800 to-teal-950' },
    { tag: 'Summer', label: 'Summer Coolers', icon: Sun, color: 'from-amber-600 to-orange-700' },
    { tag: 'Eid', label: 'Eid-ul-Fitr Feasts', icon: Gift, color: 'from-rose-800 to-amber-800' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-500/20 bg-gradient-to-r from-[#173b2c] via-[#214f3c] to-[#123124] text-white p-6 sm:p-8">
        {/* Subtle patterned overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#c2410c] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                Live Season: {activeSeason || 'Winter'} Collection
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Calendar className="w-3 h-3" /> Pakistan Standard Time Auto-Sync
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              {seasonBanner.title}
            </h2>

            <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
              {seasonBanner.subtitle}
            </p>

            {/* Quick season selector buttons for previewing */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-emerald-300 font-medium">Browse by Season:</span>
              {SEASONS.map(s => {
                const IconComponent = s.icon;
                const isCurrent = (selectedSeason === s.tag) || (selectedSeason === 'all' && activeSeason === s.tag);
                return (
                  <button
                    key={s.tag}
                    onClick={() => {
                      if (selectedSeason === s.tag) {
                        setSelectedSeason('all');
                      } else {
                        setSelectedSeason(s.tag || 'all');
                      }
                      const menuSection = document.getElementById('menu-section');
                      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSeason === s.tag
                        ? 'bg-amber-400 text-[#0e382c] shadow-md scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                setSelectedSeason(activeSeason || 'Winter');
                const menuSection = document.getElementById('menu-section');
                if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-[#0e382c] px-6 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span>View {activeSeason || 'Winter'} Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="w-full sm:w-auto text-xs text-emerald-300 hover:text-white underline underline-offset-4 py-2 px-3 text-center cursor-pointer"
              title="Admin can override active season & dishes"
            >
              Configure in Admin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
