"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreLayout from "@/layouts/StoreLayout";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderRef = searchParams?.get("orderRef") || "Pending";

  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto py-10 md:py-14">
        <div className="border rounded-2xl bg-card p-8 md:p-12 text-center shadow-sm space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold">Order Confirmed</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your order has been successfully submitted to our B2B fulfillment team.
            You can track approvals, invoice updates, and shipment status from your account.
          </p>
          <span className="inline-flex items-center rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 px-4 py-1 text-sm font-bold">
            Reference: {orderRef}
          </span>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button asChild><Link href="/orders">View My Orders</Link></Button>
            <Button variant="outline" asChild><Link href="/tracking">Track Order</Link></Button>
            <Button variant="ghost" asChild><Link href="/products">Continue Shopping</Link></Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

