import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { geoConverter } from "@helpers/geo";
import styles from "../map-element.module.css";
import { PointItemStore } from "./elementStore";
import { useCell } from "@helpers/cell-state";
export type FigureTitleProps = {
  store: PointItemStore;
};
export function FigureTitle({ store }: FigureTitleProps) {
  const showText = true; //useCell(() => store.showText);
  const isSelected = useCell(() => store.isSelected);

  const center = useMemo(
    () => geoConverter.getCenter(store.figure),
    [store.item.id]
  );
  return (
    <g onClick={store.onClick}>
      {showText && (
        <text
          x={center.X}
          y={center.Y}
          class={isSelected ? styles.zoneSelectedText : styles.zoneText}
          alignment-baseline="middle"
          style={{
            fontSize: "calc(10px / var(--scale))",
          }}
          filter="url(#solid)"
          text-anchor="middle"
        >
          {store.item.title}
        </text>
      )}
    </g>
  );
}
