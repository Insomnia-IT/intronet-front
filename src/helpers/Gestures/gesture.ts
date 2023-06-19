import { Cell } from "@cmmn/cell/lib";

export type Gesture =
  | {
      path: EventTarget[];
      direction: "x" | "y";
      shift: number;
    }
  | undefined;

export class GestureCell extends Cell<Gesture> {
  constructor(private root: HTMLElement) {
    super(undefined);
    root.style.touchAction = "pan-y";
    root.style.overscrollBehaviorX = "none";
  }

  private shift: { x: number; y: number } = undefined;
  private path: EventTarget[] | undefined;

  private onDown = (e: PointerEvent) => {
    console.log('down',e);
    this.shift = { x: 0, y: 0 };
    this.lastTouch = e;
    this.path = e.composedPath();
    this.root.addEventListener("pointermove", this.onMove, {
      passive: true,
    });
  };
  private lastTouch: PointerEvent|undefined = undefined;
  private onMove = (e: PointerEvent) => {
    if (!this.shift) return;
    this.shift.x += (e.screenX - this.lastTouch.screenX);
    this.shift.y += (e.screenY - this.lastTouch.screenY);
    this.lastTouch = e;
    console.log('shift', this.shift, e, e.screenX);
    if (Math.abs(this.shift.x) > 2 || Math.abs(this.shift.y) > 2) {
      this.root.setPointerCapture(e.pointerId);
    }
    const current = this.get();
    if (
      current?.direction == "y" ||
      Math.atan2(this.shift.y, this.shift.x) > 10
    ) {
      this.set({
        path: this.path,
        direction: "y",
        shift: this.shift.y,
      });
    } else if (
      current?.direction == "x" ||
      Math.atan2(this.shift.y, this.shift.x) < 0.1
    ) {
      this.set({
        path: this.path,
        direction: "x",
        shift: this.shift.x,
      });
    } else {
      this.set(undefined);
    }
  };
  private onUp = (e: PointerEvent) => {
    this.shift = undefined;
    this.root.releasePointerCapture(e.pointerId);
    this.root.removeEventListener("pointermove", this.onMove);
    this.set(undefined);
  };

  active() {
    super.active();
    this.root.addEventListener("pointerdown", this.onDown, {
      capture: true,
    });
    this.root.addEventListener("pointerup", this.onUp);
    this.root.addEventListener("pointerleave", this.onUp);
  }

  disactive() {
    super.disactive();
    this.root.removeEventListener("pointerdown", this.onDown, {
      capture: true,
    });
    this.root.removeEventListener("pointerup", this.onUp);
  }
}
