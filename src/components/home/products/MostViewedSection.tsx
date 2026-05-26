"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingCart, Heart, Package, BarChart2 } from "lucide-react";
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

export function MostViewedSection({
  products,
  isLoading,
  onAddToCart,
  onWishlist,
  onQuickView,
}: Props) {
  const [adding, setAdding] = useState<number | null>(null);

  const handleAdd = async (id: number) => {
    setAdding(id);
    await onAddToCart(id);
    setTimeout(() => setAdding(null), 900);
  };

  const featured = products[0] ?? null;
  // console.log("Most Viewed Products:", products);
  const side = products.slice(1, 5);

  return (
    <section id="most-viewed" className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
      <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-[5px] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <BarChart2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              Most Viewed
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Crowd favourites
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The pieces everyone keeps coming back to.
          </p>
        </div>
        <Link
          href="/products?sort=most-viewed"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors shrink-0"
        >
          View all →
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid lg:grid-cols-5 gap-4">
          <Skeleton className="lg:col-span-3 rounded-[5px] min-h-96" />
          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 rounded-[5px] border border-border/40 p-3">
                <Skeleton className="w-20 h-20 rounded-[5px] shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[5px] border border-border/40 bg-slate-50 dark:bg-slate-900/40 p-10 text-center text-sm text-slate-400">
          No data available.
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* ── Large featured card ────────────────────── */}
          {featured && (
            <motion.div
              {...fadeUp}
              className="lg:col-span-3 group relative rounded-[5px] border border-border/40 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer hover:border-blue-300/60 dark:hover:border-blue-500/40 transition-colors min-h-80"
              onClick={() => onQuickView(featured)}
            >
              {featured.thumbnailImageUrl  ? (
                <Image
                  src={featured.thumbnailImageUrl ?? featured.imageUrl}
                  alt={featured.proName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  <Package className="w-16 h-16 text-slate-300" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              {featured.viewCount != null && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[5px] bg-white/10 border border-white/15 backdrop-blur-sm">
                  <BarChart2 className="w-3 h-3 text-white/80" />
                  <span className="text-xs text-white font-semibold">
                    {featured.viewCount.toLocaleString()}
                  </span>
                </div>
              )}
              {/* Info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">
                  {featured.categoryName}
                </p>
                <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug mb-3">
                  {featured.proName}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">
                    ${featured.proPrice.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onWishlist(featured.proId); }}
                      className="w-8 h-8 rounded-[5px] border border-white/20 bg-white/10 flex items-center justify-center text-white hover:text-rose-400 hover:border-rose-400/40 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(featured.proId); }}
                      disabled={adding === featured.proId}
                      className={cn(
                        "h-8 px-3 rounded-[5px] border flex items-center gap-1.5 text-xs font-semibold transition-colors",
                        adding === featured.proId
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-white/20 bg-white/10 text-white hover:bg-blue-600 hover:border-blue-500"
                      )}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {adding === featured.proId ? "Adding…" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
              {/* Quick view hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-2 rounded-[5px] bg-white/10 border border-white/20 backdrop-blur-sm">
                  <Eye className="w-4 h-4 text-white" />
                  <span className="text-xs text-white font-semibold">Quick View</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Side cards ─────────────────────────────── */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {side.map((product, i) => (
              <motion.div
                key={product.proId}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="group flex gap-3 rounded-[5px] border border-border/40 bg-white dark:bg-slate-900 p-3 hover:border-blue-300/60 dark:hover:border-blue-500/40 transition-colors"
              >
                <div className="relative w-20 h-20 rounded-[5px] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                  {product.thumbnailImageUrl || product.imageUrl ? (
                    <Image
                      src={product.thumbnailImageUrl ?? product.imageUrl!}
                      alt={product.proName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.proId}`}>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug min-h-10">
                      {product.proName}
                    </h3>
                  </Link>
                  {product.viewCount != null && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <BarChart2 className="w-3 h-3" />
                      {product.viewCount.toLocaleString()} views
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      ${product.proPrice.toFixed(2)}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onQuickView(product)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleAdd(product.proId)}
                        disabled={adding === product.proId}
                        className={cn(
                          "w-6 h-6 flex items-center justify-center transition-colors",
                          adding === product.proId
                            ? "text-blue-600"
                            : "text-slate-400 hover:text-blue-600"
                        )}
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
