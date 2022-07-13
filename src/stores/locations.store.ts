import { Computed, Observable } from "cellx-decorators";
import { locationsApi } from "../api";
import { ObservableDB } from "./observableDB";

export enum Directions {
  camping = 1,
  screen = 2,
  bath = 3,
  cafe = 4,
  wc = 5,
  fire = 6,
  staffCamp = 7,
  lectures = 8,
  info = 9,
  bathhouse = 10,
  meeting = 11,
  tentRent = 12,
  scene = 13,
  playground = 14,
  lab = 15,
  fair = 17,
  checkpoint = 18,
  artObject = 19,
  washing = 20,
  animation = 21,
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
      (x) => x.directionId === Directions.staffCamp
    );
  }

  @Computed
  public get Infocenter(): InsomniaLocationFull {
    return this.FullLocations.find((x) => x.directionId === Directions.info);
  }

  async addLocation(location: InsomniaLocation) {
    location.id = await this.api.addLocation(location);
    console.log(location.id);
    this.Locations.add(location, "server");
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
