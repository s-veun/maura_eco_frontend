"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Armchair,
  Bed,
  Box,
  ChevronRight,
  Flame,
  Laptop,
  Sofa,
  Sparkles,
  Star,
  Table2,
} from "lucide-react";
import type { CategoryViewModel } from "@/types/homepage";

type LucideIconComponent = React.ComponentType<{ className?: string }>;

const CAT_ICONS: LucideIconComponent[] = [
  Table2,
  Armchair,
  Sofa,
  Laptop,
  Bed,
  Sparkles,
  Box,
];

const STATIC_CATEGORIES = [
  {
    icon: Table2,
    name: "Dining Tables",
    badge: "Hot" as const,
    href: "/products?category=dining",
  },
  {
    icon: Armchair,
    name: "Premium Chairs",
    badge: "New" as const,
    href: "/products?category=chairs",
  },
  {
    icon: Sofa,
    name: "Sofa Sets",
    badge: undefined,
    href: "/products?category=sofas",
  },
  {
    icon: Laptop,
    name: "Office Furniture",
    badge: "Hot" as const,
    href: "/products?category=office",
  },
  {
    icon: Bed,
    name: "Bedroom Furniture",
    badge: undefined,
    href: "/products?category=bedroom",
  },
  {
    icon: Sparkles,
    name: "Decorations",
    badge: "New" as const,
    href: "/products?category=decor",
  },
];

type MegaMenuProps = {
  isOpen: boolean;
  categories: CategoryViewModel[];
  isLoading: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function MegaMenu({
  isOpen,
  categories,
  isLoading,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const displayItems =
    categories.length > 0
      ? categories.slice(0, 6).map((c, i) => ({
          icon: CAT_ICONS[i % CAT_ICONS.length],
          name: c.catName,
          badge: c.featured
            ? ("Hot" as const)
            : c.popular
              ? ("New" as const)
              : undefined,
          href: `/products?categoryId=${c.catId}`,
          count: c.productCount,
        }))
      : STATIC_CATEGORIES.map((c) => ({ ...c, count: undefined }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-full z-40"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="mx-auto max-w-7xl px-4 pb-3 md:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="flex divide-x divide-slate-100">

                {/* ── LEFT: Category list ── */}
                <div className="flex-1 p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Browse Categories
                  </p>

                  {isLoading ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-14 animate-pulse rounded-xl bg-slate-100"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      {displayItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#f5f2ff]"
                          >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f2ff] text-[#5a3ea8] transition group-hover:bg-[#ede9fe] group-hover:text-[#4a3190]">
                              <Icon className="size-4.5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-slate-800 transition group-hover:text-[#5a3ea8]">
                                {item.name}
                              </span>
                              {item.count !== undefined && (
                                <span className="text-[11px] text-slate-400">
                                  {item.count} items
                                </span>
                              )}
                            </span>
                            <span className="flex shrink-0 items-center gap-1.5">
                              {item.badge && (
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                    item.badge === "Hot"
                                      ? "bg-rose-50 text-rose-600"
                                      : "bg-emerald-50 text-emerald-600"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight className="size-3.5 text-slate-200 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[#5a3ea8]" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <Link
                      href="/products"
                      onClick={onClose}
                      className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#5a3ea8] transition hover:gap-2.5"
                    >
                      View all categories
                      <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

                {/* ── RIGHT: Featured panel ── */}
                <div className="flex w-64 shrink-0 flex-col gap-3 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Featured
                  </p>

                  {/* Promo card */}
                  <Link
                    href="/products?sort=discount"
                    onClick={onClose}
                    className="group relative overflow-hidden rounded-xl bg-linear-to-br from-[#5a3ea8] to-[#3d2882] p-4 text-white transition hover:shadow-[0_8px_24px_rgba(90,62,168,0.35)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                      Limited time
                    </p>
                    <p className="mt-1 text-base font-black leading-tight">
                      Summer
                      <br />
                      Collection
                    </p>
                    <p className="mt-1 text-[11px] text-white/70">
                      Up to 40% off premium furniture
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#5a3ea8] transition group-hover:bg-slate-100">
                      Shop Collection{" "}
                      <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>

                  {/* Quick links */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        icon: Flame,
                        label: "Best Sellers",
                        href: "/products?sort=popular",
                      },
                      {
                        icon: Star,
                        label: "Top Rated",
                        href: "/products?sort=rating",
                      },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={onClose}
                        className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition hover:border-[#5a3ea8]/20 hover:bg-[#f5f2ff]"
                      >
                        <Icon className="size-5 text-[#5a3ea8]" />
                        <span className="text-[11px] font-semibold text-slate-700 transition group-hover:text-[#5a3ea8]">
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
