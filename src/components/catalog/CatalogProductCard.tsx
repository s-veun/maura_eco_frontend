"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";

interface CatalogProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onAddToCart?: (id: number) => Promise<void> | void;
  onWishlist?: (id: number) => Promise<void> | void;
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(cls, i < Math.round(rating) ? "fill-[#E69F2C] text-[#E69F2C]" : "fill-slate-200 text-slate-200")}
        />
      ))}
    </div>
  );
}

export function CatalogProductCard({
  product,
  viewMode = "grid",
  onAddToCart,
  onWishlist,
}: CatalogProductCardProps) {
  const [wishlisted, setWishlisted] = useState(product.favourite ?? false);
  const [adding, setAdding] = useState(false);

  const image =
    product.imageUrl ||
    product.thumbnailImage ||
    product.thumbnailImageUrl ||
    product.imageUrls?.[0];
  const discount = Number(product.discount || 0);
  const originalPrice = Number(product.proPrice || 0);
  const salePrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
  const rating = Math.min(5, Math.max(0, Number(product.rating || 0)));

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart?.(product.proId);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = async () => {
    setWishlisted((v) => !v);
    await onWishlist?.(product.proId);
  };

  /* ── List view ── */
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex border border-slate-200 rounded-[5px] bg-white overflow-hidden hover:border-[#E69F2C]/40 transition-colors"
      >
        {/* Image */}
        <Link
          href={`/products/${product.proId}`}
          className="relative w-45 shrink-0 bg-slate-50 overflow-hidden"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.proName}
              className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-10 w-10 text-slate-300" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded-[5px] bg-[#E69F2C] px-2 py-0.5 text-[11px] font-bold text-white">
              -{discount}%
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            {product.categoryName && (
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#E69F2C]">
                {product.categoryName}
              </p>
            )}
            <Link href={`/products/${product.proId}`}>
              <h3 className="text-[15px] font-semibold text-slate-800 hover:text-[#E69F2C] transition-colors leading-snug">
                {product.proName}
              </h3>
            </Link>
            {product.proDesc && (
              <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{product.proDesc}</p>
            )}
            <div className="mt-2 flex items-center gap-1.5">
              <Stars rating={rating} />
              <span className="text-xs text-slate-400">({rating.toFixed(1)})</span>
              {product.viewCount ? (
                <span className="text-xs text-slate-400">· {product.viewCount} reviews</span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">${salePrice.toFixed(2)}</span>
              {discount > 0 && (
                <span className="text-sm text-slate-400 line-through">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlist}
                className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 transition-colors hover:border-[#E69F2C]/40"
                aria-label="Wishlist"
              >
                <Heart
                  className={cn("h-4 w-4", wishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400")}
                />
              </button>
              <button
                onClick={handleAdd}
                disabled={adding}
                className={cn(
                  "flex items-center gap-1.5 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all",
                  adding
                    ? "bg-[#c8850f] text-white"
                    : "bg-[#E69F2C] text-white hover:bg-[#c8850f]"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Grid card ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group relative flex flex-col border border-slate-200 rounded-[5px] bg-white overflow-hidden hover:border-[#E69F2C]/40 transition-colors"
    >
      {/* Image area */}
      <div className="relative bg-slate-50 overflow-hidden">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-[5px] bg-[#E69F2C] px-2 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-[5px] border border-slate-200 bg-white opacity-0 group-hover:opacity-100 transition-all hover:border-[#E69F2C]/40"
        >
          <Heart className={cn("h-3.5 w-3.5", wishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
        </button>
        <Link href={`/products/${product.proId}`} className="block h-47.5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.proName}
              className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
          )}
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {product.categoryName && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#E69F2C]">
            {product.categoryName}
          </p>
        )}
        <Link href={`/products/${product.proId}`}>
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-800 hover:text-[#E69F2C] transition-colors">
            {product.proName}
          </h3>
        </Link>
        {product.proDesc && (
          <p className="mt-1 line-clamp-1 text-[12px] text-slate-400">{product.proDesc}</p>
        )}

        <div className="mt-2 flex items-center gap-1">
          <Stars rating={rating} size="xs" />
          <span className="text-[11px] text-slate-400">({rating.toFixed(1)})</span>
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-slate-900">${salePrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-xs text-slate-400 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={adding}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-1.5 rounded-[5px] border py-2 text-[13px] font-semibold transition-all",
            adding
              ? "border-[#E69F2C] bg-[#E69F2C] text-white"
              : "border-[#E69F2C]/40 text-[#E69F2C] hover:bg-[#E69F2C] hover:text-white"
          )}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
