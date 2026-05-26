import Link from "next/link";
import { CheckCircle2, Lock, Tag } from "lucide-react";

type CartSummaryProps = {
  itemCount: number;
  subtotal: number;
  checkoutHref?: string;
  viewCartHref?: string;
  compact?: boolean;
};

export default function CartSummary({
  itemCount,
  subtotal,
  checkoutHref = "/checkout",
  viewCartHref = "/cart",
  compact = false,
}: CartSummaryProps) {
  const freeShippingGoal = 50;
  const progress = Math.min((subtotal / freeShippingGoal) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingGoal - subtotal, 0);

  return (
    <section className="space-y-4 rounded-3xl border border-[#e2def3] bg-white p-4 shadow-[0_16px_30px_rgba(24,23,45,0.08)] sm:p-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5b637f]">
          <span>Shipping progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#eeebf8]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#5a3ea8] to-[#7e5de0]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-[#6a728f]">
          {remainingForFreeShipping > 0
            ? `Add $${remainingForFreeShipping.toFixed(2)} for free express shipping.`
            : "You unlocked free express shipping."}
        </p>
      </div>

      <div className="rounded-2xl bg-[#f8f6ff] p-3.5">
        <div className="flex items-center justify-between text-sm text-[#626b87]">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-semibold text-[#1e2338]">${subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-[#626b87]">
          <span>Shipping</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f9ef] px-2 py-0.5 text-xs font-semibold text-[#1e8a4c]">
            <CheckCircle2 className="size-3" /> Free
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-[#626b87]">
          <span>Tax estimate</span>
          <span className="font-semibold text-[#1e2338]">$0.00</span>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#d7d2ef] p-3">
        <label htmlFor={`coupon-${compact ? "compact" : "full"}`} className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-[#565e7b]">
          <Tag className="size-3.5 text-[#5a3ea8]" /> Coupon
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`coupon-${compact ? "compact" : "full"}`}
            placeholder="Add code"
            className="h-10 w-full rounded-xl border border-[#dedcf0] bg-white px-3 text-sm text-[#1f2436] placeholder:text-[#9ca3ba] focus:border-[#5a3ea8] focus:outline-none"
          />
          <button className="h-10 rounded-xl bg-[#5a3ea8] px-3 text-xs font-semibold text-white transition hover:bg-[#4a3290]">
            Apply
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          href={checkoutHref}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#5a3ea8] text-sm font-semibold text-white transition hover:bg-[#4a3290]"
        >
          Proceed to checkout
        </Link>
        <Link
          href={viewCartHref}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#ddd8f1] bg-white text-sm font-semibold text-[#322559] transition hover:bg-[#f5f3ff]"
        >
          View full cart
        </Link>
      </div>

      <p className="inline-flex w-full items-center justify-center gap-1 text-[11px] font-medium text-[#6e7692]">
        <Lock className="size-3.5 text-[#1e8a4c]" /> Secure encrypted checkout
      </p>
    </section>
  );
}

