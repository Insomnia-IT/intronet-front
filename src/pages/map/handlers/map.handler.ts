import { TransformMatrix } from "../transform/transform.matrix";
import { Cell } from "cellx";
import { DragHandler } from "./dragHandler";
import { ZoomHandler } from "./zoomHandler";

export class MapHandler {
  constructor(private root: HTMLDivElement) {}

  public Transform = new Cell<TransformMatrix>(new TransformMatrix());

  private Handlers = [
    new DragHandler(this.root, this.Transform),
    new ZoomHandler(this.root, this.Transform),
  ];

  dispose() {
    this.Handlers.forEach((x) => x.dispose());
  }
}
