import { Component } from "@angular/core";
import { MarkComponent } from "./icon.component";
import { TOOLS } from "../lib/site";

@Component({
  selector: "app-tools",
  standalone: true,
  imports: [MarkComponent],
  template: `
    <section id="tools" aria-label="Daily tools" class="mt-16 border-t border-fg/10 pt-10">
      <p class="font-mono text-caption tracking-mono text-accent">Daily tools</p>
      <p class="mt-2 max-w-prose font-serif text-small text-muted">What I actually open every day — not a stack list, a working set.</p>
      <ul class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        @for (tool of tools; track tool.name) {
          <li>
            <a
              [href]="tool.href"
              target="_blank"
              rel="noreferrer"
              class="tool-slot group flex min-h-16 items-center gap-3 rounded-md px-3 py-3 shadow-border transition-[box-shadow,color] duration-150 hover:shadow-border-hover"
            >
              <span class="tool-mark shrink-0 text-fg">
                <svg [appMark]="tool.mark" class="size-8"></svg>
              </span>
              <span class="min-w-0">
                <span class="block font-serif text-body text-fg">{{ tool.name }}</span>
                <span class="block font-mono text-caption tracking-mono text-muted">{{ tool.product }}</span>
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
}
