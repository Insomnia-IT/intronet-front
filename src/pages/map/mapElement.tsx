import { useMemo } from "preact/hooks";
import { Cell } from "@cmmn/cell/lib";
import { SvgIcon } from "@icons";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { TransformMatrix } from "./transform/transform.matrix";
import { directionsToIcon, getLocationColor, IconsTypes } from "./helpers/color.helper";
import styles from "./map-element.module.css";

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
            item={ x }
            key={ x.id }
            transformCell={ props.transformCell }
            selected={ props.selected === x.id }
            onSelect={ props.onSelect }
          />
        )),
    [ items, props.onSelect, props.selected, props.transformCell ]
  );
  return <>{ children }</>;
}

export function MapElement(props: {
  transformCell: Cell<TransformMatrix>;
  item: MapItem;
  selected: boolean;
  onSelect(x: MapItem);
}) {
  const type = directionsToIcon.get(props.item.directionId);
  const scale = useCell(() => props.transformCell.get().Matrix.GetScaleFactor(), [ props.transformCell ]);
  const color = getLocationColor(type);
  const form = (() => {
    switch (type) {
      case IconsTypes.Info:
      case IconsTypes.Screens:
        return 'star';
      default:
        return 'circle';
    }
  })();
  const size = (() => {
    switch (type) {

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
    switch (type) {
      case IconsTypes.MainZone:
      case IconsTypes.Main:
      case IconsTypes.Screens:
      case IconsTypes.Info:
        return true;
      default:
        return scale > .6;
    }
  })();
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
        class={ styles.zone }
        d={ props.item.figure
          .map((line) => "M" + line.map((p) => `${ p.X } ${ p.Y }`).join("L"))
          .join(" ") }
      />
    );
  }
  return (
    <g transform={ `translate(${ props.item.figure.X } ${ props.item.figure.Y })` }>
      <g
        className={ classNames.join(" ") }
        onClick={ (e) => {
          e.preventDefault();
          props.onSelect(props.item);
        } }
      >
        { icon }
        { showText && <text y="2.5em" filter="url(#solid)">
          { props.item.directionId && props.item.title }
        </text> }
      </g>
    </g>
  );
}

