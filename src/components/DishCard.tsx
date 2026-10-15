import React from 'react';
import { Dish } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Star, Clock, Flame, Plus, Check } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { setSelectedDishModal, favorites, toggleFavorite, cart, addToCart } = useApp();

  const isFav = favorites.includes(dish.id);
  const cartItemCount = cart
    .filter(item => item.dish.id === dish.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const getSpiceBadge = (level: string) => {
    switch (level) {
      case 'Mild':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Mild</span>;
      case 'Medium':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Medium 🌶️</span>;
      case 'Spicy':
        return <span className="bg-orange-100 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Spicy 🌶️🌶️</span>;
      case 'Extra Spicy':
        return <span className="bg-red-100 text-red-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Extra Spicy 🔥</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col group">
      {/* Dish Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => setSelectedDishModal(dish)}>
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(dish.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isFav
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {dish.seasonalTag && (
            <span className="bg-[#c2410c] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3" /> {dish.seasonalTag} Special
            </span>
          )}
          {dish.isBestSeller && !dish.seasonalTag && (
            <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Best Seller ⭐
            </span>
          )}
          <span className="bg-[#0e382c]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
            {dish.cuisine}
          </span>
        </div>

        {/* Dietary & Calories overlay at bottom of image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium drop-shadow">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${dish.dietary === 'Vegetarian' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {dish.dietary}
          </span>
          {dish.calories && <span>{dish.calories} kcal</span>}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2 cursor-pointer" onClick={() => setSelectedDishModal(dish)}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-[#0e382c] transition-colors leading-snug line-clamp-1 font-['Outfit']">
                {dish.name}
              </h3>
              {dish.urduName && (
                <p className="text-xs text-emerald-800 font-medium font-['Rozha_One']">
                  {dish.urduName}
                </p>
              )}
            </div>
            {getSpiceBadge(dish.spiceLevel)}
          </div>

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{dish.rating.toFixed(1)}</span>
              <span className="text-zinc-400 font-normal">({dish.reviewCount})</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{dish.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action row */}
        <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Starts from</span>
            <div className="text-lg font-black text-[#0e382c] font-['Outfit']">
              Rs. {dish.price}
            </div>
          </div>

          {dish.isAvailable ? (
            <button
              onClick={() => setSelectedDishModal(dish)}
              className="bg-emerald-50 hover:bg-[#0e382c] text-[#0e382c] hover:text-white border border-emerald-600/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{cartItemCount > 0 ? `In Cart (${cartItemCount})` : 'Add to Cart'}</span>
            </button>
          ) : (
            <span className="bg-zinc-100 text-zinc-400 px-3 py-1.5 rounded-xl text-xs font-bold">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
