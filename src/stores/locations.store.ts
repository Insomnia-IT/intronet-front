import {Computed, Observable} from "cellx-decorators";
import {Location, Tag} from "../api/locations";
import {locationsApi} from "../api";
import {ObservableDB} from "./observableDB";

class LocationsStore {

  private api = locationsApi;

  constructor() {
    this.Tags.on('change', event => {
      if (event.data.source == 'server')
        return;
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
    this.Locations.on('change', event => {
      if (event.data.source == 'server')
        return;
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
    Promise.all([
      this.Tags.isLoaded,
      this.Locations.isLoaded
    ]).then(() => {
      setTimeout(() => this.update(), 60_000);
      this.update()
    });

  }

  private async update() {
    const [tags, locations] = await Promise.all([
      this.api.getTags(),
      this.api.getLocations()
    ]);
    this.Tags.merge(tags, "local");
    this.Locations.merge(locations, "local");
  }

  @Observable
  Locations = new ObservableDB<Location>("locations");

  @Observable
  Tags = new ObservableDB<Tag>("tags");

  @Computed
  public get FullLocations(): ReadonlyArray<LocationFull>{
    return this.Locations.toArray()
      .map(x => ({
        ...x,
        tags: x.tags.map(id => this.Tags.get(id))
      }));
  }

  updateLocation(x: LocationFull) {
    this.Locations.update({
      ...x,
      tags: x.tags.map(t => t.id)
    });
  }
}

export const locationsStore = new LocationsStore();

export type LocationFull = Omit<Location, "tags"> & {
  tags: Tag[]
}
