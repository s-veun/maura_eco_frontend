export type HomeProduct = {
  id: number;
  title: string;
  image: string;
  unit: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: string;
  badge?: "hot" | "new" | "sale";
  delivery: string;
};

export type CategoryItem = {
  title: string;
  image: string;
};

export type PromoItem = {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  bgClass: string;
  textClass?: string;
};

export const navCategories = [
  "Fruits & Vegetables",
  "Beverages",
  "Snacks",
  "Dairy",
  "Grocery",
  "Frozen Foods",
  "Bakery",
  "Seafood",
  "Organic",
  "Deals",
];

export const dropdownItems: Record<string, string[]> = {
  "Fruits & Vegetables": ["Leafy", "Tropical", "Seasonal", "Organic"],
  Beverages: ["Juice", "Soft Drinks", "Coffee", "Sparkling"],
  Snacks: ["Chips", "Nuts", "Biscuits", "Healthy"],
  Dairy: ["Milk", "Cheese", "Yogurt", "Butter"],
  Grocery: ["Oil", "Rice", "Pasta", "Sauces"],
  "Frozen Foods": ["Pizza", "Fries", "Seafood", "Ready Meals"],
  Bakery: ["Bread", "Pastries", "Cake", "Donuts"],
};

export const categoryIcons: CategoryItem[] = [
  {
    title: "Vegetables",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Snacks",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Meat & Seafood",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Biscuits",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=160&q=80",
  },
  {
    title: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=160&q=80",
  },
];

export const heroBanners: PromoItem[] = [
  {
    badge: "Only This Week",
    title: "The one supermarket that makes your life easy and better",
    subtitle: "Fresh groceries with next hour delivery and premium savings.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=900&q=80",
    bgClass: "bg-[#f4dc32]",
    textClass: "text-[#2a1d4e]",
  },
  {
    badge: "Only This Week",
    title: "Where you get your all favorite brands under one roof",
    subtitle: "Shop global and local favorites in one compact marketplace.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1622485481079-8d40a6f8f2b1?auto=format&fit=crop&w=900&q=80",
    bgClass: "bg-[#c8a6f5]",
    textClass: "text-[#2a1d4e]",
  },
];

export const flashDeals: HomeProduct[] = [
  {
    id: 1,
    title: "Cold Pressed Mango Juice",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    unit: "1 L",
    price: 8.99,
    oldPrice: 12.99,
    rating: 4.8,
    reviews: 223,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 40 min",
  },
  {
    id: 2,
    title: "Rising Crust Pepperoni Pizza",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80",
    unit: "510 g",
    price: 14.99,
    oldPrice: 16.99,
    rating: 4.6,
    reviews: 160,
    stock: "Limited",
    badge: "sale",
    delivery: "Scheduled delivery",
  },
  {
    id: 3,
    title: "Whole Grain Frozen Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    unit: "420 g",
    price: 7.99,
    oldPrice: 9.49,
    rating: 4.4,
    reviews: 87,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 35 min",
  },
  {
    id: 4,
    title: "Premium Sweet Melon",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=700&q=80",
    unit: "1 pc",
    price: 10.49,
    oldPrice: 13.99,
    rating: 4.7,
    reviews: 145,
    stock: "Organic",
    badge: "hot",
    delivery: "Same day delivery",
  },
  {
    id: 5,
    title: "Mega Roll Kitchen Towel",
    image: "https://images.unsplash.com/photo-1584473457409-ce12ec4c7d20?auto=format&fit=crop&w=600&q=80",
    unit: "6 rolls",
    price: 16.99,
    oldPrice: 18.99,
    rating: 4.5,
    reviews: 210,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 30 min",
  },
  {
    id: 6,
    title: "Orange Juice Drink",
    image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=600&q=80",
    unit: "500 ml",
    price: 4.95,
    oldPrice: 6.49,
    rating: 4.4,
    reviews: 95,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 25 min",
  },
];

export const recommended: HomeProduct[] = [
  {
    id: 7,
    title: "Cold Pressed Mango Juice",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    unit: "1 L",
    price: 8.99,
    oldPrice: 12.99,
    rating: 4.8,
    reviews: 223,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 40 min",
  },
  {
    id: 8,
    title: "Fresh Cantaloupe",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=600&q=80",
    unit: "1 pc",
    price: 10.49,
    oldPrice: 13.99,
    rating: 4.7,
    reviews: 145,
    stock: "Organic",
    badge: "hot",
    delivery: "Same day delivery",
  },
  {
    id: 9,
    title: "Beef Ready Meal Pack",
    image: "https://images.unsplash.com/photo-1514511547113-143ed882ac4f?auto=format&fit=crop&w=600&q=80",
    unit: "350 g",
    price: 8.49,
    oldPrice: 11.0,
    rating: 4.5,
    reviews: 112,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 35 min",
  },
  {
    id: 10,
    title: "Natural Oat Milk",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    unit: "1 L",
    price: 6.49,
    oldPrice: 8.29,
    rating: 4.8,
    reviews: 300,
    stock: "In stock",
    badge: "new",
    delivery: "Express delivery in 28 min",
  },
  {
    id: 11,
    title: "Protein Cocoa Shake",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    unit: "330 ml",
    price: 5.79,
    oldPrice: 7.3,
    rating: 4.5,
    reviews: 88,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 32 min",
  },
  {
    id: 12,
    title: "Seaweed Snack Crisps",
    image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=700&q=80",
    unit: "75 g",
    price: 4.99,
    oldPrice: 6.1,
    rating: 4.6,
    reviews: 198,
    stock: "In stock",
    badge: "new",
    delivery: "Express delivery in 30 min",
  },
];

export const bottomRecommendations: HomeProduct[] = [
  {
    id: 13,
    title: "Great Value Rising Crust Pizza",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80",
    unit: "510 g",
    price: 9.99,
    oldPrice: 15.99,
    rating: 4.7,
    reviews: 149,
    stock: "In stock",
    badge: "new",
    delivery: "Express delivery in 35 min",
  },
  {
    id: 14,
    title: "Arctic Frozen IQF Sliced Strawberries",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
    unit: "400 g",
    price: 21.9,
    oldPrice: 24.9,
    rating: 4.6,
    reviews: 79,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 28 min",
  },
  {
    id: 15,
    title: "Ice Cream Frozen Tiered Toppings",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    unit: "750 ml",
    price: 14.99,
    oldPrice: 19.99,
    rating: 4.7,
    reviews: 123,
    stock: "In stock",
    badge: "hot",
    delivery: "Delivery today",
  },
  {
    id: 16,
    title: "Oscar Mayer Ham Skillet",
    image: "https://images.unsplash.com/photo-1603048719539-9ecb4f35f016?auto=format&fit=crop&w=600&q=80",
    unit: "340 g",
    price: 11.9,
    oldPrice: 13.5,
    rating: 4.4,
    reviews: 66,
    stock: "In stock",
    badge: "new",
    delivery: "Express delivery in 37 min",
  },
  {
    id: 17,
    title: "Large Success Spinach Herb Tortellini",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80",
    unit: "500 g",
    price: 27.9,
    oldPrice: 32.5,
    rating: 4.5,
    reviews: 53,
    stock: "In stock",
    badge: "sale",
    delivery: "Express delivery in 30 min",
  },
  {
    id: 18,
    title: "Chef Way Rising Crust Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    unit: "420 g",
    price: 12.89,
    oldPrice: 13.99,
    rating: 4.6,
    reviews: 91,
    stock: "In stock",
    badge: "new",
    delivery: "Express delivery in 32 min",
  },
];

export const promoTriplet: PromoItem[] = [
  {
    badge: "Only This Week",
    title: "Get The Freshness of food with us",
    subtitle: "Weekend discount for essentials.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=700&q=80",
    bgClass: "bg-[#f8a56a]",
    textClass: "text-[#291c46]",
  },
  {
    badge: "Only This Week",
    title: "Just add the doing shopping with us",
    subtitle: "Save more with basket bundles.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80",
    bgClass: "bg-[#efc766]",
    textClass: "text-[#291c46]",
  },
  {
    badge: "Only This Week",
    title: "Let the freshness twirl into your mouth",
    subtitle: "Curated snacks and pantry combo.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80",
    bgClass: "bg-[#f6b9bf]",
    textClass: "text-[#291c46]",
  },
];

export const splitPromo: PromoItem[] = [
  {
    badge: "Only This Week",
    title: "Create your memories with our quality food",
    subtitle: "Fresh ingredients for every family recipe.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=900&q=80",
    bgClass: "bg-[#f7a93b]",
    textClass: "text-[#21163f]",
  },
  {
    badge: "Only This Week",
    title: "We are here to find out a quality product",
    subtitle: "Quality-focused curation for your kitchen.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1603048719539-9ecb4f35f016?auto=format&fit=crop&w=900&q=80",
    bgClass: "bg-[#f2c72f]",
    textClass: "text-[#21163f]",
  },
];

export const bestSellerPromo: PromoItem[] = [
  {
    badge: "Only This Week",
    title: "Where a product is in pocket-friendly price",
    subtitle: "Buy smart with affordable bundles.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    bgClass: "bg-[#d6a9e6]",
    textClass: "text-[#2a1d4e]",
  },
  {
    badge: "Only This Week",
    title: "Where customer's priority is our priority",
    subtitle: "Fast support and quality-first logistics.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=900&q=80",
    bgClass: "bg-[#f5cf31]",
    textClass: "text-[#2a1d4e]",
  },
];

export const featuredCenterProduct = {
  ...recommended[5],
  title: "Absolut Grapefruit Flavored Sparkling Water",
  image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=800&q=80",
  unit: "355 ml",
  price: 26.99,
  oldPrice: 32.99,
  delivery: "Express delivery in 45 min",
};

export const showcaseLeft = [flashDeals[0], flashDeals[5], recommended[3]];
export const showcaseRight = [recommended[4], flashDeals[4], recommended[1]];

