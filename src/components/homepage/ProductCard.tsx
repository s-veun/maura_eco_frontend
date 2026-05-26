"use client";

import Image from "next/image";
import { Heart, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";
import type { HomeProduct } from "@/components/homepage/home-data";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import QuantitySelector from "@/components/cart/QuantitySelector";

type ProductCardProps = {
  product: HomeProduct;
  compact?: boolean;
};

const badgeStyles = {
  sale: "bg-[#ef4444]",
  hot: "bg-[#f97316]",
  new: "bg-[#5a3ea8]",
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const badgeText = product.badge ? product.badge.toUpperCase() : null;
  const { getItemQuantity, addToCart, updateQuantity, isBusy } = useCart();
  const { openDrawer } = useCartDrawer();
  const cartQuantity = getItemQuantity(product.id);
  const discountPercent = product.oldPrice
    ? Math.max(Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100), 0)
    : 0;

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
      className="group overflow-hidden rounded-2xl border border-[#e9e8f4] bg-white p-3 shadow-[0_10px_28px_rgba(20,20,44,0.09)] transition-shadow hover:shadow-[0_22px_45px_rgba(20,20,44,0.14)]"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#f8f8fc] to-[#f3f5fa] p-2">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 52vw, (max-width: 1024px) 30vw, 220px"
            className="object-contain p-3 transition duration-300 group-hover:scale-110"
          />
        </div>
        {badgeText ? (
          <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold text-white ${badgeStyles[product.badge!]}`}>
            {discountPercent > 0 ? `${discountPercent}% OFF` : badgeText}
          </span>
        ) : null}
        <button
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-[#8e93a9] shadow-sm transition hover:text-[#5a3ea8]"
        >
          <Heart className="size-3.5" />
        </button>
      </div>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b90a8]">
        {product.stock === "Organic" ? "Organic choice" : "Marketplace pick"}
      </p>

      <p className="mt-1 line-clamp-2 min-h-10 text-[13px] font-bold leading-5 text-[#111827]">{product.title}</p>

      <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6b7280]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={`${product.id}-star-${idx}`}
            className={`size-3 ${idx < Math.round(product.rating) ? "fill-[#ffb300] text-[#ffb300]" : "text-[#d2d6e2]"}`}
          />
        ))}
        <span className="font-bold text-[#111827]">{product.rating.toFixed(1)}</span>
        <span className="text-[#8f95ab]">({product.reviews})</span>
      </div>

      <p className="mt-1 text-[11px] text-[#72788c]">{product.unit}</p>

      <div className="mt-1.5 flex items-end gap-2">
        <span className="text-[20px] font-black leading-none text-[#1b2035]">${product.price.toFixed(2)}</span>
        {product.oldPrice ? <span className="pb-0.5 text-[11px] text-[#8f95ab] line-through">${product.oldPrice.toFixed(2)}</span> : null}
        {discountPercent > 0 ? (
          <span className="rounded-full bg-[#ffe8e6] px-2 py-0.5 text-[10px] font-bold text-[#e53f34]">-{discountPercent}%</span>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-[#5f657b]">
        <span className="rounded-full bg-[#dff7df] px-2 py-0.5 font-semibold text-[#18803b]">{product.stock}</span>
        <span className="line-clamp-1">{product.delivery}</span>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
        <div className="h-full w-[72%] rounded-full bg-[#ff3b2f]" />
      </div>

      {cartQuantity > 0 ? (
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <QuantitySelector
            value={cartQuantity}
            onDecrease={() => void updateQuantity(product.id, cartQuantity - 1)}
            onIncrease={() => void updateQuantity(product.id, cartQuantity + 1)}
            disabled={isBusy}
            size="sm"
          />
          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex h-9 items-center justify-center rounded-full border border-[#5a3ea8] px-3 text-[11px] font-semibold text-[#5a3ea8] transition hover:bg-[#f1edff]"
          >
            View cart
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void addToCart(product.id, 1).then(() => openDrawer())}
          disabled={isBusy}
          className={`mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#5a3ea8] font-semibold text-white transition hover:bg-[#452f86] disabled:opacity-60 ${
            compact ? "h-8 text-[11px]" : "h-9 text-[12px]"
          }`}
        >
          <Truck className="size-3.5" />
          Add to cart
        </button>
      )}
    </motion.article>
  );
}

