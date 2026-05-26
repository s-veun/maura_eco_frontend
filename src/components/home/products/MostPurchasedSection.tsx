"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.38 },
};

interface Props {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (id: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
  onQuickView: (product: Product) => void;
}

export function MostPurchasedSection({
  products,
  isLoading,
  onAddToCart,
  onWishlist,
  onQuickView,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [adding, setAdding] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  const handleAdd = async (id: number) => {
    setAdding(id);
    await onAddToCart(id);
    setTimeout(() => setAdding(null), 900);
  };

  return (
    <section
      id="most-purchased"
      className="border-y border-border/40 bg-slate-50 dark:bg-slate-900/30 py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        <motion.div
          {...fadeUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-[5px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <ShoppingBag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                Best Sellers
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Most purchased
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Trusted by thousands of customers — proven quality.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/products?sort=best-seller"
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
            >
              View all →
            </Link>
            <div className="flex gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-[5px] border border-border/60 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:border-border/80 transition-colors bg-white dark:bg-slate-900"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-[5px] border border-border/60 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:border-border/80 transition-colors bg-white dark:bg-slate-900"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-56 rounded-[5px] border border-border/40 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[5px] border border-border/40 bg-white dark:bg-slate-900 p-10 text-center text-sm text-slate-400">
            No data available.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, i) => (
              <motion.div
                key={product.proId}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.35 }}
                className="group flex-none w-56 snap-start rounded-[5px] border border-border/40 bg-white dark:bg-slate-900 overflow-hidden hover:border-emerald-300/60 dark:hover:border-emerald-500/40 transition-colors duration-200"
              >
                {/* Image */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.proName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                  {/* Rank badge */}
                  <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-[5px] bg-emerald-500 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white leading-none">
                      #{i + 1}
                    </span>
                  </div>
                  {/* Discount badge */}
                  {product.discount != null && product.discount > 0 && (
                    <Badge className="absolute top-2.5 right-2.5 rounded-[5px] bg-rose-500 hover:bg-rose-500 text-white text-[10px] px-1.5">
                      -{product.discount}%
                    </Badge>
                  )}
                  {/* Quick view button */}
                  <button
                    onClick={() => onQuickView(product)}
                    className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-[5px] bg-white/90 dark:bg-slate-900/90 border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-emerald-600"
                    aria-label="Quick view"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide truncate">
                    {product.categoryName}
                  </p>
                  <Link href={`/products/${product.proId}`}>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mt-0.5 mb-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug min-h-10">
                      {product.proName}
                    </h3>
                  </Link>
                  {product.purchaseCount != null && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      {product.purchaseCount.toLocaleString()} sold
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      ${product.proPrice.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(product.proId)}
                      disabled={adding === product.proId}
                      variant="ghost"
                      className={cn(
                        "rounded-[5px] h-7 px-2.5 text-xs transition-all",
                        adding === product.proId
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white"
                      )}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {adding === product.proId ? "…" : "Add"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
