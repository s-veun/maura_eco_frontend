export const HOME_NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/products" },
  { key: "suppliers", label: "Suppliers", href: "/suppliers" },
  { key: "orders", label: "Orders", href: "/orders" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

export const HERO_BANNERS = [
  {
    key: "bulk-pricing",
    title: "Bulk Furniture Procurement",
    subtitle: "Enterprise pricing for modern workspaces",
    description: "Get MOQ-based discounts, dedicated account support, and fast fulfillment.",
    cta: "Start B2B Order",
    href: "/business-registration",
    tone: "#5a3ea8",
  },
  {
    key: "supplier-network",
    title: "Verified Supplier Network",
    subtitle: "Source from trusted manufacturers",
    description: "Discover certified suppliers and request quotes in one streamlined workflow.",
    cta: "Explore Suppliers",
    href: "/suppliers",
    tone: "#4a3190",
  },
  {
    key: "rfq",
    title: "RFQ to Delivery",
    subtitle: "From quote request to tracked logistics",
    description: "Manage approvals, invoices, and shipment timelines with full transparency.",
    cta: "Create RFQ",
    href: "/suppliers",
    tone: "#6b4bb8",
  },
] as const;

