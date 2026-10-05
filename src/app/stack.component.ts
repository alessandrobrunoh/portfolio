import { Component } from "@angular/core";
import { SectionHeadComponent } from "./section-head.component";
import { STACK, UI, lang } from "../lib/site";

@Component({
  selector: "app-stack",
  standalone: true,
  imports: [SectionHeadComponent],
  template: `
    <section id="stack" class="container-x section scroll-mt-16">
      <app-section-head n="05" [title]="ui.sectionTitles.stack" [kicker]="lang() === 'it' ? 'livelli / interfacce / leva' : 'layers / interfaces / leverage'">
        <p class="section-lede">{{ lang() === 'it' ? 'Gli strumenti che difenderei in un colloquio, non tutto quello che ho aperto almeno una volta. Uno stack è utile quando ogni livello rende il successivo più espressivo.' : 'The tools I would defend in an interview, not everything I have ever opened. A stack is useful when every layer makes the next one more expressive.' }}</p>
      </app-section-head>

      <div class="stack-grid">
        @for (g of groups; track g.name; let i = $index) {
          <article class="card stack-card reveal-on-scroll">
            <div class="flex items-center justify-between gap-3">
              <span class="eyebrow-index">0{{ i + 1 }}</span>
              @if (g.level) { <span class="stack-level">{{ g.level }}</span> }
            </div>
            <h3 class="project-name mt-8">{{ g.name }}</h3>
            <ul class="mt-4 flex flex-wrap gap-1.5" [attr.aria-label]="g.name">
              @for (item of g.items.split(' · '); track item) { <li class="chip">{{ item }}</li> }
            </ul>
            @if (g.also) {
              <div class="stack-also"><p class="eyebrow">{{ lang() === 'it' ? 'Anche' : 'Also' }}</p><p class="mt-1.5">{{ g.also }}</p></div>
            }
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
