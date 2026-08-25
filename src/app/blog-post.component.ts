import { AfterViewInit, Component, OnDestroy, computed, inject, input, signal } from "@angular/core";
import { Router } from "@angular/router";

import { KeybindComponent } from "./keybind.component";
import { TocComponent } from "./toc.component";
import { BLOG, PROFILE, UI, lang } from "../lib/site";
import type { TocItem } from "../lib/site.types";

@Component({
  selector: "app-blog-post",
  standalone: true,
  imports: [KeybindComponent, TocComponent],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      @if (post(); as p) {
        <div class="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-12">
          <app-toc [items]="headingToc()" [active]="active()" />
          <main id="article" class="min-w-0">
            <a
              href="/"
              (click)="goBack($event)"
              class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-fg"
            >
              {{ ui.backToBlog }}
            </a>

            <article class="mt-8 max-w-3xl">
              <p class="stagger-in font-mono text-caption tracking-mono text-accent">{{ p.subtitle }}</p>
              <h1 id="article-title" class="stagger-in mt-2 font-display text-heading-sm text-fg sm:text-heading">{{ p.title }}</h1>
              <app-keybind class="stagger-in mt-4 inline-flex">{{ p.status }}</app-keybind>

              <div class="stagger-in mt-10 max-w-prose space-y-8 font-serif text-lede text-muted">
                <section id="context" class="scroll-mt-8">
                  <h2 class="font-display text-subhead text-fg">{{ sectionLabels[0] }}</h2>
                  <p class="mt-3">{{ p.body[0] }}</p>
                </section>
                <section id="practice" class="scroll-mt-8">
                  <h2 class="font-display text-subhead text-fg">{{ sectionLabels[1] }}</h2>
                  <p class="mt-3">{{ p.body[1] }}</p>
                  <h3 id="detail" class="mt-8 font-display text-body text-fg">{{ sectionLabels[2] }}</h3>
                  <p class="mt-3">{{ p.body[2] }}</p>
                </section>
              </div>
            </article>
          </main>
        </div>
      } @else {
        <main class="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:py-16">
          <p class="font-serif text-subhead text-fg">{{ ui.postNotFound }}</p>
          <a href="/" (click)="goBack($event)" class="mt-4 inline-flex font-mono text-caption tracking-mono text-accent hover:underline">{{ ui.backToBlog }}</a>
        </main>
      }
    </div>
  `,
})
export class BlogPostComponent implements AfterViewInit, OnDestroy {
  slug = input<string>("");
  active = signal("#article-title");
  protected readonly profile = PROFILE;
  protected readonly ui = UI;
  private observer: IntersectionObserver | null = null;
  private router = inject(Router);

  post = computed(() => {
    lang();
    return BLOG.find((p) => p.slug === this.slug()) ?? null;
  });

  headingToc = computed<TocItem[]>(() => {
    const p = this.post();
    if (!p) return [];
    return [
      { n: "01", href: "#article-title", label: p.title },
      { n: "02", href: "#context", label: this.sectionLabels[0] },
      { n: "03", href: "#practice", label: this.sectionLabels[1] },
      { n: "04", href: "#detail", label: this.sectionLabels[2] },
    ];
  });

  get sectionLabels() {
    return lang() === "it" ? ["Contesto", "Sul campo", "Dettaglio"] : ["Context", "In practice", "A closer look"];
  }

  goBack(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(["/"], { fragment: "blog" }).then(() => {
      window.setTimeout(() => document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" }), 0);
    });
  }

  ngAfterViewInit() {
    const headings = ["article-title", "context", "practice", "detail"]
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (headings.length === 0) return;

    const visible = new Map<string, number>();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (top) this.active.set(`#${top[0]}`);
      },
      { rootMargin: "-16% 0px -65% 0px", threshold: [0.1, 0.4] },
    );
    for (const heading of headings) this.observer.observe(heading);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
