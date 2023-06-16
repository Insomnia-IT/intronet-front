import {SvgIcon} from "@icons";
import { useMemo } from "preact/hooks";
import styles from "./map-element.module.css";
import { useCell } from "@helpers/cell-state";
import {locationsStore} from "@stores";
import {TransformMatrix} from "./transform/transform.matrix";
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
        .orderBy((x) => (Array.isArray(x.figure) ? -1 : 1))
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
  const type = directionsToIcon.get(props.item.directionId);
  const scale = useCell(() => props.transformCell.get().Matrix.GetScaleFactor(), [props.transformCell]);
  const color = (() => {
    switch (type){
      case IconsTypes.Info:
        return '#1C2973';
      case IconsTypes.Screens:
        return '#536BF3';
      case IconsTypes.Cafe:
        return '#60D67A';
      case IconsTypes.WC:
        return '#45D2F1';
      case IconsTypes.Other:
        return '#FE4BA9';
      default:
        return 'black'
    }
  })();
  const form = (() => {
    switch (type){
      case IconsTypes.Info:
      case IconsTypes.Screens:
        return 'star';
      default:
        return 'circle';
    }
  })();
  const size = (() => {
    switch (type){

      case IconsTypes.MainZone:
      case IconsTypes.Main:
      case IconsTypes.Screens:
      case IconsTypes.Info:
        return '20em';
      default:
        return scale > .6 ? '20em' : '4em';
    }
  })();
  const showText = (() => {
    switch (type){
      case IconsTypes.MainZone:
      case IconsTypes.Main:
      case IconsTypes.Screens:
      case IconsTypes.Info:
        return true;
      default:
        return scale > .6;
    }
  })();
  console.log(scale)
  const icon = <SvgIcon id={".map #" + form} style={{
    '--color': color,
    'transition': '.3s ease'
  }}
                        size={size} overflow="visible" />;
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
        {icon}
        {showText && <text y="2.5em" filter="url(#solid)">
          {props.item.directionId && props.item.title}
        </text>}
      </g>
    </g>
  );
}


enum IconsTypes {
  MainZone = "MainZone",
  Main = "Main",
  Screens = "Screens",
  Info = "Info",
  Cafe = "Cafe",
  WC = "WC",
  Other = "Other",
  Unknown = "Unknown",
}

const directionsToIcon = new Map([
  ["Медпункт (Медицинская Служба)", IconsTypes.Info],
  ["КПП", IconsTypes.Main],
  ["Баня", IconsTypes.WC],
  [
    "Точка Сборки (Место Встречи И Помощь В Поиске Потерянных Люде",
    IconsTypes.Info,
  ],
  ["Детская Площадка", IconsTypes.Other],
  ["", IconsTypes.Other],
  ["Мастер-Классы", IconsTypes.Other],
  ["Туалет", IconsTypes.WC],
  ["Ярмарка", IconsTypes.Other],
  ["Автолагерь", IconsTypes.MainZone],
  ["Лекторий", IconsTypes.Other],
  ["Фудкорт", IconsTypes.Cafe],
  ["Кафе", IconsTypes.Cafe],
  ["КАФЕ", IconsTypes.Cafe],
  ["Ветви Дерева", IconsTypes.Other],
  ["Спортплощадка", IconsTypes.Other],
  ["Души", IconsTypes.WC],
  ["Музыкальная Сцена", IconsTypes.Other],
  ["Театральная Сцена", IconsTypes.Other],
  ["Гостевые Кемпинги", IconsTypes.MainZone],
  ["Экран", IconsTypes.Screens],
  ["Инфоцентр", IconsTypes.Info],
]);
