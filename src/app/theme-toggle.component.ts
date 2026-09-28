import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";
import { UI } from "../lib/site";
import { toggleThemeFromPointer } from "../lib/theme";

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      (click)="toggle($event)"
      class="theme-toggle-button relative inline-flex size-11 shrink-0 items-center justify-center text-muted transition-colors duration-200 hover:text-fg"
      [attr.aria-label]="ui.toggleTheme"
    >
      <span class="theme-toggle-scene" aria-hidden="true">
        <svg viewBox="0 0 40 30" class="theme-toggle-sky">
          <path class="theme-toggle-trajectory" d="M 4 23 A 16 16 0 0 1 36 23" />
          <path class="theme-toggle-ground" d="M 2 24 Q 11 19 20 24 T 38 24 V 30 H 2 Z" />
          <path class="theme-toggle-horizon" d="M 2 24 H 38" />
        </svg>
        <svg appIcon="sun" class="theme-toggle-orb theme-toggle-sun"></svg>
        <svg appIcon="moon" class="theme-toggle-orb theme-toggle-moon"></svg>
        <span class="theme-toggle-stars">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </span>
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly ui = UI;

  toggle(event: MouseEvent) {
    toggleThemeFromPointer(event);
  }
}
