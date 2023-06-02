import { useMemo, useState } from "preact/hooks";
import styles from "./map-element.module.css";
import { useCell } from "@helpers/cell-state";
import {directionsStore, locationsStore} from "@stores";
import { MapIcon } from "./icons/map-icons";

export function MapElements(props: {
  selected: string | undefined;
  onSelect(x: MapItem);
}) {
  const items = useCell(() => locationsStore.MapItems);
  const children = useMemo(
    () =>
      items
        .orderBy((x) => (Array.isArray(x.figure) ? -1 : 1))
        .map((x) => (
          <MapElement
            item={x}
            key={x.id}
            selected={props.selected === x.id}
            onSelect={props.onSelect}
          />
        )),
    [items, props.onSelect, props.selected]
  );
  return <>{children}</>;
}

export function MapElement(props: {
  item: MapItem;
  selected: boolean;
  onSelect(x: MapItem);
}) {
  const icon = <MapIcon id={props.item.directionId} />;
  const classNames = [styles.element];
  if (props.selected) {
    classNames.push(styles.selected);
  }
  if (Array.isArray(props.item.figure)) {
    return (
      <path
        class={styles.zone}
        d={props.item.figure
          .map((line) => "M" + line.map((p) => `${p.X} ${p.Y}`).join("L"))
          .join(" ")}
      />
    );
  }
  return (
    <g transform={`translate(${props.item.figure.X} ${props.item.figure.Y})`}>
      <g
        className={classNames.join(" ")}
        onPointerDown={(e) => {
          e.preventDefault();
          props.onSelect(props.item);
        }}
      >
        {icon}
        <text y="2em" filter="url(#solid)">
          {props.item.directionId && props.item.title}
        </text>
      </g>
    </g>
  );
}

// временно, для дебага иконок направлений
export function DirectionsPage() {
  const directions = useCell(() => directionsStore.Directions.toArray());
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div flex column>
      {directions.map((x) => (
        <svg
          className={
            styles.element + " " + (selected === x._id ? styles.selected : "")
          }
          style={{ width: 100, height: 80 }}
          viewBox="-30 -30 60 60"
          onClick={() => {
            setSelected(x._id);
          }}
          key={x._id}
        >
          <MapIcon id={x._id} />
          <circle r={0} cx={0} cy={0} fill={"red"} />
          <text fontSize={8} textAnchor="middle" y="18">
            {x.name}
          </text>
          <text fontSize={8} textAnchor="middle" y="-18">
            {x._id}
          </text>
        </svg>
      ))}
    </div>
  );
}
