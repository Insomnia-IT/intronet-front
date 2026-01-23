import { EventEmitter } from "@cmmn/core";
import { TransformMatrix } from "../transform/transform.matrix";

export class RotateHandler extends EventEmitter<{
  transform: TransformMatrix;
}> {
  private abort = new AbortController();
  constructor(private root: HTMLDivElement) {
    super();
    this.root.style.touchAction = "none";
    this.root.addEventListener("touchstart", this.onDown, {
      passive: true,
      signal: this.abort.signal,
    });
    this.root.addEventListener("touchend", this.onUp, {
      passive: true,
      signal: this.abort.signal,
    });
  }

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

  private lastTouches: { center: { X; Y }; angle: number } = null;

  onMove = (event: TouchEvent) => {
    if (event.touches.length !== 2) return;
    const { center, angle } = this.getLastTouches(event);
    if (this.lastTouches) {
      this.rotate(angle - this.lastTouches.angle, center);
    }
    this.lastTouches = { center, angle };
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
    const angle = Math.atan2(p2.Y - p1.Y, p2.X - p1.X);
    return { center, angle };
  }

  rotate(angle, center) {
    this.emit(
      "transform",
      new TransformMatrix()
        .Translate(center)
        .Rotate(angle)
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
    this.abort.abort();
    super.dispose();
  }
}
