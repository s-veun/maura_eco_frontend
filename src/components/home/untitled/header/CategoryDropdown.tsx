"use client";

import { Menu, ChevronDown } from "lucide-react";
import type { CategoryViewModel } from "@/types/homepage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CategoryDropdownProps = {
  categories: CategoryViewModel[];
  selectedCategory?: CategoryViewModel | null;
  isLoading?: boolean;
  hasError?: boolean;
  onSelect: (category: CategoryViewModel | null) => void;
};

export default function CategoryDropdown({
  categories,
  selectedCategory,
  isLoading,
  hasError,
  onSelect,
}: CategoryDropdownProps) {
  const label = selectedCategory?.catName ?? "Browse All Categories";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-[#4b2f91] px-4 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(32,10,84,0.25)] outline-none transition hover:translate-y-[-1px] hover:bg-[#3f267b]">
        <Menu className="size-4" />
        <span className="hidden md:inline">{label}</span>
        <ChevronDown className="size-4 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 rounded-2xl border-white/20 bg-white/95 p-2 shadow-[0_20px_45px_rgba(19,14,39,0.18)] backdrop-blur">
        <DropdownMenuItem
          className="cursor-pointer rounded-xl text-sm font-semibold text-[#4b2f91] transition hover:bg-[#f5f2ff]"
          onSelect={() => onSelect(null)}
        >
          All categories
        </DropdownMenuItem>
        {isLoading && (
          <div className="space-y-2 px-3 py-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className="h-9 w-full animate-pulse rounded-lg bg-[#f3f0ff]"
              />
            ))}
          </div>
        )}
        {hasError && (
          <div className="px-3 py-2 text-sm text-rose-500">
            Unable to load categories right now.
          </div>
        )}
        {!isLoading && !hasError &&
          categories.map((category) => (
            <DropdownMenuItem
              key={category.catId}
              className="cursor-pointer rounded-xl text-sm font-semibold text-[#1f2937] transition hover:bg-[#f5f2ff]"
              onSelect={() => onSelect(category)}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span>{category.catName}</span>
                <span className="rounded-full bg-[#ede9fe] px-2 py-0.5 text-[10px] font-semibold text-[#5a3ea8]">
                  {category.productCount} items
                </span>
              </span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
