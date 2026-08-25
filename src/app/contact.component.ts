import { Component, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { PROFILE, UI } from "../lib/site";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent],
  template: `
    <section id="contact" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="08" [title]="ui.sectionTitles.contact" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">say hello</span>
      </div>

      <p class="max-w-prose font-serif text-lede text-muted">{{ ui.contactLede }}</p>

      <p class="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 font-mono text-caption tracking-mono text-accent">
        <span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
        {{ profile.availability }}
      </p>

      <div class="mt-8 flex flex-wrap items-center gap-2">
        <a
          [href]="'mailto:' + profile.email"
          class="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-caption tracking-mono text-on-accent transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg appIcon="mail" class="size-3.5"></svg>
          {{ profile.email }}
        </a>
        <button
          type="button"
          (click)="copy()"
          class="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 font-mono text-caption tracking-mono text-muted shadow-border transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {{ copied() ? ui.copiedEmail : ui.copyEmail }}
        </button>
      </div>

      <ul class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <li>
          <a
            [href]="profile.github"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-accent"
          >
            <svg appIcon="github" class="size-3.5"></svg>
            github.com/{{ githubHandle }}
          </a>
        </li>
        @if (profile.x) {
          <li>
            <a
              [href]="'https://x.com/' + profile.x"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-accent"
            >
              <svg appIcon="x-social" class="size-3.5"></svg>
              &#64;{{ profile.x }}
            </a>
          </li>
        }
        <li>
          <a
            href="/alessandro-bruno-cv.pdf"
            download
            class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-accent"
          >
            <svg appIcon="download" class="size-3.5"></svg>
            CV (PDF)
          </a>
        </li>
      </ul>
    </section>
  `,
})
export class ContactComponent {
  protected readonly profile = PROFILE;
  protected readonly ui = UI;
  protected readonly githubHandle = PROFILE.github.split("/").pop();

  copied = signal(false);

  async copy() {
    try {
      await navigator.clipboard.writeText(this.profile.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, denied permission) — the mailto link still works.
    }
  }
}
