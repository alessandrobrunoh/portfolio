import { Component, HostListener, signal } from "@angular/core";
import { CanvasGame, FONT, roundRect } from "./game-kit";
import { lang } from "../lib/site";

const CELL = 32;
const COLS = 25;
const ROWS = 12;
const W = COLS * CELL;
const H = ROWS * CELL;
const START_TICK = 0.13;
const MIN_TICK = 0.065;

const TECH = [
  "Rust", "Tokio", "Axum", "SQLx", "Tree-sitter", "Bevy", "TypeScript", "Angular", "React", "Node",
  "Java", "Spring Boot", "Python", "Docker", "PostgreSQL", "Valkey", "S3", "OpenTelemetry", "Grafana", "Kafka",
];

type Cell = { x: number; y: number };
type Dir = { x: number; y: number };
type Pop = { text: string; x: number; y: number; t: number };

/** Stack Snake: the ab. dot eats the stack. Arrows / WASD / swipe; walls and your own tail end the run. */
@Component({
  selector: "app-stack-snake",
  standalone: true,
  template: `
    <div class="game-stage">
      <canvas
        #canvas
        class="game-canvas"
        style="aspect-ratio: 800 / 384"
        tabindex="0"
        (pointerdown)="onDown($event)"
        (pointerup)="onUp($event)"
        [attr.aria-label]="it() ? 'Area di gioco: usa le frecce per muoverti' : 'Game area: use the arrow keys to move'"
      ></canvas>
      @if (phase() !== 'running') {
        <div class="game-message" aria-live="polite">
          @if (phase() === 'ready') {
            <p class="text-subhead font-semibold text-fg">{{ it() ? 'Mangia lo stack.' : 'Eat the stack.' }}</p>
            <p class="mt-1 text-small text-muted">{{ it() ? 'Frecce, WASD o swipe. Premi una freccia per partire.' : 'Arrows, WASD or swipe. Press an arrow to start.' }}</p>
          } @else {
            <p class="text-subhead font-semibold text-fg">{{ endReason() }}</p>
            <p class="mt-1 text-small text-muted">
              {{ eaten() }} {{ it() ? 'tecnologie' : 'technologies' }} · {{ score() }} {{ it() ? 'punti' : 'points' }}
              @if (newBest()) { · <strong class="text-accent">{{ it() ? 'nuovo record!' : 'new best!' }}</strong> }
            </p>
            <p class="mt-3 text-small text-muted">{{ it() ? 'Invio o tocca per riprovare.' : 'Enter or tap to try again.' }}</p>
          }
        </div>
      }
    </div>
    <div class="game-hud">
      <span>{{ it() ? 'Punti' : 'Score' }} <strong>{{ score() }}</strong></span>
      <span>{{ it() ? 'Ultima' : 'Last' }} <strong>{{ lastTech() || '—' }}</strong></span>
      <span>{{ it() ? 'Record' : 'Best' }} <strong>{{ best() }}</strong></span>
    </div>
  `,
})
export class StackSnakeComponent extends CanvasGame {
  protected readonly id = "snake" as const;
  protected readonly W = W;
  protected readonly H = H;
  protected readonly it = () => lang() === "it";
  protected readonly eaten = signal(0);
  protected readonly lastTech = signal("");
  protected readonly endReason = signal("");

  private body: Cell[] = [];
  private dir: Dir = { x: 1, y: 0 };
  private queue: Dir[] = [];
  private food: Cell = { x: 0, y: 0 };
  private foodLabel = "";
  private tickEvery = START_TICK;
  private acc = 0;
  private techIndex = 0;
  private pops: Pop[] = [];
  private swipe: { x: number; y: number } | null = null;
  private pulse = 0;

  @HostListener("document:keydown", ["$event"])
  onKey(event: KeyboardEvent) {
    const map: Record<string, Dir> = {
      ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
    };
    const next = map[event.key];
    if (next) {
      event.preventDefault();
      this.turn(next);
    } else if ((event.key === "Enter" || event.key === " ") && this.phase() !== "running") {
      event.preventDefault();
      this.restartOrStart();
    }
  }

  protected onDown(event: PointerEvent) {
    event.preventDefault();
    this.swipe = { x: event.clientX, y: event.clientY };
  }

  protected onUp(event: PointerEvent) {
    if (!this.swipe) return;
    const dx = event.clientX - this.swipe.x;
    const dy = event.clientY - this.swipe.y;
    this.swipe = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
      if (this.phase() !== "running") this.restartOrStart();
      return;
    }
    this.turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  }

  private restartOrStart() {
    if (this.phase() === "over") this.reset();
    this.start();
  }

  private turn(next: Dir) {
    if (this.phase() === "over") return;
    if (this.phase() === "ready") this.start();
    const last = this.queue[this.queue.length - 1] ?? this.dir;
    // No reversing into yourself, and no duplicate presses.
    if (next.x === -last.x && next.y === -last.y) return;
    if (next.x === last.x && next.y === last.y) return;
    if (this.queue.length < 3) this.queue.push(next);
  }

  protected reset() {
    const y = Math.floor(ROWS / 2);
    this.body = [{ x: 8, y }, { x: 7, y }, { x: 6, y }, { x: 5, y }];
    this.dir = { x: 1, y: 0 };
    this.queue = [];
    this.tickEvery = START_TICK;
    this.acc = 0;
    this.techIndex = Math.floor(Math.random() * TECH.length);
    this.pops = [];
    this.score.set(0);
    this.eaten.set(0);
    this.lastTech.set("");
    this.phase.set("ready");
    this.placeFood();
  }

  private placeFood() {
    let cell: Cell;
    do {
      cell = { x: 1 + Math.floor(Math.random() * (COLS - 2)), y: 1 + Math.floor(Math.random() * (ROWS - 2)) };
    } while (this.body.some((b) => b.x === cell.x && b.y === cell.y));
    this.food = cell;
    this.foodLabel = TECH[this.techIndex++ % TECH.length];
  }

  protected step(dt: number) {
    this.pulse += dt;
    for (const p of this.pops) p.t += dt;
    this.pops = this.pops.filter((p) => p.t < 0.9);
    this.acc += dt;
    while (this.acc >= this.tickEvery && this.phase() === "running") {
      this.acc -= this.tickEvery;
      this.advance();
    }
  }

  private advance() {
    if (this.queue.length) this.dir = this.queue.shift()!;
    const head = this.body[0];
    const next = { x: head.x + this.dir.x, y: head.y + this.dir.y };

    const wall = next.x < 0 || next.y < 0 || next.x >= COLS || next.y >= ROWS;
    const eats = next.x === this.food.x && next.y === this.food.y;
    // The tail moves away this tick unless we eat, so it does not count as a hit.
    const bodyToCheck = eats ? this.body : this.body.slice(0, -1);
    const bite = bodyToCheck.some((b) => b.x === next.x && b.y === next.y);
    if (wall || bite) {
      this.zone.run(() =>
        this.endReason.set(
          wall
            ? this.it() ? 'Fuori dal sistema: hai colpito il bordo.' : 'Out of bounds: you hit the wall.'
            : this.it() ? 'Dipendenza circolare: ti sei morso la coda.' : 'Circular dependency: you bit your own tail.',
        ),
      );
      this.finish();
      return;
    }

    this.body.unshift(next);
    if (eats) {
      const label = this.foodLabel;
      this.pops.push({ text: `+ ${label}`, x: next.x * CELL + CELL / 2, y: next.y * CELL, t: 0 });
      this.zone.run(() => {
        this.eaten.update((n) => n + 1);
        this.lastTech.set(label);
      });
      this.setScore(this.eaten() * 10);
      this.tickEvery = Math.max(MIN_TICK, this.tickEvery - 0.004);
      this.placeFood();
    } else {
      this.body.pop();
    }
  }

  protected draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const c = this.colors;
    this.drawGrid(0, CELL, H);

    ctx.font = FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Food: a blue ring with its technology on a chip above.
    const fx = this.food.x * CELL + CELL / 2;
    const fy = this.food.y * CELL + CELL / 2;
    const r = 7 + Math.sin(this.pulse * 5) * 1.2;
    ctx.beginPath();
    ctx.arc(fx, fy, r, 0, Math.PI * 2);
    ctx.strokeStyle = c.signal;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = c.signal;
    ctx.fill();
    const lw = ctx.measureText(this.foodLabel).width + 14;
    const lx = Math.min(W - lw - 4, Math.max(4, fx - lw / 2));
    const ly = this.food.y === 0 ? fy + 14 : fy - 32;
    roundRect(ctx, lx, ly, lw, 20, 10);
    ctx.fillStyle = c.ink;
    ctx.fill();
    ctx.fillStyle = c.onInk;
    ctx.fillText(this.foodLabel, lx + lw / 2, ly + 10.5);

    // Body: soft rounded squares, lighter toward the tail.
    for (let i = this.body.length - 1; i > 0; i--) {
      const b = this.body[i];
      const k = i / this.body.length;
      roundRect(ctx, b.x * CELL + 4, b.y * CELL + 4, CELL - 8, CELL - 8, 8);
      ctx.fillStyle = k > 0.5 ? c.soft : c.soft2;
      ctx.fill();
    }

    // Head: the ab. dot.
    const h = this.body[0];
    const hx = h.x * CELL + CELL / 2;
    const hy = h.y * CELL + CELL / 2;
    const g = ctx.createRadialGradient(hx - 3, hy - 4, 2, hx, hy, 12);
    g.addColorStop(0, "#60a5fa");
    g.addColorStop(1, "#2563eb");
    ctx.beginPath();
    ctx.arc(hx, hy, 12, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    for (const p of this.pops) {
      ctx.globalAlpha = 1 - p.t / 0.9;
      ctx.fillStyle = c.signal;
      ctx.fillText(p.text, p.x, p.y - 8 - p.t * 30);
      ctx.globalAlpha = 1;
    }
  }
}
