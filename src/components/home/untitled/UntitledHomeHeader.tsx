"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import useHomepageData from "@/hooks/useHomepageData";
import type { CategoryViewModel } from "@/types/homepage";
import MainHeader from "@/components/home/untitled/header/MainHeader";
import MobileMenu from "@/components/home/untitled/header/MobileMenu";
import TopUtilityBar from "@/components/home/untitled/header/TopUtilityBar";

type UntitledHomeHeaderProps = {
  isScrolled: boolean;
  isDark: boolean;
  onThemeToggleAction: () => void;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function MobileBottomNav({
  cartCount,
  wishlistCount,
  onCartOpen,
}: {
  cartCount: number;
  wishlistCount: number;
  onCartOpen: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] md:hidden">
      <div className="flex items-center justify-between">
        <button type="button" className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-600">
          <Home className="size-5" />
          Home
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-600">
          <ShoppingBag className="size-5" />
          Shop
        </button>
        <button type="button" className="relative flex flex-col items-center gap-1 text-xs font-semibold text-slate-600">
          <Heart className="size-5" />
          Wishlist
          {wishlistCount > 0 && (
            <span className="absolute -right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white">
              {wishlistCount}
            </span>
          )}
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-600">
          <User className="size-5" />
          Account
        </button>
        <button
          type="button"
          onClick={onCartOpen}
          className="relative flex flex-col items-center gap-1 text-xs font-semibold text-slate-600"
        >
          <ShoppingCart className="size-5" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function UntitledHomeHeader({
  isScrolled,
  isDark,
  onThemeToggleAction,
}: UntitledHomeHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const { cartItemCount, isCartLoading } = useCart();
  const { openDrawer } = useCartDrawer();

  const homepage = useHomepageData(user?.id);
  const categories = homepage.categories.data ?? [];
  const categoriesLoading = homepage.categories.isLoading;
  const categoriesError = homepage.categories.isError;
  const wishlistCount = homepage.wishlistCount.data ?? 0;
  // Always trust the live RTK Query cart count so the badge updates immediately
  // after addToCart/updateQuantity/removeItem; fall back to the homepage
  // prefetch only while the real cart is still loading.
  const cartCount = isCartLoading ? homepage.cartCount.data ?? 0 : cartItemCount;
  const countsLoading = homepage.wishlistCount.isLoading || isCartLoading;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryViewModel | null>(null);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      animate={{
        boxShadow: isScrolled ? "0 16px 40px rgba(15,23,42,0.16)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.2 }}
    >
      <TopUtilityBar
        isDark={isDark}
        onThemeToggle={onThemeToggleAction}
        wishlistCount={wishlistCount}
        isAuthenticated={isAuthenticated}
      />
      <MainHeader
          categories={categories}
          selectedCategory={selectedCategory}
          isCategoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onSelectCategory={setSelectedCategory}
          onOpenCart={openDrawer}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
          isMobileOpen={mobileOpen}
          user={user}
          isAuthenticated={isAuthenticated}
          wishlistCount={wishlistCount}
          cartCount={cartCount}
          countsLoading={countsLoading}
        />

      <MobileMenu
        open={mobileOpen}
        navItems={navItems}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onClose={() => setMobileOpen(false)}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        isDark={isDark}
        onThemeToggle={onThemeToggleAction}
      />

      <MobileBottomNav
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onCartOpen={openDrawer}
      />
    </motion.header>
  );
}