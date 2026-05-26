"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Heart, User, Menu,
  ChevronDown, LogOut, Settings, Package, Home, Grid3X3, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/api";
import type { AuthUser } from "@/auth/types";

interface HomeNavbarProps {
  isScrolled: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  cartCount: number;
  wishlistCount: number;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: (val: string) => void;
  onLogout: () => void;
  categories: CategoryDTO[];
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products", hasDropdown: true },
  { label: "Flash Sale", href: "/products?tab=flash", icon: <Zap className="w-3.5 h-3.5 text-orange-500" /> },
];

export default function HomeNavbar({
  isScrolled, user, isAuthenticated, cartCount, wishlistCount,
  searchValue, onSearchChange, onSearchSubmit, onLogout, categories,
}: HomeNavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCats, setShowCats] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-360 mx-auto px-4 md:px-6">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#5a3ea8] to-[#a78bfa] flex items-center justify-center text-white font-black text-sm">
              T
            </div>
            <span className="font-black text-lg text-gray-900 hidden sm:block">
              Table<span className="text-[#5a3ea8]">Eco</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#5a3ea8] hover:bg-purple-50 transition-all duration-200"
                  onMouseEnter={() => link.hasDropdown && setShowCats(true)}
                  onMouseLeave={() => link.hasDropdown && setShowCats(false)}
                >
                  {link.icon && link.icon}
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </Link>
                {link.hasDropdown && (
                  <AnimatePresence>
                    {showCats && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50"
                        onMouseEnter={() => setShowCats(true)}
                        onMouseLeave={() => setShowCats(false)}
                      >
                        {categories.slice(0, 8).map((cat) => (
                          <Link
                            key={cat.catId}
                            href={`/products?categoryId=${cat.catId}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-[#5a3ea8] hover:bg-purple-50 transition-all"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#5a3ea8]/40" />
                            {cat.catName}
                          </Link>
                        ))}
                        {categories.length === 0 && (
                          <p className="text-xs text-gray-400 px-3 py-2">Loading categories...</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit(searchValue)}
              className="pl-9 h-9 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-[#5a3ea8] border-0">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-orange-500 border-0">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* User */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.profileImageUrl ?? user.profileImage} />
                      <AvatarFallback className="bg-[#5a3ea8] text-white text-xs font-bold">
                        {user.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="gap-2 cursor-pointer">
                    <User className="w-4 h-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")} className="gap-2 cursor-pointer">
                    <Package className="w-4 h-4" /> Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile?tab=settings")} className="gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="gap-2 text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center h-9 rounded-xl bg-[#5a3ea8] hover:bg-[#4a2f98] text-white text-xs font-semibold px-4 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger>
                <span className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <Menu className="w-5 h-5" />
                </span>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="px-6 py-5 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#5a3ea8] to-[#a78bfa] flex items-center justify-center text-white font-black text-sm">T</div>
                    <span className="font-black text-lg">Table<span className="text-[#5a3ea8]">Eco</span></span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 overflow-y-auto h-full pb-16">
                  <div className="relative mb-4">
                    <Input
                      placeholder="Search products..."
                      value={searchValue}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onSearchSubmit(searchValue);
                          setMobileOpen(false);
                        }
                      }}
                      className="pl-9 rounded-xl"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <nav className="flex flex-col gap-1">
                    {[
                      { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
                      { label: "Shop", href: "/products", icon: <Grid3X3 className="w-4 h-4" /> },
                      { label: "Flash Sale", href: "/products?tab=flash", icon: <Zap className="w-4 h-4" /> },
                      { label: "Wishlist", href: "/wishlist", icon: <Heart className="w-4 h-4" /> },
                      { label: "Cart", href: "/cart", icon: <ShoppingCart className="w-4 h-4" /> },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-[#5a3ea8] hover:bg-purple-50 transition-all"
                      >
                        <span className="text-[#5a3ea8]">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold text-gray-400 mb-2 px-3">CATEGORIES</p>
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.catId}
                        href={`/products?categoryId=${cat.catId}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-[#5a3ea8] hover:bg-purple-50 transition-all"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5a3ea8]" />
                        {cat.catName}
                      </Link>
                    ))}
                  </div>
                  {!isAuthenticated && (
                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center h-10 bg-[#5a3ea8] hover:bg-[#4a2f98] text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center h-10 border border-[#5a3ea8] text-[#5a3ea8] text-sm font-bold rounded-xl hover:bg-purple-50 transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

