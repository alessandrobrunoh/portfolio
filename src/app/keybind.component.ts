import { Component, input } from "@angular/core";
import { cn } from "../lib/utils";

@Component({
  selector: "app-keybind",
  standalone: true,
  template: `
    <span
      [class]="
        cn(
          'inline-flex items-center rounded-sm bg-surface px-2 py-1',
          'font-mono text-caption tracking-mono text-fg shadow-border',
          className()
        )
      "
    >
      <ng-content />
    </span>
  `,
})
export class KeybindComponent {
  className = input<string>("", { alias: "class" });
  protected readonly cn = cn;
}
