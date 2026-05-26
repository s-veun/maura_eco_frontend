"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import StoreLayout from "@/layouts/StoreLayout";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/redux/api/productApi";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";
import { CatalogProductCard } from "@/components/catalog/CatalogProductCard";
import { CatalogSidebar, type SidebarFilters } from "@/components/catalog/CatalogSidebar";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: SidebarFilters = {
  categories: [],
  priceMin: 0,
  priceMax: 3000,
  rating: 0,
  availability: "all",
};

export default function ProductsPage() {
  const { data: allProducts = [], isLoading } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SidebarFilters>(DEFAULT_FILTERS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const updateFilter = (patch: Partial<SidebarFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = allProducts.filter((p: Product) => {
      if (search && !p.proName.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(String(p.categoryId)))
        return false;
      if (p.proPrice < filters.priceMin || p.proPrice > filters.priceMax) return false;
      if (filters.rating > 0 && (p.rating || 0) < filters.rating) return false;
      if (filters.availability === "inStock" && !p.available) return false;
      return true;
    });

    if (sort === "priceAsc") data = [...data].sort((a, b) => a.proPrice - b.proPrice);
    else if (sort === "priceDesc") data = [...data].sort((a, b) => b.proPrice - a.proPrice);
    else if (sort === "rating") data = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "newest")
      data = [...data].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    else if (sort === "popular")
      data = [...data].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));

    return data;
  }, [allProducts, search, sort, filters]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const appliedFilters = [
    ...filters.categories.map((id) => ({
      label: categories.find((c) => String(c.catId) === id)?.catName ?? id,
      onRemove: () => updateFilter({ categories: filters.categories.filter((c) => c !== id) }),
    })),
    ...(filters.rating > 0
      ? [{ label: `${filters.rating}★ & up`, onRemove: () => updateFilter({ rating: 0 }) }]
      : []),
    ...(filters.availability !== "all"
      ? [{ label: "In Stock", onRemove: () => updateFilter({ availability: "all" }) }]
      : []),
    ...(search
      ? [{ label: `"${search}"`, onRemove: () => { setSearch(""); setPage(1); } }]
      : []),
  ];

  return (
    <StoreLayout>
      <div className="min-h-screen bg-[#fafaf9]">
        {/* Breadcrumb + page title */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-4 py-5 md:px-6">
            <nav className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-400">
              <Link href="/" className="hover:text-[#E69F2C] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-700">Products</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900">All Products</h1>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
          <div className="flex gap-6">
            {/* ── Sidebar (desktop) ── */}
            <div className="hidden w-56 shrink-0 lg:block">
              <CatalogSidebar
                categories={categories}
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
              />
            </div>

            {/* ── Main content ── */}
            <div className="min-w-0 flex-1">
              <CatalogToolbar
                search={search}
                onSearch={(v) => { setSearch(v); setPage(1); }}
                sort={sort}
                onSort={setSort}
                viewMode={viewMode}
                onViewMode={setViewMode}
                total={filtered.length}
                appliedFilters={appliedFilters}
                onOpenMobileFilter={() => setMobileFilterOpen(true)}
              />

              <div className="mt-5">
                {isLoading ? (
                  /* Skeleton */
                  <div
                    className={cn(
                      "gap-4",
                      viewMode === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col"
                    )}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse overflow-hidden rounded-[5px] border border-slate-200 bg-white"
                      >
                        <div className="h-45 bg-slate-100" />
                        <div className="space-y-2 p-4">
                          <div className="h-3 w-3/4 rounded bg-slate-100" />
                          <div className="h-3 w-1/2 rounded bg-slate-100" />
                          <div className="h-3 w-1/3 rounded bg-slate-100" />
                          <div className="mt-3 h-8 w-full rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : paged.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[5px] border border-slate-200 bg-white">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700">No products found</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Try adjusting your filters or search query.
                    </p>
                    <button
                      onClick={() => { resetFilters(); setSearch(""); }}
                      className="mt-4 rounded-[5px] bg-[#E69F2C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c8850f]"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  /* Product grid/list */
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${viewMode}-${page}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className={cn(
                        "gap-4",
                        viewMode === "grid"
                          ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                          : "flex flex-col"
                      )}
                    >
                      {paged.map((product) => (
                        <CatalogProductCard
                          key={product.proId}
                          product={product}
                          viewMode={viewMode}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <CatalogPagination
                page={page}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </div>
          </div>
        </div>

        {/* ── Mobile filter drawer ── */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black"
                onClick={() => setMobileFilterOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-5 py-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="rounded-[5px] p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <CatalogSidebar
                  categories={categories}
                  filters={filters}
                  onChange={updateFilter}
                  onReset={resetFilters}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </StoreLayout>
  );
}
