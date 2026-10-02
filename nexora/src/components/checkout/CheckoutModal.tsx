import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address, Order } from '../../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    currentUser,
    placeOrder,
    setIsAccountOpen
  } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.addresses[0]?.street || '');
  const [city, setCity] = useState(currentUser?.addresses[0]?.city || '');
  const [state, setState] = useState(currentUser?.addresses[0]?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.addresses[0]?.postalCode || '');

  // Prefill from the account once the signed-in user is known
  useEffect(() => {
    if (!currentUser) return;
    setFullName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setPhone(currentUser.phone || '');
    const addr = currentUser.addresses[0];
    setStreet(addr?.street || '');
    setCity(addr?.city || '');
    setState(addr?.state || '');
    setPostalCode(addr?.postalCode || '');
  }, [currentUser?.id]);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online Card'>('Online Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !street || !city || !postalCode) {
      alert('Please fill in all shipping details.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        street,
        city,
        state,
        postalCode
      };

      const newOrder = placeOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress,
        paymentMethod
      });

      setCompletedOrder(newOrder);
      setIsProcessing(false);
    }, 900);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              {completedOrder ? 'Order Confirmation' : 'Secure Express Checkout'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {completedOrder ? (
            /* Order Success Receipt View */
            <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                  Payment & Order Verified
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  We have received your order and dispatched confirmation to{' '}
                  <strong className="text-slate-900">{completedOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Order Metadata Box */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order Number:</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {completedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Date:</span>
                  <span className="font-medium text-slate-800">{completedOrder.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-semibold text-slate-800">
                    {completedOrder.paymentMethod} ({completedOrder.paymentStatus})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} {completedOrder.shippingAddress.postalCode}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Grand Total Paid:</span>
                  <span className="text-blue-600 tabular-nums">
                    ${completedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={() => {
                    handleClose();
                    setIsAccountOpen(true);
                  }}
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Track in Customer Dashboard</span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-3 px-6 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Left Column: Customer & Shipping Details (3 cols) */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Shipping & Delivery Details</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Full Recipient Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          State / Region *
                        </label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Select Payment Option</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <label
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'Online Card'
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Credit / Debit Card</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'Online Card'}
                          onChange={() => setPaymentMethod('Online Card')}
                          className="text-blue-600"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">Instant processing</span>
                    </label>

                    <label
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Cash on Delivery</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="text-blue-600"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">Pay when package arrives</span>
                    </label>
                  </div>

                  {paymentMethod === 'Online Card' && (
                    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary (2 cols) */}
              <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
                  </h3>

                  <div className="divide-y divide-slate-200 max-h-48 overflow-y-auto mb-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <img
                            src={item.product.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover shrink-0"
                          />
                          <span className="truncate text-slate-700 font-medium">
                            {item.quantity}x {item.product.name}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount</span>
                        <span className="tabular-nums">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        ${tax.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                      <span>Grand Total</span>
                      <span className="text-blue-600 tabular-nums">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isProcessing || cart.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20"
                  >
                    {isProcessing ? (
                      <span>Verifying & Securing Order...</span>
                    ) : (
                      <>
                        <span>Place Order · ${total.toFixed(2)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-2 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bank-grade encryption & guaranteed fulfillment</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
