import { Clock3, ShieldCheck, Sparkles, Store } from "lucide-react";

const quickFilters = [
  "Free delivery",
  "Under $10",
  "Organic",
  "Ready in 30 min",
  "Top rated",
  "Flash sale",
];

const statCards = [
  { icon: Store, value: "1,500+", label: "Partner stores" },
  { icon: Sparkles, value: "25,000+", label: "Curated products" },
  { icon: Clock3, value: "35 min", label: "Avg. delivery time" },
  { icon: ShieldCheck, value: "99.9%", label: "Secure checkout" },
];

const brandTiles = ["FreshCo", "NutriMart", "DailyFarm", "SnackBox", "MilkyWay", "GreenLeaf"];

export default function HomeFeatureUI() {
  return (
    <section className="space-y-3">
      <article className="rounded-2xl border border-[#e7e9f2] bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-[#e6e8f1] bg-[#f8f9ff] px-3 py-1.5 text-[11px] font-semibold text-[#3d2f74] transition hover:border-[#5a3ea8] hover:bg-[#efeaff]"
            >
              {filter}
            </button>
          ))}
        </div>
      </article>

      <article className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-xl border border-[#e7e9f2] bg-white p-3">
            <span className="inline-flex rounded-full bg-[#efe9ff] p-2 text-[#5a3ea8]">
              <Icon className="size-4" />
            </span>
            <p className="mt-2 text-lg font-black text-[#1b2035]">{value}</p>
            <p className="text-xs text-[#6f758c]">{label}</p>
          </div>
        ))}
      </article>

      <article className="rounded-2xl border border-[#e7e9f2] bg-white p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1b2035]">Trending Brands</h3>
          <button className="rounded-full border border-[#e4e6f0] px-3 py-1 text-[11px] font-semibold text-[#3d2f74]">View all</button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {brandTiles.map((brand) => (
            <div key={brand} className="rounded-lg border border-[#eceef5] bg-[#fafbff] px-3 py-2 text-center">
              <p className="text-xs font-semibold text-[#26304a]">{brand}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

