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
    toggleThemeFromPointer(event);
  }
}
