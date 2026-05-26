"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}

function getPages(page: number, pageCount: number): (number | "...")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "...", pageCount];
  if (page >= pageCount - 3)
    return [1, "...", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "...", page - 1, page, page + 1, "...", pageCount];
}

export function CatalogPagination({ page, total, pageSize, onChange }: CatalogPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const pages = getPages(page, pageCount);

  return (
    <div className="flex items-center justify-center gap-1 pt-10">
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#E69F2C]/50 hover:text-[#E69F2C] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[5px] border text-sm font-medium transition-colors",
              page === p
                ? "border-[#E69F2C] bg-[#E69F2C] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#E69F2C]/50 hover:text-[#E69F2C]"
            )}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#E69F2C]/50 hover:text-[#E69F2C] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Info */}
      <span className="ml-3 text-xs text-slate-400">
        Page {page} of {pageCount}
      </span>
    </div>
  );
}
