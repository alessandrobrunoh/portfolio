import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { KeybindsHudComponent } from "./app/keybinds-hud.component";
import { initTheme } from "./lib/theme";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, KeybindsHudComponent],
  template: `
    <router-outlet />
    <app-keybinds-hud />
  `,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    initTheme();
  }
}
