import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingCart,
  Mail,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
  Heart,
  CheckCircle2,
  ChevronUp
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    subscribeNewsletter,
    setSelectedCategory,
    setSortBy,
    setIsAccountOpen
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    const res = subscribeNewsletter(newsletterEmail);
    if (res.success) {
      setSubscribedMessage(res.message);
      setNewsletterEmail('');
      setTimeout(() => setSubscribedMessage(''), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopLink = (cat: string) => {
    setSelectedCategory(cat);
    const catalog = document.getElementById('featured-products');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="pb-12 border-b border-slate-800/80 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" />
              <span>Stay Ahead of Drops & Sales</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white font-display">
              Subscribe to the NEXORA Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
              Receive exclusive promo codes, early access to limited edition hardware, and seasonal sales directly to your inbox.
            </p>
          </div>

          <div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shrink-0 shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribedMessage && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{subscribedMessage}</span>
              </p>
            )}
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                NEX<span className="text-blue-500">ORA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your premier online shopping destination for next-generation consumer electronics, performance apparel, and modern lifestyle essentials. Inspired by ShopKart architecture.
            </p>
          </div>

          {/* Col 2: Shop Department */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleShopLink('All')}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopLink('Electronics')}
                  className="hover:text-white transition-colors"
                >
                  Audio & Smart Devices
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopLink('Fashion')}
                  className="hover:text-white transition-colors"
                >
                  Athletic & Streetwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleShopLink('Home & Living')}
                  className="hover:text-white transition-colors"
                >
                  Home & Living Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleShopLink('All');
                    setSortBy('price-asc');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Flash Deals & Clearance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setIsAccountOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Returns Policy: 30-day money-back guarantee on all undamaged items with original packaging.')}
                  className="hover:text-white transition-colors"
                >
                  Returns & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Shipping: Free express delivery for orders above $50. Standard flat rate is $9.99.')}
                  className="hover:text-white transition-colors"
                >
                  Shipping Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Customer Hotline: +1 (800) 555-NEXORA (24/7 Priority Support)')}
                  className="hover:text-white transition-colors"
                >
                  24/7 Support Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('NEXORA Warranty: 1-Year official manufacturer warranty on all electronics.')}
                  className="hover:text-white transition-colors"
                >
                  Warranty Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: About & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              About NEXORA
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="block text-slate-400">Founded in 2026</span>
              </li>
              <li>
                <span className="block text-slate-400">San Francisco, CA & Global Distribution</span>
              </li>
              <li>
                <button
                  onClick={() => alert('Privacy Policy: All customer records are stored securely with prepared statements and encryption.')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Terms of Service: Standard consumer rights apply to all orders placed on NEXORA.')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} NEXORA Inc. All rights reserved. Inspired by ShopKart.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CreditCard className="w-4 h-4" />
              <span>Cards</span>
              <span>·</span>
              <Truck className="w-4 h-4" />
              <span>Cash on Delivery</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors ml-2"
              aria-label="Scroll back to top"
              title="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
