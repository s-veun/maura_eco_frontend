"use client";

import { useState } from "react";
import { ChevronDown, Globe, DollarSign, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const LANGUAGES = ["EN", "KH"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD"];

export default function TopBar() {
  const [lang, setLang] = useState("EN");
  const [currency, setCurrency] = useState("USD");
  const [showLang, setShowLang] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <div className="w-full bg-[#DEF9EC] border-b border-[#3BB77E]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left */}
          <p className="truncate text-xs font-medium text-[#253D4E]">
            🚚 Free shipping on orders over $50
          </p>

          {/* Center */}
          <p className="hidden text-xs font-semibold text-[#253D4E] sm:block">
            Daily Deals •{" "}
            <span className="text-[#3BB77E] font-bold">Save up to 40%</span>
          </p>

          {/* Right */}
          <div className="ml-auto flex items-center gap-3">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLang((v) => !v);
                  setShowCurrency(false);
                }}
                className="flex items-center gap-1 text-xs font-medium text-[#253D4E] transition-colors hover:text-[#3BB77E]"
              >
                <Globe size={12} className="shrink-0" />
                <span>{lang}</span>
                <ChevronDown size={10} className={`transition-transform ${showLang ? "rotate-180" : ""}`} />
              </button>
              {showLang && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-18 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setShowLang(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[#253D4E] transition-colors hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setShowCurrency((v) => !v);
                  setShowLang(false);
                }}
                className="flex items-center gap-1 text-xs font-medium text-[#253D4E] transition-colors hover:text-[#3BB77E]"
              >
                <DollarSign size={12} className="shrink-0" />
                <span>{currency}</span>
                <ChevronDown size={10} className={`transition-transform ${showCurrency ? "rotate-180" : ""}`} />
              </button>
              {showCurrency && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-18 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setShowCurrency(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[#253D4E] transition-colors hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="rounded-lg p-1 text-[#253D4E] transition-all hover:bg-[#3BB77E]/10 hover:text-[#3BB77E]"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
