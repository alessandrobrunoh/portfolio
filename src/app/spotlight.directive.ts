import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from "@angular/core";

/**
 * A soft light that follows the pointer across a card. Writes --mx/--my on the host; the
 * `.card[data-spotlight]::before` gradient does the rest. Caches the bounding rect on
 * pointerenter so pointermove never forces a synchronous layout reflow.
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
    let rect: DOMRect | null = null;
    let lastX = 0;
    let lastY = 0;

    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      rect = node.getBoundingClientRect();
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      lastX = event.clientX;
      lastY = event.clientY;
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        if (!rect) rect = node.getBoundingClientRect();
        node.style.setProperty("--mx", `${Math.round(lastX - rect.left)}px`);
        node.style.setProperty("--my", `${Math.round(lastY - rect.top)}px`);
      });
    };

    const leave = () => {
      rect = null;
    };

    this.zone.runOutsideAngular(() => {
      node.addEventListener("pointerenter", enter, { passive: true });
      node.addEventListener("pointermove", move, { passive: true });
      node.addEventListener("pointerleave", leave, { passive: true });
    });
    this.cleanup = () => {
      node.removeEventListener("pointerenter", enter);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }

  ngOnDestroy() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.cleanup?.();
  }
}
