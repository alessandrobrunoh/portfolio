import { Component, input } from "@angular/core";
import { lang } from "../lib/site";
import type { Decision } from "../lib/site.types";

/** Numbered decisions (context → choice, optional code). The in-depth story that used to be an article. */
@Component({
  selector: "app-decisions",
  standalone: true,
  template: `
    <ol class="decisions">
      @for (d of decisions(); track d.title; let i = $index) {
        <li class="decision">
          <span class="decision-n">0{{ i + 1 }}</span>
          <div class="min-w-0">
            <h3 class="text-subhead font-medium tracking-tight text-fg">{{ d.title }}</h3>
            <p class="mt-3 text-body text-muted">{{ d.context }}</p>
            <p class="decision-choice">
              <span class="eyebrow">{{ lang() === 'it' ? 'Scelta' : 'Choice' }}</span>
              <span class="mt-1.5 block text-body text-fg">{{ d.choice }}</span>
            </p>
            @if (d.code) {
              <pre class="article-code mt-4 overflow-x-auto rounded-lg p-4 font-mono text-small leading-6"><code>{{ d.code }}</code></pre>
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
