import { cell, ObservableList, Cell } from "@cmmn/cell";
import { geoConverter } from "../helpers/geo";
import { TransformMatrix } from "../pages/map/transform/transform.matrix";
import { goTo, RoutePath, routerCell } from "../pages/routing";
import { activitiesStore } from "./activities";
import { changesStore } from "./changes.store";
import { moviesStore } from "./movies.store";
import { ObservableDB } from "./observableDB";
import { bookmarksStore } from "./bookmarks.store";
import { distinct, Fn, orderBy } from "@cmmn/core";

class LocationsStore {
  @cell db = new ObservableDB<InsomniaLocation>("locations");

  Loading = this.db.isLoaded;
  @cell public isEdit = false;
  @cell public isMoving = false;
  @cell public newLocation: InsomniaLocation;

  @cell
  public get selected(): InsomniaLocation[] {
    return distinct(
      this.selectedInternal.map((x) => {
        if (!Array.isArray(x.figure)) return x;
        const same = this.Locations.find(
          (y) => y.mapName == x.mapName && !Array.isArray(y.figure)
        );
        return same ?? x;
      })
    );
  }
  private get selectedInternal(): InsomniaLocation[] {
    const router = routerCell.get();
    if (router.route[1])
      return [this.Locations.find((x) => x._id === router.route[1])].filter(
        (x) => x
      );
    if (router.query.direction)
      return this.findByDirection(decodeURIComponent(router.query.direction));
    if (router.query.name)
      return [this.findByName(decodeURIComponent(router.query.name))].filter(
        (x) => x
      );
    if (router.query.tag)
      return this.findByTag(decodeURIComponent(router.query.tag));
    return [];
  }

  findByTag(s: string) {
    return this.Locations.filter((x) =>
      x.work_tags?.some((t) => t?.toLowerCase().includes(s.toLowerCase()))
    );
  }
  findByName(s: string) {
    return (
      this.Locations.find((x) => x.name?.toLowerCase() == s.toLowerCase()) ??
      this.Locations.find((x) =>
        x.name?.toLowerCase().includes(s.toLowerCase())
      )
    );
  }
  findByDirection(s: string) {
    return this.Locations.filter(
      (x) => x.directionId?.toLowerCase() == s.toLowerCase()
    );
  }
  public setSelectedId(id: string | null) {
    goTo(["map", id].filter((x) => x) as RoutePath, {}, true);
  }

  @cell
  private get RealLocations(): ReadonlyArray<InsomniaLocation> {
    return this.db
      .toArray()
      .map((x) => x as InsomniaLocation)
      .filter((x) => x.figure)
      .concat(this.newLocation ? [this.newLocation] : [])
      .map((x) => changesStore.withChanges(x, x._id));
  }
  @cell
  public get Locations(): ReadonlyArray<InsomniaLocation> {
    return this.RealLocations.concat(
      this.VirtualCafe.filter((x) => !this.db.get(x._id))
    );
  }

  @cell
  public get LocationsForActivity(): ReadonlyArray<InsomniaLocation> {
    return this.Locations.filter(
      ({ name, directionId }) =>
        !!name &&
        ![
          "Зона",
          "КПП",
          "Кафе",
          "Админка",
          "Гостевые Кемпинги",
          "Платный лагерь",
          "Автолагерь",
          "Платные души",
          "Указатель",
        ].includes(directionId)
    );
  }

  @cell
  public get ScreenLocations(): ReadonlyArray<InsomniaLocation> {
    return ["Полевой", "Речной", "Детский"]
      .map((x) => this.findByName(x))
      .filter((x) => x && x.directionId == Directions.screen);
  }

  @cell
  public get ActivityLocations(): ReadonlyArray<InsomniaLocation> {
    const locationsIDs = Array.from(
      new Set(
        activitiesStore.Activities.reduce<string[]>(
          (locationIds, activity) => [...locationIds, activity.locationId],
          []
        )
      )
    );

    return this.RealLocations.filter(
      ({ _id, name }) => locationsIDs.includes(_id) && !!name
    );
  }

  @cell
  public get Infocenter(): InsomniaLocation {
    return this.RealLocations.find((x) => x.directionId === Directions.info);
  }
  @cell
  public get Shops(): InsomniaLocation {
    return this.RealLocations.find((x) => x.name.toLowerCase() === "ярмарка");
  }
  @cell
  public get Foodcourt(): InsomniaLocation {
    return this.RealLocations.find((x) => x.name.toLowerCase() === "фудкорт");
  }
  @cell
  public get VirtualCafe(): Array<InsomniaLocation> {
    const patches = new Map(this.locationPatches.toArray());
    const foodcourt = this.Foodcourt;
    if (!foodcourt) return [];
    const point = (patches.get(foodcourt._id) ??
      geoConverter.fromGeo(foodcourt.figure as Geo)) as Point;
    const size = 56;
    const foodCourtLocations = this.db.toArray().filter((x) => x.isFoodcourt);
    return foodCourtLocations.map((x, i) => {
      const shift = TransformMatrix.Rotate(-1.6).Invoke(getFoodcourtShift(i));
      return {
        minZoom: 1.6,
        _id: foodcourt._id + i.toString(),
        name: x.name,
        directionId: Directions.cafe,
        contentBlocks: x.contentBlocks,
        description: x.description,
        menu: x.menu,
        figure: geoConverter.toGeo({
          X: point.X + shift.X * size,
          Y: point.Y - shift.Y * size,
        }),
      } as InsomniaLocation;
    });
  }
  // @cell
  // public get VirtualShops(): Array<MapItem> {
  //   const patches = new Map(this.locationPatches.toArray());
  //   const shopsCenter = this.Shops;
  //   if (!shopsCenter) return [];
  //   const point = (patches.get(shopsCenter._id) ?? geoConverter.fromGeo(shopsCenter.figure as Geo)) as Point;
  //   const shops = shopsStore.shops;
  //   const sqrt = Math.ceil(Math.sqrt(shops.length));
  //   const size = 14;
  //   return shops.map((x,i) => ({
  //     minZoom: 1.6,
  //     id: x._id,
  //     title: x.name,
  //     directionId: Directions.shop,
  //     figure: {
  //       X: point.X + ((i % sqrt) - sqrt/2) * size,
  //       Y: point.Y - ((i / sqrt) - sqrt/2) * size,
  //     },
  //   } as MapItem))
  // }

  public get MapItems(): MapItem[] {
    const patches = new Map(this.locationPatches.toArray());
    return orderBy(this.Locations, (x) =>
      Array.isArray(x.figure) ? -1 : 1
    ).map(
      (x) =>
        ({
          figure: patches.get(x._id) ?? geoConverter.fromGeo(x.figure as Geo),
          directionId: x.directionId,
          title: x.name,
          id: x._id,
          radius: 10,
          priority: x.priority,
          maxZoom: x._id == this.Foodcourt._id ? 1.6 : x.maxZoom,
          minZoom: x.minZoom,
        } as MapItem)
    );
  }

  async addLocation(location: InsomniaLocation) {
    await this.Loading;
    await this.db.addOrUpdate(location);
  }

  async updateLocation(x: InsomniaLocation) {
    await this.Loading;
    await this.db.addOrUpdate(x);
    if (this.newLocation) this.newLocation = null;
  }

  async deleteLocation(location: InsomniaLocation | InsomniaLocation) {
    if (this.selected.some((x) => x._id === location._id))
      this.setSelectedId(null);
    await this.Loading;
    await this.db.remove(location._id);
  }

  public getName(locationId: string) {
    const location = this.db.get(locationId);
    if (!location) return undefined;
    return location.name;
  }

  @cell private locationPatches = new ObservableList<
    [id: string, figure: Figure]
  >();

  public moveSelectedLocation(transform: TransformMatrix) {
    if (this.selected.length !== 1) return;
    const selected = this.MapItems.find((x) => x.id === this.selected[0]._id);
    const moved = Array.isArray(selected.figure)
      ? selected.figure.map((line) => line.map(transform.Invoke))
      : transform.Invoke(selected.figure);
    this.locationPatches.push([selected.id, moved]);
  }

  async applyChanges() {
    const patches = new Map(this.locationPatches.toArray());
    this.locationPatches.clear();
    for (let [id, figure] of patches) {
      await this.db.addOrUpdate({
        ...this.db.get(id),
        figure: geoConverter.toGeo(figure),
      });
    }
    this.isMoving = false;
  }

  discardChanges() {
    this.locationPatches.clear();
    this.setSelectedId(null);
    this.newLocation = null;
  }

  startAddLocation() {
    this.newLocation = {
      _id: Fn.ulid(),
      figure: center,
      name: "Новая локация",
      directionId: Directions.wc,
      contentBlocks: [],
    } as InsomniaLocation;
    this.setSelectedId(this.newLocation._id);
    this.isMoving = true;
    this.isEdit = true;
  }
}

export const locationsStore = new LocationsStore();

export enum Directions {
  medical = "Медпункт",
  kpp = "КПП",
  bath = "Баня",
  tochka = "Точка Сборки",
  hatifnati = "Хатифнатты",
  paid = "Платный лагерь",
  children = "Детская Поляна",
  childrenPlace = "Детская Площадка",
  art = "Арт-объект",
  master = "Мастер-Классы",
  wc = "Туалет",
  shop = "Ярмарка",
  auto = "Автолагерь",
  lectures = "Лекторий",
  foodcourt = "Фудкорт",
  cafe = "Кафе",
  cafe2 = "КАФЕ",
  branches = "Ветви Дерева",
  sport = "Спортплощадка",
  paidShower = "Платные души",
  freeShower = "Бесплатные души",
  music = "Музыка",
  theater = "Театральная Сцена",
  guest = "Гостевые Кемпинги",
  screen = "Экран",
  info = "Инфоцентр",
  sign = "Указатель",
}

export class LocationStore {
  constructor(private id: string) {}

  @cell get location() {
    return locationsStore.Locations.find(
      (location) => location._id === this.id
    );
  }

  public state = new Cell<{
    location: InsomniaLocation;
    currentActivity: string | undefined;
    hasBookmark: boolean;
    timetable: "animation" | "activity" | undefined;
  }>(() => {
    const timetable =
      this.location?.directionId === Directions.screen
        ? "animation"
        : activitiesStore.Activities.some((x) => x.locationId === this.id)
        ? "activity"
        : undefined;
    return {
      location: this.location,
      currentActivity:
        timetable === "activity"
          ? activitiesStore.getCurrentActivity(this.id)
          : timetable === "animation"
          ? moviesStore.getCurrentMovieBlock(this.id)
          : undefined,
      hasBookmark: !!bookmarksStore.getBookmark(
        "locations",
        this.location?._id
      ),
      timetable,
    };
  });
}

const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};

function getFoodcourtShift(index: number) {
  if (index < 4) {
    return {
      X: -2 + index / 4,
      Y: index / 4,
    };
  }
  if (index < 10) {
    return {
      X: -1 + (index - 4) / 3,
      Y: 1,
    };
  }
  return {
    X: 1 + (index - 10) / 4,
    Y: 1 - (index - 10) / 4,
  };
}
