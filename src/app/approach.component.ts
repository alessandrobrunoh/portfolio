import { Component } from "@angular/core";
import { IconComponent, MarkComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { SpotlightDirective } from "./spotlight.directive";
import { PRINCIPLES, TOOLS, UI, lang } from "../lib/site";

@Component({
  selector: "app-approach",
  standalone: true,
  imports: [IconComponent, MarkComponent, SectionHeadComponent, SpotlightDirective],
  template: `
    <section id="approach" class="container-x section scroll-mt-16">
      <app-section-head
        n="04"
        [title]="ui.sectionTitles.approach"
        [kicker]="lang() === 'it' ? 'Dal problema al rilascio' : 'From problem to production'"
      >
        <p class="section-lede">
          {{
            lang() === 'it'
              ? 'Prima capisco chi deve usare il software e qual è il costo di ogni scelta. Poi il problema diventa un workstream verificabile in Trama, lo costruisco per incrementi testabili, revisiono ogni diff riga per riga e lascio contesto chiaro per il team.'
              : 'First I understand who uses the software and what each option costs. Then the problem becomes a verifiable workstream in Trama, I build it in testable increments, review every diff line by line, and leave clear context for the team.'
          }}
        </p>
      </app-section-head>

      <!-- Clean Connected 5-Step Pipeline Track -->
      <ol class="pipeline-track reveal-on-scroll">
        @for (p of principles(); track p.tag; let i = $index) {
          <li class="pipeline-step">
            <div class="pipeline-head">
              <span class="pipeline-node">0{{ i + 1 }}</span>
              <span class="font-mono text-caption font-semibold uppercase tracking-wider text-accent">{{ p.tag }}</span>
            </div>

            <div class="pipeline-card">
              <h3 class="text-subhead font-semibold tracking-tight text-fg">
                {{ p.title }}<span class="brand-dot" aria-hidden="true">.</span>
              </h3>

              <p class="mt-2 text-small text-muted leading-relaxed">
                {{ p.body }}
              </p>

              <ul class="pipeline-points mt-4">
                @for (item of p.practice.slice(0, 2); track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          </li>
        }
      </ol>

      <!-- Integrated Daily Workbench Strip (OpenAI · Zed · Delta · Trama — without 01/02/03/04 numbers) -->
      <div class="approach-tools-bar reveal-on-scroll">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div class="flex items-center gap-2.5">
            <span class="live-dot" aria-hidden="true"></span>
            <span class="font-mono text-caption font-semibold uppercase tracking-wider text-fg">
              {{ lang() === 'it' ? 'Strumenti quotidiani' : 'Daily workbench' }}
            </span>
          </div>
          <span class="text-caption text-muted">
            {{ lang() === 'it' ? 'Quello che tengo aperto ogni giorno mentre progetto e rilascio.' : 'What stays open on my machine every day while designing and shipping.' }}
          </span>
        </div>

        <ul class="tool-grid">
          @for (tool of tools(); track tool.name) {
            <li>
              <a [href]="tool.href" target="_blank" rel="noreferrer" class="tool-slot card" appSpotlight>
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="tool-mark shrink-0">
                      <svg [appMark]="tool.mark" class="size-5"></svg>
                    </span>
                    <div class="min-w-0">
                      <span class="tool-name text-small font-semibold text-fg block truncate">{{ tool.name }}</span>
                      <span class="block font-mono text-caption text-muted truncate">{{ tool.product }}</span>
                    </div>
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
      </div>
    </section>
  `,
})
export class ApproachComponent {
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly principles = () => {
    lang();
    return PRINCIPLES;
  };
  protected readonly tools = () => {
    lang();
    return TOOLS;
  };
}
