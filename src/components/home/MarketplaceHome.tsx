"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BadgePercent,
  Gift,
  ShieldCheck,
  Star,
  Timer,
  Truck,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumHeroSection from "@/components/home/hero/PremiumHeroSection";

type DealProduct = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  sold: number;
  discount: number;
  image: string;
};

type Category = {
  id: number;
  label: string;
};

const categories: Category[] = [
  { id: 1, label: "Living Room" },
  { id: 2, label: "Dining" },
  { id: 3, label: "Bedroom" },
  { id: 4, label: "Office" },
  { id: 5, label: "Lighting" },
  { id: 6, label: "Storage" },
  { id: 7, label: "Decor" },
  { id: 8, label: "Outdoor" },
];

const flashDeals: DealProduct[] = [
  {
    id: 101,
    name: "Nordic Oak Dining Table",
    price: 229,
    oldPrice: 399,
    sold: 344,
    discount: 42,
    image:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 102,
    name: "Modern Velvet Accent Chair",
    price: 139,
    oldPrice: 219,
    sold: 511,
    discount: 37,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 103,
    name: "Minimalist Bedside Lamp",
    price: 34,
    oldPrice: 59,
    sold: 840,
    discount: 42,
    image:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 104,
    name: "Industrial TV Console",
    price: 199,
    oldPrice: 315,
    sold: 286,
    discount: 36,
    image:
      "https://images.unsplash.com/photo-1616627452091-7d2e4f7f2df8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 105,
    name: "Ergonomic Mesh Office Chair",
    price: 169,
    oldPrice: 249,
    sold: 472,
    discount: 32,
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 106,
    name: "Marble Side Coffee Table",
    price: 79,
    oldPrice: 129,
    sold: 903,
    discount: 39,
    image:
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?auto=format&fit=crop&w=900&q=80",
  },
];

const recommendationProducts: DealProduct[] = [
  {
    id: 201,
    name: "Scandinavian 3-Seater Sofa",
    price: 459,
    oldPrice: 699,
    sold: 124,
    discount: 34,
    image:
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 202,
    name: "Walnut Storage Cabinet",
    price: 219,
    oldPrice: 349,
    sold: 273,
    discount: 37,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 203,
    name: "Soft Wool Area Rug",
    price: 69,
    oldPrice: 99,
    sold: 1180,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 204,
    name: "Floating Wall Shelf Set",
    price: 49,
    oldPrice: 79,
    sold: 780,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 205,
    name: "Round Mirror Black Frame",
    price: 59,
    oldPrice: 89,
    sold: 463,
    discount: 34,
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 206,
    name: "Foldable Work Desk",
    price: 149,
    oldPrice: 239,
    sold: 309,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 207,
    name: "Dining Chair Set of 2",
    price: 129,
    oldPrice: 189,
    sold: 630,
    discount: 32,
    image:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 208,
    name: "Woven Pendant Ceiling Light",
    price: 89,
    oldPrice: 149,
    sold: 234,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
  },
];

const valueProps = [
  { id: "secure", label: "Buyer Protection", icon: ShieldCheck },
  { id: "delivery", label: "Fast Shipping", icon: Truck },
  { id: "deals", label: "Daily Deals", icon: BadgePercent },
  { id: "payment", label: "Safe Payments", icon: Wallet },
  { id: "bonus", label: "Reward Coupons", icon: Gift },
];

const countdownTarget = 5 * 60 * 60 + 38 * 60 + 22;

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

function ProductDealCard({ product }: { product: DealProduct }) {
  return (
    <Card className="border border-border/70 p-0 shadow-none transition-all hover:-translate-y-1 hover:shadow-md">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative">
            <Image
              src={product.image}
              alt={product.name}
              width={520}
              height={520}
              unoptimized
              className="h-48 w-full object-cover"
            />
            <Badge className="absolute left-2 top-2 rounded-[5px] bg-[#ff4747] text-white hover:bg-[#ff4747]">
              -{product.discount}%
            </Badge>
          </div>
          <div className="space-y-2 p-3">
            <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-base font-bold text-[#ff4747]">{formatMoney(product.price)}</p>
              <p className="text-xs text-muted-foreground line-through">{formatMoney(product.oldPrice)}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{product.sold} sold</span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
                4.8
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function MarketplaceHome() {
  const [secondsLeft, setSecondsLeft] = useState(countdownTarget);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return countdownTarget;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const hours = Math.floor(secondsLeft / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((secondsLeft % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, [secondsLeft]);

  return (
    <div className="space-y-6 pb-4">
      <PremiumHeroSection />

      <section className="rounded-[5px] border bg-card p-3 sm:p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.label)}`}
              className="whitespace-nowrap rounded-full border border-border/70 bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#ff6600]/50 hover:text-[#ff6600]"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[5px] border bg-card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-[5px] bg-[#ffefef] px-3 py-1.5 text-[#ff4747]">
            <Timer className="h-4 w-4" />
            <span className="text-sm font-semibold">Flash Deals</span>
          </div>
          <p className="rounded-[5px] bg-slate-900 px-3 py-1.5 font-mono text-sm text-white">{countdown}</p>
          <p className="text-xs text-muted-foreground">Ending soon - limited stock</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {flashDeals.map((product) => (
            <ProductDealCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-dashed border-[#ff6600]/40 bg-[#fff8f2] p-0">
          <CardContent className="flex items-start justify-between gap-2 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#ff6600]">Coupon Center</p>
              <p className="mt-1 text-xl font-bold text-[#2b2b2b]">$20 OFF</p>
              <p className="mt-1 text-xs text-muted-foreground">On orders above $150</p>
            </div>
            <Button size="sm" className="rounded-[5px] bg-[#ff6600] text-white hover:bg-[#e75d00]">
              Collect
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-dashed border-[#ff6600]/40 bg-[#fff8f2] p-0">
          <CardContent className="flex items-start justify-between gap-2 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#ff6600]">Bundle Deal</p>
              <p className="mt-1 text-xl font-bold text-[#2b2b2b]">Buy 2 Save 15%</p>
              <p className="mt-1 text-xs text-muted-foreground">Mix chairs, lamps, and decor</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-[5px] border-[#ff6600] text-[#ff6600]">
              View
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-dashed border-[#ff6600]/40 bg-[#fff8f2] p-0 md:col-span-2 xl:col-span-1">
          <CardContent className="flex items-start justify-between gap-2 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#ff6600]">Coins Reward</p>
              <p className="mt-1 text-xl font-bold text-[#2b2b2b]">Earn 5x Coins</p>
              <p className="mt-1 text-xs text-muted-foreground">Use coins at checkout</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-[5px] border-[#ff6600] text-[#ff6600]">
              Start
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-[5px] border bg-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#ff6600]">Recommended For You</p>
            <h2 className="text-2xl font-bold text-foreground">Just For You</h2>
          </div>
          <Button asChild variant="outline" className="rounded-[5px]">
            <Link href="/products">View More</Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {recommendationProducts.map((product) => (
            <ProductDealCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-[5px] border bg-card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {valueProps.map(({ id, label, icon: Icon }) => (
            <div key={id} className="flex items-center gap-3 rounded-[5px] border bg-muted/20 px-3 py-2">
              <div className="rounded-[5px] bg-[#fff3eb] p-2 text-[#ff6600]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


