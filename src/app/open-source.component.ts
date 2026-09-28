import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { CONTRIBUTIONS, UI, lang } from "../lib/site";

@Component({
  selector: "app-open-source",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent],
  template: `
    <section id="oss" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <app-section-head n="04" [title]="ui.sectionTitles.openSource" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">{{ lang() === 'it' ? 'lavoro pubblico' : 'public work' }} / {{ contributions.length }}</span>
      </div>
      <p class="mb-5 max-w-prose font-serif text-body text-muted">
        {{ lang() === 'it' ? 'Contributi a progetti open source, con il loro stato reale su GitHub.' : 'Contributions to open-source projects, with their real status on GitHub.' }}
      </p>
      <div class="issue-list overflow-hidden rounded-md border border-fg/10 bg-surface/50">
        <div class="issue-group-header flex items-center justify-between px-3 py-2.5 font-mono text-caption tracking-mono text-muted">
          <span><span class="mr-2 text-fg/35">⌄</span>{{ lang() === 'it' ? 'Contributi' : 'Contributions' }} <span class="ml-1 text-fg/40">{{ contributions.length }}</span></span>
          <span class="text-fg/35">+</span>
        </div>
        <ul>
          @for (c of contributions; track c.href) {
            <li class="reveal-row border-t border-fg/8">
              <a [href]="c.href" target="_blank" rel="noreferrer" class="issue-row group grid grid-cols-[1.25rem_6.75rem_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 transition-colors duration-150 hover:bg-surface sm:grid-cols-[1.25rem_7rem_minmax(0,1fr)_auto] sm:gap-3">
                <span class="issue-checkbox" aria-hidden="true"></span>
                <div class="flex items-center gap-2 min-w-0">
                  <span class="issue-status-icon" [class.issue-status-open]="c.status === 'Open'" [class.issue-status-merged]="c.status === 'Merged'" aria-hidden="true">{{ c.status === 'Open' ? '!' : '✓' }}</span>
                  <span class="truncate font-mono text-caption tracking-mono text-muted">{{ c.href.includes('/pull/') ? 'PR #' + c.href.split('/pull/')[1] : 'Repo' }}</span>
                </div>
                <div class="min-w-0">
                  <p class="truncate font-serif text-small font-medium text-fg group-hover:text-accent">{{ c.title }}</p>
                  <p class="mt-0.5 truncate font-mono text-[0.68rem] tracking-mono text-muted">{{ c.repo }} <span class="text-fg/20">·</span> {{ c.note }}</p>
                </div>
                <div class="hidden items-center gap-1.5 sm:flex">
                  <span class="issue-tag">{{ c.status }}</span>
                  <svg appIcon="arrow-up-right" class="ml-1 size-3.5 text-muted transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true"></svg>
                </div>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class OpenSourceComponent {
  protected readonly contributions = CONTRIBUTIONS;
  protected readonly ui = UI;
  protected readonly lang = lang;
}
