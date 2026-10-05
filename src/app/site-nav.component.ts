import { ApplicationRef, Component, HostListener, OnInit, computed, inject, input, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ThemeClockComponent } from "./theme-clock.component";
import { PROFILE, TOC, UI, lang, setLanguage, type Lang } from "../lib/site";

/** Fixed top bar on every page: the metallic mark, section links, language, theme, email. */
@Component({
  selector: "app-site-nav",
  standalone: true,
  imports: [IconComponent, ThemeClockComponent],
  template: `
    <header class="site-nav" [class.is-scrolled]="scrolled()" [class.is-open]="menuOpen()">
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
          <div class="lang-toggle" role="group" [attr.aria-label]="ui.tocLanguages">
            <button type="button" (click)="setLang('en')" [attr.aria-pressed]="lang() === 'en'" lang="en">EN</button>
            <button type="button" (click)="setLang('it')" [attr.aria-pressed]="lang() === 'it'" lang="it">IT</button>
          </div>
          <app-theme-clock />
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
    if (typeof window !== "undefined") this.scrolled.set(window.scrollY > 8);
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
