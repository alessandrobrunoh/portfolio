import { Component } from "@angular/core";
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

/**
 * "How I work" as a journey: a soft wave runs through five steps and rises toward the last.
 * When the section is seen, the wave draws itself, each node lights up in turn and its text
 * fades in; the final step keeps a gentle glow. Narrow screens get a swipeable track.
 */
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

        <div class="journey-scroller">
          <div class="journey-track">
            <svg class="journey-wave" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true">
              <path class="journey-wave-base" [attr.d]="path" />
              <path class="journey-wave-line" [attr.d]="path" pathLength="1" />
            </svg>
            <ol class="journey-steps">
              @for (p of principles; track p.title; let i = $index; let last = $last) {
                <li class="journey-step" [style.--i]="i" [class.is-last]="last">
                  <span class="journey-node" [style.top.px]="nodes[i][1]" aria-hidden="true"></span>
                  <p class="journey-tag">{{ p.tag }}</p>
                  <h3 class="journey-title">{{ p.title }}</h3>
                  <p class="journey-body">{{ p.body }}</p>
                </li>
              }
            </ol>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ApproachComponent {
  protected readonly principles = PRINCIPLES;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly nodes = NODES;
  protected readonly path = wavePath(NODES);
}
