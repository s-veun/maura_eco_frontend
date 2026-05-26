"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MuiProductCard, { type MuiProduct } from "@/components/mui/MuiProductCard";

type RecommendationFeedSectionProps = {
  products: MuiProduct[];
  loading: boolean;
  isError?: boolean;
};

function buildParams(current: URLSearchParams, key: string, value: string) {
  const params = new URLSearchParams(current.toString());
  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  return params;
}

export default function RecommendationFeedSection({ products, loading, isError }: RecommendationFeedSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(18);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sortBy = searchParams?.get("feedSort") || "relevance";
  const shippingOnly = searchParams?.get("shipping") === "free";
  const queryText = searchParams?.get("feedQuery") || "";

  useEffect(() => {
    const node = bottomRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisibleCount((c) => c + 12);
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const normalized = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    let items = [...products];
    if (q) items = items.filter((item) => item.title.toLowerCase().includes(q));
    if (shippingOnly) items = items.filter((item) => (item.shippingLabel || "").toLowerCase().includes("free"));
    if (sortBy === "priceAsc") items.sort((a, b) => a.price - b.price);
    if (sortBy === "priceDesc") items.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "sold") items.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    return items.slice(0, visibleCount);
  }, [products, queryText, shippingOnly, sortBy, visibleCount]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">More to Love</h2>
      <p className="text-sm text-muted-foreground mb-3">URL-synced filters and infinite recommendation feed.</p>

      <div className="border rounded-lg bg-card p-3 mb-3 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Input
            placeholder="Search recommendations"
            value={queryText}
            onChange={(e) => {
              const params = buildParams(new URLSearchParams(searchParams?.toString() || ""), "feedQuery", e.target.value);
              router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className="flex-1"
          />
          <Select
            value={sortBy}
            onValueChange={(value) => {
              const params = buildParams(new URLSearchParams(searchParams?.toString() || ""), "feedSort", value);
              router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
          >
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="sold">Most Sold</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={shippingOnly}
              onChange={(e) => {
                const params = buildParams(
                  new URLSearchParams(searchParams?.toString() || ""),
                  "shipping",
                  e.target.checked ? "free" : "",
                );
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
              }}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Free shipping
          </label>
        </div>
      </div>

      {isError ? (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-4">
          Failed to load recommendation feed.
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-[248px]" />
          ))}
        </div>
      ) : normalized.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {normalized.map((product) => (
              <MuiProductCard key={`feed-${product.id}`} product={{ ...product, compact: true }} />
            ))}
          </div>
          <div ref={bottomRef} className="py-4 text-center">
            {normalized.length < products.length ? (
              <div className="inline-block h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <p className="text-sm text-muted-foreground">You reached the end of recommendations.</p>
            )}
          </div>
        </>
      ) : (
        <div className="border rounded-lg bg-card p-6 shadow-sm">
          <p>No recommendations available right now.</p>
        </div>
      )}
    </div>
  );
}
