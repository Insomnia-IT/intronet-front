import { locationsStore } from "@stores";
import { Cell, cell } from "@cmmn/cell";
import { TransformMatrix } from "../transform/transform.matrix";
import { geoConverter } from "@helpers/geo";
import styles from "../map-element.module.css";
import { directionsToOrder, OrderType } from "./mapElement";

export class ElementStore {
  constructor(private id: string) {}

  @cell
  get item() {
    return locationsStore.MapItems.find((x) => x.id == this.id);
  }

  @cell
  get figure() {
    return this.item.figure;
  }
  @cell
  get isSelected() {
    return locationsStore.selected.some((x) => x._id == this.id);
  }

  get showText() {
    if (locationsStore.selected.length > 1 && !this.isSelected) return false;
    if (this.item.priority) return true;
    return this.isSelected;
  }

  onClick = (e: MouseEvent) => {
    e.preventDefault();
    locationsStore.setSelectedId(this.id);
  };
}

enum Threshold {
  None = 0,
  Cafe = 1,
  CafeText = 2,
  Other = 3,
  OtherText = 4,
}

export class PointItemStore extends ElementStore {
  constructor(id: string, private transform: Cell<TransformMatrix>) {
    super(id);
  }
  @cell
  get scale() {
    return this.transform.get().Matrix.GetScaleFactor();
  }

  @cell
  get threshold() {
    if (this.scale > 0.5) return Threshold.OtherText;
    if (this.scale > 0.4) return Threshold.Other;
    if (this.scale > 0.33) return Threshold.CafeText;
    if (this.scale > 0.25) return Threshold.Cafe;
    return Threshold.None;
  }

  @cell
  get center() {
    if (!this.figure) return undefined;
    return geoConverter.getCenter(this.figure);
  }

  @cell
  get itemTransform() {
    return `translate(${this.center.X}px, ${this.center.Y}px)`;
  }

  @cell
  get viewPoint() {
    return this.transform.get().Invoke(this.center);
  }

  @cell
  get isInViewPort() {
    return (
      this.viewPoint.X > -window.innerWidth / 2 &&
      this.viewPoint.X < window.innerWidth * 1.5 &&
      this.viewPoint.Y > -window.innerHeight / 2 &&
      this.viewPoint.Y < window.innerHeight * 1.5
    );
  }

  @cell
  get className() {
    const classNames = [styles.element];
    if (this.isSelected) {
      classNames.push(styles.selected);
    }
    return classNames.join(" ");
  }
  @cell
  get isRendered() {
    if (!this.figure) return false;
    if (Array.isArray(this.figure) && !Array.isArray(this.figure[0]))
      return false;
    if (this.item.maxZoom && this.scale > this.item.maxZoom) return false;
    if (this.item.minZoom && this.scale <= this.item.minZoom) return false;
    return this.isInViewPort;
  }

  @cell
  get type() {
    return directionsToOrder.get(this.item.directionId);
  }
  get color() {
    switch (this.type) {
      case OrderType.MainZone:
      case OrderType.Main:
        return "var(--mineral)";
      case OrderType.Info:
        return "var(--yellow)";
      case OrderType.Screens:
        return "var(--vivid)";
      case OrderType.Cafe:
        return "var(--vivid)";
      case OrderType.WC:
        return "var(--purple)";
      case OrderType.Other:
        return "var(--mineral)";
      default:
        return "black";
    }
  }

  @cell
  get form() {
    if (locationsStore.selected.length > 1 && !this.isSelected)
      return "circleSmall";
    switch (this.type) {
      case OrderType.Info:
      case OrderType.Screens:
        return "star";
      case OrderType.MainZone:
      case OrderType.Main:
      case OrderType.Cafe:
        return this.item.priority ||
          this.isSelected ||
          this.threshold >= Threshold.Cafe
          ? "circle"
          : "circleSmall";
      case OrderType.Other:
      case OrderType.WC:
        return this.isSelected || this.threshold >= Threshold.Other
          ? "circle"
          : "circleSmall";
      default:
        return this.isSelected ? "circle" : "circleSmall";
    }
  }
  @cell
  get showIcon() {
    return this.form != "circleSmall";
  }

  @cell
  get iconStyles() {
    if (this.form == "star" && this.isSelected)
      return { transform: `translate(1em, -12em) scale(1.5)` };
    return undefined;
  }

  @cell
  get showText() {
    switch (this.type) {
      case OrderType.Main:
      case OrderType.Screens:
      case OrderType.Info:
      case OrderType.Cafe:
        return this.threshold >= Threshold.CafeText || this.isSelected;
      case OrderType.Other:
        return this.threshold >= Threshold.OtherText || this.isSelected;
      case OrderType.WC:
        return this.threshold >= Threshold.OtherText || this.isSelected;
      default:
        return false;
    }
  }
}

export class FigureStore extends ElementStore {
  @cell
  get center() {
    return geoConverter.getCenter(this.figure);
  }

  @cell
  get isLine() {
    return !Array.isArray(this.figure[0]);
  }

  @cell
  get path() {
    return (this.figure as Array<Array<Point>>)
      .map((line) => "M" + line.map((p) => `${p.X} ${p.Y}`).join("L"))
      .join(" ");
  }
}
