"use client";

import Link from "next/link";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCartQuery } from "@/redux/api/productApi";
import { useAuth } from "@/auth/AuthProvider";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import UserDropdown from "@/components/ui/UserDropdown";

export default function HeaderActions() {
  const { user, isAuthenticated } = useAuth();
  const { openDrawer } = useCartDrawer();
  const { data: cart } = useGetCartQuery(user?.id ?? skipToken);

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const cartTotal = cart?.totalPrice ?? 0;

  return (
    <div className="flex items-center gap-1.5">
      {/* Wishlist */}
      <Link
        href={isAuthenticated ? "/profile/wishlist" : "/login"}
        className="group flex h-10 w-10 items-center justify-center rounded-xl text-[#253D4E] transition-all hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
        aria-label="Wishlist"
      >
        <Heart size={19} className="transition-transform group-hover:scale-110" />
      </Link>

      {/* Cart button */}
      <button
        type="button"
        onClick={openDrawer}
        className="group relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[#253D4E] transition-all hover:border-[#3BB77E]/40 hover:bg-[#DEF9EC] hover:shadow-sm"
        aria-label="Open cart"
      >
        <div className="relative">
          <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />
          <AnimatePresence>
            {cartItemCount > 0 && (
              <motion.span
                key={cartItemCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#3BB77E] text-[9px] font-bold text-white shadow-sm"
              >
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden flex-col items-start sm:flex">
          <span className="text-[10px] font-medium leading-none text-[#ADADAD]">Cart</span>
          <span className="text-xs font-bold leading-tight text-[#253D4E]">
            {cartItemCount === 0 ? "Empty" : `$${cartTotal.toFixed(2)}`}
          </span>
        </div>
      </button>

      {/* User section */}
      {isAuthenticated ? (
        <UserDropdown theme="light" />
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-1.5 rounded-full border border-[#3BB77E] px-4 py-2 text-sm font-semibold text-[#3BB77E] transition-all hover:bg-[#3BB77E] hover:text-white hover:shadow-md hover:shadow-[#3BB77E]/25"
        >
          Sign In
          <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}
