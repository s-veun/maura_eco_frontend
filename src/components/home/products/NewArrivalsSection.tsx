"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Heart,
  Package,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.38 },
};

const OFFER_TIMERS = ["10 : 12 : 05", "09 : 48 : 17", "08 : 24 : 42", "07 : 12 : 05"];

interface Props {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (id: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
  onQuickView: (product: Product) => void;
}

function getRating(product: Product) {
  return Math.max(1, Math.min(5, Math.round(product.rating ?? 4)));
}

function getDiscountPercent(product: Product, index: number) {
  if (product.discount && product.discount > 0) {
    return Math.round(product.discount);
  }

  return [75, 31, 17, 41, 45][index % 5];
}

function getOriginalPrice(product: Product, discountPercent: number) {
  const multiplier = 1 - discountPercent / 100;
  if (multiplier <= 0) return product.proPrice;
  return Number((product.proPrice / multiplier).toFixed(2));
}

function getStockLevel(product: Product, index: number) {
  return product.stock && product.stock > 0 ? product.stock : 38 + index * 4;
}

function getProgressValue(stock: number) {
  return Math.max(18, Math.min(82, Math.round((stock / 80) * 100)));
}

function ProductStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            cls,
            i < rating
              ? "fill-[#E49917] text-[#E49917]"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          )}
        />
      ))}
    </div>
  );
}

function SmallArrivalCard({
  product,
  index,
  onAddToCart,
  onWishlist,
}: {
  product: Product;
  index: number;
  onAddToCart: (id: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
}) {
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const rating = getRating(product);
  const discountPercent = getDiscountPercent(product, index);
  const originalPrice = getOriginalPrice(product, discountPercent);

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.div {...fadeUp} whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <Card className="group overflow-hidden rounded-xl border-0 bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md dark:bg-slate-950 dark:ring-white/8">
        <div className="flex">
          {/* Image column */}
          <div className="relative w-[110px] shrink-0 bg-slate-50 dark:bg-slate-900/60">
            <Badge className="absolute left-1.5 top-1.5 z-10 rounded-full border-0 bg-red-500 px-1.5 py-0 text-[10px] font-bold leading-5 text-white hover:bg-red-500">
              -{discountPercent}%
            </Badge>
            <Link
              href={`/products/${product.proId}`}
              className="flex h-[110px] items-center justify-center p-2"
            >
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.proName}
                  className="h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Package className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              )}
            </Link>
          </div>

          {/* Content column */}
          <div className="flex flex-1 flex-col justify-between px-3 py-2.5">
            <div className="flex items-start justify-between gap-1">
              <Link href={`/products/${product.proId}`}>
                <h3 className="line-clamp-2 text-[13px] font-semibold leading-tight text-slate-800 transition-colors hover:text-[#E49917] dark:text-white dark:hover:text-[#E49917]">
                  {product.proName}
                </h3>
              </Link>
              <button
                type="button"
                onClick={() => { setWishlisted((p) => !p); onWishlist(product.proId); }}
                className="shrink-0 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={cn("h-4 w-4", wishlisted ? "fill-rose-500 text-rose-500" : "text-slate-300 hover:text-rose-400")} />
              </button>
            </div>

            <div className="mt-1 flex items-center gap-1">
              <ProductStars rating={rating} size="xs" />
              <span className="text-[11px] text-slate-400">({rating})</span>
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-red-500">${product.proPrice.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through dark:text-slate-500">${originalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleAdd}
                disabled={adding}
                aria-label="Add to cart"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
                  adding
                    ? "border-[#E49917] bg-[#E49917] text-white"
                    : "border-[#E49917] text-[#E49917] hover:bg-[#E49917] hover:text-white"
                )}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="h-3 w-3 text-[#E49917]" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {OFFER_TIMERS[index % OFFER_TIMERS.length]}
              </span>
              <span>left</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function FeaturedArrivalCard({
  product,
  onAddToCart,
  onWishlist,
}: {
  product: Product;
  onAddToCart: (id: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
}) {
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const rating = getRating(product);
  const discountPercent = getDiscountPercent(product, 1);
  const originalPrice = getOriginalPrice(product, discountPercent);
  const stock = getStockLevel(product, 1);
  const progress = getProgressValue(stock);

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.div {...fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <div className="relative h-full overflow-hidden rounded-2xl bg-white shadow-lg ring-2 ring-[#E49917]/40 dark:bg-slate-950 dark:ring-[#E49917]/30">
        {/* Amber top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#E49917]/40 via-[#E49917] to-[#E49917]/40" />

        {/* Featured label */}
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-b-xl bg-[#E49917] px-4 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow">
            <Zap className="h-2.5 w-2.5" />
            Featured
          </span>
        </div>

        <div className="relative px-6 pt-8">
          <Badge className="absolute left-6 top-10 rounded-full border-0 bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white hover:bg-red-500">
            -{discountPercent}%
          </Badge>
          <button
            type="button"
            onClick={() => { setWishlisted((p) => !p); onWishlist(product.proId); }}
            className="absolute right-6 top-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition-all hover:scale-110 dark:bg-slate-800"
            aria-label="Wishlist"
          >
            <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
          </button>

          <Link
            href={`/products/${product.proId}`}
            className="flex h-[220px] items-center justify-center"
          >
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.proName}
                className="h-full w-auto max-w-full object-contain transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
                <Package className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              </div>
            )}
          </Link>
        </div>

        <div className="px-6 pb-5 pt-2">
          <div className="flex items-center gap-1.5">
            <ProductStars rating={rating} />
            <span className="text-xs text-slate-400">({rating})</span>
          </div>

          <Link href={`/products/${product.proId}`}>
            <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-slate-800 transition-colors hover:text-[#E49917] dark:text-white dark:hover:text-[#E49917]">
              {product.proName}
            </h3>
          </Link>

          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl font-bold leading-none text-red-500">${product.proPrice.toFixed(2)}</span>
            <span className="text-sm text-slate-400 line-through dark:text-slate-500">${originalPrice.toFixed(2)}</span>
            <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500 dark:bg-red-500/10">
              -{discountPercent}%
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {product.proDesc?.trim() || "Premium build quality and standout value for everyday use."}
          </p>

          {/* Stock */}
          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-900/60">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-slate-500">
                <Zap className="h-3 w-3 text-[#E49917]" />
                Selling fast!
              </span>
              <span className="text-[#E49917]">Only {stock} left</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-[#E49917] to-[#f0b84a]"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={adding}
            className={cn(
              "mt-4 h-11 w-full rounded-xl text-sm font-bold text-white shadow transition-all active:scale-[0.98]",
              "bg-[#E49917] hover:bg-[#c8850f]",
              adding && "bg-[#c8850f]"
            )}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {adding ? "Adding to Cart..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function NewArrivalsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(300px,1.1fr)_1fr]">
      <div className="grid content-start gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-950">
            <Skeleton className="h-[110px] w-[110px] shrink-0 rounded-none" />
            <div className="flex flex-1 flex-col justify-between p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-2 ring-[#E49917]/30 dark:bg-slate-950">
        <Skeleton className="h-[220px] w-full rounded-none" />
        <div className="space-y-3 p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
      <div className="grid content-start gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-950">
            <Skeleton className="h-[110px] w-[110px] shrink-0 rounded-none" />
            <div className="flex flex-1 flex-col justify-between p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewArrivalsSection({
  products,
  isLoading,
  onAddToCart,
  onWishlist,
}: Props) {
  const items = products.slice(0, 5);
  const featuredIndex = items.length > 1 ? 1 : 0;
  const featured = items[featuredIndex];
  const sideItems = items.filter((_, index) => index !== featuredIndex);
  const leftItems = sideItems.slice(0, 2);
  const rightItems = sideItems.slice(2, 4);

  return (
    <section id="new-arrivals" className="mx-auto max-w-[1250px] px-4 py-14 md:px-6">
      <motion.div {...fadeUp} className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E49917]/10">
              <Sparkles className="h-3.5 w-3.5 text-[#E49917]" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E49917]">
              New Arrivals
            </p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Just Landed
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fresh styles added this week — shop before they sell out.
          </p>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-[#E49917] hover:text-[#c8850f]"
        >
          View all
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </motion.div>

      {isLoading ? (
        <NewArrivalsSkeleton />
      ) : !featured ? (
        <div className="rounded-[5px] bg-slate-100 p-10 text-center text-sm text-slate-400 dark:bg-slate-900/50">
          No new arrivals right now. Check back soon.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(300px,1.1fr)_1fr]">
          <div className="grid content-start gap-4">
            {leftItems.map((product, index) => (
              <SmallArrivalCard
                key={product.proId}
                product={product}
                index={index}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
              />
            ))}
          </div>

          <FeaturedArrivalCard
            product={featured}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
          />

          <div className="grid content-start gap-4">
            {rightItems.map((product, index) => (
              <SmallArrivalCard
                key={product.proId}
                product={product}
                index={index + 2}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
