import { Component, input } from "@angular/core";

/** Index + kicker eyebrow, a display title ending on the logo dot, and an optional lede beside it. */
@Component({
  selector: "app-section-head",
  standalone: true,
  host: { class: "contents" },
  template: `
    <header class="section-head" [class.is-bare]="bare()">
      <div>
        <p class="eyebrow">
          <span class="eyebrow-index">{{ n() }}</span>
          <span class="eyebrow-rule" aria-hidden="true"></span>
          @if (kicker()) { <span>{{ kicker() }}</span> }
        </p>
        <h2 class="section-title">{{ title() }}<span class="brand-dot" aria-hidden="true">.</span></h2>
      </div>
      <div class="min-w-0">
        <ng-content />
      </div>
    </header>
  `,
})
export class SectionHeadComponent {
  n = input.required<string>();
  title = input.required<string>();
  kicker = input<string>("");
  /** The head is the whole block (About): no bottom margin, top-aligned columns. */
  bare = input<boolean>(false);
}
