import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { IconComponent } from "./icon.component";
import { UI, lang } from "../lib/site";
import {
  DARK_START_HOUR_UTC,
  LIGHT_START_HOUR_UTC,
  THEME_CHANGE_EVENT,
  formatUtcClock,
  isManualThemePreference,
  schedulePhase,
  toggleThemeFromPointer,
  utcDayFraction,
  type ResolvedTheme,
} from "../lib/theme";

/*
 * Sky geometry, in viewBox units (0 0 160 48 drawn at 0.525 px/unit in the 84x36 box;
 * "meet" leaves 10.29 painted units above y=0 and below y=48).
 * - Dial: centre (CX, CY), radius R = the UTC day, 00:00 left to 24:00 right.
 * - Horizon: 1px hairline at y = CY, x 6..154. The sky clip is y <= CY plus the slot circle.
 * - Slot: circle r 12.5 at the current UTC time (glyph radius 11 + 1.5 air). It cuts the dial
 *   and the horizon (mask) and keeps the lit body whole while it straddles the horizon
 *   (clip), 21:38-02:22 UTC.
 * - Lit body: 24-unit glyph centred on the slot, visual radius 11 (sun) / 10 (moon).
 *   Noon top ray y -7, midnight bottom y 51: both inside the painted letterbox.
 * - Set/rise: straight down/up the slot's column. Parked 48 units below the slot at scale .6,
 *   which is under the horizon and outside the slot circle at every minute.
 * - Preview: the other body at scale .8 over a flank, sun at (20, 29), moon at (140, 29).
 *   It clears the lit body by >= 6 units and the orb column (x 33..127) by >= 4.2 units.
 *   Hidden 24 units lower at scale .6, under the horizon.
 * - Stars (dark only): (26,12) (134,7) (150,23), outside the orb column and the dial.
 */
const CX = 80;
const CY = 40;
const R = 36;

/**
 * After a click, pointer/focus churn this soon is ignored: the 500ms view transition can drop
 * :hover without the pointer moving. Covers the set/rise too (150ms delay + 500ms).
 */
const COMMIT_HOLD_MS = 700;
const INSTANT_CLASS = "theme-clock-instant";

type ArcPoint = { x: number; y: number };

let nextUid = 0;

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

/** What the page is lit with right now; the orbs and stars key off the same class. */
function domTheme(): ResolvedTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

@Component({
  selector: "app-theme-clock",
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      #button
      type="button"
      (click)="toggle($event)"
      (pointerenter)="release()"
      (pointerleave)="release()"
      (focus)="release()"
      (blur)="release()"
      class="theme-clock mt-3 flex w-full items-center gap-2.5 rounded-md bg-surface px-2.5 py-2 text-left shadow-border"
      [class.is-committed]="committed()"
      [class.is-low]="isLow()"
      [attr.aria-label]="ariaLabel()"
      [attr.data-tooltip]="tooltip()"
    >
      <span class="theme-clock-sky relative block h-9 w-[5.25rem] shrink-0" aria-hidden="true">
        <svg viewBox="0 0 160 48" class="absolute inset-0 size-full text-fg">
          <defs>
            <clipPath [attr.id]="skyId">
              <rect x="-10" y="-20" width="180" height="60" />
              <circle [attr.cx]="slotX()" [attr.cy]="slotY()" r="12.5" />
            </clipPath>
            <mask [attr.id]="slotId" maskUnits="userSpaceOnUse" x="-10" y="-20" width="180" height="90">
              <rect x="-10" y="-20" width="180" height="90" fill="white" />
              <circle [attr.cx]="slotX()" [attr.cy]="slotY()" r="12.5" fill="black" />
            </mask>
          </defs>
          <g class="theme-clock-stars">
            <circle cx="26" cy="12" r="1.8" fill-opacity="0.7" />
            <circle cx="134" cy="7" r="1.5" fill-opacity="0.6" />
            <circle cx="150" cy="23" r="1.4" fill-opacity="0.5" />
          </g>
          <g [attr.mask]="slotMask">
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
              class="text-accent"
            />
            <circle [attr.cx]="dayStart.x" [attr.cy]="dayStart.y" r="1.6" class="fill-accent" />
            <circle [attr.cx]="dayEnd.x" [attr.cy]="dayEnd.y" r="1.6" class="fill-accent" />
          </g>
          <g class="text-accent" [attr.clip-path]="skyClip">
            <g transform="translate(20 29)">
              <g class="theme-clock-ghost theme-clock-ghost-sun">
                <svg appIcon="sun" x="-12" y="-12" width="24" height="24" [strokeWidth]="2"></svg>
              </g>
            </g>
            <g transform="translate(140 29)">
              <g class="theme-clock-ghost theme-clock-ghost-moon">
                <svg appIcon="moon" x="-12" y="-12" width="24" height="24" [strokeWidth]="2"></svg>
              </g>
            </g>
            <g [attr.transform]="orbTransform()">
              <g class="theme-clock-orb theme-clock-orb-sun">
                <svg appIcon="sun" x="-12" y="-12" width="24" height="24" [strokeWidth]="2"></svg>
              </g>
              <g class="theme-clock-orb theme-clock-orb-moon">
                <svg appIcon="moon" x="-12" y="-12" width="24" height="24" [strokeWidth]="2"></svg>
              </g>
            </g>
          </g>
          <path
            d="M 6 40 H 154"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
            class="text-fg/15"
            [attr.mask]="slotMask"
          />
        </svg>
      </span>
      <span class="theme-clock-hint min-w-0 font-mono text-caption tracking-mono" aria-hidden="true">
        <span class="theme-clock-hint-clock truncate text-muted">{{ clock() }}</span>
        <span class="theme-clock-hint-action truncate">{{ actionHint() }}</span>
      </span>
    </button>
    <span class="sr-only" role="status">{{ announcement() }}</span>
  `,
})
export class ThemeClockComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>("button");
  protected readonly ui = UI;

  private readonly uid = nextUid++;
  protected readonly skyId = `theme-clock-sky-${this.uid}`;
  protected readonly slotId = `theme-clock-slot-${this.uid}`;
  protected readonly skyClip = `url(#${this.skyId})`;
  protected readonly slotMask = `url(#${this.slotId})`;

  protected readonly trackPath = arcPath(0, 1);
  protected readonly dayPath = arcPath(LIGHT_START_HOUR_UTC / 24, DARK_START_HOUR_UTC / 24);
  protected readonly dayStart = pointOnArc(LIGHT_START_HOUR_UTC / 24);
  protected readonly dayEnd = pointOnArc(DARK_START_HOUR_UTC / 24);

  private readonly nowFraction = signal(utcDayFraction());
  protected readonly clock = signal(formatUtcClock());
  private readonly phase = signal(schedulePhase());
  /** Read from html.dark, like the orbs and stars, so labels never disagree with what is lit. */
  protected readonly theme = signal(domTheme());
  private readonly manual = signal(isManualThemePreference());

  /** True from a theme change under the pointer/focus until it leaves: hides the reverse preview. */
  protected readonly committed = signal(false);
  private committedAt = 0;
  private releaseTimer: ReturnType<typeof setTimeout> | undefined;
  private instantFrame = 0;
  private shownTheme: ResolvedTheme = "light";

  /** Set by a click so the announcement says "manual" even when storage is blocked. */
  private pendingManual = false;
  private announceTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly announced = signal<{ theme: ResolvedTheme; manual: boolean } | null>(null);
  /** Polite status text for a real theme change; rebuilt on a language switch, then cleared. */
  protected readonly announcement = computed(() => {
    const event = this.announced();
    if (!event) return "";
    const isIt = lang() === "it";
    const name =
      event.theme === "dark" ? (isIt ? "Tema scuro" : "Dark theme") : isIt ? "Tema chiaro" : "Light theme";
    const mode = event.manual
      ? isIt
        ? "override manuale"
        : "manual override"
      : isIt
        ? "automatico"
        : "automatic";
    return `${name}, ${mode}`;
  });

  private readonly now = computed(() => pointOnArc(this.nowFraction()));
  protected readonly slotX = computed(() => this.now().x.toFixed(2));
  protected readonly slotY = computed(() => this.now().y.toFixed(2));
  /** An SVG attribute, never a CSS transition: the 30s tick and tab catch-up move it without motion. */
  protected readonly orbTransform = computed(() => `translate(${this.slotX()} ${this.slotY()})`);
  /**
   * The slot circle reaches below the horizon (about 21:17-02:43 UTC). A body travelling down
   * its column would show through that window, so the swap happens in place instead.
   */
  protected readonly isLow = computed(() => this.now().y > CY - 12.5);

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
    return `${this.ui.toggleTheme}: ${this.tooltip().toLowerCase()}. ${this.clock()}, ${phaseLabel}, ${themeLabel}${manual}. ${schedule}`;
  });

  ngOnInit() {
    this.shownTheme = domTheme();
    this.tick();
    const id = window.setInterval(() => this.tick(), 30_000);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      // A boundary crossed while the tab was hidden snaps into place: no sunset nobody watched.
      this.snap();
      this.tick();
    };
    const onThemeChange = () => {
      this.tick();
      const next = domTheme();
      if (next === this.shownTheme) return;
      this.shownTheme = next;
      this.announce(next, this.pendingManual || isManualThemePreference());
      this.pendingManual = false;
      // Click or 06:00/20:00 flip under the pointer or keyboard focus: no reverse preview yet.
      if (this.button()?.nativeElement.matches(":hover, :focus-visible")) this.commit();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    this.destroyRef.onDestroy(() => {
      window.clearInterval(id);
      clearTimeout(this.releaseTimer);
      clearTimeout(this.announceTimer);
      cancelAnimationFrame(this.instantFrame);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
    });
  }

  toggle(event: MouseEvent) {
    this.commit();
    this.pendingManual = true;
    toggleThemeFromPointer(event);
  }

  /** Pointer/focus left or came back after the hold: the preview may show again. */
  protected release() {
    if (!this.committed() || performance.now() - this.committedAt < COMMIT_HOLD_MS) return;
    clearTimeout(this.releaseTimer);
    this.committed.set(false);
  }

  private commit() {
    this.committedAt = performance.now();
    this.committed.set(true);
    clearTimeout(this.releaseTimer);
    // Keyboard users and quick leavers get the preview back once the swap has played.
    this.releaseTimer = setTimeout(() => {
      if (!this.button()?.nativeElement.matches(":hover")) this.committed.set(false);
    }, COMMIT_HOLD_MS);
  }

  /** Two frames of transition: none, set synchronously so the same style pass sees it and .dark. */
  private snap() {
    const el = this.button()?.nativeElement;
    if (!el) return;
    el.classList.add(INSTANT_CLASS);
    cancelAnimationFrame(this.instantFrame);
    this.instantFrame = requestAnimationFrame(() => {
      this.instantFrame = requestAnimationFrame(() => el.classList.remove(INSTANT_CLASS));
    });
  }

  private announce(theme: ResolvedTheme, manual: boolean) {
    this.announced.set({ theme, manual });
    clearTimeout(this.announceTimer);
    // Empty the node once read, so a virtual cursor never finds a stale or outdated state.
    this.announceTimer = setTimeout(() => this.announced.set(null), 1500);
  }

  private tick() {
    const date = new Date();
    this.nowFraction.set(utcDayFraction(date));
    this.clock.set(formatUtcClock(date));
    this.phase.set(schedulePhase(date));
    this.theme.set(domTheme());
    this.manual.set(isManualThemePreference());
  }
}
