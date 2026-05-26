"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";

const SOCIALS = [
	{ label: "Facebook", href: "#", abbr: "FB" },
	{ label: "Twitter", href: "#", abbr: "TW" },
	{ label: "Instagram", href: "#", abbr: "IG" },
	{ label: "YouTube", href: "#", abbr: "YT" },
];

const FOOTER_LINKS = {
	Shop: [
		{ label: "All Products", href: "/products" },
		{ label: "New Arrivals", href: "/products?sort=newest" },
		{ label: "Best Sellers", href: "/products?sort=popular" },
		{ label: "Flash Sale", href: "/products?tab=flash" },
	],
	Account: [
		{ label: "My Profile", href: "/profile" },
		{ label: "My Orders", href: "/orders" },
		{ label: "Wishlist", href: "/wishlist" },
		{ label: "Cart", href: "/cart" },
		{ label: "Track Order", href: "/tracking" },
	],
	Company: [
		{ label: "About Us", href: "/about" },
		{ label: "Contact", href: "/contact" },
		{ label: "Suppliers", href: "/suppliers" },
		{ label: "FAQ", href: "/faq" },
	],
	Legal: [
		{ label: "Privacy Policy", href: "/privacy" },
		{ label: "Terms of Service", href: "/terms" },
	],
};

export default function SiteFooter() {
	return (
		<footer className="bg-gray-950 text-gray-300 mt-8">
			<div className="max-w-360 mx-auto px-6 py-12">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
					<div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
						<Link href="/" className="flex items-center gap-2">
							<div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#5a3ea8] to-[#a78bfa] flex items-center justify-center text-white font-black">
								T
							</div>
							<span className="text-white font-black text-xl">
								Table<span className="text-[#a78bfa]">Eco</span>
							</span>
						</Link>
						<p className="text-sm text-gray-400 leading-relaxed max-w-xs">
							Premium furniture marketplace built for modern homes and businesses.
							Quality that lasts a lifetime.
						</p>
						<div className="flex items-center gap-2">
							{SOCIALS.map((s) => (
								<Link
									key={s.label}
									href={s.href}
									aria-label={s.label}
									className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#5a3ea8] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 text-xs font-bold"
								>
									{s.abbr}
								</Link>
							))}
						</div>
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2 text-gray-400">
								<Mail className="w-4 h-4 text-[#a78bfa]" />
								<span>support@tableeco.com</span>
							</div>
							<div className="flex items-center gap-2 text-gray-400">
								<Phone className="w-4 h-4 text-[#a78bfa]" />
								<span>+1 (800) 555-0100</span>
							</div>
							<div className="flex items-center gap-2 text-gray-400">
								<MapPin className="w-4 h-4 text-[#a78bfa]" />
								<span>123 Design St, San Francisco, CA</span>
							</div>
						</div>
					</div>
					{Object.entries(FOOTER_LINKS).map(([section, links]) => (
						<div key={section}>
							<h4 className="text-white font-bold text-sm mb-3">{section}</h4>
							<ul className="space-y-2">
								{links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-gray-400 hover:text-[#a78bfa] transition-colors duration-200"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Separator className="bg-white/5 mb-6" />
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-xs text-gray-500">
						&copy; {new Date().getFullYear()} TableEco. All rights reserved.
					</p>
					<div className="flex items-center gap-4 text-xs text-gray-500">
						<span>Secure Checkout</span>
						<span>Fast Delivery</span>
						<span>Easy Returns</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
