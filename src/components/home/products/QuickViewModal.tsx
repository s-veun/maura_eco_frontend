"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Package, ArrowRight, Plus, Minus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (id: number, qty: number) => Promise<void> | void;
  onWishlist: (id: number) => Promise<void> | void;
}

export function QuickViewModal({
  product,
  open,
  onClose,
  onAddToCart,
  onWishlist,
}: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const rating = product.rating ?? 4;
  const discountedPrice =
    product.discount && product.discount > 0
      ? product.proPrice * (1 - product.discount / 100)
      : product.proPrice;

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId, qty);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl rounded-[5px] border-0 p-0 gap-0 overflow-hidden shadow-none sm:rounded-[5px] [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">{product.proName} — Quick View</DialogTitle>

        <div className="grid md:grid-cols-2 min-h-80">
          {/* ── Image panel ─────────────────────────────── */}
          <div className="relative bg-slate-100 dark:bg-slate-800">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.proName}
                className="w-full h-full object-cover min-h-64 md:min-h-full"
              />
            ) : (
              <div className="w-full h-full min-h-64 flex items-center justify-center">
                <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
              </div>
            )}
            {product.discount != null && product.discount > 0 && (
              <Badge className="absolute top-3 left-3 rounded-[5px] border-0 bg-rose-500 font-bold text-white hover:bg-rose-500">
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* ── Info panel ──────────────────────────────── */}
          <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-[5px] bg-white text-slate-400 transition-colors hover:text-slate-700 dark:bg-slate-900 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div>
              {product.categoryName && (
                <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-1">
                  {product.categoryName}
                </p>
              )}
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {product.proName}
              </h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < Math.round(rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {rating.toFixed(1)} rating
              </span>
            </div>

            <Separator className="bg-border/40" />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount != null && product.discount > 0 && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.proPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.proDesc && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {product.proDesc}
              </p>
            )}

            {/* Qty selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
                Qty:
              </span>
              <div className="flex items-center overflow-hidden rounded-[5px] bg-slate-100 dark:bg-slate-800">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <Button
                onClick={handleAdd}
                disabled={adding}
                className="flex-1 rounded-[5px] bg-violet-600 hover:bg-violet-500 text-white font-semibold h-10"
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? "Adding…" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onWishlist(product.proId)}
                className="h-10 w-10 rounded-[5px] border-0 bg-slate-100 transition-colors hover:text-rose-500 dark:bg-slate-800"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <Link
              href={`/products/${product.proId}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium transition-colors"
            >
              View full product page <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
