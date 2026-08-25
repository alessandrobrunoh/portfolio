import { Directive, computed, input } from "@angular/core";

export type ButtonVariant = "primary" | "ghost" | "link";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent/90 focus-visible:outline-accent",
  ghost: "bg-transparent text-fg shadow-border hover:shadow-border-hover focus-visible:outline-accent",
  link: "bg-transparent text-accent px-0 py-0 min-h-0 hover:underline focus-visible:outline-accent",
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

  classes = computed(
    () =>
      "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-4 py-2.5 " +
      "font-serif text-body tracking-ui " +
      "transition-[background-color,box-shadow,color,transform] duration-150 ease-out " +
      "focus-visible:outline-2 focus-visible:outline-offset-2 " +
      "active:enabled:scale-[0.96] disabled:opacity-50 " +
      VARIANTS[this.variant() || "primary"],
  );
}
