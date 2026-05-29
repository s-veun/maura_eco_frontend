"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  ChevronDown,
  Globe,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/auth/AuthProvider";
import { useProductSearchQuery } from "@/hooks/use-ecommerce-queries";
import { cn } from "@/lib/utils";
import { useGetCartQuery, useGetWishlistQuery } from "@/redux/api/productApi";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type PremiumHeaderProps = {
  showHeroOverlay?: boolean;
};

type MegaMenuConfig = {
  title: string;
  href: string;
  links: { label: string; href: string }[];
  promoTitle: string;
  promoDescription: string;
  promoImage: string;
  promoHref: string;
};

const ANNOUNCEMENTS = [
  "Premium Furniture Collection",
  "Crafted For Modern Living",
  "Free Delivery Nationwide",
  "Sustainable Wood Furniture",
];

const PRIMARY_NAV = [
  { label: "Dining Tables", href: "/products?category=Dining", mega: "dining" },
  { label: "Coffee Tables", href: "/products?category=Coffee" },
  { label: "Office Tables", href: "/products?category=Office" },
  { label: "Living Room", href: "/products?category=Living", mega: "living" },
  { label: "Bedroom", href: "/products?category=Bedroom", mega: "bedroom" },
  { label: "Outdoor", href: "/products?category=Outdoor" },
  { label: "Collections", href: "/products?collection=premium", badge: "New Collection" },
  { label: "Inspiration", href: "/home#inspiration" },
];

const MEGA_MENUS: Record<string, MegaMenuConfig> = {
  dining: {
    title: "Dining Tables",
    href: "/products?category=Dining",
    links: [
      { label: "Solid Wood Tables", href: "/products?search=solid%20wood%20table" },
      { label: "Modern Tables", href: "/products?search=modern%20dining%20table" },
      { label: "Luxury Tables", href: "/products?search=luxury%20dining%20table" },
      { label: "New Arrivals", href: "/products?sort=new-arrivals" },
    ],
    promoTitle: "Signature Dining 2026",
    promoDescription: "Hand-finished oak dining sets crafted for elevated hosting.",
    promoImage: "https://images.unsplash.com/photo-1617104551722-3b2d513664c0?auto=format&fit=crop&w=1600&q=80",
    promoHref: "/products?collection=dining",
  },
  living: {
    title: "Living Room",
    href: "/products?category=Living",
    links: [
      { label: "Coffee Tables", href: "/products?search=coffee%20table" },
      { label: "Side Tables", href: "/products?search=side%20table" },
      { label: "TV Units", href: "/products?search=tv%20unit" },
      { label: "Storage Pieces", href: "/products?search=living%20storage" },
    ],
    promoTitle: "Layered Living Spaces",
    promoDescription: "Scandinavian silhouettes with warm materials and clean lines.",
    promoImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    promoHref: "/products?collection=living",
  },
  bedroom: {
    title: "Bedroom",
    href: "/products?category=Bedroom",
    links: [
      { label: "Bed Frames", href: "/products?search=bed%20frame" },
      { label: "Nightstands", href: "/products?search=nightstand" },
      { label: "Storage", href: "/products?search=bedroom%20storage" },
      { label: "Textural Collection", href: "/products?search=bedroom%20collection" },
    ],
    promoTitle: "Calm Bedroom Collection",
    promoDescription: "Furniture for restful spaces, tailored for modern routines.",
    promoImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    promoHref: "/products?collection=bedroom",
  },
};

const POPULAR_SEARCHES = ["walnut dining table", "minimal coffee table", "oak office desk", "outdoor lounge"];
const COLLECTION_SUGGESTIONS = [
  { label: "Premium Dining Collection", href: "/products?collection=dining" },
  { label: "Modern Workspace Collection", href: "/products?collection=workspace" },
  { label: "Luxury Living Collection", href: "/products?collection=living" },
];

function extractWishlistCount(payload: unknown) {
  if (Array.isArray(payload)) return payload.length;
  if (!payload || typeof payload !== "object") return 0;
  const record = payload as {
    items?: unknown[];
    products?: unknown[];
    data?: unknown[];
    totalItems?: number;
    total?: number;
    count?: number;
  };
  if (Array.isArray(record.items)) return record.items.length;
  if (Array.isArray(record.products)) return record.products.length;
  if (Array.isArray(record.data)) return record.data.length;
  if (typeof record.totalItems === "number") return record.totalItems;
  if (typeof record.total === "number") return record.total;
  if (typeof record.count === "number") return record.count;
  return 0;
}

export default function PremiumHeader({ showHeroOverlay = true }: PremiumHeaderProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { openDrawer } = useCartDrawer();

  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("tableeco-recent-searches");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored) as string[];
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch {
      return [];
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("USD");

  const { data: searchProducts = [] } = useProductSearchQuery(searchInput, searchInput.trim().length > 1 && searchOpen);
  const { data: cart } = useGetCartQuery(user?.id ?? skipToken);
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = extractWishlistCount(wishlist);
  const cartPreviewItems = cart?.items?.slice(0, 3) ?? [];
  const cartSubtotal = cart?.totalPrice ?? 0;

  const enableOverlay = currentPath === "/" && showHeroOverlay;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  const searchSuggestions = useMemo(
    () => searchProducts.slice(0, 6).map((item) => ({ id: item.proId, name: item.proName })),
    [searchProducts],
  );

  const currentMegaMenu = activeMegaMenu ? MEGA_MENUS[activeMegaMenu] : null;

  const headerTextClass = "text-[#1F2937]";

  const saveRecentSearch = (query: string) => {
    const normalized = query.trim();
    if (!normalized) return;

    setRecentSearches((prev) => {
      const next = [normalized, ...prev.filter((item) => item !== normalized)].slice(0, 5);
      window.localStorage.setItem("tableeco-recent-searches", JSON.stringify(next));
      return next;
    });
  };

  const runSearch = (query: string) => {
    const keyword = query.trim();
    if (!keyword) return;
    saveRecentSearch(keyword);
    setSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-[#1F2937]/[0.06] transition-all duration-300",
        isScrolled
          ? "bg-white/98 shadow-[0_10px_30px_rgba(31,41,55,0.05)] backdrop-blur-xl"
          : enableOverlay
            ? "bg-white/85 backdrop-blur-lg"
            : "bg-white",
      )}
    >
      <div className="h-9 border-none bg-[#DBCEA5]">
        <div className="mx-auto flex w-[90vw] items-center justify-center overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] tracking-[0.2em] text-[#1F2937] uppercase"
            >
              {ANNOUNCEMENTS[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className={cn("transition-all duration-300", isScrolled ? "py-2" : "py-3.5")}>
        <div className="mx-auto flex w-[90vw] items-center gap-6">
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-[5px] bg-[#8A7650]" aria-hidden />
              <p className={cn("text-2xl font-semibold tracking-tight", headerTextClass)}>TableEco</p>
            </div>
            <p className="text-[10px] tracking-[0.16em] text-[#1F2937]/60 uppercase">Crafted For Modern Living</p>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex" onMouseLeave={() => setActiveMegaMenu(null)}>
            {PRIMARY_NAV.map((item) => {
              const active =
                currentPath === item.href ||
                (item.href !== "/" && currentPath.startsWith(item.href.split("?")[0]));

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu(item.mega || null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors",
                      headerTextClass,
                      active && "text-[#8A7650]",
                      "hover:text-[#8A7650]",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <Badge className="rounded-[5px] bg-[#8A7650] px-2 py-0.5 text-[10px] text-white hover:bg-[#8A7650]">
                        {item.badge}
                      </Badge>
                    ) : null}
                    {item.mega ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                    <span
                      className={cn(
                        "absolute -bottom-[2px] left-0 h-[1px] w-full origin-left scale-x-0 bg-[#8A7650] transition-transform duration-300 group-hover:scale-x-100",
                        active && "scale-x-100",
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-[5px] hover:bg-[#ECE7D1]/65", headerTextClass)}
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4.5 w-4.5" />
            </Button>

            <Link
              href={isAuthenticated ? "/profile/wishlist" : "/login"}
              className={cn("relative inline-flex h-9 w-9 items-center justify-center rounded-[5px] transition-colors hover:bg-[#ECE7D1]/65", headerTextClass)}
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-[5px] bg-[#8A7650] px-1 text-[10px] font-medium text-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              className={cn("hidden h-9 w-9 items-center justify-center rounded-[5px] transition-colors hover:bg-[#ECE7D1]/65 md:inline-flex", headerTextClass)}
              aria-label="Account"
            >
              <User className="h-4.5 w-4.5" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn("relative inline-flex h-9 w-9 items-center justify-center rounded-[5px] transition-colors hover:bg-[#ECE7D1]/65", headerTextClass)}
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  {cartItemCount > 0 ? (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-[5px] bg-[#8A7650] px-1 text-[10px] font-medium text-white">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  ) : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-[5px] border-none bg-white p-4 shadow-none">
                <p className="mb-3 text-sm font-medium text-[#1F2937]">Cart Preview</p>
                {cartPreviewItems.length > 0 ? (
                  <div className="space-y-3">
                    {cartPreviewItems.map((item) => (
                      <div key={`${item.productId}-${item.id}`} className="flex items-center justify-between text-sm text-[#1F2937]/80">
                        <p className="line-clamp-1 pr-4">{item.productName}</p>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                    <div className="mt-3 flex items-center justify-between border-none bg-[#ECE7D1]/70 p-2.5 rounded-[5px]">
                      <span className="text-sm text-[#1F2937]/70">Subtotal</span>
                      <span className="text-sm font-semibold text-[#1F2937]">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="h-9 w-full rounded-[5px] bg-[#8A7650] text-white hover:bg-[#746445]"
                      onClick={openDrawer}
                    >
                      View Cart
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-[#1F2937]/65">Your cart is currently empty.</p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden items-center gap-2 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn("inline-flex items-center gap-1 rounded-[5px] px-2 py-1 text-xs", headerTextClass, "hover:bg-[#ECE7D1]/65") }>
                    <Globe className="h-3.5 w-3.5" />
                    {language}/{currency}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 rounded-[5px] border-none bg-white shadow-none">
                  <DropdownMenuItem className="text-xs font-medium text-[#1F2937]/80">Language</DropdownMenuItem>
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    <DropdownMenuRadioItem value="EN">English</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="KH">Khmer</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuItem className="mt-2 text-xs font-medium text-[#1F2937]/80">Currency</DropdownMenuItem>
                  <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                    <DropdownMenuRadioItem value="USD">USD</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="KHR">KHR</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button asChild className="h-9 rounded-[5px] bg-[#8A7650] px-3 text-xs text-white hover:bg-[#746445]">
                <Link href="/contact">Book Consultation</Link>
              </Button>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-[5px] lg:hidden hover:bg-[#ECE7D1]/65", headerTextClass)}>
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-none border-none bg-[#ECE7D1] p-0">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-xl font-semibold text-[#1F2937]">TableEco</p>
                      <p className="text-[10px] tracking-[0.16em] uppercase text-[#1F2937]/70">Crafted For Modern Living</p>
                    </div>
                    <Badge className="rounded-[5px] bg-[#8A7650] text-[10px] text-white hover:bg-[#8A7650]">New Collection</Badge>
                  </div>

                  <div className="px-5">
                    <Button
                      variant="outline"
                      className="h-10 w-full justify-start rounded-[5px] border-none bg-white text-[#1F2937]"
                      onClick={() => {
                        setSearchOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Search className="h-4 w-4" />
                      Search furniture and collections
                    </Button>
                  </div>

                  <div className="mt-5 flex-1 overflow-y-auto px-5 pb-6">
                    <div className="space-y-2">
                      {PRIMARY_NAV.filter((item) => !item.mega).map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block rounded-[5px] bg-white/70 px-4 py-3 text-base text-[#1F2937]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <Accordion type="multiple" className="mt-5 rounded-[5px] bg-white/70 px-4">
                      {Object.entries(MEGA_MENUS).map(([key, menu]) => (
                        <AccordionItem key={key} value={key} className="border-none">
                          <AccordionTrigger className="py-3 text-base font-medium text-[#1F2937] hover:no-underline">
                            {menu.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pb-2">
                              {menu.links.map((link) => (
                                <Link
                                  key={link.label}
                                  href={link.href}
                                  className="block py-2 text-sm text-[#1F2937]/75"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <article className="mt-6 overflow-hidden rounded-[5px] bg-white">
                      <div className="relative h-48">
                        <Image
                          src="https://images.unsplash.com/photo-1616594039964-3f40c7cf8f2f?auto=format&fit=crop&w=1400&q=80"
                          alt="Featured premium collection"
                          fill
                          sizes="100vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-2 p-4">
                        <p className="text-xs tracking-[0.15em] uppercase text-[#8A7650]">Featured Collection</p>
                        <p className="text-lg font-medium text-[#1F2937]">Warm Scandinavian Living</p>
                        <Button asChild className="h-9 rounded-[5px] bg-[#8A7650] text-white hover:bg-[#746445]">
                          <Link href="/products?collection=living" onClick={() => setMobileMenuOpen(false)}>
                            Explore Collection
                          </Link>
                        </Button>
                      </div>
                    </article>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {currentMegaMenu ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
            className="hidden border-t border-[#1F2937]/[0.05] bg-white/98 pb-6 pt-2 lg:block"
          >
            <div className="mx-auto grid w-[90vw] grid-cols-[1fr_1.2fr] gap-8 rounded-[5px] bg-[#F8F5EC] p-6">
              <div>
                <p className="text-xs tracking-[0.14em] uppercase text-[#8A7650]">{currentMegaMenu.title}</p>
                <div className="mt-4 grid gap-2">
                  {currentMegaMenu.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="inline-flex w-fit items-center gap-2 rounded-[5px] px-2 py-2 text-sm text-[#1F2937] transition-colors hover:bg-white hover:text-[#8A7650]"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <article className="overflow-hidden rounded-[5px] bg-white">
                <div className="relative h-52">
                  <Image
                    src={currentMegaMenu.promoImage}
                    alt={currentMegaMenu.promoTitle}
                    fill
                    sizes="(max-width: 1200px) 50vw, 45vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-lg font-medium text-[#1F2937]">{currentMegaMenu.promoTitle}</p>
                  <p className="text-sm text-[#1F2937]/70">{currentMegaMenu.promoDescription}</p>
                  <Button asChild className="h-9 rounded-[5px] bg-[#8A7650] text-white hover:bg-[#746445]">
                    <Link href={currentMegaMenu.promoHref}>Explore Collection</Link>
                  </Button>
                </div>
              </article>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="w-[92vw] max-w-4xl rounded-[5px] border-none bg-white p-5 shadow-none md:p-7">
          <DialogTitle className="text-xl font-medium text-[#1F2937]">Search TableEco</DialogTitle>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              runSearch(searchInput);
            }}
            className="mt-3"
          >
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by product, room, or collection"
              className="h-11 rounded-[5px] border-none bg-[#ECE7D1]/70 text-[#1F2937]"
              autoFocus
            />
          </form>

          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs tracking-[0.14em] uppercase text-[#8A7650]">Popular Searches</p>
              {POPULAR_SEARCHES.map((query) => (
                <button
                  key={query}
                  type="button"
                  className="block text-left text-sm text-[#1F2937]/80 transition-colors hover:text-[#8A7650]"
                  onClick={() => runSearch(query)}
                >
                  {query}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs tracking-[0.14em] uppercase text-[#8A7650]">Recent Searches</p>
              {recentSearches.length > 0 ? (
                recentSearches.map((query) => (
                  <button
                    key={query}
                    type="button"
                    className="block text-left text-sm text-[#1F2937]/80 transition-colors hover:text-[#8A7650]"
                    onClick={() => runSearch(query)}
                  >
                    {query}
                  </button>
                ))
              ) : (
                <p className="text-sm text-[#1F2937]/60">No recent searches yet.</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs tracking-[0.14em] uppercase text-[#8A7650]">Collections</p>
              {COLLECTION_SUGGESTIONS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className="block text-sm text-[#1F2937]/80 transition-colors hover:text-[#8A7650]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {searchSuggestions.length > 0 ? (
            <div className="mt-4 rounded-[5px] bg-[#ECE7D1]/55 p-3">
              <div className="mb-2 inline-flex items-center gap-1 text-xs tracking-[0.13em] text-[#8E977D] uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Product Suggestions
              </div>
              <div className="space-y-1">
                {searchSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/products/${item.id}`);
                    }}
                    className="block w-full rounded-[5px] px-2 py-2 text-left text-sm text-[#1F2937] transition-colors hover:bg-white"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </header>
  );
}


