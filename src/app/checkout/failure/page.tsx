"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreLayout from "@/layouts/StoreLayout";

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason") || "Your checkout could not be processed.";

  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto py-10 md:py-14">
        <div className="border rounded-2xl bg-card p-8 md:p-12 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <h1 className="text-2xl font-extrabold">Checkout Failed</h1>
          </div>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {reason}
          </div>
          <p className="text-muted-foreground text-sm">
            Please verify billing/shipping details and retry checkout. If this persists,
            contact your account manager or support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild><Link href="/checkout">Retry Checkout</Link></Button>
            <Button variant="outline" asChild><Link href="/cart">Back to Cart</Link></Button>
            <Button variant="ghost" asChild><Link href="/contact">Contact Support</Link></Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

