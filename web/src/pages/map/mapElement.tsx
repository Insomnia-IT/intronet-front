import { geoConverter } from "@helpers/geo";
import { SvgIcon } from "@icons";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import styles from "./map-element.module.css";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { TransformMatrix } from "./transform/transform.matrix";
import { Cell } from "@cmmn/cell";
import {orderBy} from "@cmmn/core";

export function MapElements(props: { transformCell: Cell<TransformMatrix> }) {
  const items = useCell(() => locationsStore.MapItems);
  const selectedItems = useCell(() => locationsStore.selected.map(x => x._id));
  const children = useMemo(
    () => orderBy(items, (x) =>
      selectedItems.includes(x.id) ? 100 : (
          Array.isArray(x.figure) ? -100 : -(directionsToOrder.get(x.directionId) ?? -10)
      )
        )
        .map((x) => (
          <MapElement item={x} key={x.id} transformCell={props.transformCell} />
        )),
    [items, props.transformCell]
  );
  return <>{children}</>;
}
const scaleThresholdOther = 0.4;
const scaleThresholdCafe = 0.2;

export function MapElement(props: {
  transformCell: Cell<TransformMatrix>;
  item: MapItem;
}) {
  const isSelected = useCell(() =>
    locationsStore.selected.some((x) => x._id == props.item.id)
  );
  const type = directionsToOrder.get(props.item.directionId);
  const scale = useCell(
    () => props.transformCell.get().Matrix.GetScaleFactor(),
    [props.transformCell]
  );
  const color = (() => {
    switch (type) {
      case OrderType.Main:
      case OrderType.Info:
        return "var(--medium-blue)";
      case OrderType.Screens:
        return "var(--electric-blues)";
      case OrderType.Cafe:
        return "var(--yummy-green)";
      case OrderType.WC:
        return "var(--calm-blue)";
      case OrderType.Other:
        return "var(--cyber-disco)";
      default:
        return "black";
    }
  })();
  // if (color === "black")
  //   console.log(props.item);
  const form = (() => {
    switch (type) {
      case OrderType.Info:
      case OrderType.Screens:
        return "star";
      case OrderType.MainZone:
      case OrderType.Main:
        return "circle";
      case OrderType.Cafe:
        return scale > scaleThresholdCafe || isSelected ? "circle" : "circleSmall";
      case OrderType.Other:
        return scale > scaleThresholdOther || isSelected ? "circle" : "circleSmall";
      case OrderType.WC:
      default:
        return isSelected ? "circle" : "circleSmall"
    }
  })();
  const size = "20em";
  const showText = (() => {
    switch (type) {
      case OrderType.MainZone:
      case OrderType.Main:
      case OrderType.Screens:
      case OrderType.Info:
        return true;
      case OrderType.Cafe:
        return scale > scaleThresholdCafe || isSelected;
      case OrderType.Other:
        return scale > scaleThresholdOther || isSelected;
      case OrderType.WC:
      default:
        return isSelected;
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
  const iconId = directionsToIconId.get(props.item.directionId);
  const classNames = [styles.element];
  if (isSelected) {
    classNames.push(styles.selected);
  }
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
  if (props.item.maxZoom && scale > props.item.maxZoom) return <></>;
  if (props.item.minZoom && scale <= props.item.minZoom) return <></>;
  if (Array.isArray(props.item.figure)) {
    if (Array.isArray(props.item.figure[0])) {
      const center = geoConverter.getCenter(props.item.figure);
      return (
        <g onClick={(e) => {
          e.preventDefault();
          locationsStore.setSelectedId(props.item.id);
        }}>
          <path
            id={props.item.id}
            class={isSelected ? styles.zoneSelected : styles.zone}
            d={props.item.figure
              .map((line) => "M" + line.map((p) => `${p.X} ${p.Y}`).join("L"))
              .join(" ")}
          />
          {rect && (
            <rect
              x={center.X - rect.width / 2 / scale}
              width={rect.width / scale}
              class={isSelected ? styles.zoneSelectedRect : styles.zoneRect}
              rx={rect.height / 2 / scale}
              height={rect.height / scale}
              y={center.Y - rect.height / 2 / scale}
            />
          )}
          <text
            x={center.X}
            ref={ref}
            y={center.Y}
            class={isSelected ? styles.zoneSelectedText : styles.zoneText}
            alignment-baseline="middle"
            font-size={10 / scale}
            text-anchor="middle"
          >
            {props.item.title}
          </text>
        </g>
      );
    }
    return <></>;
    // return (
    //   <path
    //     class={ styles.road }
    //     onClick={ (e) => {
    //       e.preventDefault();
    //       locationsStore.setSelectedId(props.item.id);
    //     } }
    //     d={ "M" + props.item.figure.map((p) => `${ p.X } ${ p.Y }`).join("L")}
    //   />
    // );
  }
  return (
    <g
      transform={`translate(${props.item.figure?.X} ${props.item.figure?.Y})`}
      style={{
        transition: `transform .1s ease`,
      }}
    >
      <g
        className={classNames.join(" ")}
        onClick={(e) => {
          e.preventDefault();
          locationsStore.setSelectedId(props.item.id);
        }}
      >
        {shape}
        {showText && (
          <>
            <g
              style={{
                transform:
                  form == "star" && isSelected
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
              />
            </g>
            <text className={styles.elementText } y="2.5em" filter="url(#solid)">
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
  ["Души", OrderType.WC],
  ["Музыкальная Сцена", OrderType.Other],
  ["Театральная Сцена", OrderType.Other],
  ["Гостевые Кемпинги", OrderType.MainZone],
  ["Экран", OrderType.Screens],
  ["Инфоцентр", OrderType.Info],
  ["", OrderType.Other],
  ["Гостевые Кемпинги", OrderType.Main],
  ["Зона", OrderType.Other],
  ["Костер", OrderType.Other],
  ["Платные души", OrderType.Other],
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
  ["Души", ".map #shower"],
  ["Музыкальная Сцена", ".map #eye"],
  ["Театральная Сцена", ".map #eye"],
  ["Гостевые Кемпинги", ".map #tent"],
  ["Экран", ".map #eye"],
  ["Инфоцентр", ".map #sign"],
  ["Гостевые Кемпинги", ".map #tent"],
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
  | ".map #shop";

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
  ["Души", "wc"],
  ["Музыкальная Сцена", "activity"],
  ["Театральная Сцена", "activity"],
  ["Гостевые Кемпинги", "tent"],
  ["Экран", "screen"],
  ["", "other"],
  ["Гостевые Кемпинги", "tent"],
  ["Зона", "other"],
  ["Костер", "other"],
  ["Платные души", "other"],
]);
