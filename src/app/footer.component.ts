import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ToolsComponent } from "./tools.component";
import { PROFILE, lang } from "../lib/site";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [IconComponent, ToolsComponent],
  template: `
    <footer>
      <app-tools />

      <!-- End of page / Sei arrivato alla fine banner -->
      <div class="reveal-card mt-16 rounded-lg border border-fg/10 bg-surface/60 p-6 text-center sm:p-8 backdrop-blur-sm shadow-border">
        <div class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-accent">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span class="relative inline-flex size-2 rounded-full bg-accent"></span>
          </span>
          {{ lang() === 'it' ? 'SEI ARRIVATO ALLA FINE' : 'END OF STREAM' }}
        </div>
        <p class="mt-2 font-serif text-lede text-fg">
          {{ lang() === 'it' ? 'Grazie per aver letto fino a qui.' : 'Thanks for reading all the way down.' }}
        </p>
        <p class="mx-auto mt-1 max-w-prose font-serif text-small text-muted">
          {{
            lang() === 'it'
              ? 'Hai visto i progetti, l’architettura e il codice. Se vuoi scambiare due chiacchiere o collaborare su sistemi e backend:'
              : 'You’ve seen the systems, trajectory, and code. If you’d like to talk backend, event streams, or collaborate:'
          }}
        </p>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            (click)="scrollToTop()"
            class="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-caption tracking-mono text-on-accent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
          >
            <svg appIcon="arrow-up" class="size-3.5 transition-transform duration-200 group-hover:-translate-y-1"></svg>
            <span>{{ lang() === 'it' ? 'Torna in cima' : 'Back to top' }}</span>
            <span class="rounded bg-black/15 dark:bg-white/20 px-1.5 py-0.5 text-[0.62rem] opacity-75">TOP</span>
          </button>

          <a
            [href]="'mailto:' + profile.email"
            class="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 font-mono text-caption tracking-mono text-fg shadow-border transition-all duration-200 hover:-translate-y-0.5 hover:text-accent hover:shadow-border-hover"
          >
            <svg appIcon="mail" class="size-3.5"></svg>
            <span>{{ lang() === 'it' ? 'Scrivimi un’email' : 'Get in touch' }}</span>
          </a>
        </div>
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-fg/10 py-8">
        <p class="font-serif italic text-small text-fg">{{ profile.name }}</p>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-caption tracking-mono text-muted">
          <a [href]="'mailto:' + profile.email" class="transition-colors hover:text-accent">{{ profile.email }}</a>
          <span class="text-fg/20">·</span>
          <a [href]="profile.github" target="_blank" rel="noreferrer" class="transition-colors hover:text-accent">GitHub</a>
          <span class="text-fg/20">·</span>
          <span>{{ profile.location }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly profile = PROFILE;
  protected readonly lang = lang;

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
