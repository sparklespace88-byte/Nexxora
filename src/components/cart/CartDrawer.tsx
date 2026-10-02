import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              Your Shopping Bag
            </h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-600 hover:underline mr-2"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-blue-50/70 px-6 py-3 border-b border-blue-100">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700">You unlocked Free Express Shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-blue-700 tabular-nums">${remainingForFreeShipping.toFixed(2)}</strong> more for FREE Shipping!
                </span>
              )}
            </div>
            <span className="font-mono text-[11px] text-blue-700">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="pt-4 first:pt-0 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200/80"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Unit: ${item.product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore our catalog and find something special for yourself or loved ones.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                Start Shopping Now
              </button>
            </div>
          )}
        </div>

        {/* Cart Footer Summary */}
        {cart.length > 0 && (
          <div className="border-t border-slate-200 p-6 bg-slate-50/70 space-y-3">
            {/* Coupon Application */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. SAVE20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs uppercase text-slate-800 font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">{appliedCoupon.code}</span>
                  <span>({appliedCoupon.discountPercent}% off applied)</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-emerald-900 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
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

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-blue-600 tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20 mt-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Encrypted 256-Bit SSL Checkout Protection</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
