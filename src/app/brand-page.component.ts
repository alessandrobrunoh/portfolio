import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { SiteNavComponent } from "./site-nav.component";
import { BRAND_ASSETS, LOGO_SVG, WORDMARK_SVG, copySvg, copyText } from "../lib/brand";
import { lang } from "../lib/site";

type Swatch = { name: string; hex: string; ink: "light" | "dark" };

const PALETTE: { group: { en: string; it: string }; note: { en: string; it: string }; swatches: Swatch[] }[] = [
  {
    group: { en: "Core", it: "Base" },
    note: { en: "The logo dot, the surfaces it sits on, and the ink.", it: "Il punto del logo, le superfici e l'inchiostro." },
    swatches: [
      { name: "Primary Blue", hex: "#3B82F6", ink: "light" },
      { name: "Soft Gray", hex: "#E8ECF2", ink: "dark" },
      { name: "Light Blue Gray", hex: "#D5DCE6", ink: "dark" },
      { name: "Deep Ink", hex: "#1F2937", ink: "light" },
      { name: "White", hex: "#FFFFFF", ink: "dark" },
      { name: "Muted Slate", hex: "#6B7280", ink: "light" },
    ],
  },
  {
    group: { en: "Interface", it: "Interfaccia" },
    note: { en: "Page, text and border roles on the site.", it: "Ruoli di pagina, testo e bordi sul sito." },
    swatches: [
      { name: "Page subtle", hex: "#F8FAFC", ink: "dark" },
      { name: "Text primary", hex: "#111827", ink: "light" },
      { name: "Text secondary", hex: "#4B5563", ink: "light" },
      { name: "Border", hex: "#E5E7EB", ink: "dark" },
      { name: "Border strong", hex: "#CBD5E1", ink: "dark" },
      { name: "Blue hover", hex: "#2563EB", ink: "light" },
      { name: "Dark section", hex: "#0F172A", ink: "light" },
    ],
  },
];

@Component({
  selector: "app-brand-page",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent, SiteNavComponent],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      <app-site-nav [home]="false" />

      <main>
        <header class="container-x pb-16 pt-32 lg:pt-40">
          <p class="eyebrow stagger-in"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Identità' : 'Identity' }}</p>
          <h1 class="stagger-in mt-6 text-heading font-medium tracking-display text-fg">
            {{ it() ? 'Linee guida del brand' : 'Brand guidelines' }}<span class="brand-dot" aria-hidden="true">.</span>
          </h1>
          <p class="section-lede stagger-in mt-6">
            {{
              it()
                ? 'Il monogramma ab. è fatto di grandi forme geometriche piatte, grigio-azzurre, con un solo punto blu. Qui trovi i file ufficiali, i colori e le regole per usarli bene.'
                : 'The ab. monogram is made of large, flat geometric forms in pale gray-blue, with a single blue dot. Here are the official files, the colours and the rules for using them well.'
            }}
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
          </div>

          <div class="brand-stage stagger-in mt-14" aria-hidden="true">
            <img src="/brand/ab-monogram.webp" alt="" width="960" height="666" />
            <span class="brand-wordmark">Alessandro Bruno</span>
          </div>
        </header>

        <section id="logos" class="container-x section">
          <app-section-head n="01" [title]="it() ? 'Logo' : 'Logos'" [kicker]="it() ? 'file ufficiali' : 'official files'">
            <p class="section-lede">
              {{
                it()
                  ? 'Monogramma, logo completo e wordmark, ognuno in versione soft, nera e bianca. Usa sempre questi file: mai ridisegnare il marchio con un font.'
                  : 'Monogram, full logo and wordmark, each in soft, black and white. Always use these files: never redraw the mark with a typeface.'
              }}
            </p>
          </app-section-head>

          <ul class="brand-assets">
            @for (asset of assets; track asset.id) {
              <li class="card reveal-on-scroll">
                <div class="brand-asset-preview" [class.is-dark]="asset.surface === 'dark'">
                  @if (asset.preview) {
                    <img [src]="asset.preview" [alt]="asset.name" loading="lazy" [class.is-small]="asset.kind === 'full'" />
                  }
                  @if (asset.kind !== 'monogram') {
                    <span class="brand-wordmark" [class.text-white]="asset.ink === 'white'" [class.is-solo]="asset.kind === 'wordmark'">Alessandro Bruno</span>
                  }
                </div>
                <div class="flex items-start justify-between gap-3 p-5">
                  <div class="min-w-0">
                    <h3 class="text-small font-medium text-fg">{{ asset.name }}</h3>
                    <p class="mt-1 text-small text-muted">{{ it() ? asset.use.it : asset.use.en }}</p>
                  </div>
                  <div class="flex shrink-0 gap-1">
                    <button type="button" class="nav-ctl border border-line" (click)="copyFile(asset.id, asset.file)" [attr.aria-label]="(it() ? 'Copia SVG: ' : 'Copy SVG: ') + asset.name" [attr.title]="it() ? 'Copia SVG' : 'Copy SVG'">
                      <svg [appIcon]="done() === asset.id ? 'check' : 'copy'" class="size-4" [class.text-accent]="done() === asset.id"></svg>
                    </button>
                    <a class="nav-ctl border border-line" [href]="asset.file" download [attr.aria-label]="(it() ? 'Scarica SVG: ' : 'Download SVG: ') + asset.name" [attr.title]="it() ? 'Scarica SVG' : 'Download SVG'">
                      <svg appIcon="download" class="size-4"></svg>
                    </a>
                  </div>
                </div>
              </li>
            }
          </ul>
        </section>

        <section id="colour" class="container-x section">
          <app-section-head n="02" [title]="it() ? 'Colore' : 'Colour'" [kicker]="it() ? 'clicca per copiare' : 'click to copy'">
            <p class="section-lede">
              {{
                it()
                  ? 'Bianco, grigi tenui e inchiostro fanno il lavoro. Il blu è punteggiatura: punto del logo, link, stato attivo, focus, una call to action.'
                  : 'White, soft grays and ink do the work. Blue is punctuation: the logo dot, links, active states, focus, one call to action.'
              }}
            </p>
          </app-section-head>

          <div class="grid gap-10">
            @for (group of palette; track group.group.en) {
              <div class="reveal-on-scroll">
                <div class="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 class="text-subhead font-medium tracking-tight text-fg">{{ it() ? group.group.it : group.group.en }}</h3>
                  <p class="text-small text-muted">{{ it() ? group.note.it : group.note.en }}</p>
                </div>
                <ul class="brand-swatches mt-4">
                  @for (sw of group.swatches; track sw.hex) {
                    <li>
                      <button
                        type="button"
                        class="brand-swatch"
                        [class.ink-dark]="sw.ink === 'dark'"
                        [style.background]="sw.hex"
                        (click)="copyHex(sw.hex)"
                        [attr.aria-label]="(it() ? 'Copia ' : 'Copy ') + sw.name + ' ' + sw.hex"
                      >
                        <span class="text-small font-medium">{{ sw.name }}</span>
                        <span class="font-mono text-caption">{{ done() === sw.hex ? (it() ? 'Copiato' : 'Copied') : sw.hex }}</span>
                      </button>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </section>

        <section id="type" class="container-x section">
          <app-section-head n="03" [title]="it() ? 'Tipografia' : 'Typography'" [kicker]="it() ? 'una famiglia' : 'one family'">
            <p class="section-lede">
              {{
                it()
                  ? 'Una sola famiglia, Inter, in pesi diversi. Il monogramma è un disegno, non un carattere.'
                  : 'One family, Inter, in different weights. The monogram is a drawing, not a typeface.'
              }}
            </p>
          </app-section-head>

          <div class="brand-type">
            <div class="reveal-on-scroll">
              <p class="eyebrow">Inter · 500 · −0.03em</p>
              <p class="mt-4 text-heading font-medium tracking-display text-fg">Clarity first<span class="brand-dot">.</span></p>
              <p class="mt-3 text-small text-muted">{{ it() ? 'Titoli: Inter 500–600, tracking stretto.' : 'Headings: Inter 500–600, tight tracking.' }}</p>
            </div>
            <div class="reveal-on-scroll">
              <p class="eyebrow">Inter · 400 · 1.6</p>
              <p class="mt-4 max-w-prose text-lede text-fg">{{ it() ? 'Costruisco sistemi affidabili e i prodotti che ci stanno sopra.' : 'I build reliable systems and the products on top of them.' }}</p>
              <p class="mt-3 text-small text-muted">{{ it() ? 'Testo: Inter 400, 16px e oltre, interlinea 1.6.' : 'Body: Inter 400, 16px and up, 1.6 line height.' }}</p>
            </div>
            <div class="reveal-on-scroll">
              <p class="eyebrow">Inter Light · 300 · 0.35em</p>
              <p class="brand-wordmark mt-6 text-subhead text-fg">Alessandro Bruno</p>
              <p class="mt-4 text-small text-muted">{{ it() ? 'Solo il wordmark: maiuscolo, tracking molto largo, peso leggero.' : 'Wordmark only: uppercase, very wide tracking, light weight.' }}</p>
            </div>
          </div>
        </section>

        <section id="usage" class="container-x section">
          <app-section-head n="04" [title]="it() ? 'Uso' : 'Usage'" [kicker]="it() ? 'spazio, misure, regole' : 'space, sizes, rules'">
            <dl class="grid gap-6 sm:grid-cols-3">
              <div>
                <dt class="eyebrow">{{ it() ? 'Spazio di rispetto' : 'Clear space' }}</dt>
                <dd class="mt-2 text-small text-fg">{{ it() ? '1× il diametro del punto, 1.5× preferito, 2× negli hero.' : '1× the dot diameter, 1.5× preferred, 2× in heroes.' }}</dd>
              </div>
              <div>
                <dt class="eyebrow">{{ it() ? 'Monogramma minimo' : 'Minimum monogram' }}</dt>
                <dd class="mt-2 text-small text-fg">{{ it() ? '16px assoluto, 24px in UI, 64px+ negli hero.' : '16px absolute, 24px in UI, 64px+ in heroes.' }}</dd>
              </div>
              <div>
                <dt class="eyebrow">{{ it() ? 'Logo completo minimo' : 'Minimum full logo' }}</dt>
                <dd class="mt-2 text-small text-fg">{{ it() ? '120px di larghezza (180px consigliati).' : '120px wide (180px recommended).' }}</dd>
              </div>
            </dl>
          </app-section-head>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="panel reveal-on-scroll p-6">
              <p class="eyebrow"><span class="live-dot" aria-hidden="true"></span>{{ it() ? 'Sì' : 'Do' }}</p>
              <ul class="brand-rules mt-4">
                @for (rule of (it() ? doIt : doEn); track rule) { <li>{{ rule }}</li> }
              </ul>
            </div>
            <div class="panel reveal-on-scroll p-6">
              <p class="eyebrow"><span class="size-[0.4375rem] rounded-full bg-silver" aria-hidden="true"></span>{{ it() ? 'No' : 'Don’t' }}</p>
              <ul class="brand-rules is-dont mt-4">
                @for (rule of (it() ? dontIt : dontEn); track rule) { <li>{{ rule }}</li> }
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class BrandPageComponent implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private observer: IntersectionObserver | null = null;

  protected readonly assets = BRAND_ASSETS;
  protected readonly palette = PALETTE;
  protected readonly logoSvg = LOGO_SVG;
  protected readonly wordmarkSvg = WORDMARK_SVG;
  protected readonly it = () => lang() === "it";
  /** Which control just copied something (asset id, "logo", "wordmark" or a hex). */
  protected readonly done = signal<string | null>(null);

  protected readonly doEn = [
    "Use the official files from this page.",
    "Give the mark quiet, spacious surfaces: white, soft off-white, pale cool gray.",
    "Black on white for documents and print, white on dark sections.",
    "Keep the dot blue in the soft mark, mark-coloured in monochrome.",
    "Always provide alt=\"Alessandro Bruno\".",
  ];
  protected readonly doIt = [
    "Usa i file ufficiali di questa pagina.",
    "Dai al marchio superfici quiete e ariose: bianco, off-white, grigio freddo chiaro.",
    "Nero su bianco per documenti e stampa, bianco sulle sezioni scure.",
    "Il punto resta blu nel marchio soft, dello stesso colore nel monocromo.",
    "Fornisci sempre alt=\"Alessandro Bruno\".",
  ];
  protected readonly dontEn = [
    "Add metallic reflections, chrome, bevels or 3D.",
    "Add hard outlines or strong shadows.",
    "Stretch, rotate or change the proportions of the monogram.",
    "Recolour the dot to an arbitrary colour.",
    "Place the soft mark on busy imagery or low-contrast surfaces where it disappears.",
    "Set the wordmark in a decorative typeface.",
  ];
  protected readonly dontIt = [
    "Aggiungere riflessi metallici, cromature, smussi o 3D.",
    "Aggiungere contorni netti o ombre forti.",
    "Stirare, ruotare o cambiare le proporzioni del monogramma.",
    "Ricolorare il punto con un colore qualsiasi.",
    "Mettere il marchio soft su immagini affollate o superfici a basso contrasto dove sparisce.",
    "Comporre il wordmark con un carattere decorativo.",
  ];

  ngOnInit() {
    this.title.setTitle(this.it() ? "Linee guida del brand · Alessandro Bruno" : "Brand guidelines · Alessandro Bruno");
    if (typeof window === "undefined") return;
    // Same reveal as the home page, for the cards on this page.
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
