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
      <app-section-head n="06" [title]="ui.sectionTitles.contact" />

      <p class="max-w-2xl font-display text-heading-sm text-fg sm:text-[2.5rem] sm:leading-[1.1]">
        {{ lang() === 'it' ? 'Stai costruendo qualcosa in Rust? Parliamone.' : 'Building something in Rust? Let’s talk.' }}
      </p>
      <p class="mt-5 max-w-prose font-serif text-lede text-fg/80">{{ ui.contactLede }}</p>

      <!-- The address is the call to action: large, full contrast, copyable. -->
      <div class="contact-mail">
        <a [href]="'mailto:' + profile.email" class="contact-mail-link group">
          <span>{{ profile.email }}</span>
          <svg appIcon="arrow-up-right" class="contact-mail-arrow"></svg>
        </a>
        <button type="button" (click)="copy()" class="contact-copy" [attr.aria-label]="copied() ? ui.copiedEmail : ui.copyEmail">
          {{ copied() ? ui.copiedEmail : lang() === 'it' ? 'Copia' : 'Copy' }}
        </button>
      </div>

      <dl class="contact-facts">
        <div>
          <dt>{{ lang() === 'it' ? 'Disponibilità' : 'Availability' }}</dt>
          <dd>{{ profile.availability }}</dd>
        </div>
        <div>
          <dt>{{ lang() === 'it' ? 'Dove' : 'Where' }}</dt>
          <dd>{{ profile.location }} <span class="text-muted">· {{ localTime() }} {{ lang() === 'it' ? 'ora locale' : 'local time' }}</span></dd>
        </div>
        <div>
          <dt>{{ lang() === 'it' ? 'Link' : 'Links' }}</dt>
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
