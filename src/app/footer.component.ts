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
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-caption tracking-mono text-muted">
          <a [href]="'mailto:' + profile.email" class="transition-colors hover:text-accent">{{ profile.email }}</a>
          <span class="text-fg/20">·</span>
          <a [href]="profile.github" target="_blank" rel="noreferrer" class="transition-colors hover:text-accent">GitHub</a>
          <span class="text-fg/20">·</span>
          <span>{{ profile.location }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly profile = PROFILE;
}
