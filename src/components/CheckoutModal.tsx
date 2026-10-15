import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Phone,
  User as UserIcon,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    user,
    currentCity,
    currentArea,
    placeOrder,
  } = useApp();

  const defaultAddr = user?.addresses.find(a => a.isDefault) || user?.addresses[0];

  const [name, setName] = useState(user?.name || 'Ayesha Karamat');
  const [email, setEmail] = useState(user?.email || 'ayesha@desibite.pk');
  const [phone, setPhone] = useState(user?.phone || '+92 300 4567890');
  const [address, setAddress] = useState(defaultAddr?.address || 'House 42-B, Sector Z, Phase 3, DHA');
  const [city, setCity] = useState(defaultAddr?.city || currentCity);
  const [area, setArea] = useState(defaultAddr?.area || currentArea);
  const [riderInstructions, setRiderInstructions] = useState(defaultAddr?.instructions || 'Call at the gate upon arrival.');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [jazzCashNumber, setJazzCashNumber] = useState('0300 1234567');
  const [easypaisaNumber, setEasypaisaNumber] = useState('0345 1234567');
  const [codNeedChange, setCodNeedChange] = useState(false);
  const [changeForAmount, setChangeForAmount] = useState('5000');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    const fullInstructions = [
      riderInstructions.trim(),
      paymentMethod === 'cod' && codNeedChange ? `(Requires change for Rs. ${changeForAmount})` : null,
      paymentMethod === 'jazzcash' ? `(Paid via JazzCash: ${jazzCashNumber})` : null,
      paymentMethod === 'easypaisa' ? `(Paid via Easypaisa: ${easypaisaNumber})` : null,
    ]
      .filter(Boolean)
      .join(' • ');

    const customerInfo = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      area: area.trim(),
      instructions: fullInstructions,
    };

    const newOrder = await placeOrder(customerInfo, paymentMethod);
    setIsSubmitting(false);

    if (!newOrder) {
      setErrorMessage('Failed to place order. Please check your network and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg font-['Outfit']">Complete Your Order</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Delivery Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e382c] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>1. Delivery Destination & Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ayesha Karamat"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-semibold mb-1">Phone Number (Rider Contact)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-600 font-semibold mb-1">Complete Street Address, House/Flat #</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. House 42-B, Street 14, Sector Z, Phase 3"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-semibold mb-1">City</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c] bg-white font-medium"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 font-semibold mb-1">Area / Sector</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. DHA Phase 3 / Gulberg"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-600 font-semibold mb-1">Instructions for Delivery Rider (Optional)</label>
                <input
                  type="text"
                  value={riderInstructions}
                  onChange={e => setRiderInstructions(e.target.value)}
                  placeholder="e.g. Leave at guard room, call before ringing bell, 3rd floor"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#0e382c]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e382c] flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-amber-600" />
              <span>2. Select Payment Method (Pakistan)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#0e382c] bg-emerald-50/70 ring-1 ring-[#0e382c]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-[#0e382c]"
                />
                <div>
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Pay with physical cash to rider upon food delivery.
                  </p>
                </div>
              </label>

              {/* JazzCash */}
              <label
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#0e382c] bg-emerald-50/70 ring-1 ring-[#0e382c]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-0.5 text-[#0e382c]"
                />
                <div>
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-red-600" />
                    <span>JazzCash Mobile Wallet</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Direct debited via JazzCash Mobile Account prompt.
                  </p>
                </div>
              </label>

              {/* Easypaisa */}
              <label
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-[#0e382c] bg-emerald-50/70 ring-1 ring-[#0e382c]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-0.5 text-[#0e382c]"
                />
                <div>
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Easypaisa Mobile Wallet</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Direct debited via Telenor Easypaisa Account.
                  </p>
                </div>
              </label>

              {/* Credit / Debit Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#0e382c] bg-emerald-50/70 ring-1 ring-[#0e382c]'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-0.5 text-[#0e382c]"
                />
                <div>
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>Debit / Credit Card</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Visa, Mastercard, PayPak gateway enabled.
                  </p>
                </div>
              </label>
            </div>

            {/* Dynamic payment options details */}
            {paymentMethod === 'cod' && (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-700">
                  <input
                    type="checkbox"
                    checked={codNeedChange}
                    onChange={e => setCodNeedChange(e.target.checked)}
                    className="rounded text-[#0e382c]"
                  />
                  <span>I will need change from rider</span>
                </label>
                {codNeedChange && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">I have note of:</span>
                    <select
                      value={changeForAmount}
                      onChange={e => setChangeForAmount(e.target.value)}
                      className="bg-white p-1 rounded-lg border border-zinc-300 font-bold"
                    >
                      <option value="5000">Rs. 5,000</option>
                      <option value="1000">Rs. 1,000</option>
                      <option value="500">Rs. 500</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'jazzcash' && (
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 text-xs space-y-2">
                <div className="font-bold text-red-950">Enter JazzCash Registered Mobile Number:</div>
                <input
                  type="text"
                  value={jazzCashNumber}
                  onChange={e => setJazzCashNumber(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full p-2 bg-white rounded-lg border border-red-200 font-medium"
                />
                <p className="text-[11px] text-red-800">
                  You will receive a 4-digit MPIN verification prompt on your mobile screen after placing the order.
                </p>
              </div>
            )}

            {paymentMethod === 'easypaisa' && (
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-950">Enter Easypaisa Registered Mobile Number:</div>
                <input
                  type="text"
                  value={easypaisaNumber}
                  onChange={e => setEasypaisaNumber(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full p-2 bg-white rounded-lg border border-emerald-200 font-medium"
                />
                <p className="text-[11px] text-emerald-800">
                  Approve the payment request in your Easypaisa app or enter your MPIN on your mobile prompt.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-950">Card Checkout:</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    disabled
                    className="col-span-2 p-2 bg-white rounded-lg border border-amber-200 font-mono text-zinc-600"
                  />
                  <input
                    type="text"
                    defaultValue="12/28"
                    disabled
                    className="p-2 bg-white rounded-lg border border-amber-200 font-mono text-zinc-600 text-center"
                  />
                  <input
                    type="text"
                    defaultValue="•••"
                    disabled
                    className="p-2 bg-white rounded-lg border border-amber-200 font-mono text-zinc-600 text-center"
                  />
                </div>
                <p className="text-[11px] text-amber-800">
                  Secured via 256-bit SSL encrypted 3D Secure Pakistan payment network.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary & Final Total */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e382c] flex items-center justify-between">
              <span>3. Order Items Review ({cart.length})</span>
              <span className="text-[11px] text-zinc-500 font-normal">
                Estimated Prep: 25-35 mins
              </span>
            </h3>

            <div className="bg-zinc-50 rounded-2xl p-3 space-y-2 text-xs">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-zinc-700">
                  <div className="truncate max-w-[280px]">
                    <span className="font-bold">{item.quantity}x</span> {item.dish.name}{' '}
                    <span className="text-zinc-500 text-[10px]">({item.portion.name})</span>
                  </div>
                  <span className="font-bold">Rs. {item.totalPrice}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-zinc-200 space-y-1 text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{cartDeliveryFee === 0 ? 'FREE' : `Rs. ${cartDeliveryFee}`}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>- Rs. {cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#0e382c] pt-2 border-t border-zinc-200 font-['Outfit']">
                  <span>Total Payable</span>
                  <span>Rs. {cartTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0e382c] hover:bg-[#144738] disabled:opacity-50 text-white py-4 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] cursor-pointer"
          >
            {isSubmitting ? (
              <span>Confirming with DesiBite Kitchen...</span>
            ) : (
              <>
                <span>Place Order • Rs. {cartTotal}</span>
                <ArrowRight className="w-5 h-5 text-amber-400" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
