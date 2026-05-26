"use client";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api";
import productService from "@/services/api/productService";
import styles from "@/components/error/not-found.module.css";
import { useToast } from "@/components/ui/toast-provider";

const ErrorHero = lazy(() => import("@/components/error/ErrorHero"));
const ErrorActions = lazy(() => import("@/components/error/ErrorActions"));
const ProductSuggestions = lazy(() => import("@/components/error/ProductSuggestions"));
const SearchRedirect = lazy(() => import("@/components/error/SearchRedirect"));

const AUTO_REDIRECT_SECONDS = 14;

export default function NotFoundPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);

  useEffect(() => {
    if (!autoRedirectEnabled || countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [autoRedirectEnabled, countdown]);

  useEffect(() => {
    if (!autoRedirectEnabled || countdown > 0) return;
    router.push("/");
  }, [autoRedirectEnabled, countdown, router]);

  useEffect(() => {
    let isActive = true;

    const loadRecommendations = async () => {
      try {
        const featured = await productService.getFeatured();
        if (!isActive) return;

        if (featured.length >= 4) {
          setRecommendedProducts(featured.slice(0, 4));
          return;
        }

        const allProducts = await productService.getAll();
        if (!isActive) return;
        setRecommendedProducts([...featured, ...allProducts].slice(0, 4));
      } catch {
        if (isActive) setRecommendedProducts([]);
      } finally {
        if (isActive) setIsRecommendationsLoading(false);
      }
    };

    void loadRecommendations();

    return () => {
      isActive = false;
    };
  }, []);

  const goHome = useCallback(() => router.push("/"), [router]);
  const continueShopping = useCallback(() => router.push("/products"), [router]);
  const viewCategories = useCallback(() => router.push("/products?sortBy=category"), [router]);
  const contactSupport = useCallback(() => router.push("/contact"), [router]);

  const goBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }, [router]);

  const cancelAutoRedirect = useCallback(() => {
    setAutoRedirectEnabled(false);
    showToast({ type: "info", title: "Auto redirect paused", message: "Continue with search or quick actions." });
  }, [showToast]);

  const handleProductSearch = useCallback(
    (value: string) => {
      const normalized = value.trim();
      if (!normalized) {
        showToast({ type: "info", title: "Search", message: "Type a product keyword to search." });
        return;
      }
      setAutoRedirectEnabled(false);
      router.push(`/products?keyword=${encodeURIComponent(normalized)}`);
    },
    [showToast, router],
  );

  const handleExploreProduct = useCallback(
    (productId: number) => {
      router.push(`/products/${productId}`);
    },
    [router],
  );

  const handleAddToCart = useCallback(
    async (productId: number) => {
      showToast({ type: "info", title: "Add to cart", message: "Open product details to choose quantity and add to cart." });
      router.push(`/products/${productId}`);
    },
    [showToast, router],
  );

  return (
    <div className={styles.pageShell} style={{ background: "#ffffff" }}>
      <div style={{ padding: "24px 12px", background: "#ffffff" }}>
        <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 48px)", background: "#ffffff" }}>
          <div
            className={styles.fadeIn}
            style={{ width: "min(1140px, 100%)", background: "#ffffff" }}
          >
            <div className="flex flex-col gap-6 w-full">
              <Suspense fallback={
                <div className="flex justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              }>
                <ErrorHero compact={false} />
              </Suspense>

              <hr className="border-border" />

              <Suspense fallback={<div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />}>
                <SearchRedirect
                  countdown={countdown}
                  autoRedirectEnabled={autoRedirectEnabled}
                  onCancelAutoRedirect={cancelAutoRedirect}
                  onSearch={handleProductSearch}
                />
              </Suspense>

              <Suspense fallback={<div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />}>
                <ErrorActions
                  onBackHome={goHome}
                  onContinueShopping={continueShopping}
                  onViewCategories={viewCategories}
                  onContactSupport={contactSupport}
                  onGoBack={goBack}
                />
              </Suspense>

              <div className="relative flex items-center gap-3">
                <hr className="flex-1 border-border" />
                <h5 className="text-sm font-semibold mb-0">Recommended products for you</h5>
                <hr className="flex-1 border-border" />
              </div>

              <p className="text-muted-foreground text-sm mb-0">
                Recover quickly with curated picks from our latest catalog.
              </p>

              <Suspense fallback={<div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />}>
                <ProductSuggestions
                  products={recommendedProducts}
                  loading={isRecommendationsLoading}
                  onAddToCart={handleAddToCart}
                  onExplore={handleExploreProduct}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
