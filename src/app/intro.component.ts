import { Component } from "@angular/core";
import { IconComponent } from "./icon.component";

import { GITHUB_STATS } from "../lib/github-stats";
import { CONTRIBUTIONS, EDUCATION, PROFILE, UI, lang } from "../lib/site";

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

      <p class="stagger-in mt-8 max-w-2xl font-display text-subhead text-fg sm:text-heading-sm">
        {{ profile.role }}<span class="text-accent">.</span>
        <span class="text-muted">&#32;{{ profile.headline }}</span>
      </p>

      <div class="stagger-in mt-6 flex flex-wrap items-center gap-2">
        <a
          [href]="'mailto:' + profile.email"
          class="group inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-4 font-mono text-caption tracking-mono text-on-accent transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg appIcon="mail" class="size-3.5"></svg>
          {{ lang() === 'it' ? 'Scrivimi' : 'Email me' }}
        </a>
        <a
          href="/alessandro-bruno-cv.pdf"
          download
          class="inline-flex min-h-11 items-center gap-2 rounded-sm border border-fg/15 px-4 font-mono text-caption tracking-mono text-fg transition-colors duration-150 hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg appIcon="download" class="size-3.5"></svg>
          {{ lang() === 'it' ? 'Scarica il CV' : 'Download CV' }}
        </a>
        <a
          [href]="profile.github"
          target="_blank"
          rel="noreferrer"
          class="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 font-mono text-caption tracking-mono text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg appIcon="github" class="size-3.5"></svg>
          GitHub
        </a>
      </div>

      <p class="stagger-in mt-5 inline-flex items-center gap-2 rounded-sm border border-accent/25 px-3 py-1.5 font-mono text-caption tracking-mono text-accent">
        <span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
        {{ profile.availability }}
      </p>

      <!-- Proof, not adjectives: every figure comes from GitHub (npm run sync:github) or a merged PR. -->
      <dl class="intro-proof stagger-in mt-10">
        <div>
          <dt>{{ lang() === 'it' ? 'Contributi GitHub' : 'GitHub contributions' }}</dt>
          <dd>{{ stats.lastYearContributions.toLocaleString('en-US') }}</dd>
          <dd class="note">{{ lang() === 'it' ? 'negli ultimi 12 mesi' : 'in the last 12 months' }}</dd>
        </div>
        @if (merged; as m) {
          <div>
            <dt>Open source</dt>
            <dd><a [href]="m.href" target="_blank" rel="noreferrer">{{ lang() === 'it' ? 'Accettato in Zed' : 'Merged into Zed' }}</a></dd>
            <dd class="note">{{ m.title }}</dd>
          </div>
        }
        <div>
          <dt>{{ lang() === 'it' ? 'Repository pubblici' : 'Public repositories' }}</dt>
          <dd>{{ stats.publicRepos }}</dd>
          <dd class="note">Rust, TypeScript, Java</dd>
        </div>
      </dl>

      <p class="stagger-in mt-10 max-w-prose font-serif text-lede text-muted">{{ profile.bio }}</p>

      <div class="stagger-in mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p class="font-serif text-small text-muted">{{ education.degree }} · {{ education.school }}, 2026</p>
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
  protected readonly lang = lang;
  protected readonly stats = GITHUB_STATS;
  protected get merged() {
    return CONTRIBUTIONS.find((c) => c.status === "Merged");
  }
  protected readonly firstName = FIRST_NAME;
  protected readonly lastName = LAST_NAME;
}
