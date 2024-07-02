import "@cmmn/cell";
import { Fn, groupBy } from "@cmmn/core";
import * as console from "console";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import moviesXLS from "./movies.json" assert { "type": "json" };
import { ArrayElement } from "mongodb";
// import moviesAPI from "./movies_api.json" assert { "type": "json" };

export async function importMovies(force = false) {
  const locationDB = Database.Get<any>("locations");
  const locations = (await locationDB.getSince()).filter((x) => !x.deleted);
  if (locations.length == 0) return;
  const moviesDB = Database.Get<any>("movies");
  const movies = await moviesDB.getSince();
  // console.log(movies);
  if (movies.length != 0) {
    if (!force) return;
    for (let movie of movies) {
      await moviesDB.remove(movie._id);
    }
  }
  // const moviesJSON: Schedule = await fetch('https://insomniafest.ru/export/schedule').then(x => x.json()).catch(() => null);
  // fs.writeFileSync('./server/data/movies_api.json', JSON.stringify(moviesJSON), 'utf8');
  // if (!moviesJSON){
  //   console.error('cannot load');
  //   return;
  // }
  const screenNameMap = {
    "Полевой Экран (ЦУЭ 1)": locations
      .filter((x) => x.directionId == "Экран")
      .find((x) => x.name?.toLowerCase().includes("полевой"))?._id,
    "Полевой экран": locations
      .filter((x) => x.directionId == "Экран")
      .find((x) => x.name?.toLowerCase().includes("полевой"))?._id,
    "Речной Экран (ЦУЭ 2)": locations
      .filter((x) => x.directionId == "Экран")
      .find((x) => x.name?.toLowerCase().includes("речной"))?._id,
    "Речной экран": locations
      .filter((x) => x.directionId == "Экран")
      .find((x) => x.name?.toLowerCase().includes("речной"))?._id,
    "Детский экран": locations
      .filter((x) => x.directionId == "Экран")
      .find((x) => x.name?.toLowerCase().includes("детский"))?._id,
  };
  const blocksXls = moviesXLS
    .flatMap((x) =>
      x.Blocks.map((b) => ({
        block: b,
        day: x.Day,
        locationId: screenNameMap[x.Screen],
        start: b.Start,
        end: b.End,
      }))
    )
    .filter((x) => x)
    .map((b) => ({
      view: {
        locationId: b.locationId,
        day: b.day,
        start: b.start,
        end: b.end,
      },
      info: {
        Title: b.block.Title,
        SubTitle: b.block.SubTitle,
        TitleEn: b.block.TitleEn,
        SubTitleEn: b.block.SubTitleEn,
        MinAge: b.block.MinAge,
        Part: b.block.Part,
      },
      movies: b.block.Movies.map((xls) => ({
        id: Fn.ulid(),
        name: xls.Name,
        author: xls.Author,
        country: xls.Country,
        year: xls.Year,
        duration: xls.Duration,
      })),
    }));
  console.log(blocksXls[0]);
  // const array = moviesAPI.flatMap((x) =>
  //   x.screenPrograms.map((b) => ({
  //     block: b,
  //     day: getDay(toMoscow(b.programStart * 1000)),
  //     start: getTime(toMoscow(b.programStart * 1000)),
  //     end: getTime(toMoscow(b.programEnd * 1000)),
  //     locationId: screenNameMap[x.screenName],
  //     programStart: b.programStart,
  //   }))
  // );
  // const blocks = Array.from(
  //   groupBy(array, (x) => `${x.block.programTitle}`).values()
  // ) as Array<typeof array>;
  // writeFileSync('./movies_api.json', JSON.stringify(moviesJSON), 'utf-8')
  const blocksMap = groupBy(blocksXls, (b: ArrayElement<typeof blocksXls>) =>
    [b.info.Title, b.info.SubTitle, b.info.Part].join(".")
  ) as Map<string, ArrayElement<typeof blocksXls>[]>;
  const results = Array.from(blocksMap.values()).map((x) => ({
    _id: Fn.ulid(),
    views: x.map((b) => b.view),
    info: x[0].info,
    movies: x[0].movies,
  }));
  //
  for (let movie of results) {
    await moviesDB.addOrUpdate({
      ...movie,
      version: Fn.ulid(),
    });
  }
  dbCtrl.versions = undefined;
}

export type Schedule = Screen[];

export interface Screen {
  screenName: string;
  screenPrograms: ScreenProgram[];
}

export interface ScreenProgram {
  programTitle: string;
  programAge: string;
  programStart: number;
  programEnd: number;
  programFilms: ProgramFilm[];
}

export interface ProgramFilm {
  title: string;
  plot: string | null;
  image: string | null;
  vurchelID: number | null;
}

export function getDay(local: number): number {
  const day = (new Date(local - 12 * 60 * 60 * 1000).getDay() + 3) % 7; // четверг = 0
  if (day > 4) return 0;
  return day;
}

export function getTime(local: number): string {
  const date = new Date(local);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${hour < 10 ? "0" + hour : hour}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function toMoscow(unix: number): number {
  return unix + (new Date(unix).getTimezoneOffset() + 3 * 60) * 60000;
}

const regexOnlyWord = /[^a-zA-Zа-яА-ЯёЁ]/g;
const escape = (text) =>
  text
    .trim()
    .replace(/\s/g, "")
    .replace(regexOnlyWord, "")
    .replace(/ё/g, "е")
    .toLowerCase();
