export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';
export type DietaryType = 'Halal' | 'Vegetarian' | 'Non-Veg' | 'Gluten-Free';
export type SeasonTag = 'Winter' | 'Summer' | 'Ramadan' | 'Eid' | null;

export interface PortionOption {
  id: string;
  name: string; // e.g. "Single (1 Person)", "Half Handi (2 Persons)", "Full Handi (4 Persons)"
  priceDelta: number; // additional or base adjustment
}

export interface AddonOption {
  id: string;
  name: string; // e.g. "Zeera Raita", "Fresh Kachumber Salad", "Garlic Naan"
  price: number; // in PKR
}

export interface Dish {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  ingredients: string[];
  price: number; // Base price in PKR
  category: string;
  cuisine: 'Lahori' | 'Karachi' | 'Peshawari' | 'Mughlai' | 'Sindhi' | 'Balochi' | 'Kashmiri' | 'Pan-Asian' | 'Street Food';
  spiceLevel: SpiceLevel;
  dietary: DietaryType;
  portionOptions: PortionOption[];
  availableAddons: AddonOption[];
  prepTime: string; // e.g. "20-25 mins"
  rating: number; // e.g. 4.8
  reviewCount: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  seasonalTag?: SeasonTag;
  image: string;
  calories?: number;
}

export interface Category {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface CartItem {
  id: string; // unique cart entry ID
  dish: Dish;
  portion: PortionOption;
  selectedAddons: AddonOption[];
  instructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'card';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface RiderInfo {
  name: string;
  phone: string;
  bikeNumber: string;
  avatar: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "DB-84920"
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  estimatedMinutes: number;
  riderInfo?: RiderInfo;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
}

export interface Address {
  id: string;
  title: string; // e.g. "Home", "Office", "Hostel"
  address: string;
  area: string;
  city: string;
  isDefault: boolean;
  instructions?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  favorites: string[]; // dish IDs
}

export interface Coupon {
  code: string;
  discountPercent: number; // e.g. 15
  maxDiscount: number; // in PKR
  minOrder: number; // in PKR
  description: string;
  expiryDate?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  urduName?: string;
  logo: string;
  coverImage: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  serviceAreas: string[];
  openingTime: string;
  closingTime: string;
  minimumOrder: number;
  deliveryFee: number;
  avgPrepTime: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
}
