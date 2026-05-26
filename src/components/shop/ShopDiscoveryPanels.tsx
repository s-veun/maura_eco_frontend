"use client";

import { motion } from "framer-motion";
import {
  BadgePercent,
  Boxes,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

type ShopDiscoveryPanelsProps = {
  totalResults: number;
  totalCategories: number;
  averagePrice: string;
  discountedCount: number;
  activeFilters: string[];
  featuredCategories: string[];
};

const collectionCards = [
  {
    title: "Quick restock",
    description: "Designed for repeat purchases and everyday essentials.",
    icon: Boxes,
    className:
      "border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-emerald-100/80",
  },
  {
    title: "Value picks",
    description: "Great for price-sensitive shoppers tracking the best current deals.",
    icon: BadgePercent,
    className:
      "border-amber-100 bg-gradient-to-br from-white via-amber-50 to-orange-100/80",
  },
  {
    title: "Reliable delivery",
    description: "Highlighting fulfillment trust and freshness for busy households.",
    icon: Truck,
    className:
      "border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-100/80",
  },
];

export default function ShopDiscoveryPanels({
  totalResults,
  totalCategories,
  averagePrice,
  discountedCount,
  activeFilters,
  featuredCategories,
}: ShopDiscoveryPanelsProps) {
  const stats = [
    {
      label: "Visible products",
      value: totalResults.toLocaleString(),
      icon: Boxes,
    },
    {
      label: "Average price",
      value: averagePrice,
      icon: CircleDollarSign,
    },
    {
      label: "Discounted items",
      value: discountedCount.toLocaleString(),
      icon: BadgePercent,
    },
    {
      label: "Live categories",
      value: totalCategories.toLocaleString(),
      icon: Sparkles,
    },
  ];

  return (
    <div className="mb-8 space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-[32px] bg-[#0f172a] p-7 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            <Sparkles className="size-3.5" />
            Shop smarter
          </div>
          <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
            A cleaner browsing flow for restocks, discovery, and better buying decisions.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This storefront now gives shoppers stronger context up front, so the product grid
            feels guided instead of overwhelming.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {featuredCategories.slice(0, 5).map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"
              >
                {category}
              </span>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </motion.article>
      </section>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Active filters
          </span>
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
            >
              {filter}
            </span>
          ))}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {collectionCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={`rounded-[28px] border p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] ${card.className}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
            </motion.article>
          );
        })}
      </section>

      <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-sky-50 px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
                Shopping promise
              </p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                Better discovery is only useful if fulfillment stays trustworthy.
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Fresh handling, cleaner category journeys, and clearer value signals now work together.
              </p>
            </div>
          </div>
          <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
            Ready for richer campaign UI next
          </div>
        </div>
      </div>
    </div>
  );
}
