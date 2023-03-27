import {test} from "@jest/globals";
import {Directions, locationsStore} from "@stores/locations.store";
import locationsJSON from "./locations.json";
import {mapStore} from "@stores/map.store";
import {getRandomItem} from "@helpers/getRandomItem";
import { Fn } from "@cmmn/cell/lib";
import {moviesStore} from "@stores/movies.store";
import moviesJSON from "./movies.json";

const directionIds = Object.keys(Directions).filter(x => Number.isNaN(+x));

test('import-locations', async ()=> {
  await locationsStore.IsLoaded;
  const locations = locationsStore.db.toArray();
  if (locations.length == 0){
    const data = locationsJSON.features.filter(x => x.geometry.type == 'Point').map((x,i) => {
        const geo = {
          lat: x.geometry.coordinates[1] as number,
          lon: x.geometry.coordinates[0] as number,
        };
        const point = mapStore.Map2GeoConverter.fromGeo(geo);
        return ({
          _id: Fn.ulid(),
          tags: [],
          directionId: getRandomItem(directionIds),
          name: x.properties.Name,
          image: "camping",
          description: x.properties.description,
          ...geo,
          x: point.X,
          y: point.Y
        } as InsomniaLocation);
      });
      await locationsStore.db.addRange(data);
      await locationsStore.db.syncQueue.Invoke(() => {})
  }
}, 20000);


test('import-movies', async ()=> {
  await moviesStore.IsLoaded;
  const movies = moviesStore.Movies;
  console.log(movies)
  if (movies.length == 0){
    for (let i = 0; i < moviesJSON.length; i++) {
      const dayInfo = moviesJSON[i];
      const location = locationsStore.db.toArray().find(x => x.name === dayInfo.Screen);
      let locationId = '';
      if (!location){
        locationId = Fn.ulid();
        await locationsStore.addLocation({
          name: dayInfo.Screen,
          ...center,
          ...centerXY,
          directionId: 'screen',
          description: 'Экран',
          tags: [],
          _id: locationId,
          menu: undefined,
          image: ''
        });
      }else {
        locationId = location._id;
      }
      dayInfo.Screen
      const movies = dayInfo.Blocks.map(block => ({
          _id: Fn.ulid(),
          day: dayInfo.Day,
          info: {
            Title: block.Title,
            SubTitle: block.SubTitle,
            TitleEn: block.TitleEn,
            SubTitleEn: block.SubTitleEn,
            MinAge: block.MinAge,
            Part: block.Part,
            Start: block.Start,
            End: block.End,
          },
          movies: block.Movies.map(x => ({
            name: x.Name,
            author: x.Author,
            country: x.Country,
            year: x.Year,
            duration: x.Duration
          })),
          locationId: locationId
        }));
      await moviesStore.db.addRange(movies);
    }
    await moviesStore.db.syncQueue.Invoke(() => {})
    await locationsStore.db.syncQueue.Invoke(() => {})
  }
}, 20000);


const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};
const centerXY = {
  x: 5512 / 2,
  y: 3892 / 2,
};