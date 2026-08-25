import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { FUTURE_PROJECTS, UI } from "../lib/site";

/**
 * Renders inside the Pulse section rather than as a section of its own —
 * these are open questions, not deliverables, so they sit next to the
 * trajectory they belong to instead of competing with shipped work.
 */
@Component({
  selector: "app-future-projects",
  standalone: true,
  imports: [IconComponent, KeybindComponent, RouterLink],
  template: `
    <div class="mt-8 border-t border-fg/10 pt-8">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="font-mono text-caption tracking-mono text-accent">{{ ui.sectionTitles.futureProjects }}</p>
          <p class="mt-1 max-w-prose font-serif text-small text-muted">
            Questions I want to work through next — deeper storage, distributed systems, and on-chain constraints. Open
            questions, not promised deliverables.
          </p>
        </div>
        <span class="font-mono text-caption tracking-mono text-muted">interests / {{ projects.length }}</span>
      </div>

      <ul class="mt-5 grid gap-3 sm:grid-cols-2">
        @for (p of projects; track p.id) {
          <li class="reveal-on-scroll">
            <a [routerLink]="['/projects', p.id]" class="group flex h-full flex-col rounded-md bg-surface p-5 shadow-border transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift">
              <div class="flex items-start justify-between gap-3">
                <h3 class="font-serif text-subhead font-normal text-fg transition-colors group-hover:text-accent">{{ p.name }}</h3>
                <span class="shrink-0 rounded-full bg-accent/10 px-2 py-1 font-mono text-[0.68rem] tracking-mono text-accent">EXPLORING</span>
              </div>
              <p class="mt-2 flex-1 font-serif text-small text-muted">{{ p.blurb }}</p>
              <div class="mt-5 flex items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-2">
                  @for (tag of p.stack.slice(0, 2); track tag) { <app-keybind>{{ tag }}</app-keybind> }
                </div>
                <svg appIcon="arrow-up-right" class="size-4 text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"></svg>
              </div>
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class FutureProjectsComponent {
  protected readonly projects = FUTURE_PROJECTS;
  protected readonly ui = UI;
}
