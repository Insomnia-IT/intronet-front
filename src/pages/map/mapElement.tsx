import React from "react";
import { MapItem } from "./map";
import { MapIcons } from "./icons/icons";
import styles from "./map-element.module.css";

export function MapElement(props: {
  item: MapItem;
  transform: string;
  onHover(x: MapItem);
}) {
  const icon = props.item.icon ? (
    MapIcons[props.item.icon]
  ) : (
    <circle r={props.item.radius} fill="red"></circle>
  );
  const onEnter = React.useCallback(
    (e: React.SyntheticEvent<SVGGElement, PointerEvent>) => {
      props.onHover(props.item);
    },
    []
  );
  const onLeave = React.useCallback(
    (e: React.SyntheticEvent<SVGGElement, PointerEvent>) => {
      props.onHover(null);
    },
    []
  );
  return (
    <g transform={props.transform}>
      <g
        className={styles.element}
        onPointerEnter={onEnter}
        onPointerOut={onLeave}
      >
        {icon}
        <text textAnchor="middle" y={props.item.radius * 2.5}>
          {props.item.title}
        </text>
      </g>
    </g>
  );
}
