import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
  min?: number;
  size?: "sm" | "md";
};

export default function QuantitySelector({
  value,
  onDecrease,
  onIncrease,
  disabled = false,
  min = 1,
  size = "md",
}: QuantitySelectorProps) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  const valueClass = size === "sm" ? "min-w-7 text-sm" : "min-w-10 text-base";

  return (
    <div className="inline-flex items-center rounded-full border border-[#e8e8f4] bg-[#f7f8ff] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || value <= min}
        className={`${buttonSize} inline-flex items-center justify-center rounded-full text-[#656b85] transition hover:bg-white hover:text-[#2a1d4e] disabled:opacity-40`}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </button>
      <span className={`${valueClass} text-center font-bold text-[#171b2d]`}>{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className={`${buttonSize} inline-flex items-center justify-center rounded-full text-[#656b85] transition hover:bg-white hover:text-[#2a1d4e] disabled:opacity-40`}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}

