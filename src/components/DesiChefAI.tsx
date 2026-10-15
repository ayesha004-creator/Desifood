import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, Bot, User, Plus, Check } from 'lucide-react';
import { Dish } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedDishes?: Dish[];
}

export const DesiChefAI: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, setSelectedDishModal, addToCart } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Assalam-o-Alaikum! I am Ustaad DesiBite, your personal Pakistani culinary advisor. 👨‍🍳\n\nTell me your mood, budget (e.g. under Rs. 2,000), spice tolerance, or occasion, and I will craft the ultimate authentic dastaarkhwan for you!',
    },
  ]);

  if (!isAiModalOpen) return null;

  const QUICK_PROMPTS = [
    'Family dinner for 4 under Rs. 3,500 with medium spice',
    'Best winter comfort food for tonight',
    'Spicy Lahori karahi with garlic naan',
    'Light vegetarian lunch with daal & roti',
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();

      if (data.success) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.recommendation,
          suggestedDishes: data.suggestedDishes,
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: 'I could not process that request. Please try asking about your favorite dish, price budget, or spice level!',
          },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Our kitchen chef is currently busy. Please try again in a few moments!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full h-[85vh] shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0e382c] to-[#174e3e] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center text-xl shadow-md">
              👨‍🍳
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base font-['Outfit']">Ustaad DesiBite AI</h3>
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-emerald-200">Personal Pakistani Meal & Taste Advisor</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-zinc-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 text-sm shadow-xs mt-1">
                  👨‍🍳
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0e382c] text-white rounded-tr-xs'
                    : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-xs space-y-3'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Suggested Dish Cards inside the message */}
                {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <span className="text-[11px] font-bold text-[#c2410c] uppercase block">
                      Recommended Dishes (1-Click Add):
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedDishes.map(dish => (
                        <div
                          key={dish.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-200/80 gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="truncate">
                              <h5 className="font-bold text-xs text-zinc-900 truncate">
                                {dish.name}
                              </h5>
                              <span className="text-[11px] font-black text-[#0e382c]">
                                Rs. {dish.price}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedDishModal(dish);
                            }}
                            className="bg-[#0e382c] hover:bg-[#144738] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                          >
                            Customize & Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-zinc-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 italic">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Ustaad DesiBite is reviewing the recipes & spices...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-zinc-200/60 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-zinc-100 hover:bg-amber-100 text-zinc-700 hover:text-amber-900 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer border border-zinc-200"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-zinc-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for recommendations (e.g. spicy dinner under Rs 2500)..."
              className="flex-1 p-2.5 text-xs sm:text-sm bg-zinc-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0e382c] text-zinc-800"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#0e382c] hover:bg-[#144738] disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
