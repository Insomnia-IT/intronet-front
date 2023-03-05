import { Fn, cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";
import {Directions, locationsStore} from "./locations.store";
// import data from "./movies.json";

class MoviesStore {
  @cell
  private db = new ObservableDB<MovieBlock>("movies");

  IsLoaded = this.db.isLoaded.then(() =>{
    if ([...this.db.keys()].length === 0){
      console.log('import movies from json')
      return this.getFromJSON();
    }
  })

  public get Movies(): MovieBlock[] {
    return this.db.toArray();
  }

  async getFromJSON(){
    // for (let i = 0; i < data.length; i++) {
    //   const dayInfo = data[i];
    //   const location = locationsStore.Locations.toArray().find(x => x.name === dayInfo.Screen);
    //   let locationId = '';
    //   if (!location){
    //     locationId = Fn.ulid();
    //     await locationsStore.addLocation({
    //       name: dayInfo.Screen,
    //       ...center,
    //       ...centerXY,
    //       directionId: 'screen',
    //       description: 'Экран',
    //       tags: [],
    //       _id: locationId,
    //       menu: undefined,
    //       image: ''
    //     });
    //   }else {
    //     locationId = location._id;
    //   }
    //   dayInfo.Screen
    //   const movies = dayInfo.Blocks.map(block => ({
    //       _id: Fn.ulid(),
    //       day: dayInfo.Day,
    //       info: {
    //         Title: block.Title,
    //         SubTitle: block.SubTitle,
    //         TitleEn: block.TitleEn,
    //         SubTitleEn: block.SubTitleEn,
    //         MinAge: block.MinAge,
    //         Part: block.Part,
    //         Start: block.Start,
    //         End: block.End,
    //       },
    //       movies: block.Movies.map(x => ({
    //         name: x.Name,
    //         author: x.Author,
    //         country: x.Country,
    //         year: x.Year,
    //         duration: x.Duration
    //       })),
    //       locationId: locationId
    //     }));
    //   await this.db.addRange(movies);
    // }
  }
}

export const moviesStore = new MoviesStore();

const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};
const centerXY = {
  x: 5512 / 2,
  y: 3892 / 2,
};
