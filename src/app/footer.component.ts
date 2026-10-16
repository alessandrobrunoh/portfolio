import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { PROFILE, TOC, lang } from "../lib/site";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [IconComponent, RouterLink],
  template: `
    <footer class="site-footer" [class.is-expanded]="expanded()">
      <div class="site-footer-shell">
        <div class="footer-card">
          <div class="footer-grid">
            <!-- Left Column: Brand Identity & Descriptive Closing -->
            <div class="footer-brand-col">
              <div class="flex items-center gap-3.5">
                <a href="#intro" class="footer-mark-link" [attr.aria-label]="profile.name">
                  <img class="footer-logo dark:hidden" src="/brand/ab-monogram.webp" alt="" width="160" height="111" loading="lazy" />
                  <img class="footer-logo hidden dark:block" src="/brand/ab-monogram-white-160.webp" alt="" width="160" height="111" loading="lazy" />
                </a>
                <div>
                  <p class="brand-wordmark text-caption text-fg">{{ profile.name }}</p>
                  <p class="mt-0.5 font-mono text-caption text-accent">
                    {{ lang() === 'it' ? 'Ingegnere del Software Full-Spectrum' : 'Full-Spectrum Software Engineer' }}
                  </p>
                </div>
              </div>

              <h3 class="mt-5 text-title font-semibold tracking-tight text-fg">
                {{
                  lang() === 'it'
                    ? 'Costruisco sistemi che restano chiari, veloci e affidabili in produzione'
                    : 'Building systems that stay clear, fast, and reliable in production'
                }}<span class="brand-dot" aria-hidden="true">.</span>
              </h3>

              <p class="mt-2.5 max-w-xl text-body text-muted leading-relaxed">
                {{
                  lang() === 'it'
                    ? 'Dagli agenti AI e server MCP in Rust alle architetture distribuite event-driven, fino alle interfacce web/mobile e alle simulazioni multiplayer. Se stai cercando qualcuno che segua un prodotto da capo a capo, parliamone.'
                    : 'From AI agents and Rust MCP servers to event-driven distributed backends, web/mobile interfaces, and multiplayer simulations. If you need someone who can own a system end to end, let’s talk.'
                }}
              </p>

              <div class="mt-6 flex flex-wrap items-center gap-3">
                <a [href]="'mailto:' + profile.email" class="btn btn-primary">
                  <svg appIcon="mail" class="size-4"></svg>
                  <span>{{ profile.email }}</span>
                </a>
                <a href="/alessandro-bruno-cv.pdf" download class="btn btn-ghost">
                  <svg appIcon="download" class="size-4"></svg>
                  <span>{{ lang() === 'it' ? 'Scarica il CV (PDF)' : 'Download CV (PDF)' }}</span>
                </a>
                <button type="button" (click)="openShortcuts()" class="btn btn-ghost">
                  <span>{{ lang() === 'it' ? 'Scorciatoie' : 'Shortcuts' }}</span>
                  <kbd class="kbd-cap ml-0.5">?</kbd>
                </button>
              </div>
            </div>

            <!-- Right Columns: Structured Sitemap & Direct Channels -->
            <div class="footer-links-grid">
              <div>
                <p class="font-mono text-micro uppercase tracking-wider text-faint">
                  {{ lang() === 'it' ? 'Navigazione' : 'Navigation' }}
                </p>
                <ul class="mt-3 space-y-2.5 text-small">
                  @for (item of toc; track item.href) {
                    <li>
                      <a [href]="'/' + item.href" class="footer-nav-link">
                        <span class="font-mono text-caption text-accent">{{ item.n }}</span>
                        <span>{{ item.label }}</span>
                      </a>
                    </li>
                  }
                </ul>
              </div>

              <div>
                <p class="font-mono text-micro uppercase tracking-wider text-faint">
                  {{ lang() === 'it' ? 'Risorse & Profili' : 'Resources & Profiles' }}
                </p>
                <ul class="mt-3 space-y-2.5 text-small">
                  <li>
                    <a routerLink="/brand" class="footer-nav-link">
                      <span>ab. Brand Guidelines</span>
                      <svg appIcon="arrow-up-right" class="size-3.5 text-faint"></svg>
                    </a>
                  </li>
                  <li>
                    <a [href]="profile.github" target="_blank" rel="noreferrer" class="footer-nav-link">
                      <span>GitHub</span>
                      <svg appIcon="arrow-up-right" class="size-3.5 text-faint"></svg>
                    </a>
                  </li>
                  <li>
                    <a href="/alessandro-bruno-cv.pdf" download class="footer-nav-link">
                      <span>{{ lang() === 'it' ? 'Curriculum Vitae' : 'Resume / CV' }}</span>
                      <svg appIcon="download" class="size-3.5 text-faint"></svg>
                    </a>
                  </li>
                  @if (profile.x) {
                    <li>
                      <a [href]="'https://x.com/' + profile.x" target="_blank" rel="noreferrer" class="footer-nav-link">
                        <span>X / &#64;{{ profile.x }}</span>
                        <svg appIcon="arrow-up-right" class="size-3.5 text-faint"></svg>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="flex flex-wrap items-center gap-3">
              <span class="live-dot" aria-hidden="true"></span>
              <span>© {{ year }} {{ profile.name }} · {{ profile.location }}</span>
            </div>

            <button type="button" (click)="scrollToTop()" class="footer-top-btn">
              <span>{{ lang() === 'it' ? 'Torna all’inizio' : 'Back to top' }}</span>
              <svg appIcon="arrow-up" class="size-3.5"></svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  protected readonly profile = PROFILE;
  protected readonly lang = lang;
  protected readonly toc = TOC;
  protected readonly year = new Date().getFullYear();
  protected readonly expanded = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      this.expanded.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.expanded.set(entry.isIntersecting && entry.intersectionRatio >= 0.25);
        }
      },
      { threshold: [0, 0.25, 0.55] },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  openShortcuts() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
    }
  }
}
