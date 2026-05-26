"use client";

import { useRouter } from "next/navigation";
import type { CategoryViewModel } from "@/types/homepage";

const PRIMARY = "#7356c2";

const DEFAULT_CATS = [
  { key: "electronics", label: "Electronics", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", emoji: "💻" },
  { key: "furniture", label: "Furniture", bg: "linear-gradient(135deg,#fae8ff,#f3d1ff)", emoji: "🛋️" },
  { key: "fashion", label: "Fashion", bg: "linear-gradient(135deg,#fce7f3,#fdd6e8)", emoji: "👗" },
  { key: "grocery", label: "Grocery", bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", emoji: "🛒" },
  { key: "beauty", label: "Beauty", bg: "linear-gradient(135deg,#fff1dd,#ffe4b8)", emoji: "💄" },
  { key: "sports", label: "Sports", bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", emoji: "⚽" },
  { key: "health", label: "Health", bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", emoji: "💊" },
  { key: "automotive", label: "Automotive", bg: "linear-gradient(135deg,#fef3c7,#fde68a)", emoji: "🚗" },
  { key: "home-garden", label: "Home & Garden", bg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", emoji: "🌿" },
  { key: "deals", label: "Hot Deals", bg: "linear-gradient(135deg,#fee2e2,#fca5a5)", emoji: "🔥" },
];

type Props = {
  categories?: CategoryViewModel[];
};

export function CategoryIconRow({ categories = [] }: Props) {
  const router = useRouter();

  const items =
    categories.length > 0
      ? categories.slice(0, 10).map((cat, i) => ({
          key: String(cat.catId),
          label: cat.catName,
          bg: DEFAULT_CATS[i % DEFAULT_CATS.length].bg,
          emoji: DEFAULT_CATS[i % DEFAULT_CATS.length].emoji,
          onClick: () => router.push(`/products?category=${encodeURIComponent(cat.slug || cat.catName)}`),
        }))
      : DEFAULT_CATS.map((cat) => ({
          key: cat.key,
          label: cat.label,
          bg: cat.bg,
          emoji: cat.emoji,
          onClick: () => router.push(`/products?category=${encodeURIComponent(cat.key)}`),
        }));

  return (
    <div className="bg-white rounded-2xl px-5 py-[18px] shadow-[0_2px_14px_rgba(115,86,194,0.07)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-[18px] rounded-full" style={{ background: `linear-gradient(180deg,${PRIMARY},#a78bfa)` }} />
          <span className="font-semibold text-[15px] text-gray-800">Shop by Category</span>
        </div>
        <button onClick={() => router.push("/products")} className="text-xs font-semibold cursor-pointer" style={{ color: PRIMARY }}>
          View All →
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5">
        {items.map((cat) => (
          <div key={cat.key} className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={cat.onClick}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
              style={{ background: cat.bg }}
            >
              {cat.emoji}
            </div>
            <span className="text-[11px] text-center text-gray-600 leading-tight font-medium">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryIconRow;
