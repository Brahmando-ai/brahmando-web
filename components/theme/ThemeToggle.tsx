"use client";

import { useTheme, type Theme } from "./ThemeProvider";

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "obsidian", label: "Obsidian",  color: "#7c3aed" },
  { id: "midnight", label: "Midnight",  color: "#2563eb" },
  { id: "cosmic",   label: "Cosmic",    color: "#9333ea" },
  { id: "ember",    label: "Ember",     color: "#ea580c" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Choose colour theme"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          aria-label={`${t.label} theme`}
          aria-pressed={theme === t.id}
          style={{ background: t.color }}
          className={[
            "h-3 w-3 rounded-full border transition-all duration-200",
            theme === t.id
              ? "scale-125 border-white/60 opacity-100"
              : "border-transparent opacity-40 hover:opacity-75 hover:scale-110",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
