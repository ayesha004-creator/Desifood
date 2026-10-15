import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Dish, Order, OrderStatus, SeasonTag } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    dishes,
    setDishes,
    toggleAvailability,
    activeSeason,
    setActiveSeason,
    showToast,
    refreshMenu,
    refreshUserOrders,
    user,
    setIsAuthOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'season'>('overview');

  // Stats state
  const [stats, setStats] = useState({
    totalRevenue: 4904,
    totalOrders: 3,
    pendingOrders: 2,
    completedOrders: 1,
    totalCustomers: 2,
    totalDishes: dishes.length,
    avgOrderValue: 1634,
    activeSeason: 'Winter',
  });

  // Orders list state
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Menu editor modal
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);

  // New/Edited dish form state
  const [dishForm, setDishForm] = useState<Partial<Dish>>({
    name: '',
    urduName: '',
    description: '',
    price: 500,
    category: 'biryani-rice',
    cuisine: 'Lahori',
    spiceLevel: 'Medium',
    dietary: 'Halal',
    prepTime: '20-25 mins',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
    ingredients: ['Basmati Rice', 'Chicken', 'Desi Ghee', 'Saffron'],
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false,
    seasonalTag: null,
  });

  const loadAdminData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);
      }

      const ordersRes = await fetch('/api/orders?role=admin');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.orders) setAllOrders(ordersData.orders);
      }
    } catch (e) {
      console.warn('Admin load error:', e);
    }
  };

  useEffect(() => {
    if (isAdminOpen) {
      loadAdminData();
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  // Handle order status update from admin table
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: `Admin updated status to ${newStatus}` }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setAllOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        showToast(`Order status updated to ${newStatus}`, 'success');
        refreshUserOrders();
        loadAdminData();
      }
    } catch (e) {
      showToast('Failed to update order status', 'error');
    }
  };

  // Handle dish delete
  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    try {
      const res = await fetch(`/api/menu/${dishId}`, { method: 'DELETE' });
      if (res.ok) {
        setDishes(prev => prev.filter(d => d.id !== dishId));
        showToast('Dish deleted from menu', 'info');
      }
    } catch (e) {
      showToast('Failed to delete dish', 'error');
    }
  };

  // Handle dish save (Create or Edit)
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDish) {
        // Update
        const res = await fetch(`/api/menu/${editingDish.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishForm),
        });
        const data = await res.json();
        if (data.success && data.dish) {
          setDishes(prev => prev.map(d => (d.id === editingDish.id ? data.dish : d)));
          showToast(`Updated ${data.dish.name}`, 'success');
          setEditingDish(null);
        }
      } else {
        // Create new
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...dishForm,
            portionOptions: [
              { id: 'std', name: 'Standard Plate', priceDelta: 0 },
              { id: 'double', name: 'Double / Platter', priceDelta: 250 },
            ],
            availableAddons: [
              { id: 'raita', name: 'Cool Zeera Raita', price: 60 },
              { id: 'salad', name: 'Kachumber Salad', price: 50 },
            ],
          }),
        });
        const data = await res.json();
        if (data.success && data.dish) {
          setDishes(prev => [data.dish, ...prev]);
          showToast(`Created new dish: ${data.dish.name}`, 'success');
          setIsAddDishModalOpen(false);
        }
      }
    } catch (e) {
      showToast('Failed to save dish', 'error');
    }
  };

  const filteredOrders = allOrders.filter(o => {
    if (orderFilter !== 'all' && o.status.toLowerCase() !== orderFilter.toLowerCase()) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-6xl w-full h-[95vh] shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <div className="p-4 sm:p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg font-['Outfit']">DesiBite Admin Portal</h2>
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  Production Master
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Full-Stack Management • Live Kitchens • Orders • Menu • PST Season Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-zinc-200 bg-zinc-50 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#0e382c] text-[#0e382c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            📊 Analytics & Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#0e382c] text-[#0e382c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>📦 Orders Manager</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {allOrders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'menu'
                ? 'border-[#0e382c] text-[#0e382c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>🍲 Menu & Dishes</span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {dishes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('season')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'season'
                ? 'border-[#0e382c] text-[#0e382c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>🍂 Seasonal Controls</span>
            <span className="bg-orange-100 text-orange-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
              {activeSeason || 'Winter'}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-zinc-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                    <span>Total Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-[#0e382c] mt-2 font-['Outfit']">
                    Rs. {stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                    +18% from last week
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                    <span>Total Orders Placed</span>
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-zinc-900 mt-2 font-['Outfit']">
                    {stats.totalOrders}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Avg Order: Rs. {stats.avgOrderValue}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                    <span>Active / In Kitchen</span>
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-2xl font-black text-orange-600 mt-2 font-['Outfit']">
                    {stats.pendingOrders}
                  </div>
                  <div className="text-[10px] text-orange-700 font-semibold mt-1">
                    Simmering on flame
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
                  <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                    <span>Total Menu Dishes</span>
                    <Flame className="w-4 h-4 text-[#c2410c]" />
                  </div>
                  <div className="text-2xl font-black text-zinc-900 mt-2 font-['Outfit']">
                    {dishes.length}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Across 11 Authentic Categories
                  </div>
                </div>
              </div>

              {/* Kitchen Performance & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 flex items-center justify-between">
                    <span>🏆 Top Best-Selling Dishes</span>
                    <span className="text-xs text-zinc-400 font-normal">Real-time counts</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    {dishes.slice(0, 5).map((dish, i) => (
                      <div key={dish.id} className="flex items-center justify-between pb-2 border-b border-zinc-100 last:border-b-0">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 font-black text-zinc-400">#{i + 1}</span>
                          <img src={dish.image} alt={dish.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-zinc-900">{dish.name}</div>
                            <span className="text-[10px] text-zinc-500">{dish.cuisine} • Rs. {dish.price}</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-800">{dish.reviewCount} orders</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 flex items-center justify-between">
                    <span>⚡ Quick Management Actions</span>
                    <span className="text-xs text-emerald-700 font-bold">Admin Privileges</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => {
                        setEditingDish(null);
                        setDishForm({
                          name: '',
                          urduName: '',
                          description: '',
                          price: 450,
                          category: 'biryani-rice',
                          cuisine: 'Lahori',
                          spiceLevel: 'Medium',
                          dietary: 'Halal',
                          prepTime: '20 mins',
                          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
                          ingredients: ['Basmati Rice', 'Chicken', 'Spices'],
                          isAvailable: true,
                          isFeatured: true,
                        });
                        setIsAddDishModalOpen(true);
                      }}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 text-[#0e382c] rounded-xl font-bold border border-emerald-200 text-left flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>Add New Dish to Menu</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('season')}
                      className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-xl font-bold border border-amber-200 text-left flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <span>Configure Seasons & Banner</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-bold border border-zinc-200 text-left flex items-center gap-2 cursor-pointer transition-colors sm:col-span-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-zinc-700" />
                      <span>Process Live Kitchen Orders ({stats.pendingOrders} Pending)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-200 text-xs">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    placeholder="Search order #, customer, city..."
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-zinc-500 font-semibold">Filter Status:</span>
                  <select
                    value={orderFilter}
                    onChange={e => setOrderFilter(e.target.value)}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white font-bold"
                  >
                    <option value="all">All Orders ({allOrders.length})</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer & Area</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Current Status</th>
                        <th className="p-3 text-right">Kitchen Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center p-8 text-zinc-400">
                            No orders match this filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="p-3 font-bold text-[#0e382c] font-mono">
                              {order.orderNumber}
                              <div className="text-[10px] text-zinc-400 font-normal">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="font-bold text-zinc-900">{order.customer.name}</div>
                              <div className="text-[11px] text-zinc-500">{order.customer.phone}</div>
                              <div className="text-[10px] text-zinc-400 truncate max-w-[160px]">
                                {order.customer.area}, {order.customer.city}
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="font-semibold text-zinc-800">
                                {order.items.map(i => `${i.quantity}x ${i.dish?.name || 'Dish'}`).join(', ')}
                              </div>
                              {order.customer.instructions && (
                                <div className="text-[10px] text-amber-700 italic">
                                  Note: {order.customer.instructions}
                                </div>
                              )}
                            </td>

                            <td className="p-3 font-black text-zinc-900 font-['Outfit'] text-sm">
                              Rs. {order.total}
                            </td>

                            <td className="p-3">
                              <span className="font-bold uppercase text-[10px] bg-zinc-100 px-2 py-0.5 rounded">
                                {order.paymentMethod}
                              </span>
                              <div className="text-[10px] text-zinc-500 mt-0.5">
                                {order.paymentStatus === 'completed' ? '✅ Paid' : '⏳ Pending'}
                              </div>
                            </td>

                            <td className="p-3">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.status === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {order.status === 'Pending' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Confirmed')}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                )}
                                {order.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Cook
                                  </button>
                                )}
                                {order.status === 'Preparing' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Out for Delivery')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Dispatch
                                  </button>
                                )}
                                {order.status === 'Out for Delivery' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Delivered
                                  </button>
                                )}
                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                    className="text-rose-600 hover:bg-rose-50 px-1.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MENU & DISHES */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Manage Food Menu</h3>
                  <p className="text-xs text-zinc-500">
                    Add, edit, change prices, toggle availability, or assign seasonal tags.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingDish(null);
                    setDishForm({
                      name: '',
                      urduName: '',
                      description: '',
                      price: 550,
                      category: 'biryani-rice',
                      cuisine: 'Lahori',
                      spiceLevel: 'Medium',
                      dietary: 'Halal',
                      prepTime: '20-25 mins',
                      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
                      ingredients: ['Basmati Rice', 'Chicken', 'Desi Ghee'],
                      isAvailable: true,
                      isFeatured: false,
                    });
                    setIsAddDishModalOpen(true);
                  }}
                  className="bg-[#0e382c] hover:bg-[#144738] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dishes.map(dish => (
                  <div
                    key={dish.id}
                    className="p-3 bg-white rounded-2xl border border-zinc-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="truncate">
                        <h4 className="font-bold text-zinc-900 truncate">{dish.name}</h4>
                        <div className="text-[10px] text-zinc-400">{dish.category} • {dish.cuisine}</div>
                        <div className="font-bold text-[#0e382c]">Rs. {dish.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleAvailability(dish.id)}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          dish.isAvailable ? 'text-emerald-700 hover:bg-emerald-50' : 'text-zinc-400 hover:bg-zinc-100'
                        }`}
                        title={dish.isAvailable ? 'Dish is Active' : 'Dish is Sold Out'}
                      >
                        {dish.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          setEditingDish(dish);
                          setDishForm(dish);
                          setIsAddDishModalOpen(true);
                        }}
                        className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SEASONAL CONTROLS */}
          {activeTab === 'season' && (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#c2410c]" />
                  <span>Pakistan Seasonal Menu Settings</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Control which seasonal collection is featured across the homepage, header, and recommendations.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Active Food Season</label>
                  <select
                    value={activeSeason || 'Winter'}
                    onChange={e => {
                      const season = e.target.value as SeasonTag;
                      setActiveSeason(season);
                      fetch('/api/season', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ activeSeason: season, autoDetect: false }),
                      });
                      showToast(`Active season updated to ${season}`, 'success');
                    }}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 font-bold text-zinc-800 bg-white"
                  >
                    <option value="Winter">Winter (Sarson Ka Saag, Nihari, Kashmiri Chai, Gajar Halwa)</option>
                    <option value="Summer">Summer (Mango Lassi, Fresh Sharbat, Mint Lemonade)</option>
                    <option value="Ramadan">Ramadan (Iftar Platters, Samosa Chaat, Rooh Afza)</option>
                    <option value="Eid">Eid Feast (Mutton Dum Biryani, Shahi Qorma, Sheer Khurma)</option>
                  </select>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold">Pakistan Standard Time (PST) Automatic Sync:</div>
                  <p className="text-[11px] text-emerald-800">
                    Currently operating in <strong>{activeSeason} Mode</strong>. Seasonal specials automatically display the seasonal dishes on the homepage banner with a special discount highlight.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add or Edit Dish */}
        {isAddDishModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <h3 className="font-bold text-base text-zinc-900">
                  {editingDish ? `Edit Dish: ${editingDish.name}` : 'Add New Desi Dish'}
                </h3>
                <button
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Dish Name (English)</label>
                  <input
                    type="text"
                    required
                    value={dishForm.name}
                    onChange={e => setDishForm({ ...dishForm, name: e.target.value })}
                    placeholder="e.g. Special Peshawari Chapli Kebab"
                    className="w-full p-2 rounded-lg border border-zinc-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Urdu Name (Optional)</label>
                  <input
                    type="text"
                    value={dishForm.urduName || ''}
                    onChange={e => setDishForm({ ...dishForm, urduName: e.target.value })}
                    placeholder="e.g. پشاوری چپلی کباب"
                    className="w-full p-2 rounded-lg border border-zinc-300 font-['Rozha_One']"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Base Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={dishForm.price}
                      onChange={e => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-zinc-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Prep Time</label>
                    <input
                      type="text"
                      value={dishForm.prepTime || '20 mins'}
                      onChange={e => setDishForm({ ...dishForm, prepTime: e.target.value })}
                      className="w-full p-2 rounded-lg border border-zinc-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Category</label>
                    <select
                      value={dishForm.category}
                      onChange={e => setDishForm({ ...dishForm, category: e.target.value })}
                      className="w-full p-2 rounded-lg border border-zinc-300 bg-white"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="biryani-rice">Biryani & Rice</option>
                      <option value="karahi-handi">Karahi & Handi</option>
                      <option value="curries-salan">Curries & Salan</option>
                      <option value="bbq-grill">BBQ & Grilled</option>
                      <option value="traditional-regional">Traditional & Regional</option>
                      <option value="roti-bread">Roti & Tandoor</option>
                      <option value="street-food">Snacks & Street Food</option>
                      <option value="fast-food">Fast Food</option>
                      <option value="desserts">Desserts</option>
                      <option value="drinks">Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Cuisine</label>
                    <select
                      value={dishForm.cuisine}
                      onChange={e => setDishForm({ ...dishForm, cuisine: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-zinc-300 bg-white"
                    >
                      <option value="Lahori">Lahori</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Peshawari">Peshawari</option>
                      <option value="Sindhi">Sindhi</option>
                      <option value="Mughlai">Mughlai</option>
                      <option value="Balochi">Balochi</option>
                      <option value="Kashmiri">Kashmiri</option>
                      <option value="Street Food">Street Food</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Spice Level</label>
                    <select
                      value={dishForm.spiceLevel}
                      onChange={e => setDishForm({ ...dishForm, spiceLevel: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-zinc-300 bg-white"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Spicy">Spicy</option>
                      <option value="Extra Spicy">Extra Spicy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Seasonal Tag</label>
                    <select
                      value={dishForm.seasonalTag || ''}
                      onChange={e => setDishForm({ ...dishForm, seasonalTag: (e.target.value || null) as any })}
                      className="w-full p-2 rounded-lg border border-zinc-300 bg-white"
                    >
                      <option value="">None (Regular)</option>
                      <option value="Winter">Winter</option>
                      <option value="Summer">Summer</option>
                      <option value="Ramadan">Ramadan</option>
                      <option value="Eid">Eid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={dishForm.image}
                    onChange={e => setDishForm({ ...dishForm, image: e.target.value })}
                    className="w-full p-2 rounded-lg border border-zinc-300"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={dishForm.description}
                    onChange={e => setDishForm({ ...dishForm, description: e.target.value })}
                    className="w-full p-2 rounded-lg border border-zinc-300"
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={dishForm.isAvailable}
                      onChange={e => setDishForm({ ...dishForm, isAvailable: e.target.checked })}
                    />
                    <span>Available</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={dishForm.isFeatured}
                      onChange={e => setDishForm({ ...dishForm, isFeatured: e.target.checked })}
                    />
                    <span>Featured</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={dishForm.isBestSeller}
                      onChange={e => setDishForm({ ...dishForm, isBestSeller: e.target.checked })}
                    />
                    <span>Best Seller</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsAddDishModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0e382c] hover:bg-[#144738] text-white font-bold cursor-pointer"
                  >
                    Save Dish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
