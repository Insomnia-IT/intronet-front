import React from "react";
import { cellState } from "../../helpers/cell-state";
import { ImageInfo } from "../../stores/map.store";
import { TransformMatrix } from "./transform/transform.matrix";
import { MapElement } from "./mapElement";
import styles from "./map.module.css";
import { Computed, Observable } from "cellx-decorators";
import { LocationFull } from "../../stores/locations.store";
import { ObservableList } from "cellx-collections";
import { DragHandler } from "./handlers/dragHandler";
import { ZoomHandler } from "./handlers/zoomHandler";

export class MapComponent extends React.PureComponent<MapProps> {
  @Observable
  Selected = new ObservableList<MapItem>();

  @Observable
  Transform = new TransformMatrix();

  @Computed
  get scale() {
    return this.Transform.Matrix.GetScaleFactor();
  }

  state = cellState(this, {
    transform: () => this.Transform,
    selected: () => this.Selected.toArray(),
    scale: () => this.scale,
  });

  render() {
    return (
      <div
        ref={this.setHandler}
        onPointerUp={this.onClick}
        onPointerDown={(e) => {
          if (!e.nativeEvent.defaultPrevented) {
            this.Selected.clear();
          }
        }}
        className={styles.container}
      >
        <img
          src={this.props.image.url}
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
              (x) => Number.isFinite(x.point.X) && Number.isFinite(x.point.Y)
            )
            .map((x) => (
              <MapElement
                item={x}
                key={x.id}
                selected={this.state.selected.includes(x)}
                onSelect={(item) => {
                  if (!this.Selected.contains(item)) {
                    this.Selected.add(item);
                  }
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
  setHandler = (element) => {
    this.root = element;
    if (element) {
      this.initTransform(this.props.image, element);
      const dragHandler = new DragHandler(element);
      const zoomHandler = new ZoomHandler(element);
      this.handlers = [dragHandler, zoomHandler];
      zoomHandler.on("transform", (e) => {
        this.Transform = e.data.Apply(this.Transform);
      });
      dragHandler.on("transform", (e) => {
        if (this.Selected.length) {
          for (let mapItem of this.Selected) {
            mapItem.point = new TransformMatrix()
              .Apply(this.Transform.Inverse())
              .Apply(e.data as TransformMatrix)
              .Apply(this.Transform)
              .Invoke(mapItem.point);
          }
          this.Selected.emit("change");
        } else {
          this.Transform = e.data.Apply(this.Transform);
        }
      });
    } else {
      this.handlers.forEach((x) => x.dispose());
    }
  };
  initTransform(image: { width; height }, root: HTMLDivElement) {
    const rect = root.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    const imageRatio = image.width / image.height;
    const scale =
      imageRatio < aspectRatio
        ? rect.width / image.width
        : rect.height / image.height;
    this.Transform = new TransformMatrix()
      .Translate({ X: rect.width / 2, Y: rect.height / 2 })
      .Scale(scale)
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
    if (prevProps.image != this.props.image && this.root) {
      this.initTransform(this.props.image, this.root);
    }
  }

  onClick = (event: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => {
    const rect = this.root.getBoundingClientRect();
    const p = {
      X: event.nativeEvent.pageX - rect.left,
      Y: event.nativeEvent.pageY - rect.top,
    };
    const point = this.Transform.Inverse().Invoke(p);
    this.props.onClick(point);
  };
}

export type MapProps = {
  items: MapItem[];
  image: ImageInfo;
  location?: boolean;
  isMovingEnabled: boolean;
  onSelect(item);
  onClick(p: { X; Y });
};

export type MapItem = {
  point: { X; Y };
  icon;
  radius;
  id;
  title?: string;
  location?: LocationFull;
};
