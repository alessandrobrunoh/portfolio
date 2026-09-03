import { ApplicationRef, Component, inject, input } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ThemeToggleComponent } from "./theme-toggle.component";
import { PROFILE, TOC, UI, lang, setLanguage, type Lang } from "../lib/site";
import type { TocItem } from "../lib/site.types";
import { cn } from "../lib/utils";

@Component({
  selector: "app-toc",
  standalone: true,
  imports: [IconComponent, ThemeToggleComponent],
  template: `
    <aside class="block lg:min-h-full">
      <div class="lg:sticky lg:top-8">
        <div class="flex items-start justify-between gap-4 lg:block">
          <a href="/#intro" class="font-display text-subhead text-fg transition-colors hover:text-accent">{{ profile.name }}</a>
          <app-theme-toggle />
        </div>

        <!-- Command Palette Trigger -->
        <button
          type="button"
          (click)="openPalette()"
          class="mt-4 flex w-full items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 font-mono text-caption tracking-mono text-muted shadow-border transition-all duration-150 hover:text-fg hover:border-accent/40 cursor-pointer group"
        >
          <span class="inline-flex items-center gap-2">
            <svg appIcon="compass" class="size-3.5 text-accent transition-transform duration-200 group-hover:rotate-45"></svg>
            <span>{{ lang() === 'it' ? 'Comandi / Cerca' : 'Commands / Search' }}</span>
          </span>
          <kbd class="rounded bg-fg/10 px-1.5 py-0.5 text-[0.65rem] text-fg/75">⌘K</kbd>
        </button>

        <p class="mt-6 font-mono text-caption tracking-mono text-accent">{{ ui.tocIndex }}</p>
        <nav aria-label="On this page" class="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 lg:flex lg:flex-col">
          @for (item of items(); track item.href) {
            <a
              [href]="item.href"
              [class]="
                cn(
                  'flex min-h-9 items-center gap-2 rounded-sm px-2 font-serif text-small transition-colors duration-150',
                  active() === item.href ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface hover:text-fg'
                )
              "
            >
              <span class="w-5 font-mono text-caption tracking-mono">{{ item.n }}</span>
              {{ item.label }}
            </a>
          }
        </nav>

        <dl class="mt-8 space-y-4 border-t border-fg/10 pt-6">
          <div>
            <dt class="font-mono text-caption tracking-mono text-accent">{{ ui.tocCurrentWork }}</dt>
            <dd class="mt-1 font-serif text-small text-fg">
              <a [href]="profile.company.href" target="_blank" rel="noreferrer" class="hover:text-accent">{{ profile.company.name }}</a>
              <span class="block text-muted">{{ profile.role }}</span>
            </dd>
          </div>
          <div>
            <dt class="font-mono text-caption tracking-mono text-accent">{{ ui.tocLanguages }}</dt>
            <dd class="mt-1 flex items-center gap-3 font-mono text-caption tracking-mono">
              <button type="button" (click)="setLang('it')" [class]="lang() === 'it' ? 'text-accent' : 'text-muted hover:text-fg'" [attr.aria-pressed]="lang() === 'it'">{{ lang() === 'it' ? 'Italian' : 'IT' }}</button>
              <span class="text-fg/20">·</span>
              <button type="button" (click)="setLang('en')" [class]="lang() === 'en' ? 'text-accent' : 'text-muted hover:text-fg'" [attr.aria-pressed]="lang() === 'en'">{{ lang() === 'en' ? 'English' : 'EN' }}</button>
            </dd>
          </div>
          <div>
            <dt class="font-mono text-caption tracking-mono text-accent">{{ ui.tocContact }}</dt>
            <dd class="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-caption tracking-mono">
              <a [href]="'mailto:' + profile.email" class="text-muted hover:text-accent">Email</a>
              <a [href]="profile.github" target="_blank" rel="noreferrer" class="text-muted hover:text-accent">GitHub</a>
              @if (profile.x) {
                <a [href]="'https://x.com/' + profile.x" target="_blank" rel="noreferrer" class="text-muted hover:text-accent">X</a>
              }
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  `,
})
export class TocComponent {
  active = input.required<string>();
  items = input<TocItem[]>(TOC);
  protected readonly profile = PROFILE;
  protected readonly cn = cn;
  protected readonly lang = lang;
  protected readonly ui = UI;
  private appRef = inject(ApplicationRef);

  setLang(next: Lang) {
    setLanguage(next);
    this.appRef.tick();
  }

  openPalette() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }
}
