"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "Dining table",
  "Sofa set",
  "Office chair",
  "Bedroom furniture",
  "Bookshelf",
];

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      setIsFocused(false);
    }
  };

  const showDropdown = isFocused && query.length === 0;

  return (
    <div ref={containerRef} className={cn("relative flex-1", className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-full border bg-white px-4 py-2.5 transition-all duration-200",
            isFocused
              ? "border-[#3BB77E] shadow-[0_0_0_3px_rgba(59,183,126,0.12)]"
              : "border-gray-200 shadow-sm hover:border-gray-300",
          )}
        >
          <Search
            size={16}
            className={cn(
              "shrink-0 transition-colors",
              isFocused ? "text-[#3BB77E]" : "text-[#ADADAD]",
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search furniture, tables, chairs..."
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#253D4E] placeholder:font-normal placeholder:text-[#ADADAD] outline-none"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.12 }}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="shrink-0 rounded-full p-0.5 text-[#ADADAD] transition-colors hover:text-[#253D4E]"
                aria-label="Clear search"
              >
                <X size={13} />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#3BB77E] px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#2ea36d] hover:shadow-md hover:shadow-[#3BB77E]/25 active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular searches dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-100 bg-white px-2 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
          >
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#ADADAD]">
              Popular Searches
            </p>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onMouseDown={() => {
                  setQuery(term);
                  router.push(`/products?search=${encodeURIComponent(term)}`);
                  setIsFocused(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#253D4E] transition-colors hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
              >
                <TrendingUp size={13} className="shrink-0 text-[#3BB77E]" />
                {term}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
