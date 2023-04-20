import { Cell } from "@cmmn/cell/lib";

export class GestureCell extends Cell<
  | {
      path: EventTarget[];
      direction: "x" | "y";
      shift: number;
    }
  | undefined
> {
  constructor() {
    super(undefined);
  }

  private shift: { x: number; y: number } = undefined;
  private path: EventTarget[] | undefined;

  private onDown = (e: PointerEvent) => {
    this.shift = { x: 0, y: 0 };
    this.path = e.composedPath();
    document.body.addEventListener("pointermove", this.onMove, {
      passive: true,
    });
  };
  private onMove = (e: PointerEvent) => {
    if (!this.shift) return;
    this.shift.x += e.movementX;
    this.shift.y += e.movementY;
    if (Math.abs(this.shift.x) > 2 || Math.abs(this.shift.y) > 2) {
      document.body.setPointerCapture(e.pointerId);
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
    document.body.releasePointerCapture(e.pointerId);
    document.body.removeEventListener("pointermove", this.onMove);
    this.set(undefined);
  };

  active() {
    super.active();
    document.body.addEventListener("pointerdown", this.onDown, {
      capture: true,
    });
    document.body.addEventListener("pointerup", this.onUp);
  }

  disactive() {
    super.disactive();
    document.body.removeEventListener("pointerdown", this.onDown, {
      capture: true,
    });
    document.body.removeEventListener("pointerup", this.onUp);
  }
}
export const Gesture = new GestureCell();
