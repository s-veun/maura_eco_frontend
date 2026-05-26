"use client";

import { useState } from "react";
import { ChevronDown, Star, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/api";

export interface SidebarFilters {
  categories: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  availability: "all" | "inStock";
}

interface CatalogSidebarProps {
  categories: CategoryDTO[];
  filters: SidebarFilters;
  onChange: (patch: Partial<SidebarFilters>) => void;
  onReset: () => void;
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-[13px] font-semibold uppercase tracking-wider text-slate-600"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
      <Separator />
    </div>
  );
}

export function CatalogSidebar({ categories, filters, onChange, onReset }: CatalogSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 || filters.rating > 0 || filters.availability !== "all";

  const toggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onChange({ categories: next });
  };

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#E69F2C] hover:text-[#c8850f] transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>
      <Separator />

      {/* Categories */}
      <Section title="Category">
        <div className="mt-1 space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.categories.length === 0}
              onChange={() => onChange({ categories: [] })}
              className="h-3.5 w-3.5 accent-[#E69F2C]"
            />
            <span className="text-[13px] text-slate-700">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.catId} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.categories.includes(String(cat.catId))}
                onChange={() => toggleCategory(String(cat.catId))}
                className="h-3.5 w-3.5 accent-[#E69F2C]"
              />
              <span className="text-[13px] text-slate-700">{cat.catName}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <div className="mt-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>${filters.priceMin}</span>
            <span>${filters.priceMax}</span>
          </div>
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={filters.priceMax}
            onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
            className="w-full accent-[#E69F2C]"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceMin}
              min={0}
              onChange={(e) => onChange({ priceMin: Number(e.target.value) })}
              className="w-full rounded-[5px] border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:border-[#E69F2C]/60 focus:outline-none"
              placeholder="Min"
            />
            <span className="text-slate-400 text-xs">–</span>
            <input
              type="number"
              value={filters.priceMax}
              min={0}
              onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
              className="w-full rounded-[5px] border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:border-[#E69F2C]/60 focus:outline-none"
              placeholder="Max"
            />
          </div>
        </div>
      </Section>

      {/* Rating */}
      <Section title="Rating">
        <div className="mt-1 space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="rating-filter"
                checked={filters.rating === r}
                onChange={() => onChange({ rating: r })}
                className="h-3.5 w-3.5 accent-[#E69F2C]"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < r ? "fill-[#E69F2C] text-[#E69F2C]" : "fill-slate-200 text-slate-200"
                    )}
                  />
                ))}
                <span className="ml-1 text-[12px] text-slate-500">& up</span>
              </div>
            </label>
          ))}
          {filters.rating > 0 && (
            <button
              onClick={() => onChange({ rating: 0 })}
              className="mt-0.5 text-xs text-slate-400 hover:text-[#E69F2C] transition-colors"
            >
              Clear rating
            </button>
          )}
        </div>
      </Section>

      {/* Availability */}
      <Section title="Availability" defaultOpen={false}>
        <div className="mt-1 space-y-2">
          {(["all", "inStock"] as const).map((val) => (
            <label key={val} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="availability-filter"
                checked={filters.availability === val}
                onChange={() => onChange({ availability: val })}
                className="h-3.5 w-3.5 accent-[#E69F2C]"
              />
              <span className="text-[13px] text-slate-700">
                {val === "all" ? "All Products" : "In Stock Only"}
              </span>
            </label>
          ))}
        </div>
      </Section>
    </aside>
  );
}
