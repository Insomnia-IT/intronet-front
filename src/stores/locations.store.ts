import { Fn, cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";
import { directionsStore } from "./directions.store";

class LocationsStore {

  @cell
  db = new ObservableDB<InsomniaLocation>("locations");

  IsLoaded = this.db.isLoaded;
  @cell
  Tags = new ObservableDB<Tag>("tags");

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
      (x) =>
        directionsStore.DirectionToDirection(x.directionId) ===
        Directions.screen
    );
  }

  @cell
  public get Infocenter(): InsomniaLocationFull {
    return this.FullLocations.find(
      (x) =>
        directionsStore.DirectionToDirection(x.directionId) === Directions.info
    );
  }

  async addLocation(location: InsomniaLocation) {
    await this.IsLoaded;
    await this.db.add(location);
  }

 async updateLocation(x: InsomniaLocationFull) {
    await this.IsLoaded;
    await this.db.update({
      ...x,
      // @ts-ignore
      tags: x.tags.map((t) => t._id),
    });
  }

  async deleteLocation(location: InsomniaLocationFull | InsomniaLocation) {
    await this.IsLoaded;
    await this.db.remove(location._id);
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
  info = 15,
  screen = 16,
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
