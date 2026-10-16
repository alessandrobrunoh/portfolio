import { Component, OnDestroy, OnInit, computed, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { SpotlightDirective } from "./spotlight.directive";
import { SectionHeadComponent } from "./section-head.component";
import { CONTRIBUTIONS, PROJECTS, UI, lang } from "../lib/site";
import type { Project } from "../lib/site.types";

type CategoryId = "all" | "ai" | "systems" | "web" | "games";

interface CategoryTab {
  id: CategoryId;
  labelEn: string;
  labelIt: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: "all", labelEn: "All work", labelIt: "Tutti i lavori" },
  { id: "ai", labelEn: "AI & Agents", labelIt: "AI & Agenti" },
  { id: "systems", labelEn: "Rust & Systems", labelIt: "Rust & Sistemi" },
  { id: "web", labelEn: "Web & Full-Stack", labelIt: "Web & Full-Stack" },
  { id: "games", labelEn: "Games & Simulation", labelIt: "Giochi & Simulazione" },
];

const PROJECT_CATEGORIES: Record<string, CategoryId[]> = {
  trama: ["ai", "web", "systems"],
  eivar: ["games", "systems"],
  mnemosyne: ["ai", "systems"],
  ducklake: ["systems"],
  weaklings: ["web", "systems"],
  traingame: ["ai", "games", "systems"],
  briscola: ["web", "games"],
  sdp: ["systems", "ai"],
  vapt: ["web"],
};

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [IconComponent, RouterLink, SectionHeadComponent, SpotlightDirective],
  template: `
    <section id="work" class="container-x section scroll-mt-16">
      <app-section-head
        n="03"
        [title]="ui.sectionTitles.work"
        [kicker]="lang() === 'it' ? 'AI · Backend · Web · Motori' : 'AI · Backend · Web · Engines'"
      >
        <div class="flex flex-col gap-4">
          <p class="section-lede">
            {{
              lang() === 'it'
                ? 'Progetti reali costruiti da zero: coordinamento tra team e agenti AI, cronologia semantica via AST, un ORM pubblicato su crates.io, piattaforme web e simulazioni multiplayer in Rust.'
                : 'Real systems built from scratch: human + AI agent coordination, AST semantic history, a published Rust ORM on crates.io, full-stack platforms, and multiplayer Rust simulations.'
            }}
          </p>

          <!-- Interactive Category Filter Pills -->
          <div class="project-filter-bar" role="tablist" [attr.aria-label]="lang() === 'it' ? 'Filtra progetti' : 'Filter projects'">
            @for (cat of categories; track cat.id) {
              <button
                type="button"
                role="tab"
                class="project-filter-pill"
                [class.is-active]="activeCategory() === cat.id"
                [attr.aria-selected]="activeCategory() === cat.id"
                (click)="activeCategory.set(cat.id)"
              >
                <span class="dot" aria-hidden="true"></span>
                <span>{{ lang() === 'it' ? cat.labelIt : cat.labelEn }}</span>
              </button>
            }
          </div>
        </div>
      </app-section-head>

      <ul class="project-grid">
        @for (p of filteredProjects(); track p.id; let i = $index; let first = $first) {
          @if (first && activeCategory() === 'all') {
            <!-- Flagship Lead Showcase Card (Trama) -->
            <li class="lead">
              <a [routerLink]="['/projects', p.id]" class="card card-link project-card project-lead" appSpotlight>
                <div class="project-card-topbar">
                  <div class="flex items-center gap-2.5">
                    <span class="badge-soft">
                      <span class="live-dot" aria-hidden="true"></span>
                      <span>{{ lang() === 'it' ? 'Progetto Principale' : 'Flagship Product' }}</span>
                    </span>
                    <span class="chip chip-signal">{{ p.lang }}</span>
                  </div>
                  <span class="font-mono text-caption text-muted">
                    @if (showStars(p.stars)) { <span title="GitHub stars">★ {{ p.stars }}</span> · }{{ p.year }} · {{ p.meta }}
                  </span>
                </div>

                <div class="project-lead-body">
                  <div>
                    <h3 class="project-name">{{ p.name }}<span class="brand-dot">.</span></h3>
                    <p class="mt-2.5 text-body text-fg font-medium leading-relaxed">{{ p.blurb }}</p>

                    @if (p.problem) {
                      <div class="project-why-box mt-4">
                        <span class="font-mono text-micro uppercase tracking-wider text-accent">
                          {{ lang() === 'it' ? 'Perché è interessante' : 'Why it matters' }}
                        </span>
                        <p class="mt-1 text-small text-muted leading-relaxed">{{ p.problem }}</p>
                      </div>
                    }

                    <div class="mt-5 flex flex-wrap items-center gap-1.5">
                      @for (t of p.stack; track t) { <span class="chip">{{ t }}</span> }
                      <span class="chip chip-quiet">~90 MCP Tools</span>
                    </div>
                  </div>

                  <div class="project-spec-col">
                    <div class="flex items-center justify-between mb-2.5">
                      <span class="font-mono text-micro uppercase tracking-wider text-accent">
                        {{ lang() === 'it' ? 'Punti chiave architettura' : 'Key engineering highlights' }}
                      </span>
                      <span class="font-mono text-caption text-faint">01–0{{ p.highlights.length }}</span>
                    </div>
                    <ol class="project-highlights">
                      @for (h of p.highlights; track h; let j = $index) {
                        <li><span>0{{ j + 1 }}</span>{{ h }}</li>
                      }
                    </ol>
                  </div>
                </div>

                <div class="project-card-foot">
                  <span class="text-small font-medium text-muted">
                    {{ lang() === 'it' ? 'Demo live + Caso di studio architetturale completo' : 'Live demo + Full architectural case study' }}
                  </span>
                  <span class="inline-flex items-center gap-2 text-small font-semibold text-accent">
                    <span>{{ lang() === 'it' ? 'Esplora progetto' : 'Inspect project' }}</span>
                    <svg appIcon="arrow-up-right" class="card-arrow size-4"></svg>
                  </span>
                </div>
              </a>
            </li>
          } @else {
            <!-- Compact Project Card with Auto-Advancing Gallery Carousel or Key Engineering Bullets -->
            <li>
              <a [routerLink]="['/projects', p.id]" class="card card-link project-card" appSpotlight>
                <div class="project-card-topbar">
                  <div class="flex items-center gap-2">
                    <span class="badge-soft">{{ p.lang }}</span>
                    @if (isPublished(p.name)) {
                      <span class="chip chip-signal">crates.io</span>
                    } @else {
                      <span class="font-mono text-caption text-faint">{{ p.meta }}</span>
                    }
                  </div>
                  <span class="font-mono text-caption text-muted">
                    @if (showStars(p.stars)) { <span title="GitHub stars">★ {{ p.stars }}</span> · }{{ p.year }}
                  </span>
                </div>

                @if (p.gallery?.length) {
                  <div class="project-thumb mt-3.5">
                    @for (shot of p.gallery!; track shot.src; let sIdx = $index) {
                      <img
                        [src]="shot.src"
                        [alt]="shot.alt"
                        loading="lazy"
                        decoding="async"
                        class="project-thumb-slide"
                        [class.is-active]="slideIndex(p.gallery!.length) === sIdx"
                      />
                    }
                    @if (p.gallery!.length > 1) {
                      <div class="project-carousel-dots" aria-hidden="true">
                        @for (shot of p.gallery!; track shot.src; let dIdx = $index) {
                          <span class="project-carousel-dot" [class.is-active]="slideIndex(p.gallery!.length) === dIdx"></span>
                        }
                      </div>
                      <span class="project-thumb-count">
                        {{ slideIndex(p.gallery!.length) + 1 }} / {{ p.gallery!.length }}
                      </span>
                    }
                  </div>
                }

                <div class="mt-4 flex-1">
                  <h3 class="project-name">{{ p.name }}<span class="brand-dot" aria-hidden="true">.</span></h3>
                  <p class="mt-1.5 text-small text-muted leading-relaxed line-clamp-2">{{ p.blurb }}</p>

                  @if (!p.gallery?.length && p.highlights.length) {
                    <ul class="project-mini-points mt-3.5">
                      @for (h of p.highlights.slice(0, 2); track h) {
                        <li>{{ h }}</li>
                      }
                    </ul>
                  }
                </div>

                <div class="mt-4 flex flex-wrap gap-1.5">
                  @for (t of p.stack; track t) { <span class="chip">{{ t }}</span> }
                </div>

                <div class="project-card-foot">
                  <span class="text-caption font-medium text-muted">
                    {{ p.decisions?.length ? (lang() === 'it' ? p.decisions!.length + ' decisioni architetturali (ADR)' : p.decisions!.length + ' architectural decisions (ADRs)') : (lang() === 'it' ? 'Analisi codice & metriche live' : 'Code analysis & live metrics') }}
                  </span>
                  <svg appIcon="arrow-up-right" class="card-arrow size-4 shrink-0"></svg>
                </div>
              </a>
            </li>
          }
        }
      </ul>

      <!-- Upstream open-source registry -->
      @if (upstream().length) {
        <div class="mt-12 reveal-on-scroll">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div class="section-badge">
              <span class="section-badge-dot" aria-hidden="true"></span>
              <span>Open Source</span>
              <span class="section-badge-sep" aria-hidden="true">·</span>
              <span>{{ lang() === 'it' ? 'Contributi Upstream (Zed IDE)' : 'Upstream Contributions (Zed IDE)' }}</span>
            </div>
          </div>
          <ul class="oss-list">
            @for (c of upstream(); track c.href) {
              <li>
                <a [href]="c.href" target="_blank" rel="noreferrer" class="oss-row">
                  <span class="status" [class.status-open]="c.status === 'Open'" [class.status-merged]="c.status === 'Merged'">{{ c.status }}</span>
                  <div class="min-w-0">
                    <p class="oss-title">{{ c.title }}</p>
                    <p class="mt-1 font-mono text-caption text-muted">{{ c.repo }} · {{ ref(c.href) }} — {{ c.note }}</p>
                  </div>
                  <svg appIcon="arrow-up-right" class="card-arrow size-4 shrink-0"></svg>
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </section>
  `,
})
export class ProjectsComponent implements OnInit, OnDestroy {
  protected readonly projects = PROJECTS;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly categories = CATEGORIES;
  protected readonly activeCategory = signal<CategoryId>("all");
  protected readonly tick = signal(0);
  private timer: ReturnType<typeof setInterval> | undefined;

  ngOnInit() {
    if (typeof window !== "undefined") {
      this.timer = setInterval(() => this.tick.update((v) => v + 1), 3200);
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  protected slideIndex(len: number): number {
    return len > 0 ? this.tick() % len : 0;
  }

  protected readonly filteredProjects = computed<Project[]>(() => {
    lang();
    const cat = this.activeCategory();
    if (cat === "all") return this.projects.slice(0, 6);
    return this.projects.filter((p) => (PROJECT_CATEGORIES[p.id] ?? []).includes(cat));
  });

  protected readonly upstream = computed(() => {
    lang();
    return CONTRIBUTIONS.filter((c) => c.status !== "Published");
  });

  protected showStars(stars: number | undefined) {
    return (stars ?? 0) >= 10;
  }

  protected isPublished(name: string) {
    return CONTRIBUTIONS.some((c) => c.status === "Published" && c.title === name);
  }

  protected ref(href: string) {
    return href.includes("/pull/") ? `PR #${href.split("/pull/")[1]}` : "repo";
  }
}
