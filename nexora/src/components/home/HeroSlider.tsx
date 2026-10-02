import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_BANNERS } from '../../data/mockData';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % INITIAL_BANNERS.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + INITIAL_BANNERS.length) % INITIAL_BANNERS.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const handleShopNow = (category: string) => {
    setSelectedCategory(category);
    const catalog = document.getElementById('featured-products');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center">
        {INITIAL_BANNERS.map((banner, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />

              {/* Background/Slide Product Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 transform transition-transform duration-1000 ease-out"
              />

              {/* Banner Text Content */}
              <div className="relative z-20 max-w-xl px-6 sm:px-12 py-8 flex flex-col items-start gap-3 sm:gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span>{banner.highlightText}</span>
                  <span>·</span>
                  <span className="text-white">{banner.badgeText}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display text-balance">
                  {banner.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
                  {banner.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleShopNow(banner.linkCategory)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 group"
                  >
                    <span>{banner.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300/80 pl-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Official Manufacturer Warranty Included</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-md focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-md focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Navigation Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {INITIAL_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
