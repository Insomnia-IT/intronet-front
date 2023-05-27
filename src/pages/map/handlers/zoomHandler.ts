import { EventEmitter } from "@cmmn/cell/lib";
import { TransformMatrix } from "../transform/transform.matrix";

export class ZoomHandler extends EventEmitter<{
  transform: TransformMatrix;
}> {
  constructor(private root: HTMLDivElement) {
    super();
    this.root.style.touchAction = "none";
    this.root.addEventListener("touchstart", this.onDown, { passive: true });
    this.root.addEventListener("touchend", this.onUp, { passive: true });
    // this.root.addEventListener("gesturestart", this.onGestureStart, {
    //   passive: true,
    // });
    // this.root.addEventListener("gestureend", this.onGestureEnd, {
    //   passive: true,
    // });
    this.root.addEventListener("wheel", this.onWheel, { passive: true });
  }

  onWheel = (event: WheelEvent) => {
    this.zoom(1.1 ** (-event.deltaY / 100), this.eventToPoint(event));
  };
  lastGesture = null;
  onGestureStart = (event: TouchEvent) => {
    this.lastGesture = event;
    this.root.addEventListener("gesturechange", this.onGestureChange, {
      passive: true,
    });
  };
  onGestureEnd = (event: TouchEvent) => {
    this.lastGesture = null;
    this.root.removeEventListener("gesturechange", this.onGestureChange);
  };
  onGestureChange = (event) => {
    const sign =
      this.lastGesture.scale < event.scale // ЕСЛИ scale растет
        ? 1 // ТОГДА (+)zoom
        : -1; // ИНАЧЕ (-)zoom
    const scale = 2 ** (sign * 0.02);
    const point = this.eventToPoint(event);
    this.emit(
      "transform",
      new TransformMatrix()
        .Translate(point)
        .Scale(scale)
        .Translate({ X: -point.X, Y: -point.Y })
    );
    this.lastGesture = event;
  };
  onDown = (event: TouchEvent) => {
    if (event.touches.length !== 2) return;
    this.lastTouches = this.getLastTouches(event);
    this.root.addEventListener("touchmove", this.onMove, { passive: true });
  };
  onUp = (event: TouchEvent) => {
    if (!this.lastTouches) return;
    this.lastTouches = null;
    this.root.removeEventListener("touchmove", this.onMove);
  };

  private lastTouches: { center: { X; Y }; distance: number } = null;

  onMove = (event: TouchEvent) => {
    const { center, distance } = this.getLastTouches(event);
    if (event.touches.length !== 2) return;
    if (this.lastTouches) {
      this.zoom(distance / this.lastTouches.distance, center);
    }
    this.lastTouches = { center, distance };
  };

  private getLastTouches(event: TouchEvent) {
    const t1 = event.touches.item(0);
    const t2 = event.touches.item(1);
    const p1 = this.eventToPoint(t1);
    const p2 = this.eventToPoint(t2);
    const center = {
      X: (p1.X + p2.X) / 2,
      Y: (p1.Y + p2.Y) / 2,
    };
    const distance = Math.sqrt((p2.X - p1.X) ** 2 + (p2.Y - p1.Y) ** 2);
    return { center, distance };
  }

  zoom(scale, center) {
    this.emit(
      "transform",
      new TransformMatrix()
        .Translate(center)
        .Scale(scale)
        .Translate({ X: -center.X, Y: -center.Y })
    );
  }

  private rect: DOMRect;
  eventToPoint(event: MouseEvent | WheelEvent | Touch) {
    this.rect ??= this.root.getBoundingClientRect();
    return {
      X: event.pageX - this.rect.left,
      Y: event.pageY - this.rect.top,
    };
  }

  dispose() {
    this.root.removeEventListener("touchstart", this.onDown);
    this.root.removeEventListener("touchend", this.onUp);
    // this.root.removeEventListener("gesturestart", this.onGestureStart);
    // this.root.removeEventListener("gestureend", this.onGestureEnd);
    this.root.removeEventListener("wheel", this.onWheel);
    super.dispose();
  }
}
