import { Component } from "@angular/core";
import { PULSE } from "../lib/site";

/**
 * Four statements about how I work. Deliberately not a chart: a self-assigned
 * percentage is not evidence of anything, and next to real GitHub data it only
 * makes the real numbers look softer than they are.
 */
@Component({
  selector: "app-contribution-chart",
  standalone: true,
  template: `
    <ul class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      @for (point of points; track point.label) {
        <li class="reveal-on-scroll border-l-2 border-accent/30 pl-4">
          <p class="font-mono text-caption tracking-mono text-accent">{{ point.label }}</p>
          <p class="mt-1.5 font-serif text-small leading-6 text-muted">{{ point.detail }}</p>
        </li>
      }
    </ul>
  `,
})
export class ContributionChartComponent {
  protected readonly points = PULSE.forHiringManagers.points;
}
