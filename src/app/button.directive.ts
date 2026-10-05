import { Directive, computed, input } from "@angular/core";

export type ButtonVariant = "primary" | "ghost" | "link";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  link: "inline-flex items-center gap-1.5 font-medium text-accent hover:underline underline-offset-4",
};

/** Applies the Button visual style to any host element (button or anchor) — the Angular stand-in for the React Button's `asChild`. */
@Directive({
  selector: "[appButton]",
  standalone: true,
  host: {
    "[class]": "classes()",
  },
})
export class ButtonDirective {
  variant = input<ButtonVariant>("primary", { alias: "appButton" });

  classes = computed(() => VARIANTS[this.variant() || "primary"]);
}
