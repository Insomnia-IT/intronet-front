import { Cell } from "cellx";
import { TransformMatrix } from "../transform/transform.matrix";

export class DragHandler {
  constructor(
    private root: HTMLDivElement,
    private transform: Cell<TransformMatrix, any>
  ) {
    this.root.style.touchAction = "none";
    this.root.addEventListener("pointerdown", this.onDown);
    this.root.addEventListener("pointerup", this.onUp);
  }

  onDown = (event: PointerEvent) => {
    this.root.setPointerCapture(event.pointerId);
    this.root.addEventListener("pointermove", this.onMove);
  };
  onUp = (event: PointerEvent) => {
    this.root.removeEventListener("pointermove", this.onMove);
    this.root.releasePointerCapture(event.pointerId);
  };
  onMove = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    this.transform.set(
      new TransformMatrix()
        .Translate({ X: event.movementX, Y: event.movementY })
        .Apply(this.transform.get())
    );
  };

  dispose() {
    this.root.removeEventListener("pointerdown", this.onDown);
    this.root.removeEventListener("pointerup", this.onUp);
  }
}
