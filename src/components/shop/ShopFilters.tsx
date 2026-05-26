"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ShopFiltersProps = {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (value: string) => void;
};

export default function ShopFilters({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: ShopFiltersProps) {
  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products"
            className="h-11 rounded-full border-0 bg-white pl-11 pr-4 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-slate-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Button
                key={category}
                type="button"
                variant="ghost"
                onClick={() => onCategoryChange(category)}
                className={`h-9 rounded-full px-4 text-sm font-medium shadow-none transition-transform hover:scale-[1.02] ${
                  isActive
                    ? "bg-slate-900 text-white hover:bg-slate-900"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
