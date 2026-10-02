import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  User,
  Review,
  Coupon,
  Address,
  OrderStatus,
  NewsletterSubscriber
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS
} from '../data/mockData';
import { api } from '../lib/api';
import defaultBannerImage from '../assets/images/hero_nexora_electronics_1790441938567.jpg';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string, iconName?: string) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: 'COD' | 'Online Card';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // Authentication & Users
  currentUser: User | null;
  registeredUsers: User[];
  authLoading: boolean;
  login: (email: string, pass: string, remember?: boolean) => Promise<boolean>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  toggleUserStatus: (userId: string) => Promise<void>;

  // Reviews
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string) => void;
  getProductReviews: (productId: string) => Review[];

  // Newsletter
  newsletterSubscribers: NewsletterSubscriber[];
  subscribeNewsletter: (email: string) => { success: boolean; message: string };

  // UI state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  minPrice: number;
  maxPrice: number;
  setPriceFilter: (min: number, max: number) => void;

  // Drawers & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProductDetails: Product | null;
  setSelectedProductDetails: (prod: Product | null) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage persisted state with safe fallback
  const safeGetItem = <T,>(key: string, fallback: T): T => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return fallback;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const safeSetItem = (key: string, value: unknown) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage quota or iframe cookie restrictions handled gracefully
    }
  };

  const [products, setProducts] = useState<Product[]>(() =>
    safeGetItem('nexora_v4_products', INITIAL_PRODUCTS)
  );

  const [categories, setCategories] = useState<Category[]>(() =>
    safeGetItem('nexora_v4_categories', INITIAL_CATEGORIES)
  );

  const [cart, setCart] = useState<CartItem[]>(() =>
    safeGetItem('nexora_cart', [])
  );

  const [wishlist, setWishlist] = useState<Product[]>(() =>
    safeGetItem('nexora_wishlist', [])
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    safeGetItem('nexora_orders', INITIAL_ORDERS)
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    safeGetItem('nexora_reviews', INITIAL_REVIEWS)
  );

  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    safeGetItem('nexora_coupons', INITIAL_COUPONS)
  );

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Accounts live on the server. The admin list is fetched only for administrators.
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() =>
    safeGetItem('nexora_subscribers', [
      { id: 'sub-1', email: 'faizali@example.com', subscribedAt: '2026-09-20' },
      { id: 'sub-2', email: 'techbuyer@nexora.com', subscribedAt: '2026-09-24' }
    ])
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage safely
  useEffect(() => {
    safeSetItem('nexora_v4_products', products);
  }, [products]);

  useEffect(() => {
    safeSetItem('nexora_v4_categories', categories);
  }, [categories]);

  useEffect(() => {
    safeSetItem('nexora_cart', cart);
  }, [cart]);

  useEffect(() => {
    safeSetItem('nexora_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    safeSetItem('nexora_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetItem('nexora_reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    safeSetItem('nexora_coupons', coupons);
  }, [coupons]);



  useEffect(() => {
    safeSetItem('nexora_subscribers', newsletterSubscribers);
  }, [newsletterSubscribers]);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`Updated "${product.name}" quantity to ${newQty} in cart`, 'success');
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const initialQty = Math.min(quantity, product.stock);
        showToast(`Added "${product.name}" to your cart`, 'success');
        return [...prevCart, { product, quantity: initialQty }];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    discount = (subtotal * appliedCoupon.discountPercent) / 100;
  }

  // Free shipping over $50, else $9.99
  const shippingFee = subtotal === 0 || subtotal >= 50 ? 0 : 9.99;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.08).toFixed(2));
  const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to your wishlist`, 'success');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );

    if (!found) {
      showToast(`Coupon code "${code}" is invalid or expired`, 'error');
      return { success: false, message: 'Invalid coupon code' };
    }

    if (subtotal < found.minOrder) {
      showToast(`Order must be at least $${found.minOrder} to apply ${cleanCode}`, 'error');
      return { success: false, message: `Minimum order of $${found.minOrder} required` };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${cleanCode}" applied! ${found.discountPercent}% OFF`, 'success');
    return { success: true, message: 'Coupon applied successfully' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon "${newCoupon.code}" created successfully!`, 'success');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Orders
  const placeOrder = ({
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: 'COD' | 'Online Card';
  }): Order => {
    const orderNumber = `NEX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      price: item.product.price,
      quantity: item.quantity
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateStr,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: orderItems,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online Card' ? 'Paid' : 'Pending',
      status: 'Confirmed',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: `${dateStr} ${timeStr}`,
          note: 'Order submitted securely via NEXORA Storefront'
        },
        {
          status: 'Confirmed',
          timestamp: `${dateStr} ${timeStr}`,
          note: paymentMethod === 'Online Card' ? 'Payment authorized and order confirmed' : 'Cash on Delivery verified'
        }
      ]
    };

    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const bought = cart.find((item) => item.product.id === prod.id);
        if (bought) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - bought.quantity)
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    clearCart();

    showToast(`Order #${orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status,
              timestamp,
              note: note || `Order status updated to ${status}`
            }
          ];
          return {
            ...ord,
            status,
            statusHistory: updatedHistory,
            paymentStatus: status === 'Delivered' ? 'Paid' : ord.paymentStatus
          };
        }
        return ord;
      })
    );
    showToast(`Order updated to "${status}"`, 'success');
  };

  // Auth & User Management (server-backed)
  useEffect(() => {
    let cancelled = false;
    api<{ user: User | null }>('/api/auth/me')
      .then((r) => {
        if (!cancelled) setCurrentUser(r.user);
      })
      .catch(() => {
        if (!cancelled) setCurrentUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUsers = async () => {
    try {
      const r = await api<{ users: User[] }>('/api/admin/users');
      setRegisteredUsers(r.users);
    } catch {
      setRegisteredUsers([]);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      refreshUsers();
    } else {
      setRegisteredUsers([]);
      setIsAdminOpen(false);
    }
  }, [currentUser?.id, currentUser?.role]);

  const login = async (email: string, pass: string, remember = true): Promise<boolean> => {
    try {
      const r = await api<{ user: User }>('/api/auth/login', {
        body: { email, password: pass, remember }
      });
      setCurrentUser(r.user);
      showToast(`Welcome back, ${r.user.name}!`, 'success');
      return true;
    } catch (e) {
      showToast((e as Error).message, 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, pass: string): Promise<boolean> => {
    try {
      const r = await api<{ user: User }>('/api/auth/register', {
        body: { name, email, phone, password: pass }
      });
      setCurrentUser(r.user);
      showToast(`Account created! Welcome, ${r.user.name}!`, 'success');
      return true;
    } catch (e) {
      showToast((e as Error).message, 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST', body: {} });
    } catch {
      /* cookie will expire on its own */
    }
    setCurrentUser(null);
    setIsAdminOpen(false);
    showToast('You have signed out', 'info');
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    try {
      const r = await api<{ user: User }>('/api/auth/profile', { method: 'PATCH', body: data });
      setCurrentUser(r.user);
      showToast('Profile updated successfully', 'success');
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = { ...address, id: `addr-${Date.now()}` };
    updateUserProfile({ addresses: [...currentUser.addresses, newAddr] });
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    updateUserProfile({ addresses: currentUser.addresses.filter((a) => a.id !== id) });
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      await api(`/api/admin/users/${encodeURIComponent(userId)}/status`, { method: 'PATCH', body: {} });
      await refreshUsers();
      showToast('Customer account status updated', 'info');
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  // Product Admin
  const addProduct = (productData: Omit<Product, 'id' | 'slug'>) => {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${productData.name}" added successfully`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from inventory', 'info');
  };

  const addCategory = (name: string, iconName = 'Package') => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      itemCount: 0,
      image: defaultBannerImage,
      iconName
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${name}" created`, 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', 'info');
  };

  // Reviews
  const addReview = (productId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: currentUser ? currentUser.name : 'Verified Customer',
      userEmail: currentUser ? currentUser.email : 'guest@example.com',
      rating,
      date: new Date().toISOString().split('T')[0],
      comment,
      verifiedPurchase: true
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === productId), newRev];
    const avgRating = Number(
      (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, rating: avgRating, reviewCount: prodReviews.length }
          : p
      )
    );

    showToast('Thank you! Your review has been submitted.', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Newsletter
  const subscribeNewsletter = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (newsletterSubscribers.some((s) => s.email === clean)) {
      return { success: false, message: 'This email is already subscribed to our newsletter.' };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: clean,
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    setNewsletterSubscribers((prev) => [newSub, ...prev]);
    showToast('Subscribed! Check your inbox for your 10% coupon code.', 'success');
    return { success: true, message: 'Thank you for subscribing!' };
  };

  const setPriceFilter = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveToCart,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponStatus,
        orders,
        placeOrder,
        updateOrderStatus,
        currentUser,
        registeredUsers,
        login,
        register,
        authLoading,
        logout,
        updateUserProfile,
        addAddress,
        deleteAddress,
        toggleUserStatus,
        reviews,
        addReview,
        getProductReviews,
        newsletterSubscribers,
        subscribeNewsletter,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        minPrice,
        maxPrice,
        setPriceFilter,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isAccountOpen,
        setIsAccountOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedProductDetails,
        setSelectedProductDetails,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
