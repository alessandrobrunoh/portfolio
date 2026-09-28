import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { initTheme } from "./lib/theme";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    initTheme();
  }
}
