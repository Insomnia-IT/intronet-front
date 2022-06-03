import { Computed, Observable } from "cellx-decorators";
import { locationsApi } from "../api";
import { ObservableDB } from "./observableDB";

class LocationsStore {
  private api = locationsApi;

  constructor() {
    this.Tags.on("change", (event) => {
      if (event.data.source == "server") return;
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
      if (event.data.source == "server") return;
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
      if (this.Locations.toArray().length == 0) {
        const locations: InsomniaLocation[] = [
          {
            lat: 54.68255965779291,
            lng: 35.07497888587355,
            x: 1078.8210261252755,
            y: 406.92241107963486,
            description: "",
            name: "родник",
            tags: [],
            image: "",
            id: 3,
          },
          {
            lat: 54.68128095334499,
            lng: 35.08512875824405,
            x: 752.1208687440983,
            y: 323.7888888888889,
            name: "Палаточный лагерь",
            description: "",
            tags: [],
            image: "camping",
            id: 2,
          },
          {
            lat: 54.67735017337062,
            lng: 35.08774915484466,
            x: 352.1208687440983,
            y: 323.7888888888889,
            name: "Экран «Орёл»",
            description: "",
            tags: [],
            image: "cinema",
            id: 1,
          },
        ];
        // @ts-ignore
        this.Locations.addRange(locations);
      }
      this.update();
    });
  }

  private async update() {
    const [tags, locations] = await Promise.all([
      this.api.getTags().catch(() => []),
      this.api.getLocations().catch(() => []),
    ]);
    this.Tags.merge(tags, "local");
    this.Locations.merge(locations, "local");
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
