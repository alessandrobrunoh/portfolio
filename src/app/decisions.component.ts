import { Component, input } from "@angular/core";
import { lang } from "../lib/site";
import type { Decision } from "../lib/site.types";

@Component({
  selector: "app-decisions",
  standalone: true,
  template: `
    <ol class="decisions">
      @for (d of decisions(); track d.title; let i = $index) {
        <li class="decision">
          <span class="decision-n">0{{ i + 1 }}</span>
          <div class="min-w-0">
            <h3 class="text-subhead font-semibold tracking-tight text-fg">{{ d.title }}<span class="brand-dot" aria-hidden="true">.</span></h3>
            <p class="mt-2.5 text-body text-muted leading-relaxed">{{ d.context }}</p>
            <div class="decision-choice">
              <span class="font-mono text-micro uppercase tracking-wider text-accent">{{ lang() === 'it' ? 'Scelta progettuale' : 'Engineering choice' }}</span>
              <span class="mt-1.5 block text-body text-fg leading-relaxed">{{ d.choice }}</span>
            </div>
            @if (d.code) {
              <pre class="article-code mt-4 overflow-x-auto p-4 font-mono text-small leading-6"><code>{{ d.code }}</code></pre>
            }
          </div>
        </li>
      }
    </ol>
  `,
})
export class DecisionsComponent {
  decisions = input.required<readonly Decision[]>();
  protected readonly lang = lang;
}
