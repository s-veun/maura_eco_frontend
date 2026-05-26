"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import StoreLayout from "@/layouts/StoreLayout";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "How do B2B pricing tiers work?",
    a: "Pricing is volume-based. Higher quantities unlock tiered discounts and dedicated support.",
  },
  {
    q: "Can I request a custom quote?",
    a: "Yes. Use the RFQ form on supplier pages with quantity, specs, and desired delivery windows.",
  },
  {
    q: "What payment methods are available for business buyers?",
    a: "Invoice (Net terms), bank transfer, and corporate card are available based on account verification.",
  },
  {
    q: "How can I track large orders?",
    a: "Each order includes live status timeline updates in your Orders and Tracking pages.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto py-8 md:py-12 space-y-3">
        <h1 className="text-3xl font-extrabold">FAQ</h1>
        <p className="text-muted-foreground">Frequently asked questions for business buyers and procurement teams.</p>
        <div className="space-y-2 pt-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-accent transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.q}
                <ChevronDown className={cn("h-4 w-4 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-muted-foreground text-sm">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}

