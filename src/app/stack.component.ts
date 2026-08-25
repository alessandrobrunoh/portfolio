import { Component } from "@angular/core";
import { SectionHeadComponent } from "./section-head.component";
import { STACK } from "../lib/site";

@Component({
  selector: "app-stack",
  standalone: true,
  imports: [SectionHeadComponent],
  template: `
    <section id="stack" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="05" title="Stack" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">layers / interfaces / leverage</span>
      </div>
      <p class="mb-10 max-w-prose font-serif text-lede text-muted">The tools I would defend in an interview, not everything I have ever opened. A stack is useful when every layer makes the next one more expressive.</p>

      <div class="stack-layers">
        @for (g of groups; track g.name; let i = $index) {
          <article class="stack-layer group" [attr.data-tooltip]="'Explore the ' + g.name + ' layer'">
            <div class="stack-layer-index">0{{ i + 1 }}</div>
            <div class="stack-layer-name"><h3 class="font-display text-heading-sm text-fg transition-colors group-hover:text-accent">{{ g.name }}</h3>@if (g.level) { <span class="font-mono text-caption tracking-mono text-muted">{{ g.level }}</span> }</div>
            <div class="stack-layer-track" aria-hidden="true"><span [style.width.%]="100 - i * 14"></span></div>
            <ul class="stack-layer-items">@for (item of g.items.split(' · '); track item) { <li>{{ item }}</li> }</ul>
            @if (g.also) { <p class="stack-layer-also font-serif text-caption text-muted">also worked with: {{ g.also }}</p> }
          </article>
        }
      </div>
      <div class="mt-5 flex flex-wrap justify-between gap-3 font-mono text-caption tracking-mono text-muted"><span>closer to the metal</span><span class="text-accent">closer to the person using it →</span></div>
    </section>
  `,
})
export class StackComponent {
  protected readonly groups = STACK.groups;
}
