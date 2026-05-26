import type { CategoryDTO } from "@/lib/api";

export type LandingCategory = CategoryDTO & {
  productCount?: number;
  description?: string;
};

export type LandingTestimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
};

