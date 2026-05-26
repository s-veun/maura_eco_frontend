"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, Heart, Eye, Star, Flame, Package,
  BarChart2, TrendingUp, Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ── Shared card prop type ──────────────────────────────────────────── */
interface CardProps {
  product: Product;
  onAddToCart: (id: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
  onQuickView: (p: Product) => void;
}

/* ── TAB 1 TRENDING: Square card with hover overlay ────────────────── */
function TrendingCard({ product, onAddToCart, onWishlist, onQuickView }: CardProps) {
  const [adding, setAdding] = useState(false);
  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-[5px] bg-white dark:bg-slate-900"
    >
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.proName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-slate-900/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[5px] transition-colors",
              adding
                ? "bg-violet-600 text-white"
                : "bg-white/10 text-white hover:bg-violet-600"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={() => onWishlist(product.proId)}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-white/10 text-white transition-colors hover:text-rose-400"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        {product.popularityScore != null && product.popularityScore > 50 && (
          <Badge className="absolute top-2 left-2 rounded-[5px] border-0 bg-orange-500 px-1.5 py-0.5 text-[10px] text-white hover:bg-orange-500">
            <Flame className="w-2.5 h-2.5 inline mr-0.5" />HOT
          </Badge>
        )}
      </div>
      <div className="p-3">
        <p className="text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wide truncate">
          {product.categoryName}
        </p>
        <Link href={`/products/${product.proId}`}>
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 mt-0.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors min-h-8 leading-snug">
            {product.proName}
          </h3>
        </Link>
        <p className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
          ${product.proPrice.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}

/* ── TAB 2 TOP RATED: Rating-badge card ─────────────────────────────── */
function TopRatedCard({ product, onAddToCart, onWishlist, onQuickView }: CardProps) {
  const [adding, setAdding] = useState(false);
  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };
  const rating = product.rating ?? 4.5;

  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }} className="group overflow-hidden rounded-[5px] bg-white dark:bg-slate-900">
      <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
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
        {/* Rating badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-[5px] bg-amber-400 text-slate-900 text-xs font-black">
          <Star className="w-3 h-3 fill-slate-900" />
          {rating.toFixed(1)}
        </div>
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-[5px] bg-white/90 opacity-0 text-slate-500 transition-opacity hover:text-amber-600 group-hover:opacity-100 dark:bg-slate-900/90"
        >
          <Eye className="w-3 h-3" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
          {product.categoryName}
        </p>
        <Link href={`/products/${product.proId}`}>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mt-1 mb-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors min-h-10 leading-snug">
            {product.proName}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < Math.floor(rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700"
              )}
            />
          ))}
          <span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white">${product.proPrice.toFixed(2)}</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onWishlist(product.proId)}
              className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-slate-100 text-slate-400 transition-colors hover:text-rose-500 dark:bg-slate-800"
            >
              <Heart className="w-3 h-3" />
            </button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={adding}
              variant="ghost"
              className={cn(
                "rounded-[5px] h-7 px-2.5 text-xs",
                adding
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white dark:bg-amber-500/10 dark:text-amber-400"
              )}
            >
              <ShoppingCart className="w-3 h-3" />
              {adding ? "…" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── TAB 3 MOST VIEWED: Numbered ranked list ────────────────────────── */
function MostViewedListCard({
  product,
  rank,
  onAddToCart,
  onQuickView,
}: CardProps & { rank: number }) {
  const [adding, setAdding] = useState(false);
  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.18 }} className="group flex items-center gap-4 rounded-[5px] bg-white p-3 transition-transform duration-200 dark:bg-slate-900">
      <span className="text-2xl font-black text-slate-200 dark:text-slate-700 w-8 text-center shrink-0 select-none tabular-nums">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="w-14 h-14 rounded-[5px] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.proName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-4 h-4 text-slate-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.proId}`}>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {product.proName}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-0.5">
          <BarChart2 className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-400">
            {(product.viewCount ?? 0).toLocaleString()} views
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-bold text-sm text-slate-900 dark:text-white">
          ${product.proPrice.toFixed(2)}
        </span>
        <button
          onClick={() => onQuickView(product)}
          className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-slate-100 text-slate-400 transition-colors hover:text-blue-600 dark:bg-slate-800"
        >
          <Eye className="w-3 h-3" />
        </button>
        <button
          onClick={handleAdd}
          disabled={adding}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors",
            adding
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white dark:bg-slate-800"
          )}
        >
          <ShoppingCart className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

/* ── TAB 4 NEW ARRIVALS: Date-tagged compact cards ──────────────────── */
function NewArrivalTabCard({ product, onAddToCart, onWishlist, onQuickView }: CardProps) {
  const [adding, setAdding] = useState(false);
  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };

  const dateStr = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-AU", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.2 }} className="group flex gap-3 rounded-[5px] bg-white p-3 transition-transform duration-200 dark:bg-slate-900">
      <div className="relative w-20 h-20 rounded-[5px] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.proName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-slate-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {dateStr && (
          <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wide flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {dateStr}
          </p>
        )}
        <Link href={`/products/${product.proId}`}>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mt-0.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors leading-snug">
            {product.proName}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 mt-0.5">{product.categoryName}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            ${product.proPrice.toFixed(2)}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onQuickView(product)}
              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-violet-600 transition-colors"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={() => onWishlist(product.proId)}
              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Heart className="w-3 h-3" />
            </button>
            <button
              onClick={handleAdd}
              disabled={adding}
              className={cn(
                "w-6 h-6 flex items-center justify-center transition-colors",
                adding ? "text-violet-600" : "text-slate-400 hover:text-violet-600"
              )}
            >
              <ShoppingCart className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Skeleton helpers ───────────────────────────────────────────────── */
function GridSkeleton({ cols = 4, count = 8 }: { cols?: number; count?: number }) {
  const responsiveCols =
    cols === 3 ? "sm:grid-cols-3" :
    cols === 4 ? "sm:grid-cols-4" :
    "sm:grid-cols-2";

  return (
    <div className={cn("grid grid-cols-2 gap-4", responsiveCols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[5px] bg-slate-100/70 dark:bg-slate-900/70">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-[5px] bg-slate-100/70 p-3 dark:bg-slate-900/70">
          <Skeleton className="w-8 h-6 shrink-0" />
          <Skeleton className="w-14 h-14 shrink-0 rounded-[5px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="w-16 h-7" />
        </div>
      ))}
    </div>
  );
}

function CompactSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-[5px] bg-slate-100/70 p-3 dark:bg-slate-900/70">
          <Skeleton className="w-20 h-20 rounded-[5px] shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
interface ProductTabsSectionProps {
  trending: Product[];
  topRated: Product[];
  mostViewed: Product[];
  newArrivals: Product[];
  isLoading: boolean;
  onAddToCart: (id: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
  onQuickView: (product: Product) => void;
}

export function ProductTabsSection({
  trending,
  topRated,
  mostViewed,
  newArrivals,
  isLoading,
  onAddToCart,
  onWishlist,
  onQuickView,
}: ProductTabsSectionProps) {
  return (
    <section id="product-tabs" className="bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.38 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
        >
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-1.5">
              Explore
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Discover our collections
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Browse by what matters most to you.
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="trending">
          <TabsList className="h-auto flex-wrap gap-0.5 rounded-[5px] bg-white p-1 dark:bg-slate-900">
            <TabsTrigger
              value="trending"
              className="h-auto rounded-[5px] px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Flame className="w-3 h-3 mr-1.5" />Trending
            </TabsTrigger>
            <TabsTrigger
              value="top-rated"
              className="h-auto rounded-[5px] px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Star className="w-3 h-3 mr-1.5" />Top Rated
            </TabsTrigger>
            <TabsTrigger
              value="most-viewed"
              className="h-auto rounded-[5px] px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <BarChart2 className="w-3 h-3 mr-1.5" />Most Viewed
            </TabsTrigger>
            <TabsTrigger
              value="new-arrivals"
              className="h-auto rounded-[5px] px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <TrendingUp className="w-3 h-3 mr-1.5" />New Arrivals
            </TabsTrigger>
          </TabsList>

          {/* ── Trending ──────────────────────────────────── */}
          <TabsContent value="trending" className="mt-5">
            {isLoading ? (
              <GridSkeleton cols={4} count={8} />
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {trending.slice(0, 8).map((p) => (
                  console.log("Rendering TrendingCard for:", trending),
                  <TrendingCard
                    key={p.proId}
                    product={p}
                    onAddToCart={onAddToCart}
                    onWishlist={onWishlist}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Top Rated ─────────────────────────────────── */}
          <TabsContent value="top-rated" className="mt-5">
            {isLoading ? (
              <GridSkeleton cols={3} count={6} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topRated.slice(0, 6).map((p) => (
                  <TopRatedCard
                    key={p.proId}
                    product={p}
                    onAddToCart={onAddToCart}
                    onWishlist={onWishlist}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Most Viewed ───────────────────────────────── */}
          <TabsContent value="most-viewed" className="mt-5">
            {isLoading ? (
              <ListSkeleton count={8} />
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {mostViewed.slice(0, 8).map((p, i) => (
                  <MostViewedListCard
                    key={p.proId}
                    product={p}
                    rank={i + 1}
                    onAddToCart={onAddToCart}
                    onWishlist={onWishlist}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── New Arrivals ──────────────────────────────── */}
          <TabsContent value="new-arrivals" className="mt-5">
            {isLoading ? (
              <CompactSkeleton count={6} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {newArrivals.slice(0, 8).map((p) => (
                  <NewArrivalTabCard
                    key={p.proId}
                    product={p}
                    onAddToCart={onAddToCart}
                    onWishlist={onWishlist}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-2">
          <Button
            asChild
            variant="outline"
            className="rounded-[5px] border-0 bg-white text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
          >
            <Link href="/products">View full catalog →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
