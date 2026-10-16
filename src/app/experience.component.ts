import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { SpotlightDirective } from "./spotlight.directive";
import { CASES, COMPANY, EDUCATION, ROLES, UI, lang } from "../lib/site";

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [IconComponent, RouterLink, SectionHeadComponent, SpotlightDirective],
  template: `
    <section id="experience" class="container-x section scroll-mt-16">
      <app-section-head
        n="02"
        [title]="ui.sectionTitles.experience"
        [kicker]="lang() === 'it' ? 'In produzione · Luna S.r.l.' : 'In production · Luna S.r.l.'"
      >
        <p class="section-lede">{{ company.summary }}</p>
      </app-section-head>

      <!-- Split Sticky Architecture: Left Sticky Company Summary + Right Vertical Timeline -->
      <div class="exp-split">
        <!-- Left Sticky Column: Company Overview + Featured Client Case Study -->
        <aside class="exp-sidebar reveal-on-scroll">
          <div class="exp-company-card card" appSpotlight>
            <div class="flex items-center justify-between gap-3">
              <span class="badge-soft">
                <span class="live-dot" aria-hidden="true"></span>
                <span>{{ company.name }}</span>
              </span>
              <span class="font-mono text-caption text-faint">{{ company.location }}</span>
            </div>

            <h3 class="mt-5 text-title font-semibold tracking-tight text-fg">
              {{ lang() === 'it' ? 'Ingegneria a contatto con il cliente' : 'Client-facing production engineering' }}<span class="brand-dot" aria-hidden="true">.</span>
            </h3>
            <p class="mt-2.5 text-small text-muted leading-relaxed">
              {{
                lang() === 'it'
                  ? 'Dal design di architetture event-driven in Rust alle console operatore in Spring Boot e React, fino a piattaforme fleet con aggiornamenti live.'
                  : 'From designing event-driven Rust architectures to Spring Boot + React operator consoles and live fleet platforms.'
              }}
            </p>

            <div class="exp-kpi-strip mt-5">
              <div>
                <span class="exp-kpi-val">5–10</span>
                <span class="exp-kpi-lbl">{{ lang() === 'it' ? 'Team di sviluppo' : 'Engineering team' }}</span>
              </div>
              <div>
                <span class="exp-kpi-val">~200</span>
                <span class="exp-kpi-lbl">{{ lang() === 'it' ? 'Mezzi attivi live' : 'Active fleet vehicles' }}</span>
              </div>
            </div>

            @if (featuredCase(); as c) {
              <a [routerLink]="['/work', c.id]" class="exp-case-spotlight mt-5">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-micro uppercase tracking-wider text-accent">
                    {{ lang() === 'it' ? 'Caso di studio tecnico' : 'Technical Case Study' }}
                  </span>
                  <svg appIcon="arrow-up-right" class="size-4 text-accent"></svg>
                </div>
                <p class="mt-1.5 text-small font-semibold text-fg">{{ c.title }}</p>
                <p class="mt-1 text-caption text-muted line-clamp-2">{{ c.blurb }}</p>
              </a>
            }
          </div>
        </aside>

        <!-- Right Column: Clean Vertical Timeline Rail with Milestone Nodes -->
        <ol class="exp-timeline">
          @for (role of roles(); track role.title; let i = $index) {
            <li class="exp-timeline-item reveal-on-scroll" [class.is-current]="role.current">
              <span class="exp-timeline-node" aria-hidden="true"></span>

              <div class="exp-timeline-meta">
                @if (role.current) {
                  <span class="pill-now">
                    <span class="live-dot" aria-hidden="true"></span>
                    <span>{{ lang() === 'it' ? 'Ruolo attuale' : 'Current role' }}</span>
                  </span>
                }
                <span class="font-mono text-caption font-medium text-fg">{{ role.dates }}</span>
                <span class="text-faint" aria-hidden="true">·</span>
                <span class="font-mono text-caption text-muted">{{ company.name }}</span>
              </div>

              <article class="exp-role-card card" [class.is-current]="role.current" appSpotlight>
                <h3 class="text-title font-semibold tracking-tight text-fg">
                  {{ role.title }}<span class="brand-dot" aria-hidden="true">.</span>
                </h3>

                <ul class="exp-bullet-grid mt-4">
                  @for (item of role.bullets; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>

                <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <ul class="flex flex-wrap gap-1.5">
                    @for (tag of role.tags; track tag) {
                      <li class="chip">{{ tag }}</li>
                    }
                  </ul>

                  @if (role.caseId) {
                    <a [routerLink]="['/work', role.caseId]" class="btn btn-ghost btn-sm">
                      <span>{{ lang() === 'it' ? 'Leggi architettura & ADR' : 'Read architecture & ADRs' }}</span>
                      <svg appIcon="arrow-up-right" class="size-3.5"></svg>
                    </a>
                  }
                </div>
              </article>
            </li>
          }

          <!-- Education & Thesis Node on the Timeline -->
          <li class="exp-timeline-item reveal-on-scroll">
            <span class="exp-timeline-node" aria-hidden="true"></span>

            <div class="exp-timeline-meta">
              <span class="badge-soft">{{ lang() === 'it' ? 'Università' : 'University' }}</span>
              <span class="font-mono text-caption font-medium text-fg">{{ education().dates }}</span>
              <span class="text-faint" aria-hidden="true">·</span>
              <span class="font-mono text-caption text-muted">{{ education().school }}</span>
            </div>

            <article class="exp-role-card card" appSpotlight>
              <h3 class="text-title font-semibold tracking-tight text-fg">
                {{ education().degree }}<span class="brand-dot" aria-hidden="true">.</span>
              </h3>
              <p class="mt-1 text-small text-muted">{{ education().native }}</p>

              <div class="exp-thesis-box mt-4">
                <span class="font-mono text-micro uppercase tracking-wider text-accent">
                  {{ lang() === 'it' ? 'Tesi Sperimentale — PETRA' : 'B.Sc. Thesis — PETRA' }}
                </span>
                <p class="mt-1.5 text-small font-medium text-fg leading-relaxed">{{ education().thesis }}</p>
              </div>
            </article>
          </li>
        </ol>
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly company = COMPANY;
  protected readonly ui = UI;
  protected readonly lang = lang;

  protected readonly roles = computed(() => {
    lang();
    return ROLES;
  });

  protected readonly education = computed(() => {
    lang();
    return EDUCATION;
  });

  protected readonly featuredCase = computed(() => {
    lang();
    return CASES[0] ?? null;
  });
}
