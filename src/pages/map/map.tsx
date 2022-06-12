import { Computed, Observable } from "cellx-decorators";
import React from "react";
import { cellState } from "../../helpers/cell-state";
import { ImageInfo } from "../../stores/map.store";
import { DragHandler } from "./handlers/dragHandler";
import { ZoomHandler } from "./handlers/zoomHandler";
import styles from "./map.module.css";
import { MapElement } from "./mapElement";
import { TransformMatrix } from "./transform/transform.matrix";

export class MapComponent extends React.PureComponent<MapProps> {
  @Observable
  Transform = new TransformMatrix();

  @Computed
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
          if (!e.nativeEvent.defaultPrevented) {
            this.props.onSelect(null);
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
                  // @ts-ignore
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
        const { selected } = this.props;
        if (this.props.isMovingEnabled && selected) {
          selected.point = new TransformMatrix()
            .Apply(this.Transform.Inverse())
            .Apply(e.data as TransformMatrix)
            .Apply(this.Transform)
            .Invoke(selected.point);
          this.forceUpdate();
          this.props.onChange(selected);
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
  selected: MapItem;
  image: ImageInfo;
  location?: boolean;
  isMovingEnabled: boolean;
  onSelect(item);
  onChange(item);
  onClick(p: { X; Y });
};
