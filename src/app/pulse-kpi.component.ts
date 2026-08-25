import { Component, ElementRef, OnDestroy, OnInit, inject, input, signal } from "@angular/core";

@Component({
  selector: "app-pulse-kpi",
  standalone: true,
  template: `
    <div class="reveal-card rounded-md bg-surface px-5 py-5 shadow-border">
      <p class="font-mono text-caption tracking-mono text-accent">{{ label() }}</p>
      <p class="mt-2 font-display text-heading-sm text-fg">
        @if (value() != null) {
          <span class="tabular-nums">{{ counted().toLocaleString("en-US") }}</span>
        } @else {
          {{ display() }}
        }
      </p>
      <p class="mt-1 font-serif text-caption text-muted">{{ hint() }}</p>
    </div>
  `,
})
export class PulseKpiComponent implements OnInit, OnDestroy {
  label = input.required<string>();
  hint = input.required<string>();
  value = input<number | undefined>();
  display = input<string | undefined>();

  counted = signal(0);
  private io: IntersectionObserver | null = null;
  private frame = 0;
  private host = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    const target = this.value() ?? 0;
    if (target === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      this.counted.set(target);
      return;
    }
    this.io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.io?.disconnect();
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          this.counted.set(Math.round(target * eased));
          if (t < 1) this.frame = requestAnimationFrame(tick);
        };
        this.frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    this.io.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.io?.disconnect();
    cancelAnimationFrame(this.frame);
  }
}
