"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, DollarSign, Home, Search, Heart, ShoppingCart, User, Menu, Store } from "lucide-react";
import { ThemeModeToggle } from "@/theme/AppThemeProvider";
import { useProductSearchQuery } from "@/hooks/use-ecommerce-queries";
import { useAuth } from "@/auth/AuthProvider";
import UserDropdown from "@/components/ui/UserDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

type SearchOption = {
  label: string;
  id: number;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "Dashboard", href: "/dashboard" },
];

const bottomActions = [
  { value: "/", label: "Home", icon: <Home className="h-5 w-5" />, href: "/" },
  { value: "/products", label: "Shop", icon: <Store className="h-5 w-5" />, href: "/products" },
  { value: "/cart", label: "Cart", icon: <ShoppingCart className="h-5 w-5" />, href: "/cart" },
  { value: "/profile", label: "Profile", icon: <User className="h-5 w-5" />, href: "/profile" },
];

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState("/");
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: searchProducts = [] } = useProductSearchQuery(searchInput, searchInput.trim().length > 1);
  const searchOptions = useMemo<SearchOption[]>(
    () =>
      searchProducts.slice(0, 8).map((item) => ({
        id: item.proId,
        label: item.proName,
      })),
    [searchProducts],
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2 text-foreground/70 hover:text-foreground">
                <Globe className="h-3 w-3" /> EN / USD
              </button>
              <button className="flex items-center gap-1 px-2 text-foreground/70 hover:text-foreground">
                <DollarSign className="h-3 w-3" /> Help Center
              </button>
            </div>
            <span className="hidden md:block text-muted-foreground text-[11px]">
              New user deal: free shipping for selected furniture
            </span>
            <div className="flex items-center gap-1">
              <button className="px-2 text-foreground/70 hover:text-foreground">Seller Center</button>
              <button className="px-2 text-foreground/70 hover:text-foreground">Track Orders</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex items-center gap-2 h-14">
            {/* Mobile menu trigger */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <nav className="flex flex-col gap-1 pt-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="px-4 py-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="text-lg font-extrabold tracking-tight text-foreground">
              TableEco
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5 ml-3">
              {navLinks.map((item) => (
                <Button key={item.label} variant="ghost" size="sm" asChild className="text-xs px-2.5">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden sm:flex items-center ml-auto flex-1 max-w-[600px] relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9 h-8 text-sm"
                placeholder="Search furniture products"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {showSuggestions && searchOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 overflow-hidden">
                  {searchOptions.map((opt) => (
                    <button
                      key={opt.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                      onMouseDown={() => {
                        router.push(`/products/${opt.id}`);
                        setShowSuggestions(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto sm:ml-2">
              <ThemeModeToggle />
              <Button variant="ghost" size="icon" asChild>
                <Link href={isAuthenticated ? "/profile?tab=wishlist" : `/login?redirect=${encodeURIComponent("/profile?tab=wishlist")}`}>
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              <UserDropdown theme="light" />
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 container mx-auto px-4 max-w-screen-xl py-4 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-background border-t flex">
        {bottomActions.map((action) => (
          <Link
            key={action.value}
            href={action.href}
            onClick={() => setMobileNav(action.value)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] transition-colors ${
              mobileNav === action.value ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
