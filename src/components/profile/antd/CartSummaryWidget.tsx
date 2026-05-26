"use client";

import { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CartSummaryWidgetProps = {
  items: number;
  total: number;
  wishlist: number;
  orders: number;
};

function CartSummaryWidgetComponent({ items, total, wishlist, orders }: CartSummaryWidgetProps) {
  return (
    <div className="border rounded-2xl bg-card p-4 shadow-sm">
      <h5 className="font-semibold text-base mb-3">Cart Summary</h5>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items</span>
          <span className="font-semibold">{items}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Total</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Wishlist</span>
          <span>{wishlist}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Orders</span>
          <span>{orders}</span>
        </div>
        <hr className="border-border my-1" />
        <Button className="w-full" asChild>
          <Link href="/cart">Go to Cart</Link>
        </Button>
      </div>
    </div>
  );
}

export const CartSummaryWidget = memo(CartSummaryWidgetComponent);
export default CartSummaryWidget;
