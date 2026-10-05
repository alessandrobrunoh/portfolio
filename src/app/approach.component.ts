import { Component } from "@angular/core";
import { SectionHeadComponent } from "./section-head.component";
import { PRINCIPLES, UI, lang } from "../lib/site";

/** "How I work": the habits a client or team gets, in place of a skill grid (the tech band covers tools). */
@Component({
  selector: "app-approach",
  standalone: true,
  imports: [SectionHeadComponent],
  template: `
    <section id="approach" class="container-x section scroll-mt-16">
      <app-section-head n="04" [title]="ui.sectionTitles.approach" [kicker]="lang() === 'it' ? 'principi / pratica' : 'principles / practice'">
        <p class="section-lede">
          {{
            lang() === 'it'
              ? 'Gli strumenti cambiano da un cliente all’altro. Il modo di lavorare no: è quello che porto in ogni team e in ogni sistema.'
              : 'Tools change from one client to the next. The way of working does not: it is what I bring into every team and every system.'
          }}
        </p>
      </app-section-head>

      <ol class="principles">
        @for (p of principles; track p.title; let i = $index) {
          <li class="principle reveal-row">
            <span class="principle-n">0{{ i + 1 }}</span>
            <h3 class="principle-title">{{ p.title }}</h3>
            <p class="principle-body">{{ p.body }}</p>
          </li>
        }
      </ol>
    </section>
  `,
})
export class ApproachComponent {
  protected readonly principles = PRINCIPLES;
  protected readonly ui = UI;
  protected readonly lang = lang;
}
