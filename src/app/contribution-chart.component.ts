import { Component } from "@angular/core";
import { PULSE } from "../lib/site";

const SCORES = [82, 68, 91, 76];

@Component({
  selector: "app-contribution-chart",
  standalone: true,
  template: `
    <div class="space-y-4" role="img" aria-label="Relative strengths across systems, product, tooling, and collaboration">
      @for (point of points; track point.label; let i = $index) {
        <div>
          <div class="mb-1.5 flex items-baseline justify-between gap-4">
            <span class="font-serif text-small text-fg">{{ point.label }}</span>
            <span class="font-mono text-caption tracking-mono text-accent">{{ scores[i] }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-fg/10">
            <div class="profile-bar h-full rounded-full bg-accent" [style.width.%]="scores[i]" [style.animation-delay.ms]="i * 90"></div>
          </div>
          <p class="mt-1 font-serif text-caption text-muted">{{ point.detail }}</p>
        </div>
      }
    </div>
  `,
})
export class ContributionChartComponent {
  protected readonly points = PULSE.forHiringManagers.points;
  protected readonly scores = SCORES;
}
