import { bind } from "@cmmn/core";
import { RequireAuth } from "@components/RequireAuth";
import { cellState } from "@helpers/cell-state";
import { geoConverter } from "@helpers/geo";
import { locationsStore } from "@stores";
import { Component } from "preact";
import { TransformEmitter } from "./handlers/transformEmitter";
import styles from "./map.module.css";
import { TransformMatrix } from "./transform/transform.matrix";
import { UserLocation } from "./user-location";
import { cell, Cell } from "@cmmn/cell";
import { MapElements } from "./elements/mapElements";

/**
 * Интерактивная SVG-карта: пан/зум через {@link TransformEmitter}, состояние трансформа
 * хранится в `localStorage` под ключом `transform` (см. сеттер `Transform`).
 */
export class MapComponent extends Component<{
  onLongTap(geo: Geo): void;
}> {
  constructor() {
    super();
    this.updTransform();
  }

  private transformCache: string;
  @bind
  private updTransform() {
    if (this.transformElement) {
      const transform = this.Transform.ToString("svg");
      if (this.transformCache !== transform) {
        this.transformElement.style.transform = this.transformCache = transform;
        this.transformElement.style.setProperty(
          "--rotation",
          this.Transform.Matrix.GetRotation().toString()
        );
        this.transformElement.style.setProperty(
          "--scale",
          this.Transform.Matrix.GetScaleFactor().toString()
        );
      }
    }
    requestAnimationFrame(this.updTransform);
  }

  TransformCell = new Cell(new TransformMatrix());
  get Transform() {
    return this.TransformCell.get();
  }
  set Transform(value: TransformMatrix) {
    localStorage.setItem("transform", JSON.stringify(value.ToJSON()));
    this.TransformCell.set(value);
  }

  get Scale() {
    return this.Transform.Matrix.GetScaleFactor();
  }

  state = cellState(this, {
    scale: this.Scale,
  });

  mouseDown: MouseEvent | undefined;
  render() {
    return (
      <div
        ref={this.setHandler}
        onPointerDown={(e) => (this.mouseDown = e)}
        onPointerUp={(e) => {
          if (Math.abs(this.mouseDown.pageX - e.pageX) > 3) return;
          if (Math.abs(this.mouseDown.pageY - e.pageY) > 3) return;
          if (!e.defaultPrevented) {
            locationsStore.setSelectedId(null);
          }
        }}
        className={styles.container}
      >
        <svg className={styles.svg}>
          <defs>
            <filter x="0" y="0" width="1" height="1" id="solid">
              <feMorphology
                in="SourceAlpha"
                operator="erode"
                radius="0.12"
                result="erodedAlpha"
              />
              <feComposite in="SourceGraphic" in2="erodedAlpha" operator="in" />
            </filter>
          </defs>
          <g
            aria-label="transform"
            style={{
              fontSize: "calc(1px/var(--scale))",
            }}
          >
            <MapElements transformCell={this.TransformCell} />
            <RequireAuth>
              <UserLocation transformCell={this.TransformCell} />
            </RequireAuth>
          </g>
        </svg>
      </div>
    );
  }

  //region Handlers
  private root: HTMLDivElement;
  private handler: TransformEmitter;
  private transformElement: SVGGElement;
  onTransform = (e: TransformMatrix) => {
    const newTransform = e.Apply(this.Transform) as TransformMatrix;
    this.setTransform(newTransform);
    if (locationsStore.isMoving && locationsStore.selected.length == 1) {
      const transform = new TransformMatrix()
        .Apply(this.Transform.Inverse())
        .Apply(e)
        .Apply(this.Transform);
      locationsStore.moveSelectedLocation(transform); //TransformMatrix.Translate(shift));
    }
  };
  setHandler = (element: HTMLDivElement) => {
    this.root = element;
    this.transformElement = this.root?.querySelector(
      '[aria-label="transform"]'
    ) as SVGGElement;
    if (!element) {
      this.handler?.dispose();
      return;
    }
    fetch("/public/images/map.svg")
      .then((x) => x.text())
      .then((text) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.innerHTML = text;
        this.transformElement.prepend(g);
      });
    this.initTransform(
      {
        width: 9728,
        height: 6144,
      },
      element
    );
    this.handler = new TransformEmitter(element);
    this.handler.on("transform", this.onTransform);
    this.handler.on("longtap", this.onLongTap);
  };

  @bind
  onLongTap(center: Point) {
    const geo = geoConverter.toGeo(
      this.Transform.Inverse().Invoke(center)
    ) as Geo;
    this.props.onLongTap?.(geo);
  }

  /**
   * Применяет новую матрицу трансформа с ограничением минимального/максимального масштаба.
   */
  setTransform(transform: TransformMatrix) {
    const scale = transform.Matrix.GetScaleFactor();
    if (scale > 3 || scale < this.minScale * 0.98) {
      return;
    }
    this.Transform = transform;
  }

  minScale = 1;
  private readonly imageSize = { width: 9728, height: 6144 };

  /**
   * Сброс пользовательского вида: удаляет сохранённый `transform` и заново инициализирует
   * камеру под текущий размер контейнера (удобно после долгого панорамирования или смены окна).
   */
  public resetView() {
    if (!this.root) return;
    localStorage.removeItem("transform");
    this.initTransform(this.imageSize, this.root);
  }

  /**
   * Первичная настройка: `minScale` под вписывание изображения в `root`, затем либо
   * восстановление из `localStorage`, либо стартовая позиция по центру.
   */
  initTransform(image: { width; height }, root: HTMLDivElement) {
    const rect = root.getBoundingClientRect();
    if (rect.width == 0 || rect.height == 0) {
      rect.width = window.innerWidth;
      rect.height = window.innerHeight;
    }
    const aspectRatio = rect.width / rect.height;
    const imageRatio = image.width / image.height;
    this.minScale =
      imageRatio < aspectRatio
        ? rect.width / image.width
        : rect.height / image.height;
    const saved = localStorage.getItem("transform");
    if (saved) {
      this.Transform = TransformMatrix.FromJSON(JSON.parse(saved));
    } else {
      this.Transform = new TransformMatrix()
        .Translate({ X: rect.width * -0.1, Y: rect.height / 2 })
        .Scale(this.minScale)
        .Translate({
          X: -image.width / 2,
          Y: -image.height / 2,
        });
    }
  }

  //endregion

  componentDidMount() {
    if (locationsStore.selected.length) {
      this.scrollTo(locationsStore.selected.map((x) => x._id));
    }
    return Cell.OnChange(
      () => locationsStore.selected,
      (e) => {
        e.value && this.scrollTo(e.value.map((x) => x._id));
      }
    );
  }

  currentIds: string[];
  scrollTo(ids: string[]) {
    if (!this.root || !ids.length) return;
    if (this.currentIds?.every((x, i) => x == ids[i])) return;
    const centers = ids
      .map((x) => locationsStore.MapItems.find((i) => i.id == x))
      .map((x) => geoConverter.getCenter(x.figure));
    const rect = this.root.getBoundingClientRect();
    const view = this.Transform.Invoke(geoConverter.getCenter([centers]));
    const shift = {
      X: (rect.left + rect.right) / 2 - view.X,
      Y: (rect.bottom - rect.top) / 4 - view.Y,
    };

    this.Transform = TransformMatrix.Translate(shift).Apply(this.Transform);
  }

  // onClick = (event: TargetedEvent<HTMLDivElement, MouseEvent>) => {
  //   const rect = this.root.getBoundingClientRect();
  //   const p = {
  //     X: event.pageX - rect.left,
  //     Y: event.pageY - rect.top,
  //   };
  //   const point = this.Transform.Inverse().Invoke(p);
  //   this.props.onClick(point);
  // };
}
