import { Fn, cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";
import { directionsStore } from "./directions.store";
// import locationsJSON from "./locations.json";
import {mapStore} from "./map.store";

class LocationsStore {

  constructor() {
    this.Locations.isLoaded.then(() =>{
      if ([...this.Locations.keys()].length === 0){
        console.log('import locations from json')
        this.getFromJSON();
      }
    })
  }

  private async getFromJSON() {
    // const locations = locationsJSON.features.filter(x => x.geometry.type == 'Point').map((x,i) => {
    //   const geo = {
    //     lat: x.geometry.coordinates[1] as number,
    //     lon: x.geometry.coordinates[0] as number,
    //   };
    //   const point = mapStore.Map2GeoConverter.fromGeo(geo);
    //   return ({
    //     _id: Fn.ulid(),
    //     tags: [],
    //     directionId: '',
    //     name: x.properties.Name,
    //     image: "camping",
    //     description: x.properties.description,
    //     ...geo,
    //     x: point.X,
    //     y: point.Y
    //   } as InsomniaLocation);
    // });
    // this.Locations.addRange(locations);
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
    this.Locations.add(location);
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
