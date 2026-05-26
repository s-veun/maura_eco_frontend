"use client";

import { Heart, MapPin, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";

type ResponsiveHeaderProps = {
  onToggleCategoriesAction?: () => void;
};

export default function ResponsiveHeader({ onToggleCategoriesAction }: ResponsiveHeaderProps) {
  const { cartItemCount } = useCart();
  const { openDrawer } = useCartDrawer();

  return (
    <header className="sticky top-0 z-40 border-b border-[#3f2a78] bg-gradient-to-r from-[#4e3597] to-[#5d43ae] px-3 py-2.5 text-white shadow-[0_10px_25px_rgba(9,5,30,0.5)] sm:px-4">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCategoriesAction}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 md:hidden"
            aria-label="Open categories"
            type="button"
          >
            <Menu className="size-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="rounded-md bg-[#ff9f0a] px-1.5 py-1 text-sm font-extrabold text-white">S</span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold leading-none">ShopStore</p>
              <p className="truncate text-[10px] text-white/70">Delivery in 30 min</p>
            </div>
            <MapPin className="ml-1 hidden size-4 text-white/75 lg:block" />
          </div>

          <div className="hidden items-center gap-2 text-[11px] font-semibold md:flex">
            {[{ icon: User, label: "Account" }, { icon: Heart, label: "Wishlist" }].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/20"
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex h-9 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 text-[11px] font-semibold transition hover:bg-white/20"
          >
            <ShoppingCart className="size-4" />
            <span className="hidden md:inline">Cart</span>
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 justify-center rounded-full bg-[#ff5f57] px-1 text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            className="h-10 w-full rounded-xl border border-transparent bg-white pl-10 pr-20 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#5a3ea8] focus:outline-none"
            placeholder="Search products, categories, brands"
          />
          <button className="absolute right-1 top-1 h-8 rounded-lg bg-[#2e1f5f] px-3 text-xs font-semibold text-white transition hover:bg-[#25194e]">
            Search
          </button>
        </div>
      </div>
    </header>
  );
}

