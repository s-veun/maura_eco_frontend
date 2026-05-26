"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";
import { getDiscountedPrice, getProductImages } from "@/utils/product";
import ProductReviewsSection from "@/components/reviews/ProductReviewsSection";

type ProductModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (productId: number) => Promise<void>;
  onToggleWishlist: (productId: number) => Promise<void>;
};

type TabKey = "description" | "spec" | "reviews";

export function ProductModal({ product, open, onClose, onAddToCart, onToggleWishlist }: ProductModalProps) {
  const [tab, setTab] = useState<TabKey>("description");
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) {
    return <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}><DialogContent /></Dialog>;
  }

  const images = getProductImages(product);
  const discountedPrice = getDiscountedPrice(product);
  const discount = Number(product.discount || 0);
  const stock = Number(product.stock || 0);
  const rating = Number(product.rating || 0);

  const TABS: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "spec", label: "Details" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-[920px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product.proName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Image carousel */}
          <div className="h-[340px] rounded-[14px] overflow-hidden bg-[#f4f3ff] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[imgIdx] || ""}
              alt={product.proName}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={cn("h-2 rounded-full transition-all", i === imgIdx ? "w-5 bg-purple-600" : "w-2 bg-white/60")} />
                ))}
              </div>
            )}
          </div>

          {/* Tags & price */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5">{product.categoryName || "Category"}</span>
            <span className={cn("inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5", stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
              {stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-bold text-purple-700">${discountedPrice.toFixed(2)}</span>
            {discount > 0 && <span className="text-sm text-muted-foreground line-through">${Number(product.proPrice || 0).toFixed(2)}</span>}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn("h-3.5 w-3.5", star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b flex gap-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors", tab === t.key ? "border-purple-600 text-purple-700" : "border-transparent text-muted-foreground hover:text-foreground")}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="min-h-[100px]">
            {tab === "description" && (
              <p className="text-sm text-muted-foreground">{product.proDesc || "No description available."}</p>
            )}
            {tab === "spec" && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["Brand", product.proBrand || "TableEco"],
                  ["SKU", product.sku || "-"],
                  ["Category", product.categoryName || "-"],
                  ["Created", product.createdAt || "-"],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-2 border-b border-muted pb-1.5">
                    <span className="text-muted-foreground min-w-[80px]">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "reviews" && (
              <ProductReviewsSection productId={product.proId} productName={product.proName} compact />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void onAddToCart(product.proId)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to cart
            </Button>
            <Button variant="outline" onClick={() => void onToggleWishlist(product.proId)}>
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductModal;
