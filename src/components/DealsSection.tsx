import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Sparkles, Copy, Check } from 'lucide-react';
import { INITIAL_COUPONS } from '../data/restaurants';

export const DealsSection: React.FC = () => {
  const { applyCoupon, showToast, setIsCartOpen } = useApp();

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    showToast(`Copied and applied coupon: ${code}!`, 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#c2410c] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Special Offers & Dastarkhwan Discounts
          </span>
          <h2 className="text-3xl font-black text-[#0e382c] tracking-tight mt-1 font-['Outfit']">
            Today's Desi Deals
          </h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-xl">
            Save on your family feasts and weekend gatherings with our active promo codes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_COUPONS.map((coupon, i) => (
          <div
            key={coupon.code}
            className={`p-6 rounded-3xl border relative overflow-hidden shadow-sm hover:shadow-xl transition-all ${
              i === 0
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300'
                : i === 1
                ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border-emerald-300'
                : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white border-rose-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="bg-[#0e382c] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                {coupon.discountPercent}% Instant Off
              </span>
              <Tag className="w-5 h-5 text-zinc-400" />
            </div>

            <div className="my-4">
              <div className="text-2xl font-black text-[#0e382c] font-mono tracking-wider">
                {coupon.code}
              </div>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed font-medium">
                {coupon.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-500">
                Min. Order: Rs. {coupon.minOrder}
              </span>
              <button
                onClick={() => handleCopyCoupon(coupon.code)}
                className="bg-[#0e382c] hover:bg-[#144738] text-white px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Apply Deal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
