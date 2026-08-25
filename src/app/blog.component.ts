import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { SectionHeadComponent } from "./section-head.component";
import { BLOG, UI } from "../lib/site";

@Component({
  selector: "app-blog",
  standalone: true,
  imports: [RouterLink, IconComponent, KeybindComponent, SectionHeadComponent],
  template: `
    <section id="blog" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="07" [title]="ui.sectionTitles.blog" />
        <div class="mb-8 flex items-center gap-1">
          <button type="button" class="inline-flex size-9 items-center justify-center rounded-sm bg-surface font-mono text-body text-muted shadow-border transition-colors hover:text-accent" aria-label="Previous article" (click)="move(-1)">←</button>
          <button type="button" class="inline-flex size-9 items-center justify-center rounded-sm bg-surface font-mono text-body text-muted shadow-border transition-colors hover:text-accent" aria-label="Next article" (click)="move(1)">→</button>
        </div>
      </div>
      <p class="mb-6 max-w-prose font-serif text-body text-muted">
        Notes on systems, product decisions, and the work between code and people.
      </p>
      <div id="blog-carousel" class="carousel-mask -mx-1 overflow-x-auto px-1 pb-3">
        <ul class="flex snap-x snap-mandatory gap-3">
          @for (post of posts; track post.slug) {
            <li class="blog-card-shell w-[min(86vw,24rem)] shrink-0 snap-start reveal-card">
              <a [routerLink]="['/blog', post.slug]" class="blog-card group flex h-full min-h-72 flex-col rounded-lg bg-surface p-5 shadow-border transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div class="flex items-center justify-between gap-3 border-b border-fg/10 pb-3">
                  <span class="font-mono text-[0.68rem] tracking-mono text-accent">NOTE / 0{{ $index + 1 }}</span>
                  <app-keybind>{{ post.status }}</app-keybind>
                </div>
                <p class="mt-4 font-mono text-caption tracking-mono text-muted">{{ post.subtitle }}</p>
                <h3 class="mt-2 font-serif text-subhead font-normal leading-tight text-fg transition-colors group-hover:text-accent">{{ post.title }}</h3>
                <p class="mt-3 flex-1 font-serif text-small leading-6 text-muted">{{ post.pitch }}</p>
                <div class="mt-5 flex items-center justify-between border-t border-fg/10 pt-3">
                  <span class="font-mono text-caption tracking-mono text-muted">field notes · 6 min</span>
                  <span class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 group-hover:text-accent">
                    Read
                    <svg appIcon="arrow-up-right" class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"></svg>
                  </span>
                </div>
              </a>
            </li>
          }
        </ul>
      </div>
      <p class="mt-2 font-mono text-caption tracking-mono text-muted">Scroll to browse · open a card to read</p>
    </section>
  `,
})
export class BlogComponent {
  protected readonly posts = BLOG;
  protected readonly ui = UI;

  move(direction: number) {
    document.getElementById("blog-carousel")?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }
}
