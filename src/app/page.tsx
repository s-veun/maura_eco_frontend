import type { Metadata } from "next";
import HomePageClient from "@/components/home/untitled/HomePageClient";

export const metadata: Metadata = {
  title: "TableEco | Premium Furniture Marketplace",
  description:
    "Discover premium tables and furniture with an Untitled UI-inspired shopping experience, dynamic recommendations, and modern category browsing.",
  openGraph: {
    title: "TableEco | Premium Furniture Marketplace",
    description:
      "Discover premium tables and furniture with an Untitled UI-inspired shopping experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TableEco | Premium Furniture Marketplace",
    description:
      "Discover premium tables and furniture with an Untitled UI-inspired shopping experience.",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}

