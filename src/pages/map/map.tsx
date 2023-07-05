import { bind, Cell, cell } from "@cmmn/cell/lib";
import {cellState} from "@helpers/cell-state";
import { locationsStore } from "@stores";
import fetch from "node-fetch";
import { Component } from "preact";
import { DragHandler } from "./handlers/dragHandler";
import { ZoomHandler } from "./handlers/zoomHandler";
import styles from "./map.module.css";
import { MapElements } from "./mapElement";
import { TransformMatrix } from "./transform/transform.matrix";

export class MapComponent extends Component {
  constructor() {
    super();
    this.updTransform();
  }

  private transformCache: string;
  private fontSizeCache: string;
  @bind
  private updTransform() {
    if (this.transformElement) {
      const transform = this.Transform.ToString("svg");
      const fontSize = (1 / this.Scale).toString() + "px";
      if (this.transformCache !== transform)
        this.transformElement.style.transform = (this.transformCache = transform);
      if (this.fontSizeCache !== fontSize)
        this.transformElement.setAttribute("font-size", (this.fontSizeCache = fontSize));
    }
    requestAnimationFrame(this.updTransform);
  }

  TransformCell = new Cell(new TransformMatrix());
  get Transform(){
    return this.TransformCell.get();
  }
  set Transform(value: TransformMatrix){
    this.TransformCell.set(value);
  }

  get Scale(){
    return this.Transform.Matrix.GetScaleFactor();
  }

  state = cellState(this, {
    scale: this.Scale,
  });

  render() {
    return (
      <div
        ref={this.setHandler}
        onClick={(e) => {
          if (!e.defaultPrevented && !locationsStore.isMoving) {
            locationsStore.setSelectedId(null)
          }
        }}
        className={styles.container}
      >
        <svg className={styles.svg}>
          <defs>
            <filter x="0" y="0" width="1" height="1" id="solid">
              <feFlood flood-color="var(--cold-white)" result="bg" />
              <feMerge>
                <feMergeNode in="bg" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g aria-label="transform" style={{
            transition: `transform .1s ease`
          }}>
            <MapElements transformCell={this.TransformCell} />
          </g>
        </svg>
      </div>
    );
  }

  @bind
  private arrayToPath(figure: Array<Array<Point>>, map: (p: Point) => Point) {
    return figure
      .map(
        (line) =>
          "M" +
          line
            .map(map)
            .map((p) => `${p.X} ${p.Y}`)
            .join("L")
      )
      .join(" ");
  }

  //region Handlers
  private root: HTMLDivElement;
  private handlers: (DragHandler | ZoomHandler)[];
  private transformElement: SVGGElement;
  onTransform = (e: TransformMatrix) => {
    const newTransform = e.Apply(this.Transform) as TransformMatrix;
    this.setTransform(newTransform);
    if (locationsStore.isMoving && locationsStore.selected) {
      const transform = new TransformMatrix()
        .Apply(this.Transform.Inverse())
        .Apply(e)
        .Apply(this.Transform);
      locationsStore.moveSelectedLocation(transform.Inverse());
    }
  }
  setHandler = (element: HTMLDivElement) => {
    this.root = element;
    this.transformElement = this.root?.querySelector('[aria-label="transform"]') as SVGGElement;
    if (!element) {
      this.handlers.forEach((x) => x.dispose());
      return;
    }
    fetch('/public/images/map.svg').then(x => x.text()).then(text => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.innerHTML = text;
      this.transformElement.prepend(g);
    })
    this.initTransform({
      width: 9728,
      height: 6144,
    }, element);
    const dragHandler = new DragHandler(element);
    const zoomHandler = new ZoomHandler(element);
    this.handlers = [dragHandler, zoomHandler];
    zoomHandler.on("transform", this.onTransform);
    dragHandler.on("transform", this.onTransform);
  };

  setTransform(transform: TransformMatrix) {
    const scale = transform.Matrix.GetScaleFactor();
    if (scale > 2.2 || scale < this.minScale * 0.98) {
      return;
    }
    this.Transform = transform;
  }

  minScale = 1;

  initTransform(image: { width; height }, root: HTMLDivElement) {
    const rect = root.getBoundingClientRect();
    if (rect.width == 0 || rect.height == 0) {
      rect.width = window.innerWidth;
      rect.height = window.innerHeight;
    }
    const aspectRatio = rect.width / rect.height;
    const imageRatio = image.width / image.height;
    this.minScale =
      imageRatio < aspectRatio
        ? rect.width / image.width
        : rect.height / image.height;
    this.Transform = new TransformMatrix()
      .Translate({ X: rect.width / 2, Y: rect.height / 2 })
      .Scale(this.minScale)
      .Translate({
        X: -image.width / 2,
        Y: -image.height / 2,
      });
  }

  //endregion

  componentDidMount() {
    if (locationsStore.selected) {
      this.scrollTo(locationsStore.selected._id);
    }
    return Cell.OnChange(() => locationsStore.selected, e => {
      e.value && this.scrollTo(e.value._id)
    })
  }

  getCenter(figure: Figure): Point{
    if (!Array.isArray(figure))
      return figure;
    const flat = figure.flat();
    if (flat.length == 0)
      return {X: 0, Y: 0};
    const length = flat.length;
    const sum = (a: Point, b: Point) => ({
      X: (a.X + b.X),
      Y: (a.Y + b.Y),
    });
    return flat.map(p => ({X: p.X / length, Y: p.Y / length})).reduce(sum);
  }
  scrollTo(id: string) {
    const x = locationsStore.MapItems.find((x) => x.id === id);
    const rect = this.root.getBoundingClientRect();
    const view = this.Transform.Invoke(this.getCenter(x.figure));
    // if (
    //   view.X > rect.left + rect.width / 100 &&
    //   view.X < rect.right - rect.width / 100 &&
    //   view.Y > rect.top + rect.height / 100 &&
    //   view.Y < rect.bottom + rect.height / 100
    // ) {
    //   return;
    // }
    const shift = {
      X: (rect.left + rect.right) / 2 - view.X,
      Y: (rect.top * 3 + rect.bottom) / 4 - view.Y,
    };
    this.Transform = TransformMatrix.Translate(shift).Apply(this.Transform);
  }

  // onClick = (event: TargetedEvent<HTMLDivElement, MouseEvent>) => {
  //   const rect = this.root.getBoundingClientRect();
  //   const p = {
  //     X: event.pageX - rect.left,
  //     Y: event.pageY - rect.top,
  //   };
  //   const point = this.Transform.Inverse().Invoke(p);
  //   this.props.onClick(point);
  // };
}

