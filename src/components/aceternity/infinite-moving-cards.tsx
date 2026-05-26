// Stub: aceternity InfiniteMovingCards replaced with scrollable row
import { cn } from "@/lib/utils";
type Item = { quote: string; name: string; title: string };
export function InfiniteMovingCards({ items, className }: { items: Item[]; className?: string; direction?: string; speed?: string; pauseOnHover?: boolean }) {
  return (
    <div className={cn("flex gap-4 overflow-x-auto py-2", className)}>
      {items.map((item, i) => (
        <div key={i} className="min-w-[300px] border rounded-lg bg-card p-4 shadow-sm shrink-0">
          <p className="text-sm text-muted-foreground italic">&ldquo;{item.quote}&rdquo;</p>
          <p className="mt-3 font-semibold text-sm">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.title}</p>
        </div>
      ))}
    </div>
  );
}
