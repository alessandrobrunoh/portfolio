import { Component, ElementRef, Injector, OnDestroy, afterNextRender, computed, inject, signal, viewChild } from "@angular/core";
import { SectionHeadComponent } from "./section-head.component";
import { PRINCIPLES, UI, lang } from "../lib/site";

/** Node positions on the 1000×140 wave: each sits at the start of its column, rising to the last. */
const NODES: readonly [number, number][] = [
  [14, 104],
  [214, 58],
  [414, 92],
  [614, 46],
  [814, 22],
];

/** A smooth curve through the nodes (Catmull-Rom → cubic Bézier), extended to both edges. */
function wavePath(points: readonly [number, number][]): string {
  const pts: [number, number][] = [[0, points[0][1] + 6], ...points, [1000, points[points.length - 1][1] - 6]];
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

@Component({
  selector: "app-approach",
  standalone: true,
  imports: [SectionHeadComponent],
  template: `
    <section id="approach" class="container-x section scroll-mt-16">
      <app-section-head n="04" [title]="ui.sectionTitles.approach" [kicker]="lang() === 'it' ? 'principi / pratica' : 'principles / practice'">
        <p class="section-lede">
          {{
            lang() === 'it'
              ? 'Gli strumenti cambiano da un cliente all’altro. Il modo di lavorare no: è quello che porto in ogni team e in ogni sistema.'
              : 'Tools change from one client to the next. The way of working does not: it is what I bring into every team and every system.'
          }}
        </p>
      </app-section-head>

      <div class="journey reveal-on-scroll">
        <!-- Misty waves and a soft sphere: the same quiet shapes as the brand, no imagery. -->
        <svg class="journey-mist" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 170 C 220 120, 420 210, 640 160 S 1000 110, 1200 150 L 1200 260 L 0 260 Z" />
          <path d="M0 210 C 260 170, 520 240, 760 200 S 1060 170, 1200 195 L 1200 260 L 0 260 Z" />
        </svg>
        <span class="journey-sphere" aria-hidden="true"></span>

        <div #stage id="journey-stage" class="journey-stage" [attr.aria-busy]="transitioning()" [style.--journey-direction]="direction()">
          @if (selected(); as s) {
            <div class="journey-focus">
              <div class="journey-focus-toolbar">
                <button type="button" class="journey-back" (click)="close()" [disabled]="transitioning()">
                  <span aria-hidden="true">←</span>
                  {{ lang() === 'it' ? 'Tutti i checkpoint' : 'All checkpoints' }}
                </button>
                <span class="meta-mono">0{{ (open() ?? 0) + 1 }} / 0{{ principles.length }}</span>
              </div>
              <nav class="journey-checkpoints" [attr.aria-label]="lang() === 'it' ? 'Checkpoint' : 'Checkpoints'" [style.--checkpoint-count]="principles.length" [style.--checkpoint-index]="open()">
                <span class="journey-checkpoint-indicator" aria-hidden="true"></span>
                @for (p of principles; track $index; let i = $index) {
                  <button type="button" class="journey-checkpoint" [class.is-active]="open() === i" [attr.aria-pressed]="open() === i" [attr.aria-label]="'0' + (i + 1) + ' · ' + p.tag" aria-controls="journey-description" [disabled]="transitioning()" (click)="select(i)">
                    <span class="journey-checkpoint-number">0{{ i + 1 }}</span>
                    <span class="journey-checkpoint-label">{{ p.tag }}</span>
                  </button>
                }
              </nav>
              @for (index of [open()]; track index) {
                <article id="journey-description" class="journey-detail-card" aria-labelledby="journey-detail-title">
                  <div class="journey-detail-heading">
                    <span class="journey-detail-number" aria-hidden="true">0{{ (open() ?? 0) + 1 }}</span>
                    <div>
                      <p class="journey-tag">{{ s.tag }}</p>
                      <h3 #detailTitle id="journey-detail-title" tabindex="-1" class="mt-3 text-title font-semibold tracking-tight text-fg">{{ s.title }}</h3>
                    </div>
                  </div>
                  <div class="journey-detail-copy">
                    <p class="text-lede text-muted">{{ s.detail }}</p>
                    <div class="journey-practice">
                      <p class="eyebrow">{{ lang() === 'it' ? 'In pratica' : 'In practice' }}</p>
                      <ol>
                        @for (item of s.practice; track item; let i = $index) {
                          <li><span aria-hidden="true">0{{ i + 1 }}</span><p>{{ item }}</p></li>
                        }
                      </ol>
                    </div>
                  </div>
                </article>
              }
              <div class="journey-focus-footer">
                <button type="button" class="journey-back" [disabled]="transitioning()" (click)="go(-1)"><span aria-hidden="true">←</span>{{ lang() === 'it' ? 'Precedente' : 'Previous' }}</button>
                <button type="button" class="journey-back" [disabled]="transitioning()" (click)="go(1)">{{ lang() === 'it' ? 'Successivo' : 'Next' }}<span aria-hidden="true">→</span></button>
              </div>
            </div>
          } @else {
            <div class="journey-scroller">
              <div class="journey-track">
                <svg class="journey-wave" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true">
                  <path class="journey-wave-base" [attr.d]="path" />
                  <path class="journey-wave-line" [attr.d]="path" pathLength="1" />
                </svg>
                <ol class="journey-steps">
                  @for (p of principles; track p.title; let i = $index; let last = $last) {
                    <li class="journey-step" [style.--i]="i" [class.is-last]="last">
                      <button
                        type="button"
                        class="journey-hit"
                        (click)="select(i)"
                        [disabled]="transitioning()"
                        [id]="'journey-checkpoint-' + i"
                            aria-controls="journey-stage"
                      >
                        <span class="journey-node" [style.top.px]="nodes[i][1]" aria-hidden="true"></span>
                        <span class="journey-tag">{{ p.tag }}</span>
                        <span class="journey-title">{{ p.title }}</span>
                        <span class="journey-body">{{ p.body }}</span>
                        <span class="journey-more">
                          {{ lang() === 'it' ? 'Scopri di più' : 'Read more' }}
                          <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                        </span>
                      </button>
                    </li>
                  }
                </ol>
              </div>
            </div>

            <p class="journey-hint">{{ lang() === 'it' ? 'Scegli un checkpoint per esplorare il mio modo di lavorare.' : 'Choose a checkpoint to explore how I work.' }}</p>
          }
        </div>
      </div>
    </section>
  `,
})
export class ApproachComponent implements OnDestroy {
  protected readonly principles = PRINCIPLES;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly nodes = NODES;
  protected readonly path = wavePath(NODES);

  /** The step whose details are open, or null. */
  protected readonly open = signal<number | null>(null);
  protected readonly selected = computed(() => {
    lang();
    const i = this.open();
    return i === null ? null : this.principles[i];
  });

  protected readonly direction = signal(1);
  protected readonly transitioning = signal(false);
  private readonly stage = viewChild<ElementRef<HTMLElement>>("stage");
  private readonly detailTitle = viewChild<ElementRef<HTMLElement>>("detailTitle");
  private readonly injector = inject(Injector);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private animation: Animation | null = null;
  private destroyed = false;

  protected select(index: number) {
    if (index === this.open() || this.transitioning()) return;
    void this.changeView(index);
  }

  protected close() {
    if (this.transitioning()) return;
    void this.changeView(null);
  }

  protected go(delta: number) {
    const count = this.principles.length;
    const index = (((this.open() ?? 0) + delta) % count + count) % count;
    if (this.transitioning()) return;
    void this.changeView(index, delta);
  }

  private async changeView(index: number | null, movement?: number) {
    const previous = this.open();
    const direction = movement ?? (index === null ? -1 : index - (previous ?? -1));
    this.direction.set(direction < 0 ? -1 : 1);
    this.transitioning.set(true);
    const element = this.stage()?.nativeElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      if (element && !reducedMotion) {
        this.animation = element.animate(
          [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: `translateX(${-this.direction() * 24}px)` }],
          { duration: 160, easing: "ease-in", fill: "forwards" },
        );
        await this.animation.finished;
      }
      if (this.destroyed) return;
      this.open.set(index);
      afterNextRender(() => {
        this.animation?.cancel();
        this.animation = null;
        this.transitioning.set(false);
        if (index === null) {
          this.host.nativeElement.querySelector<HTMLElement>(`#journey-checkpoint-${previous}`)?.focus({ preventScroll: true });
        } else {
          this.detailTitle()?.nativeElement.focus({ preventScroll: true });
        }
      }, { injector: this.injector });
    } catch (error) {
      this.animation?.cancel();
      this.animation = null;
      this.transitioning.set(false);
      if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.animation?.cancel();
  }
}
