"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, SendHorizonal, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsletterSectionProps {
  onSubscribe?: (email: string) => void;
}

export default function NewsletterSection({ onSubscribe }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    onSubscribe?.(email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0533] via-[#3b1f8c] to-[#5a3ea8] p-8 md:p-12 shadow-2xl">
      {/* Blobs */}
      <div className="absolute right-[-5%] top-[-30%] w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute left-[-5%] bottom-[-20%] w-52 h-52 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
            <Mail className="w-3.5 h-3.5 mr-2" />
            Newsletter
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Get Exclusive Deals<br />in Your Inbox
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
            Join 50,000+ smart shoppers. Weekly deals, new arrivals, and exclusive discount codes delivered directly.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 text-white"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold">You&apos;re subscribed! Check your inbox 🎉</span>
          </motion.div>
        ) : (
          <div className="w-full max-w-md space-y-2">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="flex-1 h-12 rounded-xl bg-white/15 border-white/25 text-white placeholder:text-white/50 focus:bg-white/20 backdrop-blur-sm"
              />
              <Button
                onClick={handleSubmit}
                className="h-12 px-6 rounded-xl bg-white text-[#5a3ea8] hover:bg-white/90 font-bold shadow-lg"
              >
                <SendHorizonal className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
            {error && <p className="text-red-300 text-xs">{error}</p>}
            <p className="text-white/40 text-xs">No spam, unsubscribe anytime. We respect your privacy.</p>
          </div>
        )}

        <div className="flex items-center gap-6 pt-2">
          {[["50K+", "Subscribers"], ["4.9/5", "Rating"], ["Weekly", "Deals"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-white font-black text-lg">{num}</p>
              <p className="text-white/50 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

