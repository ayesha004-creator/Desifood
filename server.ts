import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_DISHES } from './src/data/menuData.ts';
import { RESTAURANTS, INITIAL_COUPONS } from './src/data/restaurants.ts';
import { Dish, Order, User, Coupon, OrderStatus, SeasonTag } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

app.use(express.json());

// In-memory Database
let dishesDatabase: Dish[] = [...INITIAL_DISHES];
let restaurantsDatabase = [...RESTAURANTS];
let couponsDatabase: Coupon[] = [...INITIAL_COUPONS];

interface SeasonSettings {
  activeSeason: SeasonTag;
  autoDetect: boolean;
  bannerTitle: string;
  bannerSubtitle: string;
}

// Compute active season based on month if autoDetect is enabled
// Current month in Pakistan: October -> Winter/Fall kickoff
function getAutoSeason(): SeasonTag {
  const month = new Date().getMonth(); // 0-indexed (9 = Oct, 10 = Nov, 11 = Dec, 0 = Jan, 1 = Feb)
  if (month >= 9 || month <= 1) return 'Winter';
  if (month >= 4 && month <= 7) return 'Summer';
  return 'Winter';
}

let seasonSettings: SeasonSettings = {
  activeSeason: 'Winter',
  autoDetect: true,
  bannerTitle: 'Winter Sardi Specials are Here! 🍲',
  bannerSubtitle: 'Warm your soul with piping hot Sarson Ka Saag, Nalli Nihari, Siri Paye & Kashmiri Pink Chai.',
};

// Seed sample orders for realistic dashboard
let ordersDatabase: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'DB-89214',
    customer: {
      name: 'Ayesha Karamat',
      email: 'ayesha@desibite.pk',
      phone: '+92 300 4567890',
      address: 'House 42-B, Sector Z, Phase 3, DHA',
      city: 'Lahore',
      area: 'DHA Phase 3',
      instructions: 'Please call at the gate, do not ring bell.',
    },
    items: [
      {
        id: 'c-1',
        dish: dishesDatabase.find(d => d.id === 'dish-sindhi-chicken-biryani') || dishesDatabase[0],
        portion: { id: 'double', name: 'Double Plate (2 Chicken Pieces + 2 Aloo)', priceDelta: 260 },
        selectedAddons: [{ id: 'zeera-raita', name: 'Cool Zeera Raita', price: 60 }],
        instructions: 'Extra spicy please with lemon slices',
        quantity: 2,
        unitPrice: 860,
        totalPrice: 1720,
      },
      {
        id: 'c-2',
        dish: dishesDatabase.find(d => d.id === 'dish-kashmiri-chai') || dishesDatabase[dishesDatabase.length - 1],
        portion: { id: 'cup', name: '1 Hot Clay Cup', priceDelta: 0 },
        selectedAddons: [{ id: 'extra-nuts', name: 'Extra Crushed Pistachios & Almonds', price: 60 }],
        quantity: 2,
        unitPrice: 300,
        totalPrice: 600,
      },
    ],
    subtotal: 2320,
    deliveryFee: 120,
    discount: 244,
    couponCode: 'DESI10',
    total: 2196,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'Out for Delivery',
    estimatedMinutes: 12,
    riderInfo: {
      name: 'Muhammad Tariq',
      phone: '+92 321 9876543',
      bikeNumber: 'LEA-4892 (Honda 125)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: 'Order placed by customer' },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(), note: 'Kitchen accepted order' },
      { status: 'Preparing', timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(), note: 'Food is simmering on tawa & handi' },
      { status: 'Ready for Pickup', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), note: 'Packed with thermal insulation' },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), note: 'Rider Tariq is heading your way' },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'DB-89210',
    customer: {
      name: 'Bilal Ahmed',
      email: 'bilal.ahmed@gmail.com',
      phone: '+92 333 1234567',
      address: 'Flat 401, Al-Rehman Tower, Gulberg III',
      city: 'Lahore',
      area: 'Gulberg',
    },
    items: [
      {
        id: 'c-3',
        dish: dishesDatabase.find(d => d.id === 'dish-lahori-chicken-karahi') || dishesDatabase[2],
        portion: { id: 'half', name: 'Half KG (Serves 2)', priceDelta: 0 },
        selectedAddons: [{ id: 'garlic-naan', name: '2 Butter Garlic Naan', price: 210 }],
        quantity: 1,
        unitPrice: 1160,
        totalPrice: 1160,
      },
    ],
    subtotal: 1160,
    deliveryFee: 120,
    discount: 0,
    total: 1280,
    paymentMethod: 'easypaisa',
    paymentStatus: 'completed',
    status: 'Delivered',
    estimatedMinutes: 0,
    riderInfo: {
      name: 'Hamza Khan',
      phone: '+92 312 4455667',
      bikeNumber: 'LHR-7721',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString() },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 115 * 60 * 1000).toISOString() },
      { status: 'Preparing', timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString() },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString() },
      { status: 'Delivered', timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(), note: 'Delivered to customer' },
    ],
  },
  {
    id: 'ord-103',
    orderNumber: 'DB-89222',
    customer: {
      name: 'Zainab Farooq',
      email: 'zainab@example.com',
      phone: '+92 345 9988776',
      address: 'House 112, Street 8, F-8/2',
      city: 'Islamabad',
      area: 'F-8',
    },
    items: [
      {
        id: 'c-4',
        dish: dishesDatabase.find(d => d.id === 'dish-sarson-saag') || dishesDatabase[0],
        portion: { id: 'single', name: 'Saag Bowl + 2 Makki Rotis + Desi Makhan & Gur', priceDelta: 0 },
        selectedAddons: [{ id: 'desi-makhan', name: 'Extra Pure Desi Makhan Dollop', price: 70 }],
        quantity: 2,
        unitPrice: 710,
        totalPrice: 1420,
      },
    ],
    subtotal: 1420,
    deliveryFee: 150,
    discount: 142,
    couponCode: 'DESI10',
    total: 1428,
    paymentMethod: 'jazzcash',
    paymentStatus: 'completed',
    status: 'Preparing',
    estimatedMinutes: 22,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
      { status: 'Preparing', timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(), note: 'Making fresh makki rotis on clay tawa' },
    ],
  },
];

// Seed users
let usersDatabase: User[] = [
  {
    id: 'user-admin',
    name: 'Admin DesiBite',
    email: 'admin@desibite.pk',
    phone: '+92 300 0000000',
    role: 'admin',
    addresses: [],
    favorites: ['dish-lahori-chicken-karahi', 'dish-sindhi-chicken-biryani'],
  },
  {
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
        instructions: 'Please call at the gate',
      },
      {
        id: 'addr-2',
        title: 'Office (Gulberg)',
        address: '4th Floor, Pace Tower, Gulberg II',
        area: 'Gulberg II',
        city: 'Lahore',
        isDefault: false,
        instructions: 'Leave at reception desk',
      },
    ],
    favorites: ['dish-sindhi-chicken-biryani', 'dish-sarson-saag', 'dish-garam-gulab-jamun', 'dish-kashmiri-chai'],
  },
];

// ==========================================
// API ROUTES
// ==========================================

// 1. Menu API
app.get('/api/menu', (req: Request, res: Response) => {
  const { category, search, spice, dietary, season, sort } = req.query;

  let filtered = [...dishesDatabase];

  if (category && category !== 'all') {
    filtered = filtered.filter(d => d.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    filtered = filtered.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        (d.urduName && d.urduName.includes(q)) ||
        d.description.toLowerCase().includes(q) ||
        d.cuisine.toLowerCase().includes(q) ||
        d.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  }

  if (spice && spice !== 'all') {
    filtered = filtered.filter(d => d.spiceLevel.toLowerCase() === (spice as string).toLowerCase());
  }

  if (dietary && dietary !== 'all') {
    filtered = filtered.filter(d => d.dietary.toLowerCase() === (dietary as string).toLowerCase());
  }

  if (season && season !== 'all') {
    filtered = filtered.filter(d => d.seasonalTag && d.seasonalTag.toLowerCase() === (season as string).toLowerCase());
  }

  if (sort) {
    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }

  res.json({
    success: true,
    count: filtered.length,
    dishes: filtered,
  });
});

app.get('/api/menu/:id', (req: Request, res: Response) => {
  const dish = dishesDatabase.find(d => d.id === req.params.id);
  if (!dish) {
    res.status(404).json({ success: false, error: 'Dish not found' });
    return;
  }
  res.json({ success: true, dish });
});

// Admin: Add dish
app.post('/api/menu', (req: Request, res: Response) => {
  const newDish: Dish = {
    ...req.body,
    id: req.body.id || `dish-${Date.now()}`,
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 1,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
  };

  dishesDatabase.unshift(newDish);
  res.status(201).json({ success: true, dish: newDish });
});

// Admin: Update dish
app.put('/api/menu/:id', (req: Request, res: Response) => {
  const index = dishesDatabase.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Dish not found' });
    return;
  }

  dishesDatabase[index] = { ...dishesDatabase[index], ...req.body };
  res.json({ success: true, dish: dishesDatabase[index] });
});

// Admin: Delete dish
app.delete('/api/menu/:id', (req: Request, res: Response) => {
  const index = dishesDatabase.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Dish not found' });
    return;
  }
  const removed = dishesDatabase.splice(index, 1)[0];
  res.json({ success: true, dish: removed });
});

// 2. Restaurants
app.get('/api/restaurants', (_req: Request, res: Response) => {
  res.json({ success: true, restaurants: restaurantsDatabase });
});

// 3. Season settings
app.get('/api/season', (_req: Request, res: Response) => {
  const effectiveSeason = seasonSettings.autoDetect ? getAutoSeason() : seasonSettings.activeSeason;
  res.json({
    success: true,
    seasonSettings: {
      ...seasonSettings,
      activeSeason: effectiveSeason,
    },
  });
});

app.post('/api/season', (req: Request, res: Response) => {
  const { activeSeason, autoDetect, bannerTitle, bannerSubtitle } = req.body;
  seasonSettings = {
    activeSeason: activeSeason || seasonSettings.activeSeason,
    autoDetect: autoDetect !== undefined ? autoDetect : seasonSettings.autoDetect,
    bannerTitle: bannerTitle || seasonSettings.bannerTitle,
    bannerSubtitle: bannerSubtitle || seasonSettings.bannerSubtitle,
  };
  res.json({ success: true, seasonSettings });
});

// 4. Coupons Validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ success: false, error: 'Coupon code required' });
    return;
  }

  const coupon = couponsDatabase.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  if (!coupon) {
    res.status(404).json({ success: false, error: 'Invalid coupon code' });
    return;
  }

  if (subtotal < coupon.minOrder) {
    res.status(400).json({
      success: false,
      error: `Minimum order amount of Rs. ${coupon.minOrder} required for coupon ${coupon.code}`,
    });
    return;
  }

  const rawDiscount = (subtotal * coupon.discountPercent) / 100;
  const discount = Math.min(rawDiscount, coupon.maxDiscount);

  res.json({
    success: true,
    coupon,
    discount: Math.round(discount),
  });
});

// 5. Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  const { email, role, status } = req.query;

  let result = [...ordersDatabase];

  if (role !== 'admin' && email) {
    result = result.filter(o => o.customer.email.toLowerCase() === (email as string).toLowerCase());
  }

  if (status && status !== 'all') {
    result = result.filter(o => o.status.toLowerCase() === (status as string).toLowerCase());
  }

  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, count: result.length, orders: result });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = ordersDatabase.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }
  res.json({ success: true, order });
});

// Create order with strict SERVER-SIDE PRICE RECALCULATION
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items, paymentMethod, couponCode } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    res.status(400).json({ success: false, error: 'Incomplete delivery customer information' });
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, error: 'Cart cannot be empty' });
    return;
  }

  // Recalculate everything against actual server database
  let calculatedSubtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const dish = dishesDatabase.find(d => d.id === item.dish?.id || d.id === item.dishId);
    if (!dish) {
      res.status(400).json({ success: false, error: `Dish ${item.dish?.name || 'unknown'} is no longer available.` });
      return;
    }

    if (!dish.isAvailable) {
      res.status(400).json({ success: false, error: `${dish.name} is currently sold out.` });
      return;
    }

    // Determine portion delta
    const portionDelta = item.portion?.priceDelta || 0;

    // Determine addons sum
    let addonsSum = 0;
    const verifiedAddons = [];
    if (item.selectedAddons && Array.isArray(item.selectedAddons)) {
      for (const addon of item.selectedAddons) {
        const found = dish.availableAddons.find(a => a.id === addon.id);
        if (found) {
          addonsSum += found.price;
          verifiedAddons.push(found);
        }
      }
    }

    const unitPrice = dish.price + portionDelta + addonsSum;
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const lineTotal = unitPrice * quantity;

    calculatedSubtotal += lineTotal;

    verifiedItems.push({
      id: item.id || `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dish,
      portion: item.portion || { id: 'std', name: 'Standard', priceDelta: 0 },
      selectedAddons: verifiedAddons,
      instructions: item.instructions || '',
      quantity,
      unitPrice,
      totalPrice: lineTotal,
    });
  }

  // Delivery fee calculation
  const deliveryFee = calculatedSubtotal >= 2000 ? 0 : 120;

  // Coupon discount calculation
  let discount = 0;
  let appliedCouponCode: string | undefined = undefined;

  if (couponCode) {
    const coupon = couponsDatabase.find(c => c.code.toUpperCase() === couponCode.toUpperCase().trim());
    if (coupon && calculatedSubtotal >= coupon.minOrder) {
      discount = Math.min((calculatedSubtotal * coupon.discountPercent) / 100, coupon.maxDiscount);
      discount = Math.round(discount);
      appliedCouponCode = coupon.code;
    }
  }

  const finalTotal = Math.max(0, calculatedSubtotal + deliveryFee - discount);
  const orderNumber = `DB-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customer,
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    deliveryFee,
    discount,
    couponCode: appliedCouponCode,
    total: finalTotal,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
    status: 'Pending',
    estimatedMinutes: 30 + Math.floor(Math.random() * 15),
    riderInfo: {
      name: 'Muhammad Tariq',
      phone: '+92 321 9876543',
      bikeNumber: 'LEA-4892 (Honda 125)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Order submitted to DesiBite kitchen',
      },
    ],
  };

  ordersDatabase.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: newOrder,
  });
});

// Update Order Status (Admin or lifecycle simulation)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = ordersDatabase.find(o => o.id === req.params.id || o.orderNumber === req.params.id);

  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }

  const validStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid order status' });
    return;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`,
  });

  if (status === 'Delivered') {
    order.paymentStatus = 'completed';
    order.estimatedMinutes = 0;
  }

  res.json({ success: true, order });
});

// 6. User & Auth API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({ success: false, error: 'Email required' });
    return;
  }

  const normalized = email.toLowerCase().trim();

  // Admin shortcut check
  if (normalized === 'admin@desibite.pk' && password === 'admin123') {
    const adminUser = usersDatabase.find(u => u.email === 'admin@desibite.pk')!;
    res.json({ success: true, user: adminUser, token: 'demo-admin-token' });
    return;
  }

  // Customer check
  let user = usersDatabase.find(u => u.email.toLowerCase() === normalized);
  if (!user) {
    // Auto-create customer user for demo convenience
    user = {
      id: `user-${Date.now()}`,
      name: normalized.split('@')[0].replace('.', ' ').toUpperCase(),
      email: normalized,
      phone: '+92 300 1234567',
      role: 'customer',
      addresses: [],
      favorites: [],
    };
    usersDatabase.push(user);
  }

  res.json({ success: true, user, token: `demo-token-${user.id}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    res.status(400).json({ success: false, error: 'Name and email are required' });
    return;
  }

  const normalized = email.toLowerCase().trim();
  let existing = usersDatabase.find(u => u.email.toLowerCase() === normalized);
  if (existing) {
    res.status(400).json({ success: false, error: 'Email is already registered. Please log in.' });
    return;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: normalized,
    phone: phone || '+92 300 0000000',
    role: 'customer',
    addresses: [],
    favorites: [],
  };

  usersDatabase.push(newUser);
  res.status(201).json({ success: true, user: newUser, token: `demo-token-${newUser.id}` });
});

// User Favorites & Addresses
app.post('/api/users/:id/favorites', (req: Request, res: Response) => {
  const { dishId } = req.body;
  const user = usersDatabase.find(u => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  if (user.favorites.includes(dishId)) {
    user.favorites = user.favorites.filter(id => id !== dishId);
  } else {
    user.favorites.push(dishId);
  }

  res.json({ success: true, favorites: user.favorites });
});

app.post('/api/users/:id/addresses', (req: Request, res: Response) => {
  const user = usersDatabase.find(u => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  const newAddress = {
    ...req.body,
    id: `addr-${Date.now()}`,
    isDefault: user.addresses.length === 0 || req.body.isDefault,
  };

  if (newAddress.isDefault) {
    user.addresses.forEach(a => (a.isDefault = false));
  }

  user.addresses.push(newAddress);
  res.status(201).json({ success: true, addresses: user.addresses });
});

// 7. GEMINI AI FOOD ASSISTANT
// Follows @google/genai guidelines with gemini-3.8-flash on server side
let genAIClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAIClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  const { prompt, preference } = req.body;

  if (!prompt) {
    res.status(400).json({ success: false, error: 'Prompt is required' });
    return;
  }

  // Compact dish summary for context
  const menuSummary = dishesDatabase.map(d => ({
    id: d.id,
    name: d.name,
    urduName: d.urduName,
    price: d.price,
    category: d.category,
    cuisine: d.cuisine,
    spiceLevel: d.spiceLevel,
    dietary: d.dietary,
    seasonalTag: d.seasonalTag,
    rating: d.rating,
  }));

  if (genAIClient) {
    try {
      const systemInstruction = `You are "Ustaad DesiBite" (استاد دیسی بائٹ), an enthusiastic, warm, expert Pakistani Master Chef and meal advisor for DesiBite.
You recommend the most authentic, flavorful Pakistani food combinations tailored to the customer's budget, occasion, spice preference, and mood.
Always recommend actual dishes from the available DesiBite menu provided in JSON.
Format your answer with:
1. Warm greeting in Desi style (e.g. "Khush Amdeed! Assalam-o-Alaikum!").
2. 2-3 specific dish suggestions with reasons why they pair wonderfully (mention exact price in Rs.).
3. Mention the exact dish IDs in brackets like [dish-id: dish-sindhi-chicken-biryani] so the customer can 1-click add them.
4. Keep the response appetizing, concise, culturally authentic (mentioning desi ghee, slow-simmered shorba, piping hot naan, etc.).`;

      const contents = `Customer Query: "${prompt}".
Customer preference filters: ${JSON.stringify(preference || {})}.
Current DesiBite Menu available dishes:
${JSON.stringify(menuSummary.slice(0, 35))}
Please provide your culinary recommendation:`;

      const aiResponse = await genAIClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const recommendationText = aiResponse.text || '';

      // Match dish IDs mentioned in response
      const matchedDishIds = dishesDatabase
        .filter(d => recommendationText.toLowerCase().includes(d.name.toLowerCase()) || recommendationText.includes(d.id))
        .map(d => d.id)
        .slice(0, 4);

      res.json({
        success: true,
        recommendation: recommendationText,
        suggestedDishes: dishesDatabase.filter(d => matchedDishIds.includes(d.id)),
      });
      return;
    } catch (err: any) {
      console.warn('Gemini API call failed or quota reached, falling back to smart recommender:', err.message);
    }
  }

  // Fallback intelligent culinary advisor
  const q = prompt.toLowerCase();
  let selected = dishesDatabase.filter(d => d.isAvailable);

  if (q.includes('spicy') || q.includes('karahi')) {
    selected = selected.filter(d => d.spiceLevel === 'Spicy' || d.spiceLevel === 'Extra Spicy');
  } else if (q.includes('mild') || q.includes('kids') || q.includes('light')) {
    selected = selected.filter(d => d.spiceLevel === 'Mild');
  } else if (q.includes('veg') || q.includes('saag') || q.includes('daal')) {
    selected = selected.filter(d => d.dietary === 'Vegetarian');
  } else if (q.includes('winter') || q.includes('sardi')) {
    selected = selected.filter(d => d.seasonalTag === 'Winter' || d.category === 'curries-salan');
  } else if (q.includes('biryani') || q.includes('rice')) {
    selected = selected.filter(d => d.category === 'biryani-rice');
  }

  if (selected.length === 0) {
    selected = dishesDatabase.filter(d => d.isFeatured || d.isBestSeller);
  }

  const topPicks = selected.slice(0, 3);
  const dishList = topPicks.map(d => `• **${d.name}** (Rs. ${d.price}) - ${d.description} [dish-id: ${d.id}]`).join('\n');

  const fallbackText = `Assalam-o-Alaikum! Here is what our Master Chef recommends for you from today's fresh dastaarkhwan:\n\n${dishList}\n\nPair these with piping hot Sesame Roghni Naan and a glass of chilled Doodh Patti Chai or Lassi for the complete royal Desi feast!`;

  res.json({
    success: true,
    recommendation: fallbackText,
    suggestedDishes: topPicks,
  });
});

// 8. Admin Analytics
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalRevenue = ordersDatabase
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = ordersDatabase.filter(o => ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'].includes(o.status)).length;
  const completedOrders = ordersDatabase.filter(o => o.status === 'Delivered').length;

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders: ordersDatabase.length,
      pendingOrders,
      completedOrders,
      totalCustomers: usersDatabase.length,
      totalDishes: dishesDatabase.length,
      avgOrderValue: ordersDatabase.length > 0 ? Math.round(totalRevenue / ordersDatabase.length) : 0,
      activeSeason: seasonSettings.activeSeason,
    },
  });
});

// ==========================================
// STATIC ASSETS & VITE MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DesiBite server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
