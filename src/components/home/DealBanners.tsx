import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Timer, ArrowRight, Zap, Award } from 'lucide-react';
import imgHeadphones from '../../assets/images/product_wireless_headphones_1790441955153.jpg';
import imgRunningShoes from '../../assets/images/product_running_shoes_1790441985090.jpg';

export const DealBanners: React.FC = () => {
  const { setSelectedCategory, setSortBy } = useStore();

  // Live countdown timer for the flash sale (ends in 14h 28m 45s, decrements every second)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 28,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShopBanner = (cat: string) => {
    setSelectedCategory(cat);
    setSortBy('price-asc');
    const catalog = document.getElementById('featured-products');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="deal-banners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Summer Sale Up to 50% Off with Countdown */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[300px] shadow-lg group">
          <div className="relative z-10 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              <span>Limited Time Mega Deal</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-display">
              Summer Tech Clearance
            </h3>
            <p className="text-xl font-bold text-amber-400 mt-1">
              Up to 50% OFF Flagship Gear
            </p>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
              <div className="flex items-center gap-1 text-slate-300 mr-1">
                <Timer className="w-4 h-4 text-amber-300" />
                <span>Ends In:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-white/10 text-center min-w-8">
                  <span className="font-mono text-sm text-white font-bold tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-slate-400">HRS</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>
                <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-white/10 text-center min-w-8">
                  <span className="font-mono text-sm text-white font-bold tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-slate-400">MIN</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>
                <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-white/10 text-center min-w-8">
                  <span className="font-mono text-sm text-amber-400 font-bold tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-slate-400">SEC</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6">
            <button
              onClick={() => handleShopBanner('Electronics')}
              className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-slate-100 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md group-hover:translate-x-1"
            >
              <span>Shop Clearance Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Background product image + gradient overlay (same style as the hero slider) */}
          <img
            src={imgHeadphones}
            alt="Headphones clearance"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/90 to-transparent pointer-events-none" />
        </div>

        {/* Banner 2: Top Brands Best Deals */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[300px] shadow-lg group">
          <div className="relative z-10 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certified Original Brands</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-display">
              Top Brands · Best Deals
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Explore officially verified fitness wear, smart wearables, and audiophile gear with comprehensive warranties.
            </p>

            <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
              <span className="font-semibold text-white">Featured:</span>
              <span>AeroKnit</span>
              <span>·</span>
              <span>PulseTech</span>
              <span>·</span>
              <span>NEXORA Sound</span>
            </div>
          </div>

          <div className="relative z-10 pt-6">
            <button
              onClick={() => handleShopBanner('Fashion')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md group-hover:translate-x-1"
            >
              <span>Explore Top Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Background product image + gradient overlay (same style as the hero slider) */}
          <img
            src={imgRunningShoes}
            alt="Sports shoes"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
