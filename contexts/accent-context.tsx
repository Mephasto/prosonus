"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const ACCENTS = ["cyan", "violet", "amber", "emerald", "rose"] as const;
export type Accent = (typeof ACCENTS)[number];

export const ACCENT_META: Record<Accent, { label: string; color: string; foreground: string }> = {
  cyan:    { label: "Cyan",      color: "hsl(189,90%,50%)",  foreground: "hsl(0,0%,5%)"  },
  violet:  { label: "Violeta",   color: "hsl(250,84%,65%)",  foreground: "hsl(0,0%,98%)" },
  amber:   { label: "Ámbar",     color: "hsl(38,95%,54%)",   foreground: "hsl(0,0%,5%)"  },
  emerald: { label: "Esmeralda", color: "hsl(152,57%,48%)",  foreground: "hsl(0,0%,98%)" },
  rose:    { label: "Rosa",      color: "hsl(350,85%,62%)",  foreground: "hsl(0,0%,98%)" },
};

const LS_KEY = "prosonus-accent";

type AccentContextType = {
  accent: Accent;
  rotate: () => void;
};

const AccentContext = createContext<AccentContextType | null>(null);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<Accent>("cyan");

  // Restore from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Accent | null;
    if (saved && (ACCENTS as readonly string[]).includes(saved)) {
      setAccent(saved);
    }
  }, []);

  // Apply data-accent to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem(LS_KEY, accent);
  }, [accent]);

  const rotate = () =>
    setAccent((prev) => ACCENTS[(ACCENTS.indexOf(prev) + 1) % ACCENTS.length]);

  return (
    <AccentContext.Provider value={{ accent, rotate }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used within AccentProvider");
  return ctx;
}
