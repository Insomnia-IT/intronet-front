import { Fn, cell, ObservableList } from "@cmmn/cell/lib";
import { TransformMatrix } from "../pages/map/transform/transform.matrix";
import { mapStore } from "./map.store";
import { ObservableDB } from "./observableDB";
import { directionsStore } from "./directions.store";

class LocationsStore {
  @cell
  db = new ObservableDB<InsomniaLocation>("locations");

  Loading = this.db.isLoaded;
  @cell
  Tags = new ObservableDB<Tag>("tags");

  @cell
  private locationPatches = new ObservableList<[id: string, figure: Figure]>();

  @cell
  public get FullLocations(): ReadonlyArray<InsomniaLocationFull> {
    return this.db.toArray().map((x) => ({
      ...x,
      // @ts-ignore
      tags: x.tags.map((id) => this.Tags.get(id)),
    }));
  }

  @cell
  public get ScreenLocations(): ReadonlyArray<InsomniaLocationFull> {
    return this.FullLocations.filter(
      (x) => x.directionId === Directions.screen
    );
  }

  @cell
  public get Infocenter(): InsomniaLocationFull {
    return this.FullLocations.find(
      (x) =>
        directionsStore.DirectionToDirection(x.directionId) === Directions.info
    );
  }

  public get MapItems(): MapItem[] {
    const patches = new Map(this.locationPatches.toArray());
    return this.FullLocations.orderBy((x) =>
      Array.isArray(x.figure) ? -1 : 1
    ).map((x) => ({
      figure:
        patches.get(x._id) ??
        mapStore.Map2GeoConverter.fromGeo(x.figure as Geo),
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

  async updateLocation(x: InsomniaLocationFull) {
    await this.Loading;
    await this.db.addOrUpdate({
      ...x,
      // @ts-ignore
      tags: x.tags.map((t) => t._id),
    });
  }

  async deleteLocation(location: InsomniaLocationFull | InsomniaLocation) {
    await this.Loading;
    await this.db.remove(location._id);
  }

  public getName(locationId: string) {
    const location = this.db.get(locationId);
    if (!location) return undefined;
    return location.name;
  }

  public moveLocation(id: string, transform: TransformMatrix) {
    const selected = this.MapItems.find((x) => x.id === id);
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
        figure: mapStore.Map2GeoConverter.toGeo(figure) as GeoFigure,
      });
    }
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
