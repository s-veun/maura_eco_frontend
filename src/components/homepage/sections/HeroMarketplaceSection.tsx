"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MuiProduct } from "@/components/mui/MuiProductCard";

type CategoryItem = { title: string; image: string };

type HeroMarketplaceSectionProps = {
  categories: CategoryItem[];
  promos: MuiProduct[];
  anchorEl: HTMLElement | null;
  onOpenMenuAction: (target: HTMLElement) => void;
  onCloseMenuAction: () => void;
};

export default function HeroMarketplaceSection({ categories, promos }: HeroMarketplaceSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_7fr_2.5fr] gap-4">
      {/* Sidebar Categories */}
      <div className="hidden lg:block">
        <div className="border rounded-2xl bg-card shadow-sm h-full overflow-hidden">
          <div className="p-3 border-b">
            <p className="text-sm font-bold">Categories</p>
          </div>
          <ul>
            {categories.slice(0, 8).map((item) => (
              <li key={item.title}>
                <Link
                  href="/products"
                  className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-[13px] font-medium">{item.title}</span>
                  <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Banner */}
      <div
        className="rounded-2xl flex flex-col justify-center p-6 md:p-10 min-h-[280px] md:min-h-[340px] text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(90, 62, 168, 0.95), rgba(90, 62, 168, 0.4)), url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-sm">
          <p className="tracking-widest text-[11px] font-semibold opacity-90 uppercase">PREMIUM FURNITURE</p>
          <h2 className="mt-2 mb-3 font-extrabold text-4xl md:text-5xl leading-tight">
            Elevate Your Living Space.
          </h2>
          <p className="opacity-90 mb-6 text-sm leading-relaxed">
            Discover curated modern tables and premium home decor with up to 40% off on selected items.
          </p>
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8">
            Shop Now
          </Button>
        </div>
      </div>

      {/* Side Promos */}
      <div className="flex flex-col gap-3 h-full">
        {promos.slice(0, 2).map((item, index) => (
          <div
            key={item.id}
            className="flex-1 rounded-2xl p-4 flex flex-col justify-center border"
            style={{
              background: index === 0 ? "linear-gradient(135deg, #f7f5fc, #ede7ff)" : "linear-gradient(135deg, #fff2f1, #ffe4e1)",
              borderColor: index === 0 ? "#e6def8" : "#fcd8d5",
            }}
          >
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${index === 0 ? "text-primary" : "text-destructive"}`}
            >
              {index === 0 ? "New Arrival" : "Clearance"}
            </span>
            <p className="mt-1 mb-3 font-bold text-foreground leading-tight line-clamp-2">{item.title}</p>
            <div className="mt-auto">
              <Link
                href={`/products/${item.id}`}
                className={`flex items-center gap-1 text-sm font-bold ${index === 0 ? "text-primary" : "text-destructive"}`}
              >
                Buy Now <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
