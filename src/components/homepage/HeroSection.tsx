import type { PromoItem } from "@/components/homepage/home-data";
import PromoBanner from "@/components/homepage/PromoBanner";

type HeroSectionProps = {
  banners: PromoItem[];
};

export default function HeroSection({ banners }: HeroSectionProps) {
  return (
    <section className="hero-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible">
      {banners.map((banner) => (
        <div key={banner.title} className="min-w-[84%] snap-start md:min-w-0">
          <PromoBanner
            badge={banner.badge}
            title={banner.title}
            subtitle={banner.subtitle}
            ctaText={banner.cta}
            image={banner.image}
            className={banner.bgClass}
            textClassName={banner.textClass}
          />
        </div>
      ))}
    </section>
  );
}

