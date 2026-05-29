import type { Product } from "@/lib/api";
import type { HomeBanner } from "@/types/homepage";
import { homeApiClient } from "@/services/home/apiClient";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80";

function resolveProductImage(product: Product) {
  return (
    product.imageUrl ||
    product.thumbnailImage ||
    product.thumbnailImageUrl ||
    product.imageUrls?.[0] ||
    DEFAULT_HERO_IMAGE
  );
}

function mapProductToBanner(product: Product, index: number, type: HomeBanner["campaignType"]): HomeBanner {
  const discount = product.discount || 0;
  const tones = [
    ["#5a3ea8", "#8e72df"],
    ["#4f2ba3", "#6f61ff"],
    ["#6c4ebd", "#9b86f4"],
  ] as const;

  const [toneFrom, toneTo] = tones[index % tones.length];

  return {
    id: `banner-${type}-${product.proId}`,
    title: product.proName,
    subtitle: product.proBrand || "Premium furniture collection",
    description: product.proDesc || "Upgrade your space with modern TableEco products.",
    discountLabel: discount > 0 ? `${discount}% OFF` : undefined,
    ctaLabel: "Shop now",
    ctaHref: `/products/${product.proId}`,
    imageUrl: resolveProductImage(product),
    toneFrom,
    toneTo,
    endsAt: new Date(Date.now() + (index + 1) * 48 * 60 * 60 * 1000).toISOString(),
    campaignType: type,
  };
}

export const bannerService = {
  async getHeroBanners(): Promise<HomeBanner[]> {
    const products = await homeApiClient.getList<Product>("/products/popular/top-rated", { limit: 4 });
    return products.slice(0, 4).map((item, idx) => mapProductToBanner(item, idx, "featured"));
  },

  async getPromotions(): Promise<HomeBanner[]> {
    const products = await homeApiClient.getList<Product>("/products");
    return products
      .filter((item) => (item.discount || 0) > 0)
      .slice(0, 4)
      .map((item, idx) => mapProductToBanner(item, idx, "promotion"));
  },

  async getFlashCampaigns(): Promise<HomeBanner[]> {
    const products = await homeApiClient.getList<Product>("/products/popular/trending", { limit: 6 });
    return products.slice(0, 3).map((item, idx) => mapProductToBanner(item, idx, "flash"));
  },
};

export default bannerService;

