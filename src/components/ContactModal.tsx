import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, HelpCircle, Phone, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactModal: React.FC = () => {
  const { isContactOpen, setIsContactOpen } = useApp();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isContactOpen) return null;

  const FAQS = [
    {
      q: 'How fast is DesiBite delivery in Lahore, Karachi, and Islamabad?',
      a: 'Our average delivery time is 25 to 35 minutes. All dishes are packed in custom thermal-insulated bags to ensure tandoori rotis stay soft and karahis arrive sizzling hot.',
    },
    {
      q: 'Can I pay via Cash on Delivery (COD) or mobile wallets?',
      a: 'Yes! We support Cash on Delivery (with change notes if you have a Rs. 5000 note), JazzCash direct wallet debits, Easypaisa mobile payments, and standard debit/credit cards.',
    },
    {
      q: 'What is the Free Delivery threshold?',
      a: 'All orders over Rs. 2,000 qualify for 100% Free Express Delivery across our designated city sectors.',
    },
    {
      q: 'Are the seasonal specials available year-round?',
      a: 'Our seasonal menu follows natural agricultural harvest and Pakistani traditions. Winter specials (Sarson Ka Saag, Makki Ki Roti, Kashmiri Chai) are actively featured during cold months, while Summer Mango Lassis and Ramadan Iftar platters are showcased in their respective seasons.',
    },
    {
      q: 'Can I customize the spice level or ask for instructions?',
      a: 'Absolutely! When clicking on any dish, you can select portions, add-ons (raita, salad, extra naans), and write custom kitchen instructions (e.g., "Kam mirch", "Extra lemon wedges").',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#0e382c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-['Outfit']">Support & Frequently Asked Questions</h3>
          </div>
          <button
            onClick={() => setIsContactOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:+923004567890"
              className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 flex items-center gap-2.5 transition-colors hover:bg-emerald-100"
            >
              <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
              <div>
                <div className="font-bold text-xs">Call Helpline</div>
                <div className="text-[11px] text-emerald-700 font-semibold">+92 300 4567890</div>
              </div>
            </a>

            <a
              href="mailto:support@desibite.pk"
              className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 flex items-center gap-2.5 transition-colors hover:bg-amber-100"
            >
              <Mail className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <div className="font-bold text-xs">Email Kitchen</div>
                <div className="text-[11px] text-amber-800 font-semibold">support@desibite.pk</div>
              </div>
            </a>

            <div className="p-3.5 bg-zinc-100 rounded-2xl border border-zinc-200 text-zinc-900 flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-zinc-700 shrink-0" />
              <div>
                <div className="font-bold text-xs">Operational Hours</div>
                <div className="text-[11px] text-zinc-600 font-medium">8:00 AM – 3:00 AM</div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-[#0e382c] uppercase tracking-wider">
              Frequently Asked Questions
            </h4>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-zinc-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-zinc-900 flex items-center justify-between gap-3 bg-zinc-50 hover:bg-zinc-100 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 bg-white text-zinc-600 text-xs leading-relaxed border-t border-zinc-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
