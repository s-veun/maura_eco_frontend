"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      value={{ light: "light", dark: "dark" }}
    >
      {children}
    </NextThemeProvider>
  );
}
