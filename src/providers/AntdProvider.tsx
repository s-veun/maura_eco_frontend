"use client";

import type { ReactNode } from "react";

type AntdProviderProps = {
  children: ReactNode;
};

/** Stub provider - AntD removed, kept for backwards compatibility. */
export function AntdProvider({ children }: AntdProviderProps) {
  return <>{children}</>;
}

export default AntdProvider;

