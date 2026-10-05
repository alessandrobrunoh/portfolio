import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { PROJECTS, UI, lang } from "../lib/site";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [IconComponent, RouterLink, SectionHeadComponent],
  template: `
    <section id="projects" class="container-x section scroll-mt-16">
      <app-section-head n="02" [title]="ui.sectionTitles.projects" [kicker]="lang() === 'it' ? 'lavori scelti / 2024—oggi' : 'selected work / 2024—now'">
        <p class="section-lede">{{ lang() === 'it' ? 'Sistemi, strumenti, giochi e interfacce. Ognuno è una domanda a cui ho risposto con il codice.' : 'Systems, tools, games, and interfaces. Each one is a question answered in code.' }}</p>
      </app-section-head>

      <ul class="project-grid">
        @for (p of projects.slice(0, maxProjects); track p.id; let i = $index; let first = $first) {
          @if (first) {
            <li class="lead reveal-on-scroll">
              <a [routerLink]="['/projects', p.id]" class="card card-link project-card project-lead">
                <span class="project-lead-glow" aria-hidden="true"></span>
                <div class="flex items-start justify-between gap-3">
                  <span class="eyebrow"><span class="eyebrow-index">01</span><span class="eyebrow-rule" aria-hidden="true"></span>{{ lang() === 'it' ? 'In evidenza' : 'Featured' }}</span>
                  <span class="meta-mono">@if (p.stars) { <span title="GitHub stars">★ {{ p.stars }}</span> · }{{ p.year }}</span>
                </div>
                <div class="project-lead-body">
                  <div>
                    <h3 class="project-name">{{ p.name }}</h3>
                    <p class="mt-4 max-w-prose text-body text-muted">{{ p.body }}</p>
                    <div class="mt-6 flex flex-wrap items-center gap-1.5">
                      <span class="chip">{{ p.lang }}</span>
                      @for (t of p.stack; track t) { <span class="chip chip-quiet">{{ t }}</span> }
                    </div>
                  </div>
                  <ol class="project-highlights">
                    @for (h of p.highlights; track h; let j = $index) { <li><span>0{{ j + 1 }}</span>{{ h }}</li> }
                  </ol>
                </div>
                <div class="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
                  <span class="meta-mono text-accent">{{ p.meta }}</span>
                  <span class="inline-flex items-center gap-2 text-small font-medium text-fg">
                    {{ lang() === 'it' ? 'Apri il progetto' : 'Open the project' }}
                    <svg appIcon="arrow-up-right" class="card-arrow size-4"></svg>
                  </span>
                </div>
              </a>
            </li>
          } @else {
            <li class="reveal-on-scroll">
              <a [routerLink]="['/projects', p.id]" class="card card-link project-card">
                <div class="flex items-start justify-between gap-3">
                  <span class="eyebrow-index">0{{ i + 1 }}</span>
                  <span class="meta-mono">@if (p.stars) { <span title="GitHub stars">★ {{ p.stars }}</span> · }{{ p.year }}</span>
                </div>
                <h3 class="project-name mt-10">{{ p.name }}</h3>
                <p class="mt-2.5 flex-1 text-small text-muted">{{ p.blurb }}</p>
                <div class="mt-6 flex items-center justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-2"><span class="chip">{{ p.lang }}</span><span class="meta-mono">{{ p.meta }}</span></div>
                  <svg appIcon="arrow-up-right" class="card-arrow size-4 shrink-0"></svg>
                </div>
              </a>
            </li>
          }
        }
      </ul>
    </section>
  `,
})
export class ProjectsComponent {
  protected readonly projects = PROJECTS;
  protected readonly ui = UI;
  protected readonly lang = lang;
  /** The home page shows a short list; every project keeps its own page. */
  protected readonly maxProjects = 5;
}
