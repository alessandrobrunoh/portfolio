import { Component, ElementRef, ErrorHandler, Injector, OnDestroy, afterNextRender, computed, inject, signal, viewChild } from "@angular/core";
import { SectionHeadComponent } from "./section-head.component";
import { PRINCIPLES, UI, lang } from "../lib/site";

/** Node positions on the 1000×64 wave: each sits at the centre of its column, rising to the last. */
const NODES: readonly [number, number][] = [
  [100, 50],
  [300, 28],
  [500, 44],
  [700, 22],
  [900, 10],
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
      <app-section-head n="04" [title]="ui.sectionTitles.approach" [kicker]="lang() === 'it' ? 'dal problema alla consegna' : 'from problem to delivery'">
        <p class="section-lede">
          {{
            lang() === 'it'
              ? 'Prima capisco, poi pianifico. Costruisco per piccoli passi, rivedo ogni modifica e condivido il contesto: un percorso che funziona con stack e team diversi.'
              : 'Understand first, then plan. Build in small steps, review every change and share the context: a workflow that travels across stacks and teams.'
          }}
        </p>
      </app-section-head>

      <div class="journey reveal-on-scroll" [class.has-selection]="open() !== null">
        <nav class="journey-path" [attr.aria-label]="lang() === 'it' ? 'Il mio modo di lavorare' : 'How I work'">
          <svg class="journey-wave" viewBox="0 0 1000 64" preserveAspectRatio="none" aria-hidden="true">
            <path class="journey-wave-base" [attr.d]="path" />
            <path class="journey-wave-line" [attr.d]="path" pathLength="1" />
          </svg>
          <span class="journey-active-node" [class.is-visible]="open() !== null" [style.left.%]="(open() ?? 0) * 20 + 10" [style.top.px]="nodes[open() ?? 0][1]" aria-hidden="true"></span>
          <ol class="journey-steps">
            @for (p of principles; track $index; let i = $index) {
              <li class="journey-step" [class.is-active]="open() === i">
                <button type="button" class="journey-hit" [id]="'journey-checkpoint-' + i" (click)="select(i)" [disabled]="transitioning()" [attr.aria-expanded]="open() === i" aria-controls="journey-stage">
                  <span class="journey-node" [style.top.px]="nodes[i][1]" aria-hidden="true"><span>0{{ i + 1 }}</span></span>
                  <span class="journey-tag">{{ p.tag }}</span>
                </button>
              </li>
            }
          </ol>
        </nav>

        <div #stage id="journey-stage" class="journey-stage" [attr.aria-busy]="transitioning()" [style.--journey-direction]="direction()" [style.--journey-origin]="((open() ?? 2) - 2) * 24 + 'px'">
          @if (selected(); as selected) {
            @for (index of [open()]; track index) {
              <article class="journey-detail-card" aria-labelledby="journey-detail-title">
                <div class="journey-detail-topline">
                  <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ selected.tag }}</p>
                  <button type="button" class="journey-close" (click)="close()" [disabled]="transitioning()" [attr.aria-label]="lang() === 'it' ? 'Torna a tutti i checkpoint' : 'Back to all checkpoints'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
                  </button>
                </div>
                <div class="journey-detail-layout">
                  <div class="journey-detail-intro">
                    <h3 #detailTitle id="journey-detail-title" tabindex="-1">{{ selected.title }}</h3>
                    <p>{{ selected.detail }}</p>
                  </div>
                  <div class="journey-practice">
                    <p class="eyebrow">{{ lang() === 'it' ? 'In pratica' : 'In practice' }}</p>
                    <ol>
                      @for (item of selected.practice; track item; let i = $index) {
                        <li><span aria-hidden="true">0{{ i + 1 }}</span><p>{{ item }}</p></li>
                      }
                    </ol>
                  </div>
                </div>
                <div class="journey-detail-footer">
                  <span class="meta-mono">0{{ (open() ?? 0) + 1 }} / 0{{ principles.length }}</span>
                  <div class="flex gap-2">
                    <button type="button" class="journey-close" [disabled]="transitioning()" (click)="go(-1)" [attr.aria-label]="lang() === 'it' ? 'Checkpoint precedente' : 'Previous checkpoint'">←</button>
                    <button type="button" class="journey-close" [disabled]="transitioning()" (click)="go(1)" [attr.aria-label]="lang() === 'it' ? 'Checkpoint successivo' : 'Next checkpoint'">→</button>
                  </div>
                </div>
              </article>
            }
          } @else {
            <div class="journey-overview">
              @for (p of principles; track $index; let i = $index) {
                <button type="button" class="journey-summary" (click)="select(i)" [disabled]="transitioning()" aria-controls="journey-stage">
                  <span class="journey-title">{{ p.title }}</span>
                  <span class="journey-body">{{ p.body }}</span>
                  <span class="journey-more">{{ lang() === 'it' ? 'Esplora' : 'Explore' }}<span aria-hidden="true">↗</span></span>
                </button>
              }
            </div>
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
  private readonly errorHandler = inject(ErrorHandler);
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
        if (element) element.scrollTop = 0;
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
      if (!(error instanceof DOMException && error.name === "AbortError")) this.errorHandler.handleError(error);
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.animation?.cancel();
  }
}
