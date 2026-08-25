import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { SectionHeadComponent } from "./section-head.component";
import { BLOG } from "../lib/site";

@Component({
  selector: "app-blog",
  standalone: true,
  imports: [RouterLink, IconComponent, KeybindComponent, SectionHeadComponent],
  template: `
    <section id="blog" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="06" title="Blog" />
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
            <li class="w-[min(86vw,23rem)] shrink-0 snap-start reveal-card">
              <a [routerLink]="['/blog', post.slug]" class="group flex min-h-64 h-full flex-col rounded-md bg-surface p-5 shadow-border transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="font-serif text-subhead font-normal text-fg">{{ post.title }}</h3>
                  <app-keybind>{{ post.status }}</app-keybind>
                </div>
                <p class="mt-1 font-mono text-caption tracking-mono text-muted">{{ post.subtitle }}</p>
                <p class="mt-3 flex-1 font-serif text-body text-muted">{{ post.pitch }}</p>
                <span class="mt-4 inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 group-hover:text-accent">
                  Read article
                  <svg appIcon="arrow-up-right" class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"></svg>
                </span>
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

  move(direction: number) {
    document.getElementById("blog-carousel")?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }
}
