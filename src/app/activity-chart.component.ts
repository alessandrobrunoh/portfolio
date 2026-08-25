import { AfterViewInit, Component, ElementRef, OnDestroy, computed, inject, signal } from "@angular/core";
import { CHART, indexFromFraction, niceTicks, plotHeight, xAt, yAt } from "./pulse-chart.util";
import { GITHUB_STATS } from "../lib/github-stats";

const SERIES = GITHUB_STATS.series;
/** Rounded up from the real peak so the tallest bar never touches the frame. */
const DOMAIN_MAX = niceTicks(Math.max(...SERIES.map((row) => row.contributions)));
const GRID_TICKS = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(DOMAIN_MAX * fraction));
const BAR_WIDTH = 14;

@Component({
  selector: "app-activity-chart",
  standalone: true,
  template: `
    <div class="chart-stage relative h-full w-full" [class.is-visible]="isVisible()" (mousemove)="onMove($event)" (mouseleave)="hoverIndex.set(null)">
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

        @for (row of series; track row.q; let i = $index) {
          <rect
            class="chart-bar"
            [style.animation-delay.ms]="i * 45"
            [attr.x]="xAt(i, series.length) - barWidth / 2"
            [attr.y]="yAt(row.contributions, domainMax)"
            [attr.width]="barWidth"
            [attr.height]="chart.padTop + plotH - yAt(row.contributions, domainMax)"
            rx="2"
            fill="var(--accent)"
            fill-opacity="0.4"
          />
        }

        <text [attr.x]="chart.padLeft" [attr.y]="chart.height - 2" font-size="8" fill="var(--muted)">{{ series[0].q }}</text>
        <text [attr.x]="chart.width - chart.padRight" [attr.y]="chart.height - 2" text-anchor="end" font-size="8" fill="var(--muted)">{{
          series[series.length - 1].q
        }}</text>

        @if (hoverIndex(); as i) {
          <line
            [attr.x1]="xAt(i, series.length)"
            [attr.x2]="xAt(i, series.length)"
            [attr.y1]="chart.padTop"
            [attr.y2]="chart.padTop + plotH"
            stroke="var(--accent)"
            stroke-opacity="0.35"
          />
        }
      </svg>

      @if (hoverIndex(); as i) {
        <div
          class="pointer-events-none absolute top-2 -translate-x-1/2 rounded-md bg-surface px-3 py-2 shadow-dialog"
          [style.left.%]="hoverLeftPct()"
        >
          <p class="font-mono text-caption tracking-mono text-accent">
            {{ series[i].q }}{{ series[i].q === now ? " · now" : "" }}
          </p>
          <p class="mt-1 font-serif text-small tabular-nums text-fg">Contributions <span class="text-muted">{{ series[i].contributions }}</span></p>
        </div>
      }
    </div>
  `,
})
export class ActivityChartComponent implements AfterViewInit, OnDestroy {
  protected readonly series = SERIES;
  protected readonly now = GITHUB_STATS.now;
  protected readonly chart = CHART;
  protected readonly plotH = plotHeight;
  protected readonly domainMax = DOMAIN_MAX;
  protected readonly ticks = GRID_TICKS;
  protected readonly barWidth = BAR_WIDTH;
  protected readonly viewBox = `0 0 ${CHART.width} ${CHART.height}`;
  protected readonly xAt = xAt;
  protected readonly yAt = yAt;

  hoverIndex = signal<number | null>(null);
  isVisible = signal(false);
  private readonly host = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;
  hoverLeftPct = computed(() => {
    const i = this.hoverIndex();
    if (i === null) return 0;
    return (xAt(i, this.series.length) / CHART.width) * 100;
  });

  ngAfterViewInit() {
    if (!("IntersectionObserver" in window)) {
      this.isVisible.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.isVisible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  onMove(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const box = el.getBoundingClientRect();
    const fraction = (event.clientX - box.left) / box.width;
    this.hoverIndex.set(indexFromFraction(fraction, this.series.length));
  }
}
