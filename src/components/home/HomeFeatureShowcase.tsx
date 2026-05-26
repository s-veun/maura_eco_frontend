"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  Clock3,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

const featureCards = [
  {
    title: "Quality-first sourcing",
    description:
      "Every supplier and SKU is vetted for reliability, consistency, and B2B suitability.",
    icon: Leaf,
    iconBg: "bg-[#5a3ea8]",
    bg: "bg-[#f5f3ff]",
  },
  {
    title: "Fast, reliable delivery",
    description:
      "Same-day and next-day options across metro zones with real-time tracking.",
    icon: Truck,
    iconBg: "bg-[#4a3190]",
    bg: "bg-[#ede9fe]",
  },
  {
    title: "Member-only pricing",
    description:
      "Unlock volume discounts, bundle deals, and loyalty perks on every order.",
    icon: BadgePercent,
    iconBg: "bg-[#7c3aed]",
    bg: "bg-[#f5f3ff]",
  },
  {
    title: "Verified trust layer",
    description:
      "Quality checks, transparent sourcing, and compliance documentation available.",
    icon: ShieldCheck,
    iconBg: "bg-[#2d1b69]",
    bg: "bg-[#ede9fe]",
  },
];

const shoppingSteps = [
  "Search by category, need, or supplier with smart discovery tools.",
  "Build orders with volume pricing, bundles, and repeat-order templates.",
  "Confirm freshness, track delivery, and manage returns seamlessly.",
];

type HomeFeatureShowcaseProps = {
  featuredCategories: string[];
};

export default function HomeFeatureShowcase({ featuredCategories }: HomeFeatureShowcaseProps) {
  const categories = featuredCategories.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Feature cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-5 ${item.bg}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                <Icon className="size-5 text-white" />
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight text-[#111827]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-[#6B7280]">
                {item.description}
              </p>
            </motion.article>
          );
        })}
      </section>

      {/* Smart CTA + Categories */}
      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Dark CTA card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-[#0f0a1e] p-8 text-white"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#5a3ea8]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-16 h-40 w-40 rounded-full bg-[#7c3aed]/15 blur-3xl" />

          <div className="flex items-center gap-2 text-sm font-semibold text-[#c4b5fd]">
            <Sparkles className="size-4" />
            Smart B2B experience
          </div>
          <h3 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-[2rem]">
            Streamline your business ordering in one connected platform.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            TableEco unifies discovery, pricing confidence, and delivery into a single clean workflow — built for modern B2B procurement.
          </p>

          <div className="mt-6 grid gap-2.5">
            {shoppingSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5a3ea8] text-xs font-black text-white">
                  0{index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-300">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#5a3ea8] px-5 text-sm font-bold text-white transition hover:bg-[#4a3190]"
            >
              Explore the shop
              <ArrowRight className="size-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <Clock3 className="size-3.5" />
              Reorder in seconds
            </div>
          </div>
        </motion.article>

        {/* Categories card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-3xl bg-white p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9CA3AF]">
            Popular categories
          </p>
          <h3 className="mt-3 text-xl font-black tracking-tight text-[#111827]">
            Start from categories customers reach for most.
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            These categories anchor bundles, campaigns, and faster purchasing journeys.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="cursor-pointer rounded-full bg-[#f5f3ff] px-3 py-1.5 text-xs font-semibold text-[#5a3ea8] transition hover:bg-[#ede9fe]"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-2.5">
            {[
              { icon: Zap, text: "Faster ordering with smart basket building" },
              { icon: ShieldCheck, text: "Supplier-verified quality on every order" },
              { icon: BadgePercent, text: "Volume discounts and bundle campaigns" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl bg-[#f5f3ff] px-4 py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5a3ea8]">
                    <Icon className="size-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-[#374151]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </motion.article>
      </section>
    </div>
  );
}
