import { AfterViewInit, Component, OnDestroy, OnInit, computed, inject, input, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DecisionsComponent } from "./decisions.component";
import { IconComponent } from "./icon.component";
import { SiteNavComponent } from "./site-nav.component";
import { TocComponent } from "./toc.component";
import { CASES, lang } from "../lib/site";
import type { TocItem } from "../lib/site.types";

/** Case study from client work: /work/:id. Same reading order as a project page, no repository. */
@Component({
  selector: "app-case-study-page",
  standalone: true,
  imports: [DecisionsComponent, IconComponent, SiteNavComponent, TocComponent],
  template: `
    <div class="min-h-dvh bg-canvas">
      <div class="scroll-progress" aria-hidden="true"></div>
      <app-site-nav [home]="false" />
      @if (study(); as c) {
        <div class="container-x page-shell">
          <app-toc [items]="headings()" [active]="active()" />
          <main id="overview" class="min-w-0 scroll-mt-24">
            <div class="project-reveal flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 meta-mono">
              <button type="button" class="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-fg" (click)="goBack($event)">
                <svg appIcon="arrow-left" class="size-3.5"></svg>
                {{ it() ? 'Torna all’esperienza' : 'Back to Experience' }}
              </button>
              <span>{{ it() ? 'caso / lavoro per clienti' : 'case / client work' }}</span>
            </div>

            <article class="project-copy mt-10 max-w-3xl">
              <p class="eyebrow"><span class="eyebrow-index">{{ c.era }}</span><span class="eyebrow-rule" aria-hidden="true"></span>{{ c.role }}</p>
              <h1 class="mt-5 text-heading font-medium tracking-display text-fg">{{ c.title }}<span class="brand-dot" aria-hidden="true">.</span></h1>
              <p class="section-lede mt-6">{{ c.blurb }}</p>
              <p class="mt-4 inline-flex items-center gap-2 meta-mono"><span class="size-1.5 rounded-full bg-silver" aria-hidden="true"></span>{{ c.confidentiality }}</p>

              <section id="problem" class="mt-16 scroll-mt-24">
                <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Il problema' : 'The problem' }}</p>
                <p class="mt-4 max-w-prose text-lede text-fg">{{ c.problem }}</p>
              </section>

              <section id="built" class="mt-16 scroll-mt-24">
                <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Cosa ho costruito' : 'What I built' }}</p>
                <ol class="project-highlights mt-5">
                  @for (item of c.built; track item; let j = $index) {
                    <li class="text-body"><span>0{{ j + 1 }}</span>{{ item }}</li>
                  }
                </ol>
              </section>

              @if (c.decisions.length) {
                <section id="decisions" class="mt-16 scroll-mt-24">
                  <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Decisioni' : 'Decisions' }}</p>
                  <app-decisions class="mt-5 block" [decisions]="c.decisions" />
                </section>
              }

              @if (c.impact?.length) {
                <section id="impact" class="mt-16 scroll-mt-24">
                  <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Risultato' : 'Result' }}</p>
                  <dl class="impact-row mt-5">
                    @for (m of c.impact; track m.label) {
                      <div><dt>{{ m.label }}</dt><dd>{{ m.value }}</dd></div>
                    }
                  </dl>
                </section>
              }

              <section id="lesson" class="mt-16 scroll-mt-24">
                <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>{{ it() ? 'Cosa ho imparato' : 'What I learned' }}</p>
                <p class="mt-4 max-w-prose text-lede text-fg">{{ c.learned }}</p>
                <ul class="mt-8 flex flex-wrap gap-1.5">
                  @for (t of c.stack; track t) { <li class="chip">{{ t }}</li> }
                </ul>
              </section>
            </article>
          </main>
        </div>
      } @else {
        <main class="container-x py-40 text-center">
          <p class="text-title font-medium tracking-tight text-fg">{{ it() ? 'Caso non trovato' : 'Case study not found' }}<span class="brand-dot">.</span></p>
          <button type="button" class="btn btn-ghost mt-6" (click)="goBack($event)">
            <svg appIcon="arrow-left" class="size-4"></svg>
            {{ it() ? 'Torna all’esperienza' : 'Back to Experience' }}
          </button>
        </main>
      }
    </div>
  `,
})
export class CaseStudyPageComponent implements OnInit, AfterViewInit, OnDestroy {
  id = input<string>("");
  protected readonly active = signal("#overview");
  protected readonly it = () => lang() === "it";
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private observer: IntersectionObserver | null = null;

  protected readonly study = computed(() => {
    lang();
    return CASES.find((c) => c.id === this.id());
  });

  protected readonly headings = computed<TocItem[]>(() => {
    const it = this.it();
    const c = this.study();
    return [
      { id: "overview", label: it ? "Panoramica" : "Overview", show: true },
      { id: "problem", label: it ? "Il problema" : "The problem", show: true },
      { id: "built", label: it ? "Cosa ho costruito" : "What I built", show: true },
      { id: "decisions", label: it ? "Decisioni" : "Decisions", show: !!c?.decisions.length },
      { id: "impact", label: it ? "Risultato" : "Result", show: !!c?.impact?.length },
      { id: "lesson", label: it ? "Cosa ho imparato" : "What I learned", show: true },
    ]
      .filter((item) => item.show)
      .map((item, i) => ({ n: String(i + 1).padStart(2, "0"), href: `#${item.id}`, label: item.label }));
  });

  ngOnInit() {
    const c = this.study();
    this.title.setTitle(c ? `${c.title} · Alessandro Bruno` : "Case study not found · Alessandro Bruno");
  }

  ngAfterViewInit() {
    const sections = ["overview", "problem", "built", "decisions", "impact", "lesson"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const visible = new Map<string, number>();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (top) this.active.set(`#${top[0]}`);
      },
      { rootMargin: "-16% 0px -65% 0px", threshold: [0.1, 0.4] },
    );
    for (const section of sections) this.observer.observe(section);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  goBack(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(["/"], { fragment: "experience" }).then(() => {
      window.setTimeout(() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }), 0);
    });
  }
}
