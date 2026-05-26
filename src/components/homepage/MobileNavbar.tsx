"use client";

import { Grid2X2, Heart, Home, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";

type MobileNavbarProps = {
  onToggleCategoriesAction?: () => void;
};

export default function MobileNavbar({ onToggleCategoriesAction }: MobileNavbarProps) {
  const { cartItemCount } = useCart();
  const { openDrawer } = useCartDrawer();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-[#ddd6f7] bg-white/95 p-2 shadow-[0_16px_35px_rgba(27,21,53,0.22)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5 items-center text-[#5f6784]">
        <li className="flex justify-center">
          <button className="inline-flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold text-[#5a3ea8]">
            <Home className="size-4" />
            Home
          </button>
        </li>
        <li className="flex justify-center">
          <button
            type="button"
            onClick={onToggleCategoriesAction}
            className="inline-flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold"
          >
            <Grid2X2 className="size-4" />
            Categories
          </button>
        </li>
        <li className="flex justify-center">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#5a3ea8] text-white shadow-[0_8px_18px_rgba(90,62,168,0.45)]">
            <Search className="size-4" />
          </button>
        </li>
        <li className="flex justify-center">
          <button className="inline-flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold">
            <Heart className="size-4" />
            Wishlist
          </button>
        </li>
        <li className="flex justify-center">
          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold"
          >
            <ShoppingCart className="size-4" />
            Cart
            <span className="absolute right-0.5 top-0 rounded-full bg-[#ff5f57] px-1 text-[9px] font-bold text-white">
              {cartItemCount}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

