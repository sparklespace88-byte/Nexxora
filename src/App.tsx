import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Toast } from './components/common/Toast';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { HeroSlider } from './components/home/HeroSlider';
import { TrustFeatures } from './components/home/TrustFeatures';
import { CategoryList } from './components/home/CategoryList';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { DealBanners } from './components/home/DealBanners';
import { Footer } from './components/layout/Footer';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserDashboardModal } from './components/account/UserDashboardModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* Toast Notification Container */}
        <Toast />

        {/* Top Header with Search, Live Suggestions, Account & Cart */}
        <Header />

        {/* Category Navigation Bar with Mega Dropdown */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Promotional Banner Carousel */}
          <HeroSlider />

          {/* Value Propositions / Trust Badges */}
          <TrustFeatures />

          {/* Popular Circular Categories */}
          <CategoryList />

          {/* Featured Products Grid with Filter Tabs & Sort */}
          <FeaturedProducts />

          {/* Promotional Deal Banners with Live Countdown Timer */}
          <DealBanners />
        </main>

        {/* Dark Navy Footer with Newsletter Subscription */}
        <Footer />

        {/* Modals & Slide-over Drawers */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <AuthModal />
        <UserDashboardModal />
        <AdminDashboard />
      </div>
    </StoreProvider>
  );
}
