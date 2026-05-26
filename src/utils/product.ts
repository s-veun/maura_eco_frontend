import type { Product } from "@/lib/api";

export function getProductImages(product: Product): string[] {
  const fromArray = Array.isArray(product.imageUrls) ? product.imageUrls.filter(Boolean) : [];
  const primary = [product.imageUrl, product.thumbnailImage, product.imageName].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
  const merged = [...fromArray, ...primary];
  return Array.from(new Set(merged));
}

export function getDiscountedPrice(product: Product): number {
  const price = Number(product.proPrice || 0);
  const discount = Number(product.discount || 0);
  if (!discount || discount <= 0) return price;
  return Math.max(0, price * (1 - discount / 100));
}

export function getReviewCount(product: Product): number {
  return Number(product.purchaseCount || product.viewCount || 0);
}

