import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { COMPANY, EDUCATION, ROLES, UI, lang } from "../lib/site";
import type { Impact } from "../lib/site.types";

type RoadmapStep = {
  era: string;
  title: string;
  org: string;
  bullets?: readonly string[];
  note?: string;
  tags?: readonly string[];
  impact?: readonly Impact[];
  caseId?: string;
  current: boolean;
};

/** Built from the live (language-switched) data, so it must be read after every setLanguage. */
function buildRoadmap(): RoadmapStep[] {
  return [
    ...ROLES.map((role) => ({ era: role.dates, title: role.title, org: `${COMPANY.name} · ${COMPANY.location}`, bullets: role.bullets, tags: role.tags, impact: role.impact, caseId: role.caseId, current: role.current })),
    { era: EDUCATION.dates, title: EDUCATION.school, org: `${EDUCATION.degree} · ${EDUCATION.native}`, note: EDUCATION.thesis, current: false },
  ];
}

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [IconComponent, RouterLink, SectionHeadComponent],
  template: `
    <section id="experience" class="container-x section scroll-mt-16">
      <app-section-head n="02" [title]="ui.sectionTitles.experience" [kicker]="lang() === 'it' ? 'percorso / decisioni' : 'timeline / decisions'">
        <p class="section-lede">{{ company.summary }}</p>
      </app-section-head>

      <ol class="tl">
        @for (step of roadmap(); track step.title) {
          <li class="tl-row reveal-row" [class.is-current]="step.current">
            <div class="tl-era">
              {{ step.era }}
              @if (step.current) { <span class="pill-now"><span class="size-1.5 rounded-full bg-signal" aria-hidden="true"></span>{{ lang() === 'it' ? 'ora' : 'now' }}</span> }
            </div>
            <div class="tl-spine" aria-hidden="true"><span class="tl-node"></span></div>
            <article class="tl-body">
              <h3 class="tl-title">{{ step.title }}</h3>
              <p class="mt-1.5 text-small text-muted">{{ step.org }}</p>
              @if (step.bullets) {
                <ul class="tl-bullets mt-5 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
                  @for (item of step.bullets; track item) { <li>{{ item }}</li> }
                </ul>
              }
              @if (step.impact?.length) {
                <dl class="impact-row mt-5">
                  @for (m of step.impact; track m.label) {
                    <div><dt>{{ m.label }}</dt><dd>{{ m.value }}</dd></div>
                  }
                </dl>
              }
              @if (step.note) {
                <blockquote class="mt-5 max-w-2xl border-l border-silver/50 pl-4 text-small text-muted">{{ step.note }}</blockquote>
              }
              @if (step.caseId) {
                <a [routerLink]="['/work', step.caseId]" class="case-link mt-5">
                  <span>{{ lang() === 'it' ? 'Leggi il caso' : 'Read the case study' }}</span>
                  <svg appIcon="arrow-right" class="size-4"></svg>
                </a>
              }
              @if (step.tags) {
                <ul class="mt-5 flex flex-wrap gap-1.5">
                  @for (tag of step.tags; track tag) { <li class="chip">{{ tag }}</li> }
                </ul>
              }
            </article>
          </li>
        }
      </ol>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly company = COMPANY;
  protected readonly ui = UI;
  protected readonly lang = lang;
  // lang() is the dependency: setLanguage mutates the data in place, then flips the signal.
  protected readonly roadmap = computed(() => {
    lang();
    return buildRoadmap();
  });
}
