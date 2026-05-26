"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { Promo } from "@/components/furniture-home/types";

type PromoBannerProps = {
  promo: Promo;
};

export default function PromoBanner({ promo }: PromoBannerProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-gradient-to-br from-[#5a3ea8] to-[#7a5ed2] p-7 text-white shadow-[0_22px_40px_rgba(90,62,168,0.25)]"
    >
      <p className="text-xs tracking-[0.16em] text-white/80 uppercase">Limited Offer</p>
      <h3 className="mt-2 text-2xl font-semibold">{promo.title}</h3>
      <p className="mt-3 max-w-md text-sm text-white/85">{promo.description}</p>
      <Button className="mt-5 h-10 rounded-full bg-white px-5 text-[#5a3ea8] hover:bg-[#f4efff]">
        {promo.cta}
        <ArrowRight className="size-4" />
      </Button>
    </motion.article>
  );
}

