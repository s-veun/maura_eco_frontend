import Link from "next/link";
import { ArrowRight, BadgePercent, Clock3, ShieldCheck, Truck } from "lucide-react";

type ShopHeroProps = {
  totalProducts: number;
};

export default function ShopHero({ totalProducts }: ShopHeroProps) {
  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#f5f3ff_0%,#fafafa_60%,#fafafa_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5a3ea8]">
            Premium B2B Ecommerce
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            Premium products for{" "}
            <span className="text-[#5a3ea8]">modern businesses.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
            Streamlined ordering, trusted suppliers, and transparent B2B pricing — all in one clean, modern storefront.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#products-grid"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#5a3ea8] px-6 text-sm font-semibold text-white transition hover:bg-[#4a3190]"
            >
              Browse collection
              <ArrowRight className="size-4" />
            </Link>
            <div className="rounded-full bg-[#f5f3ff] px-4 py-2 text-sm font-semibold text-[#5a3ea8]">
              {totalProducts} products available
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-3xl bg-[#0f0a1e] p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#5a3ea8]/20 blur-3xl" />
            <div className="flex items-center gap-2 text-sm font-semibold text-[#c4b5fd]">
              <ShieldCheck className="size-4" />
              Procurement confidence
            </div>
            <p className="mt-3 text-2xl font-black leading-snug">
              Quality-sourced products, dependable delivery, and a platform built for trust.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <BadgePercent className="size-5 text-[#c4b5fd]" />
                <p className="mt-3 text-sm text-slate-400">Volume pricing</p>
                <p className="mt-1 text-xl font-black">B2B deals</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <Truck className="size-5 text-[#c4b5fd]" />
                <p className="mt-3 text-sm text-slate-400">Fast delivery</p>
                <p className="mt-1 text-xl font-black">Same-day slots</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <Clock3 className="size-5 text-[#c4b5fd]" />
                <p className="mt-3 text-sm text-slate-400">Reorder speed</p>
                <p className="mt-1 text-xl font-black">Minutes, not tabs</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f5f3ff] p-5">
              <p className="text-sm text-[#6B7280]">Free shipping threshold</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-[#5a3ea8]">$80+</p>
            </div>
            <div className="rounded-2xl bg-[#ede9fe] p-5">
              <p className="text-sm text-[#6B7280]">Member savings</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-[#5a3ea8]">Up to 20% off</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
