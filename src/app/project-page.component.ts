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
            <div class="project-reveal flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 meta-mono">
              <button type="button" class="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-fg" (click)="goBack($event)">
                <svg appIcon="arrow-left" class="size-3.5"></svg>
                {{ it() ? 'Torna ai lavori' : 'Back to Work' }}
              </button>
              <span>workspace / {{ p.id }}</span>
            </div>

            <div class="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_16rem]">
              <article class="project-copy max-w-3xl">
                <p class="eyebrow"><span class="eyebrow-index">{{ p.lang }}</span><span class="eyebrow-rule" aria-hidden="true"></span>{{ p.year }}</p>
                <h1 id="project-title" class="mt-5 text-heading font-medium tracking-display text-fg">{{ p.name }}<span class="brand-dot" aria-hidden="true">.</span></h1>
                <p class="section-lede mt-6">{{ p.blurb }}</p>
                <div class="mt-7 flex flex-wrap items-center gap-2.5">
                  @if (p.href) {
                    <a [href]="p.href" target="_blank" rel="noreferrer" class="btn btn-primary">
                      <svg appIcon="github" class="size-4"></svg>
                      {{ it() ? 'Codice sorgente' : 'Source code' }}
                    </a>
                  }
                  @if (demo(); as demoUrl) {
                    <a [href]="demoUrl" target="_blank" rel="noreferrer" class="btn btn-ghost">
                      Live demo
                      <svg appIcon="arrow-up-right" class="size-4"></svg>
                    </a>
                  }
                  <span class="meta-mono">{{ p.stack.join(' · ') }}</span>
                </div>

                <!-- Case study first: problem, what was built, result, lesson. The repository comes after. -->
                @if (p.problem) {
                  <section id="problem" class="mt-16 scroll-mt-24">
                    <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Il problema' : 'The problem' }}</p>
                    <p class="mt-4 max-w-prose text-lede text-fg">{{ p.problem }}</p>
                  </section>
                }

                <section id="built" class="mt-16 scroll-mt-24">
                  <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Cosa ho costruito' : 'What I built' }}</p>
                  <p class="mt-4 max-w-prose text-body text-muted">{{ p.body }}</p>
                  <ol class="project-highlights mt-6">
                    @for (item of p.highlights; track item; let j = $index) {
                      <li class="text-body"><span>0{{ j + 1 }}</span>{{ item }}</li>
                    }
                  </ol>
                </section>

                @if (p.decisions?.length) {
                  <section id="decisions" class="mt-16 scroll-mt-24">
                    <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Decisioni' : 'Decisions' }}</p>
                    <app-decisions class="mt-5 block" [decisions]="p.decisions!" />
                  </section>
                }

                @if (p.impact?.length) {
                  <section id="impact" class="mt-16 scroll-mt-24">
                    <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Risultato' : 'Result' }}</p>
                    <dl class="impact-row mt-5">
                      @for (m of p.impact; track m.label) {
                        <div><dt>{{ m.label }}</dt><dd>{{ m.value }}</dd></div>
                      }
                    </dl>
                  </section>
                }

                <section id="lesson" class="mt-16 scroll-mt-24">
                  <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Cosa ho imparato' : 'What I learned' }}</p>
                  <p class="mt-4 max-w-prose text-lede text-fg">{{ p.learned }}</p>
                </section>

                <section id="story" class="mt-20 scroll-mt-24 border-t border-line pt-10">
                  <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Sotto il cofano' : 'Under the hood' }}</p>
                  <h2 class="mt-3 text-title font-medium tracking-tight text-fg">{{ it() ? 'Il codice' : 'The code' }}</h2>
                  @if (stats()?.readmeExcerpt; as readme) {
                    <p class="mt-4 max-w-prose text-body text-muted">{{ readme }}</p>
                    <p class="mt-3 meta-mono">{{ it() ? 'Fonte: README live da GitHub' : 'Source: live README from GitHub' }}</p>
                  } @else {
                    <p class="mt-4 max-w-prose text-body text-muted">{{ p.stack.join(' · ') }}</p>
                  }
                </section>

                @if (stats(); as live) {
                  <section id="metrics" class="mt-16 scroll-mt-24 border-y border-line py-10">
                    <div class="flex items-end justify-between gap-4">
                      <div>
                        <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>Repository pulse</p>
                        <h2 class="mt-3 text-title font-medium tracking-tight text-fg">The shape of the codebase</h2>
                      </div>
                      <span class="hidden meta-mono sm:block">github / live</span>
                    </div>
                    <!-- Stars only when there are some: "★ 0" reads as a negative signal, not a neutral one. -->
                    <div [class]="'mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line ' + (live.stars || live.forks ? 'sm:grid-cols-3' : 'sm:grid-cols-2')">
                      <div class="bg-surface p-5">
                        <p class="meta-mono">Useful lines</p>
                        <p class="mt-2 text-heading-sm font-medium tracking-tight text-accent">{{ live.usefulLines.toLocaleString() }}</p>
                        <p class="mt-1 meta-mono">{{ live.filesCounted }} source files</p>
                      </div>
                      @if (live.stars || live.forks) {
                        <div class="bg-surface p-5">
                          <p class="meta-mono">Community signal</p>
                          <p class="mt-2 text-heading-sm font-medium tracking-tight text-fg">★ {{ live.stars }}</p>
                          <p class="mt-1 meta-mono">{{ live.forks }} forks</p>
                        </div>
                      }
                      <div class="bg-surface p-5">
                        <p class="meta-mono">Last push</p>
                        <p class="mt-2 text-heading-sm font-medium tracking-tight text-fg">{{ formatDate(live.updatedAt) }}</p>
                        <p class="mt-1 meta-mono">default branch</p>
                      </div>
                    </div>
                    <div class="mt-6 space-y-3">
                      @for (language of live.languages; track language.name) {
                        <div class="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 font-mono text-caption">
                          <span class="text-fg">{{ language.name }}</span>
                          <div class="data-bar"><span [style.width.%]="language.percent"></span></div>
                          <span class="text-right text-muted">{{ language.percent }}%</span>
                        </div>
                      }
                    </div>
                  </section>

                  <section id="diff" class="mt-16 scroll-mt-24">
                    <div class="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>Repository signal</p>
                        <h2 class="mt-3 text-title font-medium tracking-tight text-fg">A living codebase</h2>
                      </div>
                      <span class="meta-mono">context, not noise</span>
                    </div>
                    <div class="mt-6 grid gap-3 sm:grid-cols-3">
                      <div class="signal-card panel p-5">
                        <div class="flex items-center justify-between"><span class="meta-mono">Source surface</span><span class="live-dot" data-tooltip="Live GitHub metadata" aria-hidden="true"></span></div>
                        <p class="mt-5 text-heading-sm font-medium tracking-tight text-accent">{{ live.filesCounted }}</p>
                        <p class="mt-1 meta-mono">files in the useful set</p>
                        <div class="data-bar mt-4"><span [style.width.%]="math.min(live.filesCounted * 4, 100)"></span></div>
                      </div>
                      <div class="signal-card panel p-5">
                        <div class="flex items-center justify-between"><span class="meta-mono">Language mix</span><span class="live-dot" data-tooltip="Measured in repository bytes" aria-hidden="true"></span></div>
                        <p class="mt-5 text-heading-sm font-medium tracking-tight text-fg">{{ live.languages.length }}</p>
                        <p class="mt-1 meta-mono">languages detected</p>
                        <div class="mt-4 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-surface-2">
                          @for (language of live.languages; track language.name) { <span class="data-bar-segment" [style.width.%]="language.percent" [attr.title]="language.name + ' ' + language.percent + '%'"></span> }
                        </div>
                      </div>
                      <div class="signal-card panel p-5">
                        <div class="flex items-center justify-between"><span class="meta-mono">Latest movement</span><span class="live-dot" data-tooltip="Most recent public commit" aria-hidden="true"></span></div>
                        @if (live.latestCommit; as commit) {
                          <p class="mt-5 line-clamp-2 text-body text-fg">{{ commit.message }}</p>
                          <p class="mt-2 meta-mono">{{ commit.sha }} · {{ formatDate(commit.date) }}</p>
                        } @else {
                          <p class="mt-5 text-body text-muted">No recent public movement found.</p>
                        }
                      </div>
                    </div>
                    @if (live.latestCommit; as commit) {
                      <div class="panel mt-8 overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                          <div><p class="eyebrow">Change set</p><p class="mt-1.5 text-body text-fg">{{ commit.message }}</p></div>
                          <span class="chip text-accent">{{ commit.sha }}</span>
                        </div>
                        <div class="divide-y divide-line">
                          @for (file of live.diffFiles; track file.filename) {
                            <div class="diff-file grid gap-3 px-5 py-3 sm:grid-cols-[1.5rem_minmax(0,1fr)_7rem] sm:items-center">
                              <span class="font-mono text-caption" [class]="file.status === 'added' ? 'diff-add' : file.status === 'removed' ? 'diff-del' : 'text-accent'">{{ file.status === 'added' ? 'A' : file.status === 'removed' ? 'D' : 'M' }}</span>
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
                <div class="card p-5">
                  <div class="flex items-center justify-between gap-3">
                    <span class="eyebrow">Project context</span>
                    <span class="live-dot" aria-label="Active project"></span>
                  </div>
                  <dl class="mt-5 space-y-4 text-small">
                    <div>
                      <dt class="meta-mono">Status</dt>
                      <dd class="mt-1 text-fg">{{ p.meta }}</dd>
                    </div>
                    @if (p.href) {
                      <div>
                        <dt class="meta-mono">Repository</dt>
                        <dd class="mt-1 break-all text-fg">{{ p.href.replace('https://github.com/', '') }}</dd>
                      </div>
                    }
                    @if (stats(); as live) {
                      <div>
                        <dt class="meta-mono">Useful lines</dt>
                        <dd class="mt-1 text-fg">{{ live.usefulLines.toLocaleString() }} <span class="text-muted">/ {{ live.filesCounted }} source files</span></dd>
                      </div>
                      @if (live.stars || live.forks) {
                        <div>
                          <dt class="meta-mono">GitHub</dt>
                          <dd class="mt-1 text-fg">★ {{ live.stars }} <span class="text-muted">· {{ live.forks }} forks</span></dd>
                        </div>
                      }
                      <div>
                        <dt class="meta-mono">Last push</dt>
                        <dd class="mt-1 text-fg">{{ formatDate(live.updatedAt) }}</dd>
                      </div>
                    } @else if (loading()) {
                      <div>
                        <dt class="meta-mono">GitHub stats</dt>
                        <dd class="mt-1 text-accent">Reading repository…</dd>
                      </div>
                    }
                  </dl>
                  @if (stats(); as live) {
                    <div class="mt-5 border-t border-line pt-4">
                      <p class="meta-mono">Languages by bytes</p>
                      <ul class="mt-2 space-y-2">
                        @for (language of live.languages; track language.name) {
                          <li class="flex items-center gap-2 font-mono text-caption">
                            <span class="h-1.5 rounded-full bg-signal" [style.width.%]="language.percent"></span>
                            <span class="text-fg">{{ language.name }}</span>
                            <span class="ml-auto text-muted">{{ language.percent }}%</span>
                          </li>
                        }
                      </ul>
                    </div>
                  }
                  <ul class="mt-5 flex flex-wrap gap-1.5">
                    @for (tag of p.stack; track tag) {
                      <li><app-keybind>{{ tag }}</app-keybind></li>
                    }
                  </ul>
                  @if (p.href) {
                    <a [href]="p.href" target="_blank" rel="noreferrer" class="mt-6 inline-flex items-center gap-2 text-small font-medium text-accent hover:underline">
                      View repository
                      <svg appIcon="arrow-up-right" class="size-3.5"></svg>
                    </a>
                  } @else {
                    <p class="mt-6 meta-mono">Not started yet — no repository to show.</p>
                  }
                </div>
              </aside>
            </div>
          </main>
        </div>
      } @else {
        <main class="container-x py-40 text-center">
          <p class="text-title font-medium tracking-tight text-fg">Project not found<span class="brand-dot">.</span></p>
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
  protected readonly stats = signal<GithubProjectStats | null>(null);
  protected readonly math = Math;
  protected readonly loading = signal(false);
  protected readonly active = signal("#overview");
  private readonly platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly previousMeta = new Map<string, string>();
  private router = inject(Router);
  private observer: IntersectionObserver | null = null;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  protected readonly ui = UI;
  protected readonly it = () => lang() === "it";
  /** Case-study order in the rail; sections that do not render (no problem/impact/stats) are skipped. */
  protected readonly headings = computed<TocItem[]>(() => {
    const it = this.it();
    const p = this.project();
    const items = [
      { id: "overview", label: it ? "Panoramica" : "Overview", show: true },
      { id: "problem", label: it ? "Il problema" : "The problem", show: !!p?.problem },
      { id: "built", label: it ? "Cosa ho costruito" : "What I built", show: true },
      { id: "decisions", label: it ? "Decisioni" : "Decisions", show: !!p?.decisions?.length },
      { id: "impact", label: it ? "Risultato" : "Result", show: !!p?.impact?.length },
      { id: "lesson", label: it ? "Cosa ho imparato" : "What I learned", show: true },
      { id: "story", label: it ? "Il codice" : "The code", show: true },
      { id: "metrics", label: it ? "Metriche" : "Metrics", show: !!this.stats() },
      { id: "diff", label: "Git diff", show: !!this.stats() },
    ].filter((item) => item.show);
    return items.map((item, i) => ({ n: String(i + 1).padStart(2, "0"), href: `#${item.id}`, label: item.label }));
  });

  project = computed(() => [...PROJECTS, ...FUTURE_PROJECTS].find((item) => item.id === this.id()));
  /** Only shipped projects can have a live deployment. */
  protected readonly demo = computed(() => {
    const current = this.project();
    return current && "demo" in current ? current.demo : undefined;
  });

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const current = this.project();
    this.title.setTitle(current ? `${current.name} · Alessandro Bruno` : "Project not found · Alessandro Bruno");
    if (!current) return;
    for (const sel of PAGE_META) {
      const tag = this.meta.getTag(sel);
      if (tag) this.previousMeta.set(sel, tag.content);
    }
    const description = `${current.name}: ${current.blurb}`;
    const url = `https://alessandrobrunoh.it/projects/${current.id}`;
    this.meta.updateTag({ name: "description", content: description });
    this.meta.updateTag({ property: "og:title", content: `${current.name} · Alessandro Bruno` });
    this.meta.updateTag({ property: "og:description", content: description });
    this.meta.updateTag({ property: "og:url", content: url });
    this.meta.updateTag({ name: "twitter:title", content: `${current.name} · Alessandro Bruno` });
    this.meta.updateTag({ name: "twitter:description", content: description });
    // The page renders from static data at once; GitHub stats fill in when (and if) they arrive.
    this.loading.set(true);
    this.timeout = setTimeout(() => this.loading.set(false), 6500);
    loadGithubProjectStats(current.href)
      .then((stats) => {
        if (!this.loading()) return;
        this.stats.set(stats);
        this.loading.set(false);
        // Metrics and diff sections appear now: observe them too.
        this.observer?.disconnect();
        this.observer = null;
        setTimeout(() => this.setupObserver(), 0);
      })
      .catch(() => this.loading.set(false));
  }

  ngAfterViewInit() {
    this.setupObserver();
  }

  private setupObserver() {
    if (this.observer) return;
    const sections = ["overview", "problem", "built", "decisions", "impact", "lesson", "story", "metrics", "diff"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;
    const visible = new Map<string, number>();
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      }
      const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
      if (top) this.active.set(`#${top[0]}`);
    }, { rootMargin: "-16% 0px -65% 0px", threshold: [0.1, 0.4] });
    for (const section of sections) this.observer.observe(section);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.timeout) clearTimeout(this.timeout);
    // Hand the home page back its own description and share card.
    for (const [sel, content] of this.previousMeta) this.meta.updateTag({ content }, sel);
  }

  formatDate(iso: string) {
    return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(iso));
  }

  patchLines(patch: string) {
    return patch.split("\\n").filter((line) => !line.startsWith("@@")).slice(0, 28);
  }

  goBack(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(["/"], { fragment: "work" }).then(() => {
      window.setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }), 0);
    });
  }
}
