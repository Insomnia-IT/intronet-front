import React from "react";
import { MapItem } from "./map";
import { MapIcons } from "./icons/icons";
import styles from "./map-element.module.css";

export function MapElement(props: {
  item: MapItem;
  transform: string;
  selected: boolean;
  onSelect(x: MapItem);
}) {
  const icon = props.item.icon ? (
    MapIcons[props.item.icon]
  ) : (
    <circle r={15} fill="red"></circle>
  );
  const classNames = [styles.element];
  if (props.selected) {
    classNames.push(styles.selected);
  }
  return (
    <g transform={props.transform}>
      <g
        className={classNames.join(" ")}
        onPointerDown={(e) => {
          e.nativeEvent.preventDefault();
          props.onSelect(props.item);
        }}
      >
        {icon}
        <text textAnchor="middle" y={25}>
          {props.item.title}
        </text>
      </g>
    </g>
  );
}
