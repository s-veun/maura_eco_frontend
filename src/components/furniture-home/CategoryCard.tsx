"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { Category } from "@/components/furniture-home/types";

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      <Image
        src={category.image}
        alt={category.title}
        width={900}
        height={384}
        unoptimized
        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b1f]/80 to-transparent" />
      <h3 className="absolute right-4 bottom-4 left-4 text-lg font-semibold text-white">{category.title}</h3>
    </motion.article>
  );
}

