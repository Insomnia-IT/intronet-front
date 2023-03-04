import { cell } from "@cmmn/cell/lib";
import React from "preact/compat";
import { cellState } from "../../helpers/cell-state";
import { ImageInfo } from "../../stores/map.store";
import { DragHandler } from "./handlers/dragHandler";
import { ZoomHandler } from "./handlers/zoomHandler";
import styles from "./map.module.css";
import { MapElement } from "./mapElement";
import { TransformMatrix } from "./transform/transform.matrix";

export class MapComponent extends React.PureComponent<MapProps> {
  @cell
  Transform = new TransformMatrix();

  @cell
  get scale() {
    return this.Transform.Matrix.GetScaleFactor();
  }

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
          {this.props.items
            .filter(
              // @ts-ignore
              (x) => Number.isFinite(x.point.X) && Number.isFinite(x.point.Y)
            )
            .map((x) => (
              <MapElement
                item={x}
                key={x.id}
                selected={this.props.selected?.id === x.id}
                onSelect={(item) => {
                  this.setState({ selected: item });
                  this.props.onSelect(item);
                }}
                transform={new TransformMatrix()
                  .Apply(this.state.transform)
                  .Translate(x.point)
                  .Scale(1 / this.state.scale)
                  .ToString("svg")}
              />
            ))}
        </svg>
      </div>
    );
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
          selected.point = new TransformMatrix()
            .Apply(this.Transform.Inverse())
            .Apply(e)
            .Apply(this.Transform)
            .Invoke(selected.point);
          this.forceUpdate();
          this.props.onChange(selected);
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
    if (scale > 2 || scale < this.minScale) {
      return;
    }
    this.Transform = transform;
  }

  minScale = 1;

  initTransform(image: { width; height }, root: HTMLDivElement) {
    const rect = root.getBoundingClientRect();
    if (rect.width == 0 || rect.height == 0){
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
  }
  componentDidMount() {
    if (this.props.selected) {
      this.scrollTo(this.props.selected);
    }
  }

  scrollTo(x: MapItem) {
    const rect = this.root.getBoundingClientRect();
    const view = this.Transform.Invoke(x.point);
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

  onClick = (event: React.TargetedEvent<HTMLDivElement, MouseEvent>) => {
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
  items: MapItem[];
  selected: MapItem;
  image: ImageInfo;
  location?: boolean;
  isMovingEnabled: boolean;
  onSelect(item);
  onChange(item);
  onClick(p: { X; Y });
};
