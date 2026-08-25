import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { AfterViewInit, Component, OnDestroy, computed, inject, input, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { TocComponent } from "./toc.component";
import { FUTURE_PROJECTS, PROJECTS, UI } from "../lib/site";
import { loadGithubProjectStats, type GithubProjectStats } from "../lib/github-project";
import type { TocItem } from "../lib/site.types";

@Component({
  selector: "app-project-page",
  standalone: true,
  imports: [IconComponent, KeybindComponent, TocComponent],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      @if (loading()) {
        <div class="project-loading mx-auto grid min-h-dvh max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-12" aria-busy="true" aria-label="Loading project context">
          <aside class="hidden lg:block">
            <div class="skeleton skeleton-logo h-5 w-32"></div>
            <div class="mt-10 space-y-3"><div class="skeleton h-3 w-16"></div><div class="skeleton h-8 w-full"></div><div class="skeleton h-8 w-4/5"></div><div class="skeleton h-8 w-3/5"></div></div>
            <div class="mt-12 space-y-4 border-t border-fg/10 pt-6"><div class="skeleton h-3 w-24"></div><div class="skeleton h-3 w-28"></div><div class="skeleton h-3 w-20"></div></div>
          </aside>
          <main class="min-w-0">
            <div class="flex justify-between border-b border-fg/10 pb-4"><div class="skeleton h-3 w-32"></div><div class="skeleton h-3 w-24"></div></div>
            <div class="mt-12 max-w-3xl"><div class="skeleton h-3 w-20"></div><div class="skeleton mt-5 h-16 w-4/5"></div><div class="skeleton mt-7 h-4 w-full"></div><div class="skeleton mt-3 h-4 w-11/12"></div><div class="skeleton mt-3 h-4 w-3/4"></div></div>
            <div class="mt-14 grid gap-3 sm:grid-cols-3"><div class="skeleton h-28 rounded-md"></div><div class="skeleton h-28 rounded-md"></div><div class="skeleton h-28 rounded-md"></div></div>
            <div class="mt-10 space-y-3"><div class="skeleton h-4 w-full"></div><div class="skeleton h-4 w-5/6"></div><div class="skeleton h-4 w-2/3"></div></div>
            <p class="mt-8 font-mono text-caption tracking-mono text-muted">Syncing repository context</p>
          </main>
        </div>
      } @else if (project(); as p) {
        <div class="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-12">
          <app-toc [items]="headings" [active]="active()" />
          <main id="overview" class="min-w-0">
            <div class="project-reveal flex flex-wrap items-center justify-between gap-3 border-b border-fg/10 pb-4 font-mono text-caption tracking-mono text-muted">
              <button type="button" class="inline-flex items-center gap-2 transition-colors hover:text-accent" (click)="goBack($event)">
                ← Back to Projects
              </button>
              <span>workspace / {{ p.id }}</span>
            </div>

            <div class="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_15rem]">
              <article class="project-copy max-w-3xl">
                <p class="font-mono text-caption tracking-mono text-accent">{{ p.lang }} <span class="text-fg/20">·</span> {{ p.year }}</p>
                <h1 id="project-title" class="mt-3 font-display text-heading-sm text-fg sm:text-heading">{{ p.name }}</h1>
                <p class="mt-6 max-w-prose font-serif text-lede text-muted">{{ p.blurb }}</p>

                <section id="story" class="scroll-mt-8 mt-14">
                  <p class="font-mono text-caption tracking-mono text-accent">README / overview</p>
                  @if (stats()?.readmeExcerpt; as readme) {
                    <p class="mt-3 max-w-prose font-serif text-body leading-8 text-fg">{{ readme }}</p>
                    <p class="mt-3 font-mono text-caption tracking-mono text-muted">Source: live README from GitHub</p>
                  } @else {
                    <p class="mt-3 max-w-prose font-serif text-body leading-8 text-fg">{{ p.body }}</p>
                  }
                </section>

                @if (stats(); as live) {
                  <section id="metrics" class="scroll-mt-8 mt-14 border-y border-fg/10 py-8">
                    <div class="flex items-end justify-between gap-4">
                      <div>
                        <p class="font-mono text-caption tracking-mono text-accent">REPOSITORY PULSE</p>
                        <h2 class="mt-2 font-display text-heading-sm text-fg">The shape of the codebase</h2>
                      </div>
                      <span class="hidden font-mono text-caption tracking-mono text-muted sm:block">github / live</span>
                    </div>
                    <div class="mt-6 grid gap-px overflow-hidden rounded-md border border-fg/10 bg-fg/10 sm:grid-cols-3">
                      <div class="bg-surface p-4">
                        <p class="font-mono text-caption tracking-mono text-muted">Useful lines</p>
                        <p class="mt-2 font-display text-heading-sm text-accent">{{ live.usefulLines.toLocaleString() }}</p>
                        <p class="mt-1 font-mono text-caption tracking-mono text-muted">{{ live.filesCounted }} source files</p>
                      </div>
                      <div class="bg-surface p-4">
                        <p class="font-mono text-caption tracking-mono text-muted">Community signal</p>
                        <p class="mt-2 font-display text-heading-sm text-fg">★ {{ live.stars }}</p>
                        <p class="mt-1 font-mono text-caption tracking-mono text-muted">{{ live.forks }} forks</p>
                      </div>
                      <div class="bg-surface p-4">
                        <p class="font-mono text-caption tracking-mono text-muted">Last push</p>
                        <p class="mt-2 font-display text-heading-sm text-fg">{{ formatDate(live.updatedAt) }}</p>
                        <p class="mt-1 font-mono text-caption tracking-mono text-muted">default branch</p>
                      </div>
                    </div>
                    <div class="mt-6 space-y-3">
                      @for (language of live.languages; track language.name) {
                        <div class="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 font-mono text-caption tracking-mono">
                          <span class="text-fg">{{ language.name }}</span>
                          <div class="h-2 overflow-hidden rounded-full bg-fg/10"><div class="h-full rounded-full bg-accent" [style.width.%]="language.percent"></div></div>
                          <span class="text-right text-muted">{{ language.percent }}%</span>
                        </div>
                      }
                    </div>
                  </section>

                  <section id="diff" class="scroll-mt-8 mt-14">
                    <div class="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p class="font-mono text-caption tracking-mono text-accent">REPOSITORY SIGNAL</p>
                        <h2 class="mt-2 font-display text-heading-sm text-fg">A living codebase</h2>
                      </div>
                      <span class="font-mono text-caption tracking-mono text-muted">context, not noise</span>
                    </div>
                    <div class="signal-grid mt-5 grid gap-3 sm:grid-cols-3">
                      <div class="signal-card group rounded-md bg-surface p-4 shadow-border">
                        <div class="flex items-center justify-between"><span class="font-mono text-caption tracking-mono text-muted">Source surface</span><span class="signal-dot" data-tooltip="Live GitHub metadata" aria-hidden="true"></span></div>
                        <p class="mt-5 font-display text-heading-sm text-accent">{{ live.filesCounted }}</p>
                        <p class="mt-1 font-mono text-caption tracking-mono text-muted">files in the useful set</p>
                        <div class="data-bar mt-4"><span [style.width.%]="math.min(live.filesCounted * 4, 100)"></span></div>
                      </div>
                      <div class="signal-card group rounded-md bg-surface p-4 shadow-border">
                        <div class="flex items-center justify-between"><span class="font-mono text-caption tracking-mono text-muted">Language mix</span><span class="signal-dot" data-tooltip="Measured in repository bytes" aria-hidden="true"></span></div>
                        <p class="mt-5 font-display text-heading-sm text-fg">{{ live.languages.length }}</p>
                        <p class="mt-1 font-mono text-caption tracking-mono text-muted">languages detected</p>
                        <div class="mt-4 flex h-2 gap-0.5 overflow-hidden rounded-full bg-fg/10">
                          @for (language of live.languages; track language.name) { <span class="data-bar-segment" [style.width.%]="language.percent" [attr.title]="language.name + ' ' + language.percent + '%'" ></span> }
                        </div>
                      </div>
                      <div class="signal-card group rounded-md bg-surface p-4 shadow-border">
                        <div class="flex items-center justify-between"><span class="font-mono text-caption tracking-mono text-muted">Latest movement</span><span class="signal-dot" data-tooltip="Most recent public commit" aria-hidden="true"></span></div>
                        @if (live.latestCommit; as commit) {
                          <p class="mt-5 line-clamp-2 font-serif text-body text-fg">{{ commit.message }}</p>
                          <p class="mt-2 font-mono text-caption tracking-mono text-muted">{{ commit.sha }} · {{ formatDate(commit.date) }}</p>
                        } @else {
                          <p class="mt-5 font-serif text-body text-muted">No recent public movement found.</p>
                        }
                      </div>
                    </div>
                    @if (live.latestCommit; as commit) {
                      <div class="change-set mt-8 overflow-hidden rounded-md border border-fg/10 bg-surface/50 shadow-border">
                        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-fg/10 px-4 py-3">
                          <div><p class="font-mono text-caption tracking-mono text-accent">CHANGE SET</p><p class="mt-1 font-serif text-body text-fg">{{ commit.message }}</p></div>
                          <span class="rounded-full bg-accent/10 px-2 py-1 font-mono text-caption tracking-mono text-accent">{{ commit.sha }}</span>
                        </div>
                        <div class="divide-y divide-fg/10">
                          @for (file of live.diffFiles; track file.filename) {
                            <div class="diff-file group grid gap-3 px-4 py-3 sm:grid-cols-[1.5rem_minmax(0,1fr)_7rem] sm:items-center">
                              <span class="font-mono text-caption tracking-mono" [class]="file.status === 'added' ? 'text-[#79d6a3]' : file.status === 'removed' ? 'text-[#f18b9a]' : 'text-accent'">{{ file.status === 'added' ? 'A' : file.status === 'removed' ? 'D' : 'M' }}</span>
                              <div class="min-w-0"><p class="truncate font-mono text-caption tracking-mono text-fg" [attr.title]="file.filename">{{ file.filename }}</p><div class="change-track mt-2"><span [style.width.%]="math.min(file.additions * 2, 100)"></span></div></div>
                              <div class="text-right font-mono text-caption tracking-mono"><span class="text-[#79d6a3]">+{{ file.additions }}</span><span class="ml-2 text-[#f18b9a]">-{{ file.deletions }}</span></div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </section>
                }

                <section id="highlights" class="scroll-mt-8 mt-14">
                  <h2 class="font-display text-heading-sm text-fg">What is inside</h2>
                  <ul class="mt-5 space-y-3">
                    @for (item of p.highlights; track item) {
                      <li class="flex gap-3 font-serif text-body text-muted">
                        <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
                        {{ item }}
                      </li>
                    }
                  </ul>
                </section>

                <section id="lesson" class="scroll-mt-8 mt-14 border-t border-fg/10 pt-8">
                  <h2 class="font-display text-heading-sm text-fg">What it taught me</h2>
                  <p class="mt-4 max-w-prose font-serif text-lede text-muted">{{ p.learned }}</p>
                </section>
              </article>

              <aside class="project-reveal self-start xl:sticky xl:top-8">
                <div class="rounded-md border border-fg/10 bg-surface/60 p-4">
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-mono text-caption tracking-mono text-accent">PROJECT CONTEXT</span>
                    <span class="size-2 rounded-full bg-accent" aria-label="Active project"></span>
                  </div>
                  <dl class="mt-5 space-y-4 font-mono text-caption tracking-mono">
                    <div>
                      <dt class="text-muted">Status</dt>
                      <dd class="mt-1 text-fg">{{ p.meta }}</dd>
                    </div>
                    @if (p.href) {
                      <div>
                        <dt class="text-muted">Repository</dt>
                        <dd class="mt-1 break-all text-fg">{{ p.href.replace('https://github.com/', '') }}</dd>
                      </div>
                    }
                    @if (stats(); as live) {
                      <div>
                        <dt class="text-muted">Useful lines</dt>
                        <dd class="mt-1 text-fg">{{ live.usefulLines.toLocaleString() }} <span class="text-muted">/ {{ live.filesCounted }} source files</span></dd>
                      </div>
                      <div>
                        <dt class="text-muted">GitHub</dt>
                        <dd class="mt-1 text-fg">★ {{ live.stars }} <span class="text-muted">· {{ live.forks }} forks</span></dd>
                      </div>
                      <div>
                        <dt class="text-muted">Last push</dt>
                        <dd class="mt-1 text-fg">{{ formatDate(live.updatedAt) }}</dd>
                      </div>
                    } @else if (loading()) {
                      <div>
                        <dt class="text-muted">GitHub stats</dt>
                        <dd class="mt-1 text-accent">Reading repository…</dd>
                      </div>
                    }
                  </dl>
                  @if (stats(); as live) {
                    <div class="mt-5 border-t border-fg/10 pt-4">
                      <p class="font-mono text-caption tracking-mono text-muted">Languages by bytes</p>
                      <ul class="mt-2 space-y-2">
                        @for (language of live.languages; track language.name) {
                          <li class="flex items-center gap-2 font-mono text-caption tracking-mono">
                            <span class="h-1.5 rounded-full bg-accent" [style.width.%]="language.percent"></span>
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
                    <a [href]="p.href" target="_blank" rel="noreferrer" class="mt-6 inline-flex items-center gap-2 font-mono text-caption tracking-mono text-accent hover:underline">
                      View repository
                      <svg appIcon="arrow-up-right" class="size-3.5"></svg>
                    </a>
                  } @else {
                    <p class="mt-6 font-mono text-caption tracking-mono text-muted">Not started yet — no repository to show.</p>
                  }
                </div>
              </aside>
            </div>
          </main>
        </div>
      } @else {
        <main class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p class="font-serif text-subhead text-fg">Project not found.</p>
          <button type="button" class="mt-4 font-mono text-caption tracking-mono text-accent hover:underline" (click)="goBack($event)">← Back to Projects</button>
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
  private router = inject(Router);
  private observer: IntersectionObserver | null = null;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  protected readonly ui = UI;
  protected readonly headings: TocItem[] = [
    { n: "01", href: "#overview", label: "Overview" },
    { n: "02", href: "#story", label: "README" },
    { n: "03", href: "#metrics", label: "Metrics" },
    { n: "04", href: "#diff", label: "Git diff" },
    { n: "05", href: "#highlights", label: "Inside" },
    { n: "06", href: "#lesson", label: "Lesson" },
  ];

  project = computed(() => [...PROJECTS, ...FUTURE_PROJECTS].find((item) => item.id === this.id()));

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const current = this.project();
    this.title.setTitle(current ? `${current.name} · Alessandro Bruno` : "Project not found · Alessandro Bruno");
    if (!current) return;
    this.loading.set(true);
    this.timeout = setTimeout(() => {
      this.loading.set(false);
      setTimeout(() => this.setupObserver(), 0);
    }, 6500);
    loadGithubProjectStats(current.href)
      .then((stats) => {
        if (!this.loading()) return;
        this.stats.set(stats);
        this.loading.set(false);
        setTimeout(() => this.setupObserver(), 0);
      })
      .catch(() => this.loading.set(false));
  }

  ngAfterViewInit() {
    this.setupObserver();
  }

  private setupObserver() {
    if (this.observer) return;
    const sections = ["overview", "story", "metrics", "diff", "highlights", "lesson"]
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
  }

  formatDate(iso: string) {
    return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(iso));
  }

  patchLines(patch: string) {
    return patch.split("\\n").filter((line) => !line.startsWith("@@")).slice(0, 28);
  }

  goBack(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(["/"], { fragment: "projects" }).then(() => {
      window.setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 0);
    });
  }
}
