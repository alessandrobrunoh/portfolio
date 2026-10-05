import { ApplicationRef, Component, HostListener, OnInit, computed, inject, input, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ThemeToggleComponent } from "./theme-toggle.component";
import { PROFILE, TOC, UI, lang, setLanguage, type Lang } from "../lib/site";

/** Fixed top bar on every page: the metallic mark, section links, language, theme, email. */
@Component({
  selector: "app-site-nav",
  standalone: true,
  imports: [IconComponent, ThemeToggleComponent],
  template: `
    <header class="site-nav" [class.is-scrolled]="scrolled()" [class.is-hidden]="hidden() && !menuOpen()" [class.is-open]="menuOpen()">
      <div class="container-x site-nav-inner">
        <a [href]="home() ? '#intro' : '/'" class="site-brand" (click)="menuOpen.set(false)">
          <img src="/brand/ab-monogram-metallic-160.webp" alt="" width="160" height="116" />
          <span class="brand-wordmark hidden xl:inline" aria-hidden="true">{{ profile.name }}</span>
          <span class="sr-only">{{ profile.name }} — home</span>
        </a>

        <nav [attr.aria-label]="lang() === 'it' ? 'Sezioni' : 'Sections'" class="site-nav-links hidden lg:flex">
          @for (item of links(); track item.href) {
            <a
              [href]="linkFor(item.href)"
              class="site-nav-link"
              [class.is-active]="active() === item.href"
              [attr.aria-current]="active() === item.href ? 'location' : null"
            >
              <span class="n">{{ item.n }}</span>{{ item.label }}
            </a>
          }
        </nav>

        <div class="flex items-center gap-2">
          <div class="nav-controls">
            <button
              type="button"
              class="nav-ctl lang-roll"
              (click)="setLang(lang() === 'it' ? 'en' : 'it')"
              [attr.data-lang]="lang()"
              [attr.aria-label]="lang() === 'it' ? 'Switch to English' : 'Passa all’italiano'"
              [attr.title]="lang() === 'it' ? 'Switch to English' : 'Passa all’italiano'"
            >
              <svg appIcon="globe" class="lang-roll-globe size-4"></svg>
              <span class="lang-roll-track" aria-hidden="true"><span lang="en">EN</span><span lang="it">IT</span></span>
            </button>
            <span class="nav-controls-sep" aria-hidden="true"></span>
            <app-theme-toggle />
          </div>
          <a [href]="'mailto:' + profile.email" class="btn btn-primary btn-sm hidden sm:inline-flex">
            <svg appIcon="mail" class="size-3.5"></svg>
            {{ lang() === 'it' ? 'Scrivimi' : 'Email me' }}
          </a>
          <button
            type="button"
            class="icon-btn lg:hidden"
            (click)="menuOpen.set(!menuOpen())"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="site-nav-sheet"
            [attr.aria-label]="menuOpen() ? ui.closeMenu : ui.openMenu"
          >
            <svg [appIcon]="menuOpen() ? 'x' : 'menu'" class="size-5"></svg>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <div id="site-nav-sheet" class="site-nav-sheet lg:hidden">
          <nav class="container-x" [attr.aria-label]="lang() === 'it' ? 'Sezioni' : 'Sections'">
            @for (item of links(); track item.href) {
              <a [href]="linkFor(item.href)" class="sheet-link" (click)="menuOpen.set(false)">
                <span class="n">{{ item.n }}</span>{{ item.label }}
              </a>
            }
            <div class="mt-6 flex flex-wrap gap-2">
              <a [href]="'mailto:' + profile.email" class="btn btn-primary">
                <svg appIcon="mail" class="size-4"></svg>{{ profile.email }}
              </a>
              <a [href]="profile.github" target="_blank" rel="noreferrer" class="btn btn-ghost">
                <svg appIcon="github" class="size-4"></svg>GitHub
              </a>
            </div>
          </nav>
        </div>
      }
    </header>
  `,
})
export class SiteNavComponent implements OnInit {
  /** Active section href on the home page (`#projects`); empty elsewhere. */
  active = input<string>("");
  /** On the home page links are in-page anchors; on subpages they point back to `/#…`. */
  home = input<boolean>(true);

  protected readonly profile = PROFILE;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  /** Tucks away while reading down, comes back on any scroll up. */
  protected readonly hidden = signal(false);
  private lastY = 0;
  private readonly appRef = inject(ApplicationRef);

  // The brand mark already leads to the intro, so the bar lists the sections after it.
  protected readonly links = computed(() => {
    lang();
    return TOC.filter((item) => item.href !== "#intro");
  });

  ngOnInit() {
    this.onScroll();
  }

  @HostListener("window:scroll")
  onScroll() {
    if (typeof window === "undefined") return;
    const y = window.scrollY;
    this.scrolled.set(y > 8);
    if (Math.abs(y - this.lastY) < 6) return;
    this.hidden.set(y > this.lastY && y > 320);
    this.lastY = y;
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    this.menuOpen.set(false);
  }

  protected linkFor(href: string) {
    return this.home() ? href : `/${href}`;
  }

  protected setLang(next: Lang) {
    setLanguage(next);
    this.appRef.tick();
  }
}
