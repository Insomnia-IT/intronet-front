import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { geoConverter } from "@helpers/geo";
import styles from "../map-element.module.css";
import { useMemo, useState } from "preact/hooks";
import { FigureStore } from "./elementStore";

export function Figure(props: { item: MapItem }) {
  const store = useMemo(() => new FigureStore(props.item.id), [props.item.id]);
  const path = useCell(() => store.path, [store]);
  const isSelected = useCell(() => store.isSelected, [store]);
  const isLine = useCell(() => store.isLine, [store]);
  if (isLine) return <></>;
  return (
    <g onClick={store.onClick}>
      <path
        id={props.item.id}
        class={isSelected ? styles.zoneSelected : styles.zone}
        d={path}
      />
    </g>
  );
}
