import { Component, input } from "@angular/core";
import { lang } from "../lib/site";
import type { TocItem } from "../lib/site.types";

@Component({
  selector: "app-toc",
  standalone: true,
  host: { class: "page-toc" },
  template: `
    <aside>
      <div class="toc-panel">
        <div class="section-badge">
          <span class="section-badge-dot" aria-hidden="true"></span>
          <span>{{ lang() === 'it' ? 'In questa pagina' : 'On this page' }}</span>
        </div>
        <nav [attr.aria-label]="lang() === 'it' ? 'In questa pagina' : 'On this page'" class="mt-4 flex flex-col gap-1">
          @for (item of items(); track item.href) {
            <a [href]="item.href" class="rail-link" [class.is-active]="active() === item.href" [attr.aria-current]="active() === item.href ? 'location' : null">
              <span class="n">{{ item.n }}</span>
              <span class="truncate">{{ item.label }}</span>
            </a>
          }
        </nav>
      </div>
    </aside>
  `,
})
export class TocComponent {
  active = input.required<string>();
  items = input.required<TocItem[]>();
  protected readonly lang = lang;
}
