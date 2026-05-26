export type NavItem = {
  label: string;
  href: string;
};

export type Category = {
  title: string;
  image: string;
};

export type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
};

export type Promo = {
  title: string;
  description: string;
  cta: string;
};

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
};

export type ValueProp = {
  title: string;
  description: string;
};

