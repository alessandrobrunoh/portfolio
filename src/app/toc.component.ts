import { Component, input } from "@angular/core";
import { lang } from "../lib/site";
import type { TocItem } from "../lib/site.types";

/** "On this page" rail for project and case-study pages. The site nav owns brand, language and theme. */
@Component({
  selector: "app-toc",
  standalone: true,
  template: `
    <aside class="hidden lg:block">
      <div class="sticky top-24">
        <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ lang() === 'it' ? 'In questa pagina' : 'On this page' }}</p>
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
