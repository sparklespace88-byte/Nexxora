import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Product, Coupon } from '../../types';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Mail,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import defaultProductImage from '../../assets/images/hero_nexora_electronics_1790441938567.jpg';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    currentUser,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    registeredUsers,
    toggleUserStatus,
    coupons,
    addCoupon,
    toggleCouponStatus,
    newsletterSubscribers,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'coupons' | 'newsletter'
  >('overview');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodBrand, setProdBrand] = useState('NEXORA');
  const [prodPrice, setProdPrice] = useState(99.99);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(139.99);
  const [prodStock, setProdStock] = useState(20);
  const [prodImage, setProdImage] = useState(defaultProductImage);
  const [prodDescription, setProdDescription] = useState('');

  // Category Add State
  const [newCatName, setNewCatName] = useState('');

  // Coupon Add State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(50);

  // Search filter inside admin
  const [adminSearch, setAdminSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  if (!isAdminOpen || currentUser?.role !== 'admin') return null;

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5).length;

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Electronics');
    setProdBrand('NEXORA');
    setProdPrice(99.99);
    setProdOriginalPrice(139.99);
    setProdStock(20);
    setProdImage(defaultProductImage);
    setProdDescription('High quality product built for premium durability.');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdBrand(p.brand);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice);
    setProdStock(p.stock);
    setProdImage(p.image);
    setProdDescription(p.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    const discountPercent = prodOriginalPrice > prodPrice
      ? Math.round(((prodOriginalPrice - prodPrice) / prodOriginalPrice) * 100)
      : 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountPercent,
        stock: Number(prodStock),
        image: prodImage,
        description: prodDescription
      });
    } else {
      addProduct({
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountPercent,
        stock: Number(prodStock),
        image: prodImage,
        gallery: [prodImage],
        description: prodDescription,
        rating: 5.0,
        reviewCount: 0,
        specifications: {
          'Origin': 'Official Manufacturer Authorized',
          'Condition': 'Brand New Boxed'
        },
        isFeatured: true,
        isNewArrival: true
      });
    }
    setIsProductModalOpen(false);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      minOrder: Number(newCouponMinOrder),
      description: `${newCouponDiscount}% off orders above $${newCouponMinOrder}`,
      expiresAt: '2026-12-31',
      isActive: true
    });
    setNewCouponCode('');
  };

  const exportNewsletterCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Email,SubscribedAt']
        .concat(
          newsletterSubscribers.map((s) => `${s.id},${s.email},${s.subscribedAt}`)
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'nexora_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported newsletter subscribers to CSV', 'success');
  };

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch =
      adminSearch === '' ||
      o.orderNumber.toLowerCase().includes(adminSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[95vh] flex flex-col">
        {/* Admin Navigation Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight font-display">
                  NEXORA Operations Console
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Admin Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Full-stack inventory, fulfillment tracking & customer controls
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex items-center gap-1 sm:gap-2 px-6 border-b border-slate-200 bg-slate-50 overflow-x-auto py-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'newsletter'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Subscribers ({newsletterSubscribers.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {/* TAB 1: OVERVIEW KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span className="font-semibold">Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Verified through paid orders
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span className="font-semibold">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {totalOrders}
                  </p>
                  <span className="text-[11px] text-blue-600 font-medium">
                    {pendingOrders} awaiting fulfillment
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span className="font-semibold">Active Customers</span>
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {registeredUsers.length}
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    In database
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span className="font-semibold">Inventory Alert</span>
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {lowStockProducts}
                  </p>
                  <span className="text-[11px] text-amber-600 font-medium">
                    Items with low stock (&le; 5)
                  </span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">
                            {ord.orderNumber}
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {ord.customerName}
                          </td>
                          <td className="p-3 font-bold tabular-nums">
                            ${ord.total.toFixed(2)}
                          </td>
                          <td className="p-3 text-slate-500">
                            {ord.paymentMethod}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              className="text-[11px] font-semibold bg-slate-100 border border-slate-300 rounded-lg px-2 py-1"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Search product inventory..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 truncate">{p.name}</p>
                              <span className="text-[10px] text-slate-400">{p.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-600">{p.category}</td>
                        <td className="p-3 font-bold tabular-nums">${p.price.toFixed(2)}</td>
                        <td className="p-3">
                          <span
                            className={`font-semibold tabular-nums ${
                              p.stock <= 5 ? 'text-amber-600 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3 tabular-nums font-medium text-slate-700">
                          {p.rating.toFixed(1)} ({p.reviewCount})
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filter by Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="All">All Statuses ({orders.length})</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="relative max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by order# or customer..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Customer Details</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total Paid</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3 text-slate-500 font-mono">{ord.date}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{ord.customerName}</p>
                          <span className="text-[10px] text-slate-400">{ord.customerEmail}</span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {ord.items.length} item(s)
                        </td>
                        <td className="p-3 font-extrabold tabular-nums">
                          ${ord.total.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddCategorySubmit}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-end gap-3"
              >
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Category Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Office & Furniture"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  Create Category
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{cat.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Slug: /{cat.slug} · {cat.itemCount} items
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS MANAGER */}
          {activeTab === 'customers' && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registeredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{user.name}</td>
                      <td className="p-3 text-slate-600 font-mono">{user.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{user.joinedDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: COUPONS MANAGER */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddCouponSubmit}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs"
              >
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH30"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 uppercase font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Create Coupon
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-blue-700 text-sm">
                        {coupon.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{coupon.description}</p>
                    <span className="text-[11px] text-slate-400">
                      Min Order: ${coupon.minOrder} · Expires: {coupon.expiresAt}
                    </span>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => toggleCouponStatus(coupon.code)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {coupon.isActive ? 'Deactivate' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: NEWSLETTER MANAGER */}
          {activeTab === 'newsletter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Newsletter Subscribers ({newsletterSubscribers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Subscribers registered via storefront newsletter box
                  </p>
                </div>
                <button
                  onClick={exportNewsletterCSV}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to CSV</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Subscriber ID</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Subscription Date</th>
                      <th className="p-3 text-right">Marketing Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {newsletterSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500">{sub.id}</td>
                        <td className="p-3 font-bold text-slate-800">{sub.email}</td>
                        <td className="p-3 text-slate-500 font-mono">{sub.subscribedAt}</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            Subscribed & Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Product Add/Edit Modal Subsheet */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {editingProductId ? 'Edit Product Details' : 'Add New Product to Catalog'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Category
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Original Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="border border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl"
                  >
                    {editingProductId ? 'Update Product' : 'Create Product'}
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
