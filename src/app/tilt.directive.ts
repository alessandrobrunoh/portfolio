import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject, input } from "@angular/core";

/**
 * Pointer tilt + spotlight for cards. Writes --rx/--ry (degrees) and --mx/--my (spotlight
 * position) on the host; the CSS in `.card[data-tilt]` does the rest. Mouse/pen only, and off
 * under prefers-reduced-motion. Runs outside Angular so pointermove never triggers change detection.
 */
@Directive({
  selector: "[appTilt]",
  standalone: true,
  host: { "data-tilt": "" },
})
export class TiltDirective implements OnInit, OnDestroy {
  /** Maximum rotation in degrees; large panels want less. */
  readonly appTilt = input<number | string>(5);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private frame = 0;
  private cleanup: (() => void) | null = null;

  ngOnInit() {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = this.el.nativeElement;

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const max = Number(this.appTilt()) || 5;
        node.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        node.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        node.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
        node.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
        node.classList.add("is-tilting");
      });
    };
    const leave = () => {
      cancelAnimationFrame(this.frame);
      node.classList.remove("is-tilting");
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    };

    this.zone.runOutsideAngular(() => {
      node.addEventListener("pointermove", move);
      node.addEventListener("pointerleave", leave);
    });
    this.cleanup = () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.cleanup?.();
  }
}
