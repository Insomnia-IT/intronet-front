import { cell, ObservableList, Cell } from "@cmmn/cell/lib";
import {geoConverter} from "@helpers/geo";
import { TransformMatrix } from "../pages/map/transform/transform.matrix";
import {goTo, RoutePath, routerCell} from "../pages/routing";
import {changesStore} from "./changes.store";
import { ObservableDB } from "./observableDB";
import { bookmarksStore } from "@stores/bookmarks.store";


class LocationsStore {
  @cell
  db = new ObservableDB<InsomniaLocation>("locations");

  Loading = this.db.isLoaded;
  @cell
  public isEdit = false;
  @cell
  public isMoving = false;

  @cell
  public get selected(): InsomniaLocation{
    const router = routerCell.get();
    const location =
      this.findByName(decodeURIComponent(router.query.name)) ??
      this.Locations.find((x) => x._id === router.route[1]);
    return location;
  }
  public setSelectedId(id: string | null) {
    goTo(["map", id].filter((x) => x) as RoutePath, {}, true);
  }


  @cell
  public get Locations(): ReadonlyArray<InsomniaLocation> {
    return this.db.toArray().map((x) => changesStore.withChanges(x, x._id));
  }

  @cell
  public get ScreenLocations(): ReadonlyArray<InsomniaLocation> {
    return this.Locations.filter(
      (x) => x.directionId === Directions.screen
    );
  }

  @cell
  public get Infocenter(): InsomniaLocation {
    return this.Locations.find((x) => x.directionId === Directions.info);
  }

  public get MapItems(): MapItem[] {
    const patches = new Map(this.locationPatches.toArray());
    return this.Locations.orderBy((x) =>
      Array.isArray(x.figure) ? -1 : 1
    ).map((x) => ({
      figure:
        patches.get(x._id) ??
        geoConverter.fromGeo(x.figure as Geo),
      directionId: x.directionId,
      title: x.name,
      id: x._id,
      radius: 10,
    }));
  }

  async addLocation(location: InsomniaLocation) {
    await this.Loading;
    await this.db.addOrUpdate(location);
  }

  async updateLocation(x: InsomniaLocation) {
    await this.Loading;
    await this.db.addOrUpdate(x);
  }

  async deleteLocation(location: InsomniaLocation | InsomniaLocation) {
    await this.Loading;
    await this.db.remove(location._id);
  }

  public getName(locationId: string) {
    const location = this.db.get(locationId);
    if (!location) return undefined;
    return location.name;
  }


  @cell
  private locationPatches = new ObservableList<[ id: string, figure: Figure ]>();

  public moveSelectedLocation(transform: TransformMatrix) {
    const selected = this.MapItems.find((x) => x.id === this.selected._id);
    const moved = Array.isArray(selected.figure)
      ? selected.figure.map((line) => line.map(transform.Invoke))
      : transform.Invoke(selected.figure);
    this.locationPatches.push([ selected.id, moved ]);
  }

  async applyChanges() {
    const patches = new Map(this.locationPatches.toArray());
    this.locationPatches.clear();
    for (let [ id, figure ] of patches) {
      await this.db.addOrUpdate({
        ...this.db.get(id),
        figure: geoConverter.toGeo(figure) as GeoFigure,
      });
    }
    this.isMoving = false;
  }

  findByName(s: string) {
    return this.Locations.find(x => x.name === s);
  }

  discardChanges() {
    this.locationPatches.clear();
  }
}

export const locationsStore = new LocationsStore();

export enum Directions {
  fair = 2,
  lectures = 4,
  masterClass = 6,
  playground = 8,
  artObject = 10,
  meeting = 11,
  cafe = 12,
  tentRent = 13,
  info = "Инфоцентр",
  screen = "Экран",
  music = 20,
  staffCamp = 21,
  checkpoint = 22,
  camping = 81,
  bath = 83,
  wc = 85,
  fire = 86,
  bathhouse = 90,
  lab = 95,
}

export class LocationStore {
  constructor(private id: string) {
  }

  @cell
  get location() {
    return locationsStore.db.toArray().find((location) => location._id === this.id);
  }

  public state = new Cell<{
    location: InsomniaLocation;
    hasBookmark: boolean;
  }>(() => ({
    location: this.location,
    hasBookmark: !!bookmarksStore.getBookmark('locations', this.location?._id),
  }));

}
