import Image from "next/image";
import { Heart, Star } from "lucide-react";
import ProductCard from "@/components/homepage/ProductCard";
import type { HomeProduct } from "@/components/homepage/home-data";

type ProductShowcaseProps = {
  leftProducts: HomeProduct[];
  centerProduct: HomeProduct;
  rightProducts: HomeProduct[];
};

export default function ProductShowcase({ leftProducts, centerProduct, rightProducts }: ProductShowcaseProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-[#e7e9f2] bg-white p-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f86a0]">Category Products</p>
          <h2 className="mt-1 text-lg font-black text-[#151b2f] md:text-xl">Deal of your product every day</h2>
        </div>
        <button className="rounded-full border border-[#e4e6f0] bg-[#f8f9ff] px-3 py-1.5 text-[11px] font-semibold text-[#3d2f74]">View all</button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr_1fr]">
        <div className="space-y-2">
          {leftProducts.map((item) => (
            <ProductCard key={item.id} product={item} compact />
          ))}
        </div>

        <article className="rounded-xl border border-[#dbdde4] bg-white p-3">
          <div className="relative overflow-hidden rounded-lg bg-[#f0f0f2]">
            <Image src={centerProduct.image} alt={centerProduct.title} width={420} height={420} unoptimized className="h-[230px] w-full object-contain p-4" />
            <button className="absolute right-2 top-2 rounded-full bg-white p-1 text-[#8e93a9]">
              <Heart className="size-3" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-[#6b7280]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={`center-star-${idx}`} className={`size-2.5 ${idx < Math.round(centerProduct.rating) ? "fill-[#ffb300] text-[#ffb300]" : "text-[#d2d6e2]"}`} />
            ))}
            <span className="font-bold text-[#111827]">{centerProduct.rating.toFixed(1)}</span>
          </div>
          <p className="mt-1 text-sm font-bold text-[#111827]">{centerProduct.title}</p>
          <p className="text-xs text-[#5f657b]">{centerProduct.unit}</p>
          <p className="mt-1 line-clamp-3 text-[11px] text-[#525a73]">
            Premium sparkling beverage crafted with natural citrus notes and balanced sweetness. A perfect chill companion for daily refreshment.
          </p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-[20px] font-black text-[#ff3b2f]">${centerProduct.price.toFixed(2)}</span>
            {centerProduct.oldPrice ? <span className="pb-1 text-xs text-[#8f95ab] line-through">${centerProduct.oldPrice.toFixed(2)}</span> : null}
          </div>
          <button className="mt-2 w-full rounded-md bg-[#16a34a] py-2 text-xs font-semibold text-white transition hover:bg-[#15803d]">
            Add to cart
          </button>
        </article>

        <div className="space-y-2">
          {rightProducts.map((item) => (
            <ProductCard key={item.id} product={item} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

