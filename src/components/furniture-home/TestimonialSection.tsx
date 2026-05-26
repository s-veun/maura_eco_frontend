"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

import type { Testimonial } from "@/components/furniture-home/types";

type TestimonialSectionProps = {
  items: Testimonial[];
};

export default function TestimonialSection({ items }: TestimonialSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-[#5a3ea8] uppercase">Testimonials</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#111827] sm:text-3xl">Loved by modern homeowners</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl border border-[#ebe7f5] bg-white p-6 shadow-[0_16px_30px_rgba(17,24,39,0.05)]"
          >
            <div className="mb-3 flex gap-1">
              {Array.from({ length: item.rating }).map((_, starIndex) => (
                <Star key={starIndex} className="size-4 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#4b5563]">{item.text}</p>
            <div className="mt-5">
              <p className="font-semibold text-[#111827]">{item.name}</p>
              <p className="text-sm text-[#6b7280]">{item.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

