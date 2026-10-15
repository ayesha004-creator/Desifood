import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  MapPin,
  Sparkles,
  Menu as MenuIcon,
  X,
  Flame,
  ShieldCheck,
  ChevronDown,
  Percent,
  Clock,
  Heart
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    setIsCartOpen,
    user,
    setIsAuthOpen,
    setIsProfileOpen,
    setIsAdminOpen,
    setIsAiModalOpen,
    setIsAboutOpen,
    setIsContactOpen,
    currentCity,
    setCurrentCity,
    currentArea,
    setCurrentArea,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedSeason,
    activeSeason,
    logout,
  } = useApp();

  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const CITIES = [
    { city: 'Lahore', areas: ['Gulberg & DHA', 'Johar Town', 'Model Town', 'Cantt', 'Mall Road'] },
    { city: 'Islamabad', areas: ['F-7 & F-8', 'Blue Area', 'F-10 & F-11', 'E-7', 'G-9'] },
    { city: 'Karachi', areas: ['Clifton & DHA', 'Saddar', 'PECHS', 'Gulshan-e-Iqbal', 'North Nazimabad'] },
    { city: 'Rawalpindi', areas: ['Saddar Cantt', 'Bahria Town', 'Satellite Town'] },
    { city: 'Peshawar', areas: ['University Town', 'Hayatabad', 'Saddar'] },
  ];

  const handleCitySelect = (city: string, area: string) => {
    setCurrentCity(city);
    setCurrentArea(area);
    setIsLocationMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0e382c] text-white shadow-md border-b border-emerald-900/50">
      {/* Top micro bar for announcements & seasonal prompt */}
      <div className="bg-[#09251d] text-xs py-1.5 px-4 text-emerald-100 flex items-center justify-between border-b border-emerald-950/60">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-[#c2410c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 inline" /> {activeSeason || 'Winter'} Special
          </span>
          <span className="hidden sm:inline text-amber-200">
            Ghar Jaisa Zaiqa, Aap Ke Darwazay Tak! Enjoy Free Delivery on orders over Rs. 2,000
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            About DesiBite
          </button>
          <button
            onClick={() => setIsContactOpen(true)}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Support & FAQs
          </button>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> Delivery: 25-35 mins
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSeason('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-[#c2410c] flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                  Desi<span className="text-amber-400">Bite</span>
                </span>
                <span className="bg-emerald-950/80 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  دیسی
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/90 font-medium tracking-wide">
                Ghar Jaisa Zaiqa • Authentic Pakistani
              </p>
            </div>
          </button>

          {/* Delivery Location dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-1.5 bg-[#144738] hover:bg-[#1a5544] px-3 py-1.5 rounded-xl text-xs font-medium border border-emerald-700/50 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="text-left leading-tight">
                <span className="text-emerald-300 block text-[10px]">Delivering to</span>
                <span className="font-semibold text-white truncate max-w-[140px] block">
                  {currentCity}, {currentArea}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300 ml-1" />
            </button>

            {isLocationMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white text-zinc-800 rounded-2xl shadow-2xl border border-zinc-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-xs font-bold text-zinc-500 uppercase px-2 mb-2">Select Your City & Area</div>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {CITIES.map(c => (
                    <div key={c.city} className="border-b border-zinc-100 pb-2 mb-2 last:border-b-0 last:mb-0">
                      <div className="font-bold text-xs text-[#0e382c] px-2 flex items-center justify-between">
                        {c.city}
                        {c.city === currentCity && <span className="text-[10px] text-emerald-600 font-semibold">Active</span>}
                      </div>
                      <div className="grid grid-cols-1 gap-1 mt-1">
                        {c.areas.map(area => (
                          <button
                            key={area}
                            onClick={() => handleCitySelect(c.city, area)}
                            className={`text-left px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                              currentCity === c.city && currentArea === area
                                ? 'bg-emerald-50 text-[#0e382c] font-bold'
                                : 'hover:bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes, biryani, karahi, kabab, chai..."
              className="w-full bg-[#144738] text-white placeholder-emerald-300/60 pl-10 pr-4 py-2 rounded-xl text-sm border border-emerald-700/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-300 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Desi Chef AI Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-[#c2410c] hover:from-amber-400 hover:to-[#d94812] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            title="Ask Desi Chef AI for meal recommendations"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span className="hidden sm:inline">Desi Chef AI</span>
            <span className="sm:hidden">AI Chef</span>
          </button>

          {/* User Account / Admin Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-[#144738] hover:bg-[#1a5544] px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-[#0e382c] font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:inline truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="bg-amber-400 text-[#0e382c] text-[10px] font-bold px-1 rounded uppercase">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 bg-[#144738] hover:bg-[#1a5544] text-white px-3 py-2 rounded-xl text-xs font-bold border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-emerald-300" />
                <span>Log In</span>
              </button>
            )}

            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-zinc-800 rounded-2xl shadow-2xl border border-zinc-100 p-2 z-50">
                <div className="px-3 py-2 border-b border-zinc-100">
                  <div className="font-bold text-sm text-[#0e382c]">{user.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="bg-emerald-100 text-[#0e382c] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {user.role === 'admin' ? 'Administrator' : 'Desi Foodie'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-500" /> My Profile & Addresses
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-zinc-500" /> Order History
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsAdminOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#c2410c] hover:bg-amber-50 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c2410c]" /> Admin Dashboard
                    </button>
                  )}
                </div>

                <div className="border-t border-zinc-100 pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Admin Shortcut for convenient review testing */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden sm:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Open Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-950/20 transition-all transform hover:scale-105 cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-zinc-950" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c2410c] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="font-bold">
              {cartSubtotal > 0 ? `Rs. ${cartSubtotal}` : 'Cart'}
            </span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#144738] text-white hover:bg-[#1a5544] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar & navigation drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#09251d] border-t border-emerald-900/60 p-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes, karahi, biryani..."
              className="w-full bg-[#144738] text-white placeholder-emerald-300/60 pl-10 pr-4 py-2 rounded-xl text-sm border border-emerald-700/60 focus:outline-none"
            />
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-emerald-900 text-xs">
            <span className="text-emerald-300">City / Area:</span>
            <span className="font-bold text-amber-300">{currentCity} - {currentArea}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 bg-[#144738] rounded-lg text-white"
            >
              All Menu
            </button>
            <button
              onClick={() => {
                setSelectedSeason('Winter');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 bg-[#144738] rounded-lg text-amber-300 font-bold"
            >
              Winter Specials
            </button>
            <button
              onClick={() => {
                setIsAboutOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 bg-[#144738] rounded-lg text-emerald-200"
            >
              About DesiBite
            </button>
            <button
              onClick={() => {
                setIsContactOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 bg-[#144738] rounded-lg text-emerald-200"
            >
              FAQs & Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
