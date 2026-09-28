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

      <!-- End of page / Sei arrivato alla fine -->
      <div class="reveal-card mt-16 mb-12 grid gap-6 rounded-sm border border-fg/12 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-8">
        <div>
          <p class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-accent">
            <span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
            {{ lang() === 'it' ? 'Sei arrivato alla fine' : 'End of stream' }}
          </p>
          <p class="mt-3 font-display text-heading-sm text-fg">
            {{ lang() === 'it' ? 'Grazie per aver letto fino a qui.' : 'Thanks for reading all the way down.' }}
          </p>
          <p class="mt-2 max-w-prose font-serif text-small text-muted">
            {{
              lang() === 'it'
                ? 'Hai visto i progetti, l’architettura e il codice. Se vuoi scambiare due chiacchiere o collaborare su sistemi e backend:'
                : 'You’ve seen the systems, trajectory, and code. If you’d like to talk backend, event streams, or collaborate:'
            }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <a
            [href]="'mailto:' + profile.email"
            class="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-4 font-mono text-caption tracking-mono text-on-accent transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg appIcon="mail" class="size-3.5"></svg>
            <span>{{ lang() === 'it' ? 'Scrivimi' : 'Get in touch' }}</span>
          </a>
          <button
            type="button"
            (click)="scrollToTop()"
            class="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border border-fg/15 px-4 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:border-accent/40 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg appIcon="arrow-up" class="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"></svg>
            <span>{{ lang() === 'it' ? 'Torna in cima' : 'Back to top' }}</span>
          </button>
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
