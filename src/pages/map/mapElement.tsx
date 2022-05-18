import React from "react";
import { MapItem } from "./map";
import { MapIcons } from "./icons/icons";

export function MapElement(props: { item: MapItem; transform: string }) {
  const icon = props.item.icon ? (
    MapIcons[props.item.icon]
  ) : (
    <circle r={props.item.radius} fill="red"></circle>
  );
  return (
    <g transform={props.transform}>
      {icon}
      <text textAnchor="middle" y={props.item.radius * 2.5}>
        {props.item.title}
      </text>
    </g>
  );
}
