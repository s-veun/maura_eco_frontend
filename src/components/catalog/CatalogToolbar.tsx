"use client";

import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppliedFilter {
  label: string;
  onRemove: () => void;
}

interface CatalogToolbarProps {
  search: string;
  onSearch: (v: string) => void;
  sort: string;
  onSort: (v: string) => void;
  viewMode: "grid" | "list";
  onViewMode: (v: "grid" | "list") => void;
  total: number;
  appliedFilters: AppliedFilter[];
  onOpenMobileFilter: () => void;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: Low → High" },
  { value: "priceDesc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

export function CatalogToolbar({
  search,
  onSearch,
  sort,
  onSort,
  viewMode,
  onViewMode,
  total,
  appliedFilters,
  onOpenMobileFilter,
}: CatalogToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: search + sort + view toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-[5px] border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#E69F2C]/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="rounded-[5px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#E69F2C]/60 focus:outline-none sm:w-52"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Mobile filter button */}
        <button
          onClick={onOpenMobileFilter}
          className="flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#E69F2C]/40 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* View mode toggle */}
        <div className="flex overflow-hidden rounded-[5px] border border-slate-200">
          <button
            onClick={() => onViewMode("grid")}
            className={cn(
              "flex items-center justify-center px-3 py-2 transition-colors",
              viewMode === "grid"
                ? "bg-[#E69F2C] text-white"
                : "bg-white text-slate-500 hover:text-slate-700"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewMode("list")}
            className={cn(
              "flex items-center justify-center border-l border-slate-200 px-3 py-2 transition-colors",
              viewMode === "list"
                ? "bg-[#E69F2C] text-white"
                : "bg-white text-slate-500 hover:text-slate-700"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Row 2: count + applied filter tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{total}</span>{" "}
          {total === 1 ? "product" : "products"}
        </span>

        {appliedFilters.map((f, i) => (
          <button
            key={i}
            onClick={f.onRemove}
            className="inline-flex items-center gap-1 rounded-[5px] border border-[#E69F2C]/30 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-[#c8850f] transition-colors hover:bg-amber-100"
          >
            {f.label}
            <X className="h-3 w-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
