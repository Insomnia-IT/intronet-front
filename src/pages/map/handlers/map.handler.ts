import { TransformMatrix } from "../transform/transform.matrix";
import { Cell } from "cellx";
import { DragHandler } from "./dragHandler";
import { ZoomHandler } from "./zoomHandler";
import { Observable } from "cellx-decorators";

export class MapHandler {
  constructor(public root: HTMLDivElement) {}

  public Transform = new Cell<TransformMatrix>(new TransformMatrix());

  private Handlers = [
    new DragHandler(this.root, this.Transform),
    new ZoomHandler(this.root, this.Transform),
  ];

  dispose() {
    this.Handlers.forEach((x) => x.dispose());
  }

  init(image: { width; height }) {
    const rect = this.root.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    const imageRatio = image.width / image.height;
    const scale =
      imageRatio < aspectRatio
        ? rect.width / image.width
        : rect.height / image.height;
    this.Transform.set(
      new TransformMatrix()
        .Translate({ X: rect.width / 2, Y: rect.height / 2 })
        .Scale(scale)
        .Translate({
          X: -image.width / 2,
          Y: -image.height / 2,
        })
    );
    console.log(rect, image, this.Transform.get());
  }
}
