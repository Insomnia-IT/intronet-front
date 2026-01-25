import { EventEmitter } from "@cmmn/core";
import { TransformMatrix } from "../transform/transform.matrix";

export class TransformEmitter extends EventEmitter<{
  transform: TransformMatrix;
}> {
  private abort = new AbortController();
  constructor(private root: HTMLDivElement) {
    super();
    this.root.style.touchAction = "none";
    const signal = this.abort.signal;
    this.root.addEventListener("touchstart", this.onDown, {
      passive: true,
      signal,
    });
    this.root.addEventListener("touchend", this.onUp, {
      passive: true,
      signal,
    });
    this.root.addEventListener("wheel", this.onWheel, {
      passive: true,
      signal,
    });
  }

  onWheel = (event: WheelEvent) => {
    const p = this.eventToPoint(event);
    this.emit(
      "transform",
      new TransformMatrix()
        .Translate(p)
        .Scale(1.1 ** (-event.deltaY / 100))
        .Translate({ X: -p.X, Y: -p.Y })
    );
  };

  onDown = (event: TouchEvent) => {
    this.lastTouches = this.getLastTouches(event);
    if (event.touches.length == 1)
      this.root.addEventListener("touchmove", this.onMove, {
        passive: true,
        signal: this.abort.signal,
      });
  };
  onUp = (event: TouchEvent) => {
    if (!this.lastTouches) return;
    if (event.touches.length > 0) this.lastTouches = this.getLastTouches(event);
    else {
      this.root.removeEventListener("touchmove", this.onMove);
      this.lastTouches = null;
    }
  };

  private lastTouches: TouchInfo = null;

  onMove = (event: TouchEvent) => {
    const touch = this.getLastTouches(event);
    if (this.lastTouches) {
      this.transform(this.lastTouches, touch);
    }
    this.lastTouches = touch;
  };

  private getLastTouches(event: TouchEvent) {
    const t1 = event.touches.item(0);
    const p1 = this.eventToPoint(t1);
    if (event.touches.length == 1) return new TouchInfo(p1);
    const t2 = event.touches.item(1);
    const p2 = this.eventToPoint(t2);
    const center = {
      X: (p1.X + p2.X) / 2,
      Y: (p1.Y + p2.Y) / 2,
    };
    const distance = Math.sqrt((p2.X - p1.X) ** 2 + (p2.Y - p1.Y) ** 2);
    const angle = Math.atan2(p2.Y - p1.Y, p2.X - p1.X);
    return new TouchInfo(center, angle, distance);
  }

  transform(from: TouchInfo, to: TouchInfo) {
    let transform = TransformMatrix.Translate(to.center);
    if (from.angle != undefined && to.angle != undefined)
      transform = transform
        .Rotate(to.angle - from.angle)
        .Scale(to.scale / from.scale);
    transform = transform.Translate({
      X: -from.center.X,
      Y: -from.center.Y,
    });
    this.emit("transform", transform);
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
class TouchInfo {
  constructor(
    public center: Point,
    public angle: number = null,
    public scale: number = null
  ) {}
}
