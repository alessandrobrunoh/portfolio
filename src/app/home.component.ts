import { AfterViewInit, Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { BlogComponent } from "./blog.component";
import { ContactComponent } from "./contact.component";
import { ExperienceComponent } from "./experience.component";
import { FooterComponent } from "./footer.component";
import { IntroComponent } from "./intro.component";

import { OpenSourceComponent } from "./open-source.component";
import { ProjectsComponent } from "./projects.component";
import { PulseComponent } from "./pulse.component";
import { StackComponent } from "./stack.component";
import { TocComponent } from "./toc.component";
import { TOC, UI } from "../lib/site";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    BlogComponent,
    ContactComponent,
    ExperienceComponent,
    FooterComponent,
    IntroComponent,

    OpenSourceComponent,
    ProjectsComponent,
    PulseComponent,
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
          <app-experience />
          <app-projects />
          <app-open-source />
          <app-stack />
          <app-pulse />
          <app-blog />
          <app-contact />
          <app-footer />
        </main>
      </div>
    </div>
  `,
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  active = signal("#intro");
  protected readonly ui = UI;
  private observer: IntersectionObserver | null = null;
  private revealObserver: IntersectionObserver | null = null;
  private readonly title = inject(Title);

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
