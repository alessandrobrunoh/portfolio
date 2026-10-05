import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from "@angular/core";

/**
 * A soft light that follows the pointer across a card. Writes --mx/--my on the host; the
 * `.card[data-spotlight]::before` gradient does the rest. Mouse and pen only, off under
 * prefers-reduced-motion, and outside Angular so pointermove never runs change detection.
 */
@Directive({
  selector: "[appSpotlight]",
  standalone: true,
  host: { "data-spotlight": "" },
})
export class SpotlightDirective implements OnInit, OnDestroy {
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
        node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        node.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    };
    this.zone.runOutsideAngular(() => node.addEventListener("pointermove", move));
    this.cleanup = () => node.removeEventListener("pointermove", move);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
    this.cleanup?.();
  }
}
