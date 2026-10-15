import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/menuData';
import { Utensils } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { selectedCategory, setSelectedCategory, dishes } = useApp();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#c2410c]">
            <Utensils className="w-3.5 h-3.5" />
            <span>Discover Pakistani Flavours</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0e382c] tracking-tight mt-1 font-['Outfit']">
            Browse by Culinary Category
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            From breakfast nashta and dum biryanis to coal-charred BBQ and regional heritage curries.
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-3 sm:mt-0 text-xs font-bold text-[#c2410c] hover:underline cursor-pointer"
          >
            Show All Categories
          </button>
        )}
      </div>

      {/* Horizontal scrolling / Grid of categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* All items card */}
        <button
          onClick={() => {
            setSelectedCategory('all');
            const menuSection = document.getElementById('menu-section');
            if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer group ${
            selectedCategory === 'all'
              ? 'bg-[#0e382c] text-white border-[#0e382c] shadow-lg scale-102'
              : 'bg-white text-zinc-800 border-zinc-200/80 hover:border-emerald-600/50 hover:shadow-md'
          }`}
        >
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 ${
              selectedCategory === 'all' ? 'bg-amber-400 text-zinc-950 font-black' : 'bg-emerald-50 text-[#0e382c]'
            }`}
          >
            <span className="text-xl sm:text-2xl">🍲</span>
          </div>
          <span className="text-xs sm:text-sm font-bold block leading-tight">All Dishes</span>
          <span className={`text-[10px] mt-0.5 block ${selectedCategory === 'all' ? 'text-amber-200' : 'text-zinc-500'}`}>
            {dishes.length} Items
          </span>
        </button>

        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          const count = dishes.filter(d => d.category.toLowerCase() === cat.id.toLowerCase()).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const menuSection = document.getElementById('menu-section');
                if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                isSelected
                  ? 'bg-[#0e382c] text-white border-[#0e382c] shadow-lg scale-102 ring-2 ring-amber-400'
                  : 'bg-white text-zinc-800 border-zinc-200/80 hover:border-emerald-600/50 hover:shadow-md'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm font-bold block leading-tight line-clamp-1">
                {cat.name.split(' (')[0]}
              </span>
              <span className={`text-[11px] block font-['Rozha_One'] mt-0.5 ${isSelected ? 'text-amber-300' : 'text-emerald-800 font-semibold'}`}>
                {cat.urduName}
              </span>
              <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-zinc-400'}`}>
                {count} {count === 1 ? 'Dish' : 'Dishes'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
