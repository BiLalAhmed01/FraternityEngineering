import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "daylight";

export const THEME_KEY = "fte_theme";
const THEME_EVENT = "fte:theme";

/** The inline script in <head> sets data-theme before first paint; this reads it back. */
export const getTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "daylight" ? "daylight" : "dark";

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 260);
  }
  if (theme === "daylight") root.setAttribute("data-theme", "daylight");
  else root.removeAttribute("data-theme");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable: the choice lasts for this page view */
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
};

/** Daylight on the server and first client render (matches the prerender); synced to the document after mount. */
export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>("daylight");

  useEffect(() => {
    setTheme(getTheme());
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  const toggle = useCallback(() => applyTheme(getTheme() === "daylight" ? "dark" : "daylight"), []);
  return [theme, toggle];
};
