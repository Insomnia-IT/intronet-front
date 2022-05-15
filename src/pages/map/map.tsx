import React, { useEffect, useRef } from "react";
import { MapHandler } from "./handlers/map.handler";
import { useCellState } from "../../helpers/cell-state";
import { Cell } from "cellx";
import { ImageInfo } from "../../stores/map.store";
import { TransformMatrix } from "./transform/transform.matrix";

export function MapComponent(props: MapProps) {
  const handler = new Cell<MapHandler>(null);
  const [transform] = useCellState(
    () => handler.get()?.Transform.get() ?? new TransformMatrix()
  );

  const container = useRef<HTMLDivElement>();
  useEffect(() => {
    const h = new MapHandler(container.current);
    const rect = container.current.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    const imageRatio = props.image.width / props.image.height;
    const scale =
      imageRatio < aspectRatio
        ? rect.width / props.image.width
        : rect.height / props.image.height;
    h.Transform.set(
      new TransformMatrix()
        .Translate({ X: rect.width / 2, Y: rect.height / 2 })
        .Scale(scale)
        .Translate({ X: -props.image.width / 2, Y: -props.image.height / 2 })
    );
    handler.set(h);
    return () => h.dispose();
  }, []);
  const scale = transform.Matrix.GetScaleFactor();
  return (
    <div
      ref={container}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          transform: transform.ToString("css"),
          transformOrigin: "left top",
          userSelect: "none",
          width: "100%",
          height: "100%",
          overflow: "visible",
          willChange: "transform",
        }}
      >
        <img
          src={props.image.url}
          style={{
            pointerEvents: "none",
            position: "absolute",
            maxWidth: "initial",
            userSelect: "none",
            width: props.image.width,
            height: props.image.height,
          }}
        />
        <svg
          style={{
            position: "absolute",
            zIndex: 1,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {props.items.map((x) => (
            <MapElement item={x} key={x.id} scale={scale} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export function MapElement(props: { item: MapItem; scale: number }) {
  return (
    <circle
      cx={props.item.point.x}
      cy={props.item.point.y}
      r={10 / props.scale}
      fill="red"
    ></circle>
  );
}

export type MapProps = {
  items: MapItem[];
  image: ImageInfo;
  onSelect(item);
};

export type MapItem = {
  point: { x; y };
  icon;
  id;
};
