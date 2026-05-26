import { Globe, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b1224] text-[#c8ccda]">
      <div className="mx-auto grid w-full max-w-[1240px] gap-7 px-3 py-9 sm:px-4 md:grid-cols-6 md:py-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#5a3ea8] px-2 py-1 text-sm font-black text-white">S</span>
            <h3 className="text-lg font-black text-white">ShopStore</h3>
          </div>
          <p className="mt-3 max-w-sm text-xs text-[#93a0c1]">
            A local grocery and food marketplace with curated quality products and lightning-fast delivery slots.
          </p>
          <div className="mt-4 space-y-2 text-xs text-[#a7b2d1]">
            <p className="flex items-center gap-2"><Phone className="size-3.5" /> 0 800 300 3535</p>
            <p className="flex items-center gap-2"><Mail className="size-3.5" /> info@example.com</p>
            <p className="flex items-center gap-2"><MapPin className="size-3.5" /> New York, US</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Do You Need Help?</h4>
          <ul className="mt-3 space-y-2 text-xs text-[#9aa2b7]">
            <li>Create support ticket</li>
            <li>Returns and refunds</li>
            <li>Order tracking</li>
            <li>How to shop</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Make Money with Us</h4>
          <ul className="mt-3 space-y-2 text-xs text-[#9aa2b7]">
            <li>Sell products</li>
            <li>Advertise your products</li>
            <li>Become an affiliate</li>
            <li>Self-publish with us</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Let Us Help You</h4>
          <ul className="mt-3 space-y-2 text-xs text-[#9aa2b7]">
            <li>Accessibility</li>
            <li>Your orders</li>
            <li>Shipping rates</li>
            <li>Returns policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Download our app</h4>
          <div className="mt-3 space-y-2">
            <button className="w-full rounded-md border border-white/20 bg-white/5 px-2 py-2 text-left text-[11px] text-white">Google Play</button>
            <button className="w-full rounded-md border border-white/20 bg-white/5 px-2 py-2 text-left text-[11px] text-white">App Store</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-3 py-4 text-[11px] text-[#7f87a1] sm:px-4 md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 ShopStore. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[#d6dbef]">
            {[Globe, MessageCircle, Send].map((Icon, idx) => (
              <span key={idx} className="rounded bg-white/10 p-1.5"><Icon className="size-3.5" /></span>
            ))}
          </div>
          <p>Payment methods: Visa · PayPal · Skrill · Klarna</p>
        </div>
      </div>
    </footer>
  );
}

