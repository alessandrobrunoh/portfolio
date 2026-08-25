import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "./icon.component";
import { KeybindComponent } from "./keybind.component";
import { SectionHeadComponent } from "./section-head.component";
import { FUTURE_PROJECTS } from "../lib/site";

@Component({
  selector: "app-future-projects",
  standalone: true,
  imports: [IconComponent, KeybindComponent, RouterLink, SectionHeadComponent],
  template: `
    <section id="future-projects" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4"><app-section-head n="08" title="Future Projects" /><span class="mb-8 font-mono text-caption tracking-mono text-muted">open questions / next</span></div>
      <p class="mb-8 max-w-prose font-serif text-lede text-muted">Not a backlog. A set of directions worth following until they become something else.</p>
      <ul class="simple-card-grid">
        @for (p of projects; track p.id; let i = $index) {
          <li class="reveal-on-scroll"><a [routerLink]="['/projects', p.id]" class="simple-project-card group" [attr.data-tooltip]="'Explore ' + p.name">
            <div class="flex items-start justify-between gap-3"><span class="font-mono text-caption tracking-mono text-accent">0{{ i + 1 }}</span><span class="font-mono text-caption tracking-mono text-accent">NEXT</span></div>
            <h3 class="mt-8 font-serif text-subhead text-fg transition-colors group-hover:text-accent">{{ p.name }}</h3>
            <p class="mt-2 flex-1 font-serif text-small text-muted">{{ p.blurb }}</p>
            <div class="mt-6 flex items-center justify-between gap-3"><div class="flex flex-wrap items-center gap-2">@for (tag of p.stack.slice(0, 2); track tag) { <app-keybind>{{ tag }}</app-keybind> }<span class="font-mono text-caption tracking-mono text-muted">{{ p.year }}</span></div><svg appIcon="arrow-up-right" class="size-4 text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"></svg></div>
          </a></li>
        }
      </ul>
    </section>
  `,
})
export class FutureProjectsComponent {
  protected readonly projects = FUTURE_PROJECTS;
}
