import type { Category, NavItem, Product, Promo, Testimonial, ValueProp } from "@/components/furniture-home/types";

export const navigationItems: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Collection", href: "#collection" },
  { label: "Products", href: "#products" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Contact", href: "#footer" },
];

export const categories: Category[] = [
  {
    title: "Dining Tables",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Coffee Tables",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Office Tables",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Wooden Tables",
    image: "https://images.unsplash.com/photo-1461418559055-6f020c5a91e7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Luxury Tables",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Modern Furniture",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80",
  },
];

export const featuredProducts: Product[] = [
  {
    id: "p1",
    title: "Nordic Oak Dining Table",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80",
    price: 649,
    originalPrice: 799,
    rating: 4.8,
    reviews: 128,
    badge: "-19%",
  },
  {
    id: "p2",
    title: "Luna Marble Coffee Table",
    image: "https://images.unsplash.com/photo-1616628182509-6f4d6f5ec6c5?auto=format&fit=crop&w=900&q=80",
    price: 429,
    originalPrice: 519,
    rating: 4.7,
    reviews: 94,
  },
  {
    id: "p3",
    title: "Aero Executive Work Table",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    price: 579,
    originalPrice: 699,
    rating: 4.9,
    reviews: 153,
    badge: "Best Seller",
  },
  {
    id: "p4",
    title: "Sienna Walnut Console",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
    price: 369,
    originalPrice: 449,
    rating: 4.6,
    reviews: 88,
  },
  {
    id: "p5",
    title: "Milo Compact Side Table",
    image: "https://images.unsplash.com/photo-1616594039964-3f40c7cf8f2f?auto=format&fit=crop&w=900&q=80",
    price: 189,
    originalPrice: 229,
    rating: 4.5,
    reviews: 66,
  },
  {
    id: "p6",
    title: "Astra Glass Top Table",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    price: 499,
    originalPrice: 610,
    rating: 4.7,
    reviews: 117,
    badge: "New",
  },
  {
    id: "p7",
    title: "Verde Minimal Writing Desk",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80",
    price: 339,
    originalPrice: 399,
    rating: 4.4,
    reviews: 73,
  },
  {
    id: "p8",
    title: "Aria Round Accent Table",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=900&q=80",
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviews: 101,
  },
];

export const bestSellerProducts: Product[] = featuredProducts.slice(0, 6);

export const promos: Promo[] = [
  {
    title: "Spring Living Collection",
    description: "Elevate your home with timeless tables and modern silhouettes.",
    cta: "Discover Now",
  },
  {
    title: "Free Shipping Over $499",
    description: "Enjoy secure delivery for premium furniture on qualifying orders.",
    cta: "Shop Premium Picks",
  },
];

export const valueProps: ValueProp[] = [
  {
    title: "High Quality Furniture",
    description: "Crafted with precision and durable finishes for everyday elegance.",
  },
  {
    title: "Fast Delivery",
    description: "Reliable shipping and seamless order tracking for every purchase.",
  },
  {
    title: "Premium Materials",
    description: "Solid wood, tempered glass, and premium textiles sourced responsibly.",
  },
  {
    title: "Customer Support",
    description: "Dedicated furniture specialists ready to help before and after checkout.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Olivia Tran",
    role: "Interior Designer",
    text: "The table quality is exceptional and the finish feels truly premium. My clients love the look.",
    rating: 5,
  },
  {
    name: "Mason Carter",
    role: "Homeowner",
    text: "Clean design, quick delivery, and the checkout experience was effortless on mobile.",
    rating: 5,
  },
  {
    name: "Sophia Reed",
    role: "Architect",
    text: "TableEco has become my go-to for modern furniture pieces that balance style and function.",
    rating: 5,
  },
];

