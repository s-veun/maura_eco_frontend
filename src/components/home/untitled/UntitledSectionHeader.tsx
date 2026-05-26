import { cn } from "@/lib/utils";

type UntitledSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function UntitledSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: UntitledSectionHeaderProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">{title}</h2>
      {description ? <p className="text-base text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}

export default UntitledSectionHeader;

