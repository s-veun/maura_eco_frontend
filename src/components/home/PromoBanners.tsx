"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROMOS = [
  { key: "summer", title: "Summer Flash", subtitle: "Up to 60% OFF", description: "Limited time deals on top categories", cta: "Shop Now", href: "/products?deal=summer", gradient: "linear-gradient(135deg, #7356c2 0%, #a78bfa 100%)", emoji: "☀️", shadowColor: "rgba(115,86,194,0.30)" },
  { key: "electronics", title: "Tech Bonanza", subtitle: "Up to 45% OFF", description: "Smart gadgets & electronics", cta: "Explore", href: "/products?category=electronics", gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)", emoji: "💻", shadowColor: "rgba(2,132,199,0.30)" },
  { key: "grocery", title: "Fresh Daily", subtitle: "Free Delivery", description: "Organic & fresh food daily", cta: "Order Now", href: "/products?category=grocery", gradient: "linear-gradient(135deg, #059669 0%, #34d399 100%)", emoji: "🥦", shadowColor: "rgba(5,150,105,0.30)" },
  { key: "fashion", title: "Style Drop", subtitle: "New Collection", description: "Trending fashion & accessories", cta: "View Styles", href: "/products?category=fashion", gradient: "linear-gradient(135deg, #be185d 0%, #f472b6 100%)", emoji: "👗", shadowColor: "rgba(190,24,93,0.28)" },
];

export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {PROMOS.map((promo) => (
        <div
          key={promo.key}
          className="relative rounded-[18px] p-[22px] text-white flex flex-col gap-1.5 overflow-hidden transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
          style={{ background: promo.gradient, boxShadow: `0 8px 26px ${promo.shadowColor}`, minHeight: 170 }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-2.5 -bottom-5 w-20 h-20 rounded-full bg-white/07 pointer-events-none" />
          {/* Background emoji */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[60px] opacity-25 pointer-events-none select-none">{promo.emoji}</span>

          <span className="inline-block text-white/88 text-[10.5px] font-bold tracking-[1.2px] uppercase bg-white/18 rounded-[10px] px-2.5 py-0.5 w-fit">
            {promo.subtitle}
          </span>
          <h4 className="text-white font-extrabold text-[19px] leading-tight my-0.5">{promo.title}</h4>
          <span className="text-white/86 text-[12.5px] leading-relaxed">{promo.description}</span>
          <div className="mt-2.5">
            <Link
              href={promo.href}
              className="inline-flex items-center gap-1 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/55 bg-white/24 backdrop-blur-sm hover:bg-white/35 transition-colors"
            >
              {promo.cta}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PromoBanners;
