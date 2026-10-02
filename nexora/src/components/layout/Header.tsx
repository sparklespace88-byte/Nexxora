import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ThemeColorPicker } from './ThemeColorPicker';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Package,
  SlidersHorizontal
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    subtotal,
    wishlist,
    currentUser,
    setIsCartOpen,
    setIsAuthModalOpen,
    setAuthMode,
    setIsAccountOpen,
    setIsAdminOpen,
    logout,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProductDetails
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered preview matches
  const searchMatches = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectProduct = (product: typeof products[0]) => {
    setSelectedProductDetails(product);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Main Header Zone */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 sm:p-2 text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 sm:gap-2 group text-decoration-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-all duration-200">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                  NEX<span className="text-blue-600">ORA</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 leading-tight hidden sm:block">
                  E-Commerce Store
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchBoxRef} className="relative flex-1 max-w-2xl hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products by name, brand, or category (e.g. Headphones, Watch, Shoes)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-24 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <button
                onClick={() => {
                  const el = document.getElementById('featured-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                Search
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                {searchMatches.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-50">
                      Matching Products ({searchMatches.length})
                    </div>
                    {searchMatches.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className="px-4 py-2.5 hover:bg-blue-50/60 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200/60"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{prod.brand}</span>
                            <span>·</span>
                            <span className="font-semibold text-blue-600 tabular-nums">
                              ${prod.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No products found matching &ldquo;<span className="font-medium text-slate-800">{searchQuery}</span>&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons: Account, Wishlist, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* User Account Dropdown */}
            <div ref={userMenuRef} className="relative shrink-0">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all shrink-0"
                aria-label="User Account"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[11px] text-slate-400 font-medium leading-none">
                    {currentUser ? 'Hello,' : 'Welcome'}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate leading-tight mt-0.5">
                    {currentUser ? currentUser.name : 'Sign In'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 duration-150">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-slate-500 truncate font-mono text-[11px]">{currentUser.email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-50 text-blue-700">
                            {currentUser.role}
                          </span>
                          {currentUser.authProvider === 'google' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.35 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                              </svg>
                              Google
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsAccountOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Orders
                      </button>
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsAdminOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-medium"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                          Admin Console
                        </button>
                      )}
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-slate-600 mb-3 text-center">
                        Access orders, wishlist & exclusive discounts.
                      </p>
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-center transition-colors mb-2"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full border border-slate-200 text-slate-700 py-1.5 rounded-lg font-medium text-center hover:bg-slate-50 transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Website Theme Color Switcher */}
            <ThemeColorPicker />

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                } else {
                  setIsAccountOpen(true);
                }
              }}
              className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all shrink-0"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 group shrink-0"
              aria-label="Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-blue-900/60 font-medium leading-none">Cart</span>
                <span className="text-xs font-bold text-blue-700 tabular-nums leading-tight mt-0.5">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const el = document.getElementById('featured-products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-20 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl z-50 flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  NEX<span className="text-blue-600">ORA</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Quick Bar */}
            <div className="py-4 border-b border-slate-100">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAccountOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    View Account
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-blue-600 text-white text-xs font-semibold py-2 rounded-xl text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 border border-slate-300 text-slate-700 text-xs font-semibold py-2 rounded-xl text-center"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Categories */}
            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
                Departments
              </span>
              {[
                { name: 'All Products', value: 'All' },
                { name: 'Electronics', value: 'Electronics' },
                { name: 'Fashion', value: 'Fashion' },
                { name: 'Home & Living', value: 'Home & Living' },
                { name: 'Beauty', value: 'Beauty' },
                { name: 'Sports', value: 'Sports' },
                { name: 'Toys & Gaming', value: 'Toys & Gaming' }
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSearchQuery('');
                    setIsMobileMenuOpen(false);
                    const catalog = document.getElementById('featured-products');
                    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-xl"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Admin Operations Console</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
