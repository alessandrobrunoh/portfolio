import { ApplicationRef, Component, ElementRef, HostListener, OnInit, computed, inject, input, signal, viewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { ThemeToggleComponent } from "./theme-toggle.component";
import { LOGO_SVG, WORDMARK_SVG, copySvg } from "../lib/brand";
import { PROFILE, TOC, UI, lang, setLanguage, type Lang } from "../lib/site";

/** Fixed top bar on every page: the metallic mark, section links, language, theme, email. */
@Component({
  selector: "app-site-nav",
  standalone: true,
  imports: [IconComponent, RouterLink, ThemeToggleComponent],
  template: `
    <header class="site-nav" [class.is-scrolled]="scrolled()" [class.is-hidden]="hidden() && !menuOpen()" [class.is-open]="menuOpen()">
      <div class="container-x site-nav-inner">
        <div class="relative">
          <a
            #brand
            [href]="home() ? '#intro' : '/'"
            class="site-brand"
            (click)="menuOpen.set(false)"
            (contextmenu)="openBrandMenu($event)"
            [attr.aria-haspopup]="'menu'"
            [attr.aria-expanded]="brandMenu()"
          >
            <img src="/brand/ab-monogram-metallic-160.webp" alt="" width="160" height="116" />
            <span class="brand-wordmark hidden xl:inline" aria-hidden="true">{{ profile.name }}</span>
            <span class="sr-only">{{ profile.name }} — home</span>
          </a>

          <!-- Right-click (or the context-menu key) on the mark: brand assets, like a product logo. -->
          @if (brandMenu()) {
            <div #brandMenuEl class="brand-menu" role="menu" [attr.aria-label]="lang() === 'it' ? 'Risorse del brand' : 'Brand assets'" (keydown)="onMenuKey($event)">
              <button type="button" role="menuitem" class="brand-menu-item" (click)="copy('logo')">
                <svg [appIcon]="copied() === 'logo' ? 'check' : 'copy'" class="size-4" [class.text-accent]="copied() === 'logo'"></svg>
                <span>{{ copied() === 'logo' ? (lang() === 'it' ? 'Copiato' : 'Copied') : (lang() === 'it' ? 'Copia logo come SVG' : 'Copy logo as SVG') }}</span>
              </button>
              <button type="button" role="menuitem" class="brand-menu-item" (click)="copy('wordmark')">
                <svg [appIcon]="copied() === 'wordmark' ? 'check' : 'copy'" class="size-4" [class.text-accent]="copied() === 'wordmark'"></svg>
                <span>{{ copied() === 'wordmark' ? (lang() === 'it' ? 'Copiato' : 'Copied') : (lang() === 'it' ? 'Copia wordmark come SVG' : 'Copy wordmark as SVG') }}</span>
              </button>
              <span class="brand-menu-sep" role="separator"></span>
              <a role="menuitem" class="brand-menu-item" routerLink="/brand" (click)="closeBrandMenu()">
                <svg appIcon="book" class="size-4"></svg>
                <span>{{ lang() === 'it' ? 'Linee guida del brand' : 'Brand guidelines' }}</span>
                <svg appIcon="arrow-right" class="ml-auto size-3.5 opacity-60"></svg>
              </a>
            </div>
          }
        </div>

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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly brandLink = viewChild<ElementRef<HTMLAnchorElement>>("brand");
  private readonly brandMenuEl = viewChild<ElementRef<HTMLElement>>("brandMenuEl");

  protected readonly brandMenu = signal(false);
  protected readonly copied = signal<"logo" | "wordmark" | null>(null);
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

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
    if (this.brandMenu() && Math.abs(y - this.lastY) > 24) this.closeBrandMenu(false);
    if (Math.abs(y - this.lastY) < 6) return;
    this.hidden.set(y > this.lastY && y > 320);
    this.lastY = y;
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    this.menuOpen.set(false);
    if (this.brandMenu()) this.closeBrandMenu();
  }

  @HostListener("document:pointerdown", ["$event"])
  onPointerDown(event: PointerEvent) {
    const menu = this.brandMenuEl()?.nativeElement;
    if (this.brandMenu() && menu && !menu.contains(event.target as Node)) this.closeBrandMenu(false);
  }

  protected openBrandMenu(event: MouseEvent) {
    event.preventDefault();
    this.copied.set(null);
    this.brandMenu.set(true);
    this.hidden.set(false);
    // Focus the first item once it renders, so the keyboard path works too.
    setTimeout(() => this.items()[0]?.focus());
  }

  protected closeBrandMenu(restoreFocus = true) {
    this.brandMenu.set(false);
    clearTimeout(this.copiedTimer);
    if (restoreFocus) this.brandLink()?.nativeElement.focus();
  }

  protected async copy(which: "logo" | "wordmark") {
    try {
      await copySvg(which === "logo" ? LOGO_SVG : WORDMARK_SVG);
      this.copied.set(which);
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.closeBrandMenu(), 900);
    } catch {
      // Clipboard denied or file unreachable: open the file instead so it can be saved by hand.
      window.open(which === "logo" ? LOGO_SVG : WORDMARK_SVG, "_blank", "noopener");
      this.closeBrandMenu();
    }
  }

  protected onMenuKey(event: KeyboardEvent) {
    const items = this.items();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const go = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };
    if (event.key === "ArrowDown") go(index + 1);
    else if (event.key === "ArrowUp") go(index - 1);
    else if (event.key === "Home") go(0);
    else if (event.key === "End") go(items.length - 1);
    else if (event.key === "Tab") this.closeBrandMenu(false);
  }

  private items(): HTMLElement[] {
    const menu = this.brandMenuEl()?.nativeElement ?? this.host.nativeElement.querySelector(".brand-menu");
    return menu ? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
  }

  protected linkFor(href: string) {
    return this.home() ? href : `/${href}`;
  }

  protected setLang(next: Lang) {
    setLanguage(next);
    this.appRef.tick();
  }
}
