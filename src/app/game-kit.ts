import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject, signal, viewChild } from "@angular/core";

export type GamePhase = "ready" | "running" | "over";

/** The games behind the easter egg. `id` is also the localStorage key suffix for the best score. */
export const GAMES = [
  {
    id: "runner",
    name: "Dot Runner",
    blurb: { en: "Jump the bugs, collect the commits.", it: "Salta i bug, raccogli i commit." },
    controls: { en: "Space, ↑ or tap", it: "Spazio, ↑ o tocca" },
  },
  {
    id: "tower",
    name: "Ship the Stack",
    blurb: { en: "Drop each layer of the stack right on top of the last.", it: "Fai cadere ogni livello dello stack esattamente sopra il precedente." },
    controls: { en: "Space, click or tap", it: "Spazio, clic o tocca" },
  },
  {
    id: "snake",
    name: "Stack Snake",
    blurb: { en: "Eat the technologies, don’t bite your own tail.", it: "Mangia le tecnologie, non morderti la coda." },
    controls: { en: "Arrows, WASD or swipe", it: "Frecce, WASD o swipe" },
  },
] as const;

export type GameId = (typeof GAMES)[number]["id"];

export function bestKey(id: GameId) {
  return `ab-game-best-${id}`;
}

export function readBest(id: GameId): number {
  try {
    return Number(localStorage.getItem(bestKey(id))) || 0;
  } catch {
    return 0;
  }
}

function writeBest(id: GameId, value: number) {
  try {
    localStorage.setItem(bestKey(id), String(value));
  } catch {
    // Private mode: the record just lasts for this visit.
  }
}

/** Canvas colours from the live theme tokens, so every game matches light and dark. */
export function readColors() {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const dark = document.documentElement.classList.contains("dark");
  return {
    dark,
    bg: v("--subtle", "#f8fafc"),
    surface: v("--surface", "#ffffff"),
    grid: dark ? "rgba(238,242,247,0.05)" : "rgba(15,23,42,0.05)",
    line: v("--line-strong", "#cbd5e1"),
    ink: dark ? "#e2e8f0" : "#1f2937",
    onInk: dark ? "#05080f" : "#ffffff",
    muted: v("--faint", "#6b7280"),
    signal: v("--signal", "#3b82f6"),
    soft: dark ? "#1a2436" : "#e8ecf2",
    soft2: dark ? "#223047" : "#d5dce6",
    shadow: dark ? "rgba(0,0,0,0.4)" : "rgba(15,23,42,0.12)",
  };
}

export type Colors = ReturnType<typeof readColors>;

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export const FONT = "600 12px Inter, ui-sans-serif, system-ui, sans-serif";

/**
 * Shared canvas plumbing for the games: a logical W×H drawing space scaled to the element and to
 * devicePixelRatio, a requestAnimationFrame loop run outside Angular, pause on a hidden tab, theme
 * colours, and best-score bookkeeping. Each game supplies reset(), step(dt) and draw().
 */
@Directive()
export abstract class CanvasGame implements AfterViewInit, OnDestroy {
  protected abstract readonly id: GameId;
  protected abstract readonly W: number;
  protected abstract readonly H: number;

  protected readonly zone = inject(NgZone);
  protected readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");

  readonly phase = signal<GamePhase>("ready");
  readonly score = signal(0);
  readonly best = signal(0);
  readonly newBest = signal(false);

  protected ctx: CanvasRenderingContext2D | null = null;
  protected colors: Colors = readColors();
  private frame = 0;
  private last = 0;
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext("2d");
    this.best.set(readBest(this.id));
    // State first: fit() draws, and draw() expects a world to exist.
    this.reset();
    this.resizeObserver = new ResizeObserver(() => this.fit());
    this.resizeObserver.observe(canvas);
    this.fit();
    canvas.focus();
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  protected abstract reset(): void;
  protected abstract step(dt: number): void;
  protected abstract draw(): void;

  protected start() {
    this.colors = readColors();
    this.phase.set("running");
    this.newBest.set(false);
    this.last = performance.now();
    cancelAnimationFrame(this.frame);
    this.zone.runOutsideAngular(() => this.loop());
  }

  /** Ends the run and records the best score. Safe to call from inside step(). */
  protected finish() {
    this.zone.run(() => {
      this.phase.set("over");
      if (this.score() > this.best()) {
        this.best.set(this.score());
        this.newBest.set(true);
        writeBest(this.id, this.score());
      }
    });
  }

  protected setScore(value: number) {
    if (value !== this.score()) this.zone.run(() => this.score.set(value));
  }

  private readonly loop = () => {
    const now = performance.now();
    const dt = Math.min(0.032, (now - this.last) / 1000);
    this.last = now;
    this.step(dt);
    this.draw();
    if (this.phase() === "running") this.frame = requestAnimationFrame(this.loop);
  };

  private readonly onVisibility = () => {
    // A hidden tab freezes the run rather than letting it end unseen.
    if (document.visibilityState === "hidden") {
      cancelAnimationFrame(this.frame);
    } else if (this.phase() === "running") {
      this.last = performance.now();
      this.zone.runOutsideAngular(() => this.loop());
    }
  };

  /** Match the backing store to the CSS size × devicePixelRatio, keeping logical W×H units. */
  private fit() {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx?.setTransform((rect.width * dpr) / this.W, 0, 0, (rect.height * dpr) / this.H, 0, 0);
    if (this.phase() !== "running") this.draw();
  }

  /** The faint grid every game shares as its floor. */
  protected drawGrid(offsetX = 0, cell = 32, bottom = this.H) {
    const ctx = this.ctx!;
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const off = ((offsetX % cell) + cell) % cell;
    for (let x = -off; x < this.W; x += cell) {
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, bottom);
    }
    for (let y = cell; y < bottom; y += cell) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(this.W, y + 0.5);
    }
    ctx.stroke();
  }
}
