import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SectionHeadComponent } from "./section-head.component";
import { PROFILE, UI, lang } from "../lib/site";

const LOCAL_TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [IconComponent, SectionHeadComponent],
  template: `
    <section id="contact" class="scroll-mt-20 border-t border-fg/10 pt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <app-section-head n="06" [title]="ui.sectionTitles.contact" />
        <span class="mb-8 font-mono text-caption tracking-mono text-muted">say hello</span>
      </div>

      <div class="contact-grid">
        <div>
          <p class="font-display text-heading-sm text-fg">
            {{ lang() === 'it' ? 'Parliamo di sistemi, backend e di cosa stai costruendo.' : 'Let’s talk systems, backends, and what you are building.' }}
          </p>
          <p class="mt-4 max-w-prose font-serif text-body text-muted">{{ ui.contactLede }}</p>

          <p class="mt-6 inline-flex items-center gap-2 rounded-sm border border-accent/25 px-3 py-1.5 font-mono text-caption tracking-mono text-accent">
            <span class="relative flex size-1.5" aria-hidden="true">
              <span class="contact-pulse absolute inset-0 rounded-full bg-accent"></span>
              <span class="relative size-1.5 rounded-full bg-accent"></span>
            </span>
            {{ profile.availability }}
          </p>

          <a
            [href]="'mailto:' + profile.email"
            class="group mt-8 flex w-fit min-h-11 items-center gap-2 rounded-sm bg-accent px-4 font-mono text-caption tracking-mono text-on-accent transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg appIcon="mail" class="size-3.5"></svg>
            {{ lang() === 'it' ? 'Scrivimi un’email' : 'Write me an email' }}
            <svg appIcon="arrow-right" class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"></svg>
          </a>
        </div>

        <ul class="contact-sheet">
          <li class="contact-row">
            <span class="contact-label">Email</span>
            <a [href]="'mailto:' + profile.email" class="contact-value">{{ profile.email }}</a>
            <button
              type="button"
              (click)="copy()"
              class="contact-action"
              [attr.aria-label]="copied() ? ui.copiedEmail : ui.copyEmail"
            >
              {{ copied() ? ui.copiedEmail : lang() === 'it' ? 'Copia' : 'Copy' }}
            </button>
          </li>
          <li class="contact-row">
            <span class="contact-label">GitHub</span>
            <a [href]="profile.github" target="_blank" rel="noreferrer" class="contact-value">github.com/{{ githubHandle }}</a>
            <svg appIcon="arrow-up-right" class="contact-icon"></svg>
          </li>
          @if (profile.x) {
            <li class="contact-row">
              <span class="contact-label">X</span>
              <a [href]="'https://x.com/' + profile.x" target="_blank" rel="noreferrer" class="contact-value">&#64;{{ profile.x }}</a>
              <svg appIcon="arrow-up-right" class="contact-icon"></svg>
            </li>
          }
          <li class="contact-row">
            <span class="contact-label">CV</span>
            <a href="/alessandro-bruno-cv.pdf" download class="contact-value">alessandro-bruno-cv.pdf</a>
            <svg appIcon="download" class="contact-icon"></svg>
          </li>
          <li class="contact-row">
            <span class="contact-label">{{ lang() === 'it' ? 'Dove' : 'Where' }}</span>
            <span class="contact-value contact-value-static">{{ profile.location }}</span>
            <span class="font-mono text-caption tracking-mono text-muted">{{ localTime() }} {{ lang() === 'it' ? 'ora locale' : 'local time' }}</span>
          </li>
        </ul>
      </div>
    </section>
  `,
})
export class ContactComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly profile = PROFILE;
  protected readonly ui = UI;
  protected readonly lang = lang;
  protected readonly githubHandle = PROFILE.github.split("/").pop();

  copied = signal(false);
  protected readonly localTime = signal(LOCAL_TIME.format(new Date()));

  ngOnInit() {
    const id = window.setInterval(() => this.localTime.set(LOCAL_TIME.format(new Date())), 30_000);
    this.destroyRef.onDestroy(() => window.clearInterval(id));
  }

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
