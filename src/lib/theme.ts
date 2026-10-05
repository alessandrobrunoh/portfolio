export type ThemePreference = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "portfolio:theme-change";

/** Light mode from 06:00 UTC (inclusive) until 20:00 UTC (exclusive). */
export const LIGHT_START_HOUR_UTC = 6;
export const DARK_START_HOUR_UTC = 20;

const LIGHT_THEME_COLOR = "#ffffff";
const DARK_THEME_COLOR = "#0f172a";

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
let visibilityBound = false;

export function scheduledTheme(date = new Date()): ResolvedTheme {
  const hour = date.getUTCHours();
  return hour >= LIGHT_START_HOUR_UTC && hour < DARK_START_HOUR_UTC ? "light" : "dark";
}

/** Fraction of the UTC day in `[0, 1)`, including minutes/seconds. */
export function utcDayFraction(date = new Date()): number {
  const ms =
    date.getUTCHours() * 3_600_000 +
    date.getUTCMinutes() * 60_000 +
    date.getUTCSeconds() * 1_000 +
    date.getUTCMilliseconds();
  return ms / 86_400_000;
}

export function formatUtcClock(date = new Date()): string {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes} UTC`;
}

export function schedulePhase(date = new Date()): "day" | "night" {
  return scheduledTheme(date) === "light" ? "day" : "night";
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

export function isManualThemePreference(preference = getThemePreference()): boolean {
  return preference !== "auto";
}

export function resolveTheme(preference = getThemePreference()): ResolvedTheme {
  return preference === "auto" ? scheduledTheme() : preference;
}

export function syncThemeColor(resolved = resolveTheme()) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
}

/** The tab icon follows the site theme: black mark on light, white mark on dark. */
export function syncFavicon(resolved = resolveTheme()) {
  const dark = resolved === "dark";
  document
    .querySelector('link[rel="icon"][type="image/svg+xml"]')
    ?.setAttribute("href", dark ? "/favicon-dark.svg" : "/favicon.svg");
  document
    .querySelector('link[rel="icon"][type="image/png"]')
    ?.setAttribute("href", dark ? "/favicon-dark-32.png" : "/favicon-32.png");
}

export function applyResolvedTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  syncThemeColor(resolved);
  syncFavicon(resolved);
}

function notifyThemeChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function setThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // private mode / SSR
  }
  applyResolvedTheme(resolveTheme(preference));
  scheduleThemeRefresh();
  notifyThemeChange();
}

/** Flip the visible theme and lock it as an explicit override. */
export function toggleThemeOverride() {
  const next: ResolvedTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  setThemePreference(next);
}

export function toggleThemeFromPointer(event: MouseEvent) {
  const root = document.documentElement;
  const bounds =
    event.currentTarget instanceof Element ? event.currentTarget.getBoundingClientRect() : null;
  const hasPointerPosition = event.detail > 0;
  const x = hasPointerPosition ? event.clientX : (bounds?.left ?? 0) + (bounds?.width ?? 0) / 2;
  const y = hasPointerPosition ? event.clientY : (bounds?.top ?? 0) + (bounds?.height ?? 0) / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${Math.ceil(radius)}px`);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (!reduced && typeof doc.startViewTransition === "function") {
    // Marks this transition as a theme change, so it gets the circular reveal, not the route fade.
    root.classList.add("theme-vt");
    doc
      .startViewTransition(toggleThemeOverride)
      .finished.finally(() => root.classList.remove("theme-vt"));
    return;
  }
  toggleThemeOverride();
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
    notifyThemeChange();
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
    notifyThemeChange();
    scheduleThemeRefresh();
  });
}
