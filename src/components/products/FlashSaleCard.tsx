"use client";

import { Eye, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";

type FlashSaleCardProps = {
  product: Product;
  onAddToCart: (id: number) => Promise<void>;
  onQuickView: (product: Product) => void;
  onWishlist: (id: number) => Promise<void>;
};

export function FlashSaleCard({ product, onAddToCart, onQuickView, onWishlist }: FlashSaleCardProps) {
  const stock = Math.max(0, Number(product.stock || 0));
  const sold = Math.max(1, Number(product.purchaseCount || 1));
  const progress = Math.min(95, Math.round((sold / (stock + sold)) * 100));
  const originalPrice = Number(product.proPrice || 0);
  const discount = Number(product.discount || 0);
  const salePrice = originalPrice * (1 - discount / 100);

  return (
    <div className="relative rounded-2xl border border-[#f5eff8] bg-white overflow-hidden shadow-sm hover:shadow-[0_8px_24px_rgba(115,86,194,0.14)] transition-shadow">
      {/* Ribbon */}
      {discount > 0 && (
        <div className="absolute top-3 right-0 z-10 bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-l-[8px] shadow">
          {discount}% OFF
        </div>
      )}

      {/* Image */}
      <div className="h-[180px] overflow-hidden bg-[#f7f4ff]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || product.thumbnailImage || "/materials.png"}
          alt={product.proName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-gray-800 line-clamp-1 flex-1">{product.proName}</span>
          <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 text-[10.5px] font-bold px-2 py-0.5 flex-shrink-0">Flash</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-purple-700">${salePrice.toFixed(2)}</span>
          {discount > 0 && <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>}
        </div>
        {/* Progress bar */}
        <div>
          <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{sold} sold · {stock} left</p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50" onClick={() => void onAddToCart(product.proId)}>
            <ShoppingCart className="h-3.5 w-3.5 text-purple-700" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-pink-50" onClick={() => void onWishlist(product.proId)}>
            <Heart className="h-3.5 w-3.5 text-pink-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50" onClick={() => onQuickView(product)}>
            <Eye className="h-3.5 w-3.5 text-blue-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FlashSaleCard;
