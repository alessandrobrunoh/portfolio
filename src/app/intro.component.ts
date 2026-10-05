import { Component, computed, output, signal } from "@angular/core";
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
          <div class="hero-grid"><span class="hero-grid-pulse"></span></div>
        </div>

        <div class="container-x hero-inner">
          <div class="hero-copy min-w-0">
            <!--
              Easter egg: the pill is a switch. Hover or focus slides the avatar to the right like a
              toggle knob and reveals a play glyph; clicking opens the mini-game.
            -->
            <button
              type="button"
              class="hero-meta hero-switch stagger-in"
              [class.is-on]="switched()"
              (click)="play()"
              [attr.aria-label]="(lang() === 'it' ? 'Easter egg: gioca a un minigioco — ' : 'Easter egg: play a mini-game — ') + profile.company.name + ', ' + profile.location"
            >
              <span class="hero-switch-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="size-3.5" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
              </span>
              <span class="hero-switch-text">
                <strong>{{ profile.company.name }}</strong>
                <span class="sep" aria-hidden="true"></span>
                <span>{{ profile.location }}</span>
              </span>
              <img class="hero-switch-knob" [src]="profile.avatar" alt="" width="56" height="56" />
            </button>

            <h1>
              <span class="eyebrow hero-eyebrow">Software · Systems · Product</span>
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
              <a [href]="profile.github" target="_blank" rel="noreferrer" class="btn btn-quiet" aria-label="GitHub">
                <svg appIcon="github" class="size-4"></svg>
                <span class="hidden sm:inline" aria-hidden="true">GitHub</span>
              </a>
            </div>

            <p class="hero-availability stagger-in">
              <span class="live-dot mt-[0.45rem]" aria-hidden="true"></span>
              {{ profile.availability }}
            </p>
          </div>

          <!-- Full logo: the soft monogram with the wordmark set live in Inter under it. -->
          <div class="hero-mark" aria-hidden="true">
            <!-- Soft mark on light; the white variant on dark, as the brand asks for dark sections. -->
            <span class="hero-mark-float">
              <img class="hero-mark-img dark:hidden" src="/brand/ab-monogram.webp" alt="" width="960" height="666" fetchpriority="high" />
              <img class="hero-mark-img hidden dark:block" src="/brand/ab-monogram-white.webp" alt="" width="480" height="333" />
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
            <dd class="note">{{ lang() === 'it' ? 'servizi event-driven in ' : 'event-driven services at ' }}{{ profile.company.name }}</dd>
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
            <dd class="note">{{ lang() === 'it' ? 'telemetria event-driven in tempo reale' : 'real-time event-driven telemetry' }}</dd>
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
export class IntroComponent {
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
  /** Stays "on" after a click so the knob rests on the right while the game is open. */
  protected readonly switched = signal(false);
  readonly playRequested = output<void>();

  protected play() {
    this.switched.set(true);
    this.playRequested.emit();
  }

  /** Called by the page when the game closes. */
  reset() {
    this.switched.set(false);
  }

  protected readonly role = computed(() => {
    lang();
    const [main, sub] = PROFILE.role.split(" — ");
    return { main, sub: sub ?? "" };
  });
}
