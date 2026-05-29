"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Baby,
  Briefcase,
  Dumbbell,
  ChevronDown,
  Download,
  Gamepad2,
  Gem,
  Globe,
  Hammer,
  HeartPulse,
  Home,
  Menu,
  Monitor,
  PawPrint,
  ScanSearch,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sofa,
  Store,
  User,
} from "lucide-react";
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

const categoryLinks = [
  { label: "SuperDeals", href: "/products?deal=super", accent: true },
  { label: "TableEco Business", href: "/business-registration" },
  { label: "Automotive", href: "/products?category=Automotive" },
  { label: "Appliances", href: "/products?category=Appliances" },
  { label: "Women's Clothing", href: "/products?category=Women" },
  { label: "Men's Clothing", href: "/products?category=Men" },
  { label: "Toys & Games", href: "/products?category=Toys" },
  { label: "Furniture", href: "/products?category=Furniture" },
  { label: "Beauty & Health", href: "/products?category=Beauty" },
  { label: "Shoes", href: "/products?category=Shoes" },
];

const megaCategories = [
  { label: "Men's Clothing", icon: Shirt },
  { label: "Toys & Games", icon: Gamepad2 },
  { label: "Furniture", icon: Sofa },
  { label: "Beauty & Health", icon: HeartPulse },
  { label: "Shoes", icon: Dumbbell },
  { label: "Hair Extensions & Wigs", icon: User },
  { label: "Jewelry & Accessories", icon: Gem },
  { label: "Pet Supplies", icon: PawPrint },
  { label: "Electronics", icon: Monitor },
  { label: "Cell Phones & Accessories", icon: Smartphone },
  { label: "Patio, Lawn & Garden", icon: Sofa },
  { label: "Tools & Home Improvement", icon: Hammer },
  { label: "Baby & Maternity", icon: Baby },
  { label: "Bags & Luggage", icon: Briefcase },
  { label: "Sports & Outdoors", icon: Dumbbell },
];

const menRecommended = [
  { label: "T-Shirts & Tank Tops", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=160&q=80" },
  { label: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=160&q=80" },
  { label: "Underwear", image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=160&q=80" },
  { label: "Suits & Separates", image: "https://images.unsplash.com/photo-1593032465171-8bd9f6f7d7f6?auto=format&fit=crop&w=160&q=80" },
  { label: "Polo Shirts", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=160&q=80" },
  { label: "Casual Cargo", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=160&q=80" },
  { label: "Pants", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=160&q=80" },
  { label: "Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=160&q=80" },
  { label: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=160&q=80" },
  { label: "Joggers", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=160&q=80" },
  { label: "Matching Sets", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=160&q=80" },
  { label: "Jackets & Coats", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=160&q=80" },
];

const menColumns = [
  { title: "Pants & Jeans", items: ["Jeans", "Casual & Cargo Pants", "Sweatpants & Joggers", "Active & Performance"] },
  { title: "Underwear, Socks & Loungewear", items: ["Socks", "Underwear", "Shapewear", "Pajamas & Robes", "Thermal Underwear"] },
  { title: "Shorts", items: ["Denim Shorts", "Casual & Cargo Shorts"] },
  { title: "Tops", items: ["Polo Shirts", "Shirts", "Hoodies & Sweatshirts", "T-Shirts & Tank Tops"] },
  { title: "Suits & Tailoring", items: ["Suits & Separates"] },
  { title: "Coats & Jackets", items: ["Down Coats & Parkas", "Wool & Trench Coats", "Leather & Fur Coats", "Jackets & Light Coats"] },
  { title: "Other Apparel", items: ["Denim Tops", "Swimwear", "Matching Sets", "Overalls & Jumpsuits"] },
];

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const viewportWidthClass = "mx-auto w-[90vw] max-w-[1600px]";
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState("/");
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState("Men's Clothing");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const clearHoverTimers = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openCategoriesWithDelay = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!isCategoriesOpen) {
      openTimerRef.current = setTimeout(() => setIsCategoriesOpen(true), 70);
    }
  };

  const closeCategoriesWithDelay = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => setIsCategoriesOpen(false), 140);
  };

  useEffect(() => {
    return () => clearHoverTimers();
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/85">
        <div className={`${viewportWidthClass} px-3 sm:px-4`}>
          <div className="flex h-20 items-center gap-3">
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
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

            <Link href="/" className="shrink-0 text-[24px] leading-none font-black tracking-tight text-[#222]">
              <span className="text-[#f5a600]">A</span>liExpress
            </Link>

            <div className="relative ml-1 hidden flex-1 items-center lg:flex">
              <Search className="pointer-events-none absolute left-5 h-4 w-4 text-slate-500" />
              <Input
                className="h-11 rounded-full border border-slate-300 bg-white pl-12 pr-24 text-[17px]"
                placeholder="iPhone 17 Pro Max Phone"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              <button
                type="button"
                className="absolute right-16 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
                aria-label="Visual search"
              >
                <ScanSearch className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="absolute right-2 inline-flex h-9 w-16 items-center justify-center rounded-full bg-[#191919] text-white"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              {showSuggestions && searchOptions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border bg-popover shadow-md">
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

            <div className="ml-auto hidden items-center gap-5 lg:flex">
              <Link href="/about" className="flex items-center gap-2 text-[#222] hover:text-black">
                <Download className="h-5 w-5" />
                <span className="text-sm leading-tight font-semibold">
                  Download the
                  <br />
                  TableEco app
                </span>
              </Link>

              <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#222]">
                <Globe className="h-4 w-4" /> EN / KHR <ChevronDown className="h-4 w-4" />
              </button>

              {isAuthenticated ? (
                <UserDropdown theme="light" />
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-[#222] hover:text-black">
                  <User className="h-5 w-5" />
                  <span className="text-sm leading-tight font-semibold">
                    Welcome
                    <br />
                    Sign in / Register
                  </span>
                </Link>
              )}

              <Link href="/cart" className="relative inline-flex items-center gap-2 text-[#222] hover:text-black">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#191919] px-1 text-[11px] font-bold text-white">
                  0
                </span>
                <span className="text-base leading-none font-semibold">Cart</span>
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-1 lg:hidden">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/products" aria-label="Search products">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Open cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden border-t border-black/8 md:block">
          <div className={`${viewportWidthClass} flex h-16 items-center gap-4 px-3 sm:px-4`}>
            <div
              className="relative"
              onMouseEnter={openCategoriesWithDelay}
              onMouseLeave={closeCategoriesWithDelay}
            >
              <Button
                variant="outline"
                type="button"
                aria-expanded={isCategoriesOpen}
                className={`h-11 min-w-56 justify-start rounded-full border-2 px-5 text-base font-semibold transition-colors ${
                  isCategoriesOpen
                    ? "border-[#1e6fff] bg-[#f3f8ff] text-[#0e3b84]"
                    : "border-[#1e6fff] bg-white text-[#222] hover:bg-[#f8fbff]"
                }`}
              >
                <Menu className="mr-2 h-5 w-5" />
                All Categories
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : "rotate-0"}`} />
              </Button>
            </div>

            <nav className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto whitespace-nowrap text-[15px] font-medium text-[#222]">
              {categoryLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={item.accent ? "font-bold text-[#ff4e57]" : "hover:text-black"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {isCategoriesOpen && (
          <div
            className="hidden border-t border-black/10 bg-transparent md:block"
            onMouseEnter={openCategoriesWithDelay}
            onMouseLeave={closeCategoriesWithDelay}
          >
            <div className={`${viewportWidthClass} grid grid-cols-[300px_1fr] gap-5 rounded-b-2xl bg-white px-3 py-4 shadow-[0_24px_44px_rgba(0,0,0,0.14)]`}>
              <aside className="overflow-hidden rounded-xl border border-black/8 bg-[#f3f3f3]">
                <ul className="divide-y divide-black/6">
                  {megaCategories.map((category) => {
                    const Icon = category.icon;
                    const active = category.label === activeMegaCategory;

                    return (
                      <li key={category.label}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveMegaCategory(category.label)}
                          onClick={() => setActiveMegaCategory(category.label)}
                          className={`relative flex w-full items-center gap-3 px-5 py-3 text-left text-[15px] transition-colors ${
                            active ? "bg-white font-semibold text-black" : "text-[#2d2d2d] hover:bg-white/70"
                          }`}
                        >
                          {active && <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#1e6fff]" />}
                          <Icon className="h-5 w-5 text-[#444]" />
                          <span>{category.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              <section className="rounded-xl border border-black/8 bg-[#fafafa] p-4">
                <h3 className="text-2xl font-semibold text-[#222]">{activeMegaCategory}</h3>
                <p className="mt-1 text-xs text-[#595959]">Popular choices curated for quick discovery</p>

                <div className="mt-4 border-b border-black/10 pb-5">
                  <h4 className="text-xl font-semibold text-[#222]">Recommended</h4>
                  <div className="mt-3 grid grid-cols-6 gap-x-4 gap-y-5 xl:grid-cols-12">
                    {menRecommended.map((item) => (
                      <Link key={item.label} href="/products" className="group text-center">
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={64}
                          height={64}
                          unoptimized
                          className="mx-auto h-16 w-16 rounded-[5px] object-cover"
                        />
                        <p className="mt-2 line-clamp-2 text-[12px] font-medium text-[#1f1f1f] group-hover:underline">
                          {item.label}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-b border-black/10 pb-5">
                  <h4 className="text-xl font-semibold text-[#222]">Shop By Brand</h4>
                  <div className="mt-3 inline-flex flex-col">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[5px] bg-black text-xs font-bold text-white">
                      TRVLWEGO
                    </div>
                    <p className="mt-2 text-xs text-[#222]">TRVLWEGO...</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
                  {menColumns.map((column) => (
                    <div key={column.title}>
                      <h5 className="text-base font-semibold text-[#222]">{column.title}</h5>
                      <ul className="mt-3 space-y-2">
                        {column.items.map((item) => (
                          <li key={item}>
                            <Link href="/products" className="text-[13px] text-[#2a2a2a] hover:text-black hover:underline">
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className={`${viewportWidthClass} flex-1 px-3 py-4 pb-20 sm:px-4 md:pb-6`}>
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
