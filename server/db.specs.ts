import { test } from "@jest/globals";
import locationsJSON from "./locations.json";
import { getRandomItem } from "@helpers/getRandomItem";
import { Fn } from "@cmmn/cell/lib";
import moviesJSON from "./movies.json";
import { Database } from "./database";
import { TileConverter } from "@helpers/tile.converter";

process.env.DATABASE =
  "https://admin:password@intro.cherepusick.keenetic.name/db";
const converter = new TileConverter(
  {
    x: 78306,
    y: 41656,
  },
  17,
  256
);

test("import-locations", async () => {
  const db = new Database<InsomniaLocation>("locations");
  const existed = await db.getSince();
  console.log(existed);
  if (existed.length != 0) {
    return;
  }
  const data = locationsJSON.features
    .filter((x) => x.geometry.type == "Point")
    .map((x, i) => {
      const geo = {
        lat: x.geometry.coordinates[1] as number,
        lon: x.geometry.coordinates[0] as number,
      };
      const point = converter.fromGeo(geo);
      return {
        _id: Fn.ulid(),
        tags: [],
        directionId: getRandomItem(directionIds),
        name: x.properties.Name,
        image: "camping",
        description: x.properties.description,
        ...geo,
        x: point.X,
        y: point.Y,
      } as InsomniaLocation;
    });
  for (let loc of data) {
    await db.addOrUpdate({ ...loc, version: Fn.ulid() });
  }
}, 60000);

test("import-movies", async () => {
  const locationsDb = new Database<InsomniaLocation>("locations");
  const locations = await locationsDb.getSince();
  if (locations.length == 0) return;
  const moviesDB = new Database<MovieBlock>("movies");
  const movies = await moviesDB.getSince();
  console.log(movies);
  if (movies.length != 0) {
    return;
  }
  const blocks = Array.from(
    moviesJSON
      .flatMap((x) =>
        x.Blocks.map((b) => ({
          block: b,
          day: x.Day,
          locationId: locations.find((y) => y.name == x.Screen)._id,
        }))
      )
      .groupBy((x) => `${x.block.Title}.${x.block.SubTitle}.${x.block.Part}`)
      .entries()
  ).map(
    ([key, blocks]) =>
      ({
        _id: Fn.ulid(),
        views: blocks.map((x) => ({
          day: x.day,
          start: x.block.Start,
          end: x.block.End,
          locationId: x.locationId,
        })),
        info: {
          Title: blocks[0].block.Title,
          SubTitle: blocks[0].block.SubTitle,
          TitleEn: blocks[0].block.TitleEn,
          SubTitleEn: blocks[0].block.SubTitleEn,
          MinAge: blocks[0].block.MinAge,
          Part: blocks[0].block.Part,
        },
        movies: blocks[0].block.Movies.map((x) => ({
          name: x.Name,
          description: "",
          author: x.Author,
          country: x.Country,
          year: x.Year,
          duration: x.Duration,
          id: Fn.ulid(),
        })),
      } as MovieBlock)
  );
  for (let movie of blocks) {
    await moviesDB.addOrUpdate({
      ...movie,
      version: Fn.ulid(),
    });
  }
}, 60000);

const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};
const centerXY = {
  x: 5512 / 2,
  y: 3892 / 2,
};

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
const directionIds = Object.keys(Directions).filter((x) => Number.isNaN(+x));
