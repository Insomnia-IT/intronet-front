import { SvgIcon } from "@icons";
import styles from "../map-element.module.css";
import { useCell } from "@helpers/cell-state";
import { Directions, locationsStore } from "@stores";
import { TransformMatrix } from "../transform/transform.matrix";
import { Cell } from "@cmmn/cell";
import { orderBy } from "@cmmn/core";
import { FigureTitle } from "./figureTitle";
import { useMemo } from "preact/hooks";
import { PointItemStore } from "./elementStore";

export function MapCircleElement(props: {
  item: MapItem;
  transformCell: Cell<TransformMatrix>;
}) {
  const store = useMemo(
    () => new PointItemStore(props.item.id, props.transformCell),
    [props.item.id, props.transformCell]
  );
  const form = useCell(() => store.form, [store]);
  const center = useCell(() => store.figure as Point, [store]);
  const color = useCell(() => store.color, [store]);
  const isRendered = useCell(() => store.isRendered, [store]);
  return (
    <circle
      hidden={!isRendered || form != "circleSmall"}
      r="3em"
      cx={center.X}
      cy={center.Y}
      fill={color}
      onClick={store.onClick}
    />
  );
}

export function ElementIcon({ store }: { store: PointItemStore }) {
  const size = "20em";
  const form = useCell(() => store.form, [store]);
  const color = useCell(() => store.color, [store]);
  return (
    <>
      <SvgIcon
        hidden={form == "circleSmall"}
        id={".map #" + form}
        style={{
          "--color": color,
        }}
        size={size}
        overflow="visible"
      />
      <ItemIcon store={store} />
    </>
  );
}
export function MapPointElement(props: {
  transformCell: Cell<TransformMatrix>;
  item: MapItem;
}) {
  const store = useMemo(
    () => new PointItemStore(props.item.id, props.transformCell),
    [props.item.id, props.transformCell]
  );
  const transform = useCell(() => store.itemTransform, [store]);
  const classNames = useCell(() => store.className, [store]);
  const isRendered = useCell(() => store.isRendered, [store]);
  return (
    <g style={{ transform, display: isRendered ? "initial" : "none" }}>
      <g className={classNames} onClick={store.onClick}>
        <ElementIcon store={store} />
      </g>
    </g>
  );
}

function ItemIcon({ store }: { store: PointItemStore }) {
  const iconId = directionsToIconId.get(store.item.directionId);
  const iconStyles = useCell(() => store.iconStyles, [store]);
  const showIcon = useCell(() => store.showIcon, [store]);
  const showText = useCell(() => store.showText);
  const size = "20em";
  return (
    <>
      <g
        style={{
          ...iconStyles,
          display: showIcon ? "initial" : "none",
        }}
      >
        <SvgIcon
          size={size}
          id={iconId}
          fill="none"
          viewBox="8 8 24 24"
          overflow="visible"
        />
      </g>
      <g
        style={{
          display: showText && showIcon ? "initial" : "none",
        }}
      >
        <ItemText item={store.item} />
      </g>
    </>
  );
}

function ItemText(props: { item: MapItem }) {
  if (props.item.isFoodcourt) {
    return (
      <text
        className={styles.elementTextFoodcourt}
        style={{
          transform: `translate(calc(12px / var(--scale)), calc(4px / var(--scale)))`,
        }}
        filter="url(#solid)"
      >
        {props.item.title}
      </text>
    );
  }
  const title = splitText(props.item.title);
  return (
    <>
      {title.map((text, i) => (
        <text
          className={styles.elementText}
          style={{
            transform: `translate(0, calc(${
              (2.5 + i * 1.2) * 13
            }px / var(--scale)))`,
          }}
          filter="url(#solid)"
        >
          {text}
        </text>
      ))}
    </>
  );
}

function splitText(text: string) {
  // TODO: try to use Segmenter
  if (text.length < 14) return [text];
  const indexes = [...text.matchAll(/[^a-zA-Zа-яёА-ЯЁ]/g)].map((x) => x.index);
  if (indexes.length == 0) return [text];
  const quotes = [text.indexOf("«"), text.indexOf("»")];
  const center = orderBy(
    quotes.length
      ? indexes.filter((x) => x <= quotes[0] || x >= quotes[1])
      : indexes,
    (x) => Math.abs(x - text.length / 2)
  )[0];

  return [text.slice(0, center).trim(), text.slice(center).trim()].map((x) =>
    x.replace(/(^\.|\.$)/, "")
  );
}

export const enum OrderType {
  MainZone = 0,
  Main = 1,
  Screens = 2,
  Info = 3,
  Cafe = 4,
  WC = 5,
  Other = 6,
  Unknown = 7,
}

export const directionsToOrder = new Map([
  ["Медпункт", OrderType.Info],
  ["КПП", OrderType.Main],
  ["Баня", OrderType.WC],
  ["Точка Сборки", OrderType.Info],
  ["Хатифнатты", OrderType.Other],
  ["Платный лагерь", OrderType.Main],
  ["Детская Поляна", OrderType.Other],
  ["Детская Площадка", OrderType.Other],
  ["Арт-объект", OrderType.Other],
  ["Мастер-Классы", OrderType.Other],
  ["Туалет", OrderType.WC],
  ["Ярмарка", OrderType.Other],
  ["Автолагерь", OrderType.MainZone],
  ["Лекторий", OrderType.Other],
  ["Фудкорт", OrderType.Cafe],
  ["Кафе", OrderType.Cafe],
  ["Ветви Дерева", OrderType.Other],
  ["Спортплощадка", OrderType.Other],
  [Directions.paidShower, OrderType.Other],
  [Directions.freeShower, OrderType.Other],
  ["Музыка", OrderType.Other],
  ["Театральная Сцена", OrderType.Other],
  ["Гостевые Кемпинги", OrderType.MainZone],
  ["Экран", OrderType.Screens],
  ["Инфоцентр", OrderType.Info],
  ["", OrderType.Other],
  ["Гостевые Кемпинги", OrderType.Main],
  ["Зона", OrderType.Other],
  ["Костер", OrderType.Other],
  ["Платные души", OrderType.Other],
  [Directions.sign, OrderType.Other],
  ["Фонтан", OrderType.Other],
  ["Анимаквест", OrderType.Other],
  ["Костер", OrderType.Cafe],
  ["Урна", OrderType.Other],
]);

export const directionsToIconId = new Map<string, MapIconId>([
  ["Медпункт", ".map #sign"],
  ["КПП", ".map #kpp"],
  ["Баня", ".map #shower"],
  ["Точка Сборки", ".map #sign"],
  ["Хатифнатты", ".map #lecture"],
  ["Платный лагерь", ".map #tent"],
  ["Детская Площадка", ".map #art"],
  ["Арт-объект", ".map #art"],
  ["Мастер-Классы", ".map #lecture"],
  ["Туалет", ".map #wc"],
  ["Ярмарка", ".map #shop"],
  ["Автолагерь", ".map #tent"],
  ["Лекторий", ".map #lecture"],
  ["Фудкорт", ".map #cafe"],
  ["Кафе", ".map #cafe"],
  ["КАФЕ", ".map #cafe"],
  ["Ветви Дерева", ".map #art"],
  ["Спортплощадка", ".map #art"],
  [Directions.paidShower, ".map #shower"],
  [Directions.freeShower, ".map #shower"],
  ["Музыка", ".map #eye"],
  ["Театральная Сцена", ".map #eye"],
  ["Гостевые Кемпинги", ".map #tent"],
  ["Экран", ".map #eye"],
  ["Инфоцентр", ".map #sign"],
  ["Гостевые Кемпинги", ".map #tent"],
  [Directions.sign, ".map #direction"],
  ["Фонтан", ".map #fountain"],
  ["Анимаквест", ".map #magnifying-glass"],
  ["Костер", ".map #fire"],
  ["Урна", ".map #recycling"],
]);

export type MapIconId =
  | ".map #sign"
  | ".map #eye"
  | ".map #tent"
  | ".map #direction"
  | ".map #wc"
  | ".map #art"
  | ".map #lecture"
  | ".map #cafe"
  | ".map #kpp"
  | ".map #shower"
  | ".map #shop"
  | ".map #fountain"
  | ".map #magnifying-glass"
  | ".map #fire"
  | ".map #recycling";

export type DetailsGroup =
  | "cafe"
  | "shop"
  | "screen"
  | "music"
  | "activity"
  | "tent"
  | "wc"
  | "art"
  | "info"
  | "point"
  | "med"
  | "other";

export const directionsToDetailsGroup: Map<string, DetailsGroup> = new Map([
  ["Медпункт", "med"],
  ["КПП", "other"],
  ["Баня", "wc"],
  ["Точка Сборки", "point"],
  ["Хатифнатты", "activity"],
  ["Платный лагерь", "tent"],
  ["Детская Поляна", "other"],
  ["Детская Площадка", "other"],
  ["Арт-объект", "art"],
  ["Мастер-Классы", "activity"],
  ["Туалет", "wc"],
  ["Ярмарка", "shop"],
  ["Автолагерь", "tent"],
  ["Лекторий", "activity"],
  ["Фудкорт", "cafe"],
  ["Кафе", "cafe"],
  // ["КАФЕ", "cafe"],
  ["Ветви Дерева", "art"],
  ["Спортплощадка", "art"],
  [Directions.paidShower, "wc"],
  [Directions.freeShower, "wc"],
  ["Музыка", "activity"],
  ["Театральная Сцена", "activity"],
  ["Гостевые Кемпинги", "tent"],
  ["Экран", "screen"],
  ["", "other"],
  ["Гостевые Кемпинги", "tent"],
  ["Зона", "other"],
  ["Костер", "other"],
  ["Платные души", "other"],
  [Directions.sign, "other"],
]);
