import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  inject,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { IconComponent } from "./icon.component";
import { lang } from "../lib/site";

/** Logical canvas size; the canvas is scaled to fit and stays crisp on high-DPI screens. */
const W = 800;
const H = 320;
const GROUND = 262;
const PLAYER_X = 120;
const PLAYER_R = 13;
const GRAVITY = 2300;
const JUMP_V = -800;
const START_SPEED = 330;
const MAX_SPEED = 780;
const BEST_KEY = "dot-runner-best";

/** The things that break builds. Tall ones need a well-timed jump. */
const BUGS: readonly { label: string; tall?: boolean }[] = [
  { label: "unwrap()" },
  { label: "merge conflict" },
  { label: "flaky test" },
  { label: "null" },
  { label: "NaN" },
  { label: "CORS" },
  { label: "OOM", tall: true },
  { label: "deadlock", tall: true },
  { label: "TODO" },
  { label: "off-by-one" },
  { label: "race condition" },
  { label: "429" },
];

type Bug = { x: number; w: number; h: number; label: string };
type Commit = { x: number; y: number; taken: boolean };
type Pop = { x: number; y: number; t: number };
type Phase = "ready" | "running" | "over";

/**
 * Easter egg: the ab. dot as an endless runner. Jump the bugs, collect commits.
 * Space / ↑ / W or a tap to jump; Enter or a tap restarts; Escape closes.
 */
@Component({
  selector: "app-dot-runner",
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="game-overlay" (click)="close()" aria-hidden="true"></div>
    <div
      #panel
      class="game-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-title"
      tabindex="-1"
      (keydown)="trapFocus($event)"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="eyebrow"><span class="live-dot" aria-hidden="true"></span>Easter egg</p>
          <h2 id="game-title" class="mt-2 text-title font-semibold tracking-tight text-fg">Dot Runner<span class="brand-dot">.</span></h2>
          <p class="mt-1 text-small text-muted">
            {{ it() ? 'Salta i bug, raccogli i commit. Spazio, ↑ o tocca.' : 'Jump the bugs, collect the commits. Space, ↑ or tap.' }}
          </p>
        </div>
        <button #closeBtn type="button" class="icon-btn shrink-0" (click)="close()" [attr.aria-label]="it() ? 'Chiudi il gioco' : 'Close the game'">
          <svg appIcon="x" class="size-5"></svg>
        </button>
      </div>

      <div class="game-stage">
        <canvas
          #canvas
          class="game-canvas"
          tabindex="0"
          (pointerdown)="onPointer($event)"
          [attr.aria-label]="it() ? 'Area di gioco: premi spazio per saltare' : 'Game area: press space to jump'"
        ></canvas>
        @if (phase() !== 'running') {
          <div class="game-message" aria-live="polite">
            @if (phase() === 'ready') {
              <p class="text-subhead font-semibold text-fg">{{ it() ? 'Pronto a rilasciare?' : 'Ready to ship?' }}</p>
              <p class="mt-1 text-small text-muted">{{ it() ? 'Premi spazio o tocca per partire.' : 'Press space or tap to start.' }}</p>
            } @else {
              <p class="text-subhead font-semibold text-fg">
                {{ it() ? 'Build fallita' : 'Build failed' }} — <span class="text-accent">{{ lastBug() }}</span>
              </p>
              <p class="mt-1 text-small text-muted">
                {{ score() }} {{ it() ? 'punti' : 'points' }} · {{ commits() }} {{ it() || commits() === 1 ? 'commit' : 'commits' }}
                @if (newBest()) { · <strong class="text-accent">{{ it() ? 'nuovo record!' : 'new best!' }}</strong> }
              </p>
              <p class="mt-3 text-small text-muted">{{ it() ? 'Invio o tocca per riprovare.' : 'Enter or tap to try again.' }}</p>
            }
          </div>
        }
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-muted">
        <span class="flex gap-5 tabular-nums">
          <span>{{ it() ? 'Punti' : 'Score' }} <strong class="text-fg">{{ score() }}</strong></span>
          <span>Commit <strong class="text-fg">{{ commits() }}</strong></span>
          <span>{{ it() ? 'Record' : 'Best' }} <strong class="text-fg">{{ best() }}</strong></span>
        </span>
        <span class="meta-mono">{{ it() ? 'Esc per chiudere' : 'Esc to close' }}</span>
      </div>
    </div>
  `,
})
export class DotRunnerComponent implements AfterViewInit, OnDestroy {
  readonly closed = output<void>();

  private readonly zone = inject(NgZone);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>("panel");
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>("closeBtn");

  protected readonly it = () => lang() === "it";
  protected readonly phase = signal<Phase>("ready");
  protected readonly score = signal(0);
  protected readonly commits = signal(0);
  protected readonly best = signal(readBest());
  protected readonly newBest = signal(false);
  protected readonly lastBug = signal("");

  private ctx: CanvasRenderingContext2D | null = null;
  private frame = 0;
  private last = 0;
  private resizeObserver: ResizeObserver | null = null;
  private previousOverflow = "";

  // World state.
  private y = GROUND - PLAYER_R;
  private vy = 0;
  private speed = START_SPEED;
  private distance = 0;
  private nextSpawn = 0;
  private bugs: Bug[] = [];
  private items: Commit[] = [];
  private pops: Pop[] = [];
  private colors = readColors();

  ngAfterViewInit() {
    const canvas = this.canvas().nativeElement;
    this.ctx = canvas.getContext("2d");
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    this.resizeObserver = new ResizeObserver(() => this.fit());
    this.resizeObserver.observe(canvas);
    this.fit();
    this.reset();
    this.draw();
    canvas.focus();
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    document.documentElement.style.overflow = this.previousOverflow;
  }

  @HostListener("document:keydown", ["$event"])
  onKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      event.preventDefault();
      this.action();
    } else if (event.key === "Enter" && this.phase() === "over") {
      event.preventDefault();
      this.action();
    }
  }

  protected onPointer(event: PointerEvent) {
    event.preventDefault();
    this.action();
  }

  protected close() {
    this.closed.emit();
  }

  /** Keep Tab inside the dialog: close button ↔ canvas. */
  protected trapFocus(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const first = this.closeBtn().nativeElement;
    const lastEl = this.canvas().nativeElement;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault();
      first.focus();
    }
  }

  private readonly onVisibility = () => {
    // A hidden tab freezes the run instead of letting a bug hit the dot unseen.
    if (document.visibilityState === "hidden") {
      cancelAnimationFrame(this.frame);
    } else if (this.phase() === "running") {
      this.last = performance.now();
      this.loop();
    }
  };

  private action() {
    const phase = this.phase();
    if (phase === "ready") {
      this.start();
      this.jump();
    } else if (phase === "running") {
      this.jump();
    } else {
      this.reset();
      this.start();
    }
  }

  private jump() {
    // Only from the ground (a small tolerance makes it feel fair).
    if (this.y >= GROUND - PLAYER_R - 2) this.vy = JUMP_V;
  }

  private start() {
    this.colors = readColors();
    this.phase.set("running");
    this.newBest.set(false);
    this.last = performance.now();
    this.zone.runOutsideAngular(() => this.loop());
  }

  private reset() {
    this.y = GROUND - PLAYER_R;
    this.vy = 0;
    this.speed = START_SPEED;
    this.distance = 0;
    this.nextSpawn = 380;
    this.bugs = [];
    this.items = [];
    this.pops = [];
    this.score.set(0);
    this.commits.set(0);
    this.phase.set("ready");
  }

  private readonly loop = () => {
    const now = performance.now();
    const dt = Math.min(0.032, (now - this.last) / 1000);
    this.last = now;
    this.step(dt);
    this.draw();
    if (this.phase() === "running") this.frame = requestAnimationFrame(this.loop);
  };

  private step(dt: number) {
    this.speed = Math.min(MAX_SPEED, this.speed + 11 * dt);
    const dx = this.speed * dt;
    this.distance += dx;

    // Player physics.
    this.vy += GRAVITY * dt;
    this.y += this.vy * dt;
    if (this.y > GROUND - PLAYER_R) {
      this.y = GROUND - PLAYER_R;
      this.vy = 0;
    }

    // Spawn bugs (and sometimes a commit above the gap) at speed-scaled distances.
    this.nextSpawn -= dx;
    if (this.nextSpawn <= 0) {
      const pick = BUGS[Math.floor(Math.random() * BUGS.length)];
      const w = this.measure(pick.label) + 22;
      this.bugs.push({ x: W + 20, w, h: pick.tall ? 44 : 28, label: pick.label });
      if (Math.random() < 0.55) {
        this.items.push({ x: W + 20 + w + 90 + Math.random() * 80, y: GROUND - 70 - Math.random() * 60, taken: false });
      }
      this.nextSpawn = this.speed * (0.75 + Math.random() * 0.75) + 170;
    }

    for (const b of this.bugs) b.x -= dx;
    for (const c of this.items) c.x -= dx;
    for (const p of this.pops) p.t += dt;
    this.bugs = this.bugs.filter((b) => b.x + b.w > -10);
    this.items = this.items.filter((c) => c.x > -20 && !c.taken);
    this.pops = this.pops.filter((p) => p.t < 0.7);

    // Commits.
    for (const c of this.items) {
      if (Math.hypot(c.x - PLAYER_X, c.y - this.y) < PLAYER_R + 8) {
        c.taken = true;
        this.pops.push({ x: c.x, y: c.y, t: 0 });
        this.zone.run(() => this.commits.update((n) => n + 1));
      }
    }

    // Collision: circle vs rounded box, with 2px of grace.
    for (const b of this.bugs) {
      const top = GROUND - b.h;
      const nx = Math.max(b.x, Math.min(PLAYER_X, b.x + b.w));
      const ny = Math.max(top, Math.min(this.y, GROUND));
      if (Math.hypot(PLAYER_X - nx, this.y - ny) < PLAYER_R - 2) {
        this.zone.run(() => this.gameOver(b.label));
        return;
      }
    }

    const score = Math.floor(this.distance / 10) + this.commits() * 25;
    if (score !== this.score()) this.zone.run(() => this.score.set(score));
  }

  private gameOver(label: string) {
    this.phase.set("over");
    this.lastBug.set(label);
    if (this.score() > this.best()) {
      this.best.set(this.score());
      this.newBest.set(true);
      writeBest(this.score());
    }
  }

  private measure(text: string): number {
    if (!this.ctx) return text.length * 7;
    this.ctx.font = "600 12px Inter, ui-sans-serif, system-ui, sans-serif";
    return this.ctx.measureText(text).width;
  }

  /** Match the canvas backing store to its CSS size × devicePixelRatio, in logical 800×320 units. */
  private fit() {
    const canvas = this.canvas().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx?.setTransform((rect.width * dpr) / W, 0, 0, (rect.height * dpr) / H, 0, 0);
    if (this.phase() !== "running") this.draw();
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const c = this.colors;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);

    // Grid, drifting slower than the ground for depth.
    const grid = 32;
    const off = (this.distance * 0.35) % grid;
    ctx.strokeStyle = c.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -off; x < W; x += grid) {
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, GROUND);
    }
    for (let y = GROUND - grid; y > 0; y -= grid) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.stroke();

    // Ground with moving ticks.
    ctx.strokeStyle = c.line;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + 0.5);
    ctx.lineTo(W, GROUND + 0.5);
    ctx.stroke();
    const tick = 48;
    const toff = this.distance % tick;
    ctx.beginPath();
    for (let x = -toff; x < W; x += tick) {
      ctx.moveTo(x, GROUND + 10);
      ctx.lineTo(x + 14, GROUND + 10);
    }
    ctx.stroke();

    // Commits: blue rings.
    for (const it of this.items) {
      ctx.beginPath();
      ctx.arc(it.x, it.y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = c.signal;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(it.x, it.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = c.signal;
      ctx.fill();
    }

    // Bugs: ink pills with their name.
    ctx.font = "600 12px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const b of this.bugs) {
      const top = GROUND - b.h;
      roundRect(ctx, b.x, top, b.w, b.h, 9);
      ctx.fillStyle = c.ink;
      ctx.fill();
      ctx.fillStyle = c.onInk;
      ctx.fillText(b.label, b.x + b.w / 2, top + (b.h > 30 ? b.h / 2 : 14.5));
    }

    // Floating "+commit".
    for (const p of this.pops) {
      ctx.globalAlpha = 1 - p.t / 0.7;
      ctx.fillStyle = c.signal;
      ctx.fillText("+commit", p.x, p.y - 18 - p.t * 30);
      ctx.globalAlpha = 1;
    }

    // Shadow under the dot shrinks as it rises.
    const lift = GROUND - PLAYER_R - this.y;
    const s = Math.max(0.35, 1 - lift / 160);
    ctx.beginPath();
    ctx.ellipse(PLAYER_X, GROUND + 2, PLAYER_R * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.shadow;
    ctx.fill();

    // The dot.
    const g = ctx.createRadialGradient(PLAYER_X - 4, this.y - 5, 2, PLAYER_X, this.y, PLAYER_R);
    g.addColorStop(0, "#60a5fa");
    g.addColorStop(1, "#2563eb");
    ctx.beginPath();
    ctx.arc(PLAYER_X, this.y, PLAYER_R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Canvas colours from the live theme tokens, so the game matches light and dark. */
function readColors() {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const dark = document.documentElement.classList.contains("dark");
  return {
    bg: v("--subtle", "#f8fafc"),
    grid: dark ? "rgba(241,245,249,0.05)" : "rgba(15,23,42,0.05)",
    line: v("--line-strong", "#cbd5e1"),
    ink: dark ? "#e2e8f0" : "#1f2937",
    onInk: dark ? "#0f172a" : "#ffffff",
    signal: v("--signal", "#3b82f6"),
    shadow: dark ? "rgba(0,0,0,0.35)" : "rgba(15,23,42,0.12)",
  };
}

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(value: number) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Private mode: the record just lasts for this visit.
  }
}
