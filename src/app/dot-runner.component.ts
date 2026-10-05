import { Component, HostListener, signal } from "@angular/core";
import { CanvasGame, FONT, roundRect } from "./game-kit";
import { lang } from "../lib/site";

const W = 800;
const H = 320;
const GROUND = 262;
const PLAYER_X = 120;
const PLAYER_R = 13;
const GRAVITY = 2300;
const JUMP_V = -800;
const START_SPEED = 330;
const MAX_SPEED = 780;

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

/** Dot Runner: the ab. dot jumps the bugs and collects commits. Space / ↑ / W or a tap. */
@Component({
  selector: "app-dot-runner",
  standalone: true,
  template: `
    <div class="game-stage">
      <canvas
        #canvas
        class="game-canvas"
        style="aspect-ratio: 800 / 320"
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
            <p class="text-subhead font-semibold text-fg">{{ it() ? 'Build fallita' : 'Build failed' }} — <span class="text-accent">{{ lastBug() }}</span></p>
            <p class="mt-1 text-small text-muted">
              {{ score() }} {{ it() ? 'punti' : 'points' }} · {{ commits() }} {{ it() || commits() === 1 ? 'commit' : 'commits' }}
              @if (newBest()) { · <strong class="text-accent">{{ it() ? 'nuovo record!' : 'new best!' }}</strong> }
            </p>
            <p class="mt-3 text-small text-muted">{{ it() ? 'Invio o tocca per riprovare.' : 'Enter or tap to try again.' }}</p>
          }
        </div>
      }
    </div>
    <div class="game-hud">
      <span>{{ it() ? 'Punti' : 'Score' }} <strong>{{ score() }}</strong></span>
      <span>Commit <strong>{{ commits() }}</strong></span>
      <span>{{ it() ? 'Record' : 'Best' }} <strong>{{ best() }}</strong></span>
    </div>
  `,
})
export class DotRunnerComponent extends CanvasGame {
  protected readonly id = "runner" as const;
  protected readonly W = W;
  protected readonly H = H;
  protected readonly it = () => lang() === "it";
  protected readonly commits = signal(0);
  protected readonly lastBug = signal("");

  private y = GROUND - PLAYER_R;
  private vy = 0;
  private speed = START_SPEED;
  private distance = 0;
  private nextSpawn = 0;
  private bugs: Bug[] = [];
  private items: Commit[] = [];
  private pops: Pop[] = [];

  @HostListener("document:keydown", ["$event"])
  onKey(event: KeyboardEvent) {
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
    if (this.y >= GROUND - PLAYER_R - 2) this.vy = JUMP_V;
  }

  protected reset() {
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

  protected step(dt: number) {
    this.speed = Math.min(MAX_SPEED, this.speed + 11 * dt);
    const dx = this.speed * dt;
    this.distance += dx;

    this.vy += GRAVITY * dt;
    this.y += this.vy * dt;
    if (this.y > GROUND - PLAYER_R) {
      this.y = GROUND - PLAYER_R;
      this.vy = 0;
    }

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

    for (const c of this.items) {
      if (Math.hypot(c.x - PLAYER_X, c.y - this.y) < PLAYER_R + 8) {
        c.taken = true;
        this.pops.push({ x: c.x, y: c.y, t: 0 });
        this.zone.run(() => this.commits.update((n) => n + 1));
      }
    }

    // Circle vs rounded box, with 2px of grace.
    for (const b of this.bugs) {
      const top = GROUND - b.h;
      const nx = Math.max(b.x, Math.min(PLAYER_X, b.x + b.w));
      const ny = Math.max(top, Math.min(this.y, GROUND));
      if (Math.hypot(PLAYER_X - nx, this.y - ny) < PLAYER_R - 2) {
        this.zone.run(() => this.lastBug.set(b.label));
        this.finish();
        return;
      }
    }

    this.setScore(Math.floor(this.distance / 10) + this.commits() * 25);
  }

  private measure(text: string): number {
    if (!this.ctx) return text.length * 7;
    this.ctx.font = FONT;
    return this.ctx.measureText(text).width;
  }

  protected draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const c = this.colors;
    this.drawGrid(this.distance * 0.35, 32, GROUND);

    ctx.strokeStyle = c.line;
    ctx.lineWidth = 1;
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

    ctx.font = FONT;
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

    for (const p of this.pops) {
      ctx.globalAlpha = 1 - p.t / 0.7;
      ctx.fillStyle = c.signal;
      ctx.fillText("+commit", p.x, p.y - 18 - p.t * 30);
      ctx.globalAlpha = 1;
    }

    const lift = GROUND - PLAYER_R - this.y;
    const s = Math.max(0.35, 1 - lift / 160);
    ctx.beginPath();
    ctx.ellipse(PLAYER_X, GROUND + 2, PLAYER_R * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.shadow;
    ctx.fill();

    const g = ctx.createRadialGradient(PLAYER_X - 4, this.y - 5, 2, PLAYER_X, this.y, PLAYER_R);
    g.addColorStop(0, "#60a5fa");
    g.addColorStop(1, "#2563eb");
    ctx.beginPath();
    ctx.arc(PLAYER_X, this.y, PLAYER_R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}
