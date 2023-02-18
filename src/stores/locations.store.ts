import { cell } from "@cmmn/cell/lib";
import { locationsApi } from "../api";
import { ObservableDB } from "./observableDB";
import { Directions } from "../api/directions";
import { directionsStore } from "./directions.store";

class LocationsStore {
  private api = locationsApi;

  @cell
  Locations = new ObservableDB<InsomniaLocation>("locations");

  @cell
  Tags = new ObservableDB<Tag>("tags");

  @cell
  public get FullLocations(): ReadonlyArray<InsomniaLocationFull> {
    return this.Locations.toArray().map((x) => ({
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
    const created = await this.api.addLocation(location);
    this.Locations.add(created, "server");
  }

  updateLocation(x: InsomniaLocationFull) {
    this.Locations.update({
      ...x,
      // @ts-ignore
      tags: x.tags.map((t) => t._id),
    });
  }

  deleteLocation(location: InsomniaLocationFull | InsomniaLocation) {
    this.Locations.remove(location._id);
  }
}

export const locationsStore = new LocationsStore();
