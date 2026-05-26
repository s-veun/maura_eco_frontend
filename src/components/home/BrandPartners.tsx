"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const BRANDS = [
  { name: "UrbanCraft", emoji: "🪑" },
  { name: "Nordline", emoji: "🏠" },
  { name: "OakHaus", emoji: "🌿" },
  { name: "StudioForm", emoji: "✨" },
  { name: "ZenWood", emoji: "🌲" },
  { name: "FreshMart", emoji: "🛒" },
];

export default function BrandPartners() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#5a3ea8] to-[#a78bfa]" />
        <h2 className="text-xl font-black text-gray-900">Trusted Brand Partners</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {BRANDS.map((brand, idx) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -4, scale: 1.04 }}
          >
            <Card className="cursor-pointer text-center border border-purple-100 hover:border-[#5a3ea8]/30 hover:shadow-lg transition-all duration-200 rounded-2xl bg-white">
              <div className="p-4 flex flex-col items-center gap-1.5">
                <span className="text-2xl">{brand.emoji}</span>
                <p className="text-xs font-bold text-[#5a3ea8]">{brand.name}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

