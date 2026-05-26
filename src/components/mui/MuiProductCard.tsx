"use client";

import Link from "next/link";
import { Star, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MuiProduct = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  rating?: number;
  reviews?: number;
  soldCount?: number;
  discount?: number;
  shippingLabel?: string;
  badge?: string;
};

type MuiProductCardProps = {
  product: MuiProduct & {
    compact?: boolean;
    shippingLabel?: string;
    soldCount?: number;
  };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function MuiProductCard({ product }: MuiProductCardProps) {
  const { id, title, price, image, rating, reviews, soldCount, discount, shippingLabel, compact, badge } = product;

  const discountedPrice = discount ? price * (1 - discount / 100) : null;

  if (compact) {
    return (
      <Link href={`/products/${id}`} className="block group">
        <div className="border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                No image
              </div>
            )}
            {discount ? (
              <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            ) : null}
            {badge ? (
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                {badge}
              </span>
            ) : null}
          </div>
          <div className="p-2.5">
            <p className="text-[12px] font-medium line-clamp-2 text-foreground leading-snug mb-1">{title}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-primary">
                {formatPrice(discountedPrice ?? price)}
              </span>
              {discountedPrice ? (
                <span className="text-[10px] text-muted-foreground line-through">{formatPrice(price)}</span>
              ) : null}
            </div>
            {rating != null ? (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] text-muted-foreground">{rating.toFixed(1)}</span>
                {soldCount ? (
                  <span className="text-[10px] text-muted-foreground ml-1">{soldCount} sold</span>
                ) : null}
              </div>
            ) : null}
            {shippingLabel ? (
              <div className="flex items-center gap-1 mt-1">
                <Truck className="h-2.5 w-2.5 text-green-600" />
                <span className="text-[10px] text-green-700">{shippingLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${id}`} className="block group">
      <div className="border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
              No image
            </div>
          )}
          {discount ? (
            <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          ) : null}
          {badge ? (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-sm font-medium line-clamp-2 text-foreground leading-snug mb-2 flex-1">{title}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-bold text-primary">
              {formatPrice(discountedPrice ?? price)}
            </span>
            {discountedPrice ? (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(price)}</span>
            ) : null}
          </div>
          {rating != null ? (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
              {reviews ? (
                <span className="text-xs text-muted-foreground">({reviews})</span>
              ) : null}
            </div>
          ) : null}
          {shippingLabel ? (
            <div className="flex items-center gap-1 mb-2">
              <Truck className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-700">{shippingLabel}</span>
            </div>
          ) : null}
          <Button size="sm" className="w-full mt-auto" onClick={(e) => e.preventDefault()}>
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
