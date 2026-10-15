import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, ShieldCheck, Mail, Phone, MapPin, Heart, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setSelectedCategory,
    setSelectedSeason,
    setIsAboutOpen,
    setIsContactOpen,
    setIsAdminOpen,
    showToast,
  } = useApp();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      showToast('Thank you for subscribing to DesiBite Dastarkhwan offers!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#09251d] text-white border-t border-emerald-950/80">
      {/* Newsletter Bar */}
      <div className="bg-[#0e382c] py-8 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                DesiBite Dastarkhwan Newsletter
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                Get Weekly Discount Vouchers & Secret Recipes
              </h3>
              <p className="text-xs text-emerald-200">
                Join 45,000+ Pakistani foodies receiving Friday discounts & seasonal announcements.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto max-w-md flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-[#144738] text-white placeholder-emerald-300/60 px-4 py-2.5 rounded-xl text-xs flex-1 border border-emerald-700/60 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-emerald-200/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#c2410c] flex items-center justify-center text-white shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white font-['Outfit']">
                Desi<span className="text-amber-400">Bite</span>
              </span>
            </div>

            <p className="text-amber-300 font-bold font-['Rozha_One'] text-sm">
              گھر جیسا ذائقہ، آپ کے دروازے تک!
            </p>

            <p className="leading-relaxed text-emerald-100/70 max-w-sm">
              Authentic Pakistani food delivery bringing together signature dishes from Karachi, Lahore, Peshawar, and Quetta. Fresh ingredients, pure desi ghee, and sizzling coal-fired charcoal grills.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <span className="text-white font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Halal Verified
              </span>
              <span className="text-white font-semibold flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" /> Pure Desi Ghee
              </span>
            </div>
          </div>

          {/* Cuisines & Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Popular Cuisines</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('biryani-rice');
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Karachi Sindhi Biryani
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('karahi-handi');
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Lahori Butt Karahi
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('traditional-regional');
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Winter Sarson Ka Saag
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('bbq-grill');
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Peshawari Chapli Kebabs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('breakfast');
                    window.scrollTo({ top: 600, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Shahi Nalli Nihari Nashta
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery Coverage Areas */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Service Coverage</h4>
            <ul className="space-y-1.5">
              <li><strong>Lahore:</strong> Gulberg, DHA, Cantt, Johar Town</li>
              <li><strong>Islamabad:</strong> F-6, F-7, F-8, F-10, Blue Area</li>
              <li><strong>Karachi:</strong> Clifton, DHA Phase 1-8, Saddar</li>
              <li><strong>Rawalpindi:</strong> Saddar Cantt, Bahria Town</li>
              <li><strong>Peshawar:</strong> Hayatabad, University Town</li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Company & Help</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setIsAboutOpen(true)} className="hover:text-amber-300 transition-colors cursor-pointer">
                  About DesiBite
                </button>
              </li>
              <li>
                <button onClick={() => setIsContactOpen(true)} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Helpline & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setIsContactOpen(true)} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Delivery Policy & Safety
                </button>
              </li>
              <li>
                <button onClick={() => setIsAdminOpen(true)} className="text-amber-400 hover:underline font-bold transition-colors cursor-pointer">
                  Kitchen Portal (Admin)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods and Copyright */}
        <div className="mt-10 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-200/60">
          <div>
            © {new Date().getFullYear()} DesiBite Technologies Pakistan. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <span>Accepted Payments:</span>
            <span className="bg-emerald-950 px-2 py-0.5 rounded text-white border border-emerald-800">
              💵 Cash on Delivery
            </span>
            <span className="bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
              📱 JazzCash
            </span>
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              💳 Easypaisa
            </span>
            <span className="bg-zinc-900 text-amber-300 px-2 py-0.5 rounded border border-zinc-700">
              💳 Visa/Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
