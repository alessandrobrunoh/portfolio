import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ContactComponent } from "./contact.component";
import { ExperienceComponent } from "./experience.component";
import { FooterComponent } from "./footer.component";
import { IconComponent } from "./icon.component";
import { IntroComponent } from "./intro.component";
import { ProjectsComponent } from "./projects.component";
import { ApproachComponent } from "./approach.component";
import { SiteNavComponent } from "./site-nav.component";
import { TOC, UI, lang } from "../lib/site";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    ContactComponent,
    ExperienceComponent,
    FooterComponent,
    IconComponent,
    IntroComponent,
    ProjectsComponent,
    SiteNavComponent,
    ApproachComponent,
  ],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      <a
        href="#intro"
        class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-small focus:text-fg"
      >
        {{ ui.skipToContent }}
      </a>
      <app-site-nav [active]="active()" />
      <main>
        <app-intro />
        <app-experience />
        <app-projects />
        <app-approach />
        <app-contact />
      </main>
      <app-footer />

      <button
        type="button"
        (click)="scrollToTop()"
        [class]="showScrollTop() ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'"
        class="scroll-top"
        [attr.aria-label]="lang() === 'it' ? 'Torna in cima' : 'Scroll back to top'"
      >
        <svg appIcon="arrow-up" class="size-4"></svg>
      </button>
    </div>
  `,
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  active = signal("#intro");
  showScrollTop = signal(false);

  protected readonly ui = UI;
  protected readonly lang = lang;
  private revealObserver: IntersectionObserver | null = null;
  private readonly title = inject(Title);

  @HostListener("window:scroll")
  onWindowScroll() {
    if (typeof window === "undefined") return;
    this.showScrollTop.set(window.scrollY > 400);
    this.updateActiveSection();
  }

  private updateActiveSection() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const anchor = window.innerHeight * 0.28;
    let current = "#intro";

    for (const item of TOC) {
      const id = item.href.slice(1);
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= anchor) {
        current = item.href;
      }
    }

    // If user scrolled all the way to the bottom, activate the last section (#contact)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48) {
      const last = TOC[TOC.length - 1];
      if (last) current = last.href;
    }

    if (this.active() !== current) {
      this.active.set(current);
    }
  }

  scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  ngOnInit() {
    this.title.setTitle("Alessandro Bruno — Software Engineer");
  }

  ngAfterViewInit() {
    this.updateActiveSection();
    this.setupRevealObserver();
  }

  private setupRevealObserver() {
    if (typeof document === "undefined") return;
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
    this.revealObserver?.disconnect();
  }
}
