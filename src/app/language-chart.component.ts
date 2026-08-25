import { Component, computed, signal } from "@angular/core";
import { CHART, indexFromFraction, plotHeight, xAt, yAt } from "./pulse-chart.util";
import { PULSE } from "../lib/site";

const DOMAIN_MAX = 100;
const GRID_TICKS = [0, 25, 50, 75, 100];

function pathFor(values: readonly number[], count: number) {
  return values.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i, count).toFixed(2)},${yAt(v, DOMAIN_MAX).toFixed(2)}`).join(" ");
}

@Component({
  selector: "app-language-chart",
  standalone: true,
  template: `
    <div class="relative h-full w-full" (mousemove)="onMove($event)" (mouseleave)="hoverIndex.set(null)">
      <svg [attr.viewBox]="viewBox" preserveAspectRatio="none" class="h-full w-full">
        @for (tick of ticks; track tick) {
          <line
            class="chart-grid-line"
            [attr.x1]="chart.padLeft"
            [attr.x2]="chart.width - chart.padRight"
            [attr.y1]="yAt(tick, domainMax)"
            [attr.y2]="yAt(tick, domainMax)"
            stroke="var(--fg)"
            stroke-opacity="0.08"
          />
          <text [attr.x]="chart.padLeft - 4" [attr.y]="yAt(tick, domainMax) + 3" text-anchor="end" font-size="8" fill="var(--muted)">{{
            tick
          }}</text>
        }

        <line
          class="chart-now-line"
          [attr.x1]="nowX()"
          [attr.x2]="nowX()"
          [attr.y1]="chart.padTop"
          [attr.y2]="chart.padTop + plotH"
          stroke="var(--accent)"
          stroke-opacity="0.45"
          stroke-dasharray="2 6"
        />

        <path class="chart-line chart-line-soft" [attr.d]="javaPath" fill="none" stroke="var(--fg)" stroke-opacity="0.35" stroke-width="1.5" />
        <path class="chart-line chart-line-muted" [attr.d]="typescriptPath" fill="none" stroke="var(--muted)" stroke-width="1.5" />
        <path class="chart-line chart-line-accent" [attr.d]="rustPath" fill="none" stroke="var(--accent)" stroke-width="2" />

        @if (hoverIndex(); as i) {
          <line
            [attr.x1]="xAt(i, series.length)"
            [attr.x2]="xAt(i, series.length)"
            [attr.y1]="chart.padTop"
            [attr.y2]="chart.padTop + plotH"
            stroke="var(--accent)"
            stroke-opacity="0.35"
          />
          <circle class="chart-point" [attr.cx]="xAt(i, series.length)" [attr.cy]="yAt(series[i].rust, domainMax)" r="2.5" fill="var(--accent)" />
        }

        <text [attr.x]="chart.padLeft" [attr.y]="chart.height - 2" font-size="8" fill="var(--muted)">{{ series[0].q }}</text>
        <text [attr.x]="chart.width - chart.padRight" [attr.y]="chart.height - 2" text-anchor="end" font-size="8" fill="var(--muted)">{{
          series[series.length - 1].q
        }}</text>
      </svg>

      @if (hoverIndex(); as i) {
        <div
          class="pointer-events-none absolute top-2 -translate-x-1/2 rounded-md bg-surface px-3 py-2 shadow-dialog"
          [style.left.%]="hoverLeftPct()"
        >
          <p class="font-mono text-caption tracking-mono text-accent">{{ series[i].q }}{{ series[i].q === now ? " · now" : "" }}</p>
          <ul class="mt-1 space-y-0.5">
            <li class="font-serif text-small tabular-nums text-fg">Java <span class="text-muted">{{ series[i].java }}</span></li>
            <li class="font-serif text-small tabular-nums text-fg">TypeScript <span class="text-muted">{{ series[i].typescript }}</span></li>
            <li class="font-serif text-small tabular-nums text-fg">Rust <span class="text-muted">{{ series[i].rust }}</span></li>
          </ul>
        </div>
      }
    </div>
  `,
})
export class LanguageChartComponent {
  protected readonly series = PULSE.series;
  protected readonly now = PULSE.now;
  protected readonly chart = CHART;
  protected readonly plotH = plotHeight;
  protected readonly domainMax = DOMAIN_MAX;
  protected readonly ticks = GRID_TICKS;
  protected readonly viewBox = `0 0 ${CHART.width} ${CHART.height}`;
  protected readonly xAt = xAt;
  protected readonly yAt = yAt;

  protected readonly javaPath = pathFor(
    this.series.map((r) => r.java),
    this.series.length,
  );
  protected readonly typescriptPath = pathFor(
    this.series.map((r) => r.typescript),
    this.series.length,
  );
  protected readonly rustPath = pathFor(
    this.series.map((r) => r.rust),
    this.series.length,
  );

  hoverIndex = signal<number | null>(null);
  hoverLeftPct = computed(() => {
    const i = this.hoverIndex();
    if (i === null) return 0;
    return (xAt(i, this.series.length) / CHART.width) * 100;
  });

  private nowIndex = this.series.findIndex((row) => row.q === PULSE.now);
  nowX = computed(() => xAt(this.nowIndex, this.series.length));

  onMove(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const box = el.getBoundingClientRect();
    const fraction = (event.clientX - box.left) / box.width;
    this.hoverIndex.set(indexFromFraction(fraction, this.series.length));
  }
}
