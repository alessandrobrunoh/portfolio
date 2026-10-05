import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { CONTRIBUTIONS, UI, lang } from "../lib/site";

@Component({
  selector: "app-open-source",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent],
  template: `
    <section id="oss" class="container-x section scroll-mt-16">
      <app-section-head n="04" [title]="ui.sectionTitles.openSource" [kicker]="(lang() === 'it' ? 'lavoro pubblico / ' : 'public work / ') + contributions.length">
        <p class="section-lede">
          {{ lang() === 'it' ? 'Contributi a progetti open source e crate pubblicati, con il loro stato reale.' : 'Contributions to open-source projects and published crates, with their real status.' }}
        </p>
      </app-section-head>

      <ul class="oss-list">
        @for (c of contributions; track c.href) {
          <li class="reveal-row">
            <a [href]="c.href" target="_blank" rel="noreferrer" class="oss-row">
              <span
                class="status"
                [class.status-open]="c.status === 'Open'"
                [class.status-merged]="c.status === 'Merged'"
                [class.status-published]="c.status === 'Published'"
              >{{ c.status }}</span>
              <div class="min-w-0">
                <p class="oss-title">{{ c.title }}</p>
                <p class="mt-1 meta-mono">{{ c.repo }} · {{ ref(c.href, c.status) }}</p>
                <p class="mt-2 text-small text-muted">{{ c.note }}</p>
              </div>
              <svg appIcon="arrow-up-right" class="card-arrow size-4 shrink-0"></svg>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class OpenSourceComponent {
  protected readonly contributions = CONTRIBUTIONS;
  protected readonly ui = UI;
  protected readonly lang = lang;

  protected ref(href: string, status: string) {
    if (href.includes("/pull/")) return `PR #${href.split("/pull/")[1]}`;
    return status === "Published" ? "crate" : "repo";
  }
}
