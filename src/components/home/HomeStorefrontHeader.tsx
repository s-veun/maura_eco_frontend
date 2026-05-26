"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import UserAvatar from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CategoryDTO } from "@/lib/api";

interface HomeStorefrontHeaderProps {
  categories: CategoryDTO[];
}

export default function HomeStorefrontHeader({
  categories,
}: HomeStorefrontHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const { openDrawer } = useCartDrawer();
  const [navOpen, setNavOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/products" },
      { label: "Contact", href: "/contact" },
    ],
    [],
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F3F4F6] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 lg:gap-5">

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl border border-[#F3F4F6] text-[#374151] hover:bg-[#f5f3ff] hover:text-[#5a3ea8] lg:hidden"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            {navOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="mr-1 flex min-w-fit items-center gap-2.5 lg:mr-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5a3ea8]">
              <span className="text-sm font-black text-white">TE</span>
            </div>
            <div>
              <p className="text-xl font-black leading-none tracking-tight text-[#111827]">
                TableEco
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                Premium Store
              </p>
            </div>
          </Link>

          {/* Desktop categories dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden h-10 items-center rounded-xl border border-[#F3F4F6] bg-white px-4 text-sm font-semibold text-[#374151] outline-none transition hover:border-[#5a3ea8]/30 hover:bg-[#f5f3ff] hover:text-[#5a3ea8] md:inline-flex">
              <Menu className="mr-2 size-4" />
              Categories
              <ChevronDown className="ml-2 size-4 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 w-64 overflow-auto rounded-xl border-[#F3F4F6]">
              {categories.map((item) => (
                <DropdownMenuItem
                  key={item.catId}
                  className="cursor-pointer rounded-lg text-[#374151] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
                >
                  {item.catName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop search */}
          <div className="relative ml-auto hidden w-full max-w-2xl lg:block">
            <Input
              placeholder="Search products, categories, suppliers..."
              className="h-10 rounded-xl border-[#F3F4F6] bg-[#FAFAFA] pl-4 pr-11 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus-visible:border-[#5a3ea8]/40 focus-visible:ring-[#5a3ea8]/20"
            />
            <button className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#5a3ea8] text-white transition hover:bg-[#4a3190]">
              <Search className="size-3.5" />
            </button>
          </div>

          {/* Desktop nav icons */}
          <div className="hidden items-center gap-1 lg:flex">
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              className="group flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[#6B7280] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
            >
              {isAuthenticated && user ? (
                <UserAvatar src={user.profileImage} name={user.username} size="sm" ringClass="ring-2 ring-[#ede9fe]" />
              ) : (
                <User className="size-5" />
              )}
              <span className="text-[10px] font-semibold">
                {isAuthenticated ? "Profile" : "Account"}
              </span>
            </Link>

            <Link
              href={isAuthenticated ? "/profile?tab=wishlist" : "/login?redirect=/"}
              className="group flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[#6B7280] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
            >
              <Heart className="size-5 transition group-hover:-translate-y-0.5" />
              <span className="text-[10px] font-semibold">Wishlist</span>
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="group relative flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[#6B7280] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
            >
              <ShoppingCart className="size-5 transition group-hover:-translate-y-0.5" />
              <span className="text-[10px] font-semibold">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute right-2 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5a3ea8] px-1 text-[9px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop nav links row */}
        <div className="mt-2 hidden items-center gap-6 border-t border-[#F9FAFB] pt-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-[#6B7280] transition hover:text-[#5a3ea8]"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs text-[#9CA3AF]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Fast shipping available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5a3ea8]" />
              B2B pricing
            </span>
          </div>
        </div>

        {/* Mobile expanded menu */}
        {navOpen && (
          <div className="mt-3 border-t border-[#F3F4F6] pt-3 lg:hidden">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  placeholder="Search products..."
                  className="h-10 rounded-xl border-[#F3F4F6] bg-[#FAFAFA] pl-4 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF]"
                />
                <button className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#5a3ea8] text-white">
                  <Search className="size-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href={isAuthenticated ? "/profile" : "/login"}
                  className="rounded-xl bg-[#f5f3ff] px-3 py-3 text-center text-xs font-semibold text-[#5a3ea8]"
                >
                  Account
                </Link>
                <Link
                  href={isAuthenticated ? "/profile?tab=wishlist" : "/login?redirect=/"}
                  className="rounded-xl bg-[#f5f3ff] px-3 py-3 text-center text-xs font-semibold text-[#5a3ea8]"
                >
                  Wishlist
                </Link>
                <button
                  type="button"
                  onClick={openDrawer}
                  className="rounded-xl bg-[#5a3ea8] px-3 py-3 text-center text-xs font-semibold text-white transition hover:bg-[#4a3190]"
                >
                  Cart ({cartItemCount})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile cart FAB */}
      <button
        type="button"
        onClick={openDrawer}
        className="fixed bottom-24 left-4 z-40 inline-flex h-11 items-center gap-2 rounded-full bg-[#5a3ea8] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(90,62,168,0.30)] transition hover:bg-[#4a3190] lg:hidden"
      >
        <ShoppingCart className="size-4" />
        Cart ({cartItemCount})
      </button>
    </header>
  );
}
