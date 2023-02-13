import { cell } from "@cmmn/cell/lib";
import { locationsApi } from "../api";
import { ObservableDB } from "./observableDB";
import { Directions } from "../api/directions";
import { directionsStore } from "./directions.store";

class LocationsStore {
  private api = locationsApi;

  constructor() {
    this.Tags.on("change", (event) => {
      if (event.source === "server") return;
      switch (event.type) {
        case "add":
          this.api.addTag(event.value.name);
          break;
        case "update":
          this.api.updateTag(event.value);
          break;
        case "delete":
          this.api.deleteTag(event.key as number);
          break;
      }
    });
    this.Locations.on("change", (event) => {
      if (event.source === "server") return;
      switch (event.type) {
        case "add":
          this.api.addLocation(event.value);
          break;
        case "update":
          this.api.updateLocation(event.value);
          break;
        case "delete":
          this.api.deleteLocation(event.key as number);
          break;
      }
    });
    Promise.all([this.Tags.isLoaded, this.Locations.isLoaded]).then(() => {
      setTimeout(() => this.update(), 60_000);
      this.update();
    });
  }

  private async update() {
    this.api
      .getTags()
      .then((tags) => this.Tags.merge(tags, "server"))
      .catch((err) => console.warn("Синхронизация Tags не удалась"));
    this.api
      .getLocations()
      .then((locations) => this.Locations.merge(locations, "server"))
      .catch((err) => console.warn("Синхронизация Locations не удалась"));
  }

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
      tags: x.tags.map((t) => t.id),
    });
  }

  deleteLocation(location: InsomniaLocationFull | InsomniaLocation) {
    this.Locations.remove(location.id);
  }
}

export const locationsStore = new LocationsStore();
