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
    group: { en: "Electric blue", it: "Blu elettrico" },
    note: { en: "The logo dot. An accent, never a wash.", it: "Il punto del logo. Un accento, mai uno sfondo." },
    swatches: [
      { name: "Signal", hex: "#0066FF", ink: "light" },
      { name: "Digital", hex: "#0A6CFF", ink: "light" },
      { name: "Highlight", hex: "#00B7FF", ink: "dark" },
    ],
  },
  {
    group: { en: "Charcoal", it: "Antracite" },
    note: { en: "The home surface for the metallic mark.", it: "La superficie di casa del marchio metallico." },
    swatches: [
      { name: "Canvas", hex: "#0B0D10", ink: "light" },
      { name: "Surface", hex: "#101318", ink: "light" },
      { name: "Elevated", hex: "#151A21", ink: "light" },
      { name: "Line", hex: "#252B34", ink: "light" },
    ],
  },
  {
    group: { en: "White", it: "Bianco" },
    note: { en: "Paper for documents and the light theme.", it: "Carta per documenti e tema chiaro." },
    swatches: [
      { name: "White", hex: "#FFFFFF", ink: "dark" },
      { name: "Soft", hex: "#F4F6F8", ink: "dark" },
      { name: "Muted", hex: "#EEF1F5", ink: "dark" },
    ],
  },
  {
    group: { en: "Silver", it: "Argento" },
    note: { en: "Supports the metal without competing with the blue.", it: "Sostiene il metallo senza competere col blu." },
    swatches: [
      { name: "Silver 300", hex: "#D8DAE1", ink: "dark" },
      { name: "Silver 400", hex: "#BBC3CF", ink: "dark" },
      { name: "Silver 500", hex: "#8D98A8", ink: "dark" },
      { name: "Silver 700", hex: "#5C6675", ink: "light" },
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
                ? 'Il monogramma ab. è un nastro di metallo con un solo punto blu elettrico. Qui trovi i file ufficiali, i colori e le regole per usarli bene.'
                : 'The ab. monogram is a ribbon of metal with a single electric-blue dot. Here are the official files, the colours and the rules for using them well.'
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
            <span class="brand-stage-glow"></span>
            <img src="/brand/ab-logo-metallic-full.webp" alt="" width="640" height="431" />
          </div>
        </header>

        <section id="logos" class="container-x section">
          <app-section-head n="01" [title]="it() ? 'Logo' : 'Logos'" [kicker]="it() ? 'file ufficiali' : 'official files'">
            <p class="section-lede">
              {{
                it()
                  ? 'Metallico come identità principale, bianco e nero per UI, stampa e formati piccoli. Usa sempre questi file: mai ridisegnare il marchio con un font.'
                  : 'Metallic as the primary identity, white and black for UI, print and small sizes. Always use these files: never redraw the mark with a typeface.'
              }}
            </p>
          </app-section-head>

          <ul class="brand-assets">
            @for (asset of assets; track asset.id) {
              <li class="card reveal-on-scroll">
                <div class="brand-asset-preview" [class.is-light]="asset.surface === 'light'">
                  <img [src]="asset.preview" [alt]="asset.name" loading="lazy" />
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
                  ? 'Antracite, argento e bianco fanno il lavoro. Il blu elettrico è punteggiatura: punto del logo, link, focus, un bottone.'
                  : 'Charcoal, silver and white do the work. Electric blue is punctuation: the logo dot, links, focus, one button.'
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
          <app-section-head n="03" [title]="it() ? 'Tipografia' : 'Typography'" [kicker]="it() ? 'tre voci' : 'three voices'">
            <p class="section-lede">
              {{
                it()
                  ? 'Inter parla, Manrope firma, JetBrains Mono misura. Il monogramma è un disegno, non un carattere.'
                  : 'Inter speaks, Manrope signs, JetBrains Mono measures. The monogram is a drawing, not a typeface.'
              }}
            </p>
          </app-section-head>

          <div class="brand-type">
            <div class="reveal-on-scroll">
              <p class="eyebrow">Inter · 300–600</p>
              <p class="mt-4 text-heading font-medium tracking-display text-fg">Precise by default<span class="brand-dot">.</span></p>
              <p class="mt-3 text-small text-muted">{{ it() ? 'Interfaccia, titoli e testo. Titoli a 500, tracking −0.04em.' : 'Interface, headings and body. Headings at 500, −0.04em tracking.' }}</p>
            </div>
            <div class="reveal-on-scroll">
              <p class="eyebrow">Manrope Light · 300</p>
              <p class="brand-wordmark mt-6 text-subhead text-fg">Alessandro Bruno</p>
              <p class="mt-4 text-small text-muted">{{ it() ? 'Solo il wordmark e le etichette. Maiuscolo, tracking 0.40em.' : 'Wordmark and labels only. Uppercase, 0.40em tracking.' }}</p>
            </div>
            <div class="reveal-on-scroll">
              <p class="eyebrow">JetBrains Mono · 400</p>
              <p class="mt-6 font-mono text-lede text-fg">01 · #0066FF · v2026</p>
              <p class="mt-4 text-small text-muted">{{ it() ? 'Indici, codici, dati. Mai paragrafi.' : 'Indexes, codes, data. Never paragraphs.' }}</p>
            </div>
          </div>
        </section>

        <section id="usage" class="container-x section">
          <app-section-head n="04" [title]="it() ? 'Uso' : 'Usage'" [kicker]="it() ? 'spazio, misure, regole' : 'space, sizes, rules'">
            <dl class="grid gap-6 sm:grid-cols-3">
              <div>
                <dt class="eyebrow">{{ it() ? 'Spazio di rispetto' : 'Clear space' }}</dt>
                <dd class="mt-2 text-small text-fg">{{ it() ? '1× il diametro del punto, 2× negli hero.' : '1× the dot diameter, 2× in heroes.' }}</dd>
              </div>
              <div>
                <dt class="eyebrow">{{ it() ? 'Monogramma minimo' : 'Minimum monogram' }}</dt>
                <dd class="mt-2 text-small text-fg">{{ it() ? '32px (metallico 64px).' : '32px (metallic 64px).' }}</dd>
              </div>
              <div>
                <dt class="eyebrow">{{ it() ? 'Logo completo minimo' : 'Minimum full logo' }}</dt>
                <dd class="mt-2 text-small text-fg">{{ it() ? '180px di larghezza.' : '180px wide.' }}</dd>
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
    "Metallic on charcoal or soft white, with generous air around it.",
    "Black on light backgrounds, white on dark ones.",
    "Keep the dot electric blue in the metallic mark, mark-coloured in monochrome.",
  ];
  protected readonly doIt = [
    "Usa i file ufficiali di questa pagina.",
    "Metallico su antracite o bianco morbido, con molto spazio intorno.",
    "Nero su sfondi chiari, bianco su sfondi scuri.",
    "Il punto resta blu elettrico nel metallico, dello stesso colore nel monocromo.",
  ];
  protected readonly dontEn = [
    "Stretch, rotate, skew or crop the mark.",
    "Add outlines, drop shadows, bevels or glows to the flat versions.",
    "Recolour the dot, move it, resize it or add more dots.",
    "Rebuild the monogram with a font or separate the a from the b.",
    "Place the logo on busy photos or saturated colours.",
  ];
  protected readonly dontIt = [
    "Stirare, ruotare, inclinare o ritagliare il marchio.",
    "Aggiungere contorni, ombre, smussi o bagliori alle versioni piatte.",
    "Ricolorare il punto, spostarlo, ridimensionarlo o aggiungerne altri.",
    "Ricostruire il monogramma con un font o separare la a dalla b.",
    "Mettere il logo su foto affollate o colori saturi.",
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
