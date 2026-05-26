export const APP_ROUTES = {
  home: "/",
  products: "/products",
  cart: "/cart",
  checkout: "/checkout",
  orders: "/orders",
  tracking: "/tracking",
  profile: "/profile",
  suppliers: "/suppliers",
  businessRegistration: "/business-registration",
  faq: "/faq",
  terms: "/terms",
  privacy: "/privacy",
  login: "/login",
  register: "/register",
} as const;

export type AppRouteKey = keyof typeof APP_ROUTES;

