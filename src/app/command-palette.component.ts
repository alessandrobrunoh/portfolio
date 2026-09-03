import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { IconComponent } from "./icon.component";
import {
  BLOG,
  FUTURE_PROJECTS,
  PROFILE,
  PROJECTS,
  TOC,
  UI,
  lang,
  setLanguage,
} from "../lib/site";

export interface PaletteItem {
  id: string;
  category: "Navigation" | "Projects" | "Writing" | "Actions" | "System";
  title: string;
  subtitle?: string;
  shortcut?: string;
  icon?: string;
  action: () => void;
}

@Component({
  selector: "app-command-palette",
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (isOpen()) {
      <div
        class="dialog-overlay fixed inset-0 z-[90] bg-black/60 backdrop-blur-md"
        data-state="open"
        (click)="close()"
      ></div>

      <div
        class="dialog-panel fixed inset-x-4 top-[12vh] z-[95] mx-auto flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-fg/15 bg-surface text-fg shadow-dialog"
        data-state="open"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <!-- Search Input Header -->
        <div class="flex items-center gap-3 border-b border-fg/10 px-4 py-3.5 sm:px-5">
          <svg appIcon="compass" class="size-4.5 text-accent shrink-0"></svg>
          <input
            #searchInput
            type="text"
            [placeholder]="lang() === 'it' ? 'Cerca sezioni, progetti, note o comandi (es. ping, theme)...' : 'Search sections, projects, notes or commands (e.g. ping, theme)...'"
            [value]="query()"
            (input)="onQueryChange($event)"
            (keydown)="onInputKeydown($event)"
            class="w-full bg-transparent font-serif text-body text-fg placeholder:text-muted focus:outline-none"
            autocomplete="off"
            spellcheck="false"
          />
          <button
            type="button"
            (click)="close()"
            class="rounded px-1.5 py-0.5 font-mono text-caption text-muted hover:bg-fg/5 hover:text-fg"
          >
            ESC
          </button>
        </div>

        <!-- Feedback / Command output banner if any -->
        @if (systemMessage()) {
          <div class="border-b border-fg/10 bg-accent/10 px-4 py-2.5 font-mono text-caption text-accent sm:px-5">
            {{ systemMessage() }}
          </div>
        }

        <!-- Results List -->
        <div #listContainer class="overflow-y-auto p-2 sm:p-3 max-h-[50vh]">
          @if (filteredItems().length === 0) {
            <div class="py-10 text-center font-serif text-body text-muted">
              {{ lang() === 'it' ? 'Nessun risultato trovato per' : 'No results found for' }} "{{ query() }}"
            </div>
          } @else {
            @for (group of groupedResults(); track group.category) {
              <div class="mb-3 last:mb-0">
                <p class="px-3 py-1 font-mono text-[0.68rem] tracking-mono uppercase text-muted">
                  {{ group.category }}
                </p>
                <div class="space-y-0.5">
                  @for (item of group.items; track item.id; let i = $index) {
                    <button
                      type="button"
                      [id]="'item-' + item.id"
                      (click)="execute(item)"
                      (mouseenter)="selectedIndex.set(getItemIndex(item))"
                      [class]="
                        selectedIndex() === getItemIndex(item)
                          ? 'bg-accent/12 text-accent'
                          : 'text-fg hover:bg-fg/5'
                      "
                      class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <span class="font-mono text-caption tracking-mono opacity-60">
                          {{ item.shortcut || '→' }}
                        </span>
                        <div class="min-w-0">
                          <span class="block truncate font-serif text-small font-medium">
                            {{ item.title }}
                          </span>
                          @if (item.subtitle) {
                            <span class="block truncate font-mono text-[0.68rem] tracking-mono text-muted">
                              {{ item.subtitle }}
                            </span>
                          }
                        </div>
                      </div>

                      <div class="flex items-center gap-2 shrink-0">
                        <span class="font-mono text-[0.65rem] tracking-mono text-muted">
                          {{ item.category }}
                        </span>
                        <svg appIcon="arrow-right" class="size-3.5 opacity-50"></svg>
                      </div>
                    </button>
                  }
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer Shortcuts -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-fg/10 bg-surface/50 px-4 py-2.5 font-mono text-[0.68rem] tracking-mono text-muted sm:px-5">
          <div class="flex items-center gap-3">
            <span><kbd class="rounded bg-fg/10 px-1 py-0.5">↑</kbd> <kbd class="rounded bg-fg/10 px-1 py-0.5">↓</kbd> {{ lang() === 'it' ? 'naviga' : 'navigate' }}</span>
            <span><kbd class="rounded bg-fg/10 px-1 py-0.5">↵</kbd> {{ lang() === 'it' ? 'seleziona' : 'select' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>Alessandro Bruno Portfolio</span>
            <span>·</span>
            <span class="text-accent">Systems & Product</span>
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPaletteComponent implements OnInit {
  @ViewChild("searchInput") searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild("listContainer") listContainer?: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);

  isOpen = signal(false);
  query = signal("");
  selectedIndex = signal(0);
  systemMessage = signal<string | null>(null);

  protected readonly lang = lang;
  protected readonly ui = UI;

  ngOnInit() {}

  @HostListener("window:keydown", ["$event"])
  onGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      this.toggle();
    } else if (e.key === "Escape" && this.isOpen()) {
      e.preventDefault();
      this.close();
    }
  }

  open() {
    this.isOpen.set(true);
    this.query.set("");
    this.selectedIndex.set(0);
    this.systemMessage.set(null);
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    }, 50);
  }

  close() {
    this.isOpen.set(false);
    this.systemMessage.set(null);
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  onQueryChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.query.set(val);
    this.selectedIndex.set(0);
    this.systemMessage.set(null);
  }

  onInputKeydown(e: KeyboardEvent) {
    const items = this.filteredItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (this.selectedIndex() + 1) % (items.length || 1);
      this.selectedIndex.set(next);
      this.scrollToSelected();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (this.selectedIndex() - 1 + (items.length || 1)) % (items.length || 1);
      this.selectedIndex.set(prev);
      this.scrollToSelected();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[this.selectedIndex()];
      if (item) {
        this.execute(item);
      }
    }
  }

  private scrollToSelected() {
    setTimeout(() => {
      const selected = this.filteredItems()[this.selectedIndex()];
      if (!selected) return;
      const el = document.getElementById("item-" + selected.id);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 20);
  }

  execute(item: PaletteItem) {
    item.action();
  }

  getItemIndex(target: PaletteItem): number {
    return this.filteredItems().findIndex((i) => i.id === target.id);
  }

  private allItems = computed<PaletteItem[]>(() => {
    const isIt = this.lang() === "it";
    const items: PaletteItem[] = [];

    // 1. Navigation items
    for (const toc of TOC) {
      items.push({
        id: `nav-${toc.href}`,
        category: "Navigation",
        title: toc.label,
        subtitle: `Jump to ${toc.href}`,
        shortcut: toc.n,
        action: () => {
          this.close();
          if (this.router.url !== "/") {
            this.router.navigate(["/"]).then(() => {
              document.querySelector(toc.href)?.scrollIntoView({ behavior: "smooth" });
            });
          } else {
            document.querySelector(toc.href)?.scrollIntoView({ behavior: "smooth" });
          }
        },
      });
    }

    // 2. Projects items
    for (const p of PROJECTS) {
      items.push({
        id: `proj-${p.id}`,
        category: "Projects",
        title: p.name,
        subtitle: `${p.lang} · ${p.blurb}`,
        shortcut: p.year,
        action: () => {
          this.close();
          this.router.navigate(["/projects", p.id]);
        },
      });
    }

    // Future projects
    for (const p of FUTURE_PROJECTS) {
      items.push({
        id: `future-${p.id}`,
        category: "Projects",
        title: `${p.name} [Exploring]`,
        subtitle: `${p.stack.join(" · ")} · ${p.blurb}`,
        action: () => {
          this.close();
          this.router.navigate(["/projects", p.id]);
        },
      });
    }

    // 3. Blog Writing items
    for (const b of BLOG) {
      items.push({
        id: `blog-${b.slug}`,
        category: "Writing",
        title: b.title,
        subtitle: `${b.subtitle} · ${b.status}`,
        action: () => {
          this.close();
          this.router.navigate(["/blog", b.slug]);
        },
      });
    }

    // 4. Actions
    items.push(
      {
        id: "act-theme",
        category: "Actions",
        title: isIt ? "Cambia tema colore" : "Toggle Color Theme",
        subtitle: "Dark / Light mode",
        shortcut: "Theme",
        action: () => {
          document.documentElement.classList.toggle("dark");
          const dark = document.documentElement.classList.contains("dark");
          localStorage.setItem("theme", dark ? "dark" : "light");
          this.systemMessage.set(`Theme switched to ${dark ? "Dark" : "Light"}`);
        },
      },
      {
        id: "act-lang-it",
        category: "Actions",
        title: "Imposta lingua su Italiano",
        subtitle: "Passa al contenuto in lingua italiana",
        shortcut: "IT",
        action: () => {
          setLanguage("it");
          this.systemMessage.set("Lingua impostata su Italiano");
        },
      },
      {
        id: "act-lang-en",
        category: "Actions",
        title: "Set language to English",
        subtitle: "Switch to English content",
        shortcut: "EN",
        action: () => {
          setLanguage("en");
          this.systemMessage.set("Language set to English");
        },
      },
      {
        id: "act-copy-email",
        category: "Actions",
        title: isIt ? "Copia indirizzo email" : "Copy Email Address",
        subtitle: PROFILE.email,
        shortcut: "Copy",
        action: () => {
          navigator.clipboard.writeText(PROFILE.email);
          this.systemMessage.set(`Email copied: ${PROFILE.email}`);
        },
      },
      {
        id: "act-download-cv",
        category: "Actions",
        title: isIt ? "Scarica Curriculum Vitae (PDF)" : "Download CV (PDF)",
        subtitle: "alessandro-bruno-cv.pdf",
        shortcut: "CV",
        action: () => {
          const a = document.createElement("a");
          a.href = "/alessandro-bruno-cv.pdf";
          a.download = "alessandro-bruno-cv.pdf";
          a.click();
          this.close();
        },
      }
    );

    // 5. System & Terminal Commands
    items.push(
      {
        id: "sys-ping",
        category: "System",
        title: "ping",
        subtitle: "Test telemetry heartbeat to backend services",
        shortcut: "$ ping",
        action: () => {
          this.systemMessage.set("PONG: round-trip 0.18ms · Tokio async workers active · Valkey stream OK");
        },
      },
      {
        id: "sys-whoami",
        category: "System",
        title: "whoami",
        subtitle: "Display engineer profile credentials",
        shortcut: "$ whoami",
        action: () => {
          this.systemMessage.set(`${PROFILE.name} — ${PROFILE.role} (${PROFILE.location})`);
        },
      },
      {
        id: "sys-sysinfo",
        category: "System",
        title: "sysinfo",
        subtitle: "Stack & runtime architecture report",
        shortcut: "$ sysinfo",
        action: () => {
          this.systemMessage.set("Engine: Rust 2024 · Async: Tokio · Streams: Valkey · S3 Sink · Angular 22 SSR");
        },
      },
      {
        id: "sys-top",
        category: "System",
        title: "top",
        subtitle: "Scroll directly to top of page",
        shortcut: "$ top",
        action: () => {
          this.close();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      }
    );

    return items;
  });

  filteredItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.allItems();
    if (!q) return all;

    return all.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q) ?? false;
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchShortcut = item.shortcut?.toLowerCase().includes(q) ?? false;
      return matchTitle || matchSub || matchCategory || matchShortcut;
    });
  });

  groupedResults = computed(() => {
    const items = this.filteredItems();
    const order: Array<PaletteItem["category"]> = [
      "Actions",
      "Navigation",
      "Projects",
      "Writing",
      "System",
    ];
    const map = new Map<PaletteItem["category"], PaletteItem[]>();

    for (const item of items) {
      if (!map.has(item.category)) {
        map.set(item.category, []);
      }
      map.get(item.category)!.push(item);
    }

    return order
      .filter((cat) => map.has(cat))
      .map((cat) => ({
        category: cat,
        items: map.get(cat)!,
      }));
  });
}
