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

      <!-- End of page: a sign-off, not a second contact form. Email lives in Contact right above. -->
      <div class="end-card reveal-card">
        <p class="end-mark" aria-hidden="true">ab<span>.</span></p>
        <div class="min-w-0">
          <p class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-accent">
            <span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
            {{ lang() === 'it' ? 'Sei arrivato alla fine' : 'End of stream' }}
          </p>
          <p class="mt-3 font-display text-heading-sm text-fg">
            {{ lang() === 'it' ? 'Grazie per aver letto fino a qui.' : 'Thanks for reading all the way down.' }}
          </p>
          <p class="mt-2 max-w-prose font-serif text-body text-fg/75">
            {{
              lang() === 'it'
                ? 'Se quello che hai visto somiglia a ciò che serve al tuo team, il CV ha la versione in una pagina.'
                : 'If this looks like what your team needs, the CV has the one-page version.'
            }}
          </p>
        </div>
        <div class="end-actions">
          <a
            href="/alessandro-bruno-cv.pdf"
            download
            class="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-4 font-mono text-caption tracking-mono text-on-accent transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg appIcon="download" class="size-3.5"></svg>
            <span>{{ lang() === 'it' ? 'Scarica il CV' : 'Download CV' }}</span>
          </a>
          <button
            type="button"
            (click)="scrollToTop()"
            class="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border border-fg/15 px-4 font-mono text-caption tracking-mono text-fg/80 transition-colors duration-150 hover:border-accent/40 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
