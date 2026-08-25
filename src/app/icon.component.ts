import { Component, computed, input } from "@angular/core";

export type IconName = "github" | "menu" | "x" | "sun" | "moon" | "arrow-up-right" | "download" | "mail" | "x-social";

/** Lucide-compatible stroke icons, ported 1:1 from lucide-react path data. */
@Component({
  selector: "svg[appIcon]",
  standalone: true,
  template: `
    @switch (appIcon()) {
      @case ("github") {
        <svg:path
          d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
        />
        <svg:path d="M9 18c-4.51 2-5-2-7-2" />
      }
      @case ("menu") {
        <svg:path d="M4 12h16" />
        <svg:path d="M4 18h16" />
        <svg:path d="M4 6h16" />
      }
      @case ("x") {
        <svg:path d="M18 6 6 18" />
        <svg:path d="m6 6 12 12" />
      }
      @case ("sun") {
        <svg:circle cx="12" cy="12" r="4" />
        <svg:path d="M12 2v2" />
        <svg:path d="M12 20v2" />
        <svg:path d="m4.93 4.93 1.41 1.41" />
        <svg:path d="m17.66 17.66 1.41 1.41" />
        <svg:path d="M2 12h2" />
        <svg:path d="M20 12h2" />
        <svg:path d="m6.34 17.66-1.41 1.41" />
        <svg:path d="m19.07 4.93-1.41 1.41" />
      }
      @case ("moon") {
        <svg:path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      }
      @case ("arrow-up-right") {
        <svg:path d="M7 7h10v10" />
        <svg:path d="M7 17 17 7" />
      }
      @case ("download") {
        <svg:path d="M12 3v12" />
        <svg:path d="m7 10 5 5 5-5" />
        <svg:path d="M5 21h14" />
      }
      @case ("mail") {
        <svg:rect width="20" height="16" x="2" y="4" rx="2" />
        <svg:path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      }
      @case ("x-social") {
        <svg:path d="M4 4l7.5 9.5L4.5 20" />
        <svg:path d="M20 4l-7.4 8.9L20 20h-4l-5-6.3" />
        <svg:path d="M8 4H4" />
      }
    }
  `,
  host: {
    "[attr.viewBox]": "'0 0 24 24'",
    "[attr.fill]": "'none'",
    "[attr.stroke]": "'currentColor'",
    "[attr.stroke-width]": "strokeWidth()",
    "[attr.stroke-linecap]": "'round'",
    "[attr.stroke-linejoin]": "'round'",
    "aria-hidden": "true",
  },
})
export class IconComponent {
  appIcon = input.required<IconName>();
  strokeWidth = input(1.75);
}

export type MarkName = "grok" | "zed" | "delta" | "gitbutler";

const VIEWBOX: Record<MarkName, string> = {
  grok: "0 0 24 24",
  zed: "0 0 24 24",
  delta: "0 0 32 32",
  gitbutler: "0 0 16 16",
};

/** Daily-tool wordmarks, ported 1:1 from the React tools.tsx path data. */
@Component({
  selector: "svg[appMark]",
  standalone: true,
  template: `
    @switch (appMark()) {
      @case ("grok") {
        <svg:path
          fill-rule="evenodd"
          d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"
        />
      }
      @case ("zed") {
        <svg:path
          d="M2.25 1.5a.75.75 0 0 0-.75.75v16.5H0V2.25A2.25 2.25 0 0 1 2.25 0h20.095c1.002 0 1.504 1.212.795 1.92L10.764 14.298h3.486V12.75h1.5v1.922a1.125 1.125 0 0 1-1.125 1.125H9.264l-2.578 2.578h11.689V9h1.5v9.375a1.5 1.5 0 0 1-1.5 1.5H5.185L2.562 22.5H21.75a.75.75 0 0 0 .75-.75V5.25H24v16.5A2.25 2.25 0 0 1 21.75 24H1.655C.653 24 .151 22.788.86 22.08L13.19 9.75H9.75v1.5h-1.5V9.375A1.125 1.125 0 0 1 9.375 8.25h5.314l2.625-2.625H5.625V15h-1.5V5.625a1.5 1.5 0 0 1 1.5-1.5h13.19L21.438 1.5z"
        />
      }
      @case ("delta") {
        <svg:path
          fill-rule="evenodd"
          d="M15.0907 5.15945C15.3263 4.75139 15.7618 4.5 16.233 4.5C16.7042 4.5 17.1396 4.75139 17.3753 5.15945L29.3238 25.8549C29.5594 26.2629 29.5594 26.7657 29.3238 27.1738C29.0882 27.5819 28.6527 27.8333 28.1815 27.8333H9.34553C8.87431 27.8333 8.43888 27.5819 8.20327 27.1738C7.96766 26.7657 7.96766 26.2629 8.20327 25.8549L16.233 11.947L22.8744 23.4503H14.6526L15.782 21.4942H19.4863L16.233 15.8593L10.4491 25.8772H27.0779L16.233 7.09328L4.25871 27.8333H2L15.0907 5.15945Z"
        />
      }
      @case ("gitbutler") {
        <svg:path d="M3 13V3L7.99215 7.37879L13 3V13L7.99215 8.63636L3 13Z" />
      }
    }
  `,
  host: {
    "[attr.viewBox]": "viewBox()",
    "[attr.fill]": "'currentColor'",
    "aria-hidden": "true",
  },
})
export class MarkComponent {
  appMark = input.required<MarkName>();
  viewBox = computed(() => VIEWBOX[this.appMark()]);
}
