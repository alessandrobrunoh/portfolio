import { Component, input } from "@angular/core";

/** Soft Minimal section header: pill badge with primary blue dot + bold heading ending on the brand dot. */
@Component({
  selector: "app-section-head",
  standalone: true,
  host: { class: "contents" },
  template: `
    <header class="section-head" [class.is-bare]="bare()">
      <div class="section-head-meta">
        <div class="section-badge">
          <span class="section-badge-dot" aria-hidden="true"></span>
          <span class="section-badge-num">{{ n() }}</span>
          @if (kicker()) {
            <span class="section-badge-sep" aria-hidden="true">·</span>
            <span>{{ kicker() }}</span>
          }
        </div>
        <h2 class="section-title">{{ title() }}<span class="brand-dot" aria-hidden="true">.</span></h2>
      </div>
      <div class="section-head-body min-w-0">
        <ng-content />
      </div>
    </header>
  `,
})
export class SectionHeadComponent {
  n = input.required<string>();
  title = input.required<string>();
  kicker = input<string>("");
  bare = input<boolean>(false);
}
