"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#120f25]">
      <Image
        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80"
        alt="Modern living room with premium furniture"
        width={1600}
        height={520}
        unoptimized
        className="h-[520px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#100d20]/90 via-[#291d53]/70 to-[#5a3ea8]/45" />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
              Modern Table Collection
            </p>
            <h1 className="text-4xl leading-tight font-semibold text-white sm:text-5xl lg:text-6xl">
              Minimal furniture crafted for modern living.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              Discover premium tables and furniture pieces designed with elegant materials, clean lines, and comfort-first usability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="h-11 rounded-full bg-[#5a3ea8] px-6 text-white hover:bg-[#4c3293]">
                Shop Now
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
              >
                Explore Collection
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

