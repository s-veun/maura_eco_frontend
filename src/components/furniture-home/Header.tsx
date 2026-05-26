"use client";

import { useState } from "react";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NavItem } from "@/components/furniture-home/types";

type HeaderProps = {
  navItems: NavItem[];
};

export default function Header({ navItems }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebe8f5] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex rounded-lg border border-[#e5e1f5] p-2 text-[#5a3ea8] md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>

        <a href="#" className="text-xl font-semibold tracking-tight text-[#1d1633]">
          Table<span className="text-[#5a3ea8]">Eco</span>
        </a>

        <nav className="ml-6 hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-[#4b5563] transition-colors hover:text-[#5a3ea8]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7d7d8f]" />
            <Input className="h-10 rounded-full border-[#e8e5f3] bg-[#faf9ff] pl-9" placeholder="Search furniture" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-4">
          <IconButton icon={<Search className="size-4" />} label="Search" hideOnDesktop />
          <IconButton icon={<Heart className="size-4" />} label="Wishlist" />
          <IconButton icon={<ShoppingCart className="size-4" />} label="Cart" count={2} />
          <IconButton icon={<User className="size-4" />} label="Profile" />
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-[#ebe8f5] bg-white px-4 py-4 md:hidden"
        >
          <div className="mb-3">
            <Input className="h-10 rounded-full border-[#e8e5f3] bg-[#faf9ff]" placeholder="Search furniture" />
          </div>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-[#374151] transition-colors hover:bg-[#f3efff] hover:text-[#5a3ea8]"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </motion.div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ebe8f5] bg-white/95 px-6 py-2 shadow-[0_-8px_24px_rgba(17,24,39,0.06)] md:hidden">
        <div className="mx-auto flex max-w-sm items-center justify-between text-[#55506b]">
          <BottomNavItem label="Home" />
          <BottomNavItem label="Search" />
          <BottomNavItem label="Wishlist" />
          <BottomNavItem label="Cart" />
          <BottomNavItem label="Profile" />
        </div>
      </div>
    </header>
  );
}

function IconButton({
  icon,
  label,
  count,
  hideOnDesktop,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  hideOnDesktop?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative rounded-full border border-[#ebe8f5] bg-white text-[#5c5a70] hover:bg-[#f4f0ff] hover:text-[#5a3ea8] ${
        hideOnDesktop ? "md:hidden" : ""
      }`}
      aria-label={label}
    >
      {icon}
      {count ? (
        <span className="absolute -top-1 -right-1 inline-flex size-4 items-center justify-center rounded-full bg-[#5a3ea8] text-[10px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </Button>
  );
}

function BottomNavItem({ label }: { label: string }) {
  return (
    <button type="button" className="rounded-md px-2 py-1 text-xs font-medium transition-colors hover:text-[#5a3ea8]">
      {label}
    </button>
  );
}

