"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "obsidian" | "midnight" | "cosmic" | "ember";

const THEMES: Theme[] = ["obsidian", "midnight", "cosmic", "ember"];
const STORAGE_KEY = "brahmando-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "obsidian",
  setTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("obsidian");

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved && THEMES.includes(saved)) setThemeState(saved);
  }, []);

  // Propagate theme to <html data-theme="…">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
