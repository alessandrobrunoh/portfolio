import { Component, OnInit } from "@angular/core";
import { IconComponent } from "./icon.component";
import { UI } from "../lib/site";

const LIGHT = "#eceef4";
const DARK = "#0b0c10";

function syncThemeColor() {
  const dark = document.documentElement.classList.contains("dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? DARK : LIGHT);
}

function applyTheme() {
  document.documentElement.classList.toggle("dark");
  const dark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  syncThemeColor();
}

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
export class ThemeToggleComponent implements OnInit {
  protected readonly ui = UI;

  ngOnInit() {
    syncThemeColor();
  }

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
      doc.startViewTransition(applyTheme);
      return;
    }
    applyTheme();
  }
}
