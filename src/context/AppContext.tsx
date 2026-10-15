import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dish, CartItem, Order, User, Coupon, PortionOption, AddonOption, SeasonTag } from '../types';
import { INITIAL_DISHES } from '../data/menuData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // User & Auth
  user: User | null;
  login: (email: string, pass?: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  // Menu Dishes
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  refreshMenu: () => Promise<void>;
  toggleAvailability: (dishId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (dish: Dish, portion: PortionOption, addons: AddonOption[], instructions?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  cartTotal: number;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSpice: string;
  setSelectedSpice: (spice: string) => void;
  selectedDietary: string;
  setSelectedDietary: (diet: string) => void;
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Location
  currentCity: string;
  setCurrentCity: (city: string) => void;
  currentArea: string;
  setCurrentArea: (area: string) => void;

  // Active Season
  activeSeason: SeasonTag;
  setActiveSeason: (s: SeasonTag) => void;
  seasonBanner: { title: string; subtitle: string };

  // Modals & Navigation
  selectedDishModal: Dish | null;
  setSelectedDishModal: (dish: Dish | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Orders
  userOrders: Order[];
  refreshUserOrders: () => Promise<void>;
  placeOrder: (customerInfo: any, paymentMethod: any) => Promise<Order | null>;

  // Favorites
  favorites: string[];
  toggleFavorite: (dishId: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('desibite_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo customer user
    return {
      id: 'user-ayesha',
      name: 'Ayesha Karamat',
      email: 'ayesha@desibite.pk',
      phone: '+92 300 4567890',
      role: 'customer',
      addresses: [
        {
          id: 'addr-1',
          title: 'Home (DHA)',
          address: 'House 42-B, Sector Z, Phase 3',
          area: 'DHA Phase 3',
          city: 'Lahore',
          isDefault: true,
          instructions: 'Call at the gate upon arrival',
        },
      ],
      favorites: ['dish-sindhi-chicken-biryani', 'dish-sarson-saag', 'dish-lahori-chicken-karahi'],
    };
  });

  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('desibite_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpice, setSelectedSpice] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Location
  const [currentCity, setCurrentCity] = useState('Lahore');
  const [currentArea, setCurrentArea] = useState('Gulberg & DHA');

  // Season
  const [activeSeason, setActiveSeason] = useState<SeasonTag>('Winter');
  const [seasonBanner, setSeasonBanner] = useState({
    title: 'Winter Sardi Specials are Here! 🍲',
    subtitle: 'Warm your soul with piping hot Sarson Ka Saag, Nalli Nihari, Siri Paye & Kashmiri Pink Chai.',
  });

  // Modals
  const [selectedDishModal, setSelectedDishModal] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Orders
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('desibite_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('desibite_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('desibite_cart', JSON.stringify(cart));
  }, [cart]);

  // Load menu from backend
  const refreshMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.dishes && data.dishes.length > 0) {
          setDishes(data.dishes);
        }
      }
    } catch (err) {
      console.warn('Using local menu fallback:', err);
    }
  };

  // Fetch season info
  useEffect(() => {
    refreshMenu();
    fetch('/api/season')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.seasonSettings) {
          setActiveSeason(data.seasonSettings.activeSeason);
          setSeasonBanner({
            title: data.seasonSettings.bannerTitle,
            subtitle: data.seasonSettings.bannerSubtitle,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch user orders
  const refreshUserOrders = async () => {
    if (!user) return;
    try {
      const url = user.role === 'admin' ? '/api/orders?role=admin' : `/api/orders?email=${encodeURIComponent(user.email)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data.orders || []);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  };

  useEffect(() => {
    refreshUserOrders();
  }, [user]);

  // Cart operations
  const addToCart = (
    dish: Dish,
    portion: PortionOption,
    addons: AddonOption[],
    instructions: string = '',
    quantity: number = 1
  ) => {
    const unitPrice = dish.price + portion.priceDelta + addons.reduce((sum, a) => sum + a.price, 0);
    const totalPrice = unitPrice * quantity;
    const cartItemId = `${dish.id}-${portion.id}-${addons.map(a => a.id).sort().join('_')}`;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: updated[existingIdx].unitPrice * newQty,
          instructions: instructions || updated[existingIdx].instructions,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            dish,
            portion,
            selectedAddons: addons,
            instructions,
            quantity,
            unitPrice,
            totalPrice,
          },
        ];
      }
    });

    showToast(`Added ${dish.name} (${portion.name}) to cart!`, 'success');
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartDeliveryFee = cart.length === 0 ? 0 : cartSubtotal >= 2000 ? 0 : 120;

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    const calculated = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    cartDiscount = Math.round(Math.min(calculated, appliedCoupon.maxDiscount));
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        showToast(`Coupon ${data.coupon.code} applied! Saved Rs. ${data.discount}`, 'success');
        return { success: true, message: `Coupon applied: Rs. ${data.discount} off` };
      } else {
        showToast(data.error || 'Invalid coupon code', 'error');
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
    } catch (err: any) {
      showToast('Could not validate coupon', 'error');
      return { success: false, message: 'Server error' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Auth
  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        setIsAuthOpen(false);
        return true;
      }
      showToast(data.error || 'Login failed', 'error');
      return false;
    } catch (err) {
      showToast('Network error while logging in', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Toggle dish availability for admin
  const toggleAvailability = async (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;
    try {
      const res = await fetch(`/api/menu/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !dish.isAvailable }),
      });
      if (res.ok) {
        setDishes(prev => prev.map(d => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d)));
        showToast(`${dish.name} status updated`, 'info');
      }
    } catch (err) {
      showToast('Failed to update dish availability', 'error');
    }
  };

  // Place order
  const placeOrder = async (customerInfo: any, paymentMethod: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          paymentMethod,
          couponCode: appliedCoupon?.code,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        setIsCheckoutOpen(false);
        setActiveTrackingOrder(data.order);
        refreshUserOrders();
        showToast('🎉 Order confirmed! Kitchen has received your request.', 'success');
        return data.order;
      } else {
        showToast(data.error || 'Could not place order', 'error');
        return null;
      }
    } catch (err) {
      showToast('Server error while placing order', 'error');
      return null;
    }
  };

  // Favorites
  const favorites = user?.favorites || [];
  const toggleFavorite = async (dishId: string) => {
    if (!user) {
      setIsAuthOpen(true);
      showToast('Please log in to save favorites', 'info');
      return;
    }
    const isFav = favorites.includes(dishId);
    const newFavs = isFav ? favorites.filter(id => id !== dishId) : [...favorites, dishId];
    setUser({ ...user, favorites: newFavs });
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', 'success');

    try {
      await fetch(`/api/users/${user.id}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishId }),
      });
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        dishes,
        setDishes,
        refreshMenu,
        toggleAvailability,
        cart,
        addToCart,
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
        currentCity,
        setCurrentCity,
        currentArea,
        setCurrentArea,
        activeSeason,
        setActiveSeason,
        seasonBanner,
        selectedDishModal,
        setSelectedDishModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isAboutOpen,
        setIsAboutOpen,
        isContactOpen,
        setIsContactOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        userOrders,
        refreshUserOrders,
        placeOrder,
        favorites,
        toggleFavorite,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
