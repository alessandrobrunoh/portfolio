import { Component, input } from "@angular/core";
import { cn } from "../lib/utils";

@Component({
  selector: "app-keybind",
  standalone: true,
  template: `
    <span [class]="cn('chip', className())">
      <ng-content />
    </span>
  `,
})
export class KeybindComponent {
  className = input<string>("", { alias: "class" });
  protected readonly cn = cn;
}
