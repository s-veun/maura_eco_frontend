"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PROMOS = [
  {
    title: "Exclusive Member Deals",
    subtitle: "Sign in to unlock",
    description: "Personalized pricing and member-only discounts tailored for you.",
    cta: "Sign In Now",
    ctaHref: "/login",
    gradient: "from-[#5a3ea8] to-[#9d7fe8]",
    emoji: "🏷️",
    shadow: "shadow-purple-400/30",
  },
  {
    title: "Free Delivery Today",
    subtitle: "Orders above $50",
    description: "Same-day delivery to your door — completely free of charge.",
    cta: "Start Shopping",
    ctaHref: "/products",
    gradient: "from-[#f97316] to-[#fbbf24]",
    emoji: "🚚",
    shadow: "shadow-orange-400/30",
  },
];

export default function PromoBannerStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PROMOS.map((promo, idx) => (
        <motion.div
          key={promo.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -3 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 shadow-xl ${promo.shadow} min-h-[138px] flex flex-col justify-center gap-2`}
        >
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[70px] opacity-15 pointer-events-none select-none">
            {promo.emoji}
          </span>
          <p className="text-white/75 text-xs font-semibold uppercase tracking-wide">{promo.subtitle}</p>
          <h3 className="text-white text-xl font-black">{promo.title}</h3>
          <p className="text-white/80 text-sm leading-relaxed max-w-[220px]">{promo.description}</p>
          <div>
            <Link
              href={promo.ctaHref}
              className="inline-flex items-center gap-1.5 mt-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-bold text-xs px-3 py-1.5 backdrop-blur-sm transition-colors"
            >
              {promo.cta} <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

