import React from "react";
import { MapHandler } from "./handlers/map.handler";
import { cellState } from "../../helpers/cell-state";
import { ImageInfo } from "../../stores/map.store";
import { TransformMatrix } from "./transform/transform.matrix";
import { MapElement } from "./mapElement";
import styles from "./map.module.css";
import { Computed, Observable } from "cellx-decorators";
import { IPoint } from "./transform/matrix";
import { LocationFull } from "../../stores/locations.store";
import { ObservableList } from "cellx-collections";

export class MapComponent extends React.PureComponent<MapProps> {
  @Observable
  handler: MapHandler;

  @Observable
  Hovered = new ObservableList<MapItem>();

  @Computed
  get transform() {
    return this.handler?.Transform.get() ?? new TransformMatrix();
  }

  @Computed
  get scale() {
    return this.transform.Matrix.GetScaleFactor();
  }

  state = cellState(this, {
    transform: () => this.transform,
    scale: () => this.scale,
  });

  render() {
    return (
      <div
        ref={this.setHandler}
        onClick={this.onClick}
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
              (x) => Number.isFinite(x.point.x) && Number.isFinite(x.point.y)
            )
            .map((x) => (
              <MapElement
                item={x}
                key={x.id}
                onHover={(item) =>
                  item ? this.Hovered.add(x) : this.Hovered.remove(x)
                }
                transform={new TransformMatrix()
                  .Apply(this.state.transform)
                  .Translate({ X: x.point.x, Y: x.point.y })
                  .Scale(1 / this.state.scale)
                  .ToString("svg")}
              />
            ))}
        </svg>
      </div>
    );
  }

  setHandler = (element) => {
    if (element) {
      this.handler = new MapHandler(element);
      this.handler.init(this.props.image);
    } else {
      this.handler.dispose();
    }
  };

  componentDidUpdate(
    prevProps: Readonly<MapProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (prevProps.image != this.props.image) {
      this.handler?.init(this.props.image);
    }
  }

  onClick = (event: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => {
    if (this.Hovered.length) {
      this.props.onSelect(this.Hovered.get(0));
    }
    const rect = this.handler.root.getBoundingClientRect();
    const p = {
      X: event.nativeEvent.pageX - rect.left,
      Y: event.nativeEvent.pageY - rect.top,
    };
    const point = this.transform.Inverse().Invoke(p);
    this.props.onClick({ x: point.X, y: point.Y });
  };
}

export type MapProps = {
  items: MapItem[];
  image: ImageInfo;
  location?: boolean;
  onSelect(item);
  onClick(p: { x; y });
};

export type MapItem = {
  point: { x; y };
  icon;
  radius;
  id;
  title?: string;
  location?: LocationFull;
};
