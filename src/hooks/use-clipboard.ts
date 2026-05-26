"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useClipboard(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        setCopied(false);
        return false;
      }

      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return { copied, copy };
}
