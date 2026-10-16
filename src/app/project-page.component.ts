import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { AfterViewInit, Component, OnDestroy, computed, inject, input, signal } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DecisionsComponent } from "./decisions.component";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { SiteNavComponent } from "./site-nav.component";
import { TocComponent } from "./toc.component";
import { FUTURE_PROJECTS, PROJECTS, UI, lang } from "../lib/site";
import { loadGithubProjectStats, type GithubProjectStats } from "../lib/github-project";
import type { TocItem } from "../lib/site.types";

/** Tags a project page overrides; restored on leave so the home keeps its own card. */
const PAGE_META = [
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:url"',
  'name="twitter:title"',
  'name="twitter:description"',
];

@Component({
  selector: "app-project-page",
  standalone: true,
  imports: [DecisionsComponent, IconComponent, KeybindComponent, SiteNavComponent, TocComponent],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      <app-site-nav [home]="false" />
      @if (project(); as p) {
        <div class="container-x page-shell">
          <app-toc [items]="headings()" [active]="active()" />
          <main id="overview" class="min-w-0 scroll-mt-24">
            <div class="project-reveal flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <button type="button" class="inline-flex min-h-9 items-center gap-2 text-small font-medium text-muted transition-colors hover:text-fg" (click)="goBack($event)">
                <svg appIcon="arrow-left" class="size-4"></svg>
                {{ it() ? 'Torna ai lavori' : 'Back to Work' }}
              </button>
              <span class="badge-soft">
                <span class="badge-soft-dot" aria-hidden="true"></span>
                <span>{{ p.lang }} · {{ p.year }}</span>
              </span>
            </div>

            <div class="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <article class="project-copy max-w-3xl">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="badge-soft">{{ p.meta }}</span>
                  @for (s of p.stack; track s) {
                    <span class="chip">{{ s }}</span>
                  }
                </div>

                <h1 id="project-title" class="mt-5 text-heading font-semibold tracking-display text-fg">
                  {{ p.name }}<span class="brand-dot" aria-hidden="true">.</span>
                </h1>
                <p class="section-lede mt-4">{{ p.blurb }}</p>

                <div class="mt-7 flex flex-wrap items-center gap-3">
                  @if (p.href) {
                    <a [href]="p.href" target="_blank" rel="noreferrer" class="btn btn-primary">
                      <svg appIcon="github" class="size-4"></svg>
                      {{ it() ? 'Codice sorgente' : 'Source code' }}
                    </a>
                  }
                  @if (demo(); as demoUrl) {
                    <a [href]="demoUrl" target="_blank" rel="noreferrer" class="btn btn-ghost">
                      <span>Live demo</span>
                      <svg appIcon="arrow-up-right" class="size-4"></svg>
                    </a>
                  }
                </div>

                <!-- Immediate Codebase Scale Banner (Right at the top so visitors see the real size of the repo!) -->
                @if (stats(); as live) {
                  <div class="mt-8 grid gap-3 sm:grid-cols-3">
                    <div class="card p-4">
                      <span class="font-mono text-micro uppercase tracking-wider text-muted">{{ it() ? 'Linee di codice reali' : 'Useful lines of code' }}</span>
                      <p class="mt-1.5 text-title font-semibold tracking-tight text-accent">{{ live.usefulLines.toLocaleString() }}</p>
                      <span class="font-mono text-caption text-faint">{{ live.filesCounted }} {{ it() ? 'file sorgente nel repo' : 'source files in repo' }}</span>
                    </div>
                    <div class="card p-4">
                      <span class="font-mono text-micro uppercase tracking-wider text-muted">{{ it() ? 'Linguaggio primario' : 'Primary language' }}</span>
                      <p class="mt-1.5 text-title font-semibold tracking-tight text-fg">{{ live.languages[0]?.name || p.lang }}</p>
                      <span class="font-mono text-caption text-faint">{{ live.languages[0]?.percent || 100 }}% {{ it() ? 'della codebase' : 'of codebase' }}</span>
                    </div>
                    <div class="card p-4">
                      <span class="font-mono text-micro uppercase tracking-wider text-muted">{{ it() ? 'Ultimo aggiornamento' : 'Last push' }}</span>
                      <p class="mt-1.5 text-title font-semibold tracking-tight text-fg">{{ formatDate(live.updatedAt) }}</p>
                      <span class="font-mono text-caption text-faint">{{ live.latestCommit ? 'commit ' + live.latestCommit.sha : 'default branch' }}</span>
                    </div>
                  </div>
                }

                <!-- Compact Interactive & Auto-Advancing Gallery Carousel -->
                @if (gallery().length) {
                  <div class="project-gallery-stage mt-8" (mouseenter)="pauseCarousel.set(true)" (mouseleave)="pauseCarousel.set(false)">
                    <div class="project-gallery-viewport">
                      @for (shot of gallery(); track shot.src; let idx = $index) {
                        <img
                          [src]="shot.src"
                          [alt]="shot.alt"
                          loading="lazy"
                          decoding="async"
                          class="project-gallery-img"
                          [class.is-active]="activeSlide() === idx"
                        />
                      }
                      @if (gallery().length > 1) {
                        <button
                          type="button"
                          class="project-gallery-nav prev"
                          (click)="stepSlide(-1)"
                          [attr.aria-label]="it() ? 'Immagine precedente' : 'Previous image'"
                        >
                          <svg appIcon="chevron-left" class="size-4"></svg>
                        </button>
                        <button
                          type="button"
                          class="project-gallery-nav next"
                          (click)="stepSlide(1)"
                          [attr.aria-label]="it() ? 'Immagine successiva' : 'Next image'"
                        >
                          <svg appIcon="chevron-right" class="size-4"></svg>
                        </button>
                      }
                    </div>
                    <div class="project-gallery-bar">
                      <p class="text-caption text-muted truncate">
                        <span class="font-mono font-semibold text-accent mr-2">0{{ activeSlide() + 1 }} / 0{{ gallery().length }}</span>
                        {{ gallery()[activeSlide()]?.alt }}
                      </p>
                      @if (gallery().length > 1) {
                        <div class="flex items-center gap-1.5 shrink-0">
                          @for (shot of gallery(); track shot.src; let idx = $index) {
                            <button
                              type="button"
                              class="project-gallery-dot"
                              [class.is-active]="activeSlide() === idx"
                              (click)="activeSlide.set(idx)"
                              [attr.aria-label]="'Slide ' + (idx + 1)"
                            ></button>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Case study: problem, what was built, decisions, result, lesson -->
                @if (p.problem) {
                  <section id="problem" class="mt-14 scroll-mt-24">
                    <div class="section-badge">
                      <span class="section-badge-dot" aria-hidden="true"></span>
                      <span>01</span>
                      <span class="section-badge-sep" aria-hidden="true">·</span>
                      <span>{{ it() ? 'Il problema' : 'The problem' }}</span>
                    </div>
                    <div class="project-why-box mt-4">
                      <p class="max-w-prose text-lede font-medium text-fg leading-relaxed">{{ p.problem }}</p>
                    </div>
                  </section>
                }

                <section id="built" class="mt-14 scroll-mt-24">
                  <div class="section-badge">
                    <span class="section-badge-dot" aria-hidden="true"></span>
                    <span>02</span>
                    <span class="section-badge-sep" aria-hidden="true">·</span>
                    <span>{{ it() ? 'Cosa ho costruito' : 'What I built' }}</span>
                  </div>
                  <p class="mt-4 max-w-prose text-body text-muted leading-relaxed">{{ p.body }}</p>
                  <ol class="project-highlights mt-6">
                    @for (item of p.highlights; track item; let j = $index) {
                      <li class="text-body"><span>0{{ j + 1 }}</span>{{ item }}</li>
                    }
                  </ol>
                </section>

                @if (p.decisions?.length) {
                  <section id="decisions" class="mt-14 scroll-mt-24">
                    <div class="section-badge">
                      <span class="section-badge-dot" aria-hidden="true"></span>
                      <span>03</span>
                      <span class="section-badge-sep" aria-hidden="true">·</span>
                      <span>{{ it() ? 'Decisioni architetturali' : 'Architectural decisions' }}</span>
                    </div>
                    <app-decisions class="mt-5 block" [decisions]="p.decisions!" />
                  </section>
                }

                @if (p.impact?.length) {
                  <section id="impact" class="mt-14 scroll-mt-24">
                    <div class="section-badge">
                      <span class="section-badge-dot" aria-hidden="true"></span>
                      <span>04</span>
                      <span class="section-badge-sep" aria-hidden="true">·</span>
                      <span>{{ it() ? 'Risultato' : 'Result' }}</span>
                    </div>
                    <dl class="impact-row mt-5">
                      @for (m of p.impact; track m.label) {
                        <div><dt>{{ m.label }}</dt><dd>{{ m.value }}</dd></div>
                      }
                    </dl>
                  </section>
                }

                <section id="lesson" class="mt-14 scroll-mt-24">
                  <div class="section-badge">
                    <span class="section-badge-dot" aria-hidden="true"></span>
                    <span>05</span>
                    <span class="section-badge-sep" aria-hidden="true">·</span>
                    <span>{{ it() ? 'Cosa ho imparato' : 'What I learned' }}</span>
                  </div>
                  <p class="mt-4 max-w-prose text-lede text-fg leading-relaxed">{{ p.learned }}</p>
                </section>

                @if (stats(); as live) {
                  <section id="metrics" class="mt-16 scroll-mt-24 border-t border-line pt-12">
                    <div class="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div class="section-badge">
                          <span class="section-badge-dot" aria-hidden="true"></span>
                          <span>GitHub Live</span>
                        </div>
                        <h2 class="mt-3 text-title font-semibold tracking-tight text-fg">
                          {{ it() ? 'Composizione della codebase' : 'Shape of the codebase' }}<span class="brand-dot" aria-hidden="true">.</span>
                        </h2>
                      </div>
                      <span class="font-mono text-caption text-faint">{{ live.usefulLines.toLocaleString() }} LOC · {{ live.filesCounted }} files</span>
                    </div>

                    <div class="mt-6 space-y-3 card p-6">
                      @for (language of live.languages; track language.name) {
                        <div class="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3 font-mono text-caption">
                          <span class="font-medium text-fg">{{ language.name }}</span>
                          <div class="data-bar"><span [style.width.%]="language.percent"></span></div>
                          <span class="text-right text-muted">{{ language.percent }}%</span>
                        </div>
                      }
                    </div>
                  </section>

                  <section id="diff" class="mt-14 scroll-mt-24">
                    @if (live.latestCommit; as commit) {
                      <div class="card overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
                          <div>
                            <span class="font-mono text-micro uppercase tracking-wider text-accent">{{ it() ? 'Ultimo commit pubblico' : 'Latest public commit' }}</span>
                            <p class="mt-1 text-body font-medium text-fg">{{ commit.message }}</p>
                          </div>
                          <span class="chip chip-signal">{{ commit.sha }}</span>
                        </div>
                        <div class="divide-y divide-line">
                          @for (file of live.diffFiles; track file.filename) {
                            <div class="diff-file grid gap-3 px-6 py-3.5 sm:grid-cols-[1.5rem_minmax(0,1fr)_7rem] sm:items-center">
                              <span class="font-mono text-caption font-semibold" [class]="file.status === 'added' ? 'diff-add' : file.status === 'removed' ? 'diff-del' : 'text-accent'">{{ file.status === 'added' ? 'A' : file.status === 'removed' ? 'D' : 'M' }}</span>
                              <div class="min-w-0"><p class="truncate font-mono text-caption text-fg" [attr.title]="file.filename">{{ file.filename }}</p><div class="change-track mt-2"><span [style.width.%]="math.min(file.additions * 2, 100)"></span></div></div>
                              <div class="text-right font-mono text-caption"><span class="diff-add">+{{ file.additions }}</span><span class="diff-del ml-2">-{{ file.deletions }}</span></div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </section>
                }
              </article>

              <aside class="project-reveal self-start xl:sticky xl:top-24">
                <div class="card p-6">
                  <div class="flex items-center justify-between gap-3">
                    <span class="badge-soft">
                      <span class="live-dot" aria-hidden="true"></span>
                      <span>{{ it() ? 'Scheda tecnica' : 'Project summary' }}</span>
                    </span>
                  </div>
                  <dl class="mt-5 space-y-4 text-small">
                    <div>
                      <dt class="font-mono text-micro uppercase tracking-wider text-faint">{{ it() ? 'Stato' : 'Status' }}</dt>
                      <dd class="mt-1 font-medium text-fg">{{ p.meta }}</dd>
                    </div>
                    @if (p.href) {
                      <div>
                        <dt class="font-mono text-micro uppercase tracking-wider text-faint">Repository</dt>
                        <dd class="mt-1 break-all font-mono text-caption text-fg">{{ p.href.replace('https://github.com/', '') }}</dd>
                      </div>
                    }
                    @if (stats(); as live) {
                      <div>
                        <dt class="font-mono text-micro uppercase tracking-wider text-faint">{{ it() ? 'Dimensione codice' : 'Codebase size' }}</dt>
                        <dd class="mt-1 font-semibold text-accent">{{ live.usefulLines.toLocaleString() }} LOC <span class="font-normal text-muted">/ {{ live.filesCounted }} files</span></dd>
                      </div>
                      @if (live.stars >= 10 || live.forks > 0) {
                        <div>
                          <dt class="font-mono text-micro uppercase tracking-wider text-faint">GitHub</dt>
                          <dd class="mt-1 text-fg">★ {{ live.stars }} <span class="text-muted">· {{ live.forks }} forks</span></dd>
                        </div>
                      }
                      <div>
                        <dt class="font-mono text-micro uppercase tracking-wider text-faint">{{ it() ? 'Ultimo push' : 'Last push' }}</dt>
                        <dd class="mt-1 text-fg">{{ formatDate(live.updatedAt) }}</dd>
                      </div>
                    }
                  </dl>
                  <div class="mt-6 border-t border-line pt-5">
                    <p class="font-mono text-micro uppercase tracking-wider text-faint">Stack</p>
                    <div class="mt-3 flex flex-wrap gap-1.5">
                      @for (item of p.stack; track item) { <app-keybind>{{ item }}</app-keybind> }
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      } @else {
        <main class="container-x py-40 text-center">
          <p class="text-title font-medium tracking-tight text-fg">{{ it() ? 'Progetto non trovato' : 'Project not found' }}<span class="brand-dot">.</span></p>
          <button type="button" class="btn btn-ghost mt-6" (click)="goBack($event)">
            <svg appIcon="arrow-left" class="size-4"></svg>
            {{ it() ? 'Torna ai lavori' : 'Back to Work' }}
          </button>
        </main>
      }
    </div>
  `,
})
export class ProjectPageComponent implements AfterViewInit, OnDestroy {
  id = input<string>("");
  stats = signal<GithubProjectStats | null>(null);
  loading = signal(false);
  active = signal("#overview");
  activeSlide = signal(0);
  pauseCarousel = signal(false);

  protected readonly math = Math;
  protected readonly ui = UI;
  protected readonly it = () => lang() === "it";
  private observer: IntersectionObserver | null = null;
  private carouselTimer: ReturnType<typeof setInterval> | undefined;
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly savedMeta: Array<{ selector: string; content: string }> = [];

  stepSlide(delta: number) {
    const len = this.gallery().length;
    if (len <= 1) return;
    this.activeSlide.update((v) => ((v + delta) % len + len) % len);
  }

  project = computed(() => {
    lang();
    const id = this.id();
    const found = PROJECTS.find((p) => p.id === id);
    if (found) return found;
    const future = FUTURE_PROJECTS.find((p) => p.id === id);
    if (!future) return null;
    return {
      ...future,
      featured: false,
    };
  });

  demo = computed(() => {
    lang();
    return PROJECTS.find((p) => p.id === this.id())?.demo ?? "";
  });

  gallery = computed(() => {
    lang();
    return PROJECTS.find((p) => p.id === this.id())?.gallery ?? [];
  });

  headings = computed<TocItem[]>(() => {
    const it = this.it();
    const p = this.project();
    const hasStats = !!this.stats();
    const raw: Array<{ id: string; label: string; show: boolean }> = [
      { id: "overview", label: it ? "Panoramica" : "Overview", show: true },
      { id: "problem", label: it ? "Il problema" : "The problem", show: !!p?.problem },
      { id: "built", label: it ? "Cosa ho costruito" : "What I built", show: true },
      { id: "decisions", label: it ? "Decisioni" : "Decisions", show: !!p?.decisions?.length },
      { id: "impact", label: it ? "Risultato" : "Result", show: !!p?.impact?.length },
      { id: "lesson", label: it ? "Cosa ho imparato" : "What I learned", show: true },
      { id: "metrics", label: "Metriche live", show: hasStats },
      { id: "diff", label: "Ultimo commit", show: hasStats },
    ];
    return raw
      .filter((item) => item.show)
      .map((item, i) => ({ n: String(i + 1).padStart(2, "0"), href: `#${item.id}`, label: item.label }));
  });

  async ngAfterViewInit() {
    this.applyPageMeta();
    if (!this.isBrowser) return;

    if (this.gallery().length > 1) {
      this.carouselTimer = setInterval(() => {
        if (!this.pauseCarousel()) {
          this.stepSlide(1);
        }
      }, 3600);
    }

    const current = this.project();
    if (!current) return;
    if (current.href) {
      this.loading.set(true);
      try {
        this.stats.set(await loadGithubProjectStats(current.href));
      } catch {
        this.stats.set(null);
      } finally {
        this.loading.set(false);
      }
    }
    this.setupScrollSpy();
  }

  private applyPageMeta() {
    for (const selector of PAGE_META) {
      const tag = this.meta.getTag(selector);
      if (tag?.content) this.savedMeta.push({ selector, content: tag.content });
    }
    const current = this.project();
    if (!current) {
      this.title.setTitle("Project not found · Alessandro Bruno");
      return;
    }
    const pageTitle = `${current.name} — Alessandro Bruno`;
    const url = `https://alessandrobrunoh.it/projects/${current.id}`;
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: "description", content: current.blurb });
    this.meta.updateTag({ property: "og:title", content: pageTitle });
    this.meta.updateTag({ property: "og:description", content: current.blurb });
    this.meta.updateTag({ property: "og:url", content: url });
    this.meta.updateTag({ name: "twitter:title", content: pageTitle });
    this.meta.updateTag({ name: "twitter:description", content: current.blurb });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.carouselTimer) clearInterval(this.carouselTimer);
    this.title.setTitle("Alessandro Bruno — Software Engineer");
    for (const { selector, content } of this.savedMeta) {
      const [attr, value] = selector.replace(/"/g, "").split("=");
      this.meta.updateTag({ [attr]: value, content });
    }
  }

  private setupScrollSpy() {
    setTimeout(() => {
      const sections = ["overview", "problem", "built", "decisions", "impact", "lesson", "metrics", "diff"]
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      if (sections.length === 0) return;

      const visible = new Map<string, number>();
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              visible.set(entry.target.id, entry.intersectionRatio);
            } else {
              visible.delete(entry.target.id);
            }
          }
          const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
          if (top) this.active.set(`#${top[0]}`);
        },
        { rootMargin: "-16% 0px -65% 0px", threshold: [0.1, 0.4] },
      );

      for (const section of sections) this.observer.observe(section);
    }, 50);
  }

  formatDate(value: string) {
    return new Intl.DateTimeFormat(this.it() ? "it-IT" : "en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  goBack(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(["/"], { fragment: "work" }).then(() => {
      window.setTimeout(() => {
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    });
  }
}
