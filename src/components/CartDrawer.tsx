import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotal,
    setIsCheckoutOpen,
    setIsAuthOpen,
    user,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const freeDeliveryThreshold = 2000;
  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base font-['Outfit']">Your Desi Feast Cart</h2>
            <span className="bg-emerald-950 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Goal Bar */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/60 text-xs">
          {neededForFreeDelivery === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <span>🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-zinc-700">
                <span>
                  Add <strong className="text-[#0e382c]">Rs. {neededForFreeDelivery}</strong> more for{' '}
                  <strong className="text-amber-800">FREE Delivery</strong>
                </span>
                <span className="font-bold text-[#0e382c]">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto text-2xl">
                🍲
              </div>
              <h3 className="font-bold text-base text-zinc-800">Your cart is feeling hungry!</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Explore our hot Biryanis, juicy Karahis, and sweet desserts to build your perfect meal.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#0e382c] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#144738] transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-zinc-900 truncate">
                      {item.dish.name}
                    </h4>
                    <div className="text-[11px] text-zinc-500">
                      Portion: <span className="font-semibold text-zinc-700">{item.portion.name}</span>
                    </div>

                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Add-ons:{' '}
                        {item.selectedAddons.map(a => `${a.name} (+Rs.${a.price})`).join(', ')}
                      </div>
                    )}

                    {item.instructions && (
                      <div className="text-[10px] italic text-amber-700 mt-0.5">
                        Note: "{item.instructions}"
                      </div>
                    )}

                    <div className="text-xs font-black text-[#0e382c] mt-1 font-['Outfit']">
                      Rs. {item.unitPrice} each
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Stepper & Remove */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60">
                  <div className="flex items-center border border-zinc-300 bg-white rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-zinc-900 font-['Outfit']">
                      Rs. {item.totalPrice}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Calculations & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-3">
            {/* Promo coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code (e.g. DESI10)"
                  className="w-full text-xs pl-8 pr-2 py-2 bg-white rounded-xl border border-zinc-200 focus:outline-none uppercase font-bold text-zinc-800 placeholder-zinc-400"
                />
              </div>
              <button
                type="submit"
                disabled={couponLoading || !couponInput.trim()}
                className="bg-[#0e382c] hover:bg-[#144738] text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Active Coupon Banner */}
            {appliedCoupon && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold">{appliedCoupon.code}</span> ({appliedCoupon.discountPercent}% Off)
                  <div className="text-[10px] text-emerald-700">Saved Rs. {cartDiscount}</div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">Rs. {cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-zinc-800">
                  {cartDeliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `Rs. ${cartDeliveryFee}`}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Discount</span>
                  <span>- Rs. {cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#0e382c] pt-2 border-t border-zinc-200 font-['Outfit']">
                <span>Total Amount</span>
                <span>Rs. {cartTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-[#0e382c] hover:bg-[#144738] text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-rose-600 cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
