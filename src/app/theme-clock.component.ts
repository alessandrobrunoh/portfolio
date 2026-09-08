import { Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { UI, lang } from "../lib/site";
import {
  DARK_START_HOUR_UTC,
  LIGHT_START_HOUR_UTC,
  THEME_CHANGE_EVENT,
  formatUtcClock,
  getThemePreference,
  isManualThemePreference,
  resolveTheme,
  schedulePhase,
  toggleThemeFromPointer,
  utcDayFraction,
} from "../lib/theme";

const CX = 80;
const CY = 40;
const R = 36;

type ArcPoint = { x: number; y: number };

function pointOnArc(fraction: number): ArcPoint {
  const t = Math.min(1, Math.max(0, fraction));
  const angle = Math.PI * (1 - t);
  return {
    x: CX + R * Math.cos(angle),
    y: CY - R * Math.sin(angle),
  };
}

function arcPath(from: number, to: number): string {
  const start = pointOnArc(from);
  const end = pointOnArc(to);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${R} ${R} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

@Component({
  selector: "app-theme-clock",
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      (click)="toggle($event)"
      class="theme-clock mt-3 flex w-full items-center gap-2.5 rounded-md bg-surface px-2.5 py-2 text-left shadow-border"
      [attr.aria-label]="ariaLabel()"
      [attr.data-tooltip]="tooltip()"
      [style]="arcVars()"
    >
      <span class="relative block h-9 w-[5.25rem] shrink-0" aria-hidden="true">
        <svg viewBox="0 0 160 48" class="absolute inset-0 size-full text-fg">
          <path
            [attr.d]="trackPath"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            class="text-fg/15"
          />
          <path
            [attr.d]="dayPath"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            class="theme-clock-day text-accent"
          />
          <circle [attr.cx]="dayStart.x" [attr.cy]="dayStart.y" r="1.6" class="fill-accent" />
          <circle [attr.cx]="dayEnd.x" [attr.cy]="dayEnd.y" r="1.6" class="fill-accent" />
        </svg>
        <span
          class="theme-clock-marker pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 overflow-hidden text-accent"
          [style.left]="markerLeft()"
          [style.top]="markerTop()"
        >
          <svg appIcon="sun" class="theme-sun absolute inset-0 size-3.5"></svg>
          <svg appIcon="moon" class="theme-moon size-3.5"></svg>
        </span>
        <span class="theme-clock-ghost size-3.5">
          @if (theme() === "dark") {
            <svg appIcon="sun" class="size-3.5"></svg>
          } @else {
            <svg appIcon="moon" class="size-3.5"></svg>
          }
        </span>
      </span>
      <span class="theme-clock-hint min-w-0 font-mono text-caption tracking-mono" aria-live="polite">
        <span class="theme-clock-hint-clock truncate text-muted">{{ clock() }}</span>
        <span class="theme-clock-hint-action truncate">{{ actionHint() }}</span>
      </span>
    </button>
  `,
})
export class ThemeClockComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly ui = UI;

  protected readonly trackPath = arcPath(0, 1);
  protected readonly dayPath = arcPath(LIGHT_START_HOUR_UTC / 24, DARK_START_HOUR_UTC / 24);
  protected readonly dayStart = pointOnArc(LIGHT_START_HOUR_UTC / 24);
  protected readonly dayEnd = pointOnArc(DARK_START_HOUR_UTC / 24);

  private readonly nowFraction = signal(utcDayFraction());
  protected readonly clock = signal(formatUtcClock());
  private readonly phase = signal(schedulePhase());
  protected readonly theme = signal(resolveTheme());
  private readonly manual = signal(isManualThemePreference());

  protected readonly now = computed(() => pointOnArc(this.nowFraction()));
  protected readonly preview = computed(() =>
    pointOnArc(this.theme() === "dark" ? 13 / 24 : 1 / 24),
  );
  protected readonly markerLeft = computed(() => `${(this.now().x / 160) * 100}%`);
  protected readonly markerTop = computed(() => `${(this.now().y / 48) * 100}%`);
  protected readonly arcVars = computed(
    () =>
      `--tc-now-x: ${this.markerLeft()}; --tc-now-y: ${this.markerTop()}; --tc-to-x: ${(this.preview().x / 160) * 100}%; --tc-to-y: ${(this.preview().y / 48) * 100}%;`,
  );
  protected readonly tooltip = computed(() => {
    const isIt = lang() === "it";
    return this.theme() === "dark"
      ? isIt
        ? "Passa al tema chiaro"
        : "Switch to light"
      : isIt
        ? "Passa al tema scuro"
        : "Switch to dark";
  });
  protected readonly actionHint = computed(() => {
    const isIt = lang() === "it";
    return this.theme() === "dark"
      ? isIt
        ? "→ chiaro"
        : "→ light"
      : isIt
        ? "→ scuro"
        : "→ dark";
  });

  protected readonly ariaLabel = computed(() => {
    const isIt = lang() === "it";
    const phaseLabel =
      this.phase() === "day" ? (isIt ? "giorno" : "day") : isIt ? "notte" : "night";
    const themeLabel =
      this.theme() === "light" ? (isIt ? "chiaro" : "light") : isIt ? "scuro" : "dark";
    const manual = this.manual() ? (isIt ? ", override manuale" : ", manual override") : "";
    const schedule = isIt
      ? `Fascia chiara UTC dalle ${LIGHT_START_HOUR_UTC}:00 alle ${DARK_START_HOUR_UTC}:00.`
      : `Light window UTC from ${LIGHT_START_HOUR_UTC}:00 to ${DARK_START_HOUR_UTC}:00.`;
    return `${this.ui.toggleTheme}. ${this.clock()}, ${phaseLabel}, ${themeLabel}${manual}. ${schedule}`;
  });

  ngOnInit() {
    this.tick();
    const id = window.setInterval(() => this.tick(), 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") this.tick();
    };
    const onThemeChange = () => this.tick();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    this.destroyRef.onDestroy(() => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
    });
  }

  toggle(event: MouseEvent) {
    toggleThemeFromPointer(event);
  }

  private tick() {
    const date = new Date();
    this.nowFraction.set(utcDayFraction(date));
    this.clock.set(formatUtcClock(date));
    this.phase.set(schedulePhase(date));
    this.theme.set(resolveTheme(getThemePreference()));
    this.manual.set(isManualThemePreference());
  }
}
