import { TransformMatrix } from "../transform/transform.matrix";
import { EventEmitter } from "@cmmn/cell/lib";

export class DragHandler extends EventEmitter<{
  transform: TransformMatrix
}> {
  constructor(private root: HTMLDivElement) {
    super();
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
    this.emit(
      "transform",
      TransformMatrix.Translate({
        X: event.x - this.lastPoint.x,
        Y: event.y - this.lastPoint.y,
      })
    );
    this.lastPoint = event;
  };

  dispose() {
    this.root.removeEventListener("pointerdown", this.onDown);
    this.root.removeEventListener("pointerup", this.onUp);
    this.root.removeEventListener("touchstart", this.countTouches);
    this.root.removeEventListener("touchend", this.countTouches);
    super.dispose();
  }
}
