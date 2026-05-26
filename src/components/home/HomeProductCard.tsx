"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

interface HomeProductCardProps {
  product: Product;
  badge?: { label: string; className: string };
  quantity: number;
  onInc: () => void;
  onDec: () => void;
}

export default function HomeProductCard({
  product,
  badge,
  quantity,
  onInc,
  onDec,
}: HomeProductCardProps) {
  const { addToCart, getItemQuantity, isAuthenticated } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const oldPrice = product.discount
    ? product.proPrice * (1 + product.discount / 100)
    : null;
  const rating = product.rating ?? 4.6;
  const imageSrc =
    imageError || (!product.thumbnailImage && !product.imageUrl && !product.imageName)
      ? "/materials.png"
      : product.thumbnailImage || product.imageUrl || product.imageName || "/materials.png";
  const cartQuantity = getItemQuantity(product.proId);

  const handleAddToCart = async () => {
    if (isSubmitting || isOutOfStock) return;

    setIsSubmitting(true);
    try {
      await addToCart(product.proId, quantity);
      setIsAdded(true);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => setIsAdded(false), 1600);
    } catch {
      // toast is handled by useCart
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group min-w-[220px] rounded-2xl bg-white p-4 transition"
    >
      {/* Image area */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-[#F8F7FF]">
        <Link href={`/products/${product.proId}`} className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={product.proName}
            fill
            sizes="(max-width: 768px) 100vw, 220px"
            className="object-contain p-4 transition duration-400 group-hover:scale-105"
            unoptimized
            onError={() => setImageError(true)}
          />
        </Link>

        {badge ? (
          <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-white ${badge.className}`}>
            {badge.label}
          </span>
        ) : null}

        {product.discount ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#5a3ea8] px-2 py-1 text-[10px] font-bold text-white">
            -{product.discount}%
          </span>
        ) : null}

        <span
          className={`absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
            isOutOfStock ? "bg-red-50 text-red-500" : "bg-white/90 text-[#374151]"
          }`}
        >
          {isOutOfStock ? "Out of stock" : `${stock} in stock`}
        </span>

        <Link
          href={isAuthenticated ? "/profile?tab=wishlist" : "/login?redirect=/"}
          aria-label="Wishlist"
          className="absolute bottom-2.5 right-2.5 rounded-full bg-white p-1.5 text-[#9CA3AF] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
        >
          <Heart className="size-3.5" />
        </Link>
      </div>

      {/* Product info */}
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
        {product.categoryName || "General"}
      </p>
      <Link
        href={`/products/${product.proId}`}
        className="mt-1 block line-clamp-2 text-sm font-bold leading-snug text-[#111827] transition hover:text-[#5a3ea8]"
      >
        {product.proName}
      </Link>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-1">
        <Star className="size-3.5 fill-[#FACC15] text-[#FACC15]" />
        <span className="text-xs font-semibold text-[#111827]">{rating.toFixed(1)}</span>
        <span className="text-xs text-[#9CA3AF]">({(product.proId % 220) + 70})</span>
      </div>

      {/* Price */}
      <div className="mt-2 flex items-end gap-2">
        <span className="text-lg font-black text-[#111827]">${product.proPrice.toFixed(2)}</span>
        {oldPrice ? (
          <span className="text-xs text-[#9CA3AF] line-through">${oldPrice.toFixed(2)}</span>
        ) : null}
      </div>

      {/* Stock bar */}
      <div className="mt-2">
        <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-[#9CA3AF]">
          <span>Availability</span>
          {cartQuantity > 0 ? (
            <span className="text-[#5a3ea8]">{cartQuantity} in cart</span>
          ) : (
            <span>Ready to add</span>
          )}
        </div>
        <div className="h-1 rounded-full bg-[#F3F4F6]">
          <div
            className={`h-1 rounded-full transition-all ${isOutOfStock ? "bg-red-300" : "bg-[#5a3ea8]/60"}`}
            style={{ width: `${Math.min(100, Math.max(isOutOfStock ? 10 : 20, stock))}%` }}
          />
        </div>
      </div>

      {/* Quantity + CTA */}
      <div className="mt-3 flex items-center gap-2">
        <div className="inline-flex items-center rounded-full border border-[#F3F4F6] bg-[#FAFAFA]">
          <button type="button" onClick={onDec} className="px-2 py-1 text-[#6B7280] transition hover:text-[#5a3ea8]">
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-6 text-center text-xs font-semibold text-[#111827]">{quantity}</span>
          <button type="button" onClick={onInc} className="px-2 py-1 text-[#6B7280] transition hover:text-[#5a3ea8]">
            <Plus className="size-3.5" />
          </button>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToCart}
          disabled={isSubmitting || isAdded || isOutOfStock}
          className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-wide text-white transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]"
              : isAdded
              ? "bg-emerald-500"
              : "bg-[#5a3ea8] hover:bg-[#4a3190]"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isAdded ? (
            <><Check className="size-4" /> Added</>
          ) : (
            <><ShoppingCart className="size-4" /> Add to cart</>
          )}
        </motion.button>
      </div>
    </motion.article>
  );
}
