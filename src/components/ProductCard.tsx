"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Loader2, Plus, Heart, Star } from "lucide-react";
import { Product } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const fallbackImage = "https://placehold.co/600x600/f5f3ff/9ca3af?text=Product";
  const { addToCart, isAdding, isAuthenticated } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.imageUrl || fallbackImage);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      await addToCart(product.proId, 1);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch {
      // error toast shown by useCart
    }
  };

  const discountPercent = product.discount || 0;
  const originalPrice = product.proPrice;
  const salePrice = originalPrice - (originalPrice * discountPercent) / 100;

  return (
    <Link
      href={`/products/${product.proId}`}
      className="group flex h-full flex-col rounded-2xl bg-white p-4 transition-transform duration-200 hover:scale-[1.01]"
    >
      {/* Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-[#F8F7FF]">
        <Image
          src={imageSrc}
          alt={product.proName}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
          onError={() => setImageSrc(fallbackImage)}
        />
        {/* Wishlist button */}
        <button
          className="absolute right-2.5 top-2.5 rounded-full bg-white p-1.5 text-[#9CA3AF] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="size-4" />
        </button>

        {discountPercent > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#5a3ea8] px-2.5 py-1 text-[10px] font-semibold text-white">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          {product.categoryName || "General"}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[#111827] transition group-hover:text-[#5a3ea8]">
          {product.proName}
        </h3>

        {/* Stars */}
        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`size-3.5 ${
                index < (product.rating ?? 0)
                  ? "fill-[#FACC15] text-[#FACC15]"
                  : "fill-[#E5E7EB] text-[#E5E7EB]"
              }`}
            />
          ))}
          <span className="ml-1 text-[11px] text-[#9CA3AF]">({product.viewCount ?? 0})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-bold tracking-tight text-[#111827]">
            ${salePrice.toFixed(2)}
          </span>
          {discountPercent > 0 && (
            <span className="text-sm text-[#9CA3AF] line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isSuccess}
          className={`mt-4 h-10 rounded-full text-sm font-semibold shadow-none transition-colors ${
            isSuccess
              ? "bg-emerald-500 text-white hover:bg-emerald-500"
              : "bg-[#5a3ea8] text-white hover:bg-[#4a3190]"
          }`}
        >
          {isAdding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSuccess ? (
            <><Check className="size-4" /> Added</>
          ) : (
            <><Plus className="size-4" /> Add to cart</>
          )}
        </Button>
      </div>
    </Link>
  );
}
