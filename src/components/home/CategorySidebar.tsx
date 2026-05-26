"use client";

import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryViewModel } from "@/types/homepage";

const PRIMARY = "#7356c2";

const DEFAULT_CATEGORIES = [
  { key: "electronics", label: "Electronics", count: 128 },
  { key: "furniture", label: "Furniture", count: 89 },
  { key: "fashion", label: "Fashion", count: 234 },
  { key: "grocery", label: "Grocery", count: 456 },
  { key: "beauty", label: "Beauty", count: 167 },
  { key: "sports", label: "Sports", count: 93 },
  { key: "gaming", label: "Gaming", count: 71 },
  { key: "accessories", label: "Accessories", count: 145 },
  { key: "home-garden", label: "Home & Garden", count: 112 },
  { key: "automotive", label: "Automotive", count: 58 },
  { key: "health", label: "Health & Wellness", count: 203 },
  { key: "deals", label: "Hot Deals", count: 99 },
];

type CategorySidebarProps = {
  categories?: CategoryViewModel[];
  selectedKey?: string;
};

export function CategorySidebar({ categories = [], selectedKey }: CategorySidebarProps) {
  const router = useRouter();

  const menuItems =
    categories.length > 0
      ? categories.slice(0, 12).map((cat) => ({
          key: String(cat.catId),
          label: cat.catName,
          count: cat.productCount,
          onClick: () => router.push(`/products?category=${encodeURIComponent(cat.slug || cat.catName)}`),
        }))
      : DEFAULT_CATEGORIES.map((cat) => ({
          key: cat.key,
          label: cat.label,
          count: cat.count,
          onClick: () => router.push(`/products?category=${encodeURIComponent(cat.key)}`),
        }));

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(115,86,194,0.10)] bg-white sticky top-[76px]">
      {/* Header */}
      <div className="px-[18px] py-[13px]" style={{ background: `linear-gradient(135deg, ${PRIMARY}, #5c44a3)` }}>
        <span className="text-white font-semibold text-[13.5px] tracking-[0.3px]">📦 All Categories</span>
      </div>

      {/* Menu */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={item.onClick}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors text-left",
              selectedKey === item.key ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-700"
            )}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-3.5 w-3.5 flex-shrink-0" style={{ color: PRIMARY }} />
              <span className="text-[13px]">{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(115,86,194,0.12)", color: PRIMARY }}>
                {item.count > 99 ? "99+" : item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer link */}
      <div className="px-4 py-2.5 border-t border-[#f5f0ff] bg-[rgba(115,86,194,0.03)] text-center">
        <button onClick={() => router.push("/products")} className="text-[12.5px] font-semibold cursor-pointer" style={{ color: PRIMARY }}>
          View All Categories →
        </button>
      </div>
    </div>
  );
}

export default CategorySidebar;
