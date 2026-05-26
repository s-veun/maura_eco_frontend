"use client";

import { memo, useMemo, useState } from "react";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";
import { getDiscountedPrice, getProductImages, getReviewCount } from "@/utils/product";

type ProductCardProps = {
  product: Product;
  wished: boolean;
  onAddToCart: (productId: number) => Promise<void>;
  onToggleWishlist: (productId: number) => Promise<void>;
  onQuickView: (product: Product) => void;
};

function ProductCardComponent({ product, wished, onAddToCart, onToggleWishlist, onQuickView }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const images = useMemo(() => getProductImages(product), [product]);
  const primary = images[0] || "";
  const secondary = images[1] || primary;
  const price = Number(product.proPrice || 0);
  const discounted = getDiscountedPrice(product);
  const discount = Number(product.discount || 0);
  const stock = Number(product.stock || 0);
  const rating = Number(product.rating || 0);
  const reviewCount = getReviewCount(product);

  return (
    <div
      className="relative rounded-[14px] bg-white border border-[#f5eff8] overflow-hidden h-full flex flex-col transition-all duration-200"
      style={{ boxShadow: hovered ? "0 10px 30px rgba(115,86,194,0.14)" : "0 2px 10px rgba(0,0,0,0.05)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ribbon */}
      <div className="absolute top-3 right-0 z-10">
        <span className={cn("px-2.5 py-0.5 text-[11px] font-extrabold text-white rounded-l-[8px] shadow", discount > 0 ? "bg-red-500" : "bg-purple-600")}>
          {discount > 0 ? `${discount}% OFF` : "Featured"}
        </span>
      </div>

      {/* Image */}
      <div className="h-[210px] relative overflow-hidden bg-[#f5f4ff]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hovered ? secondary : primary}
          alt={product.proName}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        {/* Hover overlay */}
        <div className={cn("absolute inset-0 bg-gray-900/22 flex items-center justify-center gap-2 transition-opacity duration-200", hovered ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <button
            title="Quick view"
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-purple-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </button>
          <button
            title={wished ? "Remove wishlist" : "Add wishlist"}
            onClick={() => void onToggleWishlist(product.proId)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-pink-50 transition-colors"
          >
            <Heart className={cn("h-4 w-4 transition-colors", wished ? "fill-red-500 text-red-500" : "text-gray-500")} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 text-[10.5px] font-medium px-2 py-0.5">{product.categoryName || "Category"}</span>
          <span className={cn("inline-flex items-center rounded-full text-[10.5px] font-medium px-2 py-0.5", stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            {stock > 0 ? "In stock" : "Out"}
          </span>
        </div>

        <p className="text-[15px] font-semibold text-gray-800 m-0 line-clamp-1">{product.proName}</p>

        <div className="flex items-baseline gap-2">
          <span className="font-bold text-purple-700">${discounted.toFixed(2)}</span>
          {discount > 0 && <span className="text-xs text-muted-foreground line-through">${price.toFixed(2)}</span>}
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={cn("h-3 w-3", star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          ))}
          <span className="text-[11px] text-muted-foreground ml-1">({reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[9px] font-bold text-purple-700">
              {(product.proBrand || "TE").slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[11.5px] text-muted-foreground">{product.proBrand || "TableEco"}</span>
          </div>
          <Button
            size="sm"
            className="h-7 px-2.5 text-[11.5px] font-semibold rounded-[9px]"
            style={{ background: "#7356c2", border: "none" }}
            onClick={() => void onAddToCart(product.proId)}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
export default ProductCard;
