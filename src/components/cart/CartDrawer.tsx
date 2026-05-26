"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import { useAuth } from "@/auth/AuthProvider";
import CartSummary from "@/components/cart/CartSummary";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useGetProductByIdQuery } from "@/redux/api/productApi";

function CartDrawerItem({
  productId,
  productName,
  quantity,
  unitPrice,
  subTotal,
  onDecrease,
  onIncrease,
  onRemove,
  isBusy,
}: {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  isBusy: boolean;
}) {
  const { data: product } = useGetProductByIdQuery(productId);
  const imageSrc = product?.thumbnailImage || product?.imageUrl || product?.imageName || null;

  return (
    <article className="flex gap-3 rounded-3xl border border-[#e4e2f1] bg-white p-3 shadow-[0_12px_24px_rgba(20,20,44,0.08)]">
      <Link
        href={`/products/${productId}`}
        className="relative h-22 w-22 shrink-0 overflow-hidden rounded-2xl bg-[#f3f4fa]"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={productName}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <ShoppingCart className="size-7" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${productId}`}
              className="line-clamp-2 text-sm font-bold text-[#1a1e31] transition hover:text-[#5a3ea8]"
            >
              {productName}
            </Link>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8c92ab]">
              ${unitPrice.toFixed(2)} each
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={isBusy}
            className="rounded-full p-2 text-[#9fa4b8] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            aria-label={`Remove ${productName}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantitySelector value={quantity} onDecrease={onDecrease} onIncrease={onIncrease} disabled={isBusy} size="sm" />

          <p className="text-sm font-black text-[#1a1e31]">${subTotal.toFixed(2)}</p>
        </div>
      </div>
    </article>
  );
}

export default function CartDrawer() {
  const pathname = usePathname();
  const { isOpen, closeDrawer } = useCartDrawer();
  const { isLoading: isAuthLoading } = useAuth();
  const {
    cart,
    cartItemCount,
    totalPrice,
    isEmpty,
    isBusy,
    isCartLoading,
    isAuthenticated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    closeDrawer();
  }, [closeDrawer, pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeDrawer, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-slate-950/45"
              onClick={closeDrawer}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed bottom-0 right-0 top-0 z-[120] flex w-full max-w-md flex-col bg-[#f8f9ff] shadow-[0_24px_60px_rgba(15,23,42,0.25)] sm:max-w-xl"
              aria-hidden={!isOpen}
            >
              <div className="flex items-center justify-between border-b border-[#dedcf0] px-5 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#848ca9]">
                    Cart preview
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#1a1e31]">
                    Your cart
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5b637f] shadow-sm transition hover:bg-[#f0f2ff]"
                  aria-label="Close cart drawer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {isAuthLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="size-7 animate-spin text-[#5b637f]" />
                </div>
              ) : !isAuthenticated ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ecebfb] text-[#5a3ea8]">
                    <ShoppingCart className="size-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#1a1e31]">Sign in to use your cart</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#656d89]">
                    Your cart is linked to your account so it can persist across refreshes and devices.
                  </p>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname || "/")}`}
                    className="mt-6 inline-flex h-11 items-center rounded-full bg-[#5a3ea8] px-6 text-sm font-semibold text-white transition hover:bg-[#4a3290]"
                  >
                    Go to login
                  </Link>
                </div>
              ) : isCartLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="size-7 animate-spin text-[#5b637f]" />
                </div>
              ) : isEmpty ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#ecebfb] text-[#5a3ea8]">
                    <ShoppingCart className="size-8" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#1a1e31]">Your cart is empty</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#656d89]">
                    Add products from the home page or shop to see a quick preview here.
                  </p>
                  <Link
                    href="/products"
                    className="mt-6 inline-flex h-11 items-center rounded-full bg-[#5a3ea8] px-6 text-sm font-semibold text-white transition hover:bg-[#4a3290]"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-[#dedcf0] px-5 py-3 text-sm text-[#616986]">
                    <span>{cartItemCount} items</span>
                    <button
                      type="button"
                      onClick={() => void clearCart()}
                      disabled={isBusy}
                      className="font-semibold text-red-500 transition hover:text-red-600 disabled:opacity-50"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                    {cart?.items.map((item) => (
                      <CartDrawerItem
                        key={item.id}
                        productId={item.productId}
                        productName={item.productName}
                        quantity={item.quantity}
                        unitPrice={item.unitPrice}
                        subTotal={item.subTotal}
                        isBusy={isBusy}
                        onDecrease={() => void updateQuantity(item.productId, item.quantity - 1)}
                        onIncrease={() => void updateQuantity(item.productId, item.quantity + 1)}
                        onRemove={() => void removeItem(item.productId)}
                      />
                    ))}
                  </div>

                  <div className="border-t border-[#dedcf0] px-5 py-5">
                    <CartSummary itemCount={cartItemCount} subtotal={totalPrice} />
                  </div>
                </>
              )}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
