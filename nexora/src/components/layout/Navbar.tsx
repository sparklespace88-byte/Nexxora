import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Menu,
  ChevronDown,
  Flame,
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Activity,
  Gamepad2,
  Tag,
  Compass,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setSortBy
  } = useStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsDropdownOpen(false);
    const catalogElement = document.getElementById('featured-products');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electronics':
        return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'fashion':
        return <Shirt className="w-4 h-4 text-emerald-600" />;
      case 'home-living':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'beauty':
        return <Sparkles className="w-4 h-4 text-rose-500" />;
      case 'sports':
        return <Activity className="w-4 h-4 text-indigo-600" />;
      case 'toys':
        return <Gamepad2 className="w-4 h-4 text-purple-600" />;
      default:
        return <Tag className="w-4 h-4 text-slate-500" />;
    }
  };

  const navCategories = [
    { label: 'All Products', value: 'All' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Fashion', value: 'Fashion' },
    { label: 'Home & Living', value: 'Home & Living' },
    { label: 'Beauty', value: 'Beauty' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Toys', value: 'Toys & Gaming' }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 text-slate-700 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left: "All Categories" Mega Button & Dropdown */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* All Categories Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in-50 duration-150 divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Browse Departments
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-blue-600" />
                      <span>Entire Catalog</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {getCategoryIcon(cat.slug)}
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {cat.itemCount} items
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center: Horizontal Category Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto py-1 scrollbar-none">
            {navCategories.map((item) => {
              const isActive = selectedCategory === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleCategorySelect(item.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right: Deals Highlight Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSortBy('price-asc');
                const el = document.getElementById('deal-banners');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-200/50"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Today&apos;s Hot Deals</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
