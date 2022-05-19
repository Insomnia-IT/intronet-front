import { Cell } from "cellx";
import { TransformMatrix } from "../transform/transform.matrix";

export class DragHandler {
  constructor(
    private root: HTMLDivElement,
    private transform: Cell<TransformMatrix, any>
  ) {
    this.root.style.touchAction = "none";
    this.root.addEventListener("pointerdown", this.onDown, { passive: true });
    this.root.addEventListener("touchstart", this.countTouches, {
      passive: true,
    });
    this.root.addEventListener("touchend", this.countTouches, {
      passive: true,
    });
    this.root.addEventListener("pointerup", this.onUp, { passive: true });
  }
  private touchCount = 0;
  countTouches = (e: TouchEvent) => {
    this.touchCount = e.touches.length;
  };

  onDown = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    this.root.setPointerCapture(event.pointerId);
    this.lastPoint = event;
    this.root.addEventListener("pointermove", this.onMove, { passive: true });
  };
  onUp = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    this.root.removeEventListener("pointermove", this.onMove);
    this.root.releasePointerCapture(event.pointerId);
  };
  private lastPoint: { x; y };
  onMove = (event: PointerEvent) => {
    if (this.touchCount > 1) return;
    this.transform.set(
      new TransformMatrix()
        .Translate({
          X: event.x - this.lastPoint.x,
          Y: event.y - this.lastPoint.y,
        })
        .Apply(this.transform.get())
    );
    this.lastPoint = event;
  };

  dispose() {
    this.root.removeEventListener("pointerdown", this.onDown);
    this.root.removeEventListener("pointerup", this.onUp);
    this.root.removeEventListener("touchstart", this.countTouches);
    this.root.removeEventListener("touchend", this.countTouches);
  }
}
