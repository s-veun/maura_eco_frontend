"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/api";
import { useAuth } from "@/auth/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useWishlistMutations } from "@/hooks/use-ecommerce-queries";
import { useGetWishlistQuery } from "@/redux/api/productApi";
import productService from "@/services/api/productService";
import ProductFilter from "@/components/products/ProductFilter";
import ProductGrid from "@/components/products/ProductGrid";
import ProductModal from "@/components/products/ProductModal";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import ProductCarousel from "@/components/products/ProductCarousel";
import { getDiscountedPrice } from "@/utils/product";
import { getApiErrorMessage } from "@/lib/api-error";

type FilterValue = {
  search: string;
  category: string;
  sort: string;
  price: string;
  availability: string;
  rating: number;
};

const DEFAULT_FILTERS: FilterValue = {
  search: "",
  category: "all",
  sort: "newest",
  price: "all",
  availability: "all",
  rating: 0,
};

function matchesPriceFilter(product: Product, key: string) {
  const price = getDiscountedPrice(product);
  if (key === "under_100") return price < 100;
  if (key === "100_500") return price >= 100 && price <= 500;
  if (key === "500_1000") return price > 500 && price <= 1000;
  if (key === "over_1000") return price > 1000;
  return true;
}

function sortProducts(items: Product[], sort: string) {
  const cloned = [...items];
  if (sort === "price_asc") return cloned.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
  if (sort === "price_desc") return cloned.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
  if (sort === "popular") return cloned.sort((a, b) => Number(b.purchaseCount || 0) - Number(a.purchaseCount || 0));
  if (sort === "rating") return cloned.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  return cloned.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

function toWishedProductIds(payload: unknown): number[] {
  if (!payload || typeof payload !== "object") return [];
  const list = (payload as { wishlist?: unknown[] }).wishlist;
  if (!Array.isArray(list)) return [];
  return list
    .map((entry) => {
      if (entry && typeof entry === "object") {
        const asRecord = entry as Record<string, unknown>;
        const nested = asRecord.product && typeof asRecord.product === "object" ? (asRecord.product as Record<string, unknown>) : null;
        const raw = asRecord.productId ?? asRecord.proId ?? asRecord.id ?? nested?.productId ?? nested?.proId ?? nested?.id;
        return Number(raw);
      }
      return Number.NaN;
    })
    .filter((id) => Number.isFinite(id));
}

function FeaturedProductsSectionComponent() {
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { add, remove } = useWishlistMutations();

  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlistOverrides, setWishlistOverrides] = useState<Record<number, boolean>>({});

  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const { data: featured = [], isLoading: featuredLoading, isError: featuredError, error: featuredErrorPayload, refetch: refetchFeatured } = useQuery({
    queryKey: ["home-featured-products"],
    queryFn: productService.getFeatured,
  });

  const { data: allProducts = [], isLoading: allLoading, isError: allError, error: allErrorPayload, refetch: refetchAll } = useQuery({
    queryKey: ["home-all-products"],
    queryFn: productService.getAll,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["home-categories"],
    queryFn: productService.getCategories,
  });

  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ["home-recommendations"],
    queryFn: productService.getRecommendations,
  });

  const { data: popular = [], isLoading: popularLoading } = useQuery({
    queryKey: ["home-popular"],
    queryFn: productService.getPopular,
  });

  const { data: recentlyViewed = [], isLoading: recentlyViewedLoading } = useQuery({
    queryKey: ["home-recently-viewed"],
    queryFn: productService.getRecentlyViewed,
  });

  const { data: discounted = [], isLoading: discountedLoading } = useQuery({
    queryKey: ["home-discounted"],
    queryFn: productService.getDiscounted,
  });

  const { data: wishlistPayload } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });

  const backendWishedIds = useMemo(() => new Set(toWishedProductIds(wishlistPayload)), [wishlistPayload]);

  const wishedIds = useMemo(() => {
    const next = new Set(backendWishedIds);
    Object.entries(wishlistOverrides).forEach(([key, value]) => {
      const id = Number(key);
      if (!Number.isFinite(id)) return;
      if (value) next.add(id);
      else next.delete(id);
    });
    return next;
  }, [backendWishedIds, wishlistOverrides]);

  const baseProducts = useMemo(() => {
    const map = new Map<number, Product>();
    [...featured, ...allProducts].forEach((item) => {
      if (item?.proId) map.set(item.proId, item);
    });
    return Array.from(map.values());
  }, [allProducts, featured]);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const filtered = baseProducts.filter((product) => {
      const categoryMatch = filters.category === "all" || product.categoryName === filters.category;
      const queryMatch = !q || product.proName.toLowerCase().includes(q) || (product.proBrand || "").toLowerCase().includes(q) || (product.tags || "").toLowerCase().includes(q);
      const ratingMatch = filters.rating === 0 || Number(product.rating || 0) >= filters.rating;
      const availabilityMatch = filters.availability === "all" || (filters.availability === "in_stock" ? Number(product.stock || 0) > 0 : Number(product.stock || 0) <= 0);
      const priceMatch = matchesPriceFilter(product, filters.price);
      return categoryMatch && queryMatch && ratingMatch && availabilityMatch && priceMatch;
    });
    return sortProducts(filtered, filters.sort);
  }, [baseProducts, debouncedSearch, filters.availability, filters.category, filters.price, filters.rating, filters.sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  const handleRetry = useCallback(() => {
    void refetchFeatured();
    void refetchAll();
  }, [refetchAll, refetchFeatured]);

  const handleAddToCart = useCallback(
    async (productId: number) => {
      try {
        await addToCart(productId, 1);
        showToast({ type: "success", title: "Added to cart" });
      } catch (error) {
        const msg = getApiErrorMessage(error, "Could not add to cart");
        showToast({ type: "error", title: "Cart action failed", message: msg });
      }
    },
    [addToCart, showToast],
  );

  const handleToggleWishlist = useCallback(
    async (productId: number) => {
      if (!isAuthenticated) {
        showToast({ type: "info", title: "Login required", message: "Sign in to manage your wishlist." });
        return;
      }
      const currentlyWished = wishedIds.has(productId);
      try {
        if (currentlyWished) {
          await remove.mutateAsync(productId);
          setWishlistOverrides((prev) => ({ ...prev, [productId]: false }));
          showToast({ type: "success", title: "Removed from wishlist" });
        } else {
          await add.mutateAsync(productId);
          setWishlistOverrides((prev) => ({ ...prev, [productId]: true }));
          showToast({ type: "success", title: "Added to wishlist" });
        }
      } catch (error) {
        const msg = getApiErrorMessage(error, "Wishlist action failed");
        showToast({ type: "error", title: "Wishlist error", message: msg });
      }
    },
    [add, isAuthenticated, showToast, remove, wishedIds],
  );

  const loadingMain = featuredLoading || allLoading || categoriesLoading;

  if (featuredError || allError) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="font-semibold text-lg mb-1">Featured products unavailable</h3>
        <p className="text-sm text-muted-foreground mb-4">{getApiErrorMessage(featuredErrorPayload || allErrorPayload, "Please retry shortly")}</p>
        <Button variant="outline" onClick={handleRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold mb-1.5">Featured Products</h3>
          <p className="text-sm text-muted-foreground">Curated products for modern B2B buyers with smart filters and quick actions.</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/products">View All Products</a>
        </Button>
      </div>

      <ProductFilter
        categories={categories}
        value={filters}
        onChange={(next) => { setFilters(next); setPage(1); }}
        mobileOpen={mobileFilterOpen}
        onOpenMobile={() => setMobileFilterOpen(true)}
        onCloseMobile={() => setMobileFilterOpen(false)}
      />

      {loadingMain ? (
        <ProductSkeleton count={8} />
      ) : filteredProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No featured products found for this filter</p>
      ) : (
        <>
          <ProductGrid
            products={paginated}
            wishedIds={wishedIds}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(product) => setSelectedProduct(product)}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>Previous</Button>
              <span className="text-sm px-2">{page} / {Math.ceil(filteredProducts.length / pageSize)}</span>
              <Button variant="outline" onClick={() => setPage((prev) => prev + 1)} disabled={page * pageSize >= filteredProducts.length}>Next</Button>
            </div>
          </div>
        </>
      )}

      <ProductCarousel title="Recommended Products" products={recommendations} wishedIds={wishedIds} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} onQuickView={(product) => setSelectedProduct(product)} />
      <ProductCarousel title="Popular Products" products={popular} wishedIds={wishedIds} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} onQuickView={(product) => setSelectedProduct(product)} />
      <ProductCarousel title="Recently Viewed" products={recentlyViewed} wishedIds={wishedIds} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} onQuickView={(product) => setSelectedProduct(product)} />
      <ProductCarousel title="Discounted Picks" products={discounted} wishedIds={wishedIds} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} onQuickView={(product) => setSelectedProduct(product)} />

      <ProductModal
        open={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      {(recommendationsLoading || popularLoading || recentlyViewedLoading || discountedLoading) && (
        <p className="text-xs text-muted-foreground text-center">Loading recommendation feeds...</p>
      )}
    </div>
  );
}

export const FeaturedProductsSection = memo(FeaturedProductsSectionComponent);
export default FeaturedProductsSection;
