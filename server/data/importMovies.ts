import "@cmmn/cell";
import { Fn, groupBy } from "@cmmn/core";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import { ArrayElement } from "mongodb";
import events from "./events.json" assert { "type": "json" };

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
  const screenRegexes = [/полевой/i, /речной/i, /детский/i];
  function getLocationId(screenName: string) {
    if (!screenName) return null;
    const regex = screenRegexes.find((x) => x.test(screenName));
    if (!regex) return null;
    return locations
      .filter((x) => x.directionId == "Экран")
      .find((x) => x.name?.match(regex))?._id;
  }
  function splitTitle(title: string) {
    title = title.replace("&amp;", "&");
    const result = {
      Title: title,
      SubTitle: null,
      TitleEn: null,
      SubTitleEn: null,
      Part: 0,
    };
    const partPosition = title.indexOf("Часть");
    if (partPosition == -1) {
      return result;
    }
    result.Title = title.substring(0, partPosition - 2);
    result.Part = +title.substring(partPosition + 6, partPosition + 7);
    const rest = title
      .substring(partPosition + 8)
      .trim()
      .replace(/^\(/, "")
      .replace(/\)$/, "");
    if (rest.match(/[а-яА-Я]/)) {
      result.SubTitle = rest;
    } else {
      result.TitleEn = rest.replace(/\.?\s?Part \d\.?$/i, "");
    }
    return result;
  }
  const blocksXls = events.screens
    .flatMap((x) =>
      x.screenPrograms.map((b) => ({
        block: b,
        locationId: getLocationId(x.screenName),
        start: getTime(b.programStart * 1000),
        end: getTime(b.programEnd * 1000),
        day: getDay(b.programStart * 1000),
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
        ...splitTitle(b.block.programTitle),
        MinAge: b.block.programAge,
      },
      movies: b.block.programFilms.map((x) => ({
        id: Fn.ulid(),
        name: x.title,
        image: x.image,
        plot: x.plot,
        vurchelId: x.vurchelID,
      })),
    }));

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
  const date = new Date(toMoscow(local));
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
