import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommandPaletteComponent } from "./app/command-palette.component";
import { initTheme } from "./lib/theme";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommandPaletteComponent],
  template: `
    <router-outlet />
    <app-command-palette />
  `,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    initTheme();
  }
}
