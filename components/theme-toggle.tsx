"use client";

import { useEffect, useState } from "react";
import { Check, Moon, Palette, Sun } from "lucide-react";

type Theme = "dark" | "light";
type DarkPalette =
  | "graphite" | "forest" | "slate" | "umber" | "ocean" | "burgundy" | "olive"
  | "midnight" | "petrol" | "moss" | "garnet" | "bronze" | "ember"
  | "glacier" | "silver" | "pine" | "electric";

let currentTheme: Theme = "dark";
let currentDarkPalette: DarkPalette = "graphite";

const DARK_PALETTES: { id: DarkPalette; label: string; background: string; surface: string; accent: string }[] = [
  { id: "graphite", label: "Graphite / Copper", background: "#171a19", surface: "#202522", accent: "#e1a565" },
  { id: "forest", label: "Forest / Leaf", background: "#101a14", surface: "#1a2a20", accent: "#83d79a" },
  { id: "slate", label: "Slate / Ice", background: "#141a23", surface: "#202b38", accent: "#79d0dc" },
  { id: "umber", label: "Umber / Amber", background: "#201810", surface: "#302419", accent: "#efb85d" },
  { id: "ocean", label: "Deep Teal", background: "#102020", surface: "#1b3030", accent: "#65c9b7" },
  { id: "burgundy", label: "Burgundy / Rose", background: "#211719", surface: "#322326", accent: "#e38e88" },
  { id: "olive", label: "Olive / Lime", background: "#1b1d13", surface: "#2c2e1d", accent: "#c8d76b" },
  { id: "midnight", label: "Midnight / Cyan", background: "#101821", surface: "#1b2935", accent: "#66c9e8" },
  { id: "petrol", label: "Petrol / Jade", background: "#10201e", surface: "#1a302c", accent: "#66d2b0" },
  { id: "moss", label: "Moss / Chartreuse", background: "#191c10", surface: "#292e19", accent: "#c2d65f" },
  { id: "garnet", label: "Garnet / Coral", background: "#211518", surface: "#332125", accent: "#f08c83" },
  { id: "bronze", label: "Bronze / Gold", background: "#21190f", surface: "#302416", accent: "#edbd6e" },
  { id: "ember", label: "Ember / Orange", background: "#201510", surface: "#342116", accent: "#fa9b52" },
  { id: "glacier", label: "Glacier / Blue", background: "#101b20", surface: "#1e2e36", accent: "#78cce6" },
  { id: "silver", label: "Charcoal / Silver", background: "#191b1d", surface: "#272b2e", accent: "#d1d8de" },
  { id: "pine", label: "Pine / Mint", background: "#101b18", surface: "#1b2b25", accent: "#7be0bc" },
  { id: "electric", label: "Electric / AI", background: "#151426", surface: "#24213d", accent: "#a88bff" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [darkPalette, setDarkPalette] = useState<DarkPalette>(currentDarkPalette);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("aegis-theme");
    const savedPalette = window.localStorage.getItem("aegis-dark-palette");
    if (saved === "light" || saved === "dark") {
      currentTheme = saved;
      setTheme(saved);
    }
    if (DARK_PALETTES.some(({ id }) => id === savedPalette)) {
      currentDarkPalette = savedPalette as DarkPalette;
      setDarkPalette(savedPalette as DarkPalette);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("aegis-theme", theme);
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.darkPalette = darkPalette;
    window.localStorage.setItem("aegis-dark-palette", darkPalette);
  }, [darkPalette, ready]);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {theme === "dark" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setPaletteMenuOpen((open) => !open)}
            aria-expanded={paletteMenuOpen}
            aria-haspopup="menu"
            className="theme-toggle inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-600/70 bg-slate-800/80 px-2.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{DARK_PALETTES.find(({ id }) => id === darkPalette)?.label}</span>
          </button>
          {paletteMenuOpen && (
            <div role="menu" aria-label="Dark mode palette" className="absolute right-0 top-11 z-50 max-h-[min(32rem,75vh)] w-56 overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
              {DARK_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={darkPalette === palette.id}
                  onClick={() => {
                    currentDarkPalette = palette.id;
                    setDarkPalette(palette.id);
                    document.documentElement.dataset.darkPalette = palette.id;
                    window.localStorage.setItem("aegis-dark-palette", palette.id);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex h-4 w-7 shrink-0 overflow-hidden rounded border border-slate-300">
                    <span className="w-1/3" style={{ backgroundColor: palette.background }} />
                    <span className="w-1/3" style={{ backgroundColor: palette.surface }} />
                    <span className="w-1/3" style={{ backgroundColor: palette.accent }} />
                  </span>
                  <span className="flex-1">{palette.label}</span>
                  {darkPalette === palette.id && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          const nextTheme = theme === "dark" ? "light" : "dark";
          currentTheme = nextTheme;
          setTheme(nextTheme);
          setPaletteMenuOpen(false);
        }}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="theme-toggle inline-flex h-9 items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-800/80 px-3 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>
    </div>
  );
}
