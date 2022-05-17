import React from "react";
import { MapItem } from "./map";

export function MapElement(props: { item: MapItem; transform: string }) {
  return (
    <g transform={props.transform}>
      <circle r={props.item.radius} fill="red"></circle>
      <text x={props.item.radius} y={-props.item.radius}>
        {props.item.title}
      </text>
    </g>
  );
}
