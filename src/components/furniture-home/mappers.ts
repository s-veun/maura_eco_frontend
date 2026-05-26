import type { CategoryDTO, Product as ApiProduct } from "@/lib/api";
import type { Category, Product } from "@/components/furniture-home/types";

const fallbackProductImage =
  "https://images.unsplash.com/photo-1616594039964-3f40c7cf8f2f?auto=format&fit=crop&w=900&q=80";

const fallbackCategoryImage =
  "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80";

export function mapApiProductToCard(product: ApiProduct): Product {
  const image = product.imageUrl || product.thumbnailImage || product.imageName || product.imageUrls?.[0] || fallbackProductImage;
  const discount = product.discount || 0;
  const originalPrice = Number(product.proPrice || 0);
  const salePrice = originalPrice - originalPrice * (discount / 100);

  return {
    id: String(product.proId),
    title: product.proName,
    image,
    price: Number(salePrice.toFixed(2)),
    originalPrice: discount > 0 ? Number(originalPrice.toFixed(2)) : undefined,
    rating: Number((product.rating || 4.5).toFixed(1)),
    reviews: product.viewCount || 0,
    badge: discount > 0 ? `-${discount}%` : undefined,
  };
}

export function mapCategoryToCard(category: CategoryDTO): Category {
  return {
    title: category.catName,
    image: category.imageUrl || fallbackCategoryImage,
  };
}

