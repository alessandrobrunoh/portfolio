import { Component } from "@angular/core";

import { EDUCATION, PROFILE } from "../lib/site";

const [FIRST_NAME, LAST_NAME] = PROFILE.name.split(" ");

@Component({
  selector: "app-intro",
  standalone: true,

  template: `
    <section id="intro" class="scroll-mt-20">
      <div class="stagger-in inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-surface px-3 py-1.5 shadow-border">
        <span class="font-mono text-caption tracking-mono text-accent">{{ profile.company.name }}</span>
        <span class="text-fg/20">·</span>
        <span class="font-mono text-caption tracking-mono text-muted">{{ profile.shortRole }}</span>
        <span class="text-fg/20">·</span>
        <span class="font-mono text-caption tracking-mono text-muted">{{ profile.location }}</span>
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

      <p class="stagger-in mt-4 font-serif text-small text-muted">{{ education.degree }} · {{ education.school }}, 2026</p>

    </section>
  `,
})
export class IntroComponent {
  protected readonly profile = PROFILE;
  protected readonly education = EDUCATION;
  protected readonly firstName = FIRST_NAME;
  protected readonly lastName = LAST_NAME;
}
