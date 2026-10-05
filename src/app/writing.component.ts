import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { TiltDirective } from "./tilt.directive";
import { BLOG, UI, lang } from "../lib/site";

/** Writing: proof of explaining work in plain language. Drafts are labelled as drafts. */
@Component({
  selector: "app-writing",
  standalone: true,
  imports: [IconComponent, RouterLink, SectionHeadComponent, TiltDirective],
  template: `
    <section id="writing" class="container-x section scroll-mt-16">
      <app-section-head n="05" [title]="ui.sectionTitles.writing" [kicker]="lang() === 'it' ? 'note dal campo' : 'field notes'">
        <p class="section-lede">
          {{
            lang() === 'it'
              ? 'Spiegare un sistema è metà del lavoro. Note su decisioni, errori e review, scritte per chi arriva dopo.'
              : 'Explaining a system is half the job. Notes on decisions, mistakes and reviews, written for whoever comes next.'
          }}
        </p>
      </app-section-head>

      <ul class="writing-grid">
        @for (post of posts; track post.slug) {
          <li class="reveal-on-scroll">
            <a [routerLink]="['/blog', post.slug]" class="card card-link writing-card" appTilt="3">
              <div class="flex items-center justify-between gap-3">
                <span class="eyebrow">{{ post.subtitle }}</span>
                <span class="chip chip-quiet">{{ statusLabel(post.status) }}</span>
              </div>
              <h3 class="project-name mt-8">{{ post.title }}</h3>
              <p class="mt-3 flex-1 text-small text-muted">{{ post.pitch }}</p>
              <span class="mt-6 inline-flex items-center gap-2 text-small font-medium text-fg">
                {{ lang() === 'it' ? 'Leggi' : 'Read' }}
                <svg appIcon="arrow-up-right" class="card-arrow size-4"></svg>
              </span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class WritingComponent {
  protected readonly posts = BLOG;
  protected readonly ui = UI;
  protected readonly lang = lang;

  protected statusLabel(status: string) {
    const it = lang() === "it";
    if (status === "Published") return it ? "Pubblicato" : "Published";
    return it ? "Bozza" : "Draft";
  }
}
