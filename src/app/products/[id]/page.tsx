"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Heart, Share2, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StoreLayout from "@/layouts/StoreLayout";
import FurnitureProductCard from "@/components/furniture-home/ProductCard";
import { useGetProductByIdQuery, useGetTrendingProductsQuery } from "@/redux/api/productApi";
import { useCart } from "@/hooks/useCart";
import { mapApiProductToCard } from "@/components/furniture-home/mappers";
import { useQuery } from "@tanstack/react-query";
import reviewService from "@/services/api/reviewService";

type ReviewSummaryItem = {
  rating?: number;
};

const ProductReviewsSection = dynamic(() => import("@/components/reviews/ProductReviewsSection"), {
  ssr: false,
});

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) ?? "";

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const { data: relatedProducts = [] } = useGetTrendingProductsQuery();
  const { addToCart, isAdding: isAddingToCart, isAuthenticated } = useCart();
  const numericProductId = Number(productId);

  const { data: productReviews = [] } = useQuery<ReviewSummaryItem[]>({
    queryKey: ["product-reviews", numericProductId],
    queryFn: () => reviewService.getProductReviews(numericProductId),
    enabled: Number.isFinite(numericProductId) && numericProductId > 0,
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="flex flex-col gap-4">
          <div className="animate-pulse bg-muted rounded h-[360px] w-full" />
          <div className="animate-pulse bg-muted rounded h-[220px] w-full" />
        </div>
      </StoreLayout>
    );
  }

  if (error || !product) {
    return (
      <StoreLayout>
        <div className="border rounded-lg bg-card shadow-sm p-8">
          <h5 className="text-xl font-semibold">Product not found</h5>
          <Button asChild className="mt-4">
            <Link href="/products">Back to products</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const allImages = [...(product.imageUrl ? [product.imageUrl] : []), ...(product.imageUrls || [])];
  const image = allImages[selectedImage] || "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80";
  const discountPercent = product.discount || 0;
  const salePrice = product.proPrice - (product.proPrice * discountPercent) / 100;
  const reviewCount = Array.isArray(productReviews) ? productReviews.length : 0;
  const averageRating =
    reviewCount > 0
      ? productReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviewCount
      : Number(product.rating || 0);

  const filledStars = Math.round(averageRating);

  return (
    <StoreLayout>
      <div className="flex flex-col gap-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.proName}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image section */}
          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden">
              <img src={image} alt={product.proName} className="w-full h-[480px] object-cover" />
            </div>
            {allImages.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {allImages.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className="cursor-pointer"
                  >
                    <img
                      src={item}
                      alt="preview"
                      className={`rounded-lg w-full object-cover aspect-square ${index === selectedImage ? "ring-2 ring-primary" : ""}`}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Info section */}
          <div className="flex-1 border rounded-lg bg-card shadow-sm p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                  {product.categoryName || "Furniture"}
                </span>
                <div className="flex flex-row gap-2">
                  <button className="p-2 rounded-md hover:bg-accent"><Heart className="h-4 w-4" /></button>
                  <button className="p-2 rounded-md hover:bg-accent"><Share2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center flex-wrap">
                <h4 className="text-2xl font-bold">{product.proName}</h4>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">{reviewCount} reviews</span>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < filledStars ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
              </div>

              <div className="flex flex-row gap-2 items-baseline">
                <span className="text-2xl font-bold text-primary">${salePrice.toFixed(2)}</span>
                {discountPercent > 0 ? (
                  <span className="text-base text-muted-foreground line-through">${product.proPrice.toFixed(2)}</span>
                ) : null}
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                  {averageRating.toFixed(1)} / 5
                </span>
              </div>

              <p className="text-muted-foreground">
                {product.proDesc || "Premium handcrafted furniture piece for modern spaces."}
              </p>

              <div className="flex flex-row gap-2 items-center">
                <button className="p-2 rounded-md hover:bg-accent" onClick={() => setQuantity((v) => Math.max(1, v - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span>{quantity}</span>
                <button className="p-2 rounded-md hover:bg-accent" onClick={() => setQuantity((v) => v + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                size="lg"
                disabled={!isAuthenticated || isAddingToCart}
                onClick={() => addToCart(product.proId, quantity)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to cart
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border rounded-lg bg-card shadow-sm">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Description
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Reviews ({reviewCount})
              </TabsTrigger>
            </TabsList>
            <hr className="border-border" />
            <div className="p-6">
              <TabsContent value="description">
                <p>{product.proDesc || "Elegant modern furniture for premium interiors."}</p>
              </TabsContent>
              <TabsContent value="specs">
                <p>Brand: {product.proBrand || "TableEco"} | Stock: {product.stock ?? 0}</p>
              </TabsContent>
              <TabsContent value="reviews">
                <ProductReviewsSection productId={product.proId} productName={product.proName} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related products */}
        <div>
          <h5 className="text-xl font-bold mb-4">Related products</h5>
          <div className="flex flex-row gap-4 overflow-x-auto pb-2">
            {relatedProducts.slice(0, 6).map((item) => (
              <div key={item.proId} className="min-w-[280px]">
                <FurnitureProductCard product={mapApiProductToCard(item)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
