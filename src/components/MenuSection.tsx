import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DishCard } from './DishCard';
import { CATEGORIES } from '../data/menuData';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const {
    dishes,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSpice,
    setSelectedSpice,
    selectedDietary,
    setSelectedDietary,
    selectedSeason,
    setSelectedSeason,
    sortBy,
    setSortBy,
    setIsAiModalOpen,
  } = useApp();

  // Filter & Sort dishes locally in real-time
  const filteredDishes = useMemo(() => {
    let list = [...dishes];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          (d.urduName && d.urduName.includes(q)) ||
          d.description.toLowerCase().includes(q) ||
          d.cuisine.toLowerCase().includes(q) ||
          d.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter(d => d.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Spice
    if (selectedSpice !== 'all') {
      list = list.filter(d => d.spiceLevel === selectedSpice);
    }

    // Dietary
    if (selectedDietary !== 'all') {
      list = list.filter(d => d.dietary === selectedDietary);
    }

    // Season
    if (selectedSeason !== 'all') {
      list = list.filter(d => d.seasonalTag && d.seasonalTag === selectedSeason);
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: popular
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [dishes, searchQuery, selectedCategory, selectedSpice, selectedDietary, selectedSeason, sortBy]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedSpice !== 'all' ||
    selectedDietary !== 'all' ||
    selectedSeason !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSpice('all');
    setSelectedDietary('all');
    setSelectedSeason('all');
    setSortBy('popular');
  };

  return (
    <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#c2410c] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Freshly Prepared From Tandoor & Deg
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e382c] tracking-tight mt-1 font-['Outfit']">
            Authentic Desi Menu
          </h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-xl">
            Piping hot meals simmered in authentic herbs, spices, and pure desi ghee.
          </p>
        </div>

        {/* AI Assistant Quick Callout */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="self-start md:self-auto bg-amber-50 hover:bg-amber-100 text-[#0e382c] border border-amber-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Need help deciding? Ask Desi Chef AI</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#0e382c] text-white shadow-md'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          All Categories ({dishes.length})
        </button>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          const count = dishes.filter(d => d.category.toLowerCase() === cat.id.toLowerCase()).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0e382c] text-white shadow-md ring-2 ring-amber-400'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat.name.split(' (')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Advanced Filter & Sorting Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Spice Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-semibold">Spice:</span>
            <select
              value={selectedSpice}
              onChange={e => setSelectedSpice(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-bold text-zinc-800 focus:outline-none"
            >
              <option value="all">Any Spice</option>
              <option value="Mild">Mild 🌿</option>
              <option value="Medium">Medium 🌶️</option>
              <option value="Spicy">Spicy 🌶️🌶️</option>
              <option value="Extra Spicy">Extra Spicy 🔥</option>
            </select>
          </div>

          {/* Dietary Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-semibold">Dietary:</span>
            <select
              value={selectedDietary}
              onChange={e => setSelectedDietary(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-bold text-zinc-800 focus:outline-none"
            >
              <option value="all">All Diets</option>
              <option value="Halal">100% Halal</option>
              <option value="Vegetarian">Vegetarian (Sabzi & Daal)</option>
              <option value="Non-Veg">Non-Veg (Gosht)</option>
            </select>
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-semibold">Season:</span>
            <select
              value={selectedSeason}
              onChange={e => setSelectedSeason(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-bold text-zinc-800 focus:outline-none"
            >
              <option value="all">All Seasons</option>
              <option value="Winter">Winter Sardi</option>
              <option value="Ramadan">Ramadan</option>
              <option value="Summer">Summer</option>
              <option value="Eid">Eid Feast</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[#c2410c] hover:underline font-bold px-2 py-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-bold text-zinc-800 focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Dishes Count Indicator */}
      <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
        <div>
          Showing <span className="font-bold text-zinc-900">{filteredDishes.length}</span> authentic dishes
          {searchQuery && <span> matching "{searchQuery}"</span>}
          {selectedCategory !== 'all' && <span> in category</span>}
        </div>
      </div>

      {/* Dish Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDishes.map(dish => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-3xl">
            🍲
          </div>
          <h3 className="text-xl font-bold text-zinc-900">No dishes matched your filters</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            We couldn't find any dishes matching "{searchQuery}" with the selected spice or dietary filters. Try resetting the filters or exploring our full authentic menu.
          </p>
          <button
            onClick={resetFilters}
            className="bg-[#0e382c] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#144738] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
