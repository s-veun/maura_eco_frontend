"use client";

import { useState } from "react";
import { Search, Package, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Header from "@/components/header";

export default function TrackingSearchPage() {
  const [orderId, setOrderId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      window.location.assign(`/tracking/${orderId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      
      <main className="pt-40 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c2d91]/10 border border-[#5c2d91]/20 text-[#5c2d91] dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Package size={14} /> Global Logistics Network
            </div>
            <h1 className="text-6xl sm:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
              Track Your <br /> <span className="text-[#5c2d91]">Deployment</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-bold text-sm uppercase tracking-widest leading-relaxed">
              Enter your unique order identifier to access the real-time logistics manifest and mission status.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative group animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5c2d91] to-[#10b981] rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <form onSubmit={handleSearch} className="relative bg-white dark:bg-[#1a1a2e] p-3 rounded-[2.5rem] shadow-2xl border-2 border-gray-100 dark:border-white/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                <Search size={24} />
              </div>
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. 10245)"
                className="flex-1 bg-transparent border-none outline-none text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
              <button 
                type="submit"
                className="bg-[#5c2d91] hover:bg-[#3c3068] text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl hover:shadow-purple-500/20 active:scale-95"
              >
                Track Now <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {[
              { icon: <Zap className="text-amber-500" />, title: "Real-time Feed", desc: "Live status updates from our logistics hubs" },
              { icon: <ShieldCheck className="text-emerald-500" />, title: "Secure Transit", desc: "Encrypted handling of all cargo manifests" },
              { icon: <Package className="text-blue-500" />, title: "Detailed Logs", desc: "Access full deployment history and timestamps" },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a2e] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-4 hover:-translate-y-2 transition-transform shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{feature.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
