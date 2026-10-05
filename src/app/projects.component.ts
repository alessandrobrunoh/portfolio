import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { SpotlightDirective } from "./spotlight.directive";
import { SectionHeadComponent } from "./section-head.component";
import { CONTRIBUTIONS, PROJECTS, UI, lang } from "../lib/site";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [IconComponent, RouterLink, SectionHeadComponent, SpotlightDirective],
  template: `
    <section id="work" class="container-x section scroll-mt-16">
      <app-section-head n="03" [title]="ui.sectionTitles.work" [kicker]="lang() === 'it' ? 'casi / 2024—oggi' : 'case studies / 2024—now'">
        <p class="section-lede">{{ lang() === 'it' ? 'Problemi reali, per persone reali: chi aveva il problema, cosa ho costruito, cosa ho imparato. Più i contributi upstream ad altri progetti.' : 'Real problems for real people: who had the problem, what I built, what I learned. Plus what I have sent upstream to other projects.' }}</p>
      </app-section-head>

      <ul class="project-grid">
        @for (p of projects.slice(0, maxProjects); track p.id; let i = $index; let first = $first) {
          @if (first) {
            <li class="lead reveal-on-scroll">
              <a [routerLink]="['/projects', p.id]" class="card card-link project-card project-lead" appSpotlight>
                <div class="flex items-start justify-between gap-3">
                  <span class="eyebrow"><span class="eyebrow-index">01</span><span class="eyebrow-rule" aria-hidden="true"></span>{{ lang() === 'it' ? 'In evidenza' : 'Featured' }}</span>
                  <span class="meta-mono">@if (p.stars) { <span title="GitHub stars">★ {{ p.stars }}</span> · }{{ p.year }}</span>
                </div>
                <div class="project-lead-body">
                  <div>
                    <h3 class="project-name">{{ p.name }}</h3>
                    @if (p.problem) {
                      <p class="eyebrow mt-5">{{ lang() === 'it' ? 'Il problema' : 'The problem' }}</p>
                      <p class="mt-2 max-w-prose text-body text-fg">{{ p.problem }}</p>
                    } @else {
                      <p class="mt-4 max-w-prose text-body text-muted">{{ p.body }}</p>
                    }
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
                    {{ lang() === 'it' ? 'Leggi il caso' : 'Read the case study' }}
                    <svg appIcon="arrow-up-right" class="card-arrow size-4"></svg>
                  </span>
                </div>
              </a>
            </li>
          } @else {
            <li class="reveal-on-scroll">
              <a [routerLink]="['/projects', p.id]" class="card card-link project-card" appSpotlight>
                <div class="flex items-start justify-between gap-3">
                  <span class="eyebrow-index">0{{ i + 1 }}</span>
                  <span class="meta-mono">@if (p.stars) { <span title="GitHub stars">★ {{ p.stars }}</span> · }{{ p.year }}</span>
                </div>
                <h3 class="project-name mt-10">{{ p.name }}</h3>
                <p class="mt-2.5 flex-1 text-small text-muted">{{ p.blurb }}</p>
                <div class="mt-6 flex items-center justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="chip">{{ p.lang }}</span>
                    @if (isPublished(p.name)) {
                      <span class="chip chip-signal">{{ lang() === 'it' ? 'Pubblicato su crates.io' : 'Published on crates.io' }}</span>
                    } @else {
                      <span class="meta-mono">{{ p.meta }}</span>
                    }
                  </div>
                  <svg appIcon="arrow-up-right" class="card-arrow size-4 shrink-0"></svg>
                </div>
              </a>
            </li>
          }
        }
      </ul>

      <!-- Upstream work lives with the projects: on its own it would be a thin section. -->
      @if (upstream().length) {
        <div class="mt-12 reveal-on-scroll">
          <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ lang() === 'it' ? 'Upstream / open source' : 'Upstream / open source' }}</p>
          <ul class="oss-list mt-4">
            @for (c of upstream(); track c.href) {
              <li>
                <a [href]="c.href" target="_blank" rel="noreferrer" class="oss-row">
                  <span class="status" [class.status-open]="c.status === 'Open'" [class.status-merged]="c.status === 'Merged'">{{ c.status }}</span>
                  <div class="min-w-0">
                    <p class="oss-title">{{ c.title }}</p>
                    <p class="mt-1 meta-mono">{{ c.repo }} · {{ ref(c.href) }} — {{ c.note }}</p>
                  </div>
                  <svg appIcon="arrow-up-right" class="card-arrow size-4 shrink-0"></svg>
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </section>
  `,
})
export class ProjectsComponent {
  protected readonly projects = PROJECTS;
  protected readonly ui = UI;
  protected readonly lang = lang;
  /** The home page shows a short list; every project keeps its own page. */
  protected readonly maxProjects = 5;

  /** Contributions to other people's repositories; published crates are already project cards. */
  protected readonly upstream = computed(() => {
    lang();
    return CONTRIBUTIONS.filter((c) => c.status !== "Published");
  });

  protected isPublished(name: string) {
    return CONTRIBUTIONS.some((c) => c.status === "Published" && c.title === name);
  }

  protected ref(href: string) {
    return href.includes("/pull/") ? `PR #${href.split("/pull/")[1]}` : "repo";
  }
}
