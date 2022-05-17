import React from "react";
import { MapHandler } from "./handlers/map.handler";
import { cellState } from "../../helpers/cell-state";
import { ImageInfo } from "../../stores/map.store";
import { TransformMatrix } from "./transform/transform.matrix";
import { MapElement } from "./mapElement";
import styles from "./map.module.css";
import { Computed, Observable } from "cellx-decorators";

export class MapComponent extends React.PureComponent<MapProps> {
  @Observable
  handler: MapHandler;

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
          {this.props.items.map((x) => (
            <MapElement
              item={x}
              key={x.id}
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

  onClick = (event) => {
    const rect = this.handler.root.getBoundingClientRect();
    const p = { X: event.pageX - rect.left, Y: event.pageY - rect.top };
    const point = this.transform.Inverse().Invoke(p);
    for (let item of this.props.items) {
      const dist = item.radius / this.scale;
      if (Math.abs(item.point.x - point.X) > dist) continue;
      if (Math.abs(item.point.y - point.Y) > dist) continue;
      this.props.onSelect(item);
      break;
    }
  };
}

export type MapProps = {
  items: MapItem[];
  image: ImageInfo;
  location?: boolean;
  onSelect(item);
};
