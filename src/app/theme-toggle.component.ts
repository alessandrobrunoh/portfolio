import { Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
import { lang } from "../lib/site";
import { THEME_CHANGE_EVENT, toggleThemeFromPointer, type ResolvedTheme } from "../lib/theme";

let nextUid = 0;

function domTheme(): ResolvedTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Sun/moon morph. The core grows and a masking disc slides over it to cut the crescent while
 * the rays spin out; everything keys off html.dark, so it moves in the same frame as the theme.
 * The page itself changes through a circular reveal from the button (see theme.ts).
 */
@Component({
  selector: "app-theme-toggle",
  standalone: true,
  host: { class: "contents" },
  template: `
    <button type="button" class="nav-ctl theme-toggle" (click)="toggle($event)" [attr.aria-label]="label()" [attr.title]="label()">
      <svg viewBox="0 0 24 24" class="theme-toggle-icon" aria-hidden="true">
        <defs>
          <mask [attr.id]="maskId">
            <rect width="24" height="24" fill="white" />
            <circle class="theme-toggle-cut" cx="17" cy="7" r="6.5" fill="black" />
          </mask>
        </defs>
        <circle class="theme-toggle-core" cx="12" cy="12" r="5" fill="currentColor" [attr.mask]="maskUrl" />
        <g class="theme-toggle-rays" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
          <path d="M12 2.5v1.75M12 19.75v1.75M2.5 12h1.75M19.75 12h1.75M5.3 5.3l1.25 1.25M17.45 17.45l1.25 1.25M5.3 18.7l1.25-1.25M17.45 6.55l1.25-1.25" />
        </g>
      </svg>
    </button>
    <span class="sr-only" role="status">{{ announcement() }}</span>
  `,
})
export class ThemeToggleComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly uid = nextUid++;
  protected readonly maskId = `theme-toggle-mask-${this.uid}`;
  protected readonly maskUrl = `url(#${this.maskId})`;
  protected readonly theme = signal<ResolvedTheme>(domTheme());
  protected readonly announcement = signal("");

  protected readonly label = computed(() => {
    const isIt = lang() === "it";
    return this.theme() === "dark"
      ? isIt ? "Passa al tema chiaro" : "Switch to light theme"
      : isIt ? "Passa al tema scuro" : "Switch to dark theme";
  });

  ngOnInit() {
    const onChange = () => {
      const next = domTheme();
      if (next === this.theme()) return;
      this.theme.set(next);
      const isIt = lang() === "it";
      this.announcement.set(next === "dark" ? (isIt ? "Tema scuro" : "Dark theme") : isIt ? "Tema chiaro" : "Light theme");
    };
    window.addEventListener(THEME_CHANGE_EVENT, onChange);
    this.destroyRef.onDestroy(() => window.removeEventListener(THEME_CHANGE_EVENT, onChange));
  }

  toggle(event: MouseEvent) {
    toggleThemeFromPointer(event);
  }
}
