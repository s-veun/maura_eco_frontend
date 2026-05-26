"use client";

import { memo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/api";
import {
  AVAILABILITY_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  PRODUCT_SORT_OPTIONS,
} from "@/constants/productFilters";

type FilterValue = {
  search: string;
  category: string;
  sort: string;
  price: string;
  availability: string;
  rating: number;
};

type ProductFilterProps = {
  categories: CategoryDTO[];
  value: FilterValue;
  onChange: (next: FilterValue) => void;
  mobileOpen: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
};

const RATING_OPTIONS = [
  { label: "All ratings", value: 0 },
  { label: "4+", value: 4 },
  { label: "3+", value: 3 },
];

function FilterControls({ categories, value, onChange }: { categories: CategoryDTO[]; value: FilterValue; onChange: (n: FilterValue) => void }) {
  const categoryTabs = [
    { key: "all", label: "All" },
    ...categories.slice(0, 8).map((c) => ({ key: c.catName, label: c.catName })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value.search}
          placeholder="Search featured products"
          className="pl-9"
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
        {value.search && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => onChange({ ...value, search: "" })}>
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Sort", field: "sort" as const, options: PRODUCT_SORT_OPTIONS as { label: string; value: string }[] },
          { label: "Price", field: "price" as const, options: PRICE_FILTER_OPTIONS as { label: string; value: string }[] },
          { label: "Availability", field: "availability" as const, options: AVAILABILITY_FILTER_OPTIONS as { label: string; value: string }[] },
        ].map(({ label, field, options }) => (
          <div key={field}>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <select
              value={value[field]}
              onChange={(e) => onChange({ ...value, [field]: e.target.value })}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {RATING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...value, rating: opt.value })}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
              value.rating === opt.value
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-muted-foreground border-input hover:border-purple-400"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-0 border-b overflow-x-auto">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange({ ...value, category: tab.key })}
            className={cn(
              "px-3.5 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors flex-shrink-0",
              value.category === tab.key
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductFilterComponent({ categories, value, onChange, mobileOpen, onOpenMobile, onCloseMobile }: ProductFilterProps) {
  return (
    <>
      <div className="hidden md:block">
        <FilterControls categories={categories} value={value} onChange={onChange} />
      </div>

      <div className="md:hidden flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={value.search}
            placeholder="Search featured products"
            className="pl-9"
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
        </div>
        <Button variant="outline" className="w-full" onClick={onOpenMobile}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Open Filters
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={(v) => { if (!v) onCloseMobile(); }}>
        <SheetContent side="right" className="w-[320px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterControls categories={categories} value={value} onChange={onChange} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export const ProductFilter = memo(ProductFilterComponent);
export default ProductFilter;
