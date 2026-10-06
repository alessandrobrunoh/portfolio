import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, computed, inject, viewChild } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";

import { CONTRIBUTIONS, EDUCATION, PROFILE, STACK, UI, lang } from "../lib/site";

@Component({
  selector: "app-intro",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent],

  template: `
    <section id="intro" class="scroll-mt-16">
      <div class="hero">
        <!-- A fine engineering grid behind the mark (with a slow blue pulse), plus two pale discs. -->
        <div class="hero-backdrop" aria-hidden="true">
          <span class="hero-shape hero-shape-a"></span>
          <span class="hero-shape hero-shape-b"></span>
          <!-- The grid answers the pointer: a blue lens follows it and the cells it crosses light up and fade. -->
          <div class="hero-grid">
            <div #plane class="hero-grid-plane">
              <span class="hero-grid-pulse"></span>
              <span class="hero-grid-lens"></span>
            </div>
          </div>
        </div>

        <div class="container-x hero-inner">
          <div class="hero-copy min-w-0">

            <h1>
              <span class="sr-only">{{ profile.name }} — </span>
              <span class="hero-title">
                <span class="line"><span>{{ role().main }}</span></span>
                @if (role().sub) {
                  <span class="line sub"><span>{{ role().sub }}<span class="brand-dot">.</span></span></span>
                }
              </span>
            </h1>

            <p class="hero-lede stagger-in">{{ profile.headline }}</p>

            <div class="stagger-in flex flex-wrap items-center gap-2.5">
              <a href="#work" class="btn btn-primary">
                {{ lang() === 'it' ? 'Guarda i lavori' : 'View work' }}
                <svg appIcon="arrow-right" class="size-4"></svg>
              </a>
              <a href="/alessandro-bruno-cv.pdf" download class="btn btn-ghost">
                <svg appIcon="download" class="size-4"></svg>
                {{ lang() === 'it' ? 'Scarica il CV' : 'Download CV' }}
              </a>
            </div>

          </div>

          <!-- Full logo: the soft monogram with the wordmark set live in Inter under it. -->
          <div class="hero-mark" aria-hidden="true">
            <span class="hero-mark-float">
              <img class="hero-mark-img" src="/brand/ab-monogram.webp" alt="" width="960" height="666" fetchpriority="high" />
            </span>
            <span class="hero-mark-wordmark brand-wordmark">{{ profile.name }}</span>
          </div>
        </div>

        <!-- The first screen is exactly one viewport; this cue says there is more below. -->
        <a href="#proof" class="hero-scroll" [attr.aria-label]="lang() === 'it' ? 'Scorri al contenuto' : 'Scroll to content'">
          <span class="hero-scroll-track" aria-hidden="true"><span></span></span>
          <span aria-hidden="true">{{ lang() === 'it' ? 'Scorri' : 'Scroll' }}</span>
        </a>
      </div>

      <!-- Proof, not adjectives: each fact matches the CV and links to its source. -->
      <div id="proof" class="container-x scroll-mt-16 pt-6">
        <dl class="hero-proof reveal-on-scroll">
          <div>
            <dt class="eyebrow">{{ lang() === 'it' ? 'In produzione' : 'In production' }}</dt>
            <dd class="value">{{ lang() === 'it' ? '1+ anno' : '1+ year' }}</dd>
            <dd class="note">{{ lang() === 'it' ? 'backend, web e mobile in ' : 'backend, web and mobile at ' }}{{ profile.company.name }}</dd>
          </div>
          @if (published; as c) {
            <div>
              <dt class="eyebrow">{{ lang() === 'it' ? 'Crate pubblicato' : 'Published crate' }}</dt>
              <dd class="value"><a [href]="c.href" target="_blank" rel="noreferrer">{{ c.title }}</a></dd>
              <dd class="note">{{ lang() === 'it' ? 'ORM open source su crates.io' : 'open-source ORM on crates.io' }}</dd>
            </div>
          }
          <div>
            <dt class="eyebrow">{{ lang() === 'it' ? 'Tesi' : 'Thesis' }}</dt>
            <dd class="value">PETRA</dd>
            <dd class="note">{{ lang() === 'it' ? 'telemetria e analisi in tempo reale' : 'real-time telemetry and analysis' }}</dd>
          </div>
        </dl>
      </div>

      <!--
        The working set, not a badge wall: two marquees of the real stack, the top one running left,
        the bottom one right. Each row holds its sequence twice so a -50% loop is seamless; hovering
        the band pauses it, hovering a word swaps it between solid and outline.
      -->
      <div class="tech-band mt-16" [attr.aria-label]="lang() === 'it' ? 'Tecnologie' : 'Technologies'" role="group">
        @for (row of techRows(); track $index; let odd = $odd) {
          <div class="tech-row" [class.is-ghost]="odd">
            @for (copy of [0, 1]; track copy) {
              <div class="tech-seq" [attr.aria-hidden]="copy === 1 ? 'true' : null">
                @for (t of row; track $index) { <span>{{ t }}</span> }
              </div>
            }
          </div>
        }
      </div>

      <div class="container-x section">
        <app-section-head n="01" [title]="ui.sectionTitles.intro" [kicker]="lang() === 'it' ? 'chi sono' : 'about'" [bare]="true">
          <p class="about-bio lg:mt-9">{{ profile.bio }}</p>
          <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
            <p class="text-small text-muted">{{ education.degree }} · {{ education.school }}, 2026</p>
            @if (education.thesisHref) {
              <a [href]="education.thesisHref" target="_blank" rel="noreferrer" class="text-small font-medium text-accent hover:underline">
                {{ ui.readThesis }}
              </a>
            }
          </div>
        </app-section-head>
      </div>
    </section>
  `,
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  protected readonly profile = PROFILE;
  protected readonly education = EDUCATION;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected get published() {
    return CONTRIBUTIONS.find((c) => c.status === "Published");
  }
  /** Languages and frameworks on one row, infrastructure on the other (each list once; the template doubles it). */
  protected readonly techRows = computed(() => {
    lang();
    const split = (list: string, sep: string) => list.split(sep).map((t) => t.trim()).filter(Boolean);
    const [infra, ...code] = [...STACK.groups].reverse();
    const first = code.reverse().flatMap((g) => [...split(g.name, "&"), ...split(g.items, "·")]);
    const second = [...split(infra.items, "·"), ...split(infra.also ?? "", ",")];
    return [[...new Set(first)], [...new Set(second)]];
  });
  /** "Software Engineer — Systems & Product" sets as two display lines; the second ends on the logo dot. */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly plane = viewChild<ElementRef<HTMLElement>>("plane");
  private cleanup: (() => void) | null = null;

  /**
   * Grid hover: the lens follows the pointer (CSS vars on the plane) and every 64px cell the pointer
   * enters gets a short-lived highlight that fades out, leaving a trail. Mouse and pen only.
   */
  ngAfterViewInit() {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = this.host.nativeElement.querySelector<HTMLElement>(".hero");
    const plane = this.plane()?.nativeElement;
    if (!hero || !plane) return;
    let lastCell = "";
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = plane.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      plane.style.setProperty("--mx", `${x}px`);
      plane.style.setProperty("--my", `${y}px`);
      plane.classList.add("is-hovering");
      const cx = Math.floor(x / 64);
      const cy = Math.floor(y / 64);
      const key = `${cx}:${cy}`;
      if (key === lastCell) return;
      lastCell = key;
      const cell = document.createElement("span");
      cell.className = "grid-cell";
      cell.style.left = `${cx * 64}px`;
      cell.style.top = `${cy * 64}px`;
      cell.addEventListener("animationend", () => cell.remove(), { once: true });
      plane.appendChild(cell);
    };
    const leave = () => {
      plane.classList.remove("is-hovering");
      lastCell = "";
    };
    this.zone.runOutsideAngular(() => {
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
    });
    this.cleanup = () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }

  ngOnDestroy() {
    this.cleanup?.();
  }


  protected readonly role = computed(() => {
    lang();
    const [main, sub] = PROFILE.role.split(" — ");
    return { main, sub: sub ?? "" };
  });
}
