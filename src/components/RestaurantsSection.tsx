import React from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { Star, Clock, MapPin, ShieldCheck, Flame } from 'lucide-react';

export const RestaurantsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#c2410c] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Central Cloud Kitchens & Dastarkhwans
          </span>
          <h2 className="text-3xl font-black text-[#0e382c] tracking-tight mt-1 font-['Outfit']">
            Authentic Regional Hubs
          </h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-xl">
            Each specialized kitchen is equipped with dedicated clay tandoor pits, deg woodfires, and charcoal grills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RESTAURANTS.map(rest => (
          <div
            key={rest.id}
            className="bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-100">
              <img
                src={rest.coverImage}
                alt={rest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 bg-[#0e382c]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                {rest.city}
              </div>

              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Open Now</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-base leading-tight font-['Outfit']">
                  {rest.name}
                </h3>
                <span className="text-xs text-amber-300 font-['Rozha_One']">
                  {rest.urduName}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2 text-xs text-zinc-600">
                <p className="line-clamp-2 leading-relaxed">
                  {rest.description}
                </p>

                <div className="flex items-center gap-2 pt-1 text-zinc-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{rest.address}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {rest.serviceAreas.slice(0, 4).map((area, i) => (
                    <span key={i} className="bg-zinc-100 text-zinc-600 text-[10px] font-medium px-2 py-0.5 rounded">
                      {area}
                    </span>
                  ))}
                  {rest.serviceAreas.length > 4 && (
                    <span className="text-[10px] text-zinc-400 font-semibold self-center">
                      +{rest.serviceAreas.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{rest.rating}</span>
                  <span className="text-zinc-400 font-normal">({rest.reviewCount})</span>
                </div>

                <div className="flex items-center gap-1 text-zinc-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{rest.avgPrepTime}</span>
                </div>

                <div className="font-bold text-[#0e382c]">
                  Delivery: Rs. {rest.deliveryFee}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
