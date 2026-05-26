"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-[#e8e4f4] bg-gradient-to-br from-[#f7f3ff] to-white p-6 sm:p-10"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#5a3ea8] uppercase">Newsletter</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#111827] sm:text-3xl">Get exclusive furniture drops and offers</h2>
        <p className="mt-3 text-sm text-[#6b7280]">
          Subscribe for design updates, member-only discounts, and curated table collections.
        </p>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-11 rounded-full border-[#ddd5f1] bg-white px-4"
            aria-label="Email address"
          />
          <Button className="h-11 rounded-full bg-[#5a3ea8] px-6 text-white hover:bg-[#4b3294]">Subscribe</Button>
        </form>
      </div>
    </motion.section>
  );
}

