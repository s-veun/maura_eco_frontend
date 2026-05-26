"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Armchair,
  Sofa,
  Monitor,
  BedDouble,
  Flower2,
  ArrowRight,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const categories = [
  { label: "Dining Tables",      icon: UtensilsCrossed, href: "/products?category=dining",   badge: "Hot"      },
  { label: "Premium Chairs",     icon: Armchair,        href: "/products?category=chairs",   badge: "New"      },
  { label: "Sofa Sets",          icon: Sofa,            href: "/products?category=sofas",    badge: "Trending" },
  { label: "Office Furniture",   icon: Monitor,         href: "/products?category=office",   badge: null       },
  { label: "Bedroom Furniture",  icon: BedDouble,       href: "/products?category=bedroom",  badge: "New"      },
  { label: "Decorations",        icon: Flower2,         href: "/products?category=decor",    badge: null       },
];

type BadgeKey = "Hot" | "New" | "Trending";

const badgeConfig: Record<BadgeKey, { bg: string; icon: React.ElementType }> = {
  Hot:      { bg: "bg-red-50 text-red-500",       icon: Flame      },
  New:      { bg: "bg-[#DEF9EC] text-[#3BB77E]",  icon: Sparkles   },
  Trending: { bg: "bg-amber-50 text-amber-500",   icon: TrendingUp },
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-full z-50 mt-2 w-175 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
          onMouseLeave={onClose}
        >
          <div className="grid grid-cols-[1fr_240px]">
            {/* Left: categories */}
            <div className="p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#ADADAD]">
                Browse Categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map(({ label, icon: Icon, href, badge }) => {
                  const cfg = badge ? badgeConfig[badge as BadgeKey] : null;
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-[#DEF9EC]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-[#3BB77E] transition-colors group-hover:bg-white group-hover:shadow-sm">
                        <Icon size={15} />
                      </div>
                      <span className="flex-1 text-sm font-medium text-[#253D4E]">{label}</span>
                      {cfg && badge && (
                        <span
                          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg}`}
                        >
                          <cfg.icon size={9} />
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/products"
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3BB77E] transition-all hover:gap-3"
              >
                View all products
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: featured */}
            <div className="flex flex-col justify-between rounded-r-2xl border-l border-gray-100 bg-[#DEF9EC]/30 p-5">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#ADADAD]">
                  Featured
                </p>
                <div className="relative mb-3 flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#3BB77E]/10 via-[#DEF9EC] to-white">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                      <span className="text-2xl">🛋️</span>
                    </div>
                    <p className="text-xs font-bold text-[#253D4E]">New Collection</p>
                    <p className="text-[11px] text-[#ADADAD]">Summer 2025</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#253D4E]">Modern Living Collection</p>
                <p className="mt-1 text-xs leading-relaxed text-[#ADADAD]">
                  Curated pieces for your perfect home.
                </p>
              </div>

              <Link
                href="/products"
                onClick={onClose}
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-[#3BB77E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2ea36d] hover:shadow-md hover:shadow-[#3BB77E]/30"
              >
                Shop Collection
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
