import React from "react";

interface ProductSortProps {
  onSortChange: (value: string) => void;
}

export default function ProductSort({ onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort"
        onChange={(e) => onSortChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}