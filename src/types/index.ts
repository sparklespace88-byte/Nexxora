export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  gallery: string[];
  description: string;
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  brand: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: 'COD' | 'Online Card';
  paymentStatus: 'Pending' | 'Paid';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  joinedDate: string;
  status: 'Active' | 'Inactive';
  addresses: Address[];
  avatar?: string;
  authProvider?: 'email' | 'google';
}

export interface Coupon {
  code: string;
  discountPercent: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  highlightText: string;
  buttonText: string;
  linkCategory: string;
  image: string;
  badgeText: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
