export const PRODUCT_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Best Rating", value: "rating" },
] as const;

export const PRICE_FILTER_OPTIONS = [
  { label: "All prices", value: "all" },
  { label: "Under $100", value: "under_100" },
  { label: "$100 - $500", value: "100_500" },
  { label: "$500 - $1000", value: "500_1000" },
  { label: "Over $1000", value: "over_1000" },
] as const;

export const AVAILABILITY_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "In stock", value: "in_stock" },
  { label: "Out of stock", value: "out_of_stock" },
] as const;

