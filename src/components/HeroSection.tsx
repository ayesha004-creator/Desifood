import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Sparkles, Flame, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    currentCity,
    currentArea,
    setCurrentCity,
    setCurrentArea,
    setSearchQuery,
    setSelectedCategory,
    setSelectedSeason,
    setIsAiModalOpen,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const QUICK_CRAVINGS = [
    { label: 'Sindhi Biryani 🔥', query: 'biryani' },
    { label: 'Desi Ghee Karahi 🥘', query: 'karahi' },
    { label: 'Winter Saag & Makki Roti 🌾', season: 'Winter' },
    { label: 'Nalli Nihari 🍲', query: 'nihari' },
    { label: 'Reshmi Malai Boti 🍢', query: 'malai' },
    { label: 'Kashmiri Pink Chai ☕', query: 'kashmiri' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e382c] via-[#124234] to-[#154b3c] text-white pt-10 pb-16 lg:pb-24">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Description & Input */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 bg-[#1b5544]/80 backdrop-blur-sm border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>گھر جیسا ذائقہ، آپ کے دروازے تک!</span>
              <span className="text-emerald-300 hidden sm:inline">• Ghar Jaisa Zaiqa</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white font-['Outfit']">
              Your Favourite <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">Desi Food</span>, Delivered Fresh.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience the genuine warmth of authentic Pakistani cuisine. From bubbling clay-pot handis and fragrant Dum Biryanis to midnight Malai Boti and piping hot Winter Sarson Ka Saag — prepared with pure desi ghee and delivered straight to your dining table.
            </p>

            {/* Search and Location Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 border border-zinc-200/80">
                <div className="flex-1 flex items-center px-3 py-1.5 sm:py-0 text-zinc-700">
                  <Search className="w-5 h-5 text-zinc-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    placeholder="What are you craving today? (e.g. Biryani, Nihari)"
                    className="w-full text-sm font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0e382c] hover:bg-[#144738] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Explore Food</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </form>

            {/* Quick cravings chips */}
            <div className="pt-2">
              <span className="text-xs text-emerald-200/80 block mb-2 font-medium">Popular right now:</span>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {QUICK_CRAVINGS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.season) {
                        setSelectedSeason(item.season);
                      } else if (item.query) {
                        setSearchQuery(item.query);
                      }
                      const menuSection = document.getElementById('menu-section');
                      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#144738]/90 hover:bg-amber-500 hover:text-zinc-950 text-white border border-emerald-600/40 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/60 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/60 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">100% Halal</div>
                  <div className="text-[10px] text-emerald-300">Certified Kitchens</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/60 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Pure Desi Ghee</div>
                  <div className="text-[10px] text-emerald-300">No Artificial Oils</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/60 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Hot & Fresh</div>
                  <div className="text-[10px] text-emerald-300">Thermal Insulated</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/60 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">4.9 / 5 Rating</div>
                  <div className="text-[10px] text-emerald-300">50K+ Foodies</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Pakistani Food Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main centerpiece food photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/20 aspect-4/3 group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Special Karachi Sindhi Biryani"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-[#c2410c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Chef's Pride
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Special Karachi Sindhi Biryani</h3>
                  <p className="text-xs text-amber-200">Layered with aromatic saffron rice, tender chicken & aloo</p>
                </div>
              </div>

              {/* Floating Card 1: Winter Special */}
              <div className="absolute -top-6 -left-6 sm:-left-8 bg-white text-zinc-800 p-3 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=120&auto=format&fit=crop&q=80"
                    alt="Sarson Ka Saag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pr-2">
                  <div className="flex items-center gap-1 text-[10px] text-[#c2410c] font-bold">
                    <Flame className="w-3 h-3" /> Winter Special
                  </div>
                  <div className="font-bold text-xs text-zinc-900">Sarson Ka Saag & Makki Roti</div>
                  <div className="text-[10px] text-zinc-500 font-semibold">With Pure Desi Makhan</div>
                </div>
              </div>

              {/* Floating Card 2: AI Chef Assist */}
              <div
                onClick={() => setIsAiModalOpen(true)}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-gradient-to-br from-amber-500 to-[#c2410c] text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
                    Need Meal Advice?
                  </div>
                  <div className="text-xs font-black">Ask Desi Chef AI 👨‍🍳</div>
                  <div className="text-[10px] text-white/80">Get instant curated meal recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
