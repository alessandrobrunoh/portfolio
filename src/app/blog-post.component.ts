import { AfterViewInit, Component, OnDestroy, computed, inject, input, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
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
                @if (p.body[3]; as note) {
                  <section id="notes" class="scroll-mt-8 border-t border-fg/10 pt-8">
                    <h2 class="font-display text-subhead text-fg">Field note</h2>
                    <p class="mt-3">{{ note }}</p>
                  </section>
                }
                @if (p.slug === 'publishing-a-crate-without-an-audience') {
                  <section class="article-visual article-chart mt-10 rounded-md border border-fg/10 bg-surface p-4 font-mono text-caption tracking-mono text-muted" aria-label="API adoption chart">
                    <div class="flex items-center justify-between border-b border-fg/10 pb-3"><span class="text-accent">adoption / first 8 weeks</span><span>ducklake-orm</span></div>
                    <div class="mt-5 flex h-32 items-end gap-2">
                      @for (height of [18, 26, 31, 46, 52, 68, 78, 94]; track height; let i = $index) {
                        <div class="article-chart-bar" [style.height.%]="height" [style.animation-delay.ms]="i * 70"><span>{{ i + 1 }}</span></div>
                      }
                    </div>
                    <p class="mt-3 text-fg/55">The useful signal was not raw downloads. It was the moment examples started looking like real applications.</p>
                  </section>
                } @else if (p.slug === 'what-i-got-wrong-about-event-buses') {
                  <pre class="article-code mt-10 overflow-x-auto rounded-md p-4 font-mono text-small leading-6" aria-label="Event processing code example"><code><span class="code-muted">// delivered is not processed</span>
<span class="code-keyword">let</span> message = stream.read().<span class="code-function">await</span>?;
<span class="code-keyword">if</span> (worker.handle(&amp;message).<span class="code-function">await</span>?) &#123;
  stream.<span class="code-function">ack</span>(message.id).<span class="code-function">await</span>?;
&#125;</code></pre>
                  <div class="article-callout mt-4 rounded-md border border-accent/20 bg-accent/5 p-4 font-serif text-small text-muted">The acknowledgement belongs after the side effect, not after the read. That one line is where delivery becomes a system you can reason about.</div>
                } @else {
                  <section class="article-diff mt-10 overflow-hidden rounded-md border border-fg/10 bg-surface font-mono text-caption tracking-mono" aria-label="Pull request diff">
                    <div class="flex items-center justify-between border-b border-fg/10 px-4 py-3"><span class="text-accent">extensions/jdl · pull request</span><span class="text-muted">+18 −4</span></div>
                    <div class="space-y-1 px-4 py-4 text-small leading-6"><p><span class="mr-3 text-fg/35">@@</span><span class="text-muted">grammar fixture / parser recovery</span></p><p><span class="mr-3 text-[#65b891]">+</span><span class="text-fg">add fixture for nested entity declarations</span></p><p><span class="mr-3 text-[#d77d8a]">−</span><span class="text-fg/60">skip malformed input silently</span></p><p><span class="mr-3 text-[#65b891]">+</span><span class="text-fg">assert diagnostic points to the token</span></p></div>
                  </section>
                }
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
  private readonly title = inject(Title);

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
    const current = this.post();
    this.title.setTitle(current ? `${current.title} · Alessandro Bruno` : "Post not found · Alessandro Bruno");
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
