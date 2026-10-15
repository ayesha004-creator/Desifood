import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { PortionOption, AddonOption } from '../types';

export const DishModal: React.FC = () => {
  const { selectedDishModal, setSelectedDishModal, addToCart, favorites, toggleFavorite } = useApp();

  if (!selectedDishModal) return null;

  const dish = selectedDishModal;
  const isFav = favorites.includes(dish.id);

  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(
    dish.portionOptions && dish.portionOptions.length > 0
      ? dish.portionOptions[0]
      : { id: 'std', name: 'Standard Serving', priceDelta: 0 }
  );

  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset states when modal dish changes
  useEffect(() => {
    if (dish) {
      setSelectedPortion(
        dish.portionOptions && dish.portionOptions.length > 0
          ? dish.portionOptions[0]
          : { id: 'std', name: 'Standard Serving', priceDelta: 0 }
      );
      setSelectedAddons([]);
      setInstructions('');
      setQuantity(1);
    }
  }, [dish.id]);

  const toggleAddon = (addon: AddonOption) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const unitPrice = dish.price + selectedPortion.priceDelta + selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(dish, selectedPortion, selectedAddons, instructions, quantity);
    setSelectedDishModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDishModal(null)}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-900">
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-[#c2410c] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  {dish.cuisine} Authentic
                </span>
                {dish.seasonalTag && (
                  <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {dish.seasonalTag} Special
                  </span>
                )}
                <span className="bg-emerald-900/90 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                  {dish.dietary}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                {dish.name}
              </h2>
              {dish.urduName && (
                <p className="text-sm text-amber-300 font-['Rozha_One'] mt-0.5">
                  {dish.urduName}
                </p>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Rating, Time & Calories row */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 text-xs text-zinc-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-current text-amber-500" />
                  <span>{dish.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 font-normal">({dish.reviewCount} customer reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span>{dish.prepTime}</span>
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(dish.id)}
                className={`flex items-center gap-1 font-bold text-xs cursor-pointer ${
                  isFav ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                <span>{isFav ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Culinary Description
              </h4>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Key Ingredients & Spices
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dish.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg text-xs font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portion Selection */}
            {dish.portionOptions && dish.portionOptions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Select Portion Size <span className="text-rose-500">*</span>
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-medium">Choose 1</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dish.portionOptions.map(portion => {
                    const isSelected = selectedPortion.id === portion.id;
                    const portionPrice = dish.price + portion.priceDelta;

                    return (
                      <button
                        key={portion.id}
                        type="button"
                        onClick={() => setSelectedPortion(portion)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0e382c] bg-emerald-50/70 text-[#0e382c] ring-1 ring-[#0e382c]'
                            : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{portion.name}</div>
                          {portion.priceDelta !== 0 && (
                            <span className="text-[10px] text-zinc-500">
                              {portion.priceDelta > 0 ? `+Rs. ${portion.priceDelta}` : `-Rs. ${Math.abs(portion.priceDelta)}`}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-black">
                          Rs. {portionPrice}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Addons */}
            {dish.availableAddons && dish.availableAddons.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Popular Desi Add-ons & Sides
                  </h4>
                  <span className="text-[11px] text-zinc-400">Optional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dish.availableAddons.map(addon => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);

                    return (
                      <label
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer select-none ${
                          isChecked
                            ? 'border-amber-500 bg-amber-50/80 text-zinc-900'
                            : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-[#0e382c] focus:ring-[#0e382c]"
                          />
                          <span className="text-xs font-medium">{addon.name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#0e382c]">
                          +Rs. {addon.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cooking Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                Special Kitchen Instructions (Urdu or English)
              </label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Kam mirch (mild spice), extra lemon slices, gravy separate, etc."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] text-zinc-800 placeholder-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-zinc-300 bg-white rounded-xl shadow-xs overflow-hidden">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-bold text-zinc-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="p-2.5 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#0e382c] hover:bg-[#144738] text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg flex items-center justify-between transition-all transform hover:scale-[1.01] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Add to Desi Cart</span>
            </span>
            <span className="text-amber-300 font-['Outfit'] text-base font-bold">
              Rs. {totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
