import { Cell } from "@cmmn/cell";
import { TransformMatrix } from "../transform/transform.matrix";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { Figure } from "./figure";
import {
  directionsToOrder,
  MapCircleElement,
  MapPointElement,
} from "./mapElement";
import { orderBy } from "@cmmn/core";

export function MapElements(props: { transformCell: Cell<TransformMatrix> }) {
  const figures = useCell(() =>
    locationsStore.MapItems.filter((x) => x.isFigure).map((x) => (
      <Figure item={x} />
    ))
  );
  const other = useCell(() =>
    orderBy(
      locationsStore.MapItems.filter((x) => !x.isFigure),
      (x) => (x.priority ? 50 : -(directionsToOrder.get(x.directionId) ?? -10))
    ).map((x) => (
      <MapPointElement
        item={x}
        key={x.id}
        transformCell={props.transformCell}
      />
    ))
  );
  const selected = useCell(() =>
    locationsStore.SelectedMapItems.map((x) => (
      <MapPointElement
        item={x}
        key={x.id}
        transformCell={props.transformCell}
      />
    ))
  );
  return (
    <>
      <g>{figures}</g>
      <g>{other}</g>
      <g>{selected}</g>
    </>
  );
}
