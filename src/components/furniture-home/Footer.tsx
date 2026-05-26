import { Globe, Mail, MapPin, Phone } from "lucide-react";

const footerColumns = [
  {
    title: "Shop",
    links: ["Dining Tables", "Coffee Tables", "Office Furniture", "Sale Collection"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Story", "Careers", "Press"],
  },
  {
    title: "Support",
    links: ["Contact", "Shipping", "Returns", "FAQ"],
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#141120] text-[#d7d2e8]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            Table<span className="text-[#a690f0]">Eco</span>
          </h3>
          <p className="mt-4 max-w-xs text-sm text-[#bcb5d7]">
            Premium tables and furniture designed for modern homes and intentional living.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <SocialIcon icon={<Globe className="size-4" />} />
            <SocialIcon icon={<Mail className="size-4" />} />
            <SocialIcon icon={<Phone className="size-4" />} />
            <SocialIcon icon={<MapPin className="size-4" />} />
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{column.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#b9b2d4]">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-[#a690f0]">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-6 py-4 text-xs text-[#b9b2d4] sm:flex-row sm:items-center lg:px-8">
          <p>2026 TableEco. All rights reserved.</p>
          <p>Payment Methods: Visa | Mastercard | PayPal | Apple Pay</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex size-8 items-center justify-center rounded-full border border-white/15 text-[#d7d2e8] transition-colors hover:border-[#a690f0] hover:text-[#a690f0]"
    >
      {icon}
    </button>
  );
}

