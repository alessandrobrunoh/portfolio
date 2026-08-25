import { Component, HostListener, OnDestroy, computed, effect, input, output, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ButtonDirective } from "./button.directive";
import { KeybindComponent } from "./keybind.component";
import type { FutureProject } from "../lib/site";

const EXIT_MS = 300;

@Component({
  selector: "app-future-project-dialog",
  standalone: true,
  imports: [IconComponent, ButtonDirective, KeybindComponent],
  template: `
    @if (mounted()) {
      <div class="dialog-overlay fixed inset-0 z-[80] bg-overlay backdrop-blur-sm" [attr.data-state]="state()" (click)="close.emit()"></div>
      <div
        class="dialog-panel fixed z-[80] flex max-h-[90dvh] w-full flex-col overflow-hidden inset-x-0 bottom-0 top-auto rounded-t-xl bg-surface text-fg shadow-dialog sm:inset-0 sm:m-auto sm:h-fit sm:w-[min(36rem,calc(100vw-2rem))] sm:rounded-xl"
        [attr.data-state]="state()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="future-project-title"
        aria-describedby="future-project-body"
      >
        @if (shown(); as p) {
          <div class="dialog-stagger overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 sm:pb-8 sm:pt-10">
            <p class="font-mono text-caption tracking-mono text-accent">
              {{ p.meta }}
              <span class="text-fg/20"> · </span>
              {{ p.lang }}
            </p>
            <h2 id="future-project-title" class="mt-2 font-display text-heading-sm text-fg">{{ p.name }}</h2>
            <p id="future-project-body" class="mt-4 max-w-prose font-serif text-body text-muted">{{ p.body }}</p>

            <ul class="mt-6 space-y-2">
              @for (item of p.highlights; track item) {
                <li class="flex gap-3 font-serif text-small text-fg">
                  <span class="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
                  {{ item }}
                </li>
              }
            </ul>

            <div class="mt-6">
              <p class="font-mono text-caption tracking-mono text-accent">What I'll learn</p>
              <p class="mt-2 max-w-prose font-serif text-body text-fg">{{ p.learned }}</p>
            </div>

            <ul class="mt-6 flex flex-wrap gap-1.5">
              @for (tag of p.stack; track tag) {
                <li><app-keybind>{{ tag }}</app-keybind></li>
              }
            </ul>

            <div class="mt-8">
              <a appButton="primary" [href]="p.href" target="_blank" rel="noreferrer">
                View on GitHub
                <svg appIcon="arrow-up-right" class="size-3.5"></svg>
              </a>
            </div>
          </div>
        }
        <div class="sheet-handle pointer-events-none absolute left-1/2 top-2 sm:hidden" aria-hidden="true"></div>
        <button
          type="button"
          class="absolute right-3 top-3 inline-flex size-11 items-center justify-center text-muted transition-colors duration-150 hover:text-fg"
          aria-label="Close"
          (click)="close.emit()"
        >
          <svg appIcon="x" class="size-4"></svg>
        </button>
      </div>
    }
  `,
})
export class FutureProjectDialogComponent implements OnDestroy {
  project = input<FutureProject | null>(null);
  close = output<void>();

  private cached = signal<FutureProject | null>(null);
  shown = computed(() => this.project() ?? this.cached());
  state = computed(() => (this.project() !== null ? "open" : "closed"));
  mounted = signal(false);
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.cached.set(p);
        this.mounted.set(true);
        if (this.exitTimer) {
          clearTimeout(this.exitTimer);
          this.exitTimer = null;
        }
      } else if (this.mounted()) {
        this.exitTimer = setTimeout(() => this.mounted.set(false), EXIT_MS);
      }
    });
  }

  ngOnDestroy() {
    if (this.exitTimer) clearTimeout(this.exitTimer);
  }

  @HostListener("window:keydown", ["$event"])
  onKeydown(event: KeyboardEvent) {
    if (this.project() && event.key === "Escape") this.close.emit();
  }
}
