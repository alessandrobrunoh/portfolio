import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { IconComponent } from "./icon.component";
import { TiltDirective } from "./tilt.directive";
import { PROFILE, UI, lang } from "../lib/site";

const LOCAL_TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [IconComponent, TiltDirective],
  template: `
    <section id="contact" class="container-x section scroll-mt-16">
      <div class="reveal-on-scroll"><div class="card contact-panel" appTilt="1.2">
        <span class="project-lead-glow" aria-hidden="true"></span>
        <img class="contact-panel-mark" src="/brand/ab-monogram-metallic.webp" alt="" width="960" height="695" loading="lazy" aria-hidden="true" />

        <p class="eyebrow">
          <span class="eyebrow-index">05</span>
          <span class="eyebrow-rule" aria-hidden="true"></span>
          {{ ui.sectionTitles.contact }}
        </p>
        <h2 class="contact-statement mt-6">
          {{ lang() === 'it' ? 'Hai qualcosa da costruire? Parliamone' : 'Got something to build? Let’s talk' }}<span class="brand-dot" aria-hidden="true">.</span>
        </h2>
        <p class="section-lede mt-5">{{ ui.contactLede }}</p>

        <!-- The address is the call to action: large, full contrast, copyable. -->
        <div class="contact-mail">
          <a [href]="'mailto:' + profile.email" class="contact-mail-link">
            <span>{{ profile.email }}</span>
            <svg appIcon="arrow-up-right" class="contact-mail-arrow"></svg>
          </a>
          <button type="button" (click)="copy()" class="btn btn-ghost btn-sm" [attr.aria-label]="copied() ? ui.copiedEmail : ui.copyEmail">
            {{ copied() ? ui.copiedEmail : lang() === 'it' ? 'Copia' : 'Copy' }}
          </button>
        </div>

        <dl class="contact-facts">
          <div>
            <dt class="eyebrow">{{ lang() === 'it' ? 'Disponibilità' : 'Availability' }}</dt>
            <dd>{{ profile.availability }}</dd>
          </div>
          <div>
            <dt class="eyebrow">{{ lang() === 'it' ? 'Dove' : 'Where' }}</dt>
            <dd>
              {{ profile.location }}
              <span class="mt-1 flex items-center gap-2 meta-mono"><span class="live-dot" aria-hidden="true"></span>{{ localTime() }} {{ lang() === 'it' ? 'ora locale' : 'local time' }}</span>
            </dd>
          </div>
          <div>
            <dt class="eyebrow">{{ lang() === 'it' ? 'Link' : 'Links' }}</dt>
            <dd class="flex flex-wrap gap-x-5 gap-y-2">
              <a [href]="profile.github" target="_blank" rel="noreferrer" class="contact-link">
                <svg appIcon="github" class="size-4"></svg>GitHub
              </a>
              <a href="/alessandro-bruno-cv.pdf" download class="contact-link">
                <svg appIcon="download" class="size-4"></svg>{{ lang() === 'it' ? 'CV in PDF' : 'CV as PDF' }}
              </a>
              @if (profile.x) {
                <a [href]="'https://x.com/' + profile.x" target="_blank" rel="noreferrer" class="contact-link">
                  <svg appIcon="x-social" class="size-4"></svg>&#64;{{ profile.x }}
                </a>
              }
            </dd>
          </div>
        </dl>
      </div></div>
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
