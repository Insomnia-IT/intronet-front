import { Cell } from "@cmmn/cell";
import { TransformMatrix } from "../transform/transform.matrix";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { useMemo } from "preact/hooks";
import { Figure } from "./figure";
import { orderBy } from "@cmmn/core";
import { directionsToOrder, MapPointElement } from "./mapElement";

export function MapFigures() {
  const items = useCell(() => locationsStore.MapItems);
  return (
    <>
      {items
        .filter((x) => x.isFigure)
        .map((x) => (
          <Figure item={x} />
        ))}
    </>
  );
}

export function MapPointElements(props: {
  transformCell: Cell<TransformMatrix>;
}) {
  const items = useCell(() => locationsStore.MapItems);
  const selectedItems = useCell(() =>
    locationsStore.selected.map((x) => x._id)
  );

  const rotation = useCell(
    () => (-props.transformCell.get().Matrix.GetRotation() * 180) / Math.PI,
    [props.transformCell]
  );
  const children = useMemo(
    () =>
      orderBy(items, (x) =>
        selectedItems.includes(x.id)
          ? 100
          : x.isFigure
          ? -100
          : x.priority
          ? 50
          : -(directionsToOrder.get(x.directionId) ?? -10)
      ).map((x) => (
        <MapPointElement
          item={x}
          key={x.id}
          transformCell={props.transformCell}
        />
      )),
    [items, props.transformCell]
  );
  return <g transform={`rotate(${rotation})`}>{children}</g>;
}
