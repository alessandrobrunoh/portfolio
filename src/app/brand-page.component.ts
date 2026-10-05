import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { IconComponent } from "./icon.component";
import { SiteNavComponent } from "./site-nav.component";
import { BRAND_ASSETS, LOGO_SVG, WORDMARK_SVG, copySvg, copyText } from "../lib/brand";
import { lang } from "../lib/site";

type Variation = {
  id: string;
  file: string;
  name: { en: string; it: string };
  use: { en: string; it: string };
  surface: "light" | "dark";
  mark: string;
  wordmark: boolean;
  ink: string;
};

const VARIATIONS: Variation[] = [
  { id: "v-full-light", file: "/brand/ab-soft-minimal-full.svg", name: { en: "Full logo (light)", it: "Logo completo (chiaro)" }, use: { en: "Logo + wordmark", it: "Logo + wordmark" }, surface: "light", mark: "/brand/ab-monogram.webp", wordmark: true, ink: "#1f2937" },
  { id: "v-icon-light", file: "/brand/ab-soft-minimal-monogram.svg", name: { en: "Icon only (light)", it: "Solo icona (chiaro)" }, use: { en: "Avatar, favicon, small sizes", it: "Avatar, favicon, formati piccoli" }, surface: "light", mark: "/brand/ab-monogram.webp", wordmark: false, ink: "#1f2937" },
  { id: "v-full-dark", file: "/brand/ab-soft-minimal-full-white.svg", name: { en: "Full logo (dark)", it: "Logo completo (scuro)" }, use: { en: "Dark heroes, footers, banners", it: "Hero scuri, footer, banner" }, surface: "dark", mark: "/brand/ab-monogram-white.webp", wordmark: true, ink: "#ffffff" },
  { id: "v-icon-dark", file: "/brand/ab-soft-minimal-monogram-white.svg", name: { en: "Icon only (dark)", it: "Solo icona (scuro)" }, use: { en: "Dark UI, video, overlays", it: "UI scure, video, overlay" }, surface: "dark", mark: "/brand/ab-monogram-white.webp", wordmark: false, ink: "#ffffff" },
  { id: "v-mono-black", file: "/brand/ab-soft-minimal-full-black.svg", name: { en: "Monochrome (black)", it: "Monocromo (nero)" }, use: { en: "Print, CVs, single-colour use", it: "Stampa, CV, un solo colore" }, surface: "light", mark: "/brand/ab-monogram-black.webp", wordmark: true, ink: "#111827" },
  { id: "v-mono-white", file: "/brand/ab-soft-minimal-monogram-white.svg", name: { en: "Monochrome (white)", it: "Monocromo (bianco)" }, use: { en: "For dark backgrounds", it: "Per sfondi scuri" }, surface: "dark", mark: "/brand/ab-monogram-white.webp", wordmark: false, ink: "#ffffff" },
];

const COLORS = [
  { name: "Primary Blue", hex: "#3B82F6", use: { en: "The dot, links, active states, focus", it: "Il punto, link, stati attivi, focus" } },
  { name: "Soft Gray", hex: "#E8ECF2", use: { en: "Main logo shapes, soft surfaces", it: "Forme del logo, superfici tenui" } },
  { name: "Light Blue Gray", hex: "#D5DCE6", use: { en: "Secondary shades, light borders", it: "Ombreggiature, bordi chiari" } },
  { name: "Deep Ink", hex: "#1F2937", use: { en: "Text, black monochrome", it: "Testo, monocromo nero" } },
  { name: "Muted Slate", hex: "#6B7280", use: { en: "Captions, labels", it: "Didascalie, etichette" } },
  { name: "White", hex: "#FFFFFF", use: { en: "Backgrounds, clean space", it: "Sfondi, spazio pulito" } },
];

/** Brand guidelines as a single sheet: numbered panels, every file copyable and downloadable. */
@Component({
  selector: "app-brand-page",
  standalone: true,
  imports: [IconComponent, NgTemplateOutlet, SiteNavComponent],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      <app-site-nav [home]="false" />

      <main class="container-x pb-24 pt-28 lg:pt-36">
        <!-- Cover -->
        <header class="bg-cover">
          <div class="min-w-0">
            <p class="eyebrow stagger-in">{{ it() ? 'Linee guida del brand' : 'Brand guidelines' }}</p>
            <h1 class="bg-cover-title brand-wordmark stagger-in">Alessandro Bruno</h1>
            <p class="bg-cover-sub brand-wordmark stagger-in">Soft minimal logo</p>
            <p class="stagger-in mt-8 max-w-md text-body text-muted">
              {{
                it()
                  ? 'Un’identità pulita, minimale e curata. Costruita su forme geometriche semplici, trasparenze morbide e proporzioni bilanciate, pensata per un aspetto moderno, professionale e versatile.'
                  : 'A clean, minimal and refined visual identity. Built on simple geometric shapes, soft transparency and balanced proportions, designed for a modern, professional and versatile look.'
              }}
            </p>
            <p class="bg-keywords stagger-in">
              @for (k of (it() ? keywordsIt : keywordsEn); track k; let last = $last) {
                <span>{{ k }}</span>@if (!last) { <span aria-hidden="true">·</span> }
              }
            </p>
            <div class="stagger-in mt-8 flex flex-wrap gap-2.5">
              <button type="button" class="btn btn-primary" (click)="copyFile('logo', logoSvg)">
                <svg [appIcon]="done() === 'logo' ? 'check' : 'copy'" class="size-4"></svg>
                {{ done() === 'logo' ? (it() ? 'Copiato' : 'Copied') : (it() ? 'Copia logo SVG' : 'Copy logo SVG') }}
              </button>
              <button type="button" class="btn btn-ghost" (click)="copyFile('wordmark', wordmarkSvg)">
                <svg [appIcon]="done() === 'wordmark' ? 'check' : 'copy'" class="size-4"></svg>
                {{ done() === 'wordmark' ? (it() ? 'Copiato' : 'Copied') : (it() ? 'Copia wordmark SVG' : 'Copy wordmark SVG') }}
              </button>
              <a href="#files" class="btn btn-quiet">{{ it() ? 'Tutti i file' : 'All files' }} <svg appIcon="arrow-right" class="size-4"></svg></a>
            </div>
          </div>
          <div class="bg-cover-mark" aria-hidden="true">
            <img src="/brand/ab-monogram.webp" alt="" width="960" height="666" />
          </div>
        </header>

        <!-- 01–03 -->
        <section class="bg-row bg-row-3">
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>01</span>{{ it() ? 'Logo principale' : 'Primary logo' }}</p>
            <div class="bg-stage">
              <img src="/brand/ab-monogram.webp" alt="Alessandro Bruno" width="960" height="666" class="w-[58%]" />
              <span class="brand-wordmark bg-wm">Alessandro Bruno</span>
            </div>
            <p class="bg-note">{{ it() ? 'Monogramma e wordmark insieme. Da usare quando chi guarda potrebbe non conoscere ancora il marchio: hero, copertine, presentazioni, pagina brand.' : 'Monogram and wordmark together. Use it when the viewer may not know the mark yet: heroes, covers, presentations, the brand page.' }}</p>
            <ng-container *ngTemplateOutlet="actions; context: { id: 'p-full', file: '/brand/ab-soft-minimal-full.svg' }" />
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>02</span>{{ it() ? 'Marchio (icona)' : 'Logo mark (icon)' }}</p>
            <div class="bg-stage">
              <img src="/brand/ab-monogram.webp" alt="Alessandro Bruno" width="960" height="666" class="w-[62%]" />
            </div>
            <p class="bg-note">{{ it() ? 'Il segno da solo: navbar, avatar, favicon, icone. È l’elemento più riconoscibile dell’identità.' : 'The mark on its own: navbar, avatars, favicon, app icons. It is the most recognisable part of the identity.' }}</p>
            <ng-container *ngTemplateOutlet="actions; context: { id: 'p-mark', file: '/brand/ab-soft-minimal-monogram.svg' }" />
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>03</span>Wordmark</p>
            <div class="bg-stage">
              <span class="brand-wordmark bg-wm bg-wm-solo">Alessandro Bruno</span>
            </div>
            <p class="bg-note">{{ it() ? 'Inter Light, maiuscolo, tracking 0.35em. Per footer, firme email e layout stretti dove il monogramma sarebbe ridondante.' : 'Inter Light, uppercase, 0.35em tracking. For footers, email signatures and narrow layouts where the mark would be redundant.' }}</p>
            <ng-container *ngTemplateOutlet="actions; context: { id: 'p-wm', file: '/brand/ab-soft-minimal-wordmark.svg' }" />
          </article>
        </section>

        <!-- 04 Variations -->
        <section class="bg-row">
          <div class="bg-panel bg-panel-wide">
            <p class="bg-num"><span>04</span>{{ it() ? 'Variazioni' : 'Variations' }}</p>
            <p class="bg-note mt-2 max-w-2xl">{{ it() ? 'Soft su superfici chiare e quiete; bianco sulle sezioni scure; nero per stampa e documenti. Il punto resta blu nella versione soft e prende il colore del marchio nelle versioni monocromatiche.' : 'Soft on quiet light surfaces, white on dark sections, black for print and documents. The dot stays blue in the soft version and takes the mark’s colour in monochrome.' }}</p>
            <ul class="bg-variations">
              @for (v of variations; track v.id; let i = $index) {
                <li class="reveal-on-scroll">
                  <div class="bg-var-tile" [class.is-dark]="v.surface === 'dark'">
                    <img [src]="v.mark" alt="" [class.is-small]="v.wordmark" />
                    @if (v.wordmark) { <span class="brand-wordmark bg-var-wm" [style.color]="v.ink">Alessandro Bruno</span> }
                    <div class="bg-var-actions">
                      <button type="button" (click)="copyFile(v.id, v.file)" [attr.aria-label]="(it() ? 'Copia SVG: ' : 'Copy SVG: ') + v.name.en">
                        <svg [appIcon]="done() === v.id ? 'check' : 'copy'" class="size-3.5"></svg>
                      </button>
                      <a [href]="v.file" download [attr.aria-label]="(it() ? 'Scarica SVG: ' : 'Download SVG: ') + v.name.en"><svg appIcon="download" class="size-3.5"></svg></a>
                    </div>
                  </div>
                  <p class="mt-3 text-small font-medium text-fg">{{ it() ? v.name.it : v.name.en }}</p>
                  <p class="text-caption text-faint">{{ it() ? v.use.it : v.use.en }}</p>
                </li>
              }
            </ul>
          </div>
        </section>

        <!-- 05–07 -->
        <section class="bg-row bg-row-523">
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>05</span>{{ it() ? 'Palette' : 'Colour palette' }}</p>
            <ul class="bg-colors">
              @for (c of colors; track c.hex) {
                <li>
                  <button type="button" class="bg-color" (click)="copyHex(c.hex)" [attr.aria-label]="(it() ? 'Copia ' : 'Copy ') + c.name + ' ' + c.hex">
                    <span class="bg-color-dot" [style.background]="c.hex"></span>
                    <span class="mt-3 block text-small font-medium text-fg">{{ c.name }}</span>
                    <span class="block text-caption tabular-nums text-faint">{{ done() === c.hex ? (it() ? 'Copiato' : 'Copied') : c.hex }}</span>
                    <span class="mt-2 block text-caption text-faint">{{ it() ? c.use.it : c.use.en }}</span>
                  </button>
                </li>
              }
            </ul>
            <p class="bg-note mt-5">{{ it() ? 'Clicca un colore per copiarlo. Il blu è punteggiatura: il resto lo fanno bianco, grigi tenui e inchiostro. Per il testo blu piccolo su bianco il sito usa #2563EB, che ha contrasto AA.' : 'Click a colour to copy it. Blue is punctuation; white, soft grays and ink do the rest. Small blue text on white uses #2563EB on the site for AA contrast.' }}</p>
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>06</span>{{ it() ? 'Dettaglio dei gradienti' : 'Gradient details' }}</p>
            <div class="bg-gradient-zoom" aria-hidden="true"></div>
            <p class="bg-note">{{ it() ? 'Gradienti molto trattenuti: lievi passaggi tonali da sinistra a destra, grigio-azzurri tenui, sovrapposizioni che sembrano trasparenti. Niente riflessi metallici, cromature o luci speculari: profondità solo dal tono.' : 'Very restrained gradients: gentle left-to-right tonal shifts, pale blue-gray blending, overlaps that feel transparent. No metallic reflections, chrome or specular highlights: depth comes from tone only.' }}</p>
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>07</span>{{ it() ? 'Area di rispetto' : 'Clear space' }}</p>
            <div class="bg-clear" aria-hidden="true">
              <span class="bg-clear-x tl">x</span><span class="bg-clear-x tr">x</span><span class="bg-clear-x bl">x</span><span class="bg-clear-x br">x</span>
              <img src="/brand/ab-monogram.webp" alt="" />
            </div>
            <p class="bg-note">{{ it() ? 'L’unità è il diametro del punto (x). Minimo 1x su tutti i lati, 1.5x consigliato, 2x negli hero e nelle presentazioni. Nessun testo o elemento UI dentro quest’area.' : 'The unit is the dot’s diameter (x). Minimum 1x on every side, 1.5x preferred, 2x in heroes and presentations. No text or UI inside this area.' }}</p>
          </article>
        </section>

        <!-- 08–10 -->
        <section class="bg-row bg-row-334">
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>08</span>{{ it() ? 'Dimensioni minime' : 'Minimum size' }}</p>
            <div class="bg-sizes">
              <figure>
                <div class="bg-size-box"><img src="/brand/ab-monogram-160.webp" alt="" style="width: 22px" /></div>
                <figcaption><strong>16 px</strong>{{ it() ? 'Solo icona (favicon)' : 'Icon only (favicon)' }}</figcaption>
              </figure>
              <figure>
                <div class="bg-size-box"><img src="/brand/ab-monogram-160.webp" alt="" style="width: 44px" /></div>
                <figcaption><strong>32 px</strong>{{ it() ? 'Uso standard web' : 'Standard web use' }}</figcaption>
              </figure>
              <figure>
                <div class="bg-size-box is-wide">
                  <img src="/brand/ab-monogram-160.webp" alt="" style="width: 60px" />
                  <span class="brand-wordmark" style="font-size: 6px">Alessandro Bruno</span>
                </div>
                <figcaption><strong>120 px</strong>{{ it() ? 'Logo completo' : 'Full logo' }}</figcaption>
              </figure>
            </div>
            <p class="bg-note">{{ it() ? 'Monogramma: 16px minimo assoluto, 24px in UI, 64px+ quando è protagonista. Logo completo: 120px (180px consigliati). Wordmark: 140px.' : 'Monogram: 16px absolute minimum, 24px in UI, 64px+ when it leads. Full logo: 120px (180px recommended). Wordmark: 140px.' }}</p>
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>09</span>{{ it() ? 'Tipografia' : 'Typography' }}</p>
            <p class="bg-type-aa">Aa</p>
            <p class="text-title font-semibold tracking-tight text-fg">Inter</p>
            <p class="text-small text-muted">Light · Regular · Medium · SemiBold</p>
            <p class="bg-type-set">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789</p>
            <p class="bg-note">{{ it() ? 'Una sola famiglia. Titoli 600 con tracking stretto, testo 400 a 16px+, etichette 500 maiuscole. Il wordmark è Inter 300 a 0.35em.' : 'One family. Headings 600 with tight tracking, body 400 at 16px+, labels 500 uppercase. The wordmark is Inter 300 at 0.35em.' }}</p>
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>10</span>{{ it() ? 'Esempi d’uso' : 'Usage examples' }}</p>
            <div class="bg-usage">
              <div class="bg-mock bg-mock-app"><span><img src="/brand/ab-monogram.webp" alt="" /></span></div>
              <div class="bg-mock bg-mock-card">
                <div><img src="/brand/ab-monogram.webp" alt="" /><span class="brand-wordmark">Alessandro Bruno</span></div>
              </div>
              <div class="bg-mock bg-mock-browser">
                <span class="bg-mock-dots"><i></i><i></i><i></i></span>
                <span class="bg-mock-tab"><img src="/favicon-32.png" alt="" />alessandrobrunoh.it</span>
              </div>
              <div class="bg-mock bg-mock-dark"><img src="/brand/ab-monogram-white.webp" alt="" /></div>
            </div>
            <p class="bg-note">{{ it() ? 'Icona app, biglietto da visita, scheda del browser, banner scuro.' : 'App icon, business card, browser tab, dark banner.' }}</p>
          </article>
        </section>

        <!-- 11 Do / Don't -->
        <section class="bg-row bg-row-2">
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>11</span>{{ it() ? 'Da fare' : 'Do' }}</p>
            <ul class="brand-rules mt-4">
              @for (rule of (it() ? doIt : doEn); track rule) { <li>{{ rule }}</li> }
            </ul>
          </article>
          <article class="bg-panel reveal-on-scroll">
            <p class="bg-num"><span>12</span>{{ it() ? 'Da evitare' : 'Don’t' }}</p>
            <ul class="brand-rules is-dont mt-4">
              @for (rule of (it() ? dontIt : dontEn); track rule) { <li>{{ rule }}</li> }
            </ul>
          </article>
        </section>

        <!-- 13 Files -->
        <section id="files" class="bg-row scroll-mt-24">
          <div class="bg-panel bg-panel-wide">
            <p class="bg-num"><span>13</span>{{ it() ? 'File ufficiali' : 'Official files' }}</p>
            <p class="bg-note mt-2">{{ it() ? 'Nove SVG: monogramma, logo completo e wordmark, ognuno in versione soft, nera e bianca.' : 'Nine SVGs: monogram, full logo and wordmark, each in soft, black and white.' }}</p>
            <ul class="bg-files">
              @for (a of assets; track a.id) {
                <li>
                  <span class="bg-file-swatch" [class.is-dark]="a.surface === 'dark'">
                    @if (a.preview) { <img [src]="a.preview" alt="" /> } @else { <span class="brand-wordmark" [style.color]="a.ink === 'white' ? '#fff' : '#1f2937'">AB</span> }
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-small font-medium text-fg">{{ a.name }}</span>
                    <span class="block truncate text-caption text-faint">{{ a.file.replace('/brand/', '') }}</span>
                  </span>
                  <button type="button" class="nav-ctl" (click)="copyFile(a.id, a.file)" [attr.aria-label]="(it() ? 'Copia SVG: ' : 'Copy SVG: ') + a.name">
                    <svg [appIcon]="done() === a.id ? 'check' : 'copy'" class="size-4"></svg>
                  </button>
                  <a class="nav-ctl" [href]="a.file" download [attr.aria-label]="(it() ? 'Scarica SVG: ' : 'Download SVG: ') + a.name"><svg appIcon="download" class="size-4"></svg></a>
                </li>
              }
            </ul>
          </div>
        </section>
      </main>
    </div>

    <ng-template #actions let-id="id" let-file="file">
      <div class="bg-actions">
        <button type="button" class="nav-ctl" (click)="copyFile(id, file)" [attr.aria-label]="it() ? 'Copia SVG' : 'Copy SVG'">
          <svg [appIcon]="done() === id ? 'check' : 'copy'" class="size-4"></svg>
          <span class="text-caption font-medium">{{ done() === id ? (it() ? 'Copiato' : 'Copied') : 'SVG' }}</span>
        </button>
        <a class="nav-ctl" [href]="file" download [attr.aria-label]="it() ? 'Scarica SVG' : 'Download SVG'">
          <svg appIcon="download" class="size-4"></svg>
        </a>
      </div>
    </ng-template>
  `,
})
export class BrandPageComponent implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private observer: IntersectionObserver | null = null;

  protected readonly assets = BRAND_ASSETS;
  protected readonly variations = VARIATIONS;
  protected readonly colors = COLORS;
  protected readonly logoSvg = LOGO_SVG;
  protected readonly wordmarkSvg = WORDMARK_SVG;
  protected readonly it = () => lang() === "it";
  /** Which control just copied something (an id or a hex). */
  protected readonly done = signal<string | null>(null);

  protected readonly keywordsEn = ["Minimal", "Elegant", "Modern", "Timeless"];
  protected readonly keywordsIt = ["Minimale", "Elegante", "Moderno", "Senza tempo"];

  protected readonly doEn = [
    "Use the official files from this page — never a screenshot or a redrawn version.",
    "Give the mark quiet, spacious surfaces: white, soft off-white, pale cool gray.",
    "Black on white for documents and print, white on dark sections.",
    "Keep the dot blue in the soft mark and mark-coloured in monochrome.",
    "Respect the clear space (1× the dot) and the minimum sizes.",
    "Always provide alt=\"Alessandro Bruno\".",
  ];
  protected readonly doIt = [
    "Usa i file ufficiali di questa pagina — mai uno screenshot o una versione ridisegnata.",
    "Dai al marchio superfici quiete e ariose: bianco, off-white, grigio freddo chiaro.",
    "Nero su bianco per documenti e stampa, bianco sulle sezioni scure.",
    "Il punto resta blu nel marchio soft e prende il colore del marchio nel monocromo.",
    "Rispetta l’area di rispetto (1× il punto) e le dimensioni minime.",
    "Fornisci sempre alt=\"Alessandro Bruno\".",
  ];
  protected readonly dontEn = [
    "Add metallic reflections, chrome, bevels or 3D extrusion.",
    "Add hard outlines or shadows stronger than the brand allows.",
    "Stretch, rotate, crop or change the proportions of the monogram.",
    "Recolour the dot, move it, or add more dots.",
    "Place the soft mark on busy imagery or low-contrast surfaces where it disappears.",
    "Set the wordmark in a decorative typeface or in sentence case.",
  ];
  protected readonly dontIt = [
    "Aggiungere riflessi metallici, cromature, smussi o estrusioni 3D.",
    "Aggiungere contorni netti o ombre più forti di quanto il brand consenta.",
    "Stirare, ruotare, ritagliare o cambiare le proporzioni del monogramma.",
    "Ricolorare il punto, spostarlo o aggiungerne altri.",
    "Mettere il marchio soft su immagini affollate o superfici a basso contrasto dove sparisce.",
    "Comporre il wordmark con un carattere decorativo o in minuscolo.",
  ];

  ngOnInit() {
    this.title.setTitle(this.it() ? "Linee guida del brand · Alessandro Bruno" : "Brand guidelines · Alessandro Bruno");
    if (typeof window === "undefined") return;
    // Same reveal as the home page, for the panels on this page.
    setTimeout(() => {
      const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
      if (!("IntersectionObserver" in window)) {
        for (const item of items) item.classList.add("is-visible");
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            this.observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      for (const item of items) this.observer.observe(item);
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.observer?.disconnect();
  }

  protected async copyFile(key: string, url: string) {
    try {
      await copySvg(url);
      this.flash(key);
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  protected async copyHex(hex: string) {
    try {
      await copyText(hex);
      this.flash(hex);
    } catch {
      // Clipboard blocked: the hex is visible on the swatch.
    }
  }

  private flash(key: string) {
    this.done.set(key);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.done.set(null), 1600);
  }
}
