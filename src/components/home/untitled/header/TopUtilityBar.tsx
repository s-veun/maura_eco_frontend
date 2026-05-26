"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, Heart, Moon, Sun, User } from "lucide-react";

type LangCode = "EN" | "KH";

const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "KH", label: "Khmer", flag: "🇰🇭" },
];

type TopUtilityBarProps = {
  isDark: boolean;
  onThemeToggle: () => void;
  wishlistCount: number;
  isAuthenticated: boolean;
};

export default function TopUtilityBar({
  isDark,
  onThemeToggle,
  wishlistCount,
  isAuthenticated,
}: TopUtilityBarProps) {
  const [lang, setLang] = useState<LangCode>("EN");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  return (
    <div className="border-b border-white/10 bg-[#4a2e90]/95 text-white backdrop-blur-sm">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">

        {/* LEFT — shipping promo */}
        <p className="hidden shrink-0 items-center gap-1.5 text-[11px] text-white/70 sm:flex">
          <span>🚚</span>
          Free shipping on orders over{" "}
          <span className="font-semibold text-white">$50</span>
        </p>

        {/* CENTER — sale announcement */}
        <div className="flex flex-1 items-center justify-center gap-2 text-center">
          <p className="text-[11px] font-medium text-white/90">
            <span className="font-bold text-yellow-300">Summer Sale</span>
            {" "}— Up to{" "}
            <span className="font-bold text-white">40% OFF</span>
            {" "}selected items
          </p>
          <Link
            href="/products?sort=discount"
            className="hidden rounded-full border border-white/25 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 transition hover:border-white/50 hover:bg-white/10 sm:inline-flex"
          >
            Shop Sale →
          </Link>
        </div>

        {/* RIGHT — utility actions */}
        <div className="flex shrink-0 items-center gap-0.5">

          {/* Language switcher */}
          <div ref={langRef} className="relative hidden md:block">
            <button
              type="button"
              aria-label="Select language"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Globe className="size-3.5" />
              <span>{lang}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#3a2375] shadow-xl"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-white/90 transition hover:bg-white/10"
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span className="flex-1 font-medium">{l.label}</span>
                      {l.code === lang && (
                        <Check className="size-3.5 text-purple-300" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark / light mode */}
          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onThemeToggle}
            className="hidden h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white md:inline-flex"
          >
            {isDark ? (
              <Moon className="size-3.5" />
            ) : (
              <Sun className="size-3.5" />
            )}
            <span className="hidden font-medium lg:inline">
              {isDark ? "Dark" : "Light"}
            </span>
          </button>

          {/* Wishlist shortcut */}
          <Link
            href={
              isAuthenticated
                ? "/profile?tab=wishlist"
                : "/login?redirect=/"
            }
            aria-label={
              wishlistCount > 0
                ? `Wishlist, ${wishlistCount} items`
                : "Wishlist"
            }
            className="relative inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Heart className="size-3.5" />
            <span className="hidden font-medium lg:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold leading-none text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Account shortcut */}
          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            aria-label="Account"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <User className="size-3.5" />
            <span className="hidden font-medium lg:inline">
              {isAuthenticated ? "Account" : "Sign in"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
