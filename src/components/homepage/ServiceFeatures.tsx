import { BadgeCheck, CreditCard, Headset, Truck } from "lucide-react";

const features = [
  { icon: CreditCard, title: "Payment only secure", text: "100% secure transactions" },
  { icon: Headset, title: "New stocks and sale support", text: "Live support all days" },
  { icon: BadgeCheck, title: "Quality confidence", text: "Verified quality batches" },
  { icon: Truck, title: "Delivery from 1 hour", text: "Fast marketplace shipping" },
];

export default function ServiceFeatures() {

  return (
    <section className="grid gap-2 rounded-xl border border-[#e7e9f2] bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-2 rounded-lg border border-[#eceef5] bg-[#fafbff] p-2.5">
          <span className="rounded-full bg-[#efe9ff] p-2 text-[#5a3ea8]">
            <Icon className="size-4" />
          </span>
          <div>
            <p className="text-[12px] font-bold text-[#1b2035]">{title}</p>
            <p className="text-[10px] text-[#717996]">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

