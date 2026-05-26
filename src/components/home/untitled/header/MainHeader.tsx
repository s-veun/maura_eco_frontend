"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Sofa,
  User as UserIcon,
  X,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { AuthUser } from "@/auth/types";
import type { CategoryViewModel } from "@/types/homepage";
import MegaMenu from "./MegaMenu";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const formatPrice = (n: number) => priceFormatter.format(n);

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type MainHeaderProps = {
  categories: CategoryViewModel[];
  selectedCategory: CategoryViewModel | null;
  isCategoriesLoading: boolean;
  categoriesError: boolean;
  onSelectCategory: (category: CategoryViewModel | null) => void;
  onOpenCart: () => void;
  onToggleMobile: () => void;
  isMobileOpen: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  wishlistCount: number;
  cartCount: number;
  countsLoading: boolean;
};

const MainHeader: React.FC<MainHeaderProps> = ({
  categories,
  isCategoriesLoading,
  onOpenCart,
  onToggleMobile,
  isMobileOpen,
  user,
  isAuthenticated,
  cartCount,
  countsLoading,
}) => {
  const [query, setQuery] = useState("");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  const prevCartCount = useRef(cartCount);
  const userDropRef = useRef<HTMLDivElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { totalPrice, isBusy: isCartBusy } = useCart();

  // Cart bump animation on item add
  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartBump(true);
      const id = window.setTimeout(() => setCartBump(false), 450);
      prevCartCount.current = cartCount;
      return () => window.clearTimeout(id);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  // Keyboard shortcut: 'c' opens cart (outside input fields)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;
      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        onOpenCart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenCart]);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!userDropOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        userDropRef.current &&
        !userDropRef.current.contains(e.target as Node)
      ) {
        setUserDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userDropOpen]);

  // Mega menu hover helpers — delay lets mouse travel from trigger to panel
  const openMegaMenu = useCallback(() => {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
    setMegaMenuOpen(true);
  }, []);

  const scheduleMegaMenuClose = useCallback(() => {
    megaCloseTimer.current = setTimeout(() => setMegaMenuOpen(false), 160);
  }, []);

  const initials = (() => {
    if (!user) return "";
    const first = user.firstName?.[0] ?? user.username?.[0] ?? "";
    const last = user.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "U";
  })();

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    window.location.href = `/products?search=${encodeURIComponent(q)}`;
  };

  return (
    <div className="relative bg-[#5a3ea8] text-white">
      {/* ─── Primary nav row (80 px) ─── */}
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-6 lg:px-8">

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 lg:hidden"
        >
          {isMobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {/* ── Logo + tagline ── */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 shadow-sm ring-1 ring-white/25">
            <Sofa className="size-5 text-white" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[17px] font-black leading-none tracking-tight text-white">
              TableEco
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-white/55">
              Modern Living
            </span>
          </span>
        </Link>
        
        {/* ── Center navigation (desktop) ── */}
        <nav className="ml-2 hidden flex-1 items-center justify-center gap-1 lg:flex">
          {/* Categories — mega menu trigger */}
          <button
            type="button"
            onMouseEnter={openMegaMenu}
            onMouseLeave={scheduleMegaMenuClose}
            onClick={() => setMegaMenuOpen((v) => !v)}
            aria-expanded={megaMenuOpen}
            aria-haspopup="true"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
              megaMenuOpen
                ? "bg-white/15 text-white"
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            Categories
            <ChevronDown
              className={`size-4 text-white/65 transition duration-200 ${megaMenuOpen ? "rotate-180 text-white/90" : ""}`}
            />
          </button>

          {NAV_ITEMS.slice(0, 2).map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}

          {NAV_ITEMS.slice(2).map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">

          {/* Search bar — desktop */}
          <form onSubmit={onSearchSubmit} className="hidden lg:flex" role="search">
            <div className="relative flex w-56 items-center xl:w-72">
              <Search className="pointer-events-none absolute left-4 z-10 size-4 text-white/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture…"
                className="h-10 w-full rounded-full border border-white/20 bg-white/10 pl-10 pr-21 text-sm text-white placeholder:text-white/45 transition focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 inline-flex h-7 items-center rounded-full px-3.5 text-[11px] font-semibold text-[#5a3ea8] transition hover:bg-white/10"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile search shortcut */}
          <Link
            href="/products"
            aria-label="Search products"
            className="inline-flex size-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 lg:hidden"
          >
            <Search className="size-5" />
          </Link>

          {/* Cart button */}
          <motion.button
            type="button"
            onClick={onOpenCart}
            aria-label={
              cartCount > 0
                ? `Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`
                : "Open cart"
            }
            title="Open cart (press C)"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            animate={cartBump ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/20"
          >
            <span className="relative inline-flex">
              <ShoppingCart className="size-4.5" />
              {isCartBusy && (
                <span className="absolute -right-1 -top-1 flex size-2 items-center justify-center">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && totalPrice > 0 && (
              <span className="hidden text-[11px] font-semibold text-white/65 xl:inline">
                · {formatPrice(totalPrice)}
              </span>
            )}
            <AnimatePresence mode="popLayout" initial={false}>
              {!countsLoading && cartCount > 0 ? (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>

          {/* User avatar / sign in */}
          <div ref={userDropRef} className="relative hidden sm:block">
            {isAuthenticated && user ? (
              <>
                <button
                  type="button"
                  onClick={() => setUserDropOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={userDropOpen}
                  className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/20 transition hover:ring-white/40"
                >
                  {user.profileImageUrl || user.profileImage ? (
                    <Image
                      src={
                        (user.profileImageUrl ?? user.profileImage) as string
                      }
                      alt={user.firstName || user.username || "User"}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[13px] font-bold text-white">
                      {initials}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {userDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                            : user.username}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                          {user.email}
                        </p>
                      </div>
                      {[
                        { label: "Profile", href: "/profile" },
                        { label: "My Orders", href: "/orders" },
                        { label: "Wishlist", href: "/profile?tab=wishlist" },
                      ].map(({ label, href }) => (
                        <Link
                          key={label}
                          href={href}
                          onClick={() => setUserDropOpen(false)}
                          className="block px-4 py-2.5 text-sm text-slate-700 transition hover:bg-[#f5f2ff] hover:text-[#5a3ea8]"
                        >
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-slate-100">
                        <Link
                          href="/login?logout=1"
                          onClick={() => setUserDropOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          Sign out
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/20"
              >
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mega Menu (absolutely positioned below nav row) ─── */}
      <MegaMenu
        isOpen={megaMenuOpen}
        categories={categories}
        isLoading={isCategoriesLoading}
        onClose={() => setMegaMenuOpen(false)}
        onMouseEnter={openMegaMenu}
        onMouseLeave={scheduleMegaMenuClose}
      />
    </div>
  );
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-semibold text-white/85 transition after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-white/0 after:transition hover:bg-white/10 hover:text-white hover:after:bg-white/55"
    >
      {label}
    </Link>
  );
}

export default MainHeader;
