import { Component, computed, input } from "@angular/core";

export type IconName =
  | "github"
  | "menu"
  | "x"
  | "sun"
  | "moon"
  | "arrow-up-right"
  | "download"
  | "mail"
  | "x-social"
  | "chevron-left"
  | "chevron-right"
  | "arrow-up"
  | "arrow-left"
  | "arrow-right"
  | "globe"
  | "copy"
  | "check"
  | "book";

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
      @case ("chevron-left") {
        <svg:path d="m15 18-6-6 6-6" />
      }
      @case ("chevron-right") {
        <svg:path d="m9 18 6-6 6 6" />
      }
      @case ("arrow-up") {
        <svg:path d="m5 12 7-7 7 7" />
        <svg:path d="M12 19V5" />
      }
      @case ("arrow-left") {
        <svg:path d="m12 19-7-7 7-7" />
        <svg:path d="M19 12H5" />
      }
      @case ("copy") {
        <svg:rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <svg:path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      }
      @case ("check") {
        <svg:path d="M20 6 9 17l-5-5" />
      }
      @case ("book") {
        <svg:path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      }
      @case ("globe") {
        <svg:circle cx="12" cy="12" r="10" />
        <svg:path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <svg:path d="M2 12h20" />
      }
      @case ("arrow-right") {
        <svg:path d="M5 12h14" />
        <svg:path d="m12 5 7 7-7 7" />
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

export type MarkName = "openai" | "zed" | "delta" | "trama";

const VIEWBOX: Record<MarkName, string> = {
  openai: "0 0 24 24",
  zed: "0 0 24 24",
  delta: "0 0 32 32",
  trama: "0 0 512 512",
};

/** Daily-tool wordmarks, ported 1:1 from the React tools.tsx path data. */
@Component({
  selector: "svg[appMark]",
  standalone: true,
  template: `
    @switch (appMark()) {
      @case ("openai") {
        <svg:path
          d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
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
      @case ("trama") {
        <svg:g transform="translate(-221.065 -217.065) scale(0.7608696)">
          <svg:path
            d="M 453 351 H 725 Q 738 351 738 364 V 377 C 738 410 713 435 681 435 H 483 C 458 435 440 454 440 478 V 680 C 440 708 418 731 390 731 H 364 Q 351 731 351 718 V 442 C 351 391 397 351 453 351 Z"
          />
          <svg:path
            d="M 866 507 H 891 Q 903 507 903 519 V 798 C 903 853 858 894 802 894 H 499 Q 486 894 486 881 V 866 C 486 836 512 812 543 812 H 771 C 796 812 813 795 813 770 V 560 C 813 531 838 507 866 507 Z"
          />
        </svg:g>
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
