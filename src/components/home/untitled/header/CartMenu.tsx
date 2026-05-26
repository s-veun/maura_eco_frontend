"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

type CartMenuProps = {
  count: number;
  isLoading?: boolean;
  onOpen: () => void;
};

export default function CartMenu({ count, isLoading, onOpen }: CartMenuProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex min-w-[66px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#f5f2ff] hover:text-[#5a3ea8]"
    >
      <ShoppingCart className="size-5 transition group-hover:-translate-y-0.5" />
      <span className="text-[11px] font-semibold">Cart</span>
      {isLoading ? (
        <span className="absolute right-1.5 top-1.5 h-5 w-5 animate-pulse rounded-full bg-slate-200" />
      ) : count > 0 ? (
        <motion.span
          key={count}
          initial={{ scale: 0.8, y: -2 }}
          animate={{ scale: [1, 1.15, 1], y: [0, -2, 0] }}
          transition={{ duration: 0.45 }}
          className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white"
        >
          {count}
        </motion.span>
      ) : null}
      <span className="pointer-events-none absolute -bottom-10 left-1/2 hidden -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-[11px] text-slate-500 shadow-lg group-hover:block">
        {count === 0 ? "Your cart is empty" : "View cart"}
      </span>
    </button>
  );
}
