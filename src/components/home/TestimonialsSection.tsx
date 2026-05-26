"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const REVIEWS = [
  {
    name: "Sarah Kim",
    role: "Cafe Owner",
    initials: "SK",
    comment: "TableEco helped us source premium cafe tables in one week. Fast delivery and great quality!",
    rating: 5,
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    name: "Daniel Tran",
    role: "Interior Designer",
    initials: "DT",
    comment: "Great quality control, clean checkout flow, and smooth logistics tracking. Highly recommended.",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Mia Lopez",
    role: "Retail Manager",
    initials: "ML",
    comment: "The flash sale and recommendation feed are spot on for our business. Saves us hours every week.",
    rating: 4,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "James Chen",
    role: "Procurement Head",
    initials: "JC",
    comment: "Best B2B marketplace I've used. Supplier verification and bulk pricing tools are excellent.",
    rating: 5,
    gradient: "from-orange-400 to-amber-500",
  },
  {
    name: "Emma Wilson",
    role: "Home Decorator",
    initials: "EW",
    comment: "Beautiful furniture pieces, arrived perfectly packaged. Will definitely order again!",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#5a3ea8] to-[#a78bfa]" />
        <div>
          <h2 className="text-xl font-black text-gray-900">What Customers Say</h2>
          <p className="text-xs text-gray-400">Real reviews from verified purchases</p>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-3">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="w-72 shrink-0"
            >
              <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white">
                <CardContent className="p-5 flex flex-col gap-3 h-full">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-600 italic leading-relaxed flex-1">
                    &quot;{review.comment}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`bg-gradient-to-br ${review.gradient} text-white text-xs font-black`}>
                        {review.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

