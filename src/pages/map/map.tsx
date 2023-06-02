import { bind, Cell, cell, compare } from "@cmmn/cell/lib";
import {locationsStore} from "@stores";
import { Component } from "preact";
import { cellState } from "@helpers/cell-state";
import { ImageInfo } from "@stores/map.store";
import { DragHandler } from "./handlers/dragHandler";
import { ZoomHandler } from "./handlers/zoomHandler";
import styles from "./map.module.css";
import { MapElement, MapElements } from "./mapElement";
import { TransformMatrix } from "./transform/transform.matrix";
import { TargetedEvent } from "preact/compat";

export class MapComponent extends Component<MapProps> {
  @cell
  Transform = new TransformMatrix();

  @cell
  get scale() {
    return this.Transform.Matrix.GetScaleFactor();
  }

  propsCell = new Cell(this.props);
  state = cellState(this, {
    transform: () => this.Transform,
    scale: () => this.scale,
  });

  render() {
    return (
      <div
        ref={this.setHandler}
        onPointerUp={this.onClick}
        onPointerDown={(e) => {
          if (!e.defaultPrevented) {
            this.props.onSelect(null);
          }
        }}
        className={styles.container}
      >
        <img
          src={this.props.image.url}
          alt="Карта"
          className={styles.img}
          style={{
            transform: this.state.transform.ToString("css"),
            width: this.props.image.width,
            height: this.props.image.height,
          }}
        />
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
          <g
            transform={this.state.transform.ToString("svg")}
            font-size={1 / this.state.scale}
          >
            <MapElements
              selected={this.props.selected}
              onSelect={this.onSelect}
            />
          </g>
        </svg>
      </div>
    );
  }

  @bind
  private onSelect(item: MapItem) {
    this.setState({ selected: item });
    this.props.onSelect(item);
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
  setHandler = (element: HTMLDivElement) => {
    this.root = element;
    if (element) {
      this.initTransform(this.props.image, element);
      const dragHandler = new DragHandler(element);
      const zoomHandler = new ZoomHandler(element);
      this.handlers = [dragHandler, zoomHandler];
      zoomHandler.on("transform", (e) => {
        const newTransform = e.Apply(this.Transform) as TransformMatrix;
        this.setTransform(newTransform);
      });
      dragHandler.on("transform", (e) => {
        const { selected } = this.props;
        if (this.props.isMovingEnabled && selected) {
          const transform = new TransformMatrix()
            .Apply(this.Transform.Inverse())
            .Apply(e)
            .Apply(this.Transform);
          locationsStore.moveLocation(selected, transform);
        } else {
          const newTransform = e.Apply(this.Transform) as TransformMatrix;
          this.setTransform(newTransform);
        }
      });
    } else {
      this.handlers.forEach((x) => x.dispose());
    }
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
    console.log(rect);
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

  componentDidUpdate(
    prevProps: Readonly<MapProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (prevProps.image !== this.props.image && this.root) {
      this.initTransform(this.props.image, this.root);
    }
    if (this.props.selected && prevProps.selected !== this.props.selected) {
      this.scrollTo(this.props.selected);
    }
    this.propsCell.set(this.props);
  }

  componentDidMount() {
    if (this.props.selected) {
      this.scrollTo(this.props.selected);
    }
  }

  scrollTo(id: string) {
    const x = locationsStore.MapItems.find(x => x.id === id);
    const rect = this.root.getBoundingClientRect();
    const view = this.Transform.Invoke(
      Array.isArray(x.figure)
        ? x.figure.flat().reduce(
            (x, y) => ({
              X: x.X + y.X,
              Y: x.Y + y.Y,
            }),
            { X: 0, Y: 0 }
          )
        : x.figure
    );
    if (
      view.X > rect.left + rect.width / 10 &&
      view.X < rect.right - rect.width / 10 &&
      view.Y > rect.top + rect.height / 10 &&
      view.Y < rect.bottom + rect.height / 10
    ) {
      return;
    }
    const shift = {
      X: (rect.left + rect.right) / 2 - view.X,
      Y: (rect.top + rect.bottom) / 2 - view.Y,
    };
    this.Transform = TransformMatrix.Translate(shift).Apply(this.Transform);
  }

  onClick = (event: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    const rect = this.root.getBoundingClientRect();
    const p = {
      X: event.pageX - rect.left,
      Y: event.pageY - rect.top,
    };
    const point = this.Transform.Inverse().Invoke(p);
    this.props.onClick(point);
  };
}

export type MapProps = {
  selected: string;
  image: ImageInfo;
  location?: boolean;
  isMovingEnabled: boolean;
  onSelect(item);
  onClick(p: { X; Y });
};
