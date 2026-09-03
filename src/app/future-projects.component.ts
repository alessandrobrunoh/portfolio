import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { SectionHeadComponent } from "./section-head.component";
import { FUTURE_PROJECTS, UI } from "../lib/site";

@Component({
  selector: "app-future-projects",
  standalone: true,
  imports: [IconComponent, KeybindComponent, RouterLink, SectionHeadComponent],
  template: `
    <section id="exploring" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="07" [title]="ui.sectionTitles.futureProjects" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">open questions / {{ projects.length }}</span>
      </div>
      <p class="mb-8 max-w-prose font-serif text-lede text-muted">
        Questions I want to work through next — deeper storage, distributed systems, and on-chain constraints. Open
        questions, not promised deliverables.
      </p>

      <ul class="grid gap-3 sm:grid-cols-2">
        @for (p of projects; track p.id) {
          <li class="reveal-card">
            <a
              [routerLink]="['/projects', p.id]"
              class="group flex h-full flex-col rounded-lg bg-surface p-5 shadow-border transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
            >
              <div class="flex items-start justify-between gap-3">
                <h3 class="font-serif text-subhead font-normal text-fg transition-colors group-hover:text-accent">{{ p.name }}</h3>
                <span class="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[0.68rem] tracking-mono text-accent">EXPLORING</span>
              </div>
              <p class="mt-3 flex-1 font-serif text-small leading-relaxed text-muted">{{ p.blurb }}</p>
              <div class="mt-6 flex items-center justify-between gap-3 border-t border-fg/10 pt-3">
                <div class="flex flex-wrap items-center gap-2">
                  @for (tag of p.stack; track tag) {
                    <app-keybind>{{ tag }}</app-keybind>
                  }
                </div>
                <svg
                  appIcon="arrow-up-right"
                  class="size-4 text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                ></svg>
              </div>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class FutureProjectsComponent {
  protected readonly projects = FUTURE_PROJECTS;
  protected readonly ui = UI;
}
