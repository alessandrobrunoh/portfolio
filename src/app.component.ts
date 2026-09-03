import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommandPaletteComponent } from "./app/command-palette.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommandPaletteComponent],
  template: `
    <router-outlet />
    <app-command-palette />
  `,
})
export class AppComponent {}
