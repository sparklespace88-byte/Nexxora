import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  LogOut,
  ShoppingBag,
  Printer,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const UserDashboardModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    currentUser,
    updateUserProfile,
    orders,
    wishlist,
    removeFromWishlist,
    moveToCart,
    logout,
    addAddress,
    deleteAddress
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');

  // Add Address State
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  if (!isAccountOpen || !currentUser) return null;

  // Filter user orders
  const userOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      currentUser.role === 'admin'
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: editName, phone: editPhone });
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) return;
    addAddress({
      fullName: currentUser.name,
      phone: currentUser.phone,
      street: newStreet,
      city: newCity,
      state: newState || 'TX',
      postalCode: newPostal,
      isDefault: false
    });
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPostal('');
    setIsAddingAddress(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const statusSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                {currentUser.name}
              </h2>
              <span className="text-xs text-slate-500">{currentUser.email}</span>
            </div>
          </div>

          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-4 px-6 border-b border-slate-200 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'wishlist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'addresses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {/* TAB 1: ORDER HISTORY & LIVE STATUS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {userOrders.length > 0 ? (
                userOrders.map((order) => {
                  const currentStepIndex = statusSteps.indexOf(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                    >
                      {/* Top Bar of Order */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-blue-700 text-sm">
                            {order.orderNumber}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{order.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors font-medium"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <img
                              src={item.productImage}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0 flex-1 text-xs">
                              <p className="font-semibold text-slate-800 truncate">
                                {item.productName}
                              </p>
                              <div className="flex items-center justify-between text-slate-500 mt-0.5">
                                <span>Qty: {item.quantity}</span>
                                <span className="font-bold text-slate-900 tabular-nums">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Timeline Visualizer */}
                      {order.status !== 'Cancelled' && (
                        <div className="pt-2">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Live Fulfillment Tracker
                          </p>
                          <div className="relative flex items-center justify-between">
                            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
                            {statusSteps.map((step, sIdx) => {
                              const isCompleted = sIdx <= currentStepIndex;
                              const isCurrent = sIdx === currentStepIndex;
                              return (
                                <div key={step} className="relative z-10 flex flex-col items-center">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                      isCompleted
                                        ? 'bg-blue-600 text-white shadow-xs ring-4 ring-blue-50'
                                        : 'bg-white border-2 border-slate-300 text-slate-400'
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : sIdx + 1}
                                  </div>
                                  <span
                                    className={`text-[10px] mt-1 font-medium ${
                                      isCurrent
                                        ? 'text-blue-700 font-bold'
                                        : isCompleted
                                        ? 'text-slate-800'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Order Status History Log */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 text-slate-600 border border-slate-100">
                          <span className="font-bold text-slate-700 text-[11px] block">
                            Latest Log Update:
                          </span>
                          <p className="text-[11px]">
                            {order.statusHistory[order.statusHistory.length - 1].timestamp} —{' '}
                            {order.statusHistory[order.statusHistory.length - 1].note}
                          </p>
                        </div>
                      )}

                      {/* Order Footer Totals */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="text-slate-500">
                          Payment: {order.paymentMethod} ({order.paymentStatus})
                        </span>
                        <div className="flex items-baseline gap-1 text-sm font-extrabold text-slate-900">
                          <span>Total:</span>
                          <span className="text-blue-600 tabular-nums">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">No orders yet</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    When you place an order, its real-time tracking will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                          {item.name}
                        </h4>
                        <p className="text-sm font-extrabold text-slate-900 mt-1 tabular-nums">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => moveToCart(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-50 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">Your wishlist is empty</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Click the heart icon on any product card to save items for later.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Manage Delivery Addresses
                </h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddNewAddress}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs"
                >
                  <h4 className="font-bold text-slate-800">New Address Details</h4>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 742 Evergreen Terrace"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        placeholder="Zip"
                        value={newPostal}
                        onChange={(e) => setNewPostal(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between text-xs space-y-2 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-1">{addr.street}</p>
                      <p className="text-slate-600">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-slate-400 mt-1 font-mono">{addr.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-rose-600 hover:underline text-[11px] font-medium"
                      >
                        Delete Address
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto space-y-6">
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.joinedDate}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Authentication Method
                  </label>
                  {currentUser.authProvider === 'google' ? (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.35 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block">
                          Verified Google Account
                        </span>
                        <span className="text-[11px] text-emerald-700 block font-mono">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
                      Standard Email & Password Protection
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  Save Profile Changes
                </button>
              </form>

              <div className="pt-6 border-t border-slate-200 flex justify-center">
                <button
                  onClick={() => {
                    logout();
                    setIsAccountOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of NEXORA</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Modal Preview */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    NEXORA Commercial Invoice
                  </h3>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Invoice #{selectedOrderForInvoice.orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-slate-600">
                <div>
                  <strong className="text-slate-800 block">Billed To:</strong>
                  <span>{selectedOrderForInvoice.customerName}</span>
                  <br />
                  <span>{selectedOrderForInvoice.customerEmail}</span>
                  <br />
                  <span>{selectedOrderForInvoice.customerPhone}</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">Shipping Destination:</strong>
                  <span>{selectedOrderForInvoice.shippingAddress.street}</span>
                  <br />
                  <span>
                    {selectedOrderForInvoice.shippingAddress.city},{' '}
                    {selectedOrderForInvoice.shippingAddress.state}{' '}
                    {selectedOrderForInvoice.shippingAddress.postalCode}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderForInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-slate-800">{item.productName}</td>
                        <td className="p-2.5 text-center">{item.quantity}</td>
                        <td className="p-2.5 text-right tabular-nums">${item.price.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-bold tabular-nums">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-right text-slate-600">
                <p>Subtotal: ${selectedOrderForInvoice.subtotal.toFixed(2)}</p>
                {selectedOrderForInvoice.discount > 0 && (
                  <p className="text-emerald-600">Discount: -${selectedOrderForInvoice.discount.toFixed(2)}</p>
                )}
                <p>Shipping: {selectedOrderForInvoice.shippingFee === 0 ? 'FREE' : `$${selectedOrderForInvoice.shippingFee.toFixed(2)}`}</p>
                <p>Tax (8%): ${selectedOrderForInvoice.tax.toFixed(2)}</p>
                <p className="text-base font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  Total Paid: ${selectedOrderForInvoice.total.toFixed(2)}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
