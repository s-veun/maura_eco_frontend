"use client";

import { useState } from "react";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";

const PRIMARY = "#7356c2";

type Props = {
  product: Product;
  onAddToCart?: (id: number) => void | Promise<void>;
  onAddToWishlist?: (id: number) => void;
  onQuickView?: (product: Product) => void;
};

export function MarketplaceProductCard({ product, onAddToCart, onAddToWishlist, onQuickView }: Props) {
  const [hover, setHover] = useState(false);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const originalPrice = Number(product.proPrice || 0);
  const discount = Number(product.discount || 0);
  const salePrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
  const rating = Number(product.rating || 4.2);
  const imgSrc = product.imageUrl || product.thumbnailImage || product.imageUrls?.[0] || "/materials.png";
  const imgAlt = product.imageUrls?.[1];

  const handleAddToCart = async () => {
    if (!onAddToCart) return;
    setAdding(true);
    try { await onAddToCart(product.proId); }
    finally { setAdding(false); }
  };

  const handleWishlist = () => {
    setWishlisted((p) => !p);
    onAddToWishlist?.(product.proId);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative rounded-2xl bg-white overflow-hidden border border-[#f5eff8] cursor-pointer transition-all duration-200 flex flex-col"
      style={{
        boxShadow: hover ? "0 12px 36px rgba(115,86,194,0.18)" : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Badges */}
      {discount > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[11px] font-extrabold rounded-[9px] px-2.5 py-0.5 shadow-[0_2px_8px_rgba(255,77,79,0.4)]">
          -{discount}%
        </span>
      )}
      {(product as Product & { isNew?: boolean }).isNew && (
        <span className="absolute top-2.5 right-[calc(40px+8px)] z-10 bg-green-500 text-white text-[10px] font-bold rounded-[8px] px-2 py-0.5">
          NEW
        </span>
      )}

      {/* Image */}
      <div className="relative h-[220px] overflow-hidden bg-[#faf7ff]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hover && imgAlt ? imgAlt : imgSrc}
          alt={product.proName}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hover ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/materials.png"; }}
        />
        {/* Hover overlay */}
        <div className={cn("absolute inset-0 bg-black/30 flex items-center justify-center gap-2 transition-opacity duration-200", hover ? "opacity-100" : "opacity-0")}>
          <button
            onClick={() => onQuickView?.(product)}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-purple-50 transition-colors"
          >
            <Eye className="h-4 w-4" style={{ color: PRIMARY }} />
          </button>
          <button
            onClick={handleWishlist}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-pink-50 transition-colors"
          >
            <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-pink-500 text-pink-500" : "text-gray-500")} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        {(product as Product & { brandName?: string }).brandName && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-purple-100">
              <span className="text-[9px] font-bold text-purple-700">{(product as Product & { brandName?: string }).brandName!.slice(0, 2).toUpperCase()}</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">{(product as Product & { brandName?: string }).brandName}</span>
          </div>
        )}
        <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-[17px] m-0">{product.proName}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={cn("h-3 w-3", star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          ))}
          <span className="text-[11px] text-muted-foreground ml-1">({rating.toFixed(1)})</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-base font-bold" style={{ color: PRIMARY }}>${salePrice.toFixed(2)}</span>
          {discount > 0 && <span className="text-[11.5px] text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>}
        </div>
        <Button
          size="sm"
          className="w-full h-[36px] text-[12.5px] font-semibold rounded-xl mt-0.5"
          style={{ background: PRIMARY, border: "none" }}
          disabled={adding || product.available === false}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          {adding ? "Adding..." : product.available === false ? "Out of stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

export default MarketplaceProductCard;
