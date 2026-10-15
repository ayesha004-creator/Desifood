import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SeasonalBanner } from './components/SeasonalBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { MenuSection } from './components/MenuSection';
import { DealsSection } from './components/DealsSection';
import { RestaurantsSection } from './components/RestaurantsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { DesiChefAI } from './components/DesiChefAI';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#faf7f2] text-zinc-900 font-['Plus_Jakarta_Sans']">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero with authentic Pakistani food collage and search */}
          <HeroSection />

          {/* Pakistan Standard Time Seasonal Banner */}
          <SeasonalBanner />

          {/* 11 Culinary Categories */}
          <CategoryGrid />

          {/* Searchable, Filterable Menu Grid */}
          <MenuSection />

          {/* Active Promo Deals */}
          <DealsSection />

          {/* Central Cloud Kitchens in Lahore, Islamabad, Karachi */}
          <RestaurantsSection />

          {/* Verified Customer Stories */}
          <ReviewsSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Modals and Drawers */}
        <DishModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
        <DesiChefAI />
        <ProfileModal />
        <AdminDashboard />
        <AuthModal />
        <AboutModal />
        <ContactModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
