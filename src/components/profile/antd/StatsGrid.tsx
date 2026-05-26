"use client";

import { memo } from "react";
import { ShoppingBag, Heart, ShoppingCart, Star, User, Gift } from "lucide-react";

type StatsGridProps = {
  orders: number;
  wishlist: number;
  cartItems: number;
  reviews: number;
  addresses: number;
  completion: number;
  rewardPoints: number;
};

const cards = [
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "cartItems", label: "Cart Items", icon: ShoppingCart },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "addresses", label: "Addresses", icon: User },
  { key: "completion", label: "Profile %", icon: User },
  { key: "rewardPoints", label: "Reward Points", icon: Gift },
] as const;

function StatsGridComponent({
  orders,
  wishlist,
  cartItems,
  reviews,
  addresses,
  completion,
  rewardPoints,
}: StatsGridProps) {
  const values = { orders, wishlist, cartItems, reviews, addresses, completion, rewardPoints };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="border rounded-2xl bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{card.label}</span>
            </div>
            <p className="text-2xl font-bold">{values[card.key]}</p>
          </div>
        );
      })}
    </div>
  );
}

export const StatsGrid = memo(StatsGridComponent);
export default StatsGrid;
