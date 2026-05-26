"use client";

import { Heart, Package, ShoppingCart, UserRoundCheck } from "lucide-react";

interface ProfileStatsRowProps {
  ordersCount: number;
  wishlistCount: number;
  cartItemsCount: number;
  profileCompletion: number;
}

const statCards = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "cart", label: "Cart items", icon: ShoppingCart },
  { key: "completion", label: "Profile complete", icon: UserRoundCheck },
] as const;

export default function ProfileStatsRow({
  ordersCount,
  wishlistCount,
  cartItemsCount,
  profileCompletion,
}: ProfileStatsRowProps) {
  const values = {
    orders: ordersCount,
    wishlist: wishlistCount,
    cart: cartItemsCount,
    completion: `${profileCompletion}%`,
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = values[card.key];

        return (
          <article
            key={card.key}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.07)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">{card.label}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">{value}</p>
          </article>
        );
      })}
    </section>
  );
}
