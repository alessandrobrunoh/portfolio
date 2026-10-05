import { Component } from "@angular/core";
import { MarkComponent } from "./icon.component";
import { TOOLS, lang } from "../lib/site";

@Component({
  selector: "app-tools",
  standalone: true,
  imports: [MarkComponent],
  template: `
    <section id="tools" aria-labelledby="tools-title" class="py-14">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <p id="tools-title" class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ lang() === 'it' ? 'Strumenti quotidiani' : 'Daily tools' }}</p>
        <p class="text-small text-muted">
          {{ lang() === 'it' ? 'Quello che apro davvero ogni giorno — un set di lavoro, non una lista.' : 'What I actually open every day — a working set, not a stack list.' }}
        </p>
      </div>
      <ul class="tool-grid mt-6">
        @for (tool of tools; track tool.name) {
          <li>
            <a [href]="tool.href" target="_blank" rel="noreferrer" class="tool-slot">
              <span class="tool-mark shrink-0">
                <svg [appMark]="tool.mark" class="size-7"></svg>
              </span>
              <span class="min-w-0">
                <span class="block text-small font-medium text-fg">{{ tool.name }}</span>
                <span class="block meta-mono">{{ tool.product }}</span>
              </span>
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
