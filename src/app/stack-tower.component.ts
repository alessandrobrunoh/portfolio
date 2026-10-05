import { Component, HostListener, signal } from "@angular/core";
import { CanvasGame, FONT, roundRect } from "./game-kit";
import { lang } from "../lib/site";

const W = 800;
const H = 420;
const BLOCK_H = 30;
const BASE_W = 300;
const FLOOR = H - 36;
const START_SPEED = 240;
const MAX_SPEED = 720;
const PERFECT = 5;

/** The layers you stack, bottom-up: the order matters less than the landing. */
const LAYERS = [
  "Linux", "Docker", "PostgreSQL", "Valkey", "S3", "Kafka", "Rust", "Tokio", "Axum", "SQLx",
  "Java", "Spring Boot", "OpenTelemetry", "Grafana", "TypeScript", "Node", "Angular", "React", "Python", "Kubernetes",
];

type Block = { x: number; w: number; label: string };
type Chip = { x: number; y: number; w: number; vy: number; vx: number; rot: number; t: number };
type Pop = { text: string; y: number; t: number };

/** Ship the Stack: a stacker. Each layer slides in; drop it on the one below. Overhang is cut off. */
@Component({
  selector: "app-stack-tower",
  standalone: true,
  template: `
    <div class="game-stage">
      <canvas
        #canvas
        class="game-canvas"
        style="aspect-ratio: 800 / 420"
        tabindex="0"
        (pointerdown)="onPointer($event)"
        [attr.aria-label]="it() ? 'Area di gioco: premi spazio per far cadere il livello' : 'Game area: press space to drop the layer'"
      ></canvas>
      @if (phase() !== 'running') {
        <div class="game-message" aria-live="polite">
          @if (phase() === 'ready') {
            <p class="text-subhead font-semibold text-fg">{{ it() ? 'Costruisci lo stack.' : 'Build the stack.' }}</p>
            <p class="mt-1 text-small text-muted">{{ it() ? 'Premi spazio o tocca per far cadere ogni livello.' : 'Press space or tap to drop each layer.' }}</p>
          } @else {
            <p class="text-subhead font-semibold text-fg">{{ it() ? 'Lo stack è crollato su' : 'The stack fell at' }} <span class="text-accent">{{ lastLayer() }}</span></p>
            <p class="mt-1 text-small text-muted">
              {{ score() }} {{ score() === 1 ? (it() ? 'livello' : 'layer') : (it() ? 'livelli' : 'layers') }} · {{ perfects() }} perfect
              @if (newBest()) { · <strong class="text-accent">{{ it() ? 'nuovo record!' : 'new best!' }}</strong> }
            </p>
            <p class="mt-3 text-small text-muted">{{ it() ? 'Invio o tocca per riprovare.' : 'Enter or tap to try again.' }}</p>
          }
        </div>
      }
    </div>
    <div class="game-hud">
      <span>{{ it() ? 'Livelli' : 'Layers' }} <strong>{{ score() }}</strong></span>
      <span>Perfect <strong>{{ perfects() }}</strong></span>
      <span>{{ it() ? 'Record' : 'Best' }} <strong>{{ best() }}</strong></span>
    </div>
  `,
})
export class StackTowerComponent extends CanvasGame {
  protected readonly id = "tower" as const;
  protected readonly W = W;
  protected readonly H = H;
  protected readonly it = () => lang() === "it";
  protected readonly perfects = signal(0);
  protected readonly lastLayer = signal("");

  private stack: Block[] = [];
  private moving: Block = { x: 0, w: BASE_W, label: "" };
  private dir = 1;
  private speed = START_SPEED;
  private camera = 0;
  private chips: Chip[] = [];
  private pops: Pop[] = [];

  @HostListener("document:keydown", ["$event"])
  onKey(event: KeyboardEvent) {
    if (event.key === " " || event.key === "ArrowDown" || (event.key === "Enter" && this.phase() === "over")) {
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
    if (phase === "ready") this.start();
    else if (phase === "running") this.drop();
    else {
      this.reset();
      this.start();
    }
  }

  protected reset() {
    this.stack = [{ x: (W - BASE_W) / 2, w: BASE_W, label: "main" }];
    this.speed = START_SPEED;
    this.camera = 0;
    this.chips = [];
    this.pops = [];
    this.score.set(0);
    this.perfects.set(0);
    this.phase.set("ready");
    this.spawn();
  }

  private spawn() {
    const top = this.stack[this.stack.length - 1];
    this.dir = this.stack.length % 2 === 0 ? -1 : 1;
    this.moving = {
      x: this.dir === 1 ? 24 : W - 24 - top.w,
      w: top.w,
      label: LAYERS[(this.stack.length - 1) % LAYERS.length],
    };
  }

  private drop() {
    const top = this.stack[this.stack.length - 1];
    const m = this.moving;
    let left = Math.max(m.x, top.x);
    let right = Math.min(m.x + m.w, top.x + top.w);
    const level = this.stack.length;

    if (right - left <= 0) {
      // Missed entirely: the whole layer falls.
      this.chips.push({ x: m.x, y: this.blockY(level), w: m.w, vy: 0, vx: this.dir * 60, rot: 0, t: 0 });
      this.zone.run(() => this.lastLayer.set(m.label));
      this.finish();
      return;
    }

    if (Math.abs(m.x - top.x) <= PERFECT) {
      // Perfect landing: snap and reward.
      left = top.x;
      right = top.x + top.w;
      this.pops.push({ text: "perfect", y: this.blockY(level), t: 0 });
      this.zone.run(() => this.perfects.update((n) => n + 1));
    } else {
      // Cut the overhang and let it fall.
      const cutX = m.x < top.x ? m.x : right;
      const cutW = m.w - (right - left);
      this.chips.push({ x: cutX, y: this.blockY(level), w: cutW, vy: 0, vx: (m.x < top.x ? -1 : 1) * 80, rot: 0, t: 0 });
    }

    this.stack.push({ x: left, w: right - left, label: m.label });
    this.setScore(this.stack.length - 1);
    this.speed = Math.min(MAX_SPEED, this.speed + 18);
    this.spawn();
  }

  /** Top edge of the block at a given level (0 = base), in world space. */
  private blockY(level: number) {
    return FLOOR - (level + 1) * BLOCK_H;
  }

  protected step(dt: number) {
    const m = this.moving;
    m.x += this.dir * this.speed * dt;
    if (m.x < 16) {
      m.x = 16;
      this.dir = 1;
    } else if (m.x + m.w > W - 16) {
      m.x = W - 16 - m.w;
      this.dir = -1;
    }
    this.tick(dt);
  }

  /** Falling chips, pops and the camera keep moving after the run ends, until they settle. */
  private tick(dt: number) {
    for (const c of this.chips) {
      c.vy += 1600 * dt;
      c.y += c.vy * dt;
      c.x += c.vx * dt;
      c.rot += (c.vx > 0 ? 1 : -1) * 2.4 * dt;
      c.t += dt;
    }
    this.chips = this.chips.filter((c) => c.t < 1.6);
    for (const p of this.pops) p.t += dt;
    this.pops = this.pops.filter((p) => p.t < 0.9);
    const target = Math.max(0, (this.stack.length - 7) * BLOCK_H);
    this.camera += (target - this.camera) * Math.min(1, dt * 6);
  }

  protected draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const c = this.colors;
    this.drawGrid(0, 32, H);

    ctx.save();
    ctx.translate(0, this.camera);

    // Floor.
    ctx.strokeStyle = c.line;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR + 0.5);
    ctx.lineTo(W, FLOOR + 0.5);
    ctx.stroke();

    ctx.font = FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Placed layers: soft gray tones, alternating, labels where they fit.
    this.stack.forEach((b, level) => {
      const y = this.blockY(level);
      roundRect(ctx, b.x, y + 1, b.w, BLOCK_H - 2, 7);
      ctx.fillStyle = level === 0 ? c.ink : level % 2 ? c.soft : c.soft2;
      ctx.fill();
      if (b.w > ctx.measureText(b.label).width + 16) {
        ctx.fillStyle = level === 0 ? c.onInk : c.ink;
        ctx.fillText(b.label, b.x + b.w / 2, y + BLOCK_H / 2 + 0.5);
      }
    });

    // The moving layer is the blue one.
    if (this.phase() !== "over") {
      const m = this.moving;
      const y = this.blockY(this.stack.length);
      roundRect(ctx, m.x, y + 1, m.w, BLOCK_H - 2, 7);
      ctx.fillStyle = c.signal;
      ctx.fill();
      if (m.w > ctx.measureText(m.label).width + 16) {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(m.label, m.x + m.w / 2, y + BLOCK_H / 2 + 0.5);
      }
    }

    // Cut-off pieces tumbling away.
    for (const ch of this.chips) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - ch.t / 1.6);
      ctx.translate(ch.x + ch.w / 2, ch.y + BLOCK_H / 2);
      ctx.rotate(ch.rot);
      roundRect(ctx, -ch.w / 2, -BLOCK_H / 2 + 1, ch.w, BLOCK_H - 2, 7);
      ctx.fillStyle = c.signal;
      ctx.fill();
      ctx.restore();
    }

    for (const p of this.pops) {
      ctx.globalAlpha = 1 - p.t / 0.9;
      ctx.fillStyle = c.signal;
      ctx.fillText(p.text, W / 2, p.y - 12 - p.t * 30);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // After game over the base loop stops; keep the debris animating briefly.
  protected override finish() {
    super.finish();
    let last = performance.now();
    const settle = () => {
      const now = performance.now();
      this.tick(Math.min(0.032, (now - last) / 1000));
      last = now;
      this.draw();
      if (this.phase() === "over" && (this.chips.length || this.pops.length)) requestAnimationFrame(settle);
    };
    this.zone.runOutsideAngular(() => requestAnimationFrame(settle));
  }
}
