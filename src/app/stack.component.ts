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

      <div class="stack-grid">
        @for (g of groups; track g.name; let i = $index) {
          <article class="stack-card reveal-on-scroll">
            <div class="stack-card-head">
              <span class="text-accent">0{{ i + 1 }}</span>
              @if (g.level) { <span class="stack-level">{{ g.level }}</span> }
            </div>
            <h3 class="mt-6 font-display text-heading-sm text-fg">{{ g.name }}</h3>
            <ul class="stack-primary" [attr.aria-label]="g.name + ' tools'">
              @for (item of g.items.split(' · '); track item) { <li>{{ item }}</li> }
            </ul>
            @if (g.also) { <p class="stack-also"><span>Also</span>{{ g.also }}</p> }
          </article>
        }
      </div>
    </section>
  `,
})
export class StackComponent {
  protected readonly groups = STACK.groups;
}
