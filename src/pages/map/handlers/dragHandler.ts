import { Cell } from "cellx";
import { TransformMatrix } from "../transform/transform.matrix";

export class DragHandler {
  constructor(
    private root: HTMLDivElement,
    private transform: Cell<TransformMatrix, any>
  ) {
    root.addEventListener("pointerdown", this.onDown);
    root.addEventListener("pointerup", this.onUp);
  }

  onDown = (event: PointerEvent) => {
    this.root.setPointerCapture(event.pointerId);
    this.root.addEventListener("pointermove", this.onMove);
  };
  onUp = (event: PointerEvent) => {
    console.log("up", event);
    this.root.removeEventListener("pointermove", this.onMove);
    this.root.releasePointerCapture(event.pointerId);
  };
  onMove = (event: PointerEvent) => {
    console.log(event);
    this.transform.set(
      this.transform.get().Translate({ X: event.movementX, Y: event.movementY })
    );
  };

  dispose() {
    this.root.removeEventListener("pointerdown", this.onDown);
    this.root.removeEventListener("pointerup", this.onUp);
  }
}
