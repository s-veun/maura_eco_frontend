"use client";

import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const FEATURES = [
  { icon: <ShieldCheck className="w-5 h-5 text-[#5a3ea8]" />, title: "Secure Payment", desc: "256-bit SSL encrypted" },
  { icon: <Truck className="w-5 h-5 text-[#5a3ea8]" />, title: "Free Delivery", desc: "On orders above $50" },
  { icon: <RotateCcw className="w-5 h-5 text-[#5a3ea8]" />, title: "Easy Returns", desc: "30-day return policy" },
  { icon: <Headphones className="w-5 h-5 text-[#5a3ea8]" />, title: "24/7 Support", desc: "Always here to help" },
];

export default function TrustBarNew() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            {f.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{f.title}</p>
            <p className="text-xs text-gray-400 truncate">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

