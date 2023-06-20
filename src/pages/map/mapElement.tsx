import { SvgIcon } from "@icons";
import { useMemo } from "preact/hooks";
import styles from "./map-element.module.css";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { TransformMatrix } from "./transform/transform.matrix";
import { Cell } from "@cmmn/cell/lib";

export function MapElements(props: {
  transformCell: Cell<TransformMatrix>;
  selected: string | undefined;
  onSelect(x: MapItem);
}) {
  const items = useCell(() => locationsStore.MapItems);
  const children = useMemo(
    () =>
      items
        .orderBy((x) =>
          Array.isArray(x.figure) ? -10 : -directionsToOrder.get(x.directionId)
        )
        .map((x) => (
          <MapElement
            item={x}
            key={x.id}
            transformCell={props.transformCell}
            selected={props.selected === x.id}
            onSelect={props.onSelect}
          />
        )),
    [items, props.onSelect, props.selected, props.transformCell]
  );
  return <>{children}</>;
}

export function MapElement(props: {
  transformCell: Cell<TransformMatrix>;
  item: MapItem;
  selected: boolean;
  onSelect(x: MapItem);
}) {
  const type = directionsToOrder.get(props.item.directionId);
  const scale = useCell(
    () => props.transformCell.get().Matrix.GetScaleFactor(),
    [props.transformCell]
  );
  const color = (() => {
    switch (type) {
      case OrderType.Info:
        return "#1C2973";
      case OrderType.Screens:
        return "#536BF3";
      case OrderType.Cafe:
        return "#60D67A";
      case OrderType.WC:
        return "#45D2F1";
      case OrderType.Other:
        return "#FE4BA9";
      default:
        return "black";
    }
  })();
  const form = (() => {
    switch (type) {
      case OrderType.Info:
      case OrderType.Screens:
        return "star";
      default:
        return "circle";
    }
  })();
  const scaleThreshold = 0.6;
  const size = (() => {
    switch (type) {
      case OrderType.MainZone:
      case OrderType.Main:
      case OrderType.Screens:
      case OrderType.Info:
        return "20em";
      default:
        return scale > scaleThreshold || props.selected ? "20em" : "4em";
    }
  })();
  const showText = (() => {
    switch (type) {
      case OrderType.MainZone:
      case OrderType.Main:
      case OrderType.Screens:
      case OrderType.Info:
        return true;
      default:
        return scale > scaleThreshold || props.selected;
    }
  })();
  const shape = (
    <SvgIcon
      id={".map #" + form}
      style={{
        "--color": color,
        transition: ".3s ease",
      }}
      size={size}
      overflow="visible"
    />
  );
  const iconId = "#" + directionsToIconId.get(props.item.directionId);
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
        onClick={(e) => {
          e.preventDefault();
          props.onSelect(props.item);
        }}
      >
        {shape}
        {showText && (
          <>
            <g
              style={{
                transform:
                  form == "star" && props.selected
                    ? `translate(1em, -12em) scale(1.5)`
                    : undefined,
              }}
            >
              <SvgIcon
                size={size}
                id={iconId}
                fill="none"
                viewBox="8 8 24 24"
                overflow="visible"
                style={{
                  color: "var(--cold-white)",
                }}
              />
            </g>
            <text y="2.5em" filter="url(#solid)">
              {props.item.directionId && props.item.title}
            </text>
          </>
        )}
      </g>
    </g>
  );
}

const enum OrderType {
  MainZone = 0,
  Main = 1,
  Screens = 2,
  Info = 3,
  Cafe = 4,
  WC = 5,
  Other = 6,
  Unknown = 7,
}

const directionsToOrder = new Map([
  ["Медпункт (Медицинская Служба)", OrderType.Info],
  ["КПП", OrderType.Main],
  ["Баня", OrderType.WC],
  [
    "Точка Сборки (Место Встречи И Помощь В Поиске Потерянных Люде",
    OrderType.Info,
  ],
  ["Детская Площадка", OrderType.Other],
  ["", OrderType.Other],
  ["Мастер-Классы", OrderType.Other],
  ["Туалет", OrderType.WC],
  ["Ярмарка", OrderType.Other],
  ["Автолагерь", OrderType.MainZone],
  ["Лекторий", OrderType.Other],
  ["Фудкорт", OrderType.Cafe],
  ["Кафе", OrderType.Cafe],
  ["КАФЕ", OrderType.Cafe],
  ["Ветви Дерева", OrderType.Other],
  ["Спортплощадка", OrderType.Other],
  ["Души", OrderType.WC],
  ["Музыкальная Сцена", OrderType.Other],
  ["Театральная Сцена", OrderType.Other],
  ["Гостевые Кемпинги", OrderType.MainZone],
  ["Экран", OrderType.Screens],
  ["Инфоцентр", OrderType.Info],
]);

const directionsToIconId = new Map<string, MapIconId>([
  ["Медпункт (Медицинская Служба)", "sign"],
  ["КПП", "kpp"],
  ["Баня", "wc"],
  ["Точка Сборки (Место Встречи И Помощь В Поиске Потерянных Люде", "sign"],
  ["Детская Площадка", "art"],
  ["", "art"],
  ["Мастер-Классы", "lecture"],
  ["Туалет", "wc"],
  ["Ярмарка", "shop"],
  ["Автолагерь", ""],
  ["Лекторий", "lecture"],
  ["Фудкорт", "cafe"],
  ["Кафе", "cafe"],
  ["КАФЕ", "cafe"],
  ["Ветви Дерева", "art"],
  ["Спортплощадка", "art"],
  ["Души", "wc"],
  ["Музыкальная Сцена", "eye"],
  ["Театральная Сцена", "eye"],
  ["Гостевые Кемпинги", ""],
  ["Экран", "eye"],
  ["Инфоцентр", "sign"],
]);

export type MapIconId =
  | "sign"
  | "eye"
  | ""
  | "wc"
  | "art"
  | "lecture"
  | "cafe"
  | "kpp"
  | "shop";
