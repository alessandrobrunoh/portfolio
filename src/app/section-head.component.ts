import { Component, input } from "@angular/core";

@Component({
  selector: "app-section-head",
  standalone: true,
  template: `
    <header class="section-mark mb-8">
      <div class="reveal-title flex items-baseline gap-3">
        <span class="font-mono text-caption tracking-mono text-accent">{{ n() }}</span>
        <h2 class="font-display text-heading-sm text-fg">{{ title() }}</h2>
      </div>
    </header>
  `,
})
export class SectionHeadComponent {
  n = input.required<string>();
  title = input.required<string>();
}
