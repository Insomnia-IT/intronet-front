import {ObservableMap} from "cellx-collections";
import { Observable } from "cellx-decorators";
import {Location} from "../api/locations";

class LocationsStore {

  @Observable
  Locations = new ObservableMap<number, Location>();
}

export const locationsStore = new LocationsStore();
