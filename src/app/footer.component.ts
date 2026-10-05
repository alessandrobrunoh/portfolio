import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";
import { ToolsComponent } from "./tools.component";
import { PROFILE, lang } from "../lib/site";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [IconComponent, ToolsComponent],
  template: `
    <footer class="site-footer">
      <div class="container-x">
        <app-tools />

        <!-- End of page: a sign-off with the full logo, not a second contact form. -->
        <div class="footer-main">
          <div>
            <img class="footer-logo hidden dark:block" src="/brand/ab-logo-white-full.webp" [alt]="profile.name" width="640" height="444" loading="lazy" />
            <img class="footer-logo dark:hidden" src="/brand/ab-logo-black-full.webp" [alt]="profile.name" width="640" height="409" loading="lazy" />
          </div>
          <div class="min-w-0">
            <p class="eyebrow"><span class="live-dot" aria-hidden="true"></span>{{ lang() === 'it' ? 'Sei arrivato alla fine' : 'End of stream' }}</p>
            <p class="mt-4 text-title font-medium tracking-tight text-fg">
              {{ lang() === 'it' ? 'Grazie per aver letto fino a qui.' : 'Thanks for reading all the way down.' }}
            </p>
            <p class="mt-2 max-w-prose text-body text-muted">
              {{
                lang() === 'it'
                  ? 'Se quello che hai visto somiglia a ciò che serve al tuo team, il CV ha la versione in una pagina.'
                  : 'If this looks like what your team needs, the CV has the one-page version.'
              }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2 lg:flex-col">
            <a href="/alessandro-bruno-cv.pdf" download class="btn btn-primary">
              <svg appIcon="download" class="size-4"></svg>
              {{ lang() === 'it' ? 'Scarica il CV' : 'Download CV' }}
            </a>
            <button type="button" (click)="scrollToTop()" class="btn btn-ghost">
              <svg appIcon="arrow-up" class="size-4"></svg>
              {{ lang() === 'it' ? 'Torna in cima' : 'Back to top' }}
            </button>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© {{ year }} {{ profile.name }} · {{ profile.location }}</span>
          <span class="flex gap-5">
            <a [href]="'mailto:' + profile.email">Email</a>
            <a [href]="profile.github" target="_blank" rel="noreferrer">GitHub</a>
          </span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly profile = PROFILE;
  protected readonly lang = lang;
  protected readonly year = new Date().getFullYear();

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
