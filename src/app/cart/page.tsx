"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
import StoreLayout from "@/layouts/StoreLayout";

export default function CartPage() {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const {
    cart, isCartLoading, isBusy, isClearing,
    isEmpty,
    updateQuantity, removeItem, clearCart,
  } = useCart();

  return (
    <StoreLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between items-center">
          <h4 className="text-2xl font-bold">Shopping Cart</h4>
          <Button variant="outline" onClick={() => clearCart()} disabled={isBusy || isClearing}>Clear cart</Button>
        </div>

        {!mounted || isCartLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="border rounded-lg bg-card shadow-sm p-10 text-center">
            <h6 className="text-lg font-semibold">Your cart is empty</h6>
            <Button className="mt-4" asChild>
              <Link href="/products">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full overflow-x-auto border rounded-lg bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <button
                            className="p-2 rounded-md hover:bg-accent"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isBusy}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="p-2 rounded-md hover:bg-accent"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={isBusy}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${item.subTotal.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <button
                          className="p-2 rounded-md hover:bg-accent text-destructive"
                          onClick={() => removeItem(item.productId)}
                          disabled={isBusy}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="w-full lg:w-[340px] lg:sticky top-24 border rounded-lg bg-card shadow-sm p-4">
              <h6 className="text-lg font-semibold mb-3">Order Summary</h6>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                  <span>Items</span>
                  <span>{cart?.items.length}</span>
                </div>
                <hr className="border-border" />
                <div className="flex flex-row justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${cart?.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
              <Button className="w-full mt-2" variant="ghost" asChild>
                <Link href="/products">Continue shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
