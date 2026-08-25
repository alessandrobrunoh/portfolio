import { Component, input } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { CONTRIBUTIONS, type Contribution } from "../lib/site";
import { cn } from "../lib/utils";

@Component({
  selector: "app-status-chip",
  standalone: true,
  template: `
    <span
      [class]="
        cn(
          'inline-flex items-center gap-1.5 font-mono text-caption tracking-mono',
          status() === 'Open' ? 'text-accent' : 'text-muted'
        )
      "
    >
      <span [class]="status() === 'Open' ? 'size-1.5 rounded-full bg-accent' : 'size-1.5 rounded-full bg-fg/25'" aria-hidden="true"></span>
      {{ status() }}
    </span>
  `,
})
export class StatusChipComponent {
  status = input.required<Contribution["status"]>();
  protected readonly cn = cn;
}

@Component({
  selector: "app-open-source",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent, StatusChipComponent],
  template: `
    <section id="oss" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <app-section-head n="05" title="Open Source" />
      <p class="mb-6 max-w-prose font-serif text-body text-muted">
        Contributions tracked like a small public backlog: what changed, where it lives, and whether it shipped.
      </p>
      <ul class="overflow-hidden rounded-md border border-fg/10 bg-surface/40">
        @for (c of contributions; track c.href; let i = $index) {
          <li class="reveal-row border-b border-fg/10 last:border-b-0">
            <a [href]="c.href" target="_blank" rel="noreferrer" class="issue-row group grid gap-3 px-4 py-4 transition-colors duration-200 hover:bg-surface sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-5">
              <div class="flex items-center gap-3 sm:block">
                <span class="font-mono text-caption tracking-mono text-muted">#{{ issueNumber(i) }}</span>
                <app-status-chip [status]="c.status" />
              </div>
              <div class="min-w-0">
                <p class="truncate font-serif text-body text-fg group-hover:text-accent">{{ c.title }}</p>
                <p class="mt-1 truncate font-mono text-caption tracking-mono text-muted">{{ c.repo }} <span class="text-fg/20">·</span> {{ c.note }}</p>
              </div>
              <svg appIcon="arrow-up-right" class="size-4 shrink-0 text-muted transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true"></svg>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class OpenSourceComponent {
  protected readonly contributions = CONTRIBUTIONS;

  issueNumber(index: number) {
    return String(index + 1).padStart(3, "0");
  }
}
