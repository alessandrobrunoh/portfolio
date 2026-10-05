import { Component, computed } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";

import { CONTRIBUTIONS, EDUCATION, PROFILE, UI, lang } from "../lib/site";

@Component({
  selector: "app-intro",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent],

  template: `
    <section id="intro" class="scroll-mt-16">
      <div class="hero">
        <div class="hero-backdrop" aria-hidden="true">
          <img class="hero-photo" src="/brand/hero-light.webp" alt="" width="1440" height="941" decoding="async" />
          <div class="hero-grid"></div>
        </div>

        <div class="container-x hero-inner">
          <div class="min-w-0">
            <p class="hero-meta stagger-in">
              <img [src]="profile.avatar" alt="" width="56" height="56" />
              <strong>{{ profile.company.name }}</strong>
              <span class="sep" aria-hidden="true"></span>
              <span>{{ profile.location }}</span>
            </p>

            <h1 class="stagger-in mt-9">
              <span class="hero-name brand-wordmark">{{ profile.name }}</span>
              <span class="hero-title">
                {{ role().main }}
                @if (role().sub) {
                  <span class="sub">{{ role().sub }}<span class="brand-dot">.</span></span>
                }
              </span>
            </h1>

            <p class="hero-lede stagger-in">{{ profile.headline }}</p>

            <div class="stagger-in mt-9 flex flex-wrap items-center gap-2.5">
              <a [href]="'mailto:' + profile.email" class="btn btn-primary">
                <svg appIcon="mail" class="size-4"></svg>
                {{ lang() === 'it' ? 'Scrivimi' : 'Email me' }}
              </a>
              <a href="/alessandro-bruno-cv.pdf" download class="btn btn-ghost">
                <svg appIcon="download" class="size-4"></svg>
                {{ lang() === 'it' ? 'Scarica il CV' : 'Download CV' }}
              </a>
              <a [href]="profile.github" target="_blank" rel="noreferrer" class="btn btn-quiet">
                <svg appIcon="github" class="size-4"></svg>
                GitHub
              </a>
            </div>

            <p class="stagger-in mt-7 flex max-w-xl items-start gap-3 text-small text-muted">
              <span class="live-dot mt-[0.45rem]" aria-hidden="true"></span>
              {{ profile.availability }}
            </p>
          </div>

          <div class="hero-mark" aria-hidden="true">
            <div class="hero-mark-glow"></div>
            <div class="hero-mark-frame">
              <img
                class="hero-mark-img"
                src="/brand/ab-monogram-metallic.webp"
                alt=""
                width="960"
                height="695"
                fetchpriority="high"
              />
              <span class="hero-mark-sheen"></span>
            </div>
          </div>
        </div>

        <!-- Proof, not adjectives: each fact matches the CV and links to its source. -->
        <div class="container-x">
          <dl class="hero-proof stagger-in">
            <div>
              <dt class="eyebrow">{{ lang() === 'it' ? 'Rust in produzione' : 'Production Rust' }}</dt>
              <dd class="value">{{ lang() === 'it' ? '1+ anno' : '1+ year' }}</dd>
              <dd class="note">{{ lang() === 'it' ? 'servizi event-driven in ' : 'event-driven services at ' }}{{ profile.company.name }}</dd>
            </div>
            @if (published; as c) {
              <div>
                <dt class="eyebrow">{{ lang() === 'it' ? 'Crate pubblicato' : 'Published crate' }}</dt>
                <dd class="value"><a [href]="c.href" target="_blank" rel="noreferrer">{{ c.title }}</a></dd>
                <dd class="note">{{ lang() === 'it' ? 'ORM Rust su crates.io' : 'Rust ORM on crates.io' }}</dd>
              </div>
            }
            <div>
              <dt class="eyebrow">{{ lang() === 'it' ? 'Tesi' : 'Thesis' }}</dt>
              <dd class="value">PETRA</dd>
              <dd class="note">{{ lang() === 'it' ? 'telemetria event-driven in tempo reale' : 'real-time event-driven telemetry' }}</dd>
            </div>
          </dl>
        </div>
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
  /** "Software Engineer — Rust / Backend" sets as two display lines; the second ends on the logo dot. */
  protected readonly role = computed(() => {
    lang();
    const [main, sub] = PROFILE.role.split(" — ");
    return { main, sub: sub ?? "" };
  });
}
