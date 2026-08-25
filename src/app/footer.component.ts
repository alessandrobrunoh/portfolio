import { Component } from "@angular/core";
import { ToolsComponent } from "./tools.component";
import { PROFILE } from "../lib/site";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [ToolsComponent],
  template: `
    <footer>
      <app-tools />
      <div class="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-fg/10 py-8">
        <p class="font-serif italic text-small text-fg">{{ profile.name }}</p>
        <p class="font-mono text-caption tracking-mono text-muted">{{ profile.location }} · {{ profile.role }}</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly profile = PROFILE;
}
