"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  Home,
  Package,
  Info,
  Mail,
  Phone,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { skipToken } from "@reduxjs/toolkit/query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthProvider";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import { useGetCartQuery } from "@/redux/api/productApi";
import UserDropdown from "@/components/ui/UserDropdown";
import MobileMenu from "@/components/header/MobileMenu";


const NAV_LINKS = [
  { label: "Home",    href: "/",         icon: Home    },
  { label: "AllProduct", href: "/products", icon: Package },
  { label: "About",   href: "/about",    icon: Info    },
  { label: "Contact", href: "/contact",  icon: Mail    },
];

const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "KH", label: "ខ្មែរ",    flag: "🇰🇭" },
];

const PROMO_MESSAGES = [
  "🌿 Free shipping on orders over $150",
  "✨ New collections just dropped — shop now",
  "🎁 Use code ECO20 for 20% off your first order",
];

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { openDrawer } = useCartDrawer();
  const { data: cart } = useGetCartQuery(user?.id ?? skipToken);

  const [isMobileMenuOpen,  setIsMobileMenuOpen]  = useState(false);
  const [isCatDropOpen,     setIsCatDropOpen]     = useState(false);
  const [isLangOpen,        setIsLangOpen]        = useState(false);
  const [activeLang,        setActiveLang]        = useState(LANGUAGES[0]);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [isScrolled,        setIsScrolled]        = useState(false);
  const [promoIdx,          setPromoIdx]          = useState(0);
  const [promoVisible,      setPromoVisible]      = useState(true);
  const [searchFocused,     setSearchFocused]     = useState(false);
  const { theme, setTheme } = useTheme();

  const catRef  = useRef<HTMLDivElement>(null);
  const langRef  = useRef<HTMLDivElement>(null);
  const selectedCat = "All Categories";

  const cartItemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const cartTotal     = cart?.totalPrice ?? 0;

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* rotate promo messages */
  useEffect(() => {
    const id = setInterval(() => {
      setPromoIdx((i) => (i + 1) % PROMO_MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* close dropdowns on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node))
        setIsCatDropOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setIsLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    const cat = selectedCat !== "All Categories" ? `&category=${encodeURIComponent(selectedCat)}` : "";
    router.push(`/products?search=${encodeURIComponent(q)}${cat}`);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled
        ? "bg-[#E49917]/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-md"
        : "bg-[#E49917] dark:bg-slate-950/96"
    )}>

      {/* -- Promo announcement bar -- */}
      <AnimatePresence>
        {promoVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden bg-slate-900 dark:bg-slate-950"
          >
            {/* animated shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
            <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={promoIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-center text-xs font-semibold tracking-wide text-white"
                >
                  {PROMO_MESSAGES[promoIdx]}
                </motion.p>
              </AnimatePresence>
              <button
                onClick={() => setPromoVisible(false)}
                className="absolute right-4 text-white/60 hover:text-white transition-colors"
                aria-label="Close announcement"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================================
          ROW 1 — Logo · Search · Actions
      ============================================== */}
      <div className="bg-transparent">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">

          {/* -- Logo -- */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#E49917]"
            >
              <Leaf size={20} className="text-white" strokeWidth={2.5} />
            </motion.div>
            <div className="leading-none">
              <p className="text-[20px] font-extrabold tracking-tight text-slate-900 dark:text-white">TableEco</p>
            </div>
          </Link>

          {/* -- Search bar -- */}
          <motion.form
            onSubmit={handleSearch}
            animate={searchFocused ? { scale: 1.01 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "hidden flex-1 items-center overflow-hidden rounded-[5px] transition-all duration-300 lg:flex",
              searchFocused
                ? "bg-slate-200 dark:bg-slate-800/90"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-800/80"
            )}
          >
            {/* Category dropdown */}
            <div ref={catRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsCatDropOpen((v) => !v)}
                className="flex h-11 items-center gap-2 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-white/30 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              >
                <span className="max-w-30 truncate">{selectedCat}</span>
                <ChevronDown
                  size={13}
                  className={cn("shrink-0 text-slate-500 transition-transform duration-200", isCatDropOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {isCatDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full z-50 mt-2 w-52 rounded-[5px] bg-white dark:bg-slate-900/95 backdrop-blur-xl py-1.5"
                  >
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products..."
              className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
            />

            {/* Search button */}
            <button
              type="submit"
              className="flex h-11 w-12 shrink-0 items-center justify-center rounded-[5px] bg-[#ab6e04] text-white transition-all hover:bg-[#c8850f]"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </motion.form>

          {/* -- Right actions -- */}
          <div className="ml-auto flex items-center gap-1 lg:ml-0">

            {/* Wishlist */}
            <Link
              href={isAuthenticated ? "/profile/wishlist" : "/login"}
              className="group hidden items-center gap-2 rounded-[5px] px-3 py-2 transition-all bg-slate-100 dark:hover:bg-white/5 lg:flex"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart
                  size={20}
                  className="text-slate-500 dark:text-slate-400 transition-all duration-200 group-hover:text-[#E49917] group-hover:scale-110"
                />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-[5px] bg-[#E49917] px-1 text-[9px] font-bold text-white">
                    {Math.min(cartItemCount, 9)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                Wishlist
              </span>
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openDrawer}
              className="group hidden items-center gap-2.5 rounded-[5px] px-3 py-2 transition-all bg-slate-100 dark:bg-white/5 lg:flex"
              aria-label="My cart"
            >
              <div className="relative">
                <ShoppingCart
                  size={20}
                  className="text-slate-500 dark:text-slate-400 transition-all duration-200 group-hover:text-[#E49917] group-hover:scale-110"
                />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      key={cartItemCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-[5px] bg-[#E49917] px-1 text-[9px] font-bold text-white"
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-left">
                <p className="mt-0.5 text-xs font-bold leading-none text-[#E49917]">
                  ${cartTotal.toFixed(2)}
                </p>
              </div>
              <ChevronDown size={12} className="text-slate-600" />
            </button>

            {/* Divider */}
            <div className="mx-1 hidden h-7 w-px bg-slate-200/70 dark:bg-white/10 lg:block" />

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-[5px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              <Sun size={16} className="dark:hidden" />
              <Moon size={16} className="hidden dark:block" />
            </motion.button>

            {/* User */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <UserDropdown theme="dark" />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-[5px] bg-[#E49917]/10 px-4 py-2 text-sm font-semibold text-[#E49917] transition-all hover:bg-[#E49917]/20 hover:text-[#c8850f]"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ==============================================
          ROW 2 — Browse Categories · Nav links · Support
      ============================================== */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-0 px-4 sm:px-6 lg:px-8">
          {/* Nav links */}
          <nav className="flex items-center">
            {NAV_LINKS.map(({ label, href, icon: Icon }, i) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-[5px] px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  "text-white/75 hover:text-white hover:bg-white/15",
                )}
              >
                <Icon
                  size={14}
                  className={cn(
                    "transition-colors",
                    "text-white/80 group-hover:text-slate-100",
                  )}
                />
                {label}
                {/* animated underline */}
                <span className={cn(
                  "absolute bottom-0 left-4 right-4 h-px rounded-full transition-all duration-200",
                  i === 0 ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100",
                )} style={{ backgroundColor: "#E49917" }} />
              </Link>
            ))}
          </nav>

          {/* Support phone + language — pushed right */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#E49917]/15">
                <Phone size={13} className="text-[#E49917]" />
              </div>
              <span className="text-sm font-bold text-white dark:text-white">1300-TABLEECO</span>
              <span className="text-xs font-medium text-white/75 dark:text-white/75">24/7 support</span>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

            {/* Language selector */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-[5px] px-2.5 py-1.5 text-xs font-semibold bg-active text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Select language"
              >
                <Globe size={13} className="text-[#E49917]" />
                <span>{activeLang.flag} {activeLang.code}</span>
                <ChevronDown size={11} className={cn("text-slate-400 transition-transform duration-200", isLangOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-44 rounded-[5px] border border-border/40 bg-white dark:bg-slate-900 shadow-md py-1 overflow-hidden"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => { setActiveLang(lang); setIsLangOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-[#E49917]/10 hover:text-[#c8850f] dark:hover:text-[#E49917] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                        {activeLang.code === lang.code && (
                          <Check size={12} className="text-[#E49917] shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
