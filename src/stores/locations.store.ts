import { Computed, Observable } from "cellx-decorators";
import { locationsApi } from "../api";
import { ObservableDB } from "./observableDB";

export enum Directions {
  screen = 1,
  bath = 2,
  cafe = 3,
  wc = 4,
  fire = 5,
  staffCamp = 6,
  lectures = 7,
  bathhouse = 8,
  meeting = 9,
  tentRent = 10,
  scene = 11,
  playground = 12,
  lab = 13,
  info = 14,
  fair = 15,
  checkpoint = 16,
  artObject = 17,
  camping = 18,
}

class LocationsStore {
  private api = locationsApi;

  constructor() {
    this.Tags.on("change", (event) => {
      if (event.data.source === "server") return;
      switch (event.data.type) {
        case "add":
          this.api.addTag(event.data.value.name);
          break;
        case "update":
          this.api.updateTag(event.data.value);
          break;
        case "delete":
          this.api.deleteTag(event.data.key);
          break;
      }
    });
    this.Locations.on("change", (event) => {
      if (event.data.source === "server") return;
      switch (event.data.type) {
        case "add":
          this.api.addLocation(event.data.value);
          break;
        case "update":
          this.api.updateLocation(event.data.value);
          break;
        case "delete":
          this.api.deleteLocation(event.data.key);
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

  @Observable
  Locations = new ObservableDB<InsomniaLocation>("locations");

  @Observable
  Tags = new ObservableDB<Tag>("tags");

  @Computed
  public get FullLocations(): ReadonlyArray<InsomniaLocationFull> {
    return this.Locations.toArray().map((x) => ({
      ...x,
      // @ts-ignore
      tags: x.tags.map((id) => this.Tags.get(id)),
    }));
  }

  @Computed
  public get ScreenLocations(): ReadonlyArray<InsomniaLocationFull> {
    return this.FullLocations.filter(
      (x) => x.directionId === Directions.screen
    );
  }

  addLocation(location: InsomniaLocationFull) {
    this.Locations.add({
      ...location,
      id: Math.max(0, ...this.Locations.toArray().map((x) => x.id)) + 1,
      tags: location.tags.map((x) => x.id),
    });
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
