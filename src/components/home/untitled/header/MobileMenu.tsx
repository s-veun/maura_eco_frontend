"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { CategoryViewModel } from "@/types/homepage";
import SearchBar from "@/components/home/untitled/header/SearchBar";
import ThemeSwitcher from "@/components/home/untitled/header/ThemeSwitcher";

type NavItem = { label: string; href: string };

type MobileMenuProps = {
  open: boolean;
  navItems: NavItem[];
  categories: CategoryViewModel[];
  selectedCategory: CategoryViewModel | null;
  onSelectCategory: (category: CategoryViewModel | null) => void;
  onClose: () => void;
  wishlistCount: number;
  cartCount: number;
  isDark: boolean;
  onThemeToggle: () => void;
};

export default function MobileMenu({
  open,
  navItems,
  categories,
  selectedCategory,
  onSelectCategory,
  onClose,
  wishlistCount,
  cartCount,
  isDark,
  onThemeToggle,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-slate-900">Menu</p>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4">
              <SearchBar className="w-full" inputClassName="h-11" />
            </div>

            <div className="mt-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f5f2ff] hover:text-[#5a3ea8]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Categories</p>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => onSelectCategory(null)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                    !selectedCategory
                      ? "border-[#5a3ea8] bg-[#f5f2ff] text-[#5a3ea8]"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  All categories
                </button>
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category.catId}
                    type="button"
                    onClick={() => onSelectCategory(category)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                      selectedCategory?.catId === category.catId
                        ? "border-[#5a3ea8] bg-[#f5f2ff] text-[#5a3ea8]"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {category.catName}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-400">Wishlist</p>
                <p className="text-lg font-semibold text-slate-900">{wishlistCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-400">Cart</p>
                <p className="text-lg font-semibold text-slate-900">{cartCount}</p>
              </div>
            </div>

            <div className="mt-6">
              <ThemeSwitcher isDark={isDark} onToggle={onThemeToggle} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
