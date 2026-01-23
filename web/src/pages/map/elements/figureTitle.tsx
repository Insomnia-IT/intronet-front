import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { geoConverter } from "@helpers/geo";
import styles from "../map-element.module.css";
import { PointItemStore } from "./elementStore";
import { useCell } from "@helpers/cell-state";
export type FigureTitleProps = {
  store: PointItemStore;
};
export function FigureTitle({ store }: FigureTitleProps) {
  const showText = useCell(() => store.showText);
  const scale = useCell(() => store.scale);
  const isSelected = useCell(() => store.isSelected);
  const [rect, setRect] = useState<{ width: number; height: number }>(null);
  const ref = useRef<SVGTextElement>();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const bbox = ref.current.getBBox();
    setRect({
      width: bbox.width * scale + 10,
      height: bbox.height * scale * 1.2,
    });
  }, [ref.current]);
  const center = useMemo(
    () => geoConverter.getCenter(store.figure),
    [store.item.id]
  );
  return (
    <g onClick={store.onClick}>
      {rect && showText && (
        <rect
          x={center.X - rect.width / 2 / scale}
          width={rect.width / scale}
          class={isSelected ? styles.zoneSelectedRect : styles.zoneRect}
          rx={rect.height / 2 / scale}
          height={rect.height / scale}
          y={center.Y - rect.height / 2 / scale}
        />
      )}
      {showText && (
        <text
          x={center.X}
          ref={ref}
          y={center.Y}
          class={isSelected ? styles.zoneSelectedText : styles.zoneText}
          alignment-baseline="middle"
          font-size={10 / scale}
          text-anchor="middle"
        >
          {store.item.title}
        </text>
      )}
    </g>
  );
}
