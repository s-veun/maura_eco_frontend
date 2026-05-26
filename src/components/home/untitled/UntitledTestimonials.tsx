"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { LandingTestimonial } from "@/types/landing";

const testimonials: LandingTestimonial[] = [
  {
    id: "t-1",
    name: "Amelia Park",
    role: "Interior Architect",
    avatar: "/profile-bg.png",
    rating: 5,
    quote:
      "TableEco helped us source premium table collections in one place. The quality and delivery workflow are excellent.",
  },
  {
    id: "t-2",
    name: "Jordan Cruz",
    role: "Cafe Owner",
    avatar: "/auth-bg.png",
    rating: 5,
    quote:
      "The curated categories and recommendations saved us hours. We launched our new cafe interior two weeks ahead of plan.",
  },
  {
    id: "t-3",
    name: "Noah Bennett",
    role: "Procurement Lead",
    avatar: "/hero.png",
    rating: 4,
    quote:
      "Fast support, modern dashboard experience, and trusted suppliers. It feels like enterprise tooling with startup speed.",
  },
];

export function UntitledTestimonials() {
  return (
    <Carousel opts={{ loop: true, align: "start" }}>
      <CarouselContent>
        {testimonials.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 xl:basis-1/3">
            <Card className="h-full rounded-3xl border border-slate-200/80 bg-white/90 py-0 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${item.id}-${index}`} className={`size-4 ${index < item.rating ? "fill-current" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.quote}</p>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 hidden items-center justify-end gap-3 md:flex">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}

export default UntitledTestimonials;

