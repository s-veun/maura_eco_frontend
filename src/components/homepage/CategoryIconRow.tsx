import Image from "next/image";
import type { CategoryItem } from "@/components/homepage/home-data";

type CategoryIconRowProps = {
  categories: CategoryItem[];
};

export default function CategoryIconRow({ categories }: CategoryIconRowProps) {
  return (
    <section className="border-b border-[#e7e9f2] bg-white px-3 py-3 sm:px-4">
      <div className="mx-auto flex w-full max-w-[1240px] gap-3 overflow-x-auto sm:gap-4">
        {categories.map((category) => (
          <button key={category.title} className="group min-w-[80px] text-center sm:min-w-[86px]">
            <span className="relative mx-auto block size-11 overflow-hidden rounded-full border border-[#e6e9f2] bg-[#f5f7fc] sm:size-12">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 44px, 48px"
                unoptimized
                className="object-cover transition duration-300 group-hover:scale-110"
              />
            </span>
            <span className="mt-1.5 block text-[11px] font-medium text-[#3d435d]">{category.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

