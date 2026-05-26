"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "@/redux/api/productApi";
import { useToast } from "@/components/ui/toast-provider";
import { getApiErrorMessage } from "@/lib/api-error";

/**
 * Centralised cart hook.
 *
 * – Reads the authenticated user from Redux (set by AuthInitializer).
 * – Wraps every mutation with structured toast feedback.
 * – Handles 401/403/404/500 error codes with specific messages.
 * – Redirects to /login on auth failure.
 */
export function useCart() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const userId: number | undefined = user?.id as number | undefined;

  // ── Queries ─────────────────────────────────────────────────────────────────
  const {
    data: cart,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    refetch,
  } = useGetCartQuery(userId ?? skipToken);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const [updateQuantityMutation, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
  const [removeItemMutation, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCartMutation, { isLoading: isClearing }] = useClearCartMutation();

  // ── Auth guard ───────────────────────────────────────────────────────────────
  const requireAuth = useCallback(
    (redirectTo = pathname || "/cart"): boolean => {
      if (!isAuthenticated || !userId) {
        showToast({
          type: "error",
          title: "Login required",
          message: "Please sign in to manage your cart.",
        });
        router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
        return false;
      }
      return true;
    },
    [isAuthenticated, pathname, userId, router, showToast],
  );

  // ── Error handler ────────────────────────────────────────────────────────────
  const handleCartError = useCallback(
    (err: unknown) => {
      const status =
        typeof err === "object" && err !== null
          ? ((err as Record<string, unknown>).status as number | undefined)
          : undefined;
      const message = getApiErrorMessage(err, "Something went wrong. Please try again.");

      if (status === 401) {
        showToast({
          type: "error",
          title: "Session expired",
          message: "Please sign in again to continue.",
        });
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/cart")}`);
      } else if (status === 403) {
        showToast({
          type: "error",
          title: "Access denied",
          message: "You can only manage your own cart.",
        });
      } else if (message.toLowerCase().includes("stock") || message.toLowerCase().includes("out of stock")) {
        showToast({
          type: "error",
          title: "Out of stock",
          message,
        });
      } else if (status && status >= 500) {
        showToast({
          type: "error",
          title: "Server error",
          message: "We couldn't update your cart right now. Please try again.",
        });
      } else if (status === 404) {
        showToast({ type: "error", title: "Not found", message });
      } else {
        showToast({ type: "error", title: "Cart error", message });
      }
    },
    [pathname, router, showToast],
  );

  // ── addToCart ────────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      if (!requireAuth()) return;
      try {
        await addToCartMutation({ userId: userId!, productId, quantity }).unwrap();
        // showToast({ type: "success", title: "Added successfully." });
      } catch (err) {
        handleCartError(err);
        throw err;
      }
    },
    [requireAuth, addToCartMutation, userId, showToast, handleCartError],
  );

  // ── updateQuantity ────────────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!requireAuth()) return;
      if (quantity < 1) return;
      try {
        await updateQuantityMutation({ userId: userId!, productId, quantity }).unwrap();
      } catch (err) {
        handleCartError(err);
        throw err;
      }
    },
    [requireAuth, updateQuantityMutation, userId, handleCartError],
  );

  // ── removeItem ────────────────────────────────────────────────────────────────
  const removeItem = useCallback(
    async (productId: number) => {
      if (!requireAuth()) return;
      try {
        await removeItemMutation({ userId: userId!, productId }).unwrap();
        showToast({ type: "success", title: "Item removed", message: "Item removed from your cart." });
      } catch (err) {
        handleCartError(err);
        throw err;
      }
    },
    [requireAuth, removeItemMutation, userId, showToast, handleCartError],
  );

  // ── clearCart ─────────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (!requireAuth()) return;
    try {
      await clearCartMutation(userId!).unwrap();
      showToast({ type: "success", title: "Cart cleared", message: "All items have been removed." });
    } catch (err) {
      handleCartError(err);
      throw err;
    }
  }, [requireAuth, clearCartMutation, userId, showToast, handleCartError]);

  // ── Derived state ─────────────────────────────────────────────────────────────
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;
  const isEmpty = !cart || !cart.items || cart.items.length === 0;
  const getItemQuantity = useCallback(
    (productId: number) =>
      cart?.items?.find((item) => item.productId === productId)?.quantity ?? 0,
    [cart?.items],
  );

  return {
    // data
    cart,
    cartItemCount,
    totalPrice,
    isEmpty,
    getItemQuantity,
    // loading flags
    isCartLoading,
    isCartFetching,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,
    isBusy: isAdding || isUpdating || isRemoving || isClearing,
    // actions
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetch,
    // auth
    isAuthenticated,
    userId,
  };
}
