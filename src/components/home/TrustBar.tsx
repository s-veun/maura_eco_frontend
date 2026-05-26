"use client";

import { Truck, Shield, HeadphonesIcon, CreditCard } from "lucide-react";

const FEATURES = [
  {
    icon: <Truck className="h-5 w-5 text-white" />,
    title: "Free Shipping",
    subtitle: "On orders over $50",
    gradient: "linear-gradient(135deg,#7356c2,#a78bfa)",
    shadow: "rgba(115,86,194,0.30)",
  },
  {
    icon: <Shield className="h-5 w-5 text-white" />,
    title: "Secure Payment",
    subtitle: "100% secure checkout",
    gradient: "linear-gradient(135deg,#059669,#34d399)",
    shadow: "rgba(5,150,105,0.28)",
  },
  {
    icon: <HeadphonesIcon className="h-5 w-5 text-white" />,
    title: "24/7 Support",
    subtitle: "Dedicated helpdesk",
    gradient: "linear-gradient(135deg,#0284c7,#38bdf8)",
    shadow: "rgba(2,132,199,0.28)",
  },
  {
    icon: <CreditCard className="h-5 w-5 text-white" />,
    title: "Easy Returns",
    subtitle: "30-day return policy",
    gradient: "linear-gradient(135deg,#dc2626,#f87171)",
    shadow: "rgba(220,38,38,0.26)",
  },
];

export function TrustBar() {
  return (
    <div className="bg-white rounded-2xl px-6 py-[18px] shadow-[0_2px_14px_rgba(115,86,194,0.07)]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3.5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ background: f.gradient, boxShadow: `0 6px 18px ${f.shadow}` }}
            >
              {f.icon}
            </div>
            <div>
              <span className="text-[13.5px] font-semibold text-gray-800 block leading-tight">{f.title}</span>
              <span className="text-[11.5px] text-gray-400 leading-snug">{f.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustBar;
