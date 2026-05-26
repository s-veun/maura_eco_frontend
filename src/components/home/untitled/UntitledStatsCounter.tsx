"use client";

import { useEffect, useState } from "react";

type UntitledStatsCounterProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
};

export function UntitledStatsCounter({ value, suffix = "+", durationMs = 1200 }: UntitledStatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const start = performance.now();

    const tick = (now: number) => {
      if (!mounted) return;
      const progress = Math.min((now - start) / durationMs, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      mounted = false;
    };
  }, [value, durationMs]);

  return <span>{count.toLocaleString("en-US")}{suffix}</span>;
}

export default UntitledStatsCounter;

