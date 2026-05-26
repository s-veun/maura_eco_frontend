import type { CartResponseDto, OrderResponseDto } from "@/lib/api";
import { getCart } from "@/services/cart.service";
import { type AuthenticatedRequest, UserApiError } from "@/services/http";
import { getOrderHistory } from "@/services/order.service";
import { getWishlist } from "@/services/wishlist.service";

export type WishlistPreviewItem = {
  id: string;
  productId?: number;
  name: string;
  price?: number;
  imageUrl?: string;
  categoryName?: string;
  addedAt?: string;
};

export type AccountCollectionsResult = {
  orders: OrderResponseDto[];
  wishlist: WishlistPreviewItem[];
  wishlistCount: number;
  cart: CartResponseDto | null;
  failures: string[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readString(
  source: Record<string, unknown> | null,
  keys: string[],
): string | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
}

function readNumber(
  source: Record<string, unknown> | null,
  keys: string[],
): number | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function normalizeWishlistItem(entry: unknown, index: number): WishlistPreviewItem {
  const root = asRecord(entry);
  const product = asRecord(root?.product);
  const source = product || root;

  const productId = readNumber(source, ["proId", "productId", "id"]);
  const name =
    readString(source, ["proName", "productName", "name", "title"]) || `Saved item ${index + 1}`;
  const price = readNumber(source, ["proPrice", "price", "salePrice", "unitPrice"]);
  const imageUrl = readString(source, ["thumbnailImage", "imageUrl", "imageName"]);
  const categoryName = readString(source, ["categoryName", "catName", "category"]);
  const addedAt = readString(root, ["createdAt", "addedAt", "updatedAt"]);

  return {
    id: String(productId ?? readString(root, ["wishlistId", "id"]) ?? `wishlist-${index}`),
    productId,
    name,
    price,
    imageUrl,
    categoryName,
    addedAt,
  };
}

function formatFailure(error: unknown, fallback: string): string {
  if (error instanceof UserApiError) {
    if (error.status === 401 || error.status === 403) {
      return "Your session expired. Please sign in again.";
    }
    if (error.status >= 500) {
      return `Server error while loading ${fallback}.`;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return `Unable to load ${fallback}.`;
}

export async function getAccountCollections(
  request: AuthenticatedRequest,
  userId: number,
): Promise<AccountCollectionsResult> {
  const [ordersResult, wishlistResult, cartResult] = await Promise.allSettled([
    getOrderHistory(request, userId),
    getWishlist(request),
    getCart(request, userId),
  ]);

  const failures: string[] = [];

  const orders =
    ordersResult.status === "fulfilled"
      ? ordersResult.value
      : (failures.push(formatFailure(ordersResult.reason, "orders")), []);

  const wishlistPayload =
    wishlistResult.status === "fulfilled"
      ? wishlistResult.value
      : (failures.push(formatFailure(wishlistResult.reason, "wishlist")), null);

  const cart =
    cartResult.status === "fulfilled"
      ? cartResult.value
      : (failures.push(formatFailure(cartResult.reason, "cart")), null);

  const rawWishlist = Array.isArray(wishlistPayload?.wishlist)
    ? wishlistPayload.wishlist
    : [];

  return {
    orders,
    wishlist: rawWishlist.map(normalizeWishlistItem),
    wishlistCount:
      typeof wishlistPayload?.count === "number"
        ? wishlistPayload.count
        : rawWishlist.length,
    cart,
    failures,
  };
}
