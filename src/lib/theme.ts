export type ThemePreference = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Light mode from 06:00 UTC (inclusive) until 20:00 UTC (exclusive). */
export const LIGHT_START_HOUR_UTC = 6;
export const DARK_START_HOUR_UTC = 20;

const LIGHT_THEME_COLOR = "#eceef4";
const DARK_THEME_COLOR = "#0b0c10";

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
let visibilityBound = false;

export function scheduledTheme(date = new Date()): ResolvedTheme {
  const hour = date.getUTCHours();
  return hour >= LIGHT_START_HOUR_UTC && hour < DARK_START_HOUR_UTC ? "light" : "dark";
}

export function getThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "auto") return value;
  } catch {
    // private mode / SSR
  }
  return "auto";
}

export function resolveTheme(preference = getThemePreference()): ResolvedTheme {
  return preference === "auto" ? scheduledTheme() : preference;
}

export function syncThemeColor(resolved = resolveTheme()) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
}

export function applyResolvedTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  syncThemeColor(resolved);
}

export function setThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // private mode / SSR
  }
  applyResolvedTheme(resolveTheme(preference));
  scheduleThemeRefresh();
}

/** Flip the visible theme and lock it as an explicit override. */
export function toggleThemeOverride() {
  const next: ResolvedTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  setThemePreference(next);
}

export function msUntilNextThemeBoundary(date = new Date()): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();

  let next: Date;
  if (hour < LIGHT_START_HOUR_UTC) {
    next = new Date(Date.UTC(year, month, day, LIGHT_START_HOUR_UTC));
  } else if (hour < DARK_START_HOUR_UTC) {
    next = new Date(Date.UTC(year, month, day, DARK_START_HOUR_UTC));
  } else {
    next = new Date(Date.UTC(year, month, day + 1, LIGHT_START_HOUR_UTC));
  }

  return Math.max(1, next.getTime() - date.getTime());
}

export function scheduleThemeRefresh() {
  if (typeof window === "undefined") return;

  clearTimeout(refreshTimer);
  if (getThemePreference() !== "auto") return;

  refreshTimer = setTimeout(() => {
    applyResolvedTheme(scheduledTheme());
    scheduleThemeRefresh();
  }, msUntilNextThemeBoundary());
}

export function initTheme() {
  if (typeof document === "undefined") return;

  applyResolvedTheme(resolveTheme());
  scheduleThemeRefresh();

  if (visibilityBound) return;
  visibilityBound = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || getThemePreference() !== "auto") return;
    applyResolvedTheme(scheduledTheme());
    scheduleThemeRefresh();
  });
}
