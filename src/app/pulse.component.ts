import { Component } from "@angular/core";
import { ActivityChartComponent } from "./activity-chart.component";
import { ContributionChartComponent } from "./contribution-chart.component";
import { LanguageChartComponent } from "./language-chart.component";
import { PulseKpiComponent } from "./pulse-kpi.component";
import { SectionHeadComponent } from "./section-head.component";
import { PULSE, UI } from "../lib/site";

@Component({
  selector: "app-pulse",
  standalone: true,
  imports: [
    ActivityChartComponent,
    ContributionChartComponent,
    LanguageChartComponent,
    PulseKpiComponent,
    SectionHeadComponent,
  ],
  template: `
    <section id="pulse" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <app-section-head n="06" [title]="ui.sectionTitles.pulse" />
      <p class="mb-6 max-w-prose font-serif text-body text-muted">{{ pulse.lede }}</p>

      <div class="grid gap-3 sm:grid-cols-3">
        @for (kpi of pulse.kpis; track kpi.label) {
          <app-pulse-kpi
            [label]="kpi.label"
            [hint]="kpi.hint"
            [value]="'value' in kpi ? kpi.value : undefined"
            [display]="'display' in kpi ? kpi.display : undefined"
          />
        }
      </div>

      <p class="reveal-card mt-3 rounded-md bg-surface px-5 py-4 font-serif text-body text-fg shadow-border">{{ pulse.takeaway }}</p>

      <div class="mt-3 grid gap-3 lg:grid-cols-2">
        <div class="reveal-card rounded-md bg-surface p-5 shadow-border sm:p-6">
          <p class="font-mono text-caption tracking-mono text-accent">Contributions</p>
          <p class="mt-1 max-w-prose font-serif text-small text-muted">
            GitHub's own contribution count, by quarter. Q3 ’25 is when the internship started.
          </p>
          <div class="chart-frame mt-4 h-56 w-full sm:h-64">
            <app-activity-chart />
          </div>
          <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <li class="flex items-center gap-2 font-mono text-caption tracking-mono text-muted">
              <span class="swatch swatch-bar" aria-hidden="true"></span>Contributions per quarter
            </li>
          </ul>
        </div>

        <div class="reveal-card rounded-md bg-surface p-5 shadow-border sm:p-6">
          <p class="font-mono text-caption tracking-mono text-accent">What I write</p>
          <p class="mt-1 max-w-prose font-serif text-small text-muted">
            Share of each quarter's commits, by the primary language of the repository they landed in.
          </p>
          <div class="chart-frame mt-4 h-56 w-full sm:h-64">
            <app-language-chart />
          </div>
          <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <li class="flex items-center gap-2 font-mono text-caption tracking-mono text-muted">
              <span class="swatch swatch-line" aria-hidden="true"></span>Rust
            </li>
            <li class="flex items-center gap-2 font-mono text-caption tracking-mono text-muted">
              <span class="swatch swatch-muted" aria-hidden="true"></span>TypeScript
            </li>
            <li class="flex items-center gap-2 font-mono text-caption tracking-mono text-muted">
              <span class="swatch swatch-soft" aria-hidden="true"></span>Java
            </li>
            <li class="flex items-center gap-2 font-mono text-caption tracking-mono text-muted">
              <span class="swatch swatch-dash" aria-hidden="true"></span>Other
            </li>
          </ul>
        </div>
      </div>

      <div class="reveal-card mt-8 rounded-md bg-surface p-5 shadow-border sm:p-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="font-mono text-caption tracking-mono text-accent">{{ pulse.forHiringManagers.title }}</p>
            <p class="mt-1 max-w-prose font-serif text-small text-muted">A quick map of the ways I help a project move from idea to a dependable release.</p>
          </div>
          <span class="font-mono text-caption tracking-mono text-muted">work profile / 04</span>
        </div>
        <div class="mt-6">
          <app-contribution-chart />
        </div>
      </div>

      <ol class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        @for (phase of pulse.phases; track phase.era; let i = $index) {
          <li [class]="i === pulse.phases.length - 1 ? 'reveal-card rounded-md bg-surface p-5 shadow-border-hover' : 'reveal-card rounded-md bg-surface p-5 shadow-border'">
            <p class="font-mono text-caption tracking-mono text-accent">
              {{ phase.era }}
              @if (i === pulse.phases.length - 1) {
                <span class="text-fg/20"> · </span>
                <span>next</span>
              }
            </p>
            <h3 class="mt-2 font-serif text-subhead font-normal text-fg">{{ phase.title }}</h3>
            <p class="mt-2 font-serif text-small text-muted">{{ phase.body }}</p>
          </li>
        }
      </ol>

      <p class="mt-6 max-w-prose font-serif text-caption text-muted">{{ pulse.note }}</p>
    </section>
  `,
})
export class PulseComponent {
  protected readonly pulse = PULSE;
  protected readonly ui = UI;
}

export default PulseComponent;
