import type { Metadata } from "next";
import HomePage from "@/app/home/page";

export const metadata: Metadata = {
  title: "TableEco | Luxury Furniture Atelier",
  description:
    "Discover an editorial luxury furniture experience with Scandinavian-inspired collections, premium materials, and spacious modern design.",
  openGraph: {
    title: "TableEco | Luxury Furniture Atelier",
    description:
      "Discover an editorial luxury furniture experience with Scandinavian-inspired collections.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TableEco | Luxury Furniture Atelier",
    description:
      "Discover an editorial luxury furniture experience with Scandinavian-inspired collections.",
  },
};

export default HomePage;
