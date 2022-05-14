import {TransformMatrix} from "../transform/transform.matrix";
import {Cell} from "cellx";

export class MapHandler {
  constructor(private root: HTMLDivElement) {

  }

  public Transform = new Cell<TransformMatrix>(new TransformMatrix());

  private Handlers = [
    new DragHandler(this.root, this.Transform),
  ];

  dispose() {
    this.Handlers.forEach(x => x.dispose());
  }
}

export class DragHandler {
  constructor(private root: HTMLDivElement, private transform: Cell<TransformMatrix, any>) {
    root.addEventListener('pointerdown', this.onDown);
    root.addEventListener('pointerup', this.onUp);
  }

  onDown = (event: PointerEvent) => {
    this.root.setPointerCapture(event.pointerId);
    this.root.addEventListener('pointermove', this.onMove);
  }
  onUp = (event: PointerEvent) => {
    this.root.removeEventListener('pointermove', this.onMove);
    this.root.releasePointerCapture(event.pointerId);
  }
  onMove = (event: PointerEvent) => {
    this.transform.set(this.transform.get()
      .Translate({X: event.movementX, Y: event.movementY}))
  }

  dispose() {
    this.root.removeEventListener('pointerdown', this.onDown);
    this.root.removeEventListener('pointerup', this.onUp);
  }
}
