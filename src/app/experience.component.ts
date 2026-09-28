import { Component } from "@angular/core";
import { KeybindComponent } from "./keybind.component";
import { SectionHeadComponent } from "./section-head.component";
import { COMPANY, EDUCATION, ROLES, UI, lang } from "../lib/site";

type RoadmapStep = {
  era: string;
  title: string;
  org: string;
  bullets?: readonly string[];
  note?: string;
  tags?: readonly string[];
  current: boolean;
};

const ROADMAP: RoadmapStep[] = [
  { era: EDUCATION.dates, title: EDUCATION.school, org: `${EDUCATION.degree} · ${EDUCATION.native}`, note: EDUCATION.thesis, current: false },
  ...ROLES.slice().reverse().map((role) => ({ era: role.dates, title: role.title, org: `${COMPANY.name} · ${COMPANY.location}`, bullets: role.bullets, tags: role.tags, current: role.current })),
];

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [KeybindComponent, SectionHeadComponent],
  template: `
    <section id="experience" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="03" [title]="ui.sectionTitles.experience" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">{{ lang() === 'it' ? 'percorso / decisioni' : 'timeline / decisions' }}</span>
      </div>
      <p class="mb-10 max-w-prose font-serif text-lede text-muted">{{ company.summary }}</p>

      <ol class="roadmap-list">
        @for (step of roadmap; track step.title; let i = $index) {
          <li class="roadmap-row reveal-row" [class.roadmap-row-current]="step.current">
            <div class="roadmap-year" [attr.data-tooltip]="step.current ? 'Current position' : 'Milestone'">{{ step.era }}</div>
            <div class="roadmap-spine" aria-hidden="true"><span>{{ (i + 1).toString().padStart(2, '0') }}</span></div>
            <article class="roadmap-copy group">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div><h3 class="font-display text-heading-sm text-fg transition-colors group-hover:text-accent">{{
 step.title }}</h3><p class="mt-1 font-serif text-small text-muted">{{ step.org }}</p></div>
                @if (step.current) { <span class="roadmap-now">now</span> }
              </div>
              @if (step.bullets) { <ul class="mt-5 grid gap-2 sm:grid-cols-2">@for (item of step.bullets; track item) { <li class="flex gap-3 font-serif text-small text-muted"><span class="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>{{ item }}</li> }</ul> }
              @if (step.note) { <blockquote class="mt-5 max-w-2xl border-t border-fg/10 pt-4 font-serif text-small italic text-muted">{{ step.note }}</blockquote> }
              @if (step.tags) { <ul class="mt-5 flex flex-wrap gap-1.5">@for (tag of step.tags; track tag) { <li><app-keybind>{{ tag }}</app-keybind></li> }</ul> }
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
  protected readonly roadmap = ROADMAP;
}
