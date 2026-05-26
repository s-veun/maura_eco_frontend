"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "@/components/aceternity/layout-grid";
import { Spotlight } from "@/components/aceternity/spotlight";

/* -- Card content overlay (shown when a card is expanded) --------------- */
function GridCardContent({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-violet-300 text-xs font-semibold tracking-widest uppercase">
        {badge}
      </p>
      <p className="font-bold text-white text-xl leading-tight">{title}</p>
      <p className="text-sm text-white/70 max-w-xs leading-relaxed">{subtitle}</p>
    </div>
  );
}

/* -- Static card data --------------------------------------------------- */
const heroCards = [
  {
    id: 1,
    content: (
      <GridCardContent
        badge="Featured collection"
        title="Artisan Dining Tables"
        subtitle="Handcrafted from sustainable hardwood. Built for family, crafted for generations."
      />
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    content: (
      <GridCardContent
        badge="New arrivals"
        title="Ergonomic Seating"
        subtitle="Premium chairs designed for every space and occasion."
      />
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    content: (
      <GridCardContent
        badge="Collections"
        title="Office Furniture"
        subtitle="Productive spaces start with the right furniture."
      />
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    content: (
      <GridCardContent
        badge="Trending now"
        title="Living Room Essentials"
        subtitle="Elevate your living space with curated sofas, tables, and statement pieces."
      />
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=900&auto=format&fit=crop",
  },
];

/* -- Hero section ------------------------------------------------------- */
export function HeroLayoutGrid() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Ambient spotlights */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="violet" />
      <Spotlight className="top-10 right-0 md:right-0" fill="indigo" />

      {/* Soft radial glow centred on the grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-150 w-225 rounded-full bg-violet-900/10 blur-[120px]" />
      </div>

      <div className="relative">
        {/* --- Aceternity Layout Grid ----------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="h-130 md:h-145"
        >
          <LayoutGrid cards={heroCards} />
        </motion.div>

        {/* Gradient fade into next section */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-950 to-transparent" />
      </div>
    </section>
  );
}

export default HeroLayoutGrid;
