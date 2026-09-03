import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { SectionHeadComponent } from "./section-head.component";
import { BLOG, UI, lang } from "../lib/site";

@Component({
  selector: "app-blog",
  standalone: true,
  imports: [RouterLink, IconComponent, KeybindComponent, SectionHeadComponent],
  template: `
    <section id="blog" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="08" [title]="ui.sectionTitles.blog" />
        
        <!-- Controls: Counter, dots, and navigation arrows -->
        <div class="mb-8 flex items-center gap-3">
          <span class="font-mono text-caption tracking-mono text-muted">
            0{{ currentIndex() + 1 }} / 0{{ posts.length }}
          </span>

          <!-- Pagination Dots / Pills -->
          <div class="flex items-center gap-1.5 px-1" role="tablist" aria-label="Blog posts">
            @for (post of posts; track post.slug; let i = $index) {
              <button
                type="button"
                (click)="scrollToIndex(i)"
                [attr.aria-label]="'Go to slide ' + (i + 1)"
                [attr.aria-selected]="currentIndex() === i"
                role="tab"
                class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                [class]="
                  currentIndex() === i
                    ? 'w-6 bg-accent'
                    : 'w-2 bg-fg/20 hover:bg-fg/40'
                "
              ></button>
            }
          </div>

          <div class="flex items-center gap-1">
            <button
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-sm bg-surface font-mono text-body text-muted shadow-border transition-all duration-150 hover:text-accent hover:border-accent/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Previous article"
              [disabled]="!canScrollLeft()"
              (click)="move(-1)"
            >
              <svg appIcon="chevron-left" class="size-4"></svg>
            </button>
            <button
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-sm bg-surface font-mono text-body text-muted shadow-border transition-all duration-150 hover:text-accent hover:border-accent/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Next article"
              [disabled]="!canScrollRight()"
              (click)="move(1)"
            >
              <svg appIcon="chevron-right" class="size-4"></svg>
            </button>
          </div>
        </div>
      </div>

      <p class="mb-6 max-w-prose font-serif text-lede text-muted">
        {{ lang() === 'it' ? 'Note su sistemi, decisioni di prodotto e il lavoro tra codice e persone.' : 'Notes on systems, product decisions, and the work between code and people.' }}
      </p>

      <!-- Carousel Container with edge mask and drag handling -->
      <div class="relative">
        <div
          #carousel
          id="blog-carousel"
          class="carousel-mask -mx-1 overflow-x-auto px-1 pb-4 scroll-smooth select-none cursor-grab active:cursor-grabbing"
          (scroll)="onScroll()"
          (mousedown)="onMouseDown($event)"
          (mousemove)="onMouseMove($event)"
          (mouseup)="onMouseUp()"
          (mouseleave)="onMouseUp()"
        >
          <ul class="flex snap-x snap-mandatory gap-4">
            @for (post of posts; track post.slug; let i = $index) {
              <li class="blog-card-shell w-[min(88vw,24rem)] shrink-0 snap-start reveal-card">
                <a
                  [routerLink]="['/blog', post.slug]"
                  (click)="onClickCard($event)"
                  class="blog-card group flex h-full min-h-76 flex-col rounded-lg bg-surface p-5 shadow-border transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
                >
                  <div class="flex items-center justify-between gap-3 border-b border-fg/10 pb-3">
                    <span class="font-mono text-[0.68rem] tracking-mono text-accent">NOTE / 0{{ i + 1 }}</span>
                    <app-keybind>{{ post.status }}</app-keybind>
                  </div>
                  <p class="mt-4 font-mono text-caption tracking-mono text-muted">{{ post.subtitle }}</p>
                  <h3 class="mt-2 font-serif text-subhead font-normal leading-tight text-fg transition-colors group-hover:text-accent">
                    {{ post.title }}
                  </h3>
                  <p class="mt-3 flex-1 font-serif text-small leading-relaxed text-muted">{{ post.pitch }}</p>
                  <div class="mt-5 flex items-center justify-between border-t border-fg/10 pt-3">
                    <span class="font-mono text-caption tracking-mono text-muted">field notes · 6 min</span>
                    <span class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 group-hover:text-accent">
                      <span>Read</span>
                      <svg appIcon="arrow-up-right" class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></svg>
                    </span>
                  </div>
                </a>
              </li>
            }
          </ul>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between font-mono text-caption tracking-mono text-muted">
        <span>{{ lang() === 'it' ? 'Scorri o trascina per esplorare' : 'Scroll or drag to browse' }}</span>
        <span>{{ lang() === 'it' ? 'apri una card per leggere →' : 'open a card to read →' }}</span>
      </div>
    </section>
  `,
})
export class BlogComponent implements AfterViewInit, OnDestroy {
  @ViewChild("carousel") carouselRef!: ElementRef<HTMLDivElement>;

  protected readonly posts = BLOG;
  protected readonly ui = UI;
  protected readonly lang = lang;

  currentIndex = signal(0);
  canScrollLeft = signal(false);
  canScrollRight = signal(true);

  private isDragging = false;
  private startX = 0;
  private scrollStart = 0;
  private draggedDistance = 0;

  ngAfterViewInit() {
    this.updateScrollState();
  }

  ngOnDestroy() {}

  onScroll() {
    this.updateScrollState();
  }

  private updateScrollState() {
    const el = this.carouselRef?.nativeElement;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    this.canScrollLeft.set(el.scrollLeft > 10);
    this.canScrollRight.set(el.scrollLeft < maxScroll - 10);

    // Calculate which card is closest to the left
    const cardWidth = el.querySelector(".blog-card-shell")?.clientWidth || 360;
    const gap = 16;
    const approxIndex = Math.round(el.scrollLeft / (cardWidth + gap));
    const clampedIndex = Math.max(0, Math.min(this.posts.length - 1, approxIndex));
    this.currentIndex.set(clampedIndex);
  }

  scrollToIndex(index: number) {
    const el = this.carouselRef?.nativeElement;
    if (!el) return;
    const cardWidth = el.querySelector(".blog-card-shell")?.clientWidth || 360;
    const gap = 16;
    el.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
  }

  move(direction: number) {
    const target = this.currentIndex() + direction;
    this.scrollToIndex(Math.max(0, Math.min(this.posts.length - 1, target)));
  }

  onMouseDown(e: MouseEvent) {
    const el = this.carouselRef?.nativeElement;
    if (!el) return;
    this.isDragging = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollStart = el.scrollLeft;
    this.draggedDistance = 0;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    const el = this.carouselRef?.nativeElement;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - this.startX;
    this.draggedDistance += Math.abs(walk);
    el.scrollLeft = this.scrollStart - walk;
  }

  onMouseUp() {
    this.isDragging = false;
    setTimeout(() => {
      this.draggedDistance = 0;
    }, 50);
  }

  onClickCard(e: MouseEvent) {
    if (this.draggedDistance > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
