import { TransformMatrix } from "../transform/transform.matrix";
import { DragHandler } from "./dragHandler";
import { ZoomHandler } from "./zoomHandler";
import { EventEmitter } from "@cmmn/cell/lib";

export class MapHandler extends EventEmitter<{
  transform: TransformMatrix
}> {
  constructor(public root: HTMLDivElement) {
    super();
  }

  private Handlers = [new DragHandler(this.root), new ZoomHandler(this.root)];

  dispose() {
    this.Handlers.forEach((x) => x.dispose());
    super.dispose();
  }

  init(image: { width; height }) {
    for (let handler of this.Handlers) {
      handler.on("transform", (t) => this.emit("transform", t));
    }
    const rect = this.root.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    const imageRatio = image.width / image.height;
    const scale =
      imageRatio < aspectRatio
        ? rect.width / image.width
        : rect.height / image.height;
    return new TransformMatrix()
      .Translate({ X: rect.width / 2, Y: rect.height / 2 })
      .Scale(scale)
      .Translate({
        X: -image.width / 2,
        Y: -image.height / 2,
      });
  }
}
