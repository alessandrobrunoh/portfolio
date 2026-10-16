import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { SpotlightDirective } from "./spotlight.directive";
import { PROFILE, UI, lang } from "../lib/site";

const LOCAL_TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [IconComponent, SpotlightDirective],
  template: `
    <section id="contact" class="container-x section scroll-mt-16">
      <div class="reveal-on-scroll">
        <div class="card contact-panel" appSpotlight>
          <img class="contact-panel-mark" src="/brand/ab-monogram.webp" alt="" width="960" height="666" loading="lazy" aria-hidden="true" />

          <div class="contact-topbar">
            <div class="section-badge">
              <span class="section-badge-dot" aria-hidden="true"></span>
              <span>05</span>
              <span class="section-badge-sep" aria-hidden="true">·</span>
              <span>{{ ui.sectionTitles.contact }}</span>
            </div>
            <span class="badge-soft">
              <span class="live-dot" aria-hidden="true"></span>
              <span>{{ lang() === 'it' ? 'Disponibile per colloqui' : 'Open to opportunities' }}</span>
            </span>
          </div>

          <div class="contact-grid">
            <div>
              <h2 class="contact-statement">
                {{ lang() === 'it' ? 'Hai qualcosa da costruire? Parliamone' : 'Got something to build? Let’s talk' }}<span class="brand-dot" aria-hidden="true">.</span>
              </h2>
              <p class="section-lede mt-4">{{ ui.contactLede }}</p>

              <!-- Soft Minimal Interactive Mail Pill -->
              <div class="contact-mail">
                <a [href]="'mailto:' + profile.email" class="contact-mail-link">
                  <svg appIcon="mail" class="size-5 text-accent shrink-0"></svg>
                  <span>{{ profile.email }}</span>
                  <svg appIcon="arrow-up-right" class="contact-mail-arrow"></svg>
                </a>
                <button type="button" (click)="copy()" class="btn btn-ghost btn-sm" [attr.aria-label]="copied() ? ui.copiedEmail : ui.copyEmail">
                  <svg [appIcon]="copied() ? 'check' : 'copy'" class="size-3.5"></svg>
                  <span>{{ copied() ? ui.copiedEmail : lang() === 'it' ? 'Copia' : 'Copy' }}</span>
                  <kbd class="kbd-cap ml-0.5">C</kbd>
                </button>
              </div>
            </div>

            <dl class="contact-facts">
              <div>
                <dt class="font-mono text-micro uppercase tracking-wider text-accent">{{ lang() === 'it' ? 'Ruoli & Disponibilità' : 'Roles & Availability' }}</dt>
                <dd>{{ profile.availability }}</dd>
              </div>
              <div>
                <dt class="font-mono text-micro uppercase tracking-wider text-accent">{{ lang() === 'it' ? 'Sede & Orario Locale' : 'Base & Local Time' }}</dt>
                <dd class="flex flex-wrap items-center justify-between gap-2">
                  <span>{{ profile.location }}</span>
                  <span class="inline-flex items-center gap-2 font-mono text-caption text-fg">
                    <span class="live-dot" aria-hidden="true"></span>{{ localTime() }} CET/CEST
                  </span>
                </dd>
              </div>
              <div>
                <dt class="font-mono text-micro uppercase tracking-wider text-accent">{{ lang() === 'it' ? 'Link diretti' : 'Direct links' }}</dt>
                <dd class="flex flex-wrap gap-x-6 gap-y-2">
                  <a [href]="profile.github" target="_blank" rel="noreferrer" class="contact-link">
                    <svg appIcon="github" class="size-4"></svg>GitHub
                  </a>
                  <a href="/alessandro-bruno-cv.pdf" download class="contact-link">
                    <svg appIcon="download" class="size-4"></svg>{{ lang() === 'it' ? 'Curriculum (PDF)' : 'Resume (PDF)' }}
                  </a>
                  @if (profile.x) {
                    <a [href]="'https://x.com/' + profile.x" target="_blank" rel="noreferrer" class="contact-link">
                      <svg appIcon="x-social" class="size-4"></svg>&#64;{{ profile.x }}
                    </a>
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly profile = PROFILE;
  protected readonly ui = UI;
  protected readonly lang = lang;

  copied = signal(false);
  protected readonly localTime = signal(LOCAL_TIME.format(new Date()));

  ngOnInit() {
    if (typeof window === "undefined") return;
    const id = window.setInterval(() => this.localTime.set(LOCAL_TIME.format(new Date())), 30_000);
    this.destroyRef.onDestroy(() => window.clearInterval(id));
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.profile.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard blocked — the mailto link still works.
    }
  }
}
