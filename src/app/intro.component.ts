import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, computed, inject, signal, viewChild } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { SpotlightDirective } from "./spotlight.directive";
import { CONTRIBUTIONS, EDUCATION, PROFILE, STACK, UI, lang } from "../lib/site";

interface CapabilityDomain {
  id: string;
  badge: string;
  titleEn: string;
  titleIt: string;
  summaryEn: string;
  summaryIt: string;
  stack: string[];
  proofEn: string;
  proofIt: string;
}

const CAPABILITIES: CapabilityDomain[] = [
  {
    id: "ai",
    badge: "01",
    titleEn: "AI Agents & LLM Tooling",
    titleIt: "Agenti AI & Tooling LLM",
    summaryEn: "I build MCP servers, deterministic guardrails for LLMs, and multi-actor coordination tools where humans and coding agents ship together.",
    summaryIt: "Costruisco server MCP, guardrail deterministici per LLM e piattaforme di coordinamento in cui persone e agenti rilasciano software insieme.",
    stack: ["MCP Protocol", "Rust (~90 tools)", "Candle", "OpenAI API", "Tree-sitter AST"],
    proofEn: "Built Trama's Rust MCP server, Mnemosyne's semantic code memory for AI, and TrainGame's validated LLM narrator.",
    proofIt: "Ho costruito il server MCP di Trama, la memoria semantica per AI di Mnemosyne e il narratore LLM validato di TrainGame.",
  },
  {
    id: "backend",
    badge: "02",
    titleEn: "Distributed Backend & Data",
    titleIt: "Backend Distribuiti & Dati",
    summaryEn: "Event-driven architectures, async stream consumers, type-safe ORMs, and end-to-end observability in production environments.",
    summaryIt: "Architetture event-driven, consumer asincroni su stream, ORM type-safe e osservabilità completa in ambienti di produzione.",
    stack: ["Rust · Tokio · Axum", "Java · Spring Boot", "Valkey Streams · S3", "PostgreSQL · DuckDB", "OpenTelemetry · Grafana"],
    proofEn: "Designed a client's production event-driven Rust platform at Luna S.r.l. and published ducklake-orm on crates.io.",
    proofIt: "Ho progettato la piattaforma Rust event-driven in produzione per un cliente in Luna S.r.l. e pubblicato ducklake-orm su crates.io.",
  },
  {
    id: "frontend",
    badge: "03",
    titleEn: "Web, Mobile & Product UI",
    titleIt: "Web, Mobile & Interfacce di Prodotto",
    summaryEn: "Fast, accessible interfaces and operator consoles designed around real workflows, live WebSocket state, and clean visual systems.",
    summaryIt: "Interfacce veloci, accessibili e console operatore progettate attorno a flussi reali, stato live via WebSocket e design pulito.",
    stack: ["Angular", "React", "React Native", "TypeScript", "Tailwind CSS · WebSockets"],
    proofEn: "Shipping operator consoles and a ~200-vehicle fleet platform in production, plus Trama's full web workspace.",
    proofIt: "Rilascio console operatore e una piattaforma fleet con ~200 mezzi in produzione, oltre all'intero workspace web di Trama.",
  },
  {
    id: "systems",
    badge: "04",
    titleEn: "Simulations, Engines & Native Tools",
    titleIt: "Simulazioni, Motori & Tool Nativi",
    summaryEn: "Server-authoritative multiplayer, content-addressed storage daemons, and deterministic ECS worlds compiled to native or WebAssembly.",
    summaryIt: "Multiplayer server-authoritative, demoni di storage content-addressed e mondi ECS deterministici compilati in nativo o WebAssembly.",
    stack: ["Bevy ECS", "SpacetimeDB · WASM", "redb · BLAKE3 · zstd", "SQLite", "Ratatui TUI"],
    proofEn: "Authoring Eivar-Online's predicted multiplayer simulation and Mnemosyne's always-on local daemon.",
    proofIt: "Sviluppo la simulazione multiplayer predetta di Eivar-Online e il demone locale sempre attivo di Mnemosyne.",
  },
];

@Component({
  selector: "app-intro",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent, SpotlightDirective],
  template: `
    <section id="intro" class="scroll-mt-16">
      <div class="hero">
        <!-- Ultra-lightweight 60fps 2D Canvas Grid (auto-pauses when idle, zero DOM allocations). -->
        <div class="hero-backdrop" aria-hidden="true">
          <canvas #gridCanvas class="hero-canvas"></canvas>
          <div class="hero-glow-orb"></div>
        </div>

        <div class="hero-inner">
          <!-- Left Column: Full-Spectrum Positioning & Actions -->
          <div class="hero-copy min-w-0">
            <h1>
              <span class="sr-only">{{ profile.name }} — </span>
              <span class="hero-title">
                <span class="line"><span>{{ role().main }}</span></span>
                @if (role().sub) {
                  <span class="line sub"><span>{{ role().sub }}<span class="brand-dot">.</span></span></span>
                }
              </span>
            </h1>

            <p class="hero-lede stagger-in">{{ profile.headline }}</p>

            <!-- Interactive Domain Pills: click to jump straight to that capability in Section 01 -->
            <div class="stagger-in flex flex-wrap gap-2">
              @for (cap of capabilities; track cap.id; let idx = $index) {
                <button
                  type="button"
                  class="hero-domain-pill"
                  [class.is-active]="activeCap() === idx"
                  (click)="focusCapability(idx)"
                >
                  <span class="hero-domain-dot" aria-hidden="true"></span>
                  <span>{{ lang() === 'it' ? cap.titleIt : cap.titleEn }}</span>
                </button>
              }
            </div>

            <div class="stagger-in flex flex-wrap items-center gap-3 pt-1">
              <a href="#work" class="btn btn-primary">
                <span>{{ lang() === 'it' ? 'Esplora i progetti' : 'Explore projects' }}</span>
                <svg appIcon="arrow-right" class="size-4"></svg>
              </a>
              <a href="/alessandro-bruno-cv.pdf" download class="btn btn-ghost">
                <svg appIcon="download" class="size-4"></svg>
                <span>{{ lang() === 'it' ? 'Scarica CV' : 'Download CV' }}</span>
              </a>
              <a [href]="profile.github" target="_blank" rel="noreferrer" class="btn btn-quiet">
                <svg appIcon="github" class="size-4"></svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <!-- Right Column: Soft Minimal Brand & Proof Bento Cluster -->
          <div class="hero-bento stagger-in">
            <!-- Main ab. Soft Minimal Identity Stage -->
            <div class="hero-brand-card card" appSpotlight>
              <div class="hero-brand-top">
                <span class="badge-soft">
                  <span class="badge-soft-dot" aria-hidden="true"></span>
                  <span>{{ profile.name }}</span>
                </span>
                <span class="font-mono text-caption text-faint">{{ profile.location }}</span>
              </div>

              <div class="hero-mark-stage" aria-hidden="true">
                <span class="hero-mark-float">
                  <img class="hero-mark-img dark:hidden" src="/brand/ab-monogram.webp" alt="" width="960" height="666" fetchpriority="high" />
                  <img class="hero-mark-img hidden dark:block" src="/brand/ab-monogram-white.webp" alt="" width="960" height="666" fetchpriority="high" />
                </span>
              </div>

              <div class="hero-brand-bottom">
                <span class="brand-wordmark hero-wordmark">{{ profile.name }}</span>
                <span class="text-caption text-muted">Full-Spectrum Engineer</span>
              </div>
            </div>

            <!-- 3 Soft Proof Mini-Cards directly integrated into the Hero Bento -->
            <div class="hero-proof-grid">
              <div class="hero-stat-card card" appSpotlight>
                <span class="text-caption font-medium text-muted">{{ lang() === 'it' ? 'Esperienza live' : 'Production' }}</span>
                <strong class="hero-stat-val">{{ lang() === 'it' ? '1+ anno' : '1+ year' }}</strong>
                <span class="text-caption text-faint">Rust, Spring, React & Angular</span>
              </div>

              @if (published; as c) {
                <a [href]="c.href" target="_blank" rel="noreferrer" class="hero-stat-card card card-link" appSpotlight>
                  <span class="flex items-center justify-between text-caption font-medium text-muted">
                    <span>crates.io</span>
                    <svg appIcon="arrow-up-right" class="card-arrow size-3.5"></svg>
                  </span>
                  <strong class="hero-stat-val text-accent">{{ c.title }}</strong>
                  <span class="text-caption text-faint">{{ lang() === 'it' ? 'ORM Rust open-source' : 'Open-source Rust ORM' }}</span>
                </a>
              }

              <a href="#experience" class="hero-stat-card card card-link" appSpotlight>
                <span class="flex items-center justify-between text-caption font-medium text-muted">
                  <span>{{ lang() === 'it' ? 'Laurea & Tesi' : 'B.Sc. & Thesis' }}</span>
                  <svg appIcon="arrow-up-right" class="card-arrow size-3.5"></svg>
                </span>
                <strong class="hero-stat-val">PETRA</strong>
                <span class="text-caption text-faint">{{ lang() === 'it' ? 'Telemetria real-time · UniBo' : 'Real-time telemetry · UniBo' }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Scroll Cue so the initial viewport feels like a complete single screen -->
        <div class="hero-scroll-bar">
          <a href="#capabilities" class="hero-scroll-cue">
            <span class="hero-scroll-mouse" aria-hidden="true">
              <span class="hero-scroll-wheel"></span>
            </span>
            <span>{{ lang() === 'it' ? 'Scorri per vedere di più' : 'Scroll to explore' }}</span>
            <svg appIcon="arrow-down" class="size-3.5 hero-scroll-arrow"></svg>
          </a>
        </div>
      </div>

      <!-- Smooth Soft-Pill Tech Marquee -->
      <div class="tech-band" [attr.aria-label]="lang() === 'it' ? 'Tecnologie' : 'Technologies'" role="group">
        @for (row of techRows(); track $index; let odd = $odd) {
          <div class="tech-row" [class.is-ghost]="odd">
            @for (copy of [0, 1]; track copy) {
              <div class="tech-seq" [attr.aria-hidden]="copy === 1 ? 'true' : null">
                @for (t of row; track $index) { <span>{{ t }}</span> }
              </div>
            }
          </div>
        }
      </div>

      <!-- 01 // FULL-SPECTRUM CAPABILITIES & PROFILE -->
      <div id="capabilities" class="container-x section scroll-mt-20">
        <app-section-head
          n="01"
          [title]="lang() === 'it' ? 'Cosa costruisco' : 'What I build'"
          [kicker]="lang() === 'it' ? 'AI · Backend · Frontend · Sistemi' : 'AI · Backend · Frontend · Systems'"
        >
          <p class="section-lede">{{ profile.bio }}</p>
        </app-section-head>

        <!-- Interactive 4-Domain Bento Matrix (Borderless at rest, elevates on hover) -->
        <div class="cap-grid reveal-on-scroll">
          @for (cap of capabilities; track cap.id; let i = $index) {
            <article
              class="cap-card card"
              (mouseenter)="activeCap.set(i)"
              appSpotlight
            >
              <div class="flex items-center justify-between gap-3">
                <span class="cap-badge">
                  <span class="cap-badge-dot" aria-hidden="true"></span>
                  <span>{{ cap.badge }}</span>
                </span>
                <span class="font-mono text-caption text-faint">{{ cap.stack[0] }}</span>
              </div>

              <h3 class="mt-5 text-title font-semibold tracking-tight text-fg">
                {{ lang() === 'it' ? cap.titleIt : cap.titleEn }}<span class="brand-dot" aria-hidden="true">.</span>
              </h3>
              <p class="mt-2.5 text-body text-muted leading-relaxed">
                {{ lang() === 'it' ? cap.summaryIt : cap.summaryEn }}
              </p>

              <div class="cap-proof mt-5">
                <span class="font-mono text-micro uppercase tracking-wider text-accent">
                  {{ lang() === 'it' ? 'Evidenza reale' : 'Proven in practice' }}
                </span>
                <p class="mt-1 text-small text-fg">{{ lang() === 'it' ? cap.proofIt : cap.proofEn }}</p>
              </div>

              <ul class="mt-5 flex flex-wrap gap-1.5 pt-1">
                @for (item of cap.stack; track item) {
                  <li class="chip">{{ item }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  protected readonly profile = PROFILE;
  protected readonly education = EDUCATION;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly capabilities = CAPABILITIES;
  protected readonly activeCap = signal<number>(0);

  protected get published() {
    return CONTRIBUTIONS.find((c) => c.status === "Published");
  }

  protected readonly techRows = computed(() => {
    lang();
    const split = (list: string, sep: string) => list.split(sep).map((t) => t.trim()).filter(Boolean);
    const [infra, ...code] = [...STACK.groups].reverse();
    const first = ["Trama", "MCP Agents", ...code.reverse().flatMap((g) => [...split(g.name, "&"), ...split(g.items, "·")])];
    const second = [...split(infra.items, "·"), ...split(infra.also ?? "", ",")];
    return [[...new Set(first)], [...new Set(second)]];
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly gridCanvas = viewChild<ElementRef<HTMLCanvasElement>>("gridCanvas");
  private cleanup: (() => void) | null = null;

  protected focusCapability(index: number) {
    this.activeCap.set(index);
    if (typeof document !== "undefined") {
      document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  ngAfterViewInit() {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = this.gridCanvas()?.nativeElement;
    const hero = this.host.nativeElement.querySelector<HTMLElement>(".hero");
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const CELL = 56;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointerX = -9999;
    let pointerY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let hovering = false;
    let rafId = 0;
    const cells = new Map<string, { cx: number; cy: number; alpha: number }>();

    const isDark = () => document.documentElement.classList.contains("dark");

    const drawStaticOrActive = () => {
      rafId = 0;
      ctx.clearRect(0, 0, width, height);

      const dark = isDark();
      const baseStroke = dark ? "rgba(255, 255, 255, 0.045)" : "rgba(31, 41, 55, 0.045)";

      // 1. Base subtle grid
      ctx.strokeStyle = baseStroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += CELL) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = 0; y <= height; y += CELL) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // 2. Fading visited cells
      let needsNextFrame = false;
      for (const [key, cell] of cells) {
        cell.alpha *= 0.92;
        if (cell.alpha < 0.015) {
          cells.delete(key);
          continue;
        }
        needsNextFrame = true;
        ctx.fillStyle = `rgba(59, 130, 246, ${(cell.alpha * (dark ? 0.2 : 0.11)).toFixed(3)})`;
        ctx.strokeStyle = `rgba(59, 130, 246, ${(cell.alpha * 0.45).toFixed(3)})`;
        ctx.fillRect(cell.cx * CELL + 1, cell.cy * CELL + 1, CELL - 1, CELL - 1);
        ctx.strokeRect(cell.cx * CELL + 0.5, cell.cy * CELL + 0.5, CELL, CELL);
      }

      // 3. Smooth radial spotlight around pointer
      if (hovering && pointerX > -1000) {
        smoothX += (pointerX - smoothX) * 0.25;
        smoothY += (pointerY - smoothY) * 0.25;
        if (Math.hypot(pointerX - smoothX, pointerY - smoothY) > 0.5) {
          needsNextFrame = true;
        }
        const grad = ctx.createRadialGradient(smoothX, smoothY, 8, smoothX, smoothY, 210);
        grad.addColorStop(0, dark ? "rgba(59, 130, 246, 0.18)" : "rgba(59, 130, 246, 0.10)");
        grad.addColorStop(1, "rgba(59, 130, 246, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, 210, 0, Math.PI * 2);
        ctx.fill();
      }

      if (needsNextFrame) {
        rafId = requestAnimationFrame(drawStaticOrActive);
      }
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(drawStaticOrActive);
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.ceil(rect.width);
      height = Math.ceil(rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };

    let heroRect: DOMRect | null = null;
    const onEnter = () => {
      heroRect = hero.getBoundingClientRect();
      hovering = true;
      schedule();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!heroRect) heroRect = hero.getBoundingClientRect();
      pointerX = event.clientX - heroRect.left;
      pointerY = event.clientY - heroRect.top;
      if (smoothX < -1000) {
        smoothX = pointerX;
        smoothY = pointerY;
      }
      hovering = true;
      const cx = Math.floor(pointerX / CELL);
      const cy = Math.floor(pointerY / CELL);
      const key = `${cx}:${cy}`;
      const existing = cells.get(key);
      if (!existing || existing.alpha < 0.7) {
        if (cells.size < 28) {
          cells.set(key, { cx, cy, alpha: 1 });
        }
      }
      schedule();
    };

    const onLeave = () => {
      hovering = false;
      heroRect = null;
      schedule();
    };

    const themeObserver = new MutationObserver(() => schedule());

    this.zone.runOutsideAngular(() => {
      resize();
      hero.addEventListener("pointerenter", onEnter, { passive: true });
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    });

    this.cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      hero.removeEventListener("pointerenter", onEnter);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }

  ngOnDestroy() {
    this.cleanup?.();
  }

  protected readonly role = computed(() => {
    lang();
    const [main, sub] = PROFILE.role.split(" — ");
    return { main, sub: sub ?? "" };
  });
}
