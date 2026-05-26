import { Smartphone, Zap } from "lucide-react";

export default function MobileAppPromo() {
  return (
    <section className="rounded-2xl border border-[#e7e9f2] bg-gradient-to-r from-[#f2ecff] to-[#fff8e9] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#5a3ea8]">
            <Zap className="size-3" />
            App Exclusive Deals
          </p>
          <h3 className="mt-2 text-lg font-black text-[#1b2035]">Get 15% off your first app order</h3>
          <p className="text-xs text-[#5f6580]">Track delivery live, save favorites, and unlock app-only campaign prices.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-md bg-[#1b2035] px-3 py-2 text-xs font-semibold text-white">
            <Smartphone className="size-3.5" />
            App Store
          </button>
          <button className="inline-flex items-center gap-1 rounded-md bg-[#5a3ea8] px-3 py-2 text-xs font-semibold text-white">
            <Smartphone className="size-3.5" />
            Google Play
          </button>
        </div>
      </div>
    </section>
  );
}

