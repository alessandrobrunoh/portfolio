import { Component } from "@angular/core";
import { IconComponent, MarkComponent } from "./icon.component";
import { TOOLS, lang } from "../lib/site";

@Component({
  selector: "app-tools",
  standalone: true,
  imports: [IconComponent, MarkComponent],
  template: `
    <section id="tools" aria-labelledby="tools-title" class="py-12">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div class="section-badge">
          <span class="section-badge-dot" aria-hidden="true"></span>
          <span id="tools-title">{{ lang() === 'it' ? 'Strumenti quotidiani' : 'Daily workbench' }}</span>
        </div>
        <p class="font-mono text-caption text-muted">
          {{ lang() === 'it' ? 'Quello che tengo aperto ogni giorno.' : 'What stays open on my machine every day.' }}
        </p>
      </div>
      <ul class="tool-grid">
        @for (tool of tools; track tool.name) {
          <li>
            <a [href]="tool.href" target="_blank" rel="noreferrer" class="tool-slot">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="tool-mark shrink-0">
                    <svg [appMark]="tool.mark" class="size-5"></svg>
                  </span>
                  <span class="min-w-0">
                    <span class="tool-name text-small font-semibold text-fg block truncate">{{ tool.name }}</span>
                    <span class="block font-mono text-caption text-muted truncate">{{ tool.product }}</span>
                  </span>
                </div>
                @if (tool.mine) {
                  <span class="tool-mine shrink-0">{{ lang() === 'it' ? 'Mio' : 'Mine' }}</span>
                } @else {
                  <svg appIcon="arrow-up-right" class="size-4 text-faint shrink-0"></svg>
                }
              </div>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class ToolsComponent {
  protected readonly tools = TOOLS;
  protected readonly lang = lang;
}
