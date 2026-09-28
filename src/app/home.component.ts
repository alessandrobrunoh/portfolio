import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ContactComponent } from "./contact.component";
import { ExperienceComponent } from "./experience.component";
import { FooterComponent } from "./footer.component";
import { IconComponent } from "./icon.component";
import { IntroComponent } from "./intro.component";
import { OpenSourceComponent } from "./open-source.component";
import { ProjectsComponent } from "./projects.component";
import { StackComponent } from "./stack.component";
import { TocComponent } from "./toc.component";
import { TOC, UI } from "../lib/site";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    ContactComponent,
    ExperienceComponent,
    FooterComponent,
    IconComponent,
    IntroComponent,
    OpenSourceComponent,
    ProjectsComponent,
    StackComponent,
    TocComponent,
  ],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      <a
        href="#intro"
        class="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:block focus:bg-surface focus:px-3 focus:py-2 focus:text-body focus:text-fg"
      >
        {{ ui.skipToContent }}
      </a>
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-12">
        <app-toc [active]="active()" />
        <main>
          <app-intro />
          <app-projects />
          <app-experience />
          <app-open-source />
          <app-stack />
          <app-contact />
          <app-footer />
        </main>
      </div>

      <!-- Floating Quick Scroll-to-Top Button -->
      <button
        type="button"
        (click)="scrollToTop()"
        [class]="
          showScrollTop()
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        "
        class="fixed bottom-6 right-6 z-40 inline-flex size-10 items-center justify-center rounded-full bg-surface text-fg shadow-lift border border-fg/15 transition-all duration-300 hover:text-accent hover:border-accent/40 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
        aria-label="Scroll back to top"
      >
        <svg appIcon="arrow-up" class="size-4 transition-transform duration-200 hover:-translate-y-0.5"></svg>
      </button>
    </div>
  `,
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  active = signal("#intro");
  showScrollTop = signal(false);
  protected readonly ui = UI;
  private observer: IntersectionObserver | null = null;
  private revealObserver: IntersectionObserver | null = null;
  private readonly title = inject(Title);

  @HostListener("window:scroll")
  onWindowScroll() {
    if (typeof window !== "undefined") {
      this.showScrollTop.set(window.scrollY > 400);
    }
  }

  scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  ngOnInit() {
    this.title.setTitle("Alessandro Bruno — Systems & Product Engineer");
    const ids = TOC.map((item) => item.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

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
      { rootMargin: "-15% 0px -65% 0px", threshold: [0.1, 0.4] },
    );

    for (const el of els) this.observer.observe(el);
  }

  ngAfterViewInit() {
    this.setupRevealObserver();
  }

  private setupRevealObserver() {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    if (revealItems.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      for (const item of revealItems) item.classList.add("is-visible");
      return;
    }
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            this.revealObserver?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const item of revealItems) this.revealObserver.observe(item);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.revealObserver?.disconnect();
  }
}
