import { Component, HostListener, input, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ThemeToggleComponent } from "./theme-toggle.component";
import { PROFILE, TOC, UI } from "../lib/site";
import { cn } from "../lib/utils";

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [IconComponent, ThemeToggleComponent],
  template: `
    <header class="sticky top-0 z-40 border-b border-fg/10 bg-canvas/65 backdrop-blur-xl">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#intro" class="shrink-0 font-serif text-body italic text-fg tracking-ui">{{ profile.name }}</a>
        <div class="flex items-center gap-1">
          <app-theme-toggle />
          <a
            [href]="profile.github"
            target="_blank"
            rel="noreferrer"
            class="inline-flex size-11 items-center justify-center text-muted transition-colors duration-150 hover:text-fg sm:h-11 sm:w-auto sm:gap-1.5 sm:px-2"
            aria-label="GitHub"
          >
            <svg appIcon="github" class="size-3.5"></svg>
            <span class="hidden font-serif text-body sm:inline">GitHub</span>
          </a>
          <button
            type="button"
            class="relative inline-flex size-11 items-center justify-center text-fg lg:hidden"
            [attr.aria-expanded]="open()"
            aria-controls="mobile-nav"
            [attr.aria-label]="open() ? ui.closeMenu : ui.openMenu"
            (click)="open.set(!open())"
          >
            <span class="relative block size-5">
              <svg
                appIcon="menu"
                [class]="
                  cn(
                    'absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
                    open() ? 'scale-[0.25] opacity-0 blur-[4px]' : 'scale-100 opacity-100 blur-none'
                  )
                "
              ></svg>
              <svg
                appIcon="x"
                [class]="
                  cn(
                    'size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
                    open() ? 'scale-100 opacity-100 blur-none' : 'scale-[0.25] opacity-0 blur-[4px]'
                  )
                "
              ></svg>
            </span>
          </button>
        </div>
      </div>
      @if (open()) {
        <nav id="mobile-nav" aria-label="Sections" class="border-t border-fg/10 bg-canvas lg:hidden">
          <div class="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6">
            @for (item of toc; track item.href) {
              <a
                [href]="item.href"
                (click)="open.set(false)"
                [class]="cn('flex min-h-11 items-center gap-3 font-serif text-body', active() === item.href ? 'text-accent' : 'text-muted')"
              >
                <span class="font-mono text-caption tracking-mono text-accent">{{ item.n }}</span>
                {{ item.label }}
              </a>
            }
          </div>
        </nav>
      }
    </header>
  `,
})
export class NavComponent {
  active = input.required<string>();

  open = signal(false);
  protected readonly profile = PROFILE;
  protected readonly toc = TOC;
  protected readonly ui = UI;
  protected readonly cn = cn;

  @HostListener("window:keydown", ["$event"])
  onKeydown(event: KeyboardEvent) {
    if (this.open() && event.key === "Escape") this.open.set(false);
  }
}
