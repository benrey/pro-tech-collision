"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./Icons";

type Theme = "light" | "dark";
const STORAGE_KEY = "protech-theme";

/**
 * The active theme lives on <html data-theme>, set by the inline script in
 * layout.tsx before first paint. That attribute is the single source of truth;
 * this store lets React read it without a setState-in-effect round trip.
 */
const themeStore = {
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    themeStore.listeners.add(listener);
    return () => themeStore.listeners.delete(listener);
  },

  getSnapshot(): Theme {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  },

  /** Server and first hydration render — the DOM isn't readable yet. */
  getServerSnapshot(): Theme | null {
    return null;
  },

  set(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private browsing can block storage; the theme still applies for this visit.
    }
    themeStore.listeners.forEach((listener) => listener());
  },
};

/** Light/dark toggle, mirroring the useTheme pattern from the pluggdn layouts. */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const toggle = useCallback(() => {
    themeStore.set(themeStore.getSnapshot() === "dark" ? "light" : "dark");
  }, []);

  // Reserve the space until hydration so the header doesn't shift.
  if (theme === null) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface hover:text-foreground"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
