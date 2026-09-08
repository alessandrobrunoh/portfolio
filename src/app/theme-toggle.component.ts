import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";
import { UI } from "../lib/site";
import { toggleThemeOverride } from "../lib/theme";

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      (click)="toggle($event)"
      class="relative inline-flex size-11 shrink-0 items-center justify-center text-muted transition-colors duration-150 hover:text-fg"
      [attr.aria-label]="ui.toggleTheme"
    >
      <span class="relative block size-4 overflow-hidden">
        <svg appIcon="sun" class="theme-sun absolute inset-0 size-4"></svg>
        <svg appIcon="moon" class="theme-moon size-4"></svg>
      </span>
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly ui = UI;

  toggle(event: MouseEvent) {
    const root = document.documentElement;
    const x = event.clientX;
    const y = event.clientY;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${Math.ceil(radius)}px`);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (!reduced && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(toggleThemeOverride);
      return;
    }
    toggleThemeOverride();
  }
}
