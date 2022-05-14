import { Cell } from "cellx";
import { TransformMatrix } from "../transform/transform.matrix";

export class ZoomHandler {
  constructor(
    private root: HTMLDivElement,
    private transform: Cell<TransformMatrix, any>
  ) {
    this.root.style.touchAction = "none";
    this.root.addEventListener("touchstart", this.onDown);
    this.root.addEventListener("touchend", this.onUp);
    this.root.addEventListener("wheel", this.onWheel);
  }

  onWheel = (event: WheelEvent) => {
    this.zoom(1.01 ** event.deltaY, this.eventToPoint(event));
  };

  onDown = (event: TouchEvent) => {
    if (event.touches.length != 2) return;
    this.root.addEventListener("touchmove", this.onMove);
  };
  onUp = (event: TouchEvent) => {
    this.lastTouches = null;
    this.root.removeEventListener("touchmove", this.onMove);
  };

  private lastTouches: { center: { X; Y }; distance: number } = null;

  onMove = (event: TouchEvent) => {
    if (event.touches.length != 2) return;
    const t1 = event.touches.item(0);
    const t2 = event.touches.item(1);
    const p1 = this.eventToPoint(t1);
    const p2 = this.eventToPoint(t2);
    const center = {
      X: (p1.X + p2.X) / 2,
      Y: (p1.Y + p2.Y) / 2,
    };
    const distance = Math.sqrt((p2.X - p1.X) ** 2 + (p2.Y - p1.Y) ** 2);
    if (this.lastTouches) {
      this.zoom(distance / this.lastTouches.distance, center);
    }
    this.lastTouches = { center, distance };
  };

  zoom(scale, center) {
    this.transform.set(
      new TransformMatrix()
        .Translate(center)
        .Scale(scale)
        .Translate({ X: -center.X, Y: -center.Y })
        .Apply(this.transform.get())
    );
  }

  eventToPoint(event: MouseEvent | WheelEvent | Touch) {
    const rect = this.root.getBoundingClientRect();
    return {
      X: event.pageX - rect.left,
      Y: event.pageY - rect.top,
    };
  }

  dispose() {
    this.root.removeEventListener("touchstart", this.onDown);
    this.root.removeEventListener("touchend", this.onUp);
  }
}
