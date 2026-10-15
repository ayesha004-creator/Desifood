import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  PackageCheck,
  ShoppingBag,
  Phone,
  AlertTriangle,
  Receipt,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    showToast,
    refreshUserOrders,
  } = useApp();

  const [simulating, setSimulating] = useState(false);

  if (!activeTrackingOrder) return null;

  const order = activeTrackingOrder;

  const STATUS_STEPS: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: 'Pending', label: 'Order Received', icon: Clock, desc: 'Kitchen is reviewing your order' },
    { status: 'Confirmed', label: 'Order Accepted', icon: CheckCircle2, desc: 'Master chef scheduled your order' },
    { status: 'Preparing', label: 'Cooking & Simmering', icon: ChefHat, desc: 'Piping hot food on tawa & handi' },
    { status: 'Ready for Pickup', label: 'Packed & Insulated', icon: PackageCheck, desc: 'Sealed in thermal delivery bags' },
    { status: 'Out for Delivery', label: 'Rider On The Way', icon: Bike, desc: 'Muhammad Tariq is riding your way' },
    { status: 'Delivered', label: 'Delivered Fresh', icon: Sparkles, desc: 'Ghar Jaisa Zaiqa at your doorstep' },
  ];

  const currentIdx = STATUS_STEPS.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'Cancelled';

  // Advance status simulation for interactive review
  const handleAdvanceStatus = async () => {
    if (currentIdx >= STATUS_STEPS.length - 1 || isCancelled) return;
    const nextStatus = STATUS_STEPS[currentIdx + 1].status;
    setSimulating(true);

    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, note: `Demo advance to ${nextStatus}` }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setActiveTrackingOrder(data.order);
        refreshUserOrders();
        showToast(`Order status updated to: ${nextStatus}!`, 'info');
      }
    } catch (e) {
      showToast('Status update failed', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (currentIdx > 1) {
      showToast('Order is already cooking and cannot be cancelled.', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled', note: 'Cancelled by customer' }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setActiveTrackingOrder(data.order);
        refreshUserOrders();
        showToast('Order cancelled successfully', 'info');
      }
    } catch (e) {
      showToast('Failed to cancel order', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base font-['Outfit']">Live Order Tracking</h2>
              <span className="text-xs text-emerald-200 font-mono">Order #{order.orderNumber}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracking Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Estimated Arrival Banner */}
          {!isCancelled && order.status !== 'Delivered' && (
            <div className="bg-gradient-to-r from-amber-500 to-[#c2410c] text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">
                  Estimated Arrival Time
                </span>
                <div className="text-2xl font-black font-['Outfit'] flex items-center gap-2">
                  <Clock className="w-6 h-6 animate-pulse" />
                  <span>{order.estimatedMinutes} Mins</span>
                </div>
              </div>
              <div className="text-right text-xs text-amber-100 font-medium">
                <div>Delivering to {order.customer.area}</div>
                <div className="text-[10px] opacity-80">{order.customer.city}</div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong className="block text-sm">Order Cancelled</strong>
                This order was cancelled. Any pre-authorized charges will be refunded.
              </div>
            </div>
          )}

          {order.status === 'Delivered' && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-sm">Food Delivered Fresh!</strong>
                Nosh-e-Jaan! Thank you for ordering with DesiBite.
              </div>
            </div>
          )}

          {/* Stepper Progress Bar */}
          {!isCancelled && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Live Kitchen & Delivery Lifecycle
              </h3>

              <div className="space-y-4">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={step.status} className="flex items-start gap-3.5 relative">
                      {idx !== STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                            currentIdx > idx ? 'bg-emerald-600' : 'bg-zinc-200'
                          }`}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors z-10 ${
                          isCurrent
                            ? 'bg-amber-500 text-zinc-950 ring-4 ring-amber-100 shadow-md'
                            : isDone
                            ? 'bg-[#0e382c] text-white'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-[#0e382c]' : isDone ? 'text-zinc-800' : 'text-zinc-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rider Info Card */}
          {order.riderInfo && !isCancelled && order.status !== 'Pending' && (
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={order.riderInfo.avatar}
                  alt={order.riderInfo.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Assigned Desi Delivery Partner
                  </span>
                  <h4 className="font-bold text-sm text-zinc-900">{order.riderInfo.name}</h4>
                  <div className="text-xs text-zinc-500">{order.riderInfo.bikeNumber}</div>
                </div>
              </div>

              <a
                href={`tel:${order.riderInfo.phone}`}
                className="bg-[#0e382c] hover:bg-[#144738] text-white p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Call Rider</span>
              </a>
            </div>
          )}

          {/* Ordered Items Receipt */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              <span>Items in this Order ({order.items.length})</span>
            </h3>

            <div className="bg-zinc-50 rounded-2xl p-4 space-y-2 text-xs border border-zinc-200/80">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-zinc-800">
                  <div>
                    <span className="font-bold">{item.quantity}x</span> {item.dish?.name || 'Desi Special'}{' '}
                    <span className="text-zinc-500">({item.portion?.name})</span>
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-[10px] text-zinc-400">
                        + {item.selectedAddons.map(a => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-black">Rs. {item.totalPrice}</span>
                </div>
              ))}

              <div className="pt-2 mt-2 border-t border-zinc-200 space-y-1 text-zinc-600 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({order.couponCode})</span>
                    <span>- Rs. {order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#0e382c] pt-2 border-t border-zinc-200 font-['Outfit']">
                  <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
                  <span>Rs. {order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls for Reviewers */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Live Demo Lifecycle Simulator:
              </span>
              <span className="text-[10px] text-amber-700">Test full food order flow</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAdvanceStatus}
                disabled={simulating || currentIdx >= STATUS_STEPS.length - 1 || isCancelled}
                className="bg-[#0e382c] hover:bg-[#144738] disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Advance to Next Status</span>
                <span className="text-amber-400">→</span>
              </button>

              {currentIdx <= 1 && !isCancelled && (
                <button
                  onClick={handleCancelOrder}
                  className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
