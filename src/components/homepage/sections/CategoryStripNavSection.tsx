"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CategoryStripNavSectionProps = {
  categories: string[];
};

const staticCategories = [
  "Furniture",
  "Office Tables",
  "Gaming Tables",
  "Dining Tables",
  "Home Decor",
  "Accessories",
  "Electronics",
  "Trending Products",
];

export default function CategoryStripNavSection({ categories }: CategoryStripNavSectionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const combinedCategories = [...new Set([...staticCategories, ...categories])].slice(0, 10);

  return (
    <div className="relative border rounded-2xl bg-card px-3 py-2 shadow-sm">
      <div className="flex gap-2 overflow-x-auto">
        <Button size="sm" variant="default">
          All Categories
        </Button>
        {combinedCategories.map((category) => (
          <div key={category} className="relative shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="whitespace-nowrap"
              onMouseEnter={() => setOpenCategory(category)}
              onMouseLeave={() => setOpenCategory(null)}
              onClick={() => setOpenCategory(openCategory === category ? null : category)}
            >
              {category}
            </Button>
            {openCategory === category && (
              <div
                className="absolute left-0 top-full mt-1 z-50 min-w-[160px] rounded-md border bg-popover shadow-md"
                onMouseEnter={() => setOpenCategory(category)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <p className="px-3 py-1.5 text-xs text-muted-foreground border-b">{category}</p>
                {["Top picks", "New arrivals", "Best sellers"].map((item) => (
                  <button
                    key={item}
                    className="block w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
                    onClick={() => setOpenCategory(null)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
