import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User as UserIcon,
  MapPin,
  Clock,
  Heart,
  Plus,
  RotateCcw,
  Bike,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    user,
    userOrders,
    setActiveTrackingOrder,
    dishes,
    setSelectedDishModal,
    addToCart,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'favorites'>('orders');
  const [newAddressTitle, setNewAddressTitle] = useState('Office');
  const [newAddressText, setNewAddressText] = useState('');
  const [newArea, setNewArea] = useState('Gulberg II');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  if (!isProfileOpen || !user) return null;

  const favoriteDishes = dishes.filter(d => user.favorites?.includes(d.id));

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      const liveDish = dishes.find(d => d.id === item.dish?.id) || item.dish;
      if (liveDish) {
        addToCart(liveDish, item.portion, item.selectedAddons || [], item.instructions || '', item.quantity);
      }
    });
    showToast('Items added to cart from previous order!', 'success');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    try {
      const res = await fetch(`/api/users/${user.id}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAddressTitle,
          address: newAddressText.trim(),
          area: newArea,
          city: 'Lahore',
          isDefault: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        user.addresses = data.addresses;
        showToast('Address saved', 'success');
        setIsAddingAddress(false);
        setNewAddressText('');
      }
    } catch (e) {
      showToast('Could not save address', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-[#0e382c] font-black text-lg flex items-center justify-center shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-['Outfit']">{user.name}</h3>
                {user.role === 'admin' && (
                  <span className="bg-amber-400 text-zinc-950 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-200 mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {user.phone}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 border-b border-zinc-200 bg-zinc-50 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'border-[#0e382c] text-[#0e382c]' : 'border-transparent text-zinc-500'
            }`}
          >
            Past Orders ({userOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'border-[#0e382c] text-[#0e382c]' : 'border-transparent text-zinc-500'
            }`}
          >
            Saved Delivery Addresses ({user.addresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'favorites' ? 'border-[#0e382c] text-[#0e382c]' : 'border-transparent text-zinc-500'
            }`}
          >
            Favourite Dishes ({favoriteDishes.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/50">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-16 text-zinc-400 space-y-2">
                  <Clock className="w-10 h-10 mx-auto text-zinc-300" />
                  <p className="text-xs">You have not placed any orders yet.</p>
                </div>
              ) : (
                userOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <div>
                        <span className="font-bold text-[#0e382c] text-sm font-mono">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-2">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-zinc-700">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.dish?.name || 'Desi Special'} ({item.portion?.name})
                          </span>
                          <span className="font-bold text-zinc-900">Rs. {item.totalPrice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                      <div>
                        <span className="text-zinc-500">Total: </span>
                        <strong className="text-sm font-black text-[#0e382c]">Rs. {order.total}</strong>
                        <span className="text-[10px] text-zinc-400 ml-1">({order.paymentMethod.toUpperCase()})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTrackingOrder(order);
                            setIsProfileOpen(false);
                          }}
                          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                        >
                          Track Status
                        </button>

                        <button
                          onClick={() => handleReorder(order)}
                          className="bg-[#0e382c] hover:bg-[#144738] text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-400" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500 font-semibold">Your Saved Delivery Locations</span>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-[#0e382c] text-white text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingAddress ? 'Cancel' : 'Add Address'}</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-3 text-xs">
                  <h4 className="font-bold text-zinc-900">Add New Address</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={newAddressTitle}
                        onChange={e => setNewAddressTitle(e.target.value)}
                        placeholder="Home / Office / Hostel"
                        className="w-full p-2 rounded-lg border border-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-600 mb-1">Area / Sector</label>
                      <input
                        type="text"
                        value={newArea}
                        onChange={e => setNewArea(e.target.value)}
                        placeholder="Gulberg / DHA"
                        className="w-full p-2 rounded-lg border border-zinc-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddressText}
                      onChange={e => setNewAddressText(e.target.value)}
                      placeholder="House / Flat / Plaza #"
                      className="w-full p-2 rounded-lg border border-zinc-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#0e382c] text-white px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {user.addresses?.map(addr => (
                <div
                  key={addr.id}
                  className="p-3.5 bg-white rounded-2xl border border-zinc-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <span>{addr.title}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-600 mt-0.5">{addr.address}</p>
                      <span className="text-[10px] text-zinc-400">
                        {addr.area}, {addr.city}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteDishes.length === 0 ? (
                <div className="text-center py-16 text-zinc-400 space-y-2">
                  <Heart className="w-10 h-10 mx-auto text-zinc-300" />
                  <p className="text-xs">You have not marked any favourite dishes yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteDishes.map(dish => (
                    <div
                      key={dish.id}
                      className="p-3 bg-white rounded-2xl border border-zinc-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="truncate">
                          <h4 className="font-bold text-zinc-900 truncate">{dish.name}</h4>
                          <span className="text-xs font-black text-[#0e382c]">Rs. {dish.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDishModal(dish)}
                        className="bg-[#0e382c] text-white px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer"
                      >
                        Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
