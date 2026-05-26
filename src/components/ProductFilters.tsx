import React, { useState } from "react";

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState(0);

  const handleFilterChange = () => {
    onFilterChange({ category, priceRange, rating });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Filters</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="All">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex items-center gap-4 mt-2">
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="flex-1"
          />
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="flex-1"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              onClick={() => setRating(index + 1)}
              className={`w-6 h-6 rounded-full ${index < rating ? "bg-yellow-400" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleFilterChange}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
}