import { ApplicationRef, Component, HostListener, OnDestroy, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IconComponent } from "./icon.component";
import { GameHubComponent } from "./game-hub.component";
import { PROFILE, TOC, lang, setLanguage } from "../lib/site";
import { toggleThemeOverride } from "../lib/theme";

interface ShortcutItem {
  key: string;
  labelEn: string;
  labelIt: string;
  group: "nav" | "action" | "secret";
}

const SHORTCUTS: ShortcutItem[] = [
  { key: "1 – 5", labelEn: "Jump to sections (Intro → Contact)", labelIt: "Salta alle sezioni (Intro → Contatti)", group: "nav" },
  { key: "H", labelEn: "Return to top / Home", labelIt: "Torna in cima / Home", group: "nav" },
  { key: "B", labelEn: "Open Brand Guidelines", labelIt: "Apri Linee Guida del Brand", group: "nav" },
  { key: "T", labelEn: "Toggle Light / OLED Dark theme", labelIt: "Cambia tema Chiaro / OLED Scuro", group: "action" },
  { key: "L", labelEn: "Switch language (EN / IT)", labelIt: "Cambia lingua (EN / IT)", group: "action" },
  { key: "C", labelEn: "Copy email address to clipboard", labelIt: "Copia indirizzo email negli appunti", group: "action" },
  { key: "G", labelEn: "Launch Easter-Egg Arcade", labelIt: "Avvia l'Arcade Easter-Egg", group: "secret" },
  { key: "P", labelEn: "Trigger Blue Dot pulse", labelIt: "Attiva l'impulso del Punto Blu", group: "secret" },
  { key: "?", labelEn: "Toggle this shortcuts guide", labelIt: "Mostra / nascondi questa guida", group: "secret" },
];

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

@Component({
  selector: "app-keybinds-hud",
  standalone: true,
  imports: [IconComponent, GameHubComponent],
  template: `
    <!-- Blue dot celebration burst when Konami or 'P' is pressed -->
    @if (burst()) {
      <div class="dot-burst-layer" aria-hidden="true">
        @for (dot of dots; track dot.id) {
          <span
            class="dot-particle"
            [style.--dx]="dot.dx"
            [style.--dy]="dot.dy"
            [style.--size]="dot.size"
            [style.--delay]="dot.delay"
          ></span>
        }
      </div>
    }

    <!-- Discoverable '?' Keyboard Shortcuts Sheet -->
    @if (helpOpen()) {
      <div class="keybind-backdrop" (click)="helpOpen.set(false)">
        <div
          class="keybind-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="it() ? 'Scorciatoie da tastiera' : 'Keyboard shortcuts'"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div class="flex items-center gap-3">
              <span class="live-dot" aria-hidden="true"></span>
              <div>
                <h2 class="text-subhead font-semibold tracking-tight text-fg">
                  {{ it() ? 'Scorciatoie da tastiera' : 'Keyboard shortcuts' }}<span class="brand-dot">.</span>
                </h2>
                <p class="text-caption text-muted">
                  {{ it() ? 'Premi un tasto qualsiasi nella pagina per esplorare più velocemente' : 'Press any key anywhere on the page to navigate faster' }}
                </p>
              </div>
            </div>
            <button type="button" class="icon-btn" (click)="helpOpen.set(false)" [attr.aria-label]="it() ? 'Chiudi' : 'Close'">
              <svg appIcon="x" class="size-4"></svg>
            </button>
          </div>

          <div class="mt-5 grid gap-2.5 sm:grid-cols-2">
            @for (s of shortcuts; track s.key) {
              <div class="keybind-row">
                <span class="text-small text-muted">{{ it() ? s.labelIt : s.labelEn }}</span>
                <kbd class="kbd-cap">{{ s.key }}</kbd>
              </div>
            }
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-caption text-faint">
            <span>{{ it() ? 'Suggerimento: prova anche il Konami Code (↑↑↓↓←→←→BA)' : 'Hint: try the Konami Code (↑↑↓↓←→←→BA) too' }}</span>
            <span>ESC {{ it() ? 'per chiudere' : 'to close' }}</span>
          </div>
        </div>
      </div>
    }

    @if (arcadeOpen()) {
      <app-game-hub (closed)="arcadeOpen.set(false)" />
    }
  `,
})
export class KeybindsHudComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly appRef = inject(ApplicationRef);

  protected readonly shortcuts = SHORTCUTS;
  protected readonly it = () => lang() === "it";
  protected readonly helpOpen = signal(false);
  protected readonly arcadeOpen = signal(false);
  protected readonly burst = signal(false);

  protected readonly dots = Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2;
    const dist = 90 + (i % 4) * 55;
    return {
      id: i,
      dx: `${Math.round(Math.cos(angle) * dist)}px`,
      dy: `${Math.round(Math.sin(angle) * dist)}px`,
      size: `${8 + (i % 3) * 5}px`,
      delay: `${(i % 5) * 28}ms`,
    };
  });

  private burstTimer: ReturnType<typeof setTimeout> | undefined;
  private konamiIndex = 0;

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (typeof document === "undefined") return;
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // Track Konami sequence
    const expected = KONAMI[this.konamiIndex];
    if (event.key === expected || event.key.toLowerCase() === expected) {
      this.konamiIndex++;
      if (this.konamiIndex === KONAMI.length) {
        this.konamiIndex = 0;
        event.preventDefault();
        this.triggerBurst();
        setTimeout(() => this.arcadeOpen.set(true), 450);
        return;
      }
    } else {
      this.konamiIndex = 0;
    }

    if (event.key === "Escape") {
      if (this.helpOpen()) {
        this.helpOpen.set(false);
        event.preventDefault();
      }
      return;
    }

    // Ignore other shortcuts while the arcade modal is active so arcade controls work cleanly
    if (this.arcadeOpen() || document.querySelector(".game-overlay")) return;

    const key = event.key;

    if (key === "?") {
      event.preventDefault();
      this.helpOpen.update((v) => !v);
      return;
    }

    if (key >= "1" && key <= "5") {
      const idx = Number(key) - 1;
      const item = TOC[idx];
      if (!item) return;
      event.preventDefault();
      const el = document.getElementById(item.href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        this.router.navigate(["/"], { fragment: item.href.slice(1) });
      }
      return;
    }

    switch (key.toLowerCase()) {
      case "t": {
        event.preventDefault();
        toggleThemeOverride();
        break;
      }
      case "l": {
        event.preventDefault();
        const next = lang() === "it" ? "en" : "it";
        setLanguage(next);
        this.appRef.tick();
        break;
      }
      case "c": {
        event.preventDefault();
        navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
        break;
      }
      case "g": {
        event.preventDefault();
        this.arcadeOpen.set(true);
        break;
      }
      case "b": {
        event.preventDefault();
        this.router.navigate(["/brand"]);
        break;
      }
      case "h": {
        event.preventDefault();
        if (this.router.url.startsWith("/projects") || this.router.url.startsWith("/work") || this.router.url.startsWith("/brand")) {
          this.router.navigate(["/"]);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        break;
      }
      case "p": {
        event.preventDefault();
        this.triggerBurst();
        break;
      }
    }
  }

  public openHelp() {
    this.helpOpen.set(true);
  }

  private triggerBurst() {
    this.burst.set(false);
    setTimeout(() => {
      this.burst.set(true);
      clearTimeout(this.burstTimer);
      this.burstTimer = setTimeout(() => this.burst.set(false), 1100);
    }, 10);
  }

  ngOnDestroy() {
    clearTimeout(this.burstTimer);
  }
}
