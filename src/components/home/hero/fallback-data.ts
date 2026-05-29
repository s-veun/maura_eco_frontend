import type { HeroSlide } from "@/components/home/hero/types";

export const fallbackHeroSlides: HeroSlide[] = [
  {
    id: "hero-fallback-1",
    title: "Elevate Your Living Space",
    subtitle: "Minimal luxury furniture curated for modern interiors.",
    description:
      "Discover premium craftsmanship with timeless silhouettes designed for comfort and elegance.",
    ctaLabel: "Shop Collection",
    ctaHref: "/products",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
    badge: "New Collection",
    tags: ["Premium Furniture", "New Collection", "Limited Offer"],
    toneFrom: "#8A7650",
    toneTo: "#DBCEA5",
    stats: [
      { label: "Curated Designs", value: "120+" },
      { label: "Happy Homes", value: "18k" },
      { label: "Fast Delivery", value: "48h" },
    ],
  },
  {
    id: "hero-fallback-2",
    title: "Best Seller Dining Essentials",
    subtitle: "Natural textures and soft neutral tones for cozy gatherings.",
    description: "Explore best-selling dining tables and statement chairs crafted with premium materials.",
    ctaLabel: "View Best Sellers",
    ctaHref: "/products?sort=best-seller",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=80",
    badge: "Best Seller",
    tags: ["Best Seller", "Solid Wood", "Luxury Feel"],
    toneFrom: "#8E977D",
    toneTo: "#ECE7D1",
    stats: [
      { label: "Top Rated", value: "4.9" },
      { label: "Orders", value: "9.2k" },
      { label: "Crafted", value: "Since 2018" },
    ],
  },
  {
    id: "hero-fallback-3",
    title: "Premium Furniture Atelier",
    subtitle: "Refined pieces that balance minimalism and everyday usability.",
    description: "Build an editorial home atmosphere with modern Scandinavian-inspired furniture collections.",
    ctaLabel: "Explore Atelier",
    ctaHref: "/products?tag=premium",
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=80",
    badge: "Premium Furniture",
    tags: ["Premium Furniture", "Editorial Style", "Soft Neutral"],
    toneFrom: "#8A7650",
    toneTo: "#8E977D",
    stats: [
      { label: "Designer Picks", value: "32" },
      { label: "Sustainable", value: "Eco Wood" },
      { label: "Support", value: "24/7" },
    ],
  },
];

