import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";

import { EDUCATION, PROFILE, UI } from "../lib/site";

const [FIRST_NAME, LAST_NAME] = PROFILE.name.split(" ");

@Component({
  selector: "app-intro",
  standalone: true,
  imports: [IconComponent],

  template: `
    <section id="intro" class="scroll-mt-20">
      <div class="stagger-in flex items-start justify-between gap-4">
        <div class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-surface px-3 py-1.5 shadow-border">
          <span class="font-mono text-caption tracking-mono text-accent">{{ profile.company.name }}</span>
          <span class="text-fg/20">·</span>
          <span class="font-mono text-caption tracking-mono text-muted">{{ profile.shortRole }}</span>
          <span class="text-fg/20">·</span>
          <span class="font-mono text-caption tracking-mono text-muted">{{ profile.location }}</span>
        </div>
        <a
          href="/alessandro-bruno-cv.pdf"
          download
          data-tooltip="Download CV"
          aria-label="Download CV"
          class="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-surface text-muted shadow-border transition-[color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-accent hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg appIcon="download" class="size-4"></svg>
          <span class="sr-only">Download CV</span>
        </a>
      </div>

      <div class="stagger-in mt-5 flex items-end gap-5">
        <h1 class="font-display text-heading text-fg">
          {{ firstName }}
          <span class="name-underline block italic">{{ lastName }}</span>
        </h1>
        <img
          [src]="profile.avatar"
          [alt]="profile.name"
          width="80"
          height="80"
          class="avatar-shift mb-1 size-16 shrink-0 rounded-md outline outline-1 -outline-offset-1 outline-fg/15 sm:mb-2 sm:size-20"
        />
      </div>

      <p class="stagger-in mt-8 max-w-prose font-serif text-lede text-muted">{{ profile.bio }}</p>

      <p class="stagger-in mt-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 font-mono text-caption tracking-mono text-accent">
        <span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
        {{ profile.availability }}
      </p>

      <div class="stagger-in mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p class="font-serif text-small text-muted">{{ education.degree }} · {{ education.school }}, 2026</p>
        <a
          [href]="'mailto:' + profile.email"
          class="inline-flex items-center gap-2 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-accent"
        >
          <svg appIcon="mail" class="size-3.5"></svg>
          {{ profile.email }}
        </a>
        @if (education.thesisHref) {
          <a
            [href]="education.thesisHref"
            target="_blank"
            rel="noreferrer"
            class="font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-accent"
          >
            {{ ui.readThesis }}
          </a>
        }
      </div>

    </section>
  `,
})
export class IntroComponent {
  protected readonly profile = PROFILE;
  protected readonly education = EDUCATION;
  protected readonly ui = UI;
  protected readonly firstName = FIRST_NAME;
  protected readonly lastName = LAST_NAME;
}
