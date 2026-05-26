import { ChevronDown } from "lucide-react";

type CategoryMenuProps = {
  categories: string[];
  dropdownItems: Record<string, string[]>;
  isMobileOpen?: boolean;
  onToggleMobileMenu?: () => void;
};

export default function CategoryMenu({
  categories,
  dropdownItems,
  isMobileOpen = false,
  onToggleMobileMenu,
}: CategoryMenuProps) {
  return (
    <nav className="border-b border-white/10 bg-[#0b0d16]">
      <div className="mx-auto w-full max-w-[1240px] px-3 py-2 sm:px-4 md:hidden">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="inline-flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#e7e4ff]"
        >
          Browse categories
          <ChevronDown className={`size-4 transition ${isMobileOpen ? "rotate-180" : ""}`} />
        </button>
        {isMobileOpen ? (
          <div className="mt-2 grid max-h-72 grid-cols-1 gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#12172a] p-2 text-[12px] font-medium text-[#dce0f3]">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-lg px-2.5 py-2 text-left transition hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mx-auto hidden w-full max-w-[1240px] gap-1 overflow-x-auto px-4 py-2 text-[11px] font-semibold text-[#e7e4ff] md:flex md:overflow-visible">
        {categories.map((item) => {
          const dropdown = dropdownItems[item] || [];
          return (
            <div key={item} className="group relative shrink-0">
              <button className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white">
                {item}
                {dropdown.length ? <ChevronDown className="size-3" /> : null}
              </button>
              {dropdown.length ? (
                <div className="invisible absolute left-0 top-full z-30 mt-1 min-w-[170px] rounded-xl border border-white/10 bg-[#171a2b] p-2 opacity-0 shadow-[0_16px_30px_rgba(5,6,15,0.55)] transition group-hover:visible group-hover:opacity-100">
                  {dropdown.map((subItem) => (
                    <button
                      key={subItem}
                      className="block w-full rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-[#d4d8f3] transition hover:bg-white/10 hover:text-white"
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

