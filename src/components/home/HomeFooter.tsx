"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Globe, Share2, Rss, PlayCircle, Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SOCIAL = [
  { icon: <Globe className="h-4 w-4" />, href: "#", label: "Facebook" },
  { icon: <Share2 className="h-4 w-4" />, href: "#", label: "Instagram" },
  { icon: <Rss className="h-4 w-4" />, href: "#", label: "Twitter" },
  { icon: <PlayCircle className="h-4 w-4" />, href: "#", label: "YouTube" },
];

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Flash Deals", href: "/products?deal=flash" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/help" },
  { label: "Returns", href: "/returns" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Track Order", href: "/track" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const CATEGORIES = [
  { label: "Electronics", href: "/products?category=electronics" },
  { label: "Furniture", href: "/products?category=furniture" },
  { label: "Fashion", href: "/products?category=fashion" },
  { label: "Grocery", href: "/products?category=grocery" },
  { label: "Beauty", href: "/products?category=beauty" },
  { label: "Sports", href: "/products?category=sports" },
];

export function HomeFooter() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    const val = emailRef.current?.value.trim();
    if (!val || !val.includes("@")) return;
    setSubscribed(true);
    if (emailRef.current) emailRef.current.value = "";
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer style={{ background: "#1a0533" }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-white text-xl font-extrabold m-0">TableEco</h3>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                Your trusted marketplace for quality furniture and home goods. Shop smart, live better.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Mail className="h-4 w-4 text-purple-400" />
              <span>hello@tableeco.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Phone className="h-4 w-4 text-purple-400" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 text-white/70 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-[15px]">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/55 text-sm hover:text-purple-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-[15px]">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/55 text-sm hover:text-purple-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-2 text-[15px]">Newsletter</h4>
            <p className="text-white/55 text-sm mb-4 leading-relaxed">
              Subscribe to get exclusive deals, new arrivals, and special promotions.
            </p>
            {subscribed ? (
              <p className="text-green-400 text-sm font-medium">Thanks for subscribing! 🎉</p>
            ) : (
              <div className="flex gap-2">
                <Input
                  ref={emailRef}
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 h-10"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubscribe(); }}
                />
                <Button onClick={handleSubscribe} size="sm" className="h-10 px-3 bg-purple-600 hover:bg-purple-500">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="mt-5">
              <h4 className="text-white font-semibold mb-2 text-[15px]">Support</h4>
              <ul className="space-y-2">
                {SUPPORT_LINKS.slice(0, 3).map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-white/55 text-sm hover:text-purple-300 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-white/45 text-sm">© {new Date().getFullYear()} TableEco. All rights reserved.</span>
          <div className="flex gap-4">
            {SUPPORT_LINKS.slice(3).map((l) => (
              <Link key={l.label} href={l.href} className="text-white/40 text-xs hover:text-white/70 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
