import {cell, ObservableList, Cell, Fn} from "@cmmn/cell/lib";
import {geoConverter} from "@helpers/geo";
import {TransformMatrix} from "../pages/map/transform/transform.matrix";
import {goTo, RoutePath, routerCell} from "../pages/routing";
import {activitiesStore} from "./activities";
import {shopsStore} from "./articles.store";
import {changesStore} from "./changes.store";
import {moviesStore} from "./movies.store";
import {ObservableDB} from "./observableDB";
import {bookmarksStore} from "@stores/bookmarks.store";


class LocationsStore {
  @cell db = new ObservableDB<InsomniaLocation>("locations");

  Loading = this.db.isLoaded;
  @cell public isEdit = false;
  @cell public isMoving = false;
  @cell public newLocation: InsomniaLocation;

  @cell
  public get selected(): InsomniaLocation[] {
    const router = routerCell.get();
    if (router.query.direction)
      return this.findByDirection(decodeURIComponent(router.query.direction));
    if (router.query.name)
      return [this.findByName(decodeURIComponent(router.query.name))].filter(x => x);
    return [this.Locations.find((x) => x._id === router.route[1])].filter(x => x);
  }

  findByName(s: string) {
    return this.Locations.find(x => x.name?.toLowerCase().includes(s));
  }
  findByDirection(s: string) {
    return this.Locations.filter(x => x.directionId?.toLowerCase().includes(s));
  }
  public setSelectedId(id: string | null) {
    goTo(["map", id].filter((x) => x) as RoutePath, {}, true);
  }


  @cell
  public get Locations(): ReadonlyArray<InsomniaLocation> {
    return this.db.toArray()
      .filter(x => x.figure)
      .concat(this.newLocation ? [this.newLocation] : [])
      .map((x) => changesStore.withChanges(x, x._id))
  }

  @cell
  public get ScreenLocations(): ReadonlyArray<InsomniaLocation> {
    return this.Locations.filter((x) => x.directionId === Directions.screen);
  }

  @cell
  public get ActivityLocations(): ReadonlyArray<InsomniaLocation> {
    return this.Locations.filter((x) => x.work_tags?.includes('activity'));
  }

  @cell
  public get Infocenter(): InsomniaLocation {
    return this.Locations.find((x) => x.directionId === Directions.info);
  }
  @cell
  public get Shops(): InsomniaLocation {
    return this.Locations.find((x) => x.name.toLowerCase() === 'ярмарка');
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
    return this.Locations.orderBy((x) => Array.isArray(x.figure) ? -1 : 1).map((x) => ({
      figure: patches.get(x._id) ?? geoConverter.fromGeo(x.figure as Geo),
      directionId: x.directionId,
      title: x.name,
      id: x._id,
      radius: 10,
      // maxZoom: x._id == this.Shops._id ? 1.6 : undefined
    } as MapItem))
      // .concat(this.VirtualShops);
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
    if (this.selected.some(x => x._id === location._id)) this.setSelectedId(null)
    await this.Loading;
    await this.db.remove(location._id);
  }

  public getName(locationId: string) {
    const location = this.db.get(locationId);
    if (!location) return undefined;
    return location.name;
  }


  @cell private locationPatches = new ObservableList<[id: string, figure: Figure]>();

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
        ...this.db.get(id), figure: geoConverter.toGeo(figure),
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
      name: 'Новая локация',
      directionId: Directions.wc,
      contentBlocks: []
    } as InsomniaLocation;
    this.setSelectedId(this.newLocation._id);
    this.isMoving = true;
    this.isEdit = true;
  }
}

export const locationsStore = new LocationsStore();

export enum Directions {
  medical = "Медпункт (Медицинская Служба)",
  kpp = "КПП",
  bath = "Баня",
  tochka = "Точка Сборки (Место Встречи И Помощь В Поиске Потерянных Люде",
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
  shower = "Души",
  music = "Музыкальная Сцена",
  theater = "Театральная Сцена",
  guest = "Гостевые Кемпинги",
  screen = "Экран",
  info = "Инфоцентр",
}

export class LocationStore {
  constructor(private id: string) {
  }

  @cell get location() {
    return locationsStore.Locations.find((location) => location._id === this.id);
  }

  public state = new Cell<{
    location: InsomniaLocation;
    currentActivity: string | undefined;
    hasBookmark: boolean;
    timetable: 'animation' | 'activity' | undefined;
  }>(() => {
    const timetable = this.location?.directionId === Directions.screen ? 'animation' : activitiesStore.Activities.some(x => x.locationId === this.id) ? 'activity' : undefined;
    return ({
      location: this.location,
      currentActivity: timetable === 'activity' ? activitiesStore.Activities.filter(x => x.locationId === this.id)[0]?.title : timetable === 'animation' ? moviesStore.getCurrentMovieBlock(this.id) : undefined,
      hasBookmark: !!bookmarksStore.getBookmark('locations', this.location?._id),
      timetable
    });
  });

}

const center = {
  lat: 54.68008397222222, lon: 35.08622484722222,
};
