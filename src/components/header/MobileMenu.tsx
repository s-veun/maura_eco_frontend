"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  ShoppingBag,
  LayoutGrid,
  Info,
  Phone,
  ChevronRight,
  ChevronDown,
  UtensilsCrossed,
  Armchair,
  Sofa,
  Monitor,
  BedDouble,
  Flower2,
  Heart,
  ShoppingCart,
  LogIn,
  Search,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAuth } from "@/auth/AuthProvider";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import { useGetCartQuery } from "@/redux/api/productApi";
import UserAvatar from "@/components/ui/UserAvatar";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home",    href: "/",        icon: Home      },
  { label: "Shop",    href: "/products", icon: ShoppingBag },
  { label: "About",   href: "/about",   icon: Info      },
  { label: "Contact", href: "/contact", icon: Phone     },
];

const categories = [
  { label: "Dining Tables",     icon: UtensilsCrossed, href: "/products?category=dining"   },
  { label: "Premium Chairs",    icon: Armchair,        href: "/products?category=chairs"   },
  { label: "Sofa Sets",         icon: Sofa,            href: "/products?category=sofas"    },
  { label: "Office Furniture",  icon: Monitor,         href: "/products?category=office"   },
  { label: "Bedroom Furniture", icon: BedDouble,       href: "/products?category=bedroom"  },
  { label: "Decorations",       icon: Flower2,         href: "/products?category=decor"    },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { openDrawer } = useCartDrawer();
  const { data: cart } = useGetCartQuery(user?.id ?? skipToken);
  const router = useRouter();

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username
    : "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[90vw] flex-col bg-white shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DEF9EC]">
                  <span className="text-lg font-black text-[#3BB77E]">T</span>
                </div>
                <div>
                  <p className="text-base font-bold text-[#253D4E]">TableEco</p>
                  <p className="text-[10px] font-medium text-[#ADADAD]">Modern Living</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#ADADAD] transition-colors hover:bg-gray-100 hover:text-[#253D4E]"
                aria-label="Close menu"
              >
                <X size={17} />
              </button>
            </div>

            {/* Mobile search */}
            <div className="border-b border-gray-100 px-4 py-3">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <Search size={14} className="shrink-0 text-[#ADADAD]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#253D4E] placeholder:text-[#ADADAD] outline-none"
                  />
                </div>
              </form>
            </div>

            {/* User info (if logged in) */}
            {isAuthenticated && user && (
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3 rounded-xl bg-[#DEF9EC]/60 p-3">
                  <UserAvatar size="sm" name={displayName} src={user.profileImageUrl ?? null} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#253D4E]">{displayName}</p>
                    <p className="truncate text-xs text-[#ADADAD]">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <div className="space-y-0.5">
                {navItems.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#253D4E] transition-colors hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight size={14} className="text-[#ADADAD]" />
                  </Link>
                ))}

                {/* Categories accordion */}
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((v) => !v)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#253D4E] transition-colors hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                >
                  <LayoutGrid size={16} className="shrink-0" />
                  <span className="flex-1 text-left">Categories</span>
                  <motion.span
                    animate={{ rotate: categoriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-[#ADADAD]" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-[#DEF9EC] pl-3">
                        {categories.map(({ label, icon: Icon, href }) => (
                          <Link
                            key={label}
                            href={href}
                            onClick={onClose}
                            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-[#253D4E] transition-colors hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                          >
                            <Icon size={14} className="shrink-0 text-[#3BB77E]" />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={isAuthenticated ? "/profile/wishlist" : "/login"}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-[#253D4E] transition-all hover:border-[#3BB77E]/40 hover:bg-[#DEF9EC]"
                >
                  <Heart size={15} />
                  Wishlist
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openDrawer();
                  }}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-[#253D4E] transition-all hover:border-[#3BB77E]/40 hover:bg-[#DEF9EC]"
                >
                  <ShoppingCart size={15} />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute right-3 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#3BB77E] text-[9px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-gray-100 p-4">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#3BB77E] py-2.5 text-sm font-semibold text-[#3BB77E] transition-all hover:bg-[#DEF9EC]"
                  >
                    <LogIn size={14} />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex items-center justify-center rounded-xl bg-[#3BB77E] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea36d] hover:shadow-md hover:shadow-[#3BB77E]/25"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <p className="text-center text-xs text-[#ADADAD]">
                  © 2025 TableEco · Modern Living
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
