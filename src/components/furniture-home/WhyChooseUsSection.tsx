"use client";

import { Headphones, ShieldCheck, Sofa, Truck } from "lucide-react";
import { motion } from "framer-motion";

import type { ValueProp } from "@/components/furniture-home/types";

const icons = [Sofa, Truck, ShieldCheck, Headphones] as const;

type WhyChooseUsSectionProps = {
  items: ValueProp[];
};

export default function WhyChooseUsSection({ items }: WhyChooseUsSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-[#5a3ea8] uppercase">Why Choose Us</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#111827] sm:text-3xl">Built for a premium shopping experience</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index] ?? Sofa;

          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-[#ebe7f5] bg-white p-5"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#f3efff] text-[#5a3ea8]">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#111827]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#6b7280]">{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

