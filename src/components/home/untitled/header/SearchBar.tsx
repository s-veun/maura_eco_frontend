"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Product } from "@/lib/api";
import productService from "@/services/home/productService";

type SearchBarProps = {
  categoryId?: number;
  className?: string;
  inputClassName?: string;
};

function getSuggestionLabel(product: Product) {
  return product.proName || "Untitled product";
}

export default function SearchBar({
  categoryId,
  className = "",
  inputClassName = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const showDropdown = focused;

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeout = window.setTimeout(async () => {
      try {
        const results = await productService.searchProducts(query, categoryId);
        setSuggestions(results.slice(0, 5));
      } catch {
        setError("Unable to load suggestions.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [query, categoryId]);

  const onSubmit = (value: string) => {
    const keyword = value.trim();
    if (!keyword) return;
    router.push(`/products?search=${encodeURIComponent(keyword)}`);
    setFocused(false);
  };

  const trending = useMemo(
    () => ["Premium tables", "Eco chairs", "Workspace kits"],
    [],
  );

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex h-12 items-center gap-2 rounded-2xl border border-transparent bg-[#f5f5f7] px-4 transition focus-within:border-[#5a3ea8]/50 focus-within:bg-white ${inputClassName}`}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSubmit(query);
          }}
          placeholder="Search for products..."
          className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
        />
        <button
          type="button"
          onClick={() => onSubmit(query)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5a3ea8] text-white shadow-[0_10px_20px_rgba(90,62,168,0.35)] transition hover:scale-[1.03] hover:bg-[#4b2f91]"
        >
          <Search className="size-4" />
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_25px_50px_rgba(15,23,42,0.12)]"
          >
            {loading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`search-skeleton-${index}`}
                    className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-500">
                {error}
              </div>
            )}

            {!loading && !error && suggestions.length === 0 && query.trim().length > 1 && (
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                No results for "{query}".
              </div>
            )}

            {!loading && suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((item) => (
                  <button
                    key={item.proId}
                    type="button"
                    onMouseDown={() => onSubmit(item.proName)}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={item.imageUrl || item.thumbnailImage || "/materials.png"}
                        alt={getSuggestionLabel(item)}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {getSuggestionLabel(item)}
                      </p>
                      <p className="text-xs text-[#5a3ea8]">
                        ${(item.proPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && !error && query.trim().length === 0 && (
              <div className="flex flex-wrap gap-2">
                {trending.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={() => onSubmit(term)}
                    className="rounded-full border border-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#5a3ea8] transition hover:bg-[#f5f2ff]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
