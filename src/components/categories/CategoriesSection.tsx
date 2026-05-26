"use client";

import { useState } from "react";
import type { CategoryViewModel } from "@/types/homepage";
import CategoryCard from "@/components/categories/CategoryCard";
import { cn } from "@/lib/utils";

type CategoriesSectionProps = {
  categories: CategoryViewModel[];
  loading: boolean;
};

export function CategoriesSection({ categories, loading }: CategoriesSectionProps) {
  const [activeTab, setActiveTab] = useState("all");

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 animate-pulse bg-muted rounded" />
        ))}
      </div>
    );
  }

  if (!categories.length) {
    return <p className="text-sm text-muted-foreground text-center py-8">No categories available</p>;
  }

  const featured = categories.filter((item) => item.featured);
  const popular = categories.filter((item) => item.popular);

  const tabs = [
    { key: "all", label: "All", children: categories },
    { key: "featured", label: "Featured", children: featured },
    { key: "popular", label: "Popular", children: popular },
  ];

  const activeItems = tabs.find((t) => t.key === activeTab)?.children || categories;

  return (
    <section>
      <h3 className="text-xl font-bold mb-4">Shop by Category</h3>

      {/* Mobile scroll carousel */}
      <div className="md:hidden overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory">
        {categories.map((category) => (
          <div key={category.catId} className="snap-start min-w-[220px]">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      {/* Desktop tabs */}
      <div className="hidden md:block">
        <div className="flex gap-1 border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.key
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeItems.map((category) => (
              <CategoryCard key={category.catId} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No categories</p>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;
