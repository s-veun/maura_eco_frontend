import ProductCard from "@/components/homepage/ProductCard";
import type { HomeProduct } from "@/components/homepage/home-data";

type ProductGridProps = {
  label?: string;
  title: string;
  subtitle?: string;
  products: HomeProduct[];
  horizontalOnMobile?: boolean;
  productMinWidth?: string;
};

export default function ProductGrid({
  label = "Shopping Store",
  title,
  subtitle,
  products,
  horizontalOnMobile = true,
  productMinWidth = "min-w-[170px]",
}: ProductGridProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-[#e7e9f2] bg-white p-3 sm:p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f86a0]">{label}</p>
          <h2 className="mt-1 text-base font-black text-[#151b2f] sm:text-lg lg:text-xl">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-[#6f758c]">{subtitle}</p> : null}
        </div>
        <button className="rounded-full border border-[#e4e6f0] bg-[#f8f9ff] px-2.5 py-1.5 text-[11px] font-semibold text-[#3d2f74] transition hover:bg-[#f0f2ff] sm:px-3">
          View all
        </button>
      </div>

      {horizontalOnMobile ? (
        <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((product) => (
            <div key={product.id} className={`snap-start ${productMinWidth} sm:min-w-0`}>
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      )}
    </section>
  );
}

