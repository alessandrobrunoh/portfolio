import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, computed, output, signal, viewChild } from "@angular/core";
import { DotRunnerComponent } from "./dot-runner.component";
import { GAMES, type GameId, readBest } from "./game-kit";
import { IconComponent } from "./icon.component";
import { StackSnakeComponent } from "./stack-snake.component";
import { StackTowerComponent } from "./stack-tower.component";
import { lang } from "../lib/site";

/**
 * The easter-egg arcade: a modal that first lets you pick a game, then runs it. Escape closes it,
 * focus stays inside, the page does not scroll underneath.
 */
@Component({
  selector: "app-game-hub",
  standalone: true,
  imports: [DotRunnerComponent, IconComponent, StackSnakeComponent, StackTowerComponent],
  template: `
    <div class="game-overlay" (click)="close()" aria-hidden="true"></div>
    <div #panel class="game-panel" role="dialog" aria-modal="true" aria-labelledby="game-title" tabindex="-1" (keydown)="trapFocus($event)">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="eyebrow"><span class="live-dot" aria-hidden="true"></span>Easter egg</p>
          <h2 id="game-title" class="mt-2 text-title font-semibold tracking-tight text-fg">
            {{ current() ? currentGame()!.name : it() ? 'Scegli un gioco' : 'Pick a game' }}<span class="brand-dot">.</span>
          </h2>
          <p class="mt-1 text-small text-muted">
            @if (currentGame(); as g) {
              {{ it() ? g.blurb.it : g.blurb.en }} {{ it() ? g.controls.it : g.controls.en }}.
            } @else {
              {{ it() ? 'Tre minigiochi su di me e sul mio stack. Il record resta salvato nel browser.' : 'Three mini-games about me and my stack. Your best score stays in this browser.' }}
            }
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          @if (current()) {
            <button type="button" class="btn btn-quiet btn-sm" (click)="pick(null)">
              <svg appIcon="arrow-left" class="size-4"></svg>{{ it() ? 'Giochi' : 'Games' }}
            </button>
          }
          <button #closeBtn type="button" class="icon-btn" (click)="close()" [attr.aria-label]="it() ? 'Chiudi' : 'Close'">
            <svg appIcon="x" class="size-5"></svg>
          </button>
        </div>
      </div>

      @switch (current()) {
        @case ('runner') { <app-dot-runner /> }
        @case ('tower') { <app-stack-tower /> }
        @case ('snake') { <app-stack-snake /> }
        @default {
          <ul class="game-picker">
            @for (g of games; track g.id; let i = $index) {
              <li [style.--i]="i">
                <button type="button" class="game-card" (click)="pick(g.id)">
                  <span class="game-art" [attr.data-game]="g.id" aria-hidden="true">
                    @switch (g.id) {
                      @case ('runner') {
                        <span class="art-ground"></span><span class="art-bug"></span><span class="art-bug is-tall"></span><span class="art-dot"></span>
                      }
                      @case ('tower') {
                        <span class="art-block" style="--w: 70%; --b: 0"></span>
                        <span class="art-block" style="--w: 58%; --b: 1"></span>
                        <span class="art-block" style="--w: 50%; --b: 2"></span>
                        <span class="art-block is-moving" style="--w: 50%; --b: 3"></span>
                      }
                      @case ('snake') {
                        <span class="art-seg" style="--x: 0"></span><span class="art-seg" style="--x: 1"></span><span class="art-seg" style="--x: 2"></span>
                        <span class="art-dot is-head"></span><span class="art-food"></span>
                      }
                    }
                  </span>
                  <span class="mt-4 block text-subhead font-semibold tracking-tight text-fg">{{ g.name }}</span>
                  <span class="mt-1 block text-small text-muted">{{ it() ? g.blurb.it : g.blurb.en }}</span>
                  <span class="mt-4 flex items-center justify-between gap-3 text-caption text-faint">
                    <span>{{ it() ? g.controls.it : g.controls.en }}</span>
                    <span>{{ it() ? 'Record' : 'Best' }} <strong class="text-fg">{{ bests()[g.id] }}</strong></span>
                  </span>
                </button>
              </li>
            }
          </ul>
        }
      }
    </div>
  `,
})
export class GameHubComponent implements AfterViewInit, OnDestroy {
  readonly closed = output<void>();
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>("panel");

  protected readonly games = GAMES;
  protected readonly it = () => lang() === "it";
  protected readonly current = signal<GameId | null>(null);
  protected readonly currentGame = computed(() => GAMES.find((g) => g.id === this.current()) ?? null);
  /** Re-read whenever we come back to the picker, so a new record shows up. */
  protected readonly bests = signal<Record<GameId, number>>(this.readBests());
  private previousOverflow = "";

  ngAfterViewInit() {
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    this.panel().nativeElement.focus();
  }

  ngOnDestroy() {
    document.documentElement.style.overflow = this.previousOverflow;
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscape(event: Event) {
    event.preventDefault();
    this.close();
  }

  protected pick(id: GameId | null) {
    this.current.set(id);
    if (!id) {
      this.bests.set(this.readBests());
      setTimeout(() => this.panel().nativeElement.querySelector<HTMLElement>(".game-card")?.focus());
    }
  }

  protected close() {
    this.closed.emit();
  }

  /** Keep Tab inside the dialog. */
  protected trapFocus(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const focusables = Array.from(
      this.panel().nativeElement.querySelectorAll<HTMLElement>("button, a[href], canvas[tabindex]"),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private readBests(): Record<GameId, number> {
    return { runner: readBest("runner"), tower: readBest("tower"), snake: readBest("snake") };
  }
}
