import { Component } from "@angular/core";
import { SectionHeadComponent } from "./section-head.component";
import { STACK, UI, lang } from "../lib/site";

@Component({
  selector: "app-stack",
  standalone: true,
  imports: [SectionHeadComponent],
  template: `
    <section id="stack" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="05" [title]="ui.sectionTitles.stack" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">{{ lang() === 'it' ? 'livelli / interfacce / leva' : 'layers / interfaces / leverage' }}</span>
      </div>
      <p class="mb-10 max-w-prose font-serif text-lede text-muted">{{ lang() === 'it' ? 'Gli strumenti che difenderei in un colloquio, non tutto quello che ho aperto almeno una volta. Uno stack è utile quando ogni livello rende il successivo più espressivo.' : 'The tools I would defend in an interview, not everything I have ever opened. A stack is useful when every layer makes the next one more expressive.' }}</p>

      <div class="stack-grid">
        @for (g of groups; track g.name; let i = $index) {
          <article class="stack-card reveal-on-scroll">
            <div class="stack-card-head">
              <span class="text-accent">0{{ i + 1 }}</span>
              @if (g.level) { <span class="stack-level">{{ g.level }}</span> }
            </div>
            <h3 class="mt-6 font-display text-heading-sm text-fg">{{ g.name }}</h3>
            <ul class="stack-primary" [attr.aria-label]="g.name">
              @for (item of g.items.split(' · '); track item) { <li>{{ item }}</li> }
            </ul>
            @if (g.also) { <p class="stack-also"><span>{{ lang() === 'it' ? 'Anche' : 'Also' }}</span>{{ g.also }}</p> }
          </article>
        }
      </div>
    </section>
  `,
})
export class StackComponent {
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly groups = STACK.groups;
}
