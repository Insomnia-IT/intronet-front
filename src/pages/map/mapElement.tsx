import React, { useState } from "react";
import styles from "./map-element.module.css";
import { useCellState } from "../../helpers/cell-state";
import { directionsStore } from "../../stores";
import { getIconByDirectionId } from "./icons/icons";
import { Flex } from "@chakra-ui/react";
import mapElementStyles from "./map-element.module.css";

export function MapElement(props: {
  item: MapItem;
  transform: string;
  selected: boolean;
  onSelect(x: MapItem);
}) {
  const icon = props.item.icon ?? (
    <>
      <circle r={15} fill="transparent" stroke="transparent"></circle>
    </>
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
        <text textAnchor="middle" y="25" fontSize="10px">
          {props.item.icon && props.item.title}
        </text>
      </g>
    </g>
  );
}

// временно, для дебага иконок направлений
export function DirectionsPage() {
  const [directions] = useCellState(() => directionsStore.Directions.toArray());
  const [selected, setSelected] = useState<number>(null);
  return (
    <Flex wrap="wrap">
      {directions.map((x) => (
        <svg
          className={
            styles.element + " " + (selected === x.id ? styles.selected : "")
          }
          style={{ width: 60, height: 80 }}
          viewBox="-20 -20 40 40"
          onClick={() => {
            setSelected(x.id);
          }}
          key={x.id}
        >
          {getIconByDirectionId(x.id)}
          <circle r={0} cx={0} cy={0} fill={"red"} />
          <text fontSize={8} textAnchor="middle" y="18">
            {x.name}
          </text>
          <text fontSize={8} textAnchor="middle" y="-18">
            {x.id}
          </text>
        </svg>
      ))}
    </Flex>
  );
}
