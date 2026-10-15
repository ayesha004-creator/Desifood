import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const REVIEWS = [
    {
      id: 'r-1',
      name: 'Syed Hamza Ali',
      city: 'Lahore (Gulberg)',
      dish: 'Butt Style Desi Ghee Chicken Karahi',
      rating: 5,
      date: 'Yesterday',
      comment:
        'SubhanAllah! Exactly the taste of Lakshmi Chowk Butt Karahi. Fresh desi ghee aroma with piping hot Roghni Naan. Delivered in 28 minutes steam hot!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'r-2',
      name: 'Dr. Fatima Noor',
      city: 'Islamabad (F-7)',
      dish: 'Dum Pukht Mutton Biryani & Kashmiri Chai',
      rating: 5,
      date: '2 days ago',
      comment:
        'The meat fell off the bone effortlessly. Fragrant long-grain basmati with genuine saffron. And the Kashmiri Pink Chai with crushed pistachios felt like home in winter.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'r-3',
      name: 'Usman Farooq',
      city: 'Karachi (Clifton)',
      dish: 'Burns Road Beef Bihari Boti & Haleem',
      rating: 5,
      date: '3 days ago',
      comment:
        'Best Haleem in Karachi! The texture is slow-pounded and silky, topped with crispy fried onions and desi ghee baghar. Will order again for family Sunday.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="bg-white py-14 border-y border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#c2410c]">
            Verified Customer Stories
          </span>
          <h2 className="text-3xl font-black text-[#0e382c] tracking-tight mt-1 font-['Outfit']">
            Over 50,000+ Desi Foodies Trust Us
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Read what our food lovers in Lahore, Islamabad, and Karachi have to say about their meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="bg-[#faf7f2] p-6 rounded-3xl border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="text-[11px] font-bold text-[#0e382c]">
                  Ordered: <span className="font-semibold text-zinc-800">{rev.dish}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200/60 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-600"
                />
                <div>
                  <div className="font-bold text-xs text-zinc-900 flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </div>
                  <span className="text-[10px] text-zinc-500">{rev.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
